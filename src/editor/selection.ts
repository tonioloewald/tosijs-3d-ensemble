/*#
# Selecting a piece

Clicking a turret's barrel selects **the turret**, not the barrel. A library
model is a tree — a hull with a barrel with a muzzle, or a glTF import split
into `_primitive0`, `_primitive1` — so the mesh under the pointer is almost
never the thing an author means.

So picking walks **up** from whatever was hit until it reaches a node the
ensemble actually placed, and selects that piece. If the walk runs out of
parents without finding one, the pick was scenery: the ground, the sky, the
water. That is a miss, not a selection of something arbitrary.

## Why a map rather than a search

Every pick would otherwise compare the hit against every piece's body. The map
is built once per rebuild, keyed by the node objects themselves, so a pick is a
walk up a short parent chain with a hash lookup at each step — and it stays that
way with a thousand pieces.
*/
/*{"parent":"Internals","order":6}*/
import type { BuiltEnsemble } from "../runtime/build";
import type { EditorRay } from "./input/pointer";

interface NodeLike {
  parent?: NodeLike | null;
  isPickable?: boolean;
}

interface PickResult {
  hit?: boolean;
  pickedMesh?: NodeLike | null;
}

interface PickingSceneLike {
  pickWithRay: (
    ray: { origin: unknown; direction: unknown },
    predicate?: (mesh: NodeLike) => boolean
  ) => PickResult | null;
}

/** Element bodies expose their mesh; node bodies ARE the node. */
interface ElementWithMesh {
  mesh?: NodeLike | null;
}

/**
 * Map every node an ensemble placed to the piece that owns it.
 *
 * Rebuild this whenever the ensemble is rebuilt — the nodes are new objects
 * afterwards, and a stale map silently selects nothing.
 */
export function bodyIndex(built: BuiltEnsemble | null): Map<unknown, string> {
  const index = new Map<unknown, string>();
  if (!built) return index;
  for (const [id, piece] of built.pieces) {
    const element = piece.element as unknown as ElementWithMesh | null;
    if (element?.mesh) index.set(element.mesh, id);
    if (piece.node) index.set(piece.node, id);
  }
  return index;
}

/**
 * Walk up from a hit node to the piece that owns it.
 *
 * Bounded by `maxDepth` rather than trusting the tree: a cycle in a parent
 * chain would hang the editor on every mouse move, which is a hard failure to
 * diagnose because nothing errors — the page simply stops.
 */
export function owningPiece(
  index: Map<unknown, string>,
  hit: NodeLike | null | undefined,
  maxDepth = 32
): string | null {
  let node: NodeLike | null | undefined = hit;
  for (let depth = 0; node && depth < maxDepth; depth++) {
    const id = index.get(node);
    if (id !== undefined) return id;
    node = node.parent;
  }
  return null;
}

/**
 * Cast a ray and return the piece it hits, or null.
 *
 * The predicate keeps the backdrop and the manipulator's own handles out of the
 * result: picking the ground would deselect on every miss-click, and picking a
 * handle would select whatever the handle is attached to instead of dragging it.
 */
export function pickPiece(
  scene: PickingSceneLike,
  index: Map<unknown, string>,
  ray: EditorRay,
  toEngineRay: (ray: EditorRay) => { origin: unknown; direction: unknown }
): string | null {
  const result = scene.pickWithRay(
    toEngineRay(ray),
    (mesh) => mesh.isPickable !== false && owningPiece(index, mesh) !== null
  );
  if (!result?.hit) return null;
  return owningPiece(index, result.pickedMesh);
}
