/*#
# Manipulator geometry

The maths a manipulator needs, as **pure functions**. No scene, no engine, no
pointer — so the part most likely to be subtly wrong is the part that can be
tested without a browser.

Each grip answers one question: *given where the pointer is aiming now, what
value should this handle have?*

- **translate** — the point on the axis closest to the pointer's ray
- **planar** — where the ray crosses the plane the grip lies in, as a point
- **rotate** — the angle around the axis where the ray crosses its plane
- **scale** — the same projection as translate, read as a ratio
- **uniform** — the ray's distance from the widget centre, read as a ratio

## A grip, not a mode

The widget shows every enabled affordance AT ONCE and lets the grip you grab say
what the drag means — the shape Cheetah 3D's universal manipulator made its
reputation on. A mode switch asks the author to declare their intent twice: once
to the toolbar, and again to the handle. Here `Grip` is the whole vocabulary,
and it is what a pick returns.

## Snapping quantises the VALUE, not the movement

A drag that snaps by stepping the delta accumulates error: sixty frames of
`round(delta)` is not `round(sixty deltas)`, and a piece walks off the grid over
a long drag. Quantising the resulting absolute value instead means a snapped
piece is always exactly on the grid, however it got there.
*/
/*{"parent":"Internals","order":4}*/
import type { Vec3 } from '../format/types'
import type { EditorRay } from './input/pointer'

export type Axis = 'x' | 'y' | 'z'

/** What a grip does when you drag it. */
export type GripKind = 'translate' | 'planar' | 'rotate' | 'scale' | 'uniform'

/**
 * One grabbable part of the manipulator.
 *
 * `axis` means the axis dragged along or turned around — except for `planar`,
 * where it is the axis NORMAL to the drag plane (so the XZ pad is
 * `{kind: 'planar', axis: 'y'}`). Encoding a plane by its normal keeps every
 * grip the same shape, which is what lets one pick, one metadata field and one
 * drag record cover all five kinds. `uniform` has no axis.
 */
export interface Grip {
  kind: GripKind
  axis?: Axis
}

/** Which transforms the widget offers. All off is a pure selection tool. */
export interface TransformSet {
  translate: boolean
  rotate: boolean
  scale: boolean
}

export const NO_TRANSFORMS: TransformSet = { translate: false, rotate: false, scale: false }

/** True when the widget would draw nothing. */
export const noTransforms = (t: TransformSet): boolean => !t.translate && !t.rotate && !t.scale

/** The two axes that are not this one, in cyclic order. */
export function otherAxes(axis: Axis): [Axis, Axis] {
  return axis === 'x' ? ['y', 'z'] : axis === 'y' ? ['z', 'x'] : ['x', 'y']
}

/** Index of an axis into a `Vec3`. */
export const axisIndex = (axis: Axis): 0 | 1 | 2 => (axis === 'x' ? 0 : axis === 'y' ? 1 : 2)

const AXIS_VECTOR: Record<Axis, Vec3> = {
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
}

export const axisVector = (axis: Axis): Vec3 => AXIS_VECTOR[axis]

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/**
 * Closest point, along an infinite axis line, to a ray.
 *
 * The standard line-line closest-approach solve. Returns a distance along the
 * axis from `origin`, or `null` when the two are parallel — dragging an axis
 * you are looking straight down has no answer, and inventing one makes the
 * piece leap to infinity.
 */
export function axisClosestApproach(
  origin: Vec3,
  axis: Vec3,
  ray: EditorRay
): number | null {
  const w = sub(origin, ray.origin)
  const a = dot(axis, axis)
  const b = dot(axis, ray.direction)
  const c = dot(ray.direction, ray.direction)
  const d = dot(axis, w)
  const e = dot(ray.direction, w)
  const denominator = a * c - b * b
  // Parallel within floating-point reach. The threshold is relative, not
  // absolute, so it holds for a scene measured in metres or in kilometres.
  if (Math.abs(denominator) < 1e-9 * a * c) return null
  return (b * e - c * d) / denominator
}

/**
 * The angle a ray makes about an axis, in DEGREES.
 *
 * Rotation happens in the object's own frame, so the ring a pointer is dragging
 * lies in a plane whose normal is the piece's axis — not the world's. `normal`
 * is that axis; `u` and `v` are the other two, and they set where zero is and
 * which way the angle grows. Pass world axes and this reduces exactly to
 * `angleOnPlane`, which is how it is tested.
 */
