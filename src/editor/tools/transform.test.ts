import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  MOVE_CELL,
  SCALE_CELL,
  SELECT_CELL,
  TURN_CELL,
  registerTransformTool,
  resolveGrab,
  resolveToolCells,
  transformsOf,
} from "./transform";
import { getTool, unregisterTool } from "./tool-registry";
import type { ToolContext } from "./tool-registry";
import type { Grip } from "../handles";
import type { Gesture, EditorPointer, EditorRay } from "../input/pointer";
import type { Ensemble, Vec3 } from "../../format/types";
import type { WritableBody } from "../transform-write";

const pointer = (
  ray: EditorRay | null,
  hand: Vec3 | null = null,
  secondary = false
): EditorPointer => ({
  id: "primary",
  kind: hand ? "xr" : "flat",
  ray: () => ray,
  grip: () => hand,
  active: true,
  secondary,
});

const gestureWith = (
  ray: EditorRay | null,
  hand: Vec3 | null = null,
  secondary = false
): Gesture => ({
  primary: pointer(ray, hand, secondary),
  helper: null,
  startRay: ray,
  startGrip: hand,
});

/** Looking down -Z at a given x — so the X axis reads that x directly. */
const rayAtX = (x: number): EditorRay => ({
  origin: [x, 0, 10],
  direction: [0, 0, -1],
});
/**
 * Looking down -Z at a given y — so the Y axis reads that y directly.
 *
 * A Y-axis drag needs a ray that MOVES in y: `rayAtX` slides sideways, whose
 * closest approach to the Y axis is zero wherever you put it, so the drag
 * correctly reads no movement at all.
 */
const rayAtY = (y: number): EditorRay => ({
  origin: [0, y, 10],
  direction: [0, 0, -1],
});
/** Looking straight down from above at a given x/z — crosses the XZ plane there. */
const down = (x: number, z: number): EditorRay => ({
  origin: [x, 5, z],
  direction: [0, -1, 0],
});

let ensemble: Ensemble;
let body: WritableBody;
let selectedId: string | null;
let picked: string | null;

const ctx = (options: Record<string, unknown> = {}): ToolContext =>
  ({
    ensemble,
    selection: ensemble.pieces.find((p) => p.id === selectedId) ?? null,
    select: (id: string | null) => (selectedId = id),
    scene: {} as never,
    edit: (
      _d: string,
      mutate: (e: Ensemble) => void,
      opts?: { rebuild?: boolean }
    ) => {
      editOptions.push(opts);
      mutate(ensemble);
    },
    options: {
      cells: [SELECT_CELL, MOVE_CELL, TURN_CELL, SCALE_CELL],
      gridSnap: 0,
      angleSnap: 0,
      duplicate: false,
      ...options,
    },
    pick: () => picked,
    pickPoint: () => null,
    captureCamera: () => {},
    undo: () => {},
    redo: () => {},
    canUndo: () => false,
    canRedo: () => false,
    meshNames: () => [],
    meshCatalog: () => [],
  } as ToolContext);

/** Re-register with a fixed answer for what the ray grabs. */
const withGrip = (grip: Grip | null) => {
  unregisterTool("select");
  registerTransformTool({
    nearGrip: () => null,
    farGrip: () => grip,
    bodyOf: () => body,
    worldOrigin: () => [0, 0, 0],
    // An unturned piece, so its axes ARE the world's. The rotated case is
    // checked in a browser, where the node's world matrix is the only honest
    // source for them.
    axisDirection: (axis) =>
      axis === "x" ? [1, 0, 0] : axis === "y" ? [0, 1, 0] : [0, 0, 1],
    /*
      An unturned piece, where composing about its own axis reduces to adding
      to the matching euler component. The turned case cannot be checked here
      without re-implementing Babylon's euler order, which is exactly what the
      hook exists to avoid — it is verified in a browser instead, by output.
    */
    composeRotation: (start, axis, degrees) => {
      const i = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      const out = [...start] as [number, number, number];
      out[i] = start[i]! + degrees;
      return out;
    },
  });
};

beforeEach(() => {
  editOptions = [];
  ensemble = {
    name: "test",
    pieces: [{ id: "rock", mesh: "Rock", at: [0, 0, 0] }],
  };
  selectedId = "rock";
  picked = null;
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
  };
  withGrip({ kind: "translate", axis: "x" });
});

