import { afterEach, describe, expect, it } from 'bun:test'
import { buildEnsemble } from './build'
import { registerFeature, unregisterFeature } from '../format/registry'
import type { SceneElement } from '../format/registry'
import type { Ensemble } from '../format/types'

/*
  A scene stub. `build.ts` deliberately imports no engine — the mesh placer is
  injected — so the ORDERING and TEARDOWN contract, which is where the real bugs
  live, is testable without a browser or Babylon.
*/
const fakeScene = () => ({ appendChild: () => {}, remove: () => {} }) as unknown as SceneElement

/*
  Features are stated EXPLICITLY here rather than via roles, because the format
  ships no roles — a role is a domain vocabulary and these tests describe the
  format, which has no domain.
*/
const two: Ensemble = {
  name: 'pair',
  pieces: [
    { id: 'reactor', mesh: 'R', at: [0, 0, 0], features: { destroyable: { hp: 16 } } },
    { id: 'field', mesh: 'F', at: [0, 10, 0], features: { protector: { source: 'reactor' } } },
  ],
  links: [{ from: 'reactor', to: 'field' }],
}

const registered: string[] = []
const register = (...args: Parameters<typeof registerFeature>) => {
  registered.push(args[0].name)
  registerFeature(...args)
}
afterEach(() => {
  while (registered.length) unregisterFeature(registered.pop()!)
})

