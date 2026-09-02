/*#
# Manipulator handles

The visible part: a **universal widget**, in the sense Cheetah 3D means it.
Every enabled affordance is on screen at once and the part you grab is what says
what the drag means — drag a shaft to move along an axis, a pad to move in a
plane, a ring to turn, a cube to scale. tosijs-3d has no manipulator
(UPSTREAM.md #3) and Babylon's `GizmoManager` is mouse-shaped, so this is built
here — and built so a **hand** can grab it, not only a ray.

## Why one widget instead of a mode

A mode switch makes you say what you want twice: once to the toolbar and again
to the handle. It also costs a round trip for the commonest edit there is —
nudge it over, then turn it a bit. The cost is crowding, and the answer to that
is the transform set: turn off what you are not using and its grips are simply
not built. That is the same dial that makes this usable on a touchscreen, where
thirteen grips genuinely is too many.

## Sized for hands, not only for pixels

Handles carry a `nearRadius` and are picked two ways: a hand inside that radius
grabs directly, anything further grabs by pointing. A gizmo designed for a mouse
gets this wrong by being visually thin — fine for a pixel-accurate cursor,
impossible to grab with a controller you are holding at arm's length.

They also draw **on top** (`renderingGroupId`), because a handle buried inside
the mesh it manipulates cannot be clicked at all — and the piece an author most
wants to move is usually the one embedded in something else.
*/
/*{"parent":"Internals","order":5}*/
import {
  Color3,
  Mesh,
  MeshBuilder,
  Quaternion,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { axisIndex, otherAxes } from "./handles";
import type { Axis, Grip, TransformSet } from "./handles";
import type { Euler, Vec3 } from "../format/types";

const DEG = Math.PI / 180;

/** A vector turned by a quaternion, as plain numbers. */
function rotated(v: Vec3, q: Quaternion): Vec3 {
  const out = Vector3.Zero();
  new Vector3(v[0], v[1], v[2]).rotateByQuaternionToRef(q, out);
  return [out.x, out.y, out.z];
}

/** Marks a mesh as ours, so picking can tell a handle from the scene. */
export const HANDLE_TAG = "ensemble-editor-handle";

/**
 * Marks the mesh you can SEE, as opposed to its fat invisible twin.
 *
 * Picking runs in two passes and this is what separates them. One pass over the
 * drawn handles answers "what were you aiming at"; a second over the fat
 * targets answers "what were you reaching for". Deciding between overlapping
 * grips by ray DEPTH alone gave the ring whose tube happened to pass in front —
 * "I rotated when I tried to translate" — and deciding by distance to the drawn
 * mesh's centre was worse, because a torus is centred on the widget origin and
 * so never wins against anything.
 */
export const DRAWN_TAG = "ensemble-editor-handle-drawn";

interface HandleMesh {
  grip: Grip;
  /** Where this part sits, in unit-scale local space. */
  offset: Vec3;
  /** How this part is turned onto its axis, in radians. */
  spin: Vec3;
  mesh: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scaling: { x: number; y: number; z: number };
    rotationQuaternion: Quaternion | null;
    isVisible: boolean;
    isDisposed: () => boolean;
    visibility: number;
    metadata: unknown;
    dispose: () => void;
    computeWorldMatrix: (force: boolean) => void;
    renderingGroupId: number;
    material: unknown;
    isPickable: boolean;
  };
}

const AXIS_COLOR: Record<Axis, [number, number, number]> = {
  x: [0.9, 0.25, 0.3],
  y: [0.35, 0.85, 0.4],
  z: [0.3, 0.5, 0.95],
};

const NEUTRAL: [number, number, number] = [0.85, 0.85, 0.88];

/** How close a HAND has to be, in metres, to grab a handle directly. */
export const NEAR_RADIUS = 0.18;

/**
 * How much fatter the INVISIBLE pick target is than the handle you see.
 *
 * A translate handle is a thin stick. That is the right thing to LOOK at — a
 * fat arrow hides the model you are positioning — and hopeless to HIT with a
 * fingertip, which covers roughly a centimetre of screen wherever it lands.
 * Reported from a phone as "I couldn't move a selection", which is exactly what
 * a handle you cannot touch feels like.
 *
 * So every handle carries a second, invisible mesh that is only there to be
 * picked. Mouse users benefit too: aiming at a 3 px cylinder was never good,
 * it was merely possible.
 */