afterEach(() => unregisterTool("select"));

let editOptions: Array<{ rebuild?: boolean } | undefined> = [];

const tool = () => getTool("select")!;
const run = (
  rays: EditorRay[],
  c: ToolContext,
  hand: Vec3 | null = null,
  secondary = false
) => {
  tool().onGesture!.start!(gestureWith(rays[0]!, hand, secondary), c);
  for (const ray of rays.slice(1))
    tool().onGesture!.move!(gestureWith(ray, hand, secondary), c);
  tool().onGesture!.end!(
    gestureWith(rays[rays.length - 1]!, hand, secondary),
    c
  );
};

describe("transformsOf", () => {
  it("reads the lit cells", () => {
    expect(transformsOf({ cells: [SELECT_CELL] })).toEqual({
      translate: false,
      rotate: false,
      scale: false,
    });
    expect(transformsOf({ cells: [SELECT_CELL, MOVE_CELL] })).toEqual({
      translate: true,
      rotate: false,
      scale: false,
    });
    expect(
      transformsOf({ cells: [SELECT_CELL, MOVE_CELL, TURN_CELL] })
    ).toEqual({
      translate: true,
      rotate: true,
      scale: false,
    });
    expect(transformsOf({ cells: [SELECT_CELL, SCALE_CELL] })).toEqual({
      translate: false,
      rotate: false,
      scale: true,
    });
  });

  it("lights select, move and turn when nothing has been chosen", () => {
    expect(transformsOf({})).toEqual({
      translate: true,
      rotate: true,
      scale: false,
    });
  });
});

describe("resolveToolCells — scale is exclusive, the other two compose", () => {
  /*
    Not a preference. `node.scaling` is local, so scale grips ride the piece's
    axes while move and turn ride the world's; a widget showing both draws two
    frames at once and can only mislead.
  */
  it("turns move and turn off when scale goes on", () => {
    expect(
      resolveToolCells({
        index: SCALE_CELL,
        selection: [SELECT_CELL, MOVE_CELL, TURN_CELL, SCALE_CELL],
      })
    ).toEqual([SELECT_CELL, SCALE_CELL]);
  });

  it("turns scale off when move goes on", () => {
    expect(
      resolveToolCells({
        index: MOVE_CELL,
        selection: [SELECT_CELL, SCALE_CELL, MOVE_CELL],
      })
    ).toEqual([SELECT_CELL, MOVE_CELL]);
  });

  it("turns scale off when turn goes on", () => {
    expect(
      resolveToolCells({
        index: TURN_CELL,
        selection: [SELECT_CELL, SCALE_CELL, TURN_CELL],
      })
    ).toEqual([SELECT_CELL, TURN_CELL]);
  });

  it("lets move and turn coexist", () => {
    expect(
      resolveToolCells({
        index: TURN_CELL,
        selection: [SELECT_CELL, MOVE_CELL, TURN_CELL],
      })
    ).toEqual([SELECT_CELL, MOVE_CELL, TURN_CELL]);
  });

  it("does not fight a cell being turned OFF", () => {
    // Un-lighting scale must not resurrect move and turn — the rule is about
    // what cannot be on together, not about keeping something on.
    expect(
      resolveToolCells({ index: SCALE_CELL, selection: [SELECT_CELL] })
    ).toEqual([SELECT_CELL]);
  });

  it("leaves select alone whatever else happens", () => {
    // Select is what a press means when it grabs no handle, which stays true.
    for (const index of [MOVE_CELL, TURN_CELL, SCALE_CELL]) {
      expect(
        resolveToolCells({ index, selection: [SELECT_CELL, index] })
      ).toContain(SELECT_CELL);
    }
  });
});

