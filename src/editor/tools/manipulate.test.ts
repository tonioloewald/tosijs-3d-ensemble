import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { registerManipulateTool, resolveGrab } from './manipulate'
import { getTool, unregisterTool } from './tool-registry'
import type { ToolContext } from './tool-registry'
import type { Gesture, EditorPointer, EditorRay } from '../input/pointer'
import type { Ensemble, Vec3 } from '../../format/types'
import type { WritableBody } from '../transform-write'

const pointer = (ray: EditorRay | null, grip: Vec3 | null = null): EditorPointer => ({
  id: 'primary',
  kind: grip ? 'xr' : 'flat',
  ray: () => ray,
  grip: () => grip,
  active: true,
  secondary: false,
})

const gestureWith = (ray: EditorRay | null, grip: Vec3 | null = null): Gesture => ({
  primary: pointer(ray, grip),
  helper: null,
  startRay: ray,
  startGrip: grip,
})

/** Looking down -Z at a given x — so the X axis reads that x directly. */
const rayAtX = (x: number): EditorRay => ({ origin: [x, 0, 10], direction: [0, 0, -1] })

let ensemble: Ensemble
let body: WritableBody
let selectedId: string | null

const ctx = (options: Record<string, unknown> = {}): ToolContext =>
  ({
    ensemble,
    selection: ensemble.pieces.find((p) => p.id === selectedId) ?? null,
    select: (id: string | null) => (selectedId = id),
    scene: {} as never,
    edit: (_d: string, mutate: (e: Ensemble) => void) => mutate(ensemble),
    options: { mode: 'translate', gridSnap: 0, angleSnap: 0, duplicate: false, ...options },
    pick: () => null,
    pickPoint: () => null,
    captureCamera: () => {},
    meshNames: () => [],
    meshCatalog: () => [],
  }) as ToolContext

beforeEach(() => {
  ensemble = { name: 'test', pieces: [{ id: 'rock', mesh: 'Rock', at: [0, 0, 0] }] }
  selectedId = 'rock'
  body = { element: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, size: 1 } }
  registerManipulateTool({
    nearAxis: () => null,
    farAxis: () => 'x',
    bodyOf: () => body,
    worldOrigin: () => [0, 0, 0],
  })
})

afterEach(() => unregisterTool('manipulate'))

const tool = () => getTool('manipulate')!

describe('resolveGrab', () => {
  it('prefers a hand INSIDE a handle over whatever its ray crosses', () => {
    // A hand in a handle is unambiguous; the same controller's ray is usually
    // also crossing something further away, and honouring that instead is how a
    // near grab feels like it "missed".
    const axis = resolveGrab(
      gestureWith(rayAtX(0), [0.05, 0, 0]),
      () => 'y',
      () => 'x'
    )
    expect(axis).toBe('y')
  })

  it('falls back to the ray when no hand is near', () => {
    expect(resolveGrab(gestureWith(rayAtX(0), [9, 9, 9]), () => null, () => 'z')).toBe('z')
  })

  it('grabs nothing when there is no ray and no hand', () => {
    expect(resolveGrab(gestureWith(null), () => null, () => 'x')).toBeNull()
  })
})

describe('manipulate: translate', () => {
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
    const c = ctx({ gridSnap: 1 })
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c)
    tool().onGesture!.move!(gestureWith(rayAtX(2.6)), c)
    tool().onGesture!.end!(gestureWith(rayAtX(2.6)), c)
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 0])
  })

  it('does nothing when the gesture grabbed no handle', () => {
    unregisterTool('manipulate')
    registerManipulateTool({
      nearAxis: () => null,
      farAxis: () => null, // grabbed empty space
      bodyOf: () => body,
      worldOrigin: () => [0, 0, 0],
    })
    const c = ctx()
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c)
    tool().onGesture!.move!(gestureWith(rayAtX(5)), c)
    tool().onGesture!.end!(gestureWith(rayAtX(5)), c)
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0])
  })

  it('ignores a drag with nothing selected', () => {
    selectedId = null
    const c = ctx()
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c)
    tool().onGesture!.end!(gestureWith(rayAtX(4)), c)
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0])
  })
})

describe('manipulate: copy on drag', () => {
  it('copies on RELEASE, leaving the original where it was', () => {
    // Cloning at drag START would need a rebuild mid-gesture, which disposes
    // the very node under the author's hand.
    const c = ctx({ duplicate: true, gridSnap: 1 })
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c)
    tool().onGesture!.move!(gestureWith(rayAtX(5)), c)
    tool().onGesture!.end!(gestureWith(rayAtX(5)), c)

    expect(ensemble.pieces).toHaveLength(2)
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0]) // original untouched
    expect(ensemble.pieces[1]!.at).toEqual([5, 0, 0])
    expect(ensemble.pieces[1]!.id).not.toBe('rock')
    expect(selectedId).toBe(ensemble.pieces[1]!.id) // the copy is now selected
  })
})

describe('manipulate: rotate', () => {
  it('writes rotation in degrees, snapped, and leaves position alone', () => {
    // Grab the Y ring: a ray straight down is PARALLEL to the X ring's plane,
    // and that drag correctly refuses to start rather than inventing an angle.
    unregisterTool('manipulate')
    registerManipulateTool({
      nearAxis: () => null,
      farAxis: () => 'y',
      bodyOf: () => body,
      worldOrigin: () => [0, 0, 0],
    })
    const c = ctx({ mode: 'rotate', angleSnap: 15 })
    // Around Y: the ray crossing the XZ plane at (1,0) reads 0°, at (0,1) 90°.
    const down = (x: number, z: number): EditorRay => ({ origin: [x, 5, z], direction: [0, -1, 0] })
    tool().onGesture!.start!(gestureWith(down(1, 0)), c)
    tool().onGesture!.move!(gestureWith(down(0, 1)), c)
    tool().onGesture!.end!(gestureWith(down(0, 1)), c)
    expect(ensemble.pieces[0]!.rot).toEqual([0, 90, 0])
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0])
  })
})
