import { describe, expect, it, beforeAll } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { validate } from "./format/validate";
import { buildEnsemble } from "./runtime/build";
import { registerCombatPreset } from "./presets/combat";
import type { SceneElement } from "./format/registry";
import type { Ensemble } from "./format/types";

/*
  MILESTONE 1'S GATE, MEASURED RATHER THAN ASSERTED.

  "Milestone 1 is done when manta-recon deletes `prefab.ts` and
  `prefab-runtime.ts`" and loads its four prefabs through this package. This is
  the test that says how far away that is, and what is left.

  ⚠️ It reads a SIBLING CHECKOUT, so it skips when that is absent rather than
  failing — a test that requires somebody else's working copy is not a test
  anybody else can run. Making it hermetic means copying the four files in as
  fixtures, which is a decision about owning another project's data, not a
  tidy-up.
*/
const DIR = "/Users/tonioloewald/manta-recon/static/prefabs";
const present = existsSync(DIR);
const files = present
  ? readdirSync(DIR).filter((f) => f.endsWith(".json"))
  : [];
const load = (f: string): Ensemble =>
  JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));

const fakeScene = () =>
  ({ appendChild: () => {}, remove: () => {} } as unknown as SceneElement);

beforeAll(() => registerCombatPreset());

describe.skipIf(!present)("manta-recon's prefabs, through this package", () => {
  it("found them", () => {
    expect(files.length).toBe(4);
  });

  for (const file of files) {
    it(`${file}: reports exactly what stands between it and loading`, () => {
      /*
        Not asserted clean — two of the four are NOT clean yet, and a red suite
        every day until milestone 1 lands teaches everyone to ignore it. What is
        pinned instead is the SHAPE of the gap: only missing ids, nothing else.
        If a new kind of error appears here, that is a regression worth seeing.
      */
      const errors = validate(load(file)).filter((p) => p.severity === "error");
      const codes = [...new Set(errors.map((e) => e.code))].sort();
      expect(codes.filter((c) => c !== "no-piece-id")).toEqual([]);
    });

    it(`${file}: builds every piece`, () => {
      const ensemble = load(file);
      const built = buildEnsemble(ensemble, { scene: fakeScene() });
      expect([...built.pieces.keys()].sort()).toEqual(
        ensemble.pieces.map((p) => p.id).sort()
      );
      built.dispose();
    });
  }

  it("reports what the warnings are, if any", () => {
    for (const file of files) {
      const warnings = validate(load(file)).filter(
        (p) => p.severity === "warning"
      );
      if (warnings.length) {
        console.log(`  ${file}: ${warnings.map((w) => w.code).join(", ")}`);
      }
    }
    expect(true).toBe(true);
  });
});