const PICK_FATNESS = 5;

/**
 * Where each grip sits, at unit scale. One table, so the layout can be read.
 *
 * Ordered outward from the centre, and EVERY GRIP OWNS A BAND along the axis:
 *
 *   Along −axis:  pad 0.50      arc 0.95
 *   Along +axis:  shaft 0.15 – 0.95   cone 0.95 – 1.35   cube 1.78
 *
 * That separation is the point, and it was missing. A ring at radius 1.2 with
 * shafts reaching 1.3 physically CROSSES them, so at four points on every ring
 * the drawn geometry of two different grips occupies the same pixels and no
 * amount of clever picking can tell which you meant. Measured: aiming squarely
 * at the ring translated the piece. "With more than one transform open, it may
 * be difficult to click the one you want."
 *
 * The rings now sit OUTSIDE the arrows entirely, which is also Cheetah 3D's
 * arrangement and the reason its widget stays readable with everything on.
 */
/*
  The shaft is deliberately HAIRLINE now.

  It is a line showing which way the axis runs, not the thing you reach for —
  the arrowhead is. A fat shaft reads as grabbable along its whole length,
  competes with the rings and pads for the same pixels, and hides the model
  underneath it. Thin shaft, obvious head: the affordance says where to aim.

  Its pick target stays generous, so aiming at the line still works; it just no
  longer ADVERTISES itself as the target.
*/
const SHAFT_LENGTH = 0.8;
const SHAFT_DIAMETER = 0.032;
const SHAFT_PICK_FATNESS = 11;
const SHAFT_OFFSET = 0.55;
const PAD_SIZE = 0.28;
/*
  A FLAT QUARTER ANNULUS ON THE AXIS ROW, NOT A RING AROUND EVERYTHING.

  The rings used to encircle the whole widget — 3.3 across — so on a widget
  scaled to a constant SCREEN size they dwarfed whatever piece was selected, and
  three of them crossing made the thing hard to read at all.

  Now every axis is one ROW, which is the owner's layout:

      -X  (   []   +----->  +X

  the arc turns about that axis, the pad slides in the plane that axis is normal
  to, and the arrow moves along it. Everything belonging to an axis sits on that
  axis, and the three rows do not overlap.

  FLAT, not tubular. A ribbon is a broad face pointed along the axis, which is a
  much larger click target than the silhouette of a tube, and it is ~24
  triangles against a torus's several hundred.

  The arc is drawn OFFSET along the negative axis, while the drag still measures
  in the plane through the widget's origin — the offset is cosmetic, and
  `angleAboutAxis` does not care where along the normal the plane sits. That is
  a deliberate separation of "what you grab" from "where it measures", and the
  only one in the widget.
*/
const ARC_INNER = 0.4;
const ARC_OUTER = 0.62;
/** How much wider the invisible pick band is, per edge. */
const ARC_PICK_MARGIN = 0.16;
const ARC_OFFSET = 0.95;
const ARC_SEGMENTS = 10;
/** The pad sits between the arc and the origin, on the same row. */
const PAD_ROW_OFFSET = 0.5;
const CUBE_SIZE = 0.17;
const CUBE_OFFSET = 1.78;
const CENTRE_SIZE = 0.2;

/**
 * The arrowhead, and why a shaft alone was not enough.
 *
 * A bare cylinder is a thin target wherever you aim at it, and on a touchscreen
 * that made single-axis movement effectively impossible while the big flat
 * plane pads worked fine — reported as "I could do the planar move but not
 * single axis with touch". A cone is both the conventional "drag me" affordance
 * and, at this size, the fattest part of the axis: it gives the gesture an
 * obvious place to land instead of asking for a hairline.
 *
 * It is a separate PART of the same grip, not a grip of its own — grabbing the
 * head and grabbing the shaft mean the same drag.
 */
