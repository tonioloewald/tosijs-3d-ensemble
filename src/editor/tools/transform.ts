/*#
# The select-and-transform tool

**One tool.** Press a piece to select it, press empty space to deselect, and
drag a handle to move, turn or stretch what is selected. Selecting and
transforming were two tools until it became obvious they are one gesture with
two outcomes, decided by *what you grabbed* rather than by what you clicked in a
palette first.

Which transforms are offered is a **setting**, not a mode: `translate`, `rotate`
and `scale` are independent toggles, all **off** by default. Off is a pure
selection tool with no widget in the way; on, every enabled affordance is drawn
at once and the grip you take says what the drag means. See
[[Manipulator handles]] for why that beats a mode switch, and what it costs.

| grip | drag |
|---|---|
| shaft | move along one axis |
| pad | move in a plane, the third axis untouched |
| ring | turn around one axis |
| cube | scale along one axis — **with the secondary button, the other two** |
| centre cube | scale uniformly |

The secondary-button inversion is the one non-obvious binding, and it is worth
it: "make this taller" and "make this thinner without making it shorter" are the
same reach, one modifier apart.

## The drag writes twice, to two different places

- **during** the drag, to the live body, so the piece follows the hand. Which
  body — element or node — is [[Writing a transform]]'s fork, and the wrong
  branch fails silently rather than erroring.
- **on release**, to the ensemble JSON, snapped. The JSON is the truth; the
  scene is a view of it.

The release goes through `ctx.edit`, which **does** rebuild. That was not the
original plan — the idea was to skip the rebuild since the body already holds
the value — but measuring it settled the question the other way: the snap
happens on release, so the body would sit at 3.4 while the JSON said 3, and the
scene would disagree with the data by up to half a grid step after every drag.
Rebuilding costs a dispose-and-build per drag and buys exact agreement.

It is safe here because the rebuild happens AFTER the gesture ended. Rebuilding
*during* a drag would dispose the very node under the author's hand, which is
why copy-on-drag also defers to release.

## Duplicate-on-drag copies on RELEASE

Cloning at the start would mean rebuilding mid-gesture to bring the copy into
the scene, which disposes the node being dragged. Copying on release leaves the
original where it was and puts the copy at the dragged transform — the same
outcome, without pulling the floor out from under the drag.
*/
/*{"parent":"Editing","order":4}*/
import {
  RING_BASIS,
  angleAboutAxis,
  axisClosestApproach,
  axisIndex,
  axisVector,
  otherAxes,
  rayPerpendicularDistance,
  rayPlanePoint,
  scaleFactor,
  normaliseDegrees,
  snap,
  snapVec3,
  wrapDegrees,
} from "../handles";
import { narrowScale, scaleVector } from "../../format/scale";
import { writeTransform } from "../transform-write";
import type { WritableBody } from "../transform-write";
import { registerTool } from "./tool-registry";
import { uniqueId } from "./built-in";
import type { Axis, Grip, TransformSet } from "../handles";
import type { Gesture } from "../input/pointer";
import type { ToolContext } from "./tool-registry";
import type { Euler, Piece, Vec3 } from "../../format/types";

/** What a drag needs to remember between its start and its end. */
interface Drag {
  grip: Grip;
  pieceId: string;
  /** The piece's authored transform when the drag began. */
  startAt: Vec3;
  startRot: Euler;
  startScale: Vec3;
  /** Where the pointer started, in whatever units this grip drags in. */
  startValue: number | Vec3;
  /**
   * The secondary button as it was AT THE GRAB.
   *
   * Latched, not read live: a modifier that can flip mid-drag means the axes
   * being scaled change under your hand, and the result depends on whether you
   * happened to be holding it when you let go.
   */
  secondary: boolean;
  /**
   * World metres per local unit — the ensemble's own scale.
   *
   * A drag measures in WORLD space (that is where the pointer and the handles
   * are) and writes a LOCAL `at`, so the two disagree by exactly this factor on
   * any ensemble that sets `scale`. Every sample happens to be 1, which is the
   * only reason this never showed up.
   */
  worldPerLocal: number;
  /**
   * Did the pointer ever actually move this?
   *
   * Distinct from "did the committed value change". A drag that travelled and
   * then rounded back to the grid it started on has changed nothing to commit,
   * but it was still a DRAG — treating it as a click hands the selection to
   * whatever is behind the widget, which is how "clicking a foreground object
   * trumps clicking on the transform affordances" happens on every small nudge.
   */
  dragged: boolean;
  /** The transform as it currently stands, in ensemble-local terms. */
  at: Vec3;
  rot: Euler;
  scale: Vec3;
}

