import { describe, expect, it } from "bun:test";
import { boundIfSet, schemaWidgets } from "./schema-panel.js";

/*
  A PANEL THAT LIES IS WORSE THAN ONE THAT DOES NOTHING.

  `box(key)` answers for any key with a stable address, whether or not the
  document has ever set it — and a box over an absent path has no value, so a
  widget bound to it renders at the BOTTOM of its range. The sky panel read
  `latitude -90` and `luminance 0` while the skybox element sat at 40 and 1.

  The schema's default was already computed one line above. It never got used,
  because a box is an object and `??` only falls through on null/undefined.

  It survived as long as it did because we exposed six mostly-authored
  properties per feature. Adopting tosijs-3d's `sceneSchemas` took the sky to
  eleven, of which an untouched file sets two, and nine wrong numbers appeared
  at once — which is the only reason anybody looked.
*/
const box = (key: string) => ({ path: key, observe: () => {} });

describe("only a value the document HAS gets bound", () => {
  it("binds a key the document sets", () => {
    expect(boundIfSet({ latitude: 40 }, "latitude", box)).toEqual({
      path: "latitude",
      observe: expect.any(Function),
    });
  });

  it("does NOT bind a key the document omits", () => {
    // So the caller's `?? spec.default` is reached, and the panel shows what
    // the element is actually doing.
    expect(boundIfSet({}, "latitude", box)).toBeUndefined();
  });

  it("binds a FALSY value, which is a value like any other", () => {
    // `0` and `false` are the two readings most worth trusting — a still sky
    // is `realtimeScale: 0`, and `applyFog: false` is the element's own state.
    expect(boundIfSet({ realtimeScale: 0 }, "realtimeScale", box)).toBeTruthy();
    expect(boundIfSet({ applyFog: false }, "applyFog", box)).toBeTruthy();
  });

  it("binds nothing at all when there is no box (a tool option)", () => {
    // Tool options are not part of the document, so they have no path to bind
    // to and have always taken the plain-value path.
    expect(boundIfSet({ snap: 1 }, "snap", undefined)).toBeUndefined();
  });
});

/*
  WHAT A SCHEMA GETS YOU, PINNED BY THE WIDGET IT PRODUCES.

  Two of these branches have never run in this repo. `x-widget: 'curve'` and
  `'light-program'` were written when we filed tosijs-3d#61, and nothing here
  declares either: the lamp hands its whole `settings` field to `lightEditor3d`
  via `x-widget: 'light'`, so the nested curves never reach this dispatch.

  They are not dead code to delete — they are the receiving end of a contract,
  and the first schema that uses one will come from OUTSIDE (a consumer's
  feature, or tosijs-3d's `provinceClimateSchema()`, whose three channels are
  `x-widget: 'curve'` today). That is precisely the arrangement where a broken
  branch is discovered by somebody else, months later, as "the panel shows a
  label where a curve should be".

  So the dispatch is exercised here rather than trusted. Identified by the
  widget's own surface — a curve has `points`/`evaluate`, an input field has
  `commit`/`isValid` — because that is what a caller would actually reach for.
*/
const widgetsFor = (
  properties: Record<string, unknown>,
  values: Record<string, unknown> = {}
) =>
  schemaWidgets({
    schema: { properties },
    values,
    handleChange: () => {},
  } as never).map((w) => Object.keys(w as object));

describe("a schema dispatches to the right widget", () => {
  it("x-widget: 'curve' builds a curve, not a label", () => {
    const [curve] = widgetsFor(
      { shape: { type: "array", "x-widget": "curve" } },
      {
        shape: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ],
      }
    );
    expect(curve).toContain("points");
    expect(curve).toContain("evaluate");
  });

  it("x-widget: 'light-program' builds the program editor", () => {
    const [program] = widgetsFor(
      { p: { type: "object", "x-widget": "light-program" } },
      { p: {} }
    );
    expect(program).toContain("setValue");
    expect(program).toContain("hitTest");
  });

  it("a string is an EDITABLE field, not a read-only label", () => {
    /*
      It was a muted label until we adopted tosijs-3d's scene schemas and
      counted what that made read-only: `ground.texture`, `water.normalMap`,
      `clouds.model` and seven colour fields, four of them on the sky.
    */
    const [caption, field] = widgetsFor(
      { texture: { type: "string" } },
      { texture: "checker" }
    );
    expect(caption).toEqual(["el", "layout"]); // the muted caption above it
    expect(field).toContain("commit");
    expect(field).toContain("isValid");
  });

  it("a colour is the same field, until there is a picker to give it", () => {
    // tosijs-3d has no colour control at all — filed as tosijs-3d#72. The
    // annotation is preserved so a picker drops in without touching a schema.
    const [, field] = widgetsFor(
      { sunColor: { type: "string", format: "color" } },
      { sunColor: "#eeeeff" }
    );
    expect(field).toContain("commit");
  });

  it("an UNRECOGNISED spec still renders something you can edit", () => {
    // Hiding a field an author wrote is the one outcome worse than showing it
    // with the wrong control: the document says something the panel denies.
    const built = widgetsFor({ mystery: { type: "null" } }, { mystery: "x" });
    expect(built.length).toBe(2);
  });
});
