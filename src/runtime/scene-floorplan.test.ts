import { describe, expect, it } from "bun:test";
import { sceneFloorplan, floorplanDiff } from "./scene-floorplan.js";

/*
  THE COMPARISON IS A FUNCTION, so it belongs in the fast tier.

  This is the split the fence RFC argues for, in one module: taking the
  snapshot needs a real renderer (a fence), but deciding what changed between
  two of them is pure data and runs here in a millisecond. A structural diff
  that needed a browser to be tested would be a worse version of the image
  comparison it replaces.
*/
const mesh = (
  name: string,
  at: [number, number, number],
  size: [number, number, number] = [1, 1, 1]
) => ({
  name,
  getBoundingInfo: () => ({
    boundingBox: {
      centerWorld: { x: at[0], y: at[1], z: at[2] },
      extendSizeWorld: { x: size[0], y: size[1], z: size[2] },
    },
  }),
});

const scene = (meshes: unknown[]) => ({ meshes });

describe("sceneFloorplan", () => {
  it("records what is drawn, at world geometry", () => {
    const plan = sceneFloorplan(
      scene([mesh("ground", [0, 0, 0], [200, 0, 200])])
    );
    expect(plan).toEqual([
      { name: "ground", at: [0, 0, 0], size: [200, 0, 200] },
    ]);
  });

  it("is stable against DRAW ORDER, which is not a visual difference", () => {
    // Material batching and insertion sequence both reorder this, and neither
    // changes the picture. An unsorted snapshot would report a diff nobody
    // can see, which is how a structural check earns the reputation an image
    // diff already has.
    const a = sceneFloorplan(
      scene([mesh("b", [0, 0, 0]), mesh("a", [1, 0, 0])])
    );
    const c = sceneFloorplan(
      scene([mesh("a", [1, 0, 0]), mesh("b", [0, 0, 0])])
    );
    expect(a).toEqual(c);
  });

  it("skips a mesh with no geometry rather than inventing one", () => {
    expect(sceneFloorplan(scene([{ name: "ghost" }]))).toEqual([]);
  });

  it("can ignore the editor's own furniture", () => {
    const plan = sceneFloorplan(
      scene([
        mesh("ensemble-editor-handle-x", [0, 0, 0]),
        mesh("keep", [0, 0, 0]),
      ]),
      { ignore: /^ensemble-editor-/ }
    );
    expect(plan.map((r) => r.name)).toEqual(["keep"]);
  });

  it("survives a scene that is not one", () => {
    expect(sceneFloorplan(null)).toEqual([]);
    expect(sceneFloorplan({})).toEqual([]);
  });
});

describe("floorplanDiff", () => {
  const base = sceneFloorplan(
    scene([mesh("ground", [0, 0, 0], [200, 0, 200]), mesh("tower", [4, 2, 0])])
  );

  it("says nothing when nothing moved", () => {
    expect(floorplanDiff(base, base)).toEqual([]);
  });

  it("IGNORES a difference too small to see — the 'or very nearly'", () => {
    /*
      The whole non-flakiness claim. A rebuild that lands a piece 1/10 000 of a
      metre from where it was has not changed the picture, and a check that
      says otherwise is one people stop believing — which is exactly what
      happens to pixel comparison when antialiasing moves.
    */
    const nudged = sceneFloorplan(
      scene([
        mesh("ground", [0, 0, 0], [200, 0, 200]),
        mesh("tower", [4.0001, 2, 0]),
      ])
    );
    expect(floorplanDiff(base, nudged)).toEqual([]);
  });

  it("NAMES what moved, and by how much", () => {
    const moved = sceneFloorplan(
      scene([
        mesh("ground", [0, -12, 0], [200, 0, 200]),
        mesh("tower", [4, 2, 0]),
      ])
    );
    expect(floorplanDiff(base, moved)).toEqual([
      { name: "ground", kind: "moved", before: [0, 0, 0], after: [0, -12, 0] },
    ]);
  });

  it("reports a piece that stopped being drawn", () => {
    const gone = sceneFloorplan(
      scene([mesh("ground", [0, 0, 0], [200, 0, 200])])
    );
    expect(floorplanDiff(base, gone)).toEqual([
      { name: "tower", kind: "removed" },
    ]);
  });

  it("reports one that appeared", () => {
    const extra = sceneFloorplan(
      scene([
        mesh("ground", [0, 0, 0], [200, 0, 200]),
        mesh("tower", [4, 2, 0]),
        mesh("barrel", [1, 0, 1]),
      ])
    );
    expect(floorplanDiff(base, extra)).toEqual([
      { name: "barrel", kind: "added" },
    ]);
  });

  it("counts repeats rather than pairing them up", () => {
    // "There are two fewer barrels" is the sentence a reader wants. Matching
    // individual barrels would invent a correspondence the scene never had.
    const three = sceneFloorplan(
      scene([
        mesh("barrel", [0, 0, 0]),
        mesh("barrel", [1, 0, 0]),
        mesh("barrel", [2, 0, 0]),
      ])
    );
    const one = sceneFloorplan(scene([mesh("barrel", [0, 0, 0])]));
    expect(floorplanDiff(three, one)).toEqual([
      { name: "barrel", kind: "removed" },
    ]);
  });

  it("distinguishes a RESIZE from a move", () => {
    const bigger = sceneFloorplan(
      scene([
        mesh("ground", [0, 0, 0], [400, 0, 400]),
        mesh("tower", [4, 2, 0]),
      ])
    );
    expect(floorplanDiff(base, bigger)).toEqual([
      {
        name: "ground",
        kind: "resized",
        before: [200, 0, 200],
        after: [400, 0, 400],
      },
    ]);
  });
});

describe("same-named meshes are paired by PLACE, not by order", () => {
  /*
    The 0.3.0 review's M4. `sceneFloorplan` sorts by name only and `Array.sort`
    is stable, so same-named records keep SCENE order — which the module's own
    comment calls non-visual and refuses to report on. Pairing by index put it
    straight back: a pixel-identical picture reported two `moved` changes.
  */
  const rec = (name: string, at: [number, number, number]) => ({
    name,
    at,
    size: [1, 1, 1] as [number, number, number],
  });

  it("reports nothing when two barrels swap creation order", () => {
    const before = [rec("barrel", [0, 0, 0]), rec("barrel", [10, 0, 0])];
    const after = [rec("barrel", [10, 0, 0]), rec("barrel", [0, 0, 0])];
    expect(floorplanDiff(before, after)).toEqual([]);
  });

  it("still reports a barrel that genuinely moved", () => {
    // The companion. Without it the fix could pass by reporting nothing ever,
    // which is the failure mode one layer down from the one it repairs.
    const before = [rec("barrel", [0, 0, 0]), rec("barrel", [10, 0, 0])];
    const after = [rec("barrel", [0, 0, 0]), rec("barrel", [10, 0, 5])];
    const changes = floorplanDiff(before, after);
    expect(changes).toEqual([
      { name: "barrel", kind: "moved", before: [10, 0, 0], after: [10, 0, 5] },
    ]);
  });

  it("reports a resize at an unchanged place", () => {
    const before = [rec("crate", [0, 0, 0])];
    const after = [{ ...rec("crate", [0, 0, 0]), size: [2, 1, 1] as [number, number, number] }];
    expect(floorplanDiff(before, after)).toEqual([
      { name: "crate", kind: "resized", before: [1, 1, 1], after: [2, 1, 1] },
    ]);
  });
});
