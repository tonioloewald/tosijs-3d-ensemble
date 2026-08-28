import { describe, expect, it } from 'bun:test'
import { libraryNames, meshesByLibrary, mountLibraries, resolveLibrary } from './libraries'
import type { SceneElement } from '../format/registry'
import type { Ensemble, Piece } from '../format/types'

const scene = (libraries: Record<string, string[]>): SceneElement =>
  ({
    getLibrary: (type: string) =>
      libraries[type] ? { getNames: () => libraries[type]! } : null,
  }) as unknown as SceneElement

const ensemble = (names: string[]): Ensemble => ({
  name: 'e',
  libraries: names.map((name) => ({ name, url: `/${name}.glb` })),
  pieces: [],
})

const piece = (over: Partial<Piece> = {}): Piece => ({ id: 'p', mesh: 'cube', at: [0, 0, 0], ...over })

describe('library resolution', () => {
  it('lists declared libraries in order', () => {
    expect(libraryNames(ensemble(['props', 'vehicles']))).toEqual(['props', 'vehicles'])
  })

  it('appends a host-forced library without duplicating a declared one', () => {
    expect(libraryNames(ensemble(['props']), 'extra')).toEqual(['props', 'extra'])
    expect(libraryNames(ensemble(['props']), 'props')).toEqual(['props'])
  })

  it('honours a piece that names its own library', () => {
    // Both libraries export `cube`. Without the qualifier this piece renders
    // differently depending on which library loaded first — a bug that
    // reproduces on one machine and not another.
    const s = scene({ a: ['cube'], b: ['cube'] })
    expect(resolveLibrary(s, ['a', 'b'], piece({ library: 'b' }))).toBe('b')
  })

  it('otherwise takes the first library that actually has the mesh', () => {
    const s = scene({ props: ['bench'], vehicles: ['cube'] })
    expect(resolveLibrary(s, ['props', 'vehicles'], piece())).toBe('vehicles')
  })

  it('falls back to the first library when nothing has the mesh yet', () => {
    // Mid-load, no library reports names. Guessing the first keeps the piece
    // pointed somewhere plausible instead of dropping it.
    const s = scene({})
    expect(resolveLibrary(s, ['props'], piece())).toBe('props')
  })

  it('trusts a stated library even before it has loaded', () => {
    // The author's intent outranks what happens to be resolvable right now.
    expect(resolveLibrary(scene({}), ['a'], piece({ library: 'zzz' }))).toBe('zzz')
  })

  it('has no library for a piece with no mesh', () => {
    expect(resolveLibrary(scene({ a: ['cube'] }), ['a'], piece({ mesh: undefined }))).toBeNull()
  })

  it('collects mesh names per library for validation and palettes', () => {
    const s = scene({ props: ['bench', 'lamp'], vehicles: ['car'] })
    const map = meshesByLibrary(s, ['props', 'vehicles', 'missing'])
    expect([...map.keys()]).toEqual(['props', 'vehicles'])
    expect(map.get('props')).toEqual(new Set(['bench', 'lamp']))
  })
})

describe('mounting waits for the element to upgrade', () => {
  /*
    The library element defines `ready` itself, so a node appended before its
    class is registered has no such property — and reading it inline made
    `mountLibraries` resolve instantly against a library that had not begun
    downloading. Every piece then built as a placeholder box, with no error.
  */
  it('reads `ready` only after the custom element is defined', async () => {
    let upgrade!: () => void
    let load!: () => void
    const defined = new Promise<void>((resolve) => {
      upgrade = resolve
    })
    const original = globalThis.customElements
    ;(globalThis as { customElements?: unknown }).customElements = {
      whenDefined: () => defined,
    }

    const element: Record<string, unknown> = {
      setAttribute: () => {},
      getAttribute: () => null,
    }
    const host = {
      getLibrary: () => null,
      ownerDocument: { createElement: () => element },
      appendChild: () => {},
    } as unknown as SceneElement

    let settled = false
    const mounting = mountLibraries(ensemble(['props']), host).then(() => {
      settled = true
    })

    await Promise.resolve()
    expect(settled).toBe(false)

    // Upgrading is what gives the element a `ready` promise at all.
    element.ready = new Promise<void>((resolve) => {
      load = resolve
    })
    upgrade()
    await Promise.resolve()
    expect(settled).toBe(false)

    load()
    await mounting
    expect(settled).toBe(true)
    ;(globalThis as { customElements?: unknown }).customElements = original
  })
})
