/*#
# The built-in tools

Registered by the editor on connect. A consumer adds its own with
[[Tools and commands]] and they appear in the palette beside these — the same
open-for-extension property the feature registry has.

Selecting is NOT here. It fused with the manipulator — see
[[The select-and-transform tool]] — because selecting and transforming are one
gesture with two outcomes, told apart by whether you grabbed a handle. A
separate select tool meant declaring your intent to a palette before declaring
it again to the thing you were pointing at.
*/
/*{"parent":"Editing","order":3}*/
import { featureRegistration } from "../../format/registry";
import { snapVec3 } from "../handles";
import type { Vec3 } from "../../format/types";
import { registerCommand, registerTool } from "./tool-registry";

let registered = false;

/** Register the editor's own tools and commands. Idempotent. */
/**
 * The ray direction the insert gesture began with, so `end` can tell a click
 * from a camera orbit. One tool, one gesture at a time — a module-level value
 * is honest about that where a field on nothing would not be.
 */
let insertStart: Vec3 | null = null;

/** cos(~0.8°): the most a "still" pointer is allowed to have wandered. */
const STILL_ENOUGH = 0.9999;

/** The world point the pan grabbed, and the plane it slides on. */
let panAnchor: Vec3 | null = null;
let panNormal: Vec3 | null = null;

/** Where a ray meets the plane through `origin` with normal `normal`. */
function planePoint(
  ray: { origin: Vec3; direction: Vec3 },
  origin: Vec3,
  normal: Vec3
): Vec3 | null {
  const denominator =
    normal[0] * ray.direction[0] +
    normal[1] * ray.direction[1] +
    normal[2] * ray.direction[2];
  // Parallel to the plane: no answer, rather than one at infinity.
  if (Math.abs(denominator) < 1e-6) return null;
  const t =
    (normal[0] * (origin[0] - ray.origin[0]) +
      normal[1] * (origin[1] - ray.origin[1]) +
      normal[2] * (origin[2] - ray.origin[2])) /
    denominator;
  if (t < 0) return null;
  return [
    ray.origin[0] + ray.direction[0] * t,
    ray.origin[1] + ray.direction[1] * t,
    ray.origin[2] + ray.direction[2] * t,
  ];
}