describe("resolveGrab", () => {
  it("prefers a hand INSIDE a handle over whatever its ray crosses", () => {
    // A hand in a handle is unambiguous; the same controller's ray is usually
    // also crossing something further away, and honouring that instead is how a
    // near grab feels like it "missed".
    const grip = resolveGrab(
      gestureWith(rayAtX(0), [0.05, 0, 0]),
      () => ({ kind: "rotate", axis: "y" }),
      () => ({ kind: "translate", axis: "x" })
    );
    expect(grip).toEqual({ kind: "rotate", axis: "y" });
  });

  it("falls back to the ray when no hand is near", () => {
    const grip = resolveGrab(
      gestureWith(rayAtX(0), [9, 9, 9]),
      () => null,
      () => ({ kind: "scale", axis: "z" })
    );
    expect(grip).toEqual({ kind: "scale", axis: "z" });
  });

  it("grabs nothing when there is no ray and no hand", () => {
    expect(
      resolveGrab(
        gestureWith(null),
        () => null,
        () => ({ kind: "uniform" })
      )
    ).toBeNull();
  });
});

describe("select and transform are ONE tool", () => {
  it("selects what the gesture hit when no handle was grabbed", () => {
    withGrip(null);
    picked = "other-rock";
    run([rayAtX(0)], ctx());
    expect(selectedId).toBe("other-rock");
  });

  it("deselects on empty space", () => {
    withGrip(null);
    picked = null;
    run([rayAtX(0)], ctx());
    expect(selectedId).toBeNull();
  });

  it("does NOT change the selection when a handle was dragged", () => {
    // Dragging the widget must not reselect whatever is behind it — which is
    // usually the ground, and would drop the selection mid-edit.
    picked = "something-else";
    run([rayAtX(0), rayAtX(3)], ctx());
    expect(selectedId).toBe("rock");
  });

  it("selects even with nothing currently selected, so there is a way back in", () => {
    selectedId = null;
    withGrip(null);
    picked = "rock";
    run([rayAtX(0)], ctx());
    // Cast: assigning null above narrows the binding, and the point of the test
    // is precisely that the tool widened it again.
    expect(selectedId as string | null).toBe("rock");
  });
});

describe("a press that did not drag is a click", () => {
  it("falls through to selection when a grabbed handle never moved", () => {
    /*
      With everything on, the widget and its deliberately fat pick targets cover
      much of what is behind them, so tapping the piece BESIDE a selection
      usually lands on a handle. Before this, that gesture grabbed a grip, moved
      nothing, committed nothing and swallowed the tap — "select seems a bit
      unreliable… hard to touch outside the widget once something is selected".
    */
    picked = "another-piece";
    const c = ctx();
    // grab a handle, then release without ever moving
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c);
    tool().onGesture!.end!(gestureWith(rayAtX(0)), c);
    expect(selectedId).toBe("another-piece");
  });

  it("still commits when the drag actually moved something", () => {
    picked = "another-piece";
    run([rayAtX(0), rayAtX(3)], ctx());
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 0]);
    expect(selectedId).toBe("rock"); // and does NOT reselect what is behind
  });

  it("does NOT hand the selection away when a real drag snapped back", () => {
    /*
      A nudge smaller than one grid step commits nothing — but it was a drag,
      not a click. Treating it as a click gives the selection to whatever is
      behind the widget, which is what "clicking a foreground object trumps
      clicking on the transform affordances" felt like: every small movement
      quietly reselected the scenery underneath.
    */
    picked = "another-piece";
    run([rayAtX(0), rayAtX(0.2)], ctx({ gridSnap: 1 }));
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0]); // nothing committed
    expect(selectedId).toBe("rock"); // and the selection is untouched
  });
});