describe('buildEnsemble', () => {
  it('binds every piece before any link runs', () => {
    const order: string[] = []
    register({
      name: 'protector',
      schema: {},
      bind: (piece) => {
        order.push(`bind:${piece.id}`)
        return piece.id
      },
      link: (handle) => order.push(`link:${handle}`),
    })
    register({
      name: 'destroyable',
      schema: {},
      bind: (piece) => {
        order.push(`bind:${piece.id}`)
        return piece.id
      },
      link: (handle) => order.push(`link:${handle}`),
    })

    buildEnsemble(two, { scene: fakeScene() })

    // Every bind, then every link — never interleaved. A link that ran during
    // the bind phase would resolve against a half-built world, and would do it
    // differently depending on the order pieces appear in the file.
    const firstLink = order.findIndex((s) => s.startsWith('link:'))
    expect(order.slice(0, firstLink).every((s) => s.startsWith('bind:'))).toBe(true)
    expect(order.slice(firstLink).every((s) => s.startsWith('link:'))).toBe(true)
  })

  it('resolves a neighbour in link regardless of file order', () => {
    let seen: unknown = 'not run'
    register({
      name: 'protector',
      schema: {},
      bind: () => ({}),
      link: (_h, ctx) => {
        seen = ctx.handle('reactor')
      },
    })
    // 'field' is declared FIRST here — the case that breaks a one-phase bind.
    const reversed: Ensemble = { ...two, pieces: [two.pieces[1]!, two.pieces[0]!] }
    const built = buildEnsemble(reversed, {
      scene: fakeScene(),
      placePiece: (piece) => ({ node: { id: piece.id } }),
    })
    expect(built.pieces.size).toBe(2)
    expect(seen).toEqual({ id: 'reactor' } as never)
  })

  it('disposes in reverse order and is safe to call twice', () => {
    const torn: string[] = []
    register({
      name: 'destroyable',
      schema: {},
      bind: (piece, _cfg, ctx) => {
        ctx.onDispose(() => torn.push(piece.id))
        return null
      },
    })
    const built = buildEnsemble(two, { scene: fakeScene() })
    built.dispose()
    built.dispose()
    expect(torn).toEqual(['reactor'])
    expect(built.pieces.size).toBe(0)
  })

  it('build → dispose → build leaves nothing behind', () => {
    let live = 0
    register({
      name: 'destroyable',
      schema: {},
      bind: (_piece, _cfg, ctx) => {
        live++
        ctx.onDispose(() => live--)
        return null
      },
    })
    for (let i = 0; i < 3; i++) {
      const built = buildEnsemble(two, { scene: fakeScene() })
      expect(live).toBe(1)
      built.dispose()
      expect(live).toBe(0)
    }
  })

  it('scales and offsets a piece into world space', () => {
    const placed: Array<[string, number[]]> = []
    buildEnsemble(
      { name: 's', scale: 2, pieces: [{ id: 'a', mesh: 'X', at: [1, 2, 3], scale: 3 }] },
      {
        scene: fakeScene(),
        origin: [100, 0, 0],
        placePiece: (piece, at, scale) => {
          placed.push([piece.id, [...at, scale]])
          return null
        },
      }
    )
    expect(placed).toEqual([['a', [102, 4, 6, 6]]])
  })

  it('reports a feature that throws instead of losing the rest of the ensemble', () => {
    register({
      name: 'destroyable',
      schema: {},
      bind: () => {
        throw new Error('boom')
      },
    })
    const built = buildEnsemble(two, { scene: fakeScene() })
    expect(built.problems.some((p) => p.code === 'bind-failed')).toBe(true)
    expect(built.pieces.size).toBe(2)
  })

  it('returns validation problems without refusing to build', () => {
    const built = buildEnsemble({ name: '', pieces: [{ id: 'a', mesh: 'X', at: [0, 0, 0] }] }, {
      scene: fakeScene(),
    })
    expect(built.problems.map((p) => p.code)).toContain('no-name')
    expect(built.pieces.size).toBe(1)
  })

  it('gives a plain piece a body without any feature being involved', () => {
    // The point of the format: most things are not combatants, and a piece with
    // no features at all still has to exist in the scene.
    const placed: string[] = []
    buildEnsemble(
      { name: 'plain', pieces: [{ id: 'rock', mesh: 'Rock', at: [0, 0, 0] }] },
      {
        scene: fakeScene(),
        placePiece: (piece) => {
          placed.push(piece.id)
          return { node: {} }
        },
      }
    )
    expect(placed).toEqual(['rock'])
  })

  it('places every mesh piece the same way — destroyable decorates, it does not create', () => {
    // Until tosijs-3d 0.7.2 destruction had to CREATE the body, because
    // b3d-destroyable was the only way to place a library mesh and could not
    // opt out of combat. `destroyable="off"` ended that.
    let placements = 0
    register({ name: 'destroyable', schema: {}, bind: (_p, _c, ctx) => ctx.element })
    const built = buildEnsemble(two, {
      scene: fakeScene(),
      placePiece: () => {
        placements++
        return { node: {} }
      },
    })
    expect(placements).toBe(2) // BOTH pieces placed, including the destroyable one
    expect(built.pieces.get('reactor')!.node).not.toBeNull()
  })

  it('lets a BODY feature claim the piece, and does not place it twice', () => {
    let placements = 0
    register({
      name: 'destroyable',
      schema: {},
      body: true,
      bind: () => ({ appendChild: () => {}, remove: () => {} }) as unknown as SceneElement,
    })
    const built = buildEnsemble(two, {
      scene: fakeScene(),
      placePiece: () => {
        placements++
        return { node: {} }
      },
    })
    // 'reactor' declares destroyable, so its body came from the feature.
    // 'field' does not, so it was placed.
    expect(placements).toBe(1)
    expect(built.pieces.get('reactor')!.element).not.toBeNull()
    expect(built.pieces.get('field')!.node).not.toBeNull()
  })

  it('shows a decorator the body a body-feature created, whatever the key order', () => {
    // The decorator is bound after the body feature, and its context reads the
    // body through a getter — a snapshot taken at bind time would be null.
    let seen: unknown = 'not run'
    const body = { appendChild: () => {}, remove: () => {} } as unknown as SceneElement
    register({ name: 'destroyable', schema: {}, body: true, bind: () => body })
    register({
      name: 'blip',
      schema: {},
      bind: (_p, _c, ctx) => {
        seen = ctx.element
        return null
      },
    })
    buildEnsemble(
      {
        name: 'one',
        // `blip` first in the object, so only the body-first ordering saves this.
        pieces: [{ id: 'a', mesh: 'X', at: [0, 0, 0], features: { blip: {}, destroyable: {} } }],
      },
      { scene: fakeScene() }
    )
    expect(seen).toBe(body)
  })
})
