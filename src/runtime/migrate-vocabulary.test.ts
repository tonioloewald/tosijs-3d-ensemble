import { describe, expect, it } from "bun:test";
import { sceneSchemas } from "tosijs-3d";
import { migrateVocabulary } from "../format/migrate.js";

/*
  THE ONE HAND-COPIED VOCABULARY LEFT, AND WHY IT IS TESTED FROM HERE.

  0.3.0's rule is "a scene primitive's schema is NOT ours to write" —
  `features-scene.ts` takes every range, unit, enum and scale from tosijs-3d's
  `sceneSchemas`, because hand-copying drifted in every direction at once and
  every drift was silent.

  `migrate.ts` still holds three of those vocabularies by hand, and it has to:
  `src/format/` is the engine-free kernel, pinned by `tree-shaking.test.ts`, so
  it may not import `sceneSchemas`. The constants are exported instead and
  checked from the RUNTIME lane, where importing tosijs-3d is allowed.

  The failure this prevents is the nastiest kind — a migration that DESTROYS a
  setting and then records a note claiming the scene was already doing the
  thing it just wrote. Upstream adds a preset; the editor's picker offers it,
  because the panel comes from `sceneSchemas`; the author sets it; `migrate`
  does not recognise it and rewrites it back to `motes`.
*/
const enumOf = (name: string, property: string): string[] | undefined => {
  const entry = (sceneSchemas as Record<string, unknown>)[name];
  const schema = (
    typeof entry === "function" ? (entry as () => unknown)() : entry
  ) as { properties?: Record<string, { enum?: string[] }> } | undefined;
  return schema?.properties?.[property]?.enum;
};

describe("migrate's vocabulary still equals upstream's", () => {
  it("ambient presets", () => {
    expect(migrateVocabulary.AMBIENT_PRESETS).toEqual(
      enumOf("ambient", "preset")!
    );
  });

  it("ambient placement", () => {
    expect(migrateVocabulary.AMBIENT_WHERE).toEqual(
      enumOf("ambient", "where")!
    );
  });

  it("fog modes", () => {
    expect(migrateVocabulary.FOG_MODES).toEqual(enumOf("fog", "mode")!);
  });

  it("upstream actually answered (the check can fail)", () => {
    // Without this, a `sceneSchemas` that lost these properties would make
    // every assertion above compare undefined to undefined and pass.
    expect(enumOf("ambient", "preset")?.length).toBeGreaterThan(0);
    expect(enumOf("fog", "mode")?.length).toBeGreaterThan(0);
  });
});