describe("translate", () => {
  it("moves the piece by the pointer delta and writes the JSON on release", () => {
    const c = ctx();
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c);
    tool().onGesture!.move!(gestureWith(rayAtX(3)), c);
    // Live body follows during the drag...
    expect((body.element as { x: number }).x).toBeCloseTo(3, 6);
    tool().onGesture!.end!(gestureWith(rayAtX(3)), c);
    // ...and the JSON is the truth afterwards.
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 0]);
  });

  it("snaps the resulting VALUE to the grid", () => {
    run([rayAtX(0), rayAtX(2.6)], ctx({ gridSnap: 1 }));
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 0]);
  });

  it("ignores a drag with nothing selected", () => {
    selectedId = null;
    run([rayAtX(0), rayAtX(4)], ctx());
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0]);
  });

  it("converts world metres to LOCAL units on a scaled ensemble", () => {
    /*
      A drag measures in world space — that is where the pointer and the handles
      are — and writes `piece.at`, which is local. On an ensemble with
      `scale: 2` a three-metre drag is one and a half local units. Every sample
      ensemble happens to be scale 1, which is the only reason this never
      showed up as a wrong-feeling drag.
    */
    ensemble.scale = 2;
    run([rayAtX(0), rayAtX(3)], ctx());
    expect(ensemble.pieces[0]!.at).toEqual([1.5, 0, 0]);
  });

  it("writes the world delta back to the live body at ensemble scale", () => {
    // The body lives in world space, so the local value has to scale back up or
    // the piece drifts away from the pointer as you drag.
    ensemble.scale = 2;
    const c = ctx();
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c);
    tool().onGesture!.move!(gestureWith(rayAtX(3)), c);
    expect((body.element as { x: number }).x).toBeCloseTo(3, 6);
  });

  it("writes no rotation or scale, so a nudge cannot stamp defaults", () => {
    run([rayAtX(0), rayAtX(2)], ctx());
    expect(ensemble.pieces[0]!.rot).toBeUndefined();
    expect(ensemble.pieces[0]!.scale).toBeUndefined();
  });
});

describe("planar translate", () => {
  it("moves in both in-plane axes and leaves the normal alone", () => {
    // The XZ pad: normal is Y, so a drag across it changes x and z only.
    withGrip({ kind: "planar", axis: "y" });
    run([down(1, 1), down(4, -2)], ctx());
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, -3]);
  });

  it("snaps the plane drag like any other move", () => {
    withGrip({ kind: "planar", axis: "y" });
    run([down(0, 0), down(2.6, 1.2)], ctx({ gridSnap: 1 }));
    expect(ensemble.pieces[0]!.at).toEqual([3, 0, 1]);
  });
});

describe("rotate", () => {
  it("writes rotation in degrees, snapped, and leaves position alone", () => {
    // Grab the Y ring: a ray straight down is PARALLEL to the X ring's plane,
    // and that drag correctly refuses to start rather than inventing an angle.
    withGrip({ kind: "rotate", axis: "y" });
    // Around Y: the ray crossing the XZ plane at (1,0) reads 0°, at (0,1) 90°.
    run([down(1, 0), down(0, 1)], ctx({ angleSnap: 15 }));
    expect(ensemble.pieces[0]!.rot).toEqual([0, 90, 0]);
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0]);
  });
});

describe("scale", () => {
  it("stretches ONE axis and writes a triple", () => {
    withGrip({ kind: "scale", axis: "x" });
    run([rayAtX(2), rayAtX(4)], ctx());
    expect(ensemble.pieces[0]!.scale).toEqual([2, 1, 1]);
  });

  it("with the secondary button, scales the OTHER two axes", () => {
    // "Thinner without getting shorter" is the same reach, one modifier apart.
    withGrip({ kind: "scale", axis: "y" });
    run([rayAtY(2), rayAtY(4)], ctx(), null, true);
    expect(ensemble.pieces[0]!.scale).toEqual([2, 1, 2]);
  });

  it("latches the modifier at the GRAB, so the axes cannot change mid-drag", () => {
    withGrip({ kind: "scale", axis: "y" });
    const c = ctx();
    // Grab without the modifier, then release with it held.
    tool().onGesture!.start!(gestureWith(rayAtY(2), null, false), c);
    tool().onGesture!.move!(gestureWith(rayAtY(4), null, true), c);
    tool().onGesture!.end!(gestureWith(rayAtY(4), null, true), c);
    expect(ensemble.pieces[0]!.scale).toEqual([1, 2, 1]);
  });

  it("writes a plain NUMBER when the result is uniform", () => {
    // A file that said `scale: 2` should still say `scale: 2` after a uniform
    // drag, not `[2, 2, 2]` — the narrow spelling is the canonical one.
    withGrip({ kind: "uniform" });
    run(
      [
        { origin: [2, 0, 10], direction: [0, 0, -1] },
        { origin: [6, 0, 10], direction: [0, 0, -1] },
      ],
      ctx()
    );
    expect(ensemble.pieces[0]!.scale).toBe(3);
  });

  it("starts from the piece's existing per-axis scale", () => {
    ensemble.pieces[0]!.scale = [2, 3, 4];
    withGrip({ kind: "scale", axis: "x" });
    run([rayAtX(1), rayAtX(2)], ctx());
    expect(ensemble.pieces[0]!.scale).toEqual([4, 3, 4]);
  });

  it("never mirrors a piece by dragging past the pivot", () => {
    withGrip({ kind: "scale", axis: "x" });
    run([rayAtX(2), rayAtX(-8)], ctx());
    const scale = ensemble.pieces[0]!.scale as number[];
    expect(scale[0]).toBeGreaterThan(0);
  });
});

