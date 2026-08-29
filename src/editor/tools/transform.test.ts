import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { registerTransformTool, resolveGrab, transformsOf } from './transform'
import { getTool, unregisterTool } from './tool-registry'
import type { ToolContext } from './tool-registry'
import type { Grip } from '../handles'
import type { Gesture, EditorPointer, EditorRay } from '../input/pointer'
import type { Ensemble, Vec3 } from '../../format/types'
import type { WritableBody } from '../transform-write'

const pointer = (
  ray: EditorRay | null,
  hand: Vec3 | null = null,
  secondary = false
): EditorPointer => ({
  id: 'primary',
  kind: hand ? 'xr' : 'flat',
  ray: () => ray,
  grip: () => hand,
  active: true,
  secondary,
})

const gestureWith = (
  ray: EditorRay | null,
  hand: Vec3 | null = null,
  secondary = false
): Gesture => ({
  primary: pointer(ray, hand, secondary),
  helper: null,
  startRay: ray,
  startGrip: hand,
})

/** Looking down -Z at a given x — so the X axis reads that x directly. */
const rayAtX = (x: number): EditorRay => ({ origin: [x, 0, 10], direction: [0, 0, -1] })
/**
 * Looking down -Z at a given y — so the Y axis reads that y directly.
 *
 * A Y-axis drag needs a ray that MOVES in y: `rayAtX` slides sideways, whose
 * closest approach to the Y axis is zero wherever you put it, so the drag
 * correctly reads no movement at all.
 */
const rayAtY = (y: number): EditorRay => ({ origin: [0, y, 10], direction: [0, 0, -1] })
/** Looking straight down from above at a given x/z — crosses the XZ plane there. */
const down = (x: number, z: number): EditorRay => ({ origin: [x, 5, z], direction: [0, -1, 0] })

let ensemble: Ensemble
let body: WritableBody
let selectedId: string | null
let picked: string | null

const ctx = (options: Record<string, unknown> = {}): ToolContext =>
  ({
    ensemble,
    selection: ensemble.pieces.find((p) => p.id === selectedId) ?? null,
    select: (id: string | null) => (selectedId = id),
    scene: {} as never,
    edit: (_d: string, mutate: (e: Ensemble) => void) => mutate(ensemble),
    options: { gridSnap: 0, angleSnap: 0, duplicate: false, ...options },
    pick: () => picked,
    pickPoint: () => null,
    captureCamera: () => {},
    meshNames: () => [],
    meshCatalog: () => [],
  }) as ToolContext

/** Re-register with a fixed answer for what the ray grabs. */
const withGrip = (grip: Grip | null) => {
  unregisterTool('select')
  registerTransformTool({
    nearGrip: () => null,
    farGrip: () => grip,
    bodyOf: () => body,
    worldOrigin: () => [0, 0, 0],
  })
}

beforeEach(() => {
  ensemble = { name: 'test', pieces: [{ id: 'rock', mesh: 'Rock', at: [0, 0, 0] }] }
  selectedId = 'rock'
  picked = null
  body = {
    element: {
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      size: 1,
      mesh: { scaling: { x: 1, y: 1, z: 1 } },
    },
  }
  withGrip({ kind: 'translate', axis: 'x' })
})

afterEach(() => unregisterTool('select'))

const tool = () => getTool('select')!
const run = (rays: EditorRay[], c: ToolContext, hand: Vec3 | null = null, secondary = false) => {
  tool().onGesture!.start!(gestureWith(rays[0]!, hand, secondary), c)
  for (const ray of rays.slice(1)) tool().onGesture!.move!(gestureWith(ray, hand, secondary), c)
  tool().onGesture!.end!(gestureWith(rays[rays.length - 1]!, hand, secondary), c)
}

describe('transformsOf', () => {
  it('reads three independent toggles, all off by default', () => {
    expect(transformsOf({})).toEqual({ translate: false, rotate: false, scale: false })
    expect(transformsOf({ translate: true, scale: true })).toEqual({
      translate: true,
      rotate: false,
      scale: true,
    })
  })
})

describe('resolveGrab', () => {
  it('prefers a hand INSIDE a handle over whatever its ray crosses', () => {
    // A hand in a handle is unambiguous; the same controller's ray is usually
    // also crossing something further away, and honouring that instead is how a
    // near grab feels like it "missed".
    const grip = resolveGrab(
      gestureWith(rayAtX(0), [0.05, 0, 0]),
      () => ({ kind: 'rotate', axis: 'y' }),
      () => ({ kind: 'translate', axis: 'x' })
    )
    expect(grip).toEqual({ kind: 'rotate', axis: 'y' })
  })

  it('falls back to the ray when no hand is near', () => {
    const grip = resolveGrab(
      gestureWith(rayAtX(0), [9, 9, 9]),
      () => null,
      () => ({ kind: 'scale', axis: 'z' })
    )
    expect(grip).toEqual({ kind: 'scale', axis: 'z' })
  })

  it('grabs nothing when there is no ray and no hand', () => {
    expect(resolveGrab(gestureWith(null), () => null, () => ({ kind: 'uniform' }))).toBeNull()
  })
})

describe('select and transform are ONE tool', () => {
  it('selects what the gesture hit when no handle was grabbed', () => {
    withGrip(null)
    picked = 'other-rock'
    run([rayAtX(0)], ctx())
    expect(selectedId).toBe('other-rock')
  })

  it('deselects on empty space', () => {
    withGrip(null)
    picked = null
    run([rayAtX(0)], ctx())
    expect(selectedId).toBeNull()
  })

  it('does NOT change the selection when a handle was dragged', () => {
    // Dragging the widget must not reselect whatever is behind it — which is
    // usually the ground, and would drop the selection mid-edit.
    picked = 'something-else'
    run([rayAtX(0), rayAtX(3)], ctx())
    expect(selectedId).toBe('rock')
  })

  it('selects even with nothing currently selected, so there is a way back in', () => {
    selectedId = null
    withGrip(null)
    picked = 'rock'
    run([rayAtX(0)], ctx())
    // Cast: assigning null above narrows the binding, and the point of the test
    // is precisely that the tool widened it again.
    expect(selectedId as string | null).toBe('rock')
  })
})

