import { describe, expect, it } from 'bun:test'
import {
  NO_TRANSFORMS,
  angleOnPlane,
  axisClosestApproach,
  axisVector,
  noTransforms,
  otherAxes,
  rayPerpendicularDistance,
  rayPlanePoint,
  scaleFactor,
  snap,
  snapVec3,
  wrapDegrees,
} from './handles'
import type { EditorRay } from './input/pointer'
import type { Vec3 } from '../format/types'

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

describe('rayPlanePoint', () => {
  it('finds where a ray crosses the plane with a given normal', () => {
    // Straight down onto the XZ plane (normal Y) through the origin.
    const hit = rayPlanePoint([0, 0, 0], 'y', { origin: [3, 5, -2], direction: [0, -1, 0] })
    expect(hit).toEqual([3, 0, -2])
  })

  it('measures the plane from the handle origin, not the world origin', () => {
    const hit = rayPlanePoint([0, 4, 0], 'y', { origin: [1, 9, 1], direction: [0, -1, 0] })
    expect(hit).toEqual([1, 4, 1])
  })

  it('returns null when the ray runs ALONG the plane', () => {
    // No crossing exists; inventing one sends the piece to infinity.
    expect(rayPlanePoint([0, 0, 0], 'y', { origin: [0, 1, 0], direction: [1, 0, 0] })).toBeNull()
  })

  it('returns null when the plane is behind the pointer', () => {
    expect(rayPlanePoint([0, 0, 0], 'y', { origin: [0, 5, 0], direction: [0, 1, 0] })).toBeNull()
  })

  it('agrees with the angle the rotation ring reads', () => {
    // One solve behind both, so a plane pad and a ring can never disagree about
    // where the pointer is.
    const ray = { origin: [2, 5, 2] as Vec3, direction: [0, -1, 0] as Vec3 }
    const hit = rayPlanePoint([0, 0, 0], 'y', ray)!
    expect(angleOnPlane([0, 0, 0], 'y', ray)).toBeCloseTo(
      (Math.atan2(hit[2], hit[0]) * 180) / Math.PI,
      9
    )
  })
})

describe('rayPerpendicularDistance', () => {
  it('is the distance from the point to the closest place on the ray', () => {
    // The centre grip's reading: pull away from the widget and it grows.
    expect(
      rayPerpendicularDistance([0, 0, 0], { origin: [3, 0, 10], direction: [0, 0, -1] })
    ).toBeCloseTo(3, 9)
  })

  it('is zero when the ray goes straight through', () => {
    expect(
      rayPerpendicularDistance([0, 0, 0], { origin: [0, 0, 10], direction: [0, 0, -1] })
    ).toBeCloseTo(0, 9)
  })

  it('needs no axis and no camera, so it reads the same from a hand', () => {
    // Same point, ray coming from somewhere else entirely.
    const fromAbove = rayPerpendicularDistance([0, 0, 0], { origin: [0, 9, 4], direction: [0, -1, 0] })
    expect(fromAbove).toBeCloseTo(4, 9)
  })
})

describe('otherAxes', () => {
  it('names the two axes that are not this one', () => {
    expect(otherAxes('x')).toEqual(['y', 'z'])
    expect(otherAxes('y')).toEqual(['z', 'x'])
    expect(otherAxes('z')).toEqual(['x', 'y'])
  })

  it('is what both the plane pads and secondary-scale are built on', () => {
    // A pad's axis is its NORMAL, so the axes it moves you along are the others
    // — the same pair the secondary button scales.
    for (const axis of ['x', 'y', 'z'] as const) {
      expect(otherAxes(axis)).not.toContain(axis)
      expect(new Set(otherAxes(axis)).size).toBe(2)
    }
  })
})

describe('noTransforms', () => {
  it('is true only when the widget would draw nothing', () => {
    expect(noTransforms(NO_TRANSFORMS)).toBe(true)
    expect(noTransforms({ translate: false, rotate: true, scale: false })).toBe(false)
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