let drag: Drag | null = null;

/**
 * The grid's cells, in order. Index IS the identity — `handleChange` speaks in
 * indices, so this array and `GRIP_FOR` are the only place the mapping lives.
 */
export const TOOL_CELLS = [
  { icon: "mousePointer", label: "select" },
  { icon: "move", label: "move" },
  { icon: "rotateCw", label: "turn" },
  { icon: "resize", label: "scale" },
] as const;

export const SELECT_CELL = 0;
export const MOVE_CELL = 1;
export const TURN_CELL = 2;
export const SCALE_CELL = 3;

/**
 * Scale is exclusive of move and turn; those two compose.
 *
 * Not a preference — `node.scaling` is local, so scale grips ride the piece's
 * axes while move and turn ride the world's. A widget showing both draws two
 * frames at once and can only mislead. Select is not exclusive of anything: it
 * is what a press means when it grabs no handle, which stays true whatever else
 * is on.
 *
 * Written as a pure function so the rule is testable without a grid.
 */
export function resolveToolCells(change: {
  index: number;
  selection: number[];
}): number[] {
  const next = new Set(change.selection);
  if (change.index === SCALE_CELL && next.has(SCALE_CELL)) {
    next.delete(MOVE_CELL);
    next.delete(TURN_CELL);
  }
  if (
    (change.index === MOVE_CELL || change.index === TURN_CELL) &&
    next.has(change.index)
  ) {
    next.delete(SCALE_CELL);
  }
  return [...next].sort((a, b) => a - b);
}

/** The cells lit when nothing has been chosen: select, move and turn. */
export const DEFAULT_TOOL_CELLS = [SELECT_CELL, MOVE_CELL, TURN_CELL];

export const TRANSFORM_SCHEMA = {
  type: "object",
  title: "Select",
  properties: {
    /*
      The mode lives in an ICON GRID, not in this schema.

      A cycler made you read a word and step to the next one; four icons show
      every affordance at once and say which are live. `x-widget: 'tool-cells'`
      tells the panel to render the grid instead of a field, and the value is
      the lit indices — see `resolveToolCells` for the one rule.
    */
    cells: {
      type: "array",
      title: "",
      default: DEFAULT_TOOL_CELLS,
      "x-widget": "tool-cells",
    },
    /*
      Each setting appears only where it applies. A grid snap has nothing to say
      to a tool that is only turning things, and neither has anything to say to
      a tool that is only selecting.
    */
    gridSnap: {
      type: "number",
      title: "Grid snap",
      enum: [0, 0.125, 0.25, 0.5, 1, 2, 4, 8],
      default: 1,
      "x-unit": "m",
      description: "0 to move freely",
      "x-requires": { cell: MOVE_CELL },
    },
    angleSnap: {
      type: "number",
      title: "Angle snap",
      enum: [0, 5, 15, 22.5, 30, 45, 90],
      default: 15,
      "x-unit": "°",
      "x-requires": { cell: TURN_CELL },
    },
    duplicate: {
      type: "boolean",
      title: "Copy on drag",
      default: false,
      "x-requires": { anyCell: [MOVE_CELL, TURN_CELL, SCALE_CELL] },
    },
  },
};

/** Which grips the lit cells put on screen. */
export function transformsOf(options: Record<string, unknown>): TransformSet {
  const cells = Array.isArray(options.cells)
    ? (options.cells as number[])
    : DEFAULT_TOOL_CELLS;
  return {
    translate: cells.includes(MOVE_CELL),
    rotate: cells.includes(TURN_CELL),
    scale: cells.includes(SCALE_CELL),
  };
}

/**
 * Which grip a gesture grabbed.
 *
 * NEAR FIRST: if a hand is inside a handle, that is unambiguous and beats
 * whatever the same controller's ray happens to be crossing further away.
 */
