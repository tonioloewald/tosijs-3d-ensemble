import { describe, expect, it } from "bun:test";
import { ensembleEditor } from "./ensemble-editor.js";

/*
  DRILLING INTO A NESTED ENSEMBLE, WITHOUT A BROWSER (board #3429, from the
  0.8.0 review). `drillIn` / `popOut` and the context stack were tested only
  by tests/nested-editor.pw.ts. Nothing here needs a scene: an editor that
  is never connected builds nothing, and the document, history, selection
  and dirty state are plain state. The child is put where a load would put
  it, in `_nested` and `_nestedSaved` by its url.
*/

interface Doc {
  name: string;
  pieces: Array<{ id: string; at: number[]; ensemble?: string }>;
}
type Ed = HTMLElement & {
  ensemble: Doc;
  nestPath: string[];
  dirty: boolean;
  selection: { id: string } | null;
  drillIn(id: string): boolean;
  popOut(): boolean;
  edit(d: string, m: (e: Doc) => void): void;
  canUndo(): boolean;
  undo(): void;
  _loaded: { url: string; json: string } | null;
  _nested: Map<string, Doc>;
  _nestedSaved: Map<string, string>;
  _contexts: unknown[];
};

const CHILD_URL = "/ensembles/rig.json";

function editor(): Ed {
  const ed = ensembleEditor() as unknown as Ed;
  const outer: Doc = {
    name: "outer",
    pieces: [
      { id: "crate", at: [0, 0, 0] },
      { id: "rig", at: [5, 0, 0], ensemble: "./rig.json" },
    ],
  };
  ed.ensemble = outer;
  ed._loaded = { url: "/ensembles/outer.json", json: JSON.stringify(outer) };
  const child: Doc = { name: "rig", pieces: [{ id: "pump", at: [1, 0, 0] }] };
  ed._nested.set(CHILD_URL, child);
  ed._nestedSaved.set(CHILD_URL, JSON.stringify(child));
  return ed;
}
const movePump = (ed: Ed, x: number) =>
  ed.edit("move pump", (e) => {
    e.pieces[0]!.at = [x, 0, 0];
  });

describe("drilling into a nested ensemble (#3429)", () => {
  it("makes a COPY of the child the document, clean, with its own history", () => {
    const ed = editor();
    ed.edit("move crate", (e) => {
      e.pieces[0]!.at = [9, 0, 0];
    });
    expect(ed.drillIn("rig")).toBe(true);
    expect(ed.nestPath).toEqual(["outer", "rig"]);
    expect(ed.ensemble.name).toBe("rig");
    expect(ed.ensemble).not.toBe(ed._nested.get(CHILD_URL));
    expect(ed.selection?.id).toBe("pump");
    expect(ed.dirty).toBe(false);
    // The outer document's undo step is not reachable from inside.
    expect(ed.canUndo()).toBe(false);
    movePump(ed, 2);
    expect(ed.dirty).toBe(true);
    // Editing the copy leaves the cached child alone until popOut.
    expect(ed._nested.get(CHILD_URL)!.pieces[0]!.at).toEqual([1, 0, 0]);
  });

  it("pops out to the parent as it was, carrying the child's edits", () => {
    const ed = editor();
    ed.edit("move crate", (e) => {
      e.pieces[0]!.at = [9, 0, 0];
    });
    const parentDirty = ed.dirty;
    ed.drillIn("rig");
    movePump(ed, 2);
    expect(ed.popOut()).toBe(true);
    expect(ed.nestPath).toEqual(["outer"]);
    expect(ed.ensemble.name).toBe("outer");
    expect(ed.ensemble.pieces[0]!.at).toEqual([9, 0, 0]);
    expect(ed.selection?.id).toBe("rig");
    expect(ed.dirty).toBe(parentDirty);
    // The parent's history came back with it: undo reverts the parent's
    // own step, not the child's.
    ed.undo();
    expect(ed.ensemble.pieces[0]!.at).toEqual([0, 0, 0]);
    // What the parent now builds is the child as it was left.
    expect(ed._nested.get(CHILD_URL)!.pieces[0]!.at).toEqual([2, 0, 0]);
    // Nothing left to pop.
    expect(ed.popOut()).toBe(false);
  });

  it("an unsaved child edit still reads unsaved when you go back in (M2)", () => {
    const ed = editor();
    ed.drillIn("rig");
    movePump(ed, 2);
    ed.popOut();
    ed.drillIn("rig");
    expect(ed.ensemble.pieces[0]!.at).toEqual([2, 0, 0]);
    expect(ed.dirty).toBe(true);
  });

  it("refuses a piece that is not nested, or whose child has not loaded", () => {
    const ed = editor();
    expect(ed.drillIn("crate")).toBe(false);
    expect(ed.drillIn("nope")).toBe(false);
    ed._nested.clear();
    expect(ed.drillIn("rig")).toBe(false);
    expect(ed._contexts).toHaveLength(0);
    expect(ed.nestPath).toEqual(["outer"]);
  });

  it("a new document is not inside anything (M3)", () => {
    const ed = editor();
    ed.drillIn("rig");
    ed.ensemble = { name: "other", pieces: [] };
    expect(ed.nestPath).toEqual(["other"]);
    expect(ed.popOut()).toBe(false);
  });
});
