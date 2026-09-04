/*#
# Writing a transform to a node

Rotation and scale, written onto the Babylon node itself, in the RUNTIME layer
because both the instantiator and the editor need them and the dependency may
only point one way: the editor may import the runtime, never the reverse.
Putting these in `transform-write.ts` — where they belong by subject — would
drag the whole editor into a game's bundle, which `tree-shaking.test.ts` exists
to prevent.

## Why the node, when the element has attributes for this

Because for a library-backed piece the attributes do nothing. `b3d-destroyable`
forwards only `{x, y, z, canonical}` to `library.instantiate`, so `rx`/`ry`/`rz`
are dropped on the floor, and `size` is documented as the placeholder cube's
edge length and ignored outright. Position is the exception: the element
rewrites `mesh.position` from `x`/`y`/`z` every frame, which is why moving a
piece has always worked and turning or scaling one never has.

Measured, all three:

| written | result |
|---|---|
| `piece.scale` 1 → 2 → 4 | rendered width 5.273 every time |
| `element.ry = 90` | node rotation `0,0,0`, quaternion null, unchanged |
| authored `rot: [0, 45, 0]` | footprint 3.63 × 3.63, identical to no rotation |

Writing the node works: 45° on the node took that footprint to 5.13 × 5.13,
which is the √2 a square turns into. Filed as tosijs-3d#47 (scale) and #48
(rotation); when they land this module retires.
*/
/*{"parent":"Runtime","order":7}*/
import { scaleVector } from "../format/scale.js";
import type { Euler, Vec3 } from "../format/types.js";

const DEG_TO_RAD = Math.PI / 180;

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

/**
 * Write euler DEGREES onto a node, converting to Babylon's radians.
 *
 * ⚠️ CLEARS THE QUATERNION FIRST. A `TransformNode` ignores `.rotation` entirely
 * while it has a `rotationQuaternion`, and the glTF loader always sets one — so
 * without this the write is accepted and does nothing, which is the exact bug
 * that made `library.instantiate()`'s rotation inert until tosijs-3d 0.7.0.
 */
export function applyEuler(
  node: TransformableNode | null | undefined,
  rot?: Euler
): void {
  if (!rot || !node?.rotation) return;
  node.rotationQuaternion = null;
  node.rotation.x = rot[0] * DEG_TO_RAD;
  node.rotation.y = rot[1] * DEG_TO_RAD;
  node.rotation.z = rot[2] * DEG_TO_RAD;
}
