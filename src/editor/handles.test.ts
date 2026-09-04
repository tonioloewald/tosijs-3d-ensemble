import { describe, expect, it } from "bun:test";
import {
  NO_TRANSFORMS,
  RING_BASIS,
  angleAboutAxis,
  axisClosestApproach,
  axisVector,
  noTransforms,
  normaliseDegrees,
  otherAxes,
  rayPerpendicularDistance,
  rayPlanePoint,
  scaleFactor,
  snap,
  snapVec3,
  wrapDegrees,
} from "./handles.js";
import type { EditorRay } from "./input/pointer.js";
import type { Vec3 } from "../format/types.js";

const ray = (
  origin: [number, number, number],
  direction: [number, number, number]
): EditorRay => ({
  origin,
  direction,
});

describe("axisClosestApproach", () => {
  it("finds where a ray crosses an axis", () => {
    // Looking down -Z at the point x=4 on the X axis.
    const t = axisClosestApproach(
      [0, 0, 0],
      axisVector("x"),
      ray([4, 0, 10], [0, 0, -1])
    );
    expect(t).toBeCloseTo(4, 6);
  });

  it("measures from the handle origin, not the world origin", () => {
    const t = axisClosestApproach(
      [10, 0, 0],
      axisVector("x"),
      ray([14, 0, 10], [0, 0, -1])
    );
    expect(t).toBeCloseTo(4, 6);
  });

  it("returns null when the ray is parallel to the axis", () => {
    // Dragging an axis you are looking straight down has no answer. Inventing
    // one sends the piece to infinity.
    expect(
      axisClosestApproach([0, 0, 0], axisVector("x"), ray([0, 0, 0], [1, 0, 0]))
    ).toBeNull();
  });

  it("stays parallel-safe at large scene scales", () => {
    // The parallel test is RELATIVE, so a scene measured in kilometres behaves
    // like one measured in metres.
    expect(
      axisClosestApproach([0, 0, 0], [1000, 0, 0], ray([0, 0, 0], [1000, 0, 0]))
    ).toBeNull();
  });
});

describe("angleAboutAxis", () => {
  /*
    Pass WORLD axes and this is the world-plane case, which is how it read when
    it took an `Axis` instead of three vectors. It takes vectors now because
    rotation happens in the object's own frame — see RING_BASIS for which two
    axes span each ring, and why their order is not arbitrary.
  */
  const world = {
    x: [1, 0, 0] as Vec3,
    y: [0, 1, 0] as Vec3,
    z: [0, 0, 1] as Vec3,
  };
  const about = (axis: "x" | "y" | "z", origin: Vec3, r: EditorRay) => {
    const [u, v] = RING_BASIS[axis];
    return angleAboutAxis(origin, world[axis], world[u], world[v], r);
  };

  it("reads an angle around the Y axis in degrees", () => {
    // Crossing the XZ plane at (1,0) is 0°; at (0,1) it is 90°.
    expect(about("y", [0, 0, 0], ray([1, 5, 0], [0, -1, 0]))).toBeCloseTo(0, 9);
    expect(about("y", [0, 0, 0], ray([0, 5, 1], [0, -1, 0]))).toBeCloseTo(
      90,
      9
    );
  });

  it("returns null when the ray runs along the plane", () => {
    expect(about("y", [0, 0, 0], ray([0, 1, 0], [1, 0, 0]))).toBeNull();
  });

  it("returns null when the plane is behind the pointer", () => {
    expect(about("y", [0, 0, 0], ray([0, 5, 0], [0, 1, 0]))).toBeNull();
  });

  it("measures the plane from the handle origin, not the world origin", () => {
    expect(about("y", [0, 4, 0], ray([1, 9, 0], [0, -1, 0]))).toBeCloseTo(0, 9);
  });

  it("turns the same way around every axis", () => {
    // Each ring's basis pair is chosen so the angle grows consistently; get one
    // wrong and that ring drags backwards, which reads as a pointer bug.
    for (const axis of ["x", "y", "z"] as const) {
      const [u, v] = RING_BASIS[axis];
      const origin: Vec3 = [0, 0, 0];
      // A ray aimed at a point one unit along `v` should read +90°.
      const target = world[v];
      const from: Vec3 = [
        target[0] + world[axis][0] * 5,
        target[1] + world[axis][1] * 5,
        target[2] + world[axis][2] * 5,
      ];
      const dir: Vec3 = [-world[axis][0], -world[axis][1], -world[axis][2]];
      expect(about(axis, origin, { origin: from, direction: dir })).toBeCloseTo(
        90,
        6
      );
    }
  });
});