describe("copy on drag", () => {
  it("copies on RELEASE, leaving the original where it was", () => {
    // Cloning at drag START would need a rebuild mid-gesture, which disposes
    // the very node under the author's hand.
    run([rayAtX(0), rayAtX(5)], ctx({ duplicate: true, gridSnap: 1 }));

    expect(ensemble.pieces).toHaveLength(2);
    expect(ensemble.pieces[0]!.at).toEqual([0, 0, 0]); // original untouched
    expect(ensemble.pieces[1]!.at).toEqual([5, 0, 0]);
    expect(ensemble.pieces[1]!.id).not.toBe("rock");
    expect(selectedId).toBe(ensemble.pieces[1]!.id); // the copy is now selected
  });
});

/*
  THE MEASURING FRAME MUST NOT MOVE WHILE YOU DRAG.

  `axisDirection` reads the piece's LIVE orientation off its node, so a rotate
  drag that consults it every frame measures against a basis its own output just
  turned: measure, apply, the frame has moved, measure again. That is a feedback
  loop, and it presented as "a tiny movement spins the thing hundreds of
  degrees" — not as instability at any particular viewing angle, which is what
  sent me looking in the wrong place first.

  Pinning the CALL COUNT rather than the resulting angle, because the angle is
  Babylon's to compute and the hook exists precisely so these tests do not
  re-implement it. Consulted once per drag is the whole property.
*/
describe("a drag freezes the frame it measures against", () => {
  it("reads the piece's axes at the grab and never again", () => {
    let reads = 0;
    unregisterTool("select");
    registerTransformTool({
      nearGrip: () => null,
      farGrip: () => ({ kind: "rotate", axis: "y" }),
      bodyOf: () => body,
      worldOrigin: () => [0, 0, 0],
      axisDirection: (axis) => {
        reads += 1;
        return axis === "x" ? [1, 0, 0] : axis === "y" ? [0, 1, 0] : [0, 0, 1];
      },
      composeRotation: (start, axis, degrees) => {
        const i = axis === "x" ? 0 : axis === "y" ? 1 : 2;
        const out = [...start] as [number, number, number];
        out[i] = start[i]! + degrees;
        return out;
      },
    });

    const c = ctx();
    c.select({ id: "a" } as never);
    tool().onGesture!.start!(gestureWith(rayAtX(0)), c);
    const atGrab = reads;
    for (const x of [1, 2, 3, 4, 5])
      tool().onGesture!.move!(gestureWith(rayAtX(x)), c);
    tool().onGesture!.end!(gestureWith(rayAtX(5)), c);

    // Three reads at the grab — one per axis — and nothing during the moves.
    expect(atGrab).toBe(3);
    expect(reads).toBe(atGrab);
  });
});

/*
  A DRAG RELEASE MUST NOT REBUILD THE SCENE.

  Rebuilding disposes every piece element and instantiates it again, which for a
  transform commit lands back exactly where the body already is — visible as
  "a slight flash on release". Adding a piece is a different matter and still
  rebuilds.
*/
describe("committing a drag", () => {
  it("does not rebuild, because the body already shows the value", () => {
    withGrip({ kind: "translate", axis: "x" });
    const c = ctx();
    c.select({ id: "a" } as never);
    run([rayAtX(0), rayAtX(3)], c);
    expect(editOptions).toEqual([{ rebuild: false }]);
  });

  it("DOES rebuild when the drag adds a piece", () => {
    withGrip({ kind: "translate", axis: "x" });
    const c = ctx({ duplicate: true });
    c.select({ id: "a" } as never);
    run([rayAtX(0), rayAtX(3)], c);
    // Structural: the new piece has no body until something builds it.
    expect(editOptions).toEqual([undefined]);
  });
});
