import { describe, expect, it } from 'bun:test'
import {
  angleOnPlane,
  axisClosestApproach,
  axisVector,
  scaleFactor,
  snap,
  snapVec3,
  wrapDegrees,
} from './handles'
import type { EditorRay } from './input/pointer'

const ray = (origin: [number, number, number], direction: [number, number, number]): EditorRay => ({
  origin,
  direction,
})

describe('axisClosestApproach', () => {
  it('finds where a ray crosses an axis', () => {
    // Looking down -Z at the point x=4 on the X axis.
    const t = axisClosestApproach([0, 0, 0], axisVector('x'), ray([4, 0, 10], [0, 0, -1]))
    expect(t).toBeCloseTo(4, 6)
  })

  it('measures from the handle origin, not the world origin', () => {
    const t = axisClosestApproach([10, 0, 0], axisVector('x'), ray([14, 0, 10], [0, 0, -1]))
    expect(t).toBeCloseTo(4, 6)
  })

  it('returns null when the ray is parallel to the axis', () => {
    // Dragging an axis you are looking straight down has no answer. Inventing
    // one sends the piece to infinity.
    expect(axisClosestApproach([0, 0, 0], axisVector('x'), ray([0, 0, 0], [1, 0, 0]))).toBeNull()
  })

  it('stays parallel-safe at large scene scales', () => {
    // The parallel test is RELATIVE, so a scene measured in kilometres behaves
    // like one measured in metres.
    expect(
      axisClosestApproach([0, 0, 0], [1000, 0, 0], ray([0, 0, 0], [1000, 0, 0]))
    ).toBeNull()
  })
})

describe('angleOnPlane', () => {
  it('reads an angle around the Y axis in degrees', () => {
    const a = angleOnPlane([0, 0, 0], 'y', ray([1, 5, 0], [0, -1, 0]))
    expect(a).toBeCloseTo(0, 6)
    const b = angleOnPlane([0, 0, 0], 'y', ray([0, 5, 1], [0, -1, 0]))
    expect(b).toBeCloseTo(90, 6)
  })

  it('returns null when the ray runs along the plane', () => {
    expect(angleOnPlane([0, 0, 0], 'y', ray([0, 0, 0], [1, 0, 0]))).toBeNull()
  })

  it('returns null when the plane is behind the pointer', () => {
    // Rotating a ring you are pointing away from would otherwise track a
    // phantom intersection behind your hand.
    expect(angleOnPlane([0, 0, 0], 'y', ray([0, 5, 0], [0, 1, 0]))).toBeNull()
  })
})

describe('snapping', () => {
  it('quantises to a step', () => {
    expect(snap(4.4, 1)).toBe(4)
    expect(snap(4.6, 1)).toBe(5)
    expect(snap(7, 5)).toBe(5)
  })

  it('treats a zero or negative step as no snapping', () => {
    expect(snap(4.4, 0)).toBe(4.4)
    expect(snap(4.4, -1)).toBe(4.4)
  })

  it('snaps the VALUE, so a long drag cannot accumulate error', () => {
    // Sixty snapped deltas is not the same as one snapped total: stepping the
    // delta walks a piece off the grid over a long drag.
    let stepped = 0
    for (let i = 0; i < 60; i++) stepped += snap(0.6, 1)
    expect(stepped).toBe(60)
    expect(snap(0.6 * 60, 1)).toBe(36)
  })

  it('snaps each component of a position', () => {
    expect(snapVec3([1.2, 4.7, -3.4], 1)).toEqual([1, 5, -3])
  })
})

describe('wrapDegrees', () => {
  it('wraps across the ±180 seam', () => {
    // Unwrapped, this difference is a 359° jump and the piece spins the long
    // way round for one frame.
    expect(wrapDegrees(370)).toBe(10)
    expect(wrapDegrees(-190)).toBe(170)
    expect(wrapDegrees(180)).toBe(180)
    expect(wrapDegrees(-180)).toBe(180)
  })
})

describe('scaleFactor', () => {
  it('is a ratio of drag distances', () => {
    expect(scaleFactor(2, 4)).toBe(2)
    expect(scaleFactor(4, 2)).toBe(0.5)
  })

  it('never mirrors or annihilates a piece', () => {
    expect(scaleFactor(2, -4)).toBe(0.01)
    expect(scaleFactor(2, 0)).toBe(0.01)
  })

  it('is identity when the drag started at the pivot', () => {
    expect(scaleFactor(0, 5)).toBe(1)
  })
})
