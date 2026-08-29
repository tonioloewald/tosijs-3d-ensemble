/*#
# Scaling a node

One function, in the RUNTIME layer, because both sides need it and the
dependency may only point one way: the editor may import the runtime, never the
reverse. Putting it in `transform-write.ts` — where it naturally belongs by
subject — would have dragged the whole editor into a game's bundle, which
`tree-shaking.test.ts` exists to prevent.

Why a node at all, when a piece has a `scale` attribute to write: see
[[Placing a piece's body]]. `b3d-destroyable`'s `size` is ignored for a
library-backed piece, and the node's `scaling` is what actually moves.
*/
/*{"parent":"Runtime","order":7}*/
import { scaleVector } from '../format/scale'
import type { Vec3 } from '../format/types'

/** Anything with a Babylon-shaped `scaling`. */
export interface ScalableNode {
  scaling?: { x: number; y: number; z: number }
}

/** Write a scale onto a node, if there is one and a scale was given. */
export function applyScale(node: ScalableNode | null | undefined, scale?: number | Vec3): void {
  if (scale === undefined || !node?.scaling) return
  const [x, y, z] = scaleVector(scale)
  node.scaling.x = x
  node.scaling.y = y
  node.scaling.z = z
}
