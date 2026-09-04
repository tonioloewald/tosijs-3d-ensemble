import { describe, expect, it } from "bun:test";
import { createHistory } from "./history.js";

const clone = <T>(v: T): T => structuredClone(v);

describe("history", () => {
  it("steps back to the state before an edit", () => {
    const h = createHistory<{ n: number }>(clone);
    let doc = { n: 1 };
    h.record("set 2", doc);
    doc = { n: 2 };
    expect(h.undo(doc)!.state).toEqual({ n: 1 });
  });

  it("steps forward again", () => {
    const h = createHistory<{ n: number }>(clone);
    let doc = { n: 1 };
    h.record("set 2", doc);
    doc = { n: 2 };
    doc = h.undo(doc)!.state;
    expect(doc).toEqual({ n: 1 });
    expect(h.redo(doc)!.state).toEqual({ n: 2 });
  });

  it("walks back through several edits in order", () => {
    const h = createHistory<{ n: number }>(clone);
    let doc = { n: 0 };
    for (const n of [1, 2, 3]) {
      h.record(`set ${n}`, doc);
      doc = { n };
    }
    doc = h.undo(doc)!.state;
    expect(doc).toEqual({ n: 2 });
    doc = h.undo(doc)!.state;
    expect(doc).toEqual({ n: 1 });
    doc = h.undo(doc)!.state;
    expect(doc).toEqual({ n: 0 });
    expect(h.undo(doc)).toBeNull();
  });

  it("SNAPSHOTS, so a later mutation of the live object cannot reach back", () => {
    // The editor mutates its ensemble in place; a history that stored the
    // reference would "undo" to whatever the object became.
    const h = createHistory<{ n: number }>(clone);
    const doc = { n: 1 };
    h.record("bump", doc);
    doc.n = 99;
    expect(h.undo(doc)!.state).toEqual({ n: 1 });
  });

  it("forks the timeline on a new edit, dropping what was undone", () => {
    /*
      Keeping the redos and letting a later one overwrite work done since is a
      data-loss bug wearing a feature's clothes.
    */
    const h = createHistory<{ n: number }>(clone);
    let doc = { n: 1 };
    h.record("set 2", doc);
    doc = { n: 2 };
    doc = h.undo(doc)!.state;
    expect(h.canRedo()).toBe(true);
    h.record("set 7", doc);
    expect(h.canRedo()).toBe(false);
  });

  it("reports nothing to do on an untouched document", () => {
    const h = createHistory<{ n: number }>(clone);
    expect(h.canUndo()).toBe(false);
    expect(h.canRedo()).toBe(false);
    expect(h.undo({ n: 1 })).toBeNull();
    expect(h.redo({ n: 1 })).toBeNull();
  });

  it("bounds the past so a long session cannot grow without end", () => {
    const h = createHistory<{ n: number }>(clone, 3);
    for (let n = 0; n < 10; n++) h.record(`e${n}`, { n });
    expect(h.depth().past).toBe(3);
    // The OLDEST are dropped, so the most recent edits stay undoable.
    expect(h.undo({ n: 99 })!.state).toEqual({ n: 9 });
  });
});

/*
  A CONTINUOUS CONTROL IS ONE UNDO STEP.

  `slider3d` exposes `onChange` alone — no gesture end — so dragging one reports
  per pointer-move. Without coalescing, undo walks back through a drag a pixel
  at a time and never reaches the value you started from.
*/
describe("coalescing", () => {
  it("folds a run of same-named edits into one step", () => {
    const history = createHistory<{ n: number }>((v) => ({ ...v }));
    history.record("edit skybox.timeOfDay sky", { n: 0 }, true);
    history.record("edit skybox.timeOfDay sky", { n: 1 }, true);
    history.record("edit skybox.timeOfDay sky", { n: 2 }, true);
    expect(history.depth().past).toBe(1);
  });

  it("keeps the state from BEFORE the run, which is what undo restores", () => {
    const history = createHistory<{ n: number }>((v) => ({ ...v }));
    history.record("drag", { n: 0 }, true);
    history.record("drag", { n: 1 }, true);
    expect(history.undo({ n: 2 })?.state).toEqual({ n: 0 });
  });

  it("does not fold a DIFFERENT field", () => {
    const history = createHistory<{ n: number }>((v) => ({ ...v }));
    history.record("edit skybox.timeOfDay sky", { n: 0 }, true);
    history.record("edit skybox.turbidity sky", { n: 1 }, true);
    expect(history.depth().past).toBe(2);
  });

  it("does not fold when the caller does not ask", () => {
    const history = createHistory<{ n: number }>((v) => ({ ...v }));
    history.record("same", { n: 0 });
    history.record("same", { n: 1 });
    expect(history.depth().past).toBe(2);
  });
});

describe("a slider drag is one undo step", () => {
  /*
    The rule the owner asked for: "don't advance the undo buffer for
    progressive changes to the same property". `coalesce` already does it —
    same `describe`, folded, keeping the OLDEST state so undo lands where the
    drag STARTED rather than one pointer-move back.

    Pinned because the property is invisible in normal use: a drag that records
    every move still looks correct until you press undo six times to get back
    where you were.
  */
  it("folds a run of same-named changes into one", () => {
    const history = createHistory<{ v: number }>(clone);
    history.record("edit skybox.timeOfDay sky", { v: 0 }, true);
    for (const v of [3, 7, 11, 16, 20]) {
      history.record("edit skybox.timeOfDay sky", { v }, true);
    }
    expect(history.depth().past).toBe(1);
  });

  it("undoes to where the drag started, not to its last frame", () => {
    const history = createHistory<{ v: number }>(clone);
    history.record("edit skybox.timeOfDay sky", { v: 0 }, true);
    history.record("edit skybox.timeOfDay sky", { v: 20 }, true);
    expect(history.undo({ v: 24 })?.state).toEqual({ v: 0 });
  });

  it("does not fold two different properties", () => {
    const history = createHistory<{ v: number }>(clone);
    history.record("edit skybox.timeOfDay sky", { v: 0 }, true);
    history.record("edit skybox.turbidity sky", { v: 0 }, true);
    expect(history.depth().past).toBe(2);
  });

  it("does not fold two separate drags of the same property", () => {
    /*
      Two drags of one slider are two edits, and folding them would make the
      first unreachable. They are separated by whatever happened between —
      here, a selection change writing its own step.
    */
    const history = createHistory<{ v: number }>(clone);
    history.record("edit skybox.timeOfDay sky", { v: 0 }, true);
    history.record("move sun", { v: 0 });
    history.record("edit skybox.timeOfDay sky", { v: 20 }, true);
    expect(history.depth().past).toBe(3);
  });
});
