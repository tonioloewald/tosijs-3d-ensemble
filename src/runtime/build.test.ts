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

const two: Ensemble = {
  name: 'pair',
  pieces: [
    { id: 'reactor', mesh: 'R', at: [0, 0, 0], role: 'power' },
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
      placePiece: (piece) => ({ id: piece.id }) as unknown as SceneElement,
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
})