const HEAD_LENGTH = 0.4;
/*
  Wider than the cone it replaces. `diameter` is the CIRCUMSCRIBED circle, so a
  4-sided cross-section has sides of only d/√2 — keeping 0.3 would have quietly
  shrunk the arrowhead by a third at the moment it stopped being round.
*/
const HEAD_DIAMETER = 0.42;
const HEAD_OFFSET = SHAFT_OFFSET + SHAFT_LENGTH / 2 + HEAD_LENGTH / 2;

export interface HandlesView {
  /** Rebuild for a new transform set. Cheap no-op when nothing changed. */
  setTransforms(transforms: TransformSet): void;
  moveTo(position: Vec3): void;
  /**
   * Resize the handles so they stay a constant size ON SCREEN.
   *
   * Called every frame with the distance from the camera. Without it the
   * handles are world-sized: correct at one camera distance and unusable at
   * every other. Framed on a 24 m ensemble, the fat pick target measured about
   * ELEVEN PIXELS across — which the owner reported, accurately, as "touching
   * the manipulator is very hit and mostly miss". A manipulator you cannot
   * reliably hit is not a manipulator.
   */
  setScale(scale: number): void;
  /**
   * The piece's own rotation, for the grips that work in its frame.
   *
   * Scale and rotate both do. `node.scaling` is local, and rotation is defined
   * as being about the object's own axes — so a cube drawn on a world axis, or
   * a ring lying in a world plane, is a control pointing somewhere other than
   * where it acts. Measured before it was fixed: a piece turned 90 degrees
   * about Y grew along world Z when its X cube was dragged, reported as "the z
   * and x scale affordances are switched with their functions".
   *
   * Translate stays world-aligned, because `at` is a world position.
   */
  setOrientation(rot: Euler | null): void;
  setVisible(visible: boolean): void;
  /** The grip within `NEAR_RADIUS` of a hand, if any. */
  nearestGrip(hand: Vec3): Grip | null;
  /** The grip a handle mesh belongs to, for resolving a ray pick. */
  gripOf(mesh: unknown): Grip | null;
  /**
   * Is this one of the DRAWN handles, rather than a fat invisible pick target?
   *
   * The two are picked in separate passes — see the note on `add`.
   */
  isDrawn(mesh: unknown): boolean;
  /** Are these meshes still in a live scene? See [[The selection marker]]. */
  alive(): boolean;
  dispose(): void;
}

/**
 * Build handles into a scene.
 *
 * Geometry is built at UNIT size and scaled per frame by `setScale` — three
 * meshes and their pick targets rebuilt every frame to track the camera would
 * be absurd, and `setTransforms` is the only thing that should ever rebuild.
 */
