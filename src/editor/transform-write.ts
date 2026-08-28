/*#
# Writing a transform

An ensemble's pieces have **two kinds of body** and they are written to
differently. Getting this wrong does not error — it silently does nothing, which
is the worst failure mode a manipulator can have.

| body | write to | why |
|---|---|---|
| an ELEMENT (`b3d-destroyable`) | `el.x/y/z`, `el.rx/ry/rz` | the element OWNS its transform: `render()` writes `mesh.position` from those attributes, so a write straight to the mesh is undone the next time anything re-renders |
| a NODE (a plain library instance) | `node.position` / `rotation` / `scaling` | nothing manages it, so the node IS the truth |

`rx`/`ry`/`rz` are **degrees** on an element (`yaw`/`pitch`/`roll` are aliases
for `ry`/`rx`/`rz`), matching the format. Babylon nodes are **radians**, so the
node path converts.

## The quaternion trap, on our side of the fence

A `TransformNode` **ignores `.rotation` while it has a `rotationQuaternion`** —
and the glTF loader always sets one. That is exactly the bug that made
`library.instantiate()`'s rotation silently inert until tosijs-3d 0.7.0: it
wrote `.rotation`, the quaternion won, and every value produced the model's
baked orientation. `position` worked, which is what made it look wired up.

So rotating a node here **clears the quaternion first**. Skip that and a
rotation drag moves nothing, with no error anywhere.
*/
/*{"parent":"Internals","order":8}*/
import type { Euler, Vec3 } from '../format/types'

const DEG_TO_RAD = Math.PI / 180

export interface ElementBody {
  x?: number
  y?: number
  z?: number
  rx?: number
  ry?: number
  rz?: number
  size?: number
}

export interface NodeBody {
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  rotationQuaternion?: unknown
  scaling?: { setAll?: (value: number) => void }
}

export interface Transform {
  /** World position. */
  at?: Vec3
  /** Euler DEGREES, as the format stores them. */
  rot?: Euler
  /** Uniform scale. */
  scale?: number
}

export interface WritableBody {
  element?: ElementBody | null
  node?: unknown
}

/**
 * Write a transform to whichever body a piece has.
 *
 * Returns which path was taken, so a caller can assert it in a test rather than
 * trust that the right branch ran — this is a fork whose wrong branch is
 * invisible at runtime.
 */
export function writeTransform(body: WritableBody, transform: Transform): 'element' | 'node' | 'none' {
  if (body.element) {
    writeElement(body.element, transform)
    return 'element'
  }
  if (body.node) {
    writeNode(body.node as NodeBody, transform)
    return 'node'
  }
  return 'none'
}

function writeElement(element: ElementBody, { at, rot, scale }: Transform): void {
  if (at) {
    element.x = at[0]
    element.y = at[1]
    element.z = at[2]
  }
  if (rot) {
    // Degrees, straight through — the element's own unit.
    element.rx = rot[0]
    element.ry = rot[1]
    element.rz = rot[2]
  }
  if (scale !== undefined) element.size = scale
}

function writeNode(node: NodeBody, { at, rot, scale }: Transform): void {
  if (at && node.position) {
    node.position.x = at[0]
    node.position.y = at[1]
    node.position.z = at[2]
  }
  if (rot && node.rotation) {
    // CLEAR THE QUATERNION FIRST — see the note above. While one is present the
    // node ignores `.rotation` entirely and the drag does nothing.
    node.rotationQuaternion = null
    node.rotation.x = rot[0] * DEG_TO_RAD
    node.rotation.y = rot[1] * DEG_TO_RAD
    node.rotation.z = rot[2] * DEG_TO_RAD
  }
  if (scale !== undefined) node.scaling?.setAll?.(scale)
}
