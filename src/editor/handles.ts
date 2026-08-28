/*#
# Manipulator geometry

The maths a manipulator needs, as **pure functions**. No scene, no engine, no
pointer — so the part most likely to be subtly wrong is the part that can be
tested without a browser.

Each drag mode answers one question: *given where the pointer is aiming now,
what value should this handle have?*

- **translate** — the point on the axis closest to the pointer's ray
- **rotate** — the angle around the axis where the ray crosses its plane
- **scale** — the same projection as translate, read as a ratio

## Snapping quantises the VALUE, not the movement

A drag that snaps by stepping the delta accumulates error: sixty frames of
`round(delta)` is not `round(sixty deltas)`, and a piece walks off the grid over
a long drag. Quantising the resulting absolute value instead means a snapped
piece is always exactly on the grid, however it got there.
*/
/*{"parent":"Internals","order":4}*/
import type { Vec3 } from '../format/types'
import type { EditorRay } from './input/pointer'

export type TransformMode = 'translate' | 'rotate' | 'scale'
export type Axis = 'x' | 'y' | 'z'

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
 * Where a ray crosses the plane through `origin` with normal `axis`, as an
 * angle in DEGREES around that axis.
 *
 * Degrees because the format is degrees everywhere; converting once here beats
 * converting at every call site and getting it wrong at one of them.
 */
export function angleOnPlane(
  origin: Vec3,
  axis: Axis,
  ray: EditorRay
): number | null {
  const normal = AXIS_VECTOR[axis]
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
  // Two in-plane axes, chosen per rotation axis so that the angle increases the
  // same way around each — otherwise one ring drags backwards and it reads as a
  // bug in the pointer rather than a sign.
  const [u, v] =
    axis === 'y' ? [local[0], local[2]] : axis === 'x' ? [local[2], local[1]] : [local[0], local[1]]
  return (Math.atan2(v, u) * 180) / Math.PI
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

/** Scale factor from a drag along an axis, clamped so a piece cannot invert. */
export function scaleFactor(startDistance: number, currentDistance: number): number {
  if (Math.abs(startDistance) < 1e-6) return 1
  // Negative or near-zero scale mirrors or annihilates the mesh, and neither is
  // ever what a drag past the origin meant.
  return Math.max(0.01, currentDistance / startDistance)
}
