import { describe, expect, it } from "bun:test";
import { slider3d, ui } from "tosijs-3d";
import type { BoxLike } from "./schema-panel.js";
import { boundIfSet, numberReadout, schemaWidgets } from "./schema-panel.js";

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
const box = (key: string) => ({
  path: key,
  value: undefined,
  observe: () => {},
});

describe("only a value the document HAS gets bound", () => {
  it("binds a key the document sets", () => {
    expect(boundIfSet({ latitude: 40 }, "latitude", box) as unknown).toEqual({
      path: "latitude",
      value: undefined,
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

/*
  WHAT WAS BOUND, NOT WHAT COULD HAVE BEEN — the 0.3.0 release blocker.

  The editor skips its own write for a bound field, because a bound widget has
  already written through its box. It decided that by re-deriving the rule from
  `boundIfSet`, which answers "is there a box for this key" — not "did the
  widget use one". Those agreed by inspection until a branch received a box it
  could not use: `ui.inputField` types `value` as `string`, so the string and
  colour branch never binds.

  Result: every already-set string or colour wrote NOTHING. The editor declined
  because a box existed; the widget never wrote through it; no error. Ten fields
  across the registered scene schemas, two of them set by shipped samples on
  open — which is the whole of "strings are editable now, including colours".

  So the fact is reported out of the call rather than recomputed, and these
  tests assert the REPORT, which is what the guard now reads.
*/
describe("schemaWidgets reports which keys it actually bound", () => {
  const boundFor = (
    properties: Record<string, unknown>,
    values: Record<string, unknown>
  ) => {
    const boundKeys = new Set<string>();
    schemaWidgets({
      schema: { properties },
      values,
      handleChange: () => {},
      box,
      boundKeys,
    } as never);
    return boundKeys;
  };

  it("does NOT claim a set string, because the field cannot bind one", () => {
    // The blocker in one assertion. `texture` is set, so `boundIfSet` answers
    // with a box — and the widget still writes through `handleChange`, so the
    // caller must not skip it.
    const bound = boundFor(
      { texture: { type: "string" } },
      { texture: "/grid-10.svg" }
    );
    expect(bound.has("texture")).toBe(false);
  });

  it("does NOT claim a set colour either", () => {
    // `light.diffuse` and `ground.texture` are both set by shipped samples.
    const bound = boundFor(
      { diffuse: { type: "string", format: "color" } },
      { diffuse: "#ffeedd" }
    );
    expect(bound.has("diffuse")).toBe(false);
  });

  it("DOES claim a set number, which binds for real", () => {
    // The companion that stops the assertions above passing vacuously: if
    // nothing were ever reported, the guard would never fire and every bound
    // widget would double-write — the bug this guard exists to prevent.
    const bound = boundFor(
      { latitude: { type: "number", minimum: -90, maximum: 90 } },
      { latitude: 40 }
    );
    expect(bound.has("latitude")).toBe(true);
  });

  it("DOES claim a set boolean", () => {
    expect(
      boundFor({ applyFog: { type: "boolean" } }, { applyFog: false })
    ).toContain("applyFog");
  });

  it("claims nothing for a key the document has not set", () => {
    // An unset field is unbound by design — it shows its default and writes
    // through `handleChange`, gaining the key. The guard must not fire there
    // either, and for a different reason.
    expect(
      boundFor({ latitude: { type: "number", minimum: -90 } }, {}).size
    ).toBe(0);
  });
});

/*
  A FREQUENCY READS AS A WAVELENGTH — tosijs-3d's `x-wavelength`, adopted.

  `grossScale` is a number called a scale that gets SMALLER as the hills get
  BIGGER, and its schema says so: `x-unit: '1/m'`, `x-wavelength: true`. Owner,
  filing it upstream: *"it's not at all obvious when a scale is actually a
  frequency and where the useful values are."*

  So the readout carries both — `0.015 1/m ≈66.7 m` — and the reciprocal UNIT
  is parsed out of `x-unit` rather than annotated separately, because a second
  annotation is a second thing that can disagree with the first.

  ⚠️ These test the STRING, which is the mechanism. The output is what an
  author sees while dragging, and `slider3d`'s default `showValue: 'peek'`
  means that is only on screen during a pointer gesture — asserted in
  `tests/schema-readout.pw.ts`, which hovers a real slider. Neither is
  sufficient alone: this one cannot see whether `format` is wired to anything,
  and that one cannot cover the arithmetic.
*/
describe("numberReadout", () => {
  it("puts the unit on the value", () => {
    expect(numberReadout({ "x-unit": "m" }, 8)).toBe("8 m");
  });

  it("says nothing extra when the schema says nothing", () => {
    expect(numberReadout({}, 8)).toBe("8");
  });

  it("shows the wavelength beside a frequency", () => {
    // 1 / 0.015 = 66.66…, and the reciprocal of `1/m` is `m`.
    expect(
      numberReadout({ "x-unit": "1/m", "x-wavelength": true }, 0.015)
    ).toBe("0.015 1/m ≈66.7 m");
  });

  it("does not divide by zero", () => {
    // `x-zero-stop` exists precisely so a decade-spanning field can reach
    // zero, so a zero WILL arrive here. `1/0` is `Infinity`, and a readout
    // saying "≈Infinity m" is worse than one that stops at the value.
    expect(numberReadout({ "x-unit": "1/m", "x-wavelength": true }, 0)).toBe(
      "0 1/m"
    );
  });

  it("keeps significant digits at the small end, not decimal places", () => {
    /*
      The whole point of a log track is to reach the bottom of its range.
      Four DECIMALS would round this to 0.0001 and anything smaller to zero —
      printing the end of the range as if it were not there.
    */
    expect(numberReadout({}, 0.0001234)).toBe("0.0001234");
    expect(numberReadout({}, 0.015)).toBe("0.015");
  });

  it("does not print float noise", () => {
    // Exponentiating on a log track leaves 0.015 looking like
    // 0.014999999999999999, which is harmless on screen only if nobody prints
    // it verbatim.
    expect(numberReadout({}, 0.014999999999999999)).toBe("0.015");
  });

  it("drops the reciprocal unit rather than guessing one", () => {
    // `x-wavelength` on a unit that is not written as a reciprocal: the
    // number is still the useful half, and inventing `1/deg` would be a unit
    // nobody wrote.
    expect(numberReadout({ "x-unit": "deg", "x-wavelength": true }, 0.5)).toBe(
      "0.5 deg ≈2"
    );
  });
});

/*
  THE TYPE CHECKER KNOWS WHICH WIDGETS CAN BIND — tosijs-3d#76, adopted.

  Until 0.8.4, `slider3d`/`toggle3d`/`select3d` typed `value` as a plain
  number/boolean/string, so every bound call site wore a cast — and the casts
  made all four branches look identical, which is how the string branch handed
  a box to `inputField` (which cannot bind one) and wrote nothing. That was
  0.3.0's release blocker.

  With `Bindable<T>` upstream and `BoxLike` here, the casts are gone and the
  distinction is back in the types. These lines are checked by `tsc`, not run:
  if `inputField` ever accepted a box, the `@ts-expect-error` would itself
  become an error, and if a slider stopped accepting one, the first line would.
  Falsified: without the directive, `tsc` reports the inputField line.
*/
describe("binding is a type-level fact again", () => {
  it("a slider takes a box; an inputField does not", () => {
    const fake: BoxLike = { value: 1, observe: () => undefined };
    const typeOnly = () => {
      slider3d({ value: fake });
      // @ts-expect-error — inputField's `value` is a string and cannot bind.
      ui.inputField({ value: fake });
    };
    expect(typeof typeOnly).toBe("function");
  });
});
