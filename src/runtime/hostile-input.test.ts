import { afterEach, describe, expect, it } from "bun:test";
import { buildEnsemble } from "./build.js";
import {
  declaredConfig,
  featureRegistration,
  registerFeature,
  unregisterFeature,
} from "../format/registry.js";
import { validate } from "../format/validate.js";
import { registerSceneFeatures } from "./features-scene.js";
import type { Ensemble } from "../format/types.js";
import type { SceneElement } from "../format/registry.js";

/*
  AN ENSEMBLE IS A DOCUMENT PEOPLE SHARE, SO IT IS UNTRUSTED INPUT.

  The 0.3.0 review's M1: ten of thirteen scene features hand their config to an
  element as `{...cfg}` or through `updateAttrs`, and a tosijs element creator
  applies unknown keys as PROPERTIES — so a key no schema declared reached the
  DOM verbatim and `innerHTML` executed, confirmed in real Chromium. Nothing
  gated it: `parseEnsemble` is `JSON.parse` plus `Array.isArray`, and `validate`
  checks only that the feature NAME is registered.

  These tests are the allow-list's ANTI-VACUITY COMPANION. `declaredConfig` is
  one small function in a 700-line file that gets reworked; without a test that
  feeds it something hostile, the next rewrite quietly restores the raw spread
  and every suite stays green.
*/

const fakeScene = () =>
  ({ appendChild: () => {}, remove: () => {} } as unknown as SceneElement);

describe("declaredConfig is an allow-list, not a denylist", () => {
  const reg = {
    schema: {
      type: "object" as const,
      properties: { intensity: { type: "number" } },
    },
  };

  it("drops a key the schema does not declare", () => {
    const out = declaredConfig(reg, {
      intensity: 0.9,
      innerHTML: "<img src=x onerror=BOOM>",
    });
    expect(out).toEqual({ intensity: 0.9 });
    expect("innerHTML" in out).toBe(false);
  });

  it("drops the whole family, because the family is not enumerable", () => {
    // The argument for an allow-list in one assertion: nobody can list every
    // dangerous property name, and a future element adds more.
    const out = declaredConfig(reg, {
      intensity: 1,
      outerHTML: "<b>",
      srcdoc: "<script>",
      onclick: "BOOM",
      onpointerdown: "BOOM",
    });
    expect(Object.keys(out)).toEqual(["intensity"]);
  });

  it("does not let a payload reach Object.prototype", () => {
    const out = declaredConfig(reg, JSON.parse('{"__proto__":{"pwned":1}}'));
    expect(out).toEqual({});
    expect(({} as Record<string, unknown>).pwned).toBeUndefined();
  });

  it("PASSES a declared key through untouched", () => {
    /*
      The companion that stops all of the above passing vacuously: a filter
      that returned `{}` for everything would satisfy every assertion here and
      break every feature in the package.
    */
    expect(declaredConfig(reg, { intensity: 0.25 })).toEqual({
      intensity: 0.25,
    });
  });

  it("passes everything through when a feature declares no properties", () => {
    // There is nothing to check against, and an empty allow-list would
    // silently disable such a feature — a worse failure than the one being
    // prevented, and a silent one.
    expect(declaredConfig(undefined, { anything: 1 })).toEqual({ anything: 1 });
  });
});

describe("a hostile ensemble reaches a feature already narrowed", () => {
  afterEach(() => unregisterFeature("probe"));

  it("binds with declared keys only", () => {
    const seen: Array<Record<string, unknown>> = [];
    registerFeature({
      name: "probe",
      schema: { type: "object", properties: { intensity: { type: "number" } } },
      bind: (_piece, cfg) => {
        seen.push({ ...cfg });
        return {};
      },
    });

    const hostile: Ensemble = {
      name: "shared-by-a-stranger",
      pieces: [
        {
          id: "p",
          at: [0, 0, 0],
          features: {
            probe: { intensity: 0.9, innerHTML: "<img src=x onerror=BOOM>" },
          },
        },
      ],
    };

    buildEnsemble(hostile, { scene: fakeScene() });
    // Measured at the FEATURE, not at the element: this is the last point the
    // package controls before a config becomes somebody's DOM.
    expect(seen).toEqual([{ intensity: 0.9 }]);
  });
});

describe("the allow-list keeps what a DOCUMENT may legitimately carry", () => {
  /*
    The regression the first remediation introduced, and the distinction that
    caused it. A scene feature's `properties` is EDITORIAL — which fields an
    author sees in a panel, 17 of terrain's 30 — so using it as the allow-list
    deleted real content: `majorRadius` and `minorRadius` are the two
    dimensions a torus is made of, and the panel offers `surfaceType: 'torus'`
    while the format refused to carry its size.

    A safety filter that silently deletes what it was protecting is worse than
    the injection it was added to stop, so the list now comes from the
    element's FULL upstream property set via `x-accepts`.
  */
  it("keeps an element attribute the PANEL does not offer", () => {
    registerSceneFeatures();
    {
      const terrain = featureRegistration("terrain");
      const out = declaredConfig(terrain, {
        surfaceType: "torus",
        majorRadius: 500,
        minorRadius: 80,
        radius: 1000,
        innerHTML: "<img src=x onerror=BOOM>",
      });
      expect(out.majorRadius).toBe(500);
      expect(out.minorRadius).toBe(80);
      // …and still drops the one that started all this.
      expect("innerHTML" in out).toBe(false);
    }
  });

  it("says so, rather than dropping in silence", () => {
    // A document whose key vanished on the way to the scene looks exactly like
    // a feature that does not work, which is the failure this repo keeps
    // fixing. `validate` reports the drop as a warning.
    registerSceneFeatures();
    {
      const problems = validate({
        name: "n",
        pieces: [
          {
            id: "p",
            at: [0, 0, 0],
            features: { terrain: { radius: 10, innerHTML: "<b>" } },
          },
        ],
      });
      const dropped = problems.find((p) => p.code === "unknown-feature-key");
      expect(dropped?.severity).toBe("warning");
      expect(dropped?.message).toContain("innerHTML");
      expect(dropped?.path).toBe("/pieces/0/features/terrain/innerHTML");
    }
  });
});
