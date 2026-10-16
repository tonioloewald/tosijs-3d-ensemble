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
- **a non-uniform scale** (the format's `Vec3`) is still written to the node,
  because upstream's `scale` is uniform on purpose ("a modelling decision, not
  a placement one"). And here is the trap that cost a bug: the element
  re-applies its uniform `scale` on EVERY render, so a stretch written once to
  the node was wiped by the next move or turn — measured `[2, 1, 3]` back to
  `[1, 1, 1]` after one `ry` write. `scaleElement` therefore re-applies it
  after each of that element's renders. `tests/library-transform.pw.ts`
  measures all of it on rendered footprints.

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
  mesh?: TransformableNode | null;
  scale?: number;
  render(): void;
}

const stretches = new WeakMap<object, Vec3>();
const hooked = new WeakSet<object>();

/**
 * Scale a library-backed element: uniform through its own `scale`, a stretch
 * on its node, re-applied after each of its renders (which reset the node to
 * the uniform `scale`). See the note at the top.
 */
export function scaleElement(
  element: ScalableElement,
  scale?: number | Vec3
): void {
  if (scale === undefined) return;
  const v = scaleVector(scale);
  if (v[0] === v[1] && v[1] === v[2]) {
    stretches.delete(element);
    element.scale = v[0];
    return;
  }
  stretches.set(element, v);
  if (!hooked.has(element)) {
    hooked.add(element);
    const render = element.render;
    element.render = function (this: ScalableElement) {
      render.call(this);
      const stretch = stretches.get(this);
      if (stretch) applyScale(this.mesh, stretch);
    };
  }
  element.scale = 1;
  applyScale(element.mesh, v);
}
