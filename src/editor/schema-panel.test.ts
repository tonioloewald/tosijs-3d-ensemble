import { describe, expect, it } from "bun:test";
import { boundIfSet } from "./schema-panel.js";

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
