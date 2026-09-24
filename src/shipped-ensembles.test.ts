import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { registerSceneFeatures, validate } from "./index.js";
import { registerCombatPreset } from "./presets/combat.js";

/*
  EVERY SAMPLE WE SHIP VALIDATES WITHOUT AN ERROR.

  They are what the doc site opens, what the editor's "open" offers, and what
  an adopter copies — so a sample that names a feature or a property the
  registry does not know is teaching the wrong file format. Nothing checked
  this until `land-and-sky.json`, the first sample written against features
  (the cloud deck, the encoded galaxy) that did not exist a week earlier.

  ⚠️ WARNINGS COUNT TOO, except one. `unknown-feature` and
  `unknown-feature-key` are warnings for an adopter's sake — a document may be
  newer than the registry reading it — but these files are OURS, validated by
  our own registry, so either warning here is a typo that renders as nothing:
  a `cloudDek` piece is an empty space, and a `starfeildData` is a daytime-
  only sky. `meshes-unchecked` is the exception because no library is mounted
  under `bun test`, so no mesh name can be confirmed or denied.
*/
registerSceneFeatures();
registerCombatPreset();

const DIR = new URL("../static/ensembles/", import.meta.url);
const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));

describe("shipped ensembles", () => {
  it("there are some", () => {
    // Guards the guard: an empty directory passes the loop below.
    expect(files).toContain("land-and-sky.json");
  });

  for (const file of files) {
    it(`${file} validates clean`, () => {
      const doc = JSON.parse(readFileSync(new URL(file, DIR), "utf8"));
      const problems = validate(doc)
        .filter((p) => p.code !== "meshes-unchecked")
        .map((p) => `${p.code} ${p.path}`);
      expect(problems).toEqual([]);
    });
  }
});
