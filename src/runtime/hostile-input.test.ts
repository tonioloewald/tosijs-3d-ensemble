import { afterEach, describe, expect, it } from "bun:test";
import { buildEnsemble } from "./build.js";
import {
  declaredConfig,
  registerFeature,
  unregisterFeature,
} from "../format/registry.js";
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