export function registerEditorTools(): void {
  if (registered) return;
  registered = true;

  registerTool({
    name: "insert",
    label: "Insert",
    icon: "plus",
    optionsSchema: {
      type: "object",
      title: "Insert",
      properties: {
        // Set by the library palette rather than typed. It is `x-widget: mesh`
        // so that when the property panel renders schemas properly it offers a
        // pick list from the library instead of a text field.
        mesh: { type: "string", title: "Mesh", "x-widget": "mesh" },
        library: { type: "string", title: "Library" },
        /*
          A FEATURE to insert, instead of a mesh — sun, terrain, water, a lamp.
          Separate from `mesh` rather than a magic library name, so nothing has
          to guess which kind of thing is selected: whichever is set is what
          gets placed.
        */
        feature: { type: "string", title: "Utility" },
      },
    },
    onGesture: {
      /*
        Remember where the gesture STARTED, to tell a click from a camera drag.

        The two begin identically — press on the viewport — and only diverge
        once the pointer moves. Without this, orbiting the view to look for a
        spot dropped a piece the moment you let go of the mouse.
      */
      start(gesture) {
        const ray = gesture.primary.ray();
        insertStart = ray ? ([...ray.direction] as Vec3) : null;
      },
      /*
        Place on RELEASE, at the point the ray meets the scene.

        Placing where the author is AIMING rather than at the origin is the
        whole affordance: an ensemble is built by putting things where they go,
        and a palette that drops everything at 0,0,0 makes you move each piece
        immediately afterwards.
      */
      end(gesture, ctx) {
        const mesh = ctx.options.mesh as string | undefined;
        const feature = ctx.options.feature as string | undefined;
        if (!mesh && !feature) return;
        const ray = gesture.primary.ray();
        if (!ray) return;
        /*
          A DRAG WAS AIMING THE CAMERA, NOT PLACING A PIECE.

          Compared as ray DIRECTIONS rather than screen pixels, because that is
          what a tool is given and it holds for a controller as well as a mouse.
          The threshold is deliberately tight — a click is not a small drag, it
          is no drag — and only exists to absorb the pointer jitter of pressing
          a physical button.
        */
        const start = insertStart;
        insertStart = null;
        if (start) {
          const moved =
            start[0] * ray.direction[0] +
            start[1] * ray.direction[1] +
            start[2] * ray.direction[2];
          if (moved < STILL_ENOUGH) return;
        }
        const point = ctx.pickPoint(ray);
        if (!point) return;
        const step = Number(ctx.options.gridSnap ?? 0);
        const at = snapVec3(point, step);
        const id = uniqueId(
          slugify(feature ?? mesh!),
          ctx.ensemble.pieces.map((p) => p.id)
        );
        const library = ctx.options.library as string | undefined;

        if (feature) {
          /*
            WHERE it goes is the feature's business, not the click's. A skybox
            has no position, a terrain has only a height, and `sun`'s `at` is a
            DIRECTION — dropping any of them at the picked point writes a
            coordinate that means nothing and, for the sun, aims it somewhere
            arbitrary.
          */
          const rule = featureRegistration(feature)?.insertAt ?? "point";
          const where: Vec3 =
            rule === "point"
              ? at
              : rule === "height"
              ? [0, at[1], 0]
              : ([...rule] as Vec3);
          /*
            An environment primitive: no mesh, and the feature IS the body.
            Empty config, so every default in its schema applies — a `terrain`
            with no settings is a terrain, and the property panel is where you
            shape it. Filling in defaults here would write them into the
            document as if the author had chosen them.
          */
          ctx.edit(`insert ${feature}`, (ensemble) => {
            ensemble.pieces.push({
              id,
              at: where,
              features: { [feature]: {} },
            });
          });
          ctx.select(id);
          return;
        }

        ctx.edit(`insert ${mesh}`, (ensemble) => {
          // Record WHICH library, when the ensemble declares more than one.
          // With a single library it is noise, so it is omitted.
          const declared = ensemble.libraries ?? [];
          const qualify = library && declared.length > 1;
          ensemble.pieces.push(
            qualify ? { id, mesh: mesh!, library, at } : { id, mesh: mesh!, at }
          );
        });
        ctx.select(id);
      },
    },
  });

  /*
    A PAN TOOL, BECAUSE TWO FINGERS FIGHT BABYLON.

    `ArcRotateCameraPointersInput` owns multi-touch, and every attempt to make
    two-finger drag pan there ended up wrestling its pinch handling — filed as
    tosijs-3d#52. A tool sidesteps the argument entirely: while pan is picked, a
    ONE-finger drag pans, which is unambiguous on every input device and needs
    nothing from the camera's own gesture handling.

    It grabs the world rather than nudging the camera: the point you pressed on
    stays under your finger. That is the behaviour people expect from a hand
    cursor, and it makes the pan speed correct at any distance for free — a
    fixed pixels-to-metres factor is wrong the moment you zoom.
  */
  registerTool({
    name: "pan",
    label: "Pan",
    icon: "move",
    optionsSchema: { type: "object", title: "Pan", properties: {} },
    onGesture: {
      start(gesture, ctx) {
        const ray = gesture.primary.ray();
        if (!ray) return;
        const hit = ctx.pickPoint(ray);
        if (!hit) return;
        panAnchor = hit;
        // The plane to drag ON: through the grabbed point, facing the camera.
        panNormal = [...ray.direction] as Vec3;
        // The camera must stop orbiting, or the view both pans and turns.
        ctx.captureCamera(true);
      },
      move(gesture, ctx) {
        if (!panAnchor || !panNormal) return;
        const ray = gesture.primary.ray();
        if (!ray) return;
        const hit = planePoint(ray, panAnchor, panNormal);
        if (!hit) return;
        /*
          Move the view by what the grab point MOVED, so it lands back under
          the pointer. The anchor stays fixed in world space for the whole
          gesture — recomputing it each frame would chase its own tail, which
          is the feedback loop the rotate drag had.
        */
        ctx.panCamera([
          panAnchor[0] - hit[0],
          panAnchor[1] - hit[1],
          panAnchor[2] - hit[2],
        ]);
      },
      end(_gesture, ctx) {
        panAnchor = null;
        panNormal = null;
        ctx.captureCamera(false);
      },
    },
  });

  registerCommand({
    name: "undo",
    label: "Undo",
    /*
      The horizontal mirror of redo's `cornerUpRight` — equivalently, a 180°
      rotation of `cornerDownRight`. Reachable at all only because tosijs-3d
      0.7.6 fixed the icon language on the texture path: every left-facing arrow
      is stored as `<rightVariant>0f`, and a stray trailing space in `icon-data`
      made that redirect unparseable, so the whole left-facing set drew a
      fallback box and warned on every render.
    */
    icon: "cornerUpLeft",
    enabled: (ctx) => ctx.canUndo(),
    run: (ctx) => ctx.undo(),
  });

  registerCommand({
    name: "redo",
    label: "Redo",
    icon: "cornerUpRight",
    enabled: (ctx) => ctx.canRedo(),
    run: (ctx) => ctx.redo(),
  });

  registerCommand({
    name: "delete",
    label: "Delete",
    icon: "trash",
    enabled: (ctx) => ctx.selection !== null,
    run(ctx) {
      const id = ctx.selection?.id;
      if (!id) return;
      ctx.edit(`delete ${id}`, (ensemble) => {
        ensemble.pieces = ensemble.pieces.filter((p) => p.id !== id);
        // Links to a piece that no longer exists would validate as errors
        // pointing at content the author already removed.
        ensemble.links = (ensemble.links ?? []).filter(
          (l) => l.from !== id && l.to !== id
        );
      });
      ctx.select(null);
    },
  });

  registerCommand({
    name: "duplicate",
    label: "Duplicate",
    icon: "copy",
    enabled: (ctx) => ctx.selection !== null,
    run(ctx) {
      const source = ctx.selection;
      if (!source) return;
      const copy = structuredClone(source);
      copy.id = uniqueId(
        source.id,
        ctx.ensemble.pieces.map((p) => p.id)
      );
      // Offset so the copy is visible rather than exactly inside the original,
      // which reads as "nothing happened".
      copy.at = [source.at[0] + 2, source.at[1], source.at[2] + 2];
      ctx.edit(`duplicate ${source.id}`, (ensemble) => {
        ensemble.pieces.push(copy);
      });
      ctx.select(copy.id);
    },
  });
}

/**
 * An id stem from a mesh name.
 *
 * Library names are display names — `Pump Station`, `tree.001` — and an id is a
 * handle that goes into links, refs and eventually an encounter PATH. Spaces
 * and dots there are a quoting problem waiting to happen.
 */
export function slugify(meshName: string): string {
  return (
    meshName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "piece"
  );
}

/**
 * A fresh id derived from an existing one.
 *
 * Ids are MANDATORY and never derived from array position, so a duplicate needs
 * a real new one. Trailing digits are treated as a counter (`gun-2` → `gun-3`)
 * rather than appended to, because `gun-2-copy-copy` is what happens otherwise.
 */
export function uniqueId(base: string, taken: string[]): string {
  const used = new Set(taken);
  // The plain name when it is free — the FIRST building should be `building`,
  // not `building-2`. Counting up unconditionally reads as though something was
  // already there, and leaves every id in a fresh ensemble looking like a copy.
  if (!used.has(base)) return base;
  const match = /^(.*?)(\d+)$/.exec(base);
  const stem = match ? match[1]! : `${base}-`;
  let n = match ? Number(match[2]) + 1 : 2;
  let candidate = `${stem}${n}`;
  while (used.has(candidate)) candidate = `${stem}${++n}`;
  return candidate;
}
