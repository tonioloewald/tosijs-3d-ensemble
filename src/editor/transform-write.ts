/*#
# Writing a transform

An ensemble's pieces have **two kinds of body** and they are written to
differently. Getting this wrong does not error — it silently does nothing, which
is the worst failure mode a manipulator can have.

| body | write to | why |
|---|---|---|
| an ELEMENT (`b3d-destroyable`) | `el.x/y/z`, `el.rx/ry/rz`, `el.scale` | the element OWNS its transform: `render()` writes the node from those attributes, so a write straight to the node is undone the next time anything re-renders |
| a NODE (a plain library instance) | `node.position` / `rotation` / `scaling` | nothing manages it, so the node IS the truth |

## Scale: the element's, unless it is a stretch

`b3d-destroyable`'s `size` is the *placeholder cube edge length*, ignored once
`library` is set (measured: 5.273 wide at `scale` 1, 2 and 4). tosijs-3d 0.8.1
(#47) added a UNIFORM `scale`, and re-applies it to the node on every render.
That is what bit us: a per-axis scale we wrote to the node was reset by the
next move or turn (`[2, 1, 3]` → `[1, 1, 1]`, measured). So `scaleElement`
sends a uniform scale to the element and keeps a stretch on the node through
the element's re-renders; tosijs-3d#105 asks for a way not to need that.

`rx`/`ry`/`rz` are **degrees** on an element (`yaw`/`pitch`/`roll` are aliases
for `ry`/`rx`/`rz`), matching the format. Babylon nodes are **radians**, so the
node path converts.

## The quaternion trap, on our side of the fence

A `TransformNode` **ignores `.rotation` while it has a `rotationQuaternion`** —
and the glTF loader always sets one. That is exactly the bug that made
`library.instantiate()`'s rotation silently inert until tosijs-3d 0.7.0: it
wrote `.rotation`, the quaternion won, and every value produced the model's
baked orientation. `position` worked, which is what made it look wired up.

So rotating a plain node here **clears the quaternion first**. Skip that and a
rotation drag moves nothing, with no error anywhere.
*/
/*{"parent":"Internals","order":8}*/
import { applyScale, scaleElement } from "../runtime/node-transform.js";
import type {
  ScalableElement,
  TransformableNode,
} from "../runtime/node-transform.js";
import type { Euler, Vec3 } from "../format/types.js";

const DEG_TO_RAD = Math.PI / 180;

export interface ElementBody {
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  size?: number;
  /** The managed node. Present once the library has instantiated — see below. */
  mesh?: TransformableNode | null;
}

export interface NodeBody {
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  rotationQuaternion?: unknown;
  scaling?: { x: number; y: number; z: number };
}

export interface Transform {
  /** World position. */
  at?: Vec3;
  /** Euler DEGREES, as the format stores them. */
  rot?: Euler;
  /** Uniform when a number, per-axis when a triple. */
  scale?: number | Vec3;
}

export interface WritableBody {
  element?: ElementBody | null;
  node?: unknown;
}

/**
 * Write a transform to whichever body a piece has.
 *
 * Returns which path was taken, so a caller can assert it in a test rather than
 * trust that the right branch ran — this is a fork whose wrong branch is
 * invisible at runtime.
 */
export function writeTransform(
  body: WritableBody,
  transform: Transform
): "element" | "node" | "none" {
  if (body.element) {
    writeElement(body.element, transform);
    return "element";
  }
  if (body.node) {
    writeNode(body.node as NodeBody, transform);
    return "node";
  }
  return "none";
}

function writeElement(
  element: ElementBody,
  { at, rot, scale }: Transform
): void {
  if (at) {
    element.x = at[0];
    element.y = at[1];
    element.z = at[2];
  }
  if (rot) {
    // DEGREES. The element applies them itself since tosijs-3d 0.8.1 (#48),
    // through the node's QUATERNION, so `node.rotation` reads 0 while the
    // piece is visibly turned: measure `forward`, not `.rotation` (a probe
    // that read `.rotation` blamed upstream for a bug that was ours).
    element.rx = rot[0];
    element.ry = rot[1];
    element.rz = rot[2];
  }
  /*
    NOT `element.size` — that is the placeholder-cube attribute and it is
    ignored for a library-backed piece. `scaleElement` uses the element's own
    uniform `scale`, and keeps a non-uniform one on the node through the
    element's re-renders, which reset it otherwise (measured: a turn undid a
    [2, 1, 3] stretch).
  */
  scaleElement(element as unknown as ScalableElement, scale);
}

function writeNode(node: NodeBody, { at, rot, scale }: Transform): void {
  if (at && node.position) {
    node.position.x = at[0];
    node.position.y = at[1];
    node.position.z = at[2];
  }
  if (rot) turnNode(node, rot);
  applyScale(node, scale);
}

/**
 * Turn a node to euler DEGREES, CLEARING ITS QUATERNION FIRST — see the note
 * at the top. While one is present the node ignores `.rotation` entirely and
 * the write does nothing.
 */
function turnNode(
  node: TransformableNode | null | undefined,
  rot: Euler
): void {
  if (!node?.rotation) return;
  node.rotationQuaternion = null;
  node.rotation.x = rot[0] * DEG_TO_RAD;
  node.rotation.y = rot[1] * DEG_TO_RAD;
  node.rotation.z = rot[2] * DEG_TO_RAD;
}
