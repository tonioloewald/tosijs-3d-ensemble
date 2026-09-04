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
  Matrix,
  Mesh,
  MeshBuilder,
  Quaternion,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { axisIndex, otherAxes } from "./handles.js";
import type { Axis, Grip, TransformSet } from "./handles.js";
import type { Euler, Vec3 } from "../format/types.js";

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
const SHAFT_LENGTH = 0.5;
// Circumscribed circle: a square 0.05 across the flats measures 0.0707 corner
// to corner, and `diameter` is the corners.
const SHAFT_DIAMETER = 0.0707;
const SHAFT_PICK_FATNESS = 11;
const SHAFT_OFFSET = 0.35;
const PAD_SIZE = 0.2;
/*
  PROPORTIONS TAKEN FROM THE OWNER'S REFERENCE MODEL, not invented here.

  `3d-manipulator.glb`, measured rather than eyeballed. Its parts, in the frame
  each is authored in:

    arrow    shaft 0.1 → 0.8, square 0.05 across; head 0.8 → 1.1, base 0.2
    ring     FLAT annulus, inner 0.8, outer 1.0, centred on the origin
    pad      flat plate 0.2 × 0.2, centred 0.2 along one of its plane's axes

  One deliberate departure, and it replaced a cleverer fix. The arc used to be
  rolled at draw time into whichever gap between the arrows was widest, because
  rings ride the PIECE's frame while arrows stay world-aligned, so on a turned
  piece a fixed quarter swings over them. The owner's answer was better: give the
  ring a radial band the arrow does not occupy. The shaft now stops at 0.6 and
  the head starts at 0.8, leaving a hole for the ring at 0.6 → 0.8. Nothing can
  overlap at any orientation, the arc goes back to a fixed spoke, and a
  per-frame computation and its explanation both disappear.

  ⚠️ The break in the shaft is LOAD-BEARING. It looks like an arbitrary gap and
  it is the only reason arcs and arrows cannot collide, so closing it up to make
  the arrow "whole" reintroduces the bug at every orientation but the identity.

  It is also frame-AGNOSTIC, which is the property worth keeping. Arrows are
  world-aligned and arcs ride the piece today, and a radial band that no arrow
  occupies clears them whatever their relative orientation — so if a coordinate
  system picker ever lands and puts translation in the piece's frame too, the
  axes still work and none of this needs revisiting.

  Two things I had wrong and the model settled. The rings are FULL circles
  centred on the origin, in the plane they rotate in — not quarters, and not
  offset along the axis, which put them in the wrong plane as well as the wrong
  place. And the arrow cross-sections are squares standing on their CORNERS:
  the model's vertices sit at (±0.1, ±0.1), where Babylon's 4-sided cylinder
  puts them at 0°/90°/180°/270°. Hence the 45° roll, baked into the geometry.

  The ring is a zero-thickness ribbon where the model has a 0.05 slab: it reads
  the same from any angle a manipulator is used at, and costs half the triangles.
*/
const RING_INNER = 0.6;
const RING_OUTER = 0.8;
/** Extra band width per edge on the invisible pick ring. */
/*
  Modest, on purpose: the pick band must not reach the arrowhead at 0.8. Where
  it does graze, the two-pass pick settles it — drawn handles are tried before
  fat invisible targets, so the head you aimed at wins over the ring you nearly
  reached.
*/
const RING_PICK_MARGIN = 0.08;
const RING_SEGMENTS = 32;
/** Centre distance of a plane pad along its offset axis. */
const PAD_OFFSET = 0.2;
const CUBE_SIZE = 0.17;
// Outside the ring and the arrowhead, both of which reach 1.1.
const CUBE_OFFSET = 1.28;
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
const HEAD_LENGTH = 0.3;
const HEAD_DIAMETER = 0.283;
/*
  NOT derived from the shaft any more. The arrow is deliberately BROKEN between
  0.6 and 0.8 so the ring can pass through the hole, so the head is positioned
  absolutely: 0.8 → 1.1, centred at 0.95.
*/
const HEAD_OFFSET = 0.95;

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
   * A ribbon between two arcs: `CreateDisc` has an `arc` option but gives a pie
   * slice with no hole. Double-sided, because a flat band seen from the other
   * face would otherwise be invisible AND unpickable, and which face you see is
   * the camera's business.
   *
   * The reference model spans 135°–225° — a quarter centred on its local −X.
   * `startDegrees` shifts that, because `ringOn` aims the NORMAL and takes the
   * quarter wherever the rest of its rotation happens to put it.
   */
  const quarterAnnulus = (
    name: string,
    inner: number,
    outer: number,
    startDegrees: number
  ) => {
    const arc = (radius: number): Vector3[] => {
      const points: Vector3[] = [];
      for (let i = 0; i <= RING_SEGMENTS; i++) {
        const t = ((startDegrees + (i / RING_SEGMENTS) * 90) * Math.PI) / 180;
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

  /**
   * Where each axis's quarter starts, so it lands on the −`previousAxis` spoke.
   *
   * Measured off the reference model: rotate-about-Y sits on −X, about-X on −Z,
   * about-Z on −Y — the SAME spoke as that axis's plane pad, which is what makes
   * each axis read as one row. `ringOn` only fixes the normal; the roll within
   * the plane is left over, and rather than composing a second rotation into
   * `spin` the arc is simply generated at the right angle.
   */
  const arcStart = (axis: Axis): number =>
    axis === "x" ? 225 : axis === "z" ? 45 : 135;

  /**
   * A 4-sided cylinder standing on its CORNERS, like the reference model's.
   *
   * Babylon puts the first vertex of a tessellated cylinder at angle 0, so a
   * 4-sided one has flat faces facing the axes. The model has vertices there
   * instead — "the arrow heads should be rotated by 45 degrees" — which is a
   * cleaner silhouette and, being asymmetric under 90° turns, tells you how the
   * piece is ORIENTED rather than just which way the axis runs.
   *
   * Baked into the vertices rather than set as a rotation, because `spin`
   * already owns `mesh.rotation` and composing a roll into that euler is a
   * worse way to say the same thing.
   */
  const squareTapered = (
    name: string,
    options: { height: number; diameterTop: number; diameterBottom: number }
  ) => {
    const mesh = MeshBuilder.CreateCylinder(
      name,
      { ...options, tessellation: 4 },
      s
    );
    mesh.bakeTransformIntoVertices(Matrix.RotationY(Math.PI / 4));
    return mesh;
  };

  /** Turn a torus (lying in XZ, normal +Y) so its normal is `axis`. */
  const ringOn = (axis: Axis): Vec3 =>
    axis === "x" ? [0, 0, HALF] : axis === "z" ? [HALF, 0, 0] : [0, 0, 0];

  /** Turn a plane (facing +Z) so it faces `axis`. */
  const facing = (axis: Axis): Vec3 =>
    axis === "x" ? [0, HALF, 0] : axis === "y" ? [HALF, 0, 0] : [0, 0, 0];

  /** The axis before this one in x → y → z → x. */
  const previousAxis = (axis: Axis): Axis =>
    axis === "x" ? "z" : axis === "y" ? "x" : "y";

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
            squareTapered(name, {
              height: SHAFT_LENGTH,
              diameterTop: SHAFT_DIAMETER * (fat > 1 ? SHAFT_PICK_FATNESS : 1),
              diameterBottom:
                SHAFT_DIAMETER * (fat > 1 ? SHAFT_PICK_FATNESS : 1),
            }),
        });
        // The arrowhead: same grip, fatter target, and the part that says
        // "drag along this axis" without anyone having to be told.
        add(grip("translate"), {
          part: "head",
          colour,
          offset: along(axis, HEAD_OFFSET),
          spin: alongAxis(axis),
          make: (name, fat) =>
            squareTapered(name, {
              height: HEAD_LENGTH * (fat > 1 ? 1.5 : 1),
              diameterTop: 0,
              // Fattened much less than a shaft: it is already the widest thing
              // on the axis, and inflating it 5x would swallow the ring.
              diameterBottom: HEAD_DIAMETER * (fat > 1 ? 1.8 : 1),
            }),
        });
        /*
          The plane pad's axis is the plane's NORMAL, so this reads as "the pad
          you slide across while that axis stays put" — and it sits on that
          axis's row, between the arc and the origin, rather than diagonally out
          in the plane it slides in.
        */
        /*
          The pad lies IN the plane it slides across — `facing` points its
          normal down the grip's axis — and is offset along one of that plane's
          own two axes, which is where the reference model puts it.

          Which one: the axis BEFORE the normal in x→y→z→x. That gives XZ→−X,
          XY→−Y, YZ→−Z, matching the model and, more importantly, putting the
          three pads on three DIFFERENT axes. Any rule that reuses an axis puts
          two pads at the same point in different planes, intersecting.
        */
        add(grip("planar"), {
          colour,
          alpha: 0.35,
          offset: along(previousAxis(axis), -PAD_OFFSET),
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
          spin: ringOn(axis),
          make: (name, fat) =>
            quarterAnnulus(
              name,
              fat > 1 ? RING_INNER - RING_PICK_MARGIN : RING_INNER,
              fat > 1 ? RING_OUTER + RING_PICK_MARGIN : RING_OUTER,
              arcStart(axis)
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
