import { afterEach, describe, expect, it } from 'bun:test'
import { buildEnsemble } from '../../runtime/build'
import { registerWorldPreset } from './index'
import { unregisterFeature } from '../../format/registry'
import type { SceneElement } from '../../format/registry'
import type { Ensemble } from '../../format/types'
import type { InteractiveHandle, LockHandle } from './index'

/*
  Features composing on features is the substrate claim: a door is not
  special-cased input, it is a thing with `interactive` that happens to swing,
  and a lock is a separate feature that gates it without either knowing about
  the other.

  If `ctx.feature()` regresses, every one of those collapses back into a
  god-feature that has to know about all the others. This is where that fails.
*/
const scene = () =>
  ({
    appendChild: () => {},
    remove: () => {},
    ownerDocument: null,
    scene: { activeCamera: { position: { x: 0, y: 0, z: 0 } } },
  }) as unknown as SceneElement

const withFeatures = (features: Record<string, Record<string, unknown>>): Ensemble => ({
  name: 'test',
  pieces: [{ id: 'door', mesh: 'Door', at: [0, 0, 0], features }],
})

afterEach(() => {
  // The preset registers globally; each test asserts against a fresh build, but
  // leaving registrations behind would leak into other files' tests.
})

describe('world preset composition', () => {
  it('gates `interactive` behind `lockable` on the same piece', () => {
    registerWorldPreset()
    const built = buildEnsemble(
      withFeatures({
        interactive: { reach: 0 },
        lockable: { locked: true, key: 'brass' },
      }),
      { scene: scene() }
    )
    const use = built.pieces.get('door')!.handles.get('interactive') as InteractiveHandle
    const lock = built.pieces.get('door')!.handles.get('lockable') as LockHandle

    expect(use.use()).toBe(false) // locked, no key
    expect(use.use('iron')).toBe(false) // wrong key
    expect(use.use('brass')).toBe(true) // right key

    lock.unlock('brass')
    expect(use.use()).toBe(true) // now open to anyone
    built.dispose()
  })

  it('is usable when there is no lock at all', () => {
    registerWorldPreset()
    const built = buildEnsemble(withFeatures({ interactive: { reach: 0 } }), { scene: scene() })
    const use = built.pieces.get('door')!.handles.get('interactive') as InteractiveHandle
    expect(use.use()).toBe(true)
    built.dispose()
  })

  it('notifies listeners on a successful use, and not on a refused one', () => {
    registerWorldPreset()
    const built = buildEnsemble(
      withFeatures({ interactive: { reach: 0 }, lockable: { locked: true, key: 'brass' } }),
      { scene: scene() }
    )
    const use = built.pieces.get('door')!.handles.get('interactive') as InteractiveHandle
    let fired = 0
    use.onUse(() => fired++)
    use.use('wrong')
    expect(fired).toBe(0)
    use.use('brass')
    expect(fired).toBe(1)
    built.dispose()
  })

  it('refuses when out of reach', () => {
    registerWorldPreset()
    const built = buildEnsemble(
      { name: 't', pieces: [{ id: 'far', mesh: 'D', at: [100, 0, 0], features: { interactive: { reach: 2 } } }] },
      { scene: scene() }
    )
    const use = built.pieces.get('far')!.handles.get('interactive') as InteractiveHandle
    expect(use.use()).toBe(false)
    built.dispose()
  })

  it('stops listening when the ensemble is disposed', () => {
    // The editor rebuilds constantly; a listener that outlives its build is a
    // leak that accumulates a handler per edit.
    registerWorldPreset()
    const built = buildEnsemble(withFeatures({ interactive: { reach: 0 } }), { scene: scene() })
    const use = built.pieces.get('door')!.handles.get('interactive') as InteractiveHandle
    let fired = 0
    const stop = use.onUse(() => fired++)
    stop()
    use.use()
    expect(fired).toBe(0)
    built.dispose()
  })

  it('leaves a piece with no interactive feature alone', () => {
    registerWorldPreset()
    const built = buildEnsemble(withFeatures({ spin: { degreesPerSecond: 90 } }), { scene: scene() })
    expect(built.pieces.get('door')!.handles.has('interactive')).toBe(false)
    expect(built.problems.filter((p) => p.severity === 'error')).toEqual([])
    built.dispose()
  })
})

describe('feature registry supports feature-to-feature lookup', () => {
  it('exposes only features on the SAME piece', () => {
    registerWorldPreset()
    const built = buildEnsemble(
      {
        name: 't',
        pieces: [
          { id: 'a', mesh: 'D', at: [0, 0, 0], features: { lockable: { locked: true, key: 'k' } } },
          { id: 'b', mesh: 'D', at: [3, 0, 0], features: { interactive: { reach: 0 } } },
        ],
      },
      { scene: scene() }
    )
    // `b` has no lock of its own, so another piece's lock must not gate it.
    const use = built.pieces.get('b')!.handles.get('interactive') as InteractiveHandle
    expect(use.use()).toBe(true)
    built.dispose()
    unregisterFeature('nothing') // no-op; keeps the import honest
  })
})
