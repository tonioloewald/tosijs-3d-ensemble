/*#
# Writing a transform

An ensemble's pieces have **two kinds of body** and they are written to
differently. Getting this wrong does not error — it silently does nothing, which
is the worst failure mode a manipulator can have.

| body | write to | why |
|---|---|---|
| an ELEMENT (`b3d-destroyable`) | `el.x/y/z`, `el.rx/ry/rz` | the element OWNS its transform: `render()` writes `mesh.position` from those attributes, so a write straight to the mesh is undone the next time anything re-renders |
| a NODE (a plain library instance) | `node.position` / `rotation` / `scaling` | nothing manages it, so the node IS the truth |

## Scale is the exception, and `size` is a trap

`b3d-destroyable`'s `size` is documented as the *placeholder cube edge length*,
**ignored when `library` is set** — so writing it does nothing for any piece
with a real mesh, which is every mesh piece we place. Measured before relying on
it: a piece's rendered width was 5.273 at `scale: 1`, `2` and `4` alike, with
the root node's scaling sitting at `1,1,1` throughout. `piece.scale` was inert,
and the editor's scale control was moving a number nothing read.

What DOES work is the element's own node. `element.mesh` is the library
instance's root `TransformNode`, the element manages its position and rotation
but not its scaling, and a write there survives: setting `2, 1.5, 3` held across
frames and took the width from 5.273 to 10.546. So scale goes to the node in
both branches, and per-axis comes free — filed upstream as tosijs-3d#47, since
a scale attribute belongs on the element.

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
import { applyScale } from '../runtime/node-scale'
import type { ScalableNode } from '../runtime/node-scale'
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
  /** The managed node. Present once the library has instantiated — see below. */
  mesh?: ScalableNode | null
}

export interface NodeBody {
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  rotationQuaternion?: unknown
  scaling?: { x: number; y: number; z: number }
}

export interface Transform {
  /** World position. */
  at?: Vec3
  /** Euler DEGREES, as the format stores them. */
  rot?: Euler
  /** Uniform when a number, per-axis when a triple. */
  scale?: number | Vec3
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
  /*
    NOT `element.size` — that is the placeholder-cube attribute and it is
    ignored for a library-backed piece. The node is the only thing that
    actually scales. See the note at the top; this was measured, not reasoned.
  */
  applyScale(element.mesh, scale)
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
  applyScale(node, scale)
}