export function resolveGrab(
  gesture: Gesture,
  near: (hand: Vec3) => Grip | null,
  far: (ray: { origin: Vec3; direction: Vec3 }) => Grip | null
): Grip | null {
  const hand = gesture.primary.grip();
  if (hand) {
    const grip = near(hand);
    if (grip) return grip;
  }
  const ray = gesture.primary.ray();
  return ray ? far(ray) : null;
}

export interface TransformHooks {
  /** Grip within reach of a hand. */
  nearGrip(hand: Vec3): Grip | null;
  /** Grip a ray hits. */
  farGrip(ray: { origin: Vec3; direction: Vec3 }): Grip | null;
  /** The live body of a piece, for the during-drag write. */
  bodyOf(pieceId: string): WritableBody | null;
  /** Where the piece sits in WORLD space (its local `at` plus the origin). */
  worldOrigin(): Vec3;
  /**
   * Turn a rotation by `degrees` about one of the PIECE's own axes.
   *
   * A composition, not an addition. `rot[i] += delta` edits one euler
   * component, which matches a real rotation only while the piece has no prior
   * rotation — turn an already-turned piece that way and it goes somewhere
   * nobody asked for. Composing needs quaternions, and converting the result
   * back to euler needs Babylon's exact convention, so this is a hook: the
   * engine does its own arithmetic rather than having it re-derived here and
   * being subtly wrong about the order.
   */
  composeRotation(start: Euler, axis: Axis, degrees: number): Euler;
  /**
   * World direction of one of the PIECE's own axes.
   *
   * Scale needs this and nothing else does. `node.scaling` is local, so on a
   * turned piece "scale x" stretches along the piece's x — and measuring the
   * drag along world x would read the wrong component of the movement, quite
   * apart from the handle being drawn in the wrong place.
   */
  axisDirection(axis: Axis): Vec3;
}

