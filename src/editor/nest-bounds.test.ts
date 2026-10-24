import { describe, expect, it } from "bun:test";
import { NestBounds } from "./nest-bounds.js";
import type { Box } from "./nest-bounds.js";

const box = (x0: number, x1: number): Box => ({
  min: { x: x0, y: 0, z: 0 },
  max: { x: x1, y: 1, z: 1 },
});
const body = (b: Box) => {
  const out = { calls: 0, getHierarchyBoundingVectors: () => (out.calls++, b) };
  return out;
};
const origin = { x: 0, y: 0, z: 0 };

describe("a nested piece's box (#3440)", () => {
  it("is not cached while a child's mesh is still loading", () => {
    const nest = new NestBounds();
    const build = {};
    const slow: { mesh?: unknown } = {};
    const children = [{ node: body(box(0, 1)) }, { element: slow }];
    expect(nest.measure(build, "rig", children, origin)?.max.x).toBe(1);
    // The library arrives: the box grows to enclose it.
    slow.mesh = body(box(5, 9));
    expect(nest.measure(build, "rig", children, origin)?.max.x).toBe(9);
  });

  it("is cached once every child has its body, and follows the anchor", () => {
    // The companion: a cache that never held would pass the test above.
    const nest = new NestBounds();
    const build = {};
    const quick = body(box(0, 2));
    const children = [{ element: { mesh: quick } }];
    nest.measure(build, "rig", children, origin);
    const moved = nest.measure(build, "rig", children, { x: 3, y: 0, z: 0 });
    expect(quick.calls).toBe(1);
    expect(moved?.min.x).toBe(3);
    expect(moved?.max.x).toBe(5);
  });

  it("measures again for a new build, or after clear()", () => {
    const nest = new NestBounds();
    const b = body(box(0, 1));
    const children = [{ node: b }];
    nest.measure({}, "rig", children, origin);
    nest.measure({}, "rig", children, origin);
    nest.clear();
    nest.measure(undefined, "rig", children, origin);
    expect(b.calls).toBe(3);
  });
});