export function angleAboutAxis(
  origin: Vec3,
  normal: Vec3,
  u: Vec3,
  v: Vec3,
  ray: EditorRay
): number | null {
  const denominator = dot(normal, ray.direction)
  if (Math.abs(denominator) < 1e-9) return null // ray runs along the plane
  const t = dot(normal, sub(origin, ray.origin)) / denominator
  if (t < 0) return null // the plane is behind the pointer
  const hit: Vec3 = [
    ray.origin[0] + ray.direction[0] * t,
    ray.origin[1] + ray.direction[1] * t,
    ray.origin[2] + ray.direction[2] * t,
  ]
  const local = sub(hit, origin)
  return (Math.atan2(dot(local, v), dot(local, u)) * 180) / Math.PI
}

/**
 * Which two axes span the plane of a rotation ring, and in which order.
 *
 * The order fixes where zero is and which way the angle grows; get it wrong for
 * one ring and that ring drags backwards, which reads as a bug in the pointer
 * rather than a sign.
 */
export const RING_BASIS: Record<Axis, [Axis, Axis]> = {
  x: ['z', 'y'],
  y: ['x', 'z'],
  z: ['x', 'y'],
}

/**
 * Where a ray crosses the plane through `origin` whose normal is `axis`.
 *
 * The point a planar grip drags to. Null when the ray runs ALONG the plane (no
 * crossing) or when the plane is behind the pointer, which is a drag reaching
 * round the back of the widget.
 */
export function rayPlanePoint(origin: Vec3, axis: Axis, ray: EditorRay): Vec3 | null {
  const normal = AXIS_VECTOR[axis]
  const denominator = dot(normal, ray.direction)
  if (Math.abs(denominator) < 1e-9) return null
  const t = dot(normal, sub(origin, ray.origin)) / denominator
  if (t < 0) return null
  return [
    ray.origin[0] + ray.direction[0] * t,
    ray.origin[1] + ray.direction[1] * t,
    ray.origin[2] + ray.direction[2] * t,
  ]
}

/**
 * Perpendicular distance from a point to a ray.
 *
 * What the centre grip scales by: pull away from the widget and it grows. It
 * needs no axis and no camera, which is what makes it the one affordance that
 * behaves identically from a mouse and from a hand — an in-scene widget has no
 * "screen space" to fall back on.
 */
export function rayPerpendicularDistance(origin: Vec3, ray: EditorRay): number {
  const w = sub(origin, ray.origin)
  const dd = dot(ray.direction, ray.direction)
  if (dd < 1e-12) return 0
  const t = dot(w, ray.direction) / dd
  const closest: Vec3 = [
    ray.origin[0] + ray.direction[0] * t,
    ray.origin[1] + ray.direction[1] * t,
    ray.origin[2] + ray.direction[2] * t,
  ]
  const d = sub(origin, closest)
  return Math.hypot(d[0], d[1], d[2])
}

/**
 * Quantise a value to a step. `step <= 0` means no snapping.
 *
 * Applied to the absolute value rather than the delta — see the note above.
 */
export function snap(value: number, step: number): number {
  if (!Number.isFinite(step) || step <= 0) return value
  return Math.round(value / step) * step
}

/** Snap each component of a position. */
export function snapVec3(value: Vec3, step: number): Vec3 {
  return [snap(value[0], step), snap(value[1], step), snap(value[2], step)]
}

/**
 * Wrap an angle into (-180, 180].
 *
 * Rotation drags cross the ±180 seam constantly, and an unwrapped difference
 * there is a 359° jump — the piece spins the long way round for one frame.
 */
export function wrapDegrees(angle: number): number {
  const wrapped = ((angle + 180) % 360 + 360) % 360 - 180
  return wrapped === -180 ? 180 : wrapped
}

/**
 * An angle as it is STORED: 0 up to but not including 360.
 *
 * Distinct from `wrapDegrees`, and the two must not be confused. A DELTA is
 * signed — turning back five degrees is -5, and calling it 355 would spin the
 * piece the long way round — so deltas keep the (-180, 180] wrap. A stored
 * ANGLE has no direction to preserve and reads better without minus signs,
 * particularly now that composing a rotation returns whichever euler triple
 * Babylon picks: a piece turned about its own axis came back as [-5, 174, -40]
 * where nobody would have typed that.
 *
 * 360 normalises to 0, which is the same orientation spelled shorter.
 */
export function normaliseDegrees(angle: number): number {
  if (!Number.isFinite(angle)) return 0
  return ((angle % 360) + 360) % 360
}

/** Scale factor from a drag along an axis, clamped so a piece cannot invert. */
export function scaleFactor(startDistance: number, currentDistance: number): number {
  if (Math.abs(startDistance) < 1e-6) return 1
  // Negative or near-zero scale mirrors or annihilates the mesh, and neither is
  // ever what a drag past the origin meant.
  return Math.max(0.01, currentDistance / startDistance)
}