export function registerTransformTool(hooks: TransformHooks): void {
  registerTool({
    name: "select",
    label: "Select",
    icon: "mousePointer",
    optionsSchema: TRANSFORM_SCHEMA,
    onGesture: {
      start(gesture, ctx) {
        const piece = ctx.selection;
        if (!piece) return;
        const grip = resolveGrab(gesture, hooks.nearGrip, hooks.farGrip);
        // Grabbed no handle: this gesture is a selection (or a camera orbit),
        // and it is resolved on release.
        if (!grip) return;
        const ray = gesture.primary.ray();
        if (!ray) return;
        const origin = hooks.worldOrigin();
        const start = measure(grip, origin, ray, hooks.axisDirection);
        if (start === null) return; // parallel or behind — not a usable drag
        // The camera must stop listening the moment a handle is grabbed, or
        // the drag moves the piece AND orbits the view under it.
        ctx.captureCamera(true);
        const startScale = scaleVector(piece.scale);
        const worldPerLocal = Number(ctx.ensemble.scale ?? 1) || 1;
        drag = {
          grip,
          pieceId: piece.id,
          worldPerLocal,
          startAt: [...piece.at] as Vec3,
          startRot: [...(piece.rot ?? [0, 0, 0])] as Euler,
          startScale,
          startValue: start,
          secondary: gesture.primary.secondary === true,
          dragged: false,
          at: [...piece.at] as Vec3,
          rot: [...(piece.rot ?? [0, 0, 0])] as Euler,
          scale: [...startScale] as Vec3,
        };
      },

      move(gesture, ctx) {
        if (!drag) return;
        const ray = gesture.primary.ray();
        if (!ray) return;
        const origin = hooks.worldOrigin();
        const now = measure(drag.grip, origin, ray, hooks.axisDirection);
        if (now === null) return;
        apply(drag, now, hooks.composeRotation);
        if (changed(drag)) drag.dragged = true;
        const body = hooks.bodyOf(drag.pieceId);
        if (body) {
          writeTransform(body, {
            at: worldAt(drag, origin),
            rot: drag.rot,
            scale: [...drag.scale] as Vec3,
          });
        }
        void ctx;
      },

      end(gesture, ctx) {
        const finished = drag;
        drag = null;
        // Always give the camera back, even on a drag that grabbed nothing —
        // otherwise a mis-click leaves the view frozen with no way to recover.
        ctx.captureCamera(false);

        /*
          A PRESS THAT DID NOT DRAG IS A CLICK, even on a handle.

          With everything switched on the widget covers a good deal of what is
          behind it, and its pick targets are deliberately fatter still — so
          once a piece is selected, tapping the piece BESIDE it usually lands on
          a handle instead. The gesture grabbed a grip, moved nothing, committed
          nothing, and swallowed the tap: "select seems a bit unreliable… maybe
          it's just hard to touch outside the widget once something is
          selected".

          So a grab that never moved falls through to selection. The threshold
          is on the RESULT, not on pointer travel, because that is what decides
          whether there is anything to commit: a drag whose value snapped back
          to where it started has changed nothing either.
        */
        // Snap the VALUE, not the accumulated delta — see handles.ts.
        const grid = Number(ctx.options.gridSnap ?? 0);
        const angle = Number(ctx.options.angleSnap ?? 0);
        const at = finished ? snapVec3(finished.at, grid) : null;
        // Snap first, then normalise: 359.6 rounds to 360 and is stored as 0.
        const rot = finished
          ? (finished.rot.map((a) => normaliseDegrees(snap(a, angle))) as Euler)
          : null;

        if (!finished || !finished.dragged) {
          /*
            Nothing was grabbed, or something was grabbed and never moved. Both
            are clicks, and a click selects.

            On end rather than start, so a press that turns into a camera orbit
            does not also change what is selected — the two gestures begin
            identically and only diverge once something moves.
          */
          const ray = gesture.primary.ray();
          if (ray) ctx.select(ctx.pick(ray));
          return;
        }

        // It was a real drag whose value happens to land where it started —
        // a nudge inside one grid step. Nothing to commit, and emphatically not
        // a click: the selection stays put.
        if (!at || !rot || !moved(finished, at, rot)) return;

        const scale = narrowScale(finished.scale);
        const kind = finished.grip.kind;

        if (ctx.options.duplicate === true) {
          const source = ctx.ensemble.pieces.find(
            (p) => p.id === finished.pieceId
          );
          if (!source) return;
          const copy: Piece = { ...structuredClone(source), at, rot, scale };
          copy.id = uniqueId(
            source.id,
            ctx.ensemble.pieces.map((p) => p.id)
          );
          ctx.edit(`copy ${source.id}`, (ensemble) =>
            ensemble.pieces.push(copy)
          );
          ctx.select(copy.id);
          return;
        }

        ctx.edit(`${kind} ${finished.pieceId}`, (ensemble) => {
          const piece = ensemble.pieces.find((p) => p.id === finished.pieceId);
          if (!piece) return;
          // Write only what this grip actually dragged. Writing all three would
          // stamp a `rot: [0,0,0]` and a `scale: 1` onto every piece an author
          // ever nudged, turning a hand-written file into a generated one.
          if (kind === "translate" || kind === "planar") piece.at = at;
          if (kind === "rotate") piece.rot = rot;
          if (kind === "scale" || kind === "uniform") piece.scale = scale;
        });
      },
    },
  });
}

/** Has the running transform left the one the drag started from? */
function changed(state: Drag): boolean {
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;
  return !(
    state.at.every((v, i) => near(v, state.startAt[i]!)) &&
    state.rot.every((v, i) => near(v, state.startRot[i]!)) &&
    state.scale.every((v, i) => near(v, state.startScale[i]!))
  );
}

/**
 * Did this drag actually change anything?
 *
 * Takes the SNAPPED position and rotation, not the raw ones, because the
 * snapped values are what would be committed. A ten-centimetre nudge on a
 * one-metre grid rounds back to where it started: there is nothing to write,
 * and treating it as a drag would swallow a tap to no purpose.
 *
 * Compared against what the drag started FROM, so a gesture that wandered and
 * came back also reads as unmoved.
 */
