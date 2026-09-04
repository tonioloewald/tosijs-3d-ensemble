/*#
# The selection marker

A box around the selected piece, shown whenever something is selected —
**including when no transform is enabled**, which is the whole reason it
exists.

## Why an outline was not enough

There is a `HighlightLayer` too, and for a long time there was only that. It had
never worked: both kinds of body hand you a `TransformNode` at the top, the
layer takes meshes, and the call that fed it one was wrapped in a `catch`. So
"the piece you are about to move" was communicated by a property panel and
nothing else, twice reported and once wrongly believed fixed.

Even working, a glow is the wrong signal here. It says *which mesh* and nothing
about *how big the thing is*, which in an arrangement editor is most of what you
want to know. A box answers that and recolours nothing.

There were three axis rods through the origin as well, and they are gone: with a
manipulator present they duplicated its shafts, and without one they were more
clutter than information.

## Quiet, but not invisible

The first version used `CreateLines` for the axes and a `wireframe` material for
the box. Both render — measured: four meshes, visible, enabled, in the active
list — and both are effectively **one pixel wide**, because WebGL has no line
width. On a phone that is nothing at all: "I don't see selection feedback so I
need to turn on transformation to get any selection feedback."

So the box is drawn by `enableEdgesRendering`, which emits its twelve edges as
camera-facing quads at a width in PIXELS. A `wireframe` material cannot do this
job twice over: its lines are one pixel wide at every distance, and it draws the
triangulation — a diagonal across every face, which is exactly the "triangles
splitting the faces" that made the box distracting. Edges skip them by design.

The mesh itself is fully transparent. It is still rendered, which is what gives
the edge renderer something to hang off; it simply contributes no pixels of its
own.

It marks the selection; it is not a control, and anything that LOOKS grabbable
but is not is worse than nothing.
*/
/*{"parent":"Internals","order":6}*/
import { Color3, Color4, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import type { Vec3 } from "../format/types.js";

/** Marks a mesh as ours, so picking can tell a marker from the scene. */
export const MARKER_TAG = "ensemble-editor-selection";

const BOX_COLOR: [number, number, number] = [0.18, 0.62, 0.56];

/**
 * Edge width in PIXELS, which is the point of using edge rendering at all.
 *
 * A wireframe material draws one-pixel lines whatever the screen; edges are
 * quads and hold their width. Four is legible on a phone without reading as a
 * control you could grab.
 */
const EDGE_WIDTH = 4;

export interface Bounds {
  centre: Vec3;
  /** HALF-extents, so a 2 m cube is `[1, 1, 1]`. */
  extents: Vec3;
}

export interface SelectionView {
  show(bounds: Bounds): void;
  hide(): void;
  /**
   * Are these meshes still in a live scene?
   *
   * A view holds Babylon meshes, and those can be disposed out from under it —
   * a scene torn down and rebuilt, a library reload, an element reconnecting.
   * The view object survives that perfectly happily and writes to disposed
   * meshes forever after, which is silent and permanent: measured mid-session
   * with the marker object present, zero of its meshes in the scene, and no
   * selection feedback for the rest of the run.
   */
  alive(): boolean;
  dispose(): void;
}

interface Marker {
  position: { x: number; y: number; z: number };
  scaling: { x: number; y: number; z: number };
  isVisible: boolean;
  isPickable: boolean;
  isDisposed: () => boolean;
  renderingGroupId: number;
  material?: unknown;
  rotation: { x: number; y: number; z: number };
  enableEdgesRendering?: () => void;
  edgesWidth?: number;
  edgesColor?: Color4;
  dispose: () => void;
  computeWorldMatrix: (force: boolean) => void;
}

export function createSelectionView(scene: unknown): SelectionView {
  const s = scene as never;
  const parts: Marker[] = [];
  const materials: Array<{ dispose: () => void }> = [];

  const box = MeshBuilder.CreateBox(
    `${MARKER_TAG}-box`,
    { size: 1 },
    s
  ) as unknown as Marker;
  const outline = new StandardMaterial(
    `${MARKER_TAG}-box-mat`,
    s
  ) as unknown as {
    emissiveColor: Color3;
    disableLighting: boolean;
    wireframe: boolean;
    alpha: number;
    dispose: () => void;
  };
  outline.emissiveColor = new Color3(...BOX_COLOR);
  outline.disableLighting = true;
  /*
    Invisible faces, visible edges. NOT `wireframe`: that draws the
    triangulation, so every face gets a diagonal across it — "the triangles
    splitting the faces of the bounding box are distracting", and quite right.
    A fully transparent solid still renders, which is all the edge renderer
    needs, and tints nothing.
  */
  outline.wireframe = false;
  outline.alpha = 0;
  box.material = outline;
  box.enableEdgesRendering?.();
  box.edgesWidth = EDGE_WIDTH;
  box.edgesColor = new Color4(...BOX_COLOR, 1);
  parts.push(box);

  for (const part of parts) {
    part.isPickable = false;
    // Draw on top, with the manipulator. A marker hidden inside the mesh it
    // marks tells you nothing, and interior geometry is the common case.
    part.renderingGroupId = 1;
    part.isVisible = false;
  }

  return {
    show({ centre, extents }) {
      // A zero extent (a piece whose mesh has not loaded) would collapse the
      // box into an invisible plane; a floor keeps the marker findable.
      const size: Vec3 = [
        Math.max(extents[0], 0.05),
        Math.max(extents[1], 0.05),
        Math.max(extents[2], 0.05),
      ];
      box.position.x = centre[0];
      box.position.y = centre[1];
      box.position.z = centre[2];
      box.scaling.x = size[0] * 2;
      box.scaling.y = size[1] * 2;
      box.scaling.z = size[2] * 2;
      box.isVisible = true;
      box.computeWorldMatrix(true);
    },
    hide() {
      for (const part of parts) part.isVisible = false;
    },
    alive() {
      return parts.length > 0 && !box.isDisposed();
    },
    dispose() {
      for (const part of parts) part.dispose();
      for (const m of materials) m.dispose();
      outline.dispose();
      parts.length = 0;
      materials.length = 0;
    },
  };
}