describe('translate', () => {
  it('moves the piece by the pointer delta and writes the JSON on release', () => {
    const c = ctx()
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c)
    tool().onGesture!.move!(gestureWith(rayAtX(3)), c)
    // Live body follows during the drag...
    expect((body.element as { x: number }).x).toBeCloseTo(3, 6)
    tool().onGesture!.end!(gestureWith(rayAtX(3)), c)
    // ...and the JSON is the truth afterwards.
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 0])
  })

  it('snaps the resulting VALUE to the grid', () => {
    run([rayAtX(0), rayAtX(2.6)], ctx({ gridSnap: 1 }))
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 0])
  })

  it('ignores a drag with nothing selected', () => {
    selectedId = null
    run([rayAtX(0), rayAtX(4)], ctx())
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0])
  })

  it('writes no rotation or scale, so a nudge cannot stamp defaults', () => {
    run([rayAtX(0), rayAtX(2)], ctx())
    expect(ensemble.pieces[0]!.rot).toBeUndefined()
    expect(ensemble.pieces[0]!.scale).toBeUndefined()
  })
})

describe('planar translate', () => {
  it('moves in both in-plane axes and leaves the normal alone', () => {
    // The XZ pad: normal is Y, so a drag across it changes x and z only.
    withGrip({ kind: 'planar', axis: 'y' })
    run([down(1, 1), down(4, -2)], ctx())
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, -3])
  })

  it('snaps the plane drag like any other move', () => {
    withGrip({ kind: 'planar', axis: 'y' })
    run([down(0, 0), down(2.6, 1.2)], ctx({ gridSnap: 1 }))
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 1])
  })
})

describe('rotate', () => {
  it('writes rotation in degrees, snapped, and leaves position alone', () => {
    // Grab the Y ring: a ray straight down is PARALLEL to the X ring's plane,
    // and that drag correctly refuses to start rather than inventing an angle.
    withGrip({ kind: 'rotate', axis: 'y' })
    // Around Y: the ray crossing the XZ plane at (1,0) reads 0°, at (0,1) 90°.
    run([down(1, 0), down(0, 1)], ctx({ angleSnap: 15 }))
    expect(ensemble.pieces[0]!.rot).toEqual([0, 90, 0])
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0])
  })
})

describe('scale', () => {
  it('stretches ONE axis and writes a triple', () => {
    withGrip({ kind: 'scale', axis: 'x' })
    run([rayAtX(2), rayAtX(4)], ctx())
    expect(ensemble.pieces[0]!.scale).toEqual([2, 1, 1])
  })

  it('with the secondary button, scales the OTHER two axes', () => {
    // "Thinner without getting shorter" is the same reach, one modifier apart.
    withGrip({ kind: 'scale', axis: 'y' })
    run([rayAtY(2), rayAtY(4)], ctx(), null, true)
    expect(ensemble.pieces[0]!.scale).toEqual([2, 1, 2])
  })

  it('latches the modifier at the GRAB, so the axes cannot change mid-drag', () => {
    withGrip({ kind: 'scale', axis: 'y' })
    const c = ctx()
    // Grab without the modifier, then release with it held.
    tool().onGesture!.start!(gestureWith(rayAtY(2), null, false), c)
    tool().onGesture!.move!(gestureWith(rayAtY(4), null, true), c)
    tool().onGesture!.end!(gestureWith(rayAtY(4), null, true), c)
    expect(ensemble.pieces[0]!.scale).toEqual([1, 2, 1])
  })

  it('writes a plain NUMBER when the result is uniform', () => {
    // A file that said `scale: 2` should still say `scale: 2` after a uniform
    // drag, not `[2, 2, 2]` — the narrow spelling is the canonical one.
    withGrip({ kind: 'uniform' })
    run([{ origin: [2, 0, 10], direction: [0, 0, -1] }, { origin: [6, 0, 10], direction: [0, 0, -1] }], ctx())
    expect(ensemble.pieces[0]!.scale).toBe(3)
  })

  it('starts from the piece\'s existing per-axis scale', () => {
    ensemble.pieces[0]!.scale = [2, 3, 4]
    withGrip({ kind: 'scale', axis: 'x' })
    run([rayAtX(1), rayAtX(2)], ctx())
    expect(ensemble.pieces[0]!.scale).toEqual([4, 3, 4])
  })

  it('never mirrors a piece by dragging past the pivot', () => {
    withGrip({ kind: 'scale', axis: 'x' })
    run([rayAtX(2), rayAtX(-8)], ctx())
    const scale = ensemble.pieces[0]!.scale as number[]
    expect(scale[0]).toBeGreaterThan(0)
  })
})

describe('copy on drag', () => {
  it('copies on RELEASE, leaving the original where it was', () => {
    // Cloning at drag START would need a rebuild mid-gesture, which disposes
    // the very node under the author's hand.
    run([rayAtX(0), rayAtX(5)], ctx({ duplicate: true, gridSnap: 1 }))

    expect(ensemble.pieces).toHaveLength(2)
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0]) // original untouched
    expect(ensemble.pieces[1]!.at).toEqual([5, 0, 0])
    expect(ensemble.pieces[1]!.id).not.toBe('rock')
    expect(selectedId).toBe(ensemble.pieces[1]!.id) // the copy is now selected
  })
})