function moved(state: Drag, at: Vec3, rot: Euler): boolean {
  const near = (a: number, b: number, epsilon: number) =>
    Math.abs(a - b) < epsilon;
  const still =
    at.every((v, i) => near(v, state.startAt[i]!, 1e-4)) &&
    // Both sides normalised: the drag's value has been, the piece's stored one
    // may predate the rule, and -40 versus 320 is not a movement.
    rot.every((v, i) =>
      near(normaliseDegrees(v), normaliseDegrees(state.startRot[i]!), 1e-3)
    ) &&
    state.scale.every((v, i) => near(v, state.startScale[i]!, 1e-4));
  return !still;
}

/** Where the pointer is, in the units this grip drags in. */
function measure(
  grip: Grip,
  origin: Vec3,
  ray: { origin: Vec3; direction: Vec3 },
  axisDirection: (axis: Axis) => Vec3
): number | Vec3 | null {
  if (grip.kind === "uniform") return rayPerpendicularDistance(origin, ray);
  if (!grip.axis) return null;
  if (grip.kind === "planar") return rayPlanePoint(origin, grip.axis, ray);
  if (grip.kind === "rotate") {
    // About the piece's own axis, in the plane the ring is actually drawn in.
    const [u, v] = RING_BASIS[grip.axis];
    return angleAboutAxis(
      origin,
      axisDirection(grip.axis),
      axisDirection(u),
      axisDirection(v),
      ray
    );
  }
  // Scale measures along the PIECE's axis too; translate is a world move.
  const along =
    grip.kind === "scale" ? axisDirection(grip.axis) : axisVector(grip.axis);
  return axisClosestApproach(origin, along, ray);
}

/** Fold the pointer's current reading into the drag's running transform. */
function apply(
  state: Drag,
  now: number | Vec3,
  composeRotation: (start: Euler, axis: Axis, degrees: number) => Euler
): void {
  const { kind, axis } = state.grip;

  if (kind === "planar") {
    if (
      !axis ||
      typeof now === "number" ||
      typeof state.startValue === "number"
    )
      return;
    // Both in-plane axes move; the plane's normal is exactly what stays put,
    // which is the whole reason to offer a pad rather than two shaft drags.
    const [u, v] = otherAxes(axis);
    state.at = [...state.startAt] as Vec3;
    for (const a of [u, v]) {
      const i = axisIndex(a);
      state.at[i] =
        state.startAt[i]! +
        (now[i]! - state.startValue[i]!) / state.worldPerLocal;
    }
    return;
  }

  if (typeof now !== "number" || typeof state.startValue !== "number") return;

  if (kind === "translate") {
    if (!axis) return;
    const i = axisIndex(axis);
    state.at = [...state.startAt] as Vec3;
    // World metres in, local units out — see `worldPerLocal`.
    state.at[i] =
      state.startAt[i]! + (now - state.startValue) / state.worldPerLocal;
    return;
  }

  if (kind === "rotate") {
    if (!axis) return;
    // From the rotation the drag STARTED with, every frame — composing onto the
    // running value would accumulate rounding over a long drag, and composing
    // onto the euler would not be a global rotation at all.
    state.rot = composeRotation(
      state.startRot,
      axis,
      wrapDegrees(now - state.startValue)
    );
    return;
  }

  const factor = scaleFactor(state.startValue, now);

  if (kind === "uniform") {
    state.scale = state.startScale.map((s) => s * factor) as Vec3;
    return;
  }

  if (kind === "scale") {
    if (!axis) return;
    state.scale = [...state.startScale] as Vec3;
    // Secondary inverts the selection of axes: the cube you grabbed stays put
    // and the other two move. "Thinner, same height" without a second drag.
    const affected = state.secondary ? otherAxes(axis) : [axis];
    for (const a of affected) {
      const i = axisIndex(a);
      state.scale[i] = state.startScale[i]! * factor;
    }
  }
}

/** The drag's ensemble-local position expressed in world space. */
function worldAt(state: Drag, origin: Vec3): Vec3 {
  // `origin` is where the piece's body currently sits; the drag tracks the
  // piece's LOCAL `at`, so the world write is the local delta scaled back up
  // and applied to that origin.
  const k = state.worldPerLocal;
  return [
    origin[0] + (state.at[0] - state.startAt[0]) * k,
    origin[1] + (state.at[1] - state.startAt[1]) * k,
    origin[2] + (state.at[2] - state.startAt[2]) * k,
  ];
}