export function createHandles(scene: unknown, scale = 1): HandlesView {
  const s = scene as never;
  const handles: HandleMesh[] = [];
  const materials: Array<{ dispose: () => void }> = [];
  let position: Vec3 = [0, 0, 0];
  let transforms: TransformSet = {
    translate: true,
    rotate: false,
    scale: false,
  };
  /** Null means "not turned", and world axes are used as they are. */
  let orientation: Quaternion | null = null;

  const material = (
    key: string,
    colour: [number, number, number],
    alpha = 1
  ) => {
    const m = new StandardMaterial(`${HANDLE_TAG}-${key}`, s) as unknown as {
      emissiveColor: Color3;
      disableLighting: boolean;
      alpha: number;
      backFaceCulling: boolean;
      dispose: () => void;
    };
    const [r, g, b] = colour;
    // Emissive and unlit: a handle must read the same against a bright sky and
    // a dark hull, and it is UI rather than part of the scene.
    m.emissiveColor = new Color3(r, g, b);
    m.disableLighting = true;
    m.alpha = alpha;
    // A plane pad is a flat quad and gets looked at from both sides; without
    // this it vanishes from half the orbit, which reads as a missing handle.
    m.backFaceCulling = false;
    materials.push(m);
    return m;
  };

  interface PartSpec {
    /** Distinguishes parts of one grip in mesh names — `translate-x-head`. */
    part?: string;
    make: (name: string, fatness: number) => unknown;
    colour: [number, number, number];
    alpha?: number;
    offset?: Vec3;
    spin?: Vec3;
  }

  /** The drawn mesh and its fat invisible twin, both tagged with the grip. */
  const add = (grip: Grip, spec: PartSpec) => {
    const {
      make,
      colour,
      alpha = 1,
      offset = [0, 0, 0],
      spin = [0, 0, 0],
    } = spec;
    const key = `${grip.kind}-${grip.axis ?? "all"}${
      spec.part ? `-${spec.part}` : ""
    }`;
    const mesh = make(`${HANDLE_TAG}-${key}`, 1) as HandleMesh["mesh"];
    mesh.material = material(key, colour, alpha);
    mesh.renderingGroupId = 1;
    /*
      The drawn handle IS pickable, and is picked FIRST.

      It used to be unpickable, leaving the fat targets to decide everything by
      ray depth — which is how aiming squarely at an arrowhead could rotate the
      piece instead. A hit on drawn geometry is unambiguous: it is the thing you
      could see and aimed at. The fat targets remain for everything else.
    */
    mesh.isPickable = true;
    mesh.metadata = { [HANDLE_TAG]: grip, [DRAWN_TAG]: true };
    handles.push({ grip, mesh, offset, spin });

    const target = make(
      `${HANDLE_TAG}-${key}-pick`,
      PICK_FATNESS
    ) as HandleMesh["mesh"];
    /*
      `visibility = 0`, not `isVisible = false`: Babylon's picking skips meshes
      that are not visible, so hiding it the obvious way would make the pick
      target unpickable — which is the only thing it exists for.
    */
    target.visibility = 0;
    target.isPickable = true;
    target.metadata = { [HANDLE_TAG]: grip };
    handles.push({ grip, mesh: target, offset, spin });
  };

  const HALF = Math.PI / 2;

  /**
   * Turn a shape built along +Y onto an axis, pointing OUTWARD.
   *
   * The sign matters now. A cylinder is symmetric, so the old `+90°` for X drew
   * a shaft that was positioned on +X while oriented along −X and nobody could
   * tell. A cone can tell: it would point back at the piece.
   */
  const alongAxis = (axis: Axis): Vec3 =>
    axis === "x" ? [0, 0, -HALF] : axis === "z" ? [HALF, 0, 0] : [0, 0, 0];

  /**
   * A flat 90° annulus segment lying in XZ with normal +Y, so `ringOn` aims it
   * exactly as the torus it replaces was aimed.
   *
   * Two arcs and a ribbon between them: `CreateDisc` would give a pie slice
   * with no hole, and a torus is the thing being replaced. Double-sided,
   * because a flat band seen from behind is otherwise both invisible and
   * unpickable, and which side faces you is the camera's business.
   */
  const quarterAnnulus = (name: string, inner: number, outer: number) => {
    const arc = (radius: number): Vector3[] => {
      const points: Vector3[] = [];
      for (let i = 0; i <= ARC_SEGMENTS; i++) {
        const t = (i / ARC_SEGMENTS) * HALF;
        points.push(new Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
      }
      return points;
    };
    return MeshBuilder.CreateRibbon(
      name,
      {
        pathArray: [arc(inner), arc(outer)],
        sideOrientation: Mesh.DOUBLESIDE,
      },
      s
    );
  };

  /** Turn a torus (lying in XZ, normal +Y) so its normal is `axis`. */
  const ringOn = (axis: Axis): Vec3 =>
    axis === "x" ? [0, 0, HALF] : axis === "z" ? [HALF, 0, 0] : [0, 0, 0];

  /** Turn a plane (facing +Z) so it faces `axis`. */
  const facing = (axis: Axis): Vec3 =>
    axis === "x" ? [0, HALF, 0] : axis === "y" ? [HALF, 0, 0] : [0, 0, 0];

  /** A vector that is `distance` along one axis and zero elsewhere. */
  const along = (axis: Axis, distance: number): Vec3 => {
    const v: Vec3 = [0, 0, 0];
    v[axisIndex(axis)] = distance;
    return v;
  };

  const build = () => {
    for (const h of handles) h.mesh.dispose();
    for (const m of materials) m.dispose();
    handles.length = 0;
    materials.length = 0;

    for (const axis of ["x", "y", "z"] as Axis[]) {
      const colour = AXIS_COLOR[axis];
      const grip = (kind: Grip["kind"]): Grip => ({ kind, axis });

      if (transforms.translate) {
        add(grip("translate"), {
          part: "shaft",
          colour,
          offset: along(axis, SHAFT_OFFSET),
          spin: alongAxis(axis),
          make: (name, fat) =>
            MeshBuilder.CreateCylinder(
              name,
              {
                height: SHAFT_LENGTH,
                diameter: SHAFT_DIAMETER * (fat > 1 ? SHAFT_PICK_FATNESS : 1),
                tessellation: fat > 1 ? 8 : 10,
              },
              s
            ),
        });
        // The arrowhead: same grip, fatter target, and the part that says
        // "drag along this axis" without anyone having to be told.
        add(grip("translate"), {
          part: "head",
          colour,
          offset: along(axis, HEAD_OFFSET),
          spin: alongAxis(axis),
          make: (name, fat) =>
            MeshBuilder.CreateCylinder(
              name,
              {
                height: HEAD_LENGTH * (fat > 1 ? 1.5 : 1),
                diameterTop: 0,
                // The pick cone is fattened much less than a shaft is: it is
                // already the widest thing on the axis, and inflating it 5×
                // would swallow the ring and the scale cube beside it.
                diameterBottom: HEAD_DIAMETER * (fat > 1 ? 1.8 : 1),
                /*
                  FOUR SIDES, NOT A CONE.

                  A square-based pyramid reads cleaner than a cone at this size,
                  and its EDGES carry orientation: a cone is rotationally
                  symmetric, so it tells you which way the axis points and
                  nothing about how the piece is turned. The pyramid's silhouette
                  changes as the widget turns, which is free feedback during a
                  rotate drag.
                */
                tessellation: 4,
              },
              s
            ),
        });
        /*
          The plane pad's axis is the plane's NORMAL, so this reads as "the pad
          you slide across while that axis stays put" — and it sits on that
          axis's row, between the arc and the origin, rather than diagonally out
          in the plane it slides in.
        */
        add(grip("planar"), {
          colour,
          alpha: 0.35,
          offset: along(axis, -PAD_ROW_OFFSET),
          spin: facing(axis),
          make: (name, fat) =>
            MeshBuilder.CreatePlane(
              name,
              { size: PAD_SIZE * (fat > 1 ? 1.6 : 1) },
              s
            ),
        });
      }

      if (transforms.rotate) {
        add(grip("rotate"), {
          colour,
          offset: along(axis, -ARC_OFFSET),
          spin: ringOn(axis),
          make: (name, fat) =>
            quarterAnnulus(
              name,
              fat > 1 ? ARC_INNER - ARC_PICK_MARGIN : ARC_INNER,
              fat > 1 ? ARC_OUTER + ARC_PICK_MARGIN : ARC_OUTER
            ),
        });
      }

      if (transforms.scale) {
        add(grip("scale"), {
          colour,
          offset: along(axis, CUBE_OFFSET),
          make: (name, fat) =>
            MeshBuilder.CreateBox(
              name,
              { size: CUBE_SIZE * (fat > 1 ? 2.2 : 1) },
              s
            ),
        });
      }
    }

    if (transforms.scale) {
      add(
        { kind: "uniform" },
        {
          colour: NEUTRAL,
          make: (name, fat) =>
            MeshBuilder.CreateBox(
              name,
              { size: CENTRE_SIZE * (fat > 1 ? 2 : 1) },
              s
            ),
        }
      );
    }

    place();
  };

  /*
    Position and orientation are decided at BUILD time and simply applied here.

    They used to be recomputed from the grip kind on every frame, which worked
    only while one kind meant exactly one mesh. An arrowhead is a second part of
    the same grip sitting at a different offset, and a switch on `kind` has no
    way to tell the two apart.
  */
  const place = () => {
    for (const { grip, mesh, offset, spin } of handles) {
      mesh.scaling.x = scale;
      mesh.scaling.y = scale;
      mesh.scaling.z = scale;
      mesh.rotation.x = spin[0];
      mesh.rotation.y = spin[1];
      mesh.rotation.z = spin[2];
      /*
        Scale cubes and rotation rings ride the PIECE's frame — those are the
        axes they actually act on. Translate shafts and pads stay world-aligned,
        because a move is a world move.
      */
      const local =
        orientation && (grip.kind === "scale" || grip.kind === "rotate");
      const along: Vec3 = local ? rotated(offset, orientation!) : offset;
      if (local) {
        // A quaternion, not euler: composing the piece's turn with the grip's
        // own turn in euler would mean re-deriving Babylon's order by hand.
        mesh.rotationQuaternion = orientation!.multiply(
          Quaternion.RotationYawPitchRoll(spin[1], spin[0], spin[2])
        );
      } else {
        mesh.rotationQuaternion = null;
      }
      mesh.position.x = position[0] + along[0] * scale;
      mesh.position.y = position[1] + along[1] * scale;
      mesh.position.z = position[2] + along[2] * scale;

      /*
        FORCE THE WORLD MATRIX. A mesh that has been positioned but not yet
        RENDERED has no world matrix, so a ray cast in the same frame finds it
        at the ORIGIN and answers confidently and wrongly.

        A manipulator is the worst possible case for that: it moves its handles
        and then immediately picks against them, so it can never wait for a
        render — and the editor's input loop deliberately runs even when the
        scene is paused. Measured, not assumed: without this, the handles picked
        as though they were at 0,0,0 while drawing correctly at the selection.
      */
      mesh.computeWorldMatrix(true);
    }
  };

  build();

  return {
    setTransforms(next) {
      if (
        next.translate === transforms.translate &&
        next.rotate === transforms.rotate &&
        next.scale === transforms.scale
      ) {
        return;
      }
      transforms = { ...next };
      build();
    },
    moveTo(next) {
      position = next;
      place();
    },
    setOrientation(rot) {
      const next =
        rot && (rot[0] !== 0 || rot[1] !== 0 || rot[2] !== 0)
          ? Quaternion.RotationYawPitchRoll(
              rot[1] * DEG,
              rot[0] * DEG,
              rot[2] * DEG
            )
          : null;
      const same =
        (next === null && orientation === null) ||
        (next !== null &&
          orientation !== null &&
          Quaternion.AreClose(next, orientation, 1e-4));
      // Per frame, like `setScale`: re-placing every mesh for an orientation
      // that has not changed is waste on the one loop that must not stutter.
      if (same) return;
      orientation = next;
      place();
    },
    setScale(next) {
      // Same guard as `setTransforms`: this runs per frame, and re-placing every
      // mesh (each forcing a world matrix) for a scale that has not moved is
      // pure waste on the one loop that must never stutter.
      if (Math.abs(next - scale) < 1e-3) return;
      scale = next;
      place();
    },
    setVisible(visible) {
      // Pick targets stay at visibility 0 either way; only the drawn ones toggle.
      for (const { mesh } of handles) {
        if (mesh.visibility !== 0) mesh.isVisible = visible;
      }
    },
    nearestGrip(hand) {
      let best: Grip | null = null;
      /*
        A hand is a fixed size; the handles are not, since they track the camera
        to stay constant on screen. So reach is the LARGER of what a hand needs
        and what the handle actually occupies — scaling the hand radius with the
        handle would shrink the grab volume to a centimetre exactly when you are
        close enough to reach for it.
      */
      let bestDistance = Math.max(NEAR_RADIUS, 0.5 * scale);
      for (const { grip, mesh } of handles) {
        const d = Math.hypot(
          mesh.position.x - hand[0],
          mesh.position.y - hand[1],
          mesh.position.z - hand[2]
        );
        if (d <= bestDistance) {
          bestDistance = d;
          best = grip;
        }
      }
      return best;
    },
    gripOf(mesh) {
      const meta = (mesh as { metadata?: Record<string, Grip> } | null)
        ?.metadata;
      return meta?.[HANDLE_TAG] ?? null;
    },
    isDrawn(mesh) {
      const meta = (mesh as { metadata?: Record<string, unknown> } | null)
        ?.metadata;
      return meta?.[DRAWN_TAG] === true;
    },
    alive() {
      return handles.length > 0 && !handles[0]!.mesh.isDisposed();
    },
    dispose() {
      for (const { mesh } of handles) mesh.dispose();
      for (const m of materials) m.dispose();
      handles.length = 0;
      materials.length = 0;
    },
  };
}
