import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { validate } from "./format/validate.js";
import { migrate } from "./format/migrate.js";
import { buildEnsemble } from "./runtime/build.js";
import { registerCombatPreset } from "./presets/combat.js";
import type { SceneElement } from "./format/registry.js";
import type { Ensemble } from "./format/types.js";

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

/*
  PUT IT BACK. Registries are global and the suite shares a process, so a file
  that loads a preset and walks away changes the answers in every other file —
  `roles.test.ts` and `validate.test.ts` both assert that the format ships NO
  domain, and one `registerCombatPreset()` anywhere makes that false. It failed
  three tests in two files that this one never mentions, which is the least
  debuggable shape a test failure has.
*/
let dropPreset: () => void = () => {};
beforeAll(() => {
  dropPreset = registerCombatPreset();
});
afterAll(() => dropPreset());

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

  it("MIGRATED, all four validate clean — this is the milestone-1 gate", () => {
    /*
      The one that actually matters. Two of the four load as they stand; this
      asserts the other two need nothing beyond `migrate()`, which is what
      makes the Manta migration a command rather than a hand-edit of 13 pieces.
    */
    const remaining: string[] = [];
    for (const file of files) {
      const { ensemble } = migrate(load(file));
      for (const problem of validate(ensemble)) {
        if (problem.severity === "error") {
          remaining.push(`${file}: ${problem.code} ${problem.path}`);
        }
      }
    }
    expect(remaining).toEqual([]);
  });

  it("MIGRATED, all four still build every piece", () => {
    for (const file of files) {
      const { ensemble } = migrate(load(file));
      const built = buildEnsemble(ensemble, { scene: fakeScene() });
      expect([...built.pieces.keys()].sort()).toEqual(
        ensemble.pieces.map((p) => p.id).sort()
      );
      built.dispose();
    }
  });

  it("shows what the migration actually did", () => {
    for (const file of files) {
      const { changes } = migrate(load(file));
      console.log(
        `  ${file}: ${changes.length} change(s)` +
          (changes.length ? ` — ${changes[0]!.note}, …` : "")
      );
    }
    expect(true).toBe(true);
  });

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