describe("rayPlanePoint", () => {
  it("finds where a ray crosses the plane with a given normal", () => {
    // Straight down onto the XZ plane (normal Y) through the origin.
    const hit = rayPlanePoint([0, 0, 0], "y", {
      origin: [3, 5, -2],
      direction: [0, -1, 0],
    });
    expect(hit).toEqual([3, 0, -2]);
  });

  it("measures the plane from the handle origin, not the world origin", () => {
    const hit = rayPlanePoint([0, 4, 0], "y", {
      origin: [1, 9, 1],
      direction: [0, -1, 0],
    });
    expect(hit).toEqual([1, 4, 1]);
  });

  it("returns null when the ray runs ALONG the plane", () => {
    // No crossing exists; inventing one sends the piece to infinity.
    expect(
      rayPlanePoint([0, 0, 0], "y", { origin: [0, 1, 0], direction: [1, 0, 0] })
    ).toBeNull();
  });

  it("returns null when the plane is behind the pointer", () => {
    expect(
      rayPlanePoint([0, 0, 0], "y", { origin: [0, 5, 0], direction: [0, 1, 0] })
    ).toBeNull();
  });

  it("agrees with the angle the rotation ring reads", () => {
    // The pad and the ring solve the same intersection, so they can never
    // disagree about where the pointer is.
    const r = { origin: [2, 5, 2] as Vec3, direction: [0, -1, 0] as Vec3 };
    const hit = rayPlanePoint([0, 0, 0], "y", r)!;
    const [u, v] = RING_BASIS.y;
    const world = {
      x: [1, 0, 0] as Vec3,
      y: [0, 1, 0] as Vec3,
      z: [0, 0, 1] as Vec3,
    };
    expect(
      angleAboutAxis([0, 0, 0], world.y, world[u], world[v], r)
    ).toBeCloseTo((Math.atan2(hit[2], hit[0]) * 180) / Math.PI, 9);
  });
});

describe("rayPerpendicularDistance", () => {
  it("is the distance from the point to the closest place on the ray", () => {
    // The centre grip's reading: pull away from the widget and it grows.
    expect(
      rayPerpendicularDistance([0, 0, 0], {
        origin: [3, 0, 10],
        direction: [0, 0, -1],
      })
    ).toBeCloseTo(3, 9);
  });

  it("is zero when the ray goes straight through", () => {
    expect(
      rayPerpendicularDistance([0, 0, 0], {
        origin: [0, 0, 10],
        direction: [0, 0, -1],
      })
    ).toBeCloseTo(0, 9);
  });

  it("needs no axis and no camera, so it reads the same from a hand", () => {
    // Same point, ray coming from somewhere else entirely.
    const fromAbove = rayPerpendicularDistance([0, 0, 0], {
      origin: [0, 9, 4],
      direction: [0, -1, 0],
    });
    expect(fromAbove).toBeCloseTo(4, 9);
  });
});

describe("otherAxes", () => {
  it("names the two axes that are not this one", () => {
    expect(otherAxes("x")).toEqual(["y", "z"]);
    expect(otherAxes("y")).toEqual(["z", "x"]);
    expect(otherAxes("z")).toEqual(["x", "y"]);
  });

  it("is what both the plane pads and secondary-scale are built on", () => {
    // A pad's axis is its NORMAL, so the axes it moves you along are the others
    // — the same pair the secondary button scales.
    for (const axis of ["x", "y", "z"] as const) {
      expect(otherAxes(axis)).not.toContain(axis);
      expect(new Set(otherAxes(axis)).size).toBe(2);
    }
  });
});

