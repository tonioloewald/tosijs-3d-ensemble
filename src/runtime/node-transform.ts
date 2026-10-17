/*#
# Writing a transform to a node

Rotation and scale, written onto the Babylon node itself, in the RUNTIME layer
because both the instantiator and the editor need them and the dependency may
only point one way: the editor may import the runtime, never the reverse.
Putting these in `transform-write.ts` — where they belong by subject — would
drag the whole editor into a game's bundle, which `tree-shaking.test.ts` exists
to prevent.

## Rotation is the element's; scale is the element's when it can be

For years a library-backed piece could be neither turned nor scaled through its
element: `b3d-destroyable` forwarded only position to `library.instantiate`,
and `size` is the placeholder cube's edge. We wrote both onto the node. tosijs-3d
0.8.1 fixed both (#47, #48), so:

- **rotation** is the element's `rx`/`ry`/`rz` (DEGREES), full stop. It
  forwards them, and re-renders once its node exists.
- **a uniform scale** is the element's `scale`.
- **a non-uniform scale** (the format's `Vec3`) is the element's `stretch`,
  per axis, times `scale` (tosijs-3d 0.10.12, #105). Before that we wrote it
  to the node, and the element reset the node on every render, so a stretch
  was wiped by the next move or turn, and one set at build time was lost when
  the instance arrived; a render wrapper re-applied it. Both are measured in
  `tests/library-transform.pw.ts` on rendered footprints (a built [2, 1, 3]
  is 18.108 wide), now with no wrapper.

A plain node (no element) has nothing managing it, so `applyScale` writes it
directly; the editor's node path rotates it directly too.
*/
/*{"parent":"Runtime","order":7}*/
import { scaleVector } from "../format/scale.js";
import type { Vec3 } from "../format/types.js";

/** A Babylon node, as much of one as writing a transform needs. */
export interface TransformableNode {
  rotation?: { x: number; y: number; z: number };
  rotationQuaternion?: unknown;
  scaling?: { x: number; y: number; z: number };
}

/** Back-compat alias: this module was `node-scale.ts` when scale was all it did. */
export type ScalableNode = TransformableNode;

/** Write a scale onto a node, if there is one and a scale was given. */
export function applyScale(
  node: TransformableNode | null | undefined,
  scale?: number | Vec3
): void {
  if (scale === undefined || !node?.scaling) return;
  const [x, y, z] = scaleVector(scale);
  node.scaling.x = x;
  node.scaling.y = y;
  node.scaling.z = z;
}

/** A `b3d-destroyable`, as much of one as scaling needs. */
export interface ScalableElement {
  scale?: number;
  /** Per axis, times `scale`: `"2 1 3"`; empty for none (tosijs-3d 0.10.12). */
  stretch?: string;
}

/**
 * Scale a library-backed element, uniform or per axis, through its own
 * attributes: `scale` and, since tosijs-3d 0.10.12 (#105), `stretch`, which
 * the element applies when its instance arrives and keeps through renders.
 * This used to write the node and re-apply it after every render of the
 * element, because the element reset it; that wrapper is gone.
 */
export function scaleElement(
  element: ScalableElement,
  scale?: number | Vec3
): void {
  if (scale === undefined) return;
  const v = scaleVector(scale);
  if (v[0] === v[1] && v[1] === v[2]) {
    element.stretch = "";
    element.scale = v[0];
    return;
  }
  element.scale = 1;
  element.stretch = `${v[0]} ${v[1]} ${v[2]}`;
}
