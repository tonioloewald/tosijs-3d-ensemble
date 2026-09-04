import { describe, expect, it } from "bun:test";
import { bodyIndex, owningPiece } from "./selection.js";
import type { BuiltEnsemble } from "../runtime/build.js";

const node = (name: string, parent?: object) => ({
  name,
  parent: parent ?? null,
});

const built = (pieces: Record<string, { element?: object; node?: object }>) =>
  ({
    pieces: new Map(
      Object.entries(pieces).map(([id, body]) => [
        id,
        {
          piece: { id, at: [0, 0, 0] },
          at: [0, 0, 0],
          scale: 1,
          handles: new Map(),
          ...body,
        },
      ])
    ),
  } as unknown as BuiltEnsemble);

describe("selection", () => {
  it("indexes element bodies by their mesh and node bodies by themselves", () => {
    const mesh = node("turret-mesh");
    const plain = node("rock");
    const index = bodyIndex(
      built({ turret: { element: { mesh } }, rock: { node: plain } })
    );
    expect(index.get(mesh)).toBe("turret");
    expect(index.get(plain)).toBe("rock");
  });

  it("walks UP from a child to the piece that owns it", () => {
    // Clicking the barrel selects the turret — a library model is a tree, and
    // the mesh under the pointer is almost never the thing an author means.
    const root = node("turret");
    const barrel = node("barrel", root);
    const muzzle = node("muzzle_primitive0", barrel);
    const index = bodyIndex(built({ turret: { node: root } }));
    expect(owningPiece(index, muzzle)).toBe("turret");
  });

  it("returns null for scenery rather than selecting something arbitrary", () => {
    const index = bodyIndex(built({ turret: { node: node("turret") } }));
    expect(owningPiece(index, node("ground"))).toBeNull();
  });

  it("gives up on a cyclic parent chain instead of hanging", () => {
    // A cycle here would freeze the editor on every pointer move, with no error
    // anywhere — the page just stops. Bound the walk rather than trust the tree.
    const a: { name: string; parent?: unknown } = { name: "a" };
    const b = { name: "b", parent: a };
    a.parent = b;
    expect(owningPiece(new Map(), b as never)).toBeNull();
  });

  it("has an empty index before anything is built", () => {
    expect(bodyIndex(null).size).toBe(0);
  });
});