describe("noTransforms", () => {
  it("is true only when the widget would draw nothing", () => {
    expect(noTransforms(NO_TRANSFORMS)).toBe(true);
    expect(noTransforms({ translate: false, rotate: true, scale: false })).toBe(
      false
    );
  });
});

describe("snapping", () => {
  it("quantises to a step", () => {
    expect(snap(4.4, 1)).toBe(4);
    expect(snap(4.6, 1)).toBe(5);
    expect(snap(7, 5)).toBe(5);
  });

  it("treats a zero or negative step as no snapping", () => {
    expect(snap(4.4, 0)).toBe(4.4);
    expect(snap(4.4, -1)).toBe(4.4);
  });

  it("snaps the VALUE, so a long drag cannot accumulate error", () => {
    // Sixty snapped deltas is not the same as one snapped total: stepping the
    // delta walks a piece off the grid over a long drag.
    let stepped = 0;
    for (let i = 0; i < 60; i++) stepped += snap(0.6, 1);
    expect(stepped).toBe(60);
    expect(snap(0.6 * 60, 1)).toBe(36);
  });

  it("snaps each component of a position", () => {
    expect(snapVec3([1.2, 4.7, -3.4], 1)).toEqual([1, 5, -3]);
  });
});

describe("wrapDegrees", () => {
  it("wraps across the ±180 seam", () => {
    // Unwrapped, this difference is a 359° jump and the piece spins the long
    // way round for one frame.
    expect(wrapDegrees(370)).toBe(10);
    expect(wrapDegrees(-190)).toBe(170);
    expect(wrapDegrees(180)).toBe(180);
    expect(wrapDegrees(-180)).toBe(180);
  });
});

describe("scaleFactor", () => {
  it("is a ratio of drag distances", () => {
    expect(scaleFactor(2, 4)).toBe(2);
    expect(scaleFactor(4, 2)).toBe(0.5);
  });

  it("never mirrors or annihilates a piece", () => {
    expect(scaleFactor(2, -4)).toBe(0.01);
    expect(scaleFactor(2, 0)).toBe(0.01);
  });

  it("is identity when the drag started at the pivot", () => {
    expect(scaleFactor(0, 5)).toBe(1);
  });
});

describe("normaliseDegrees", () => {
  it("brings an angle into 0..360", () => {
    expect(normaliseDegrees(-40)).toBeCloseTo(320, 9);
    expect(normaliseDegrees(400)).toBeCloseTo(40, 9);
    expect(normaliseDegrees(-400)).toBeCloseTo(320, 9);
  });

  it("spells a full turn as 0", () => {
    expect(normaliseDegrees(360)).toBe(0);
    expect(normaliseDegrees(-360)).toBe(0);
    expect(normaliseDegrees(720)).toBe(0);
  });

  it("has no negative zero to leak into a file", () => {
    expect(Object.is(normaliseDegrees(-0), 0)).toBe(true);
  });

  it("leaves an angle already in range alone", () => {
    expect(normaliseDegrees(0)).toBe(0);
    expect(normaliseDegrees(180)).toBe(180);
    expect(normaliseDegrees(359.5)).toBeCloseTo(359.5, 9);
  });

  it("is NOT what a delta uses", () => {
    /*
      A stored angle has no direction to preserve; a delta does. Turning back
      five degrees is -5, and storing that as 355 would send the piece the long
      way round — so `wrapDegrees` keeps the signed wrap for deltas and this is
      only ever applied to the value that lands in the file.
    */
    expect(wrapDegrees(-5)).toBe(-5);
    expect(normaliseDegrees(-5)).toBe(355);
  });
});
