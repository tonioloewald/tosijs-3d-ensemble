import { describe, expect, it } from "bun:test";
import { sceneSchemas } from "tosijs-3d";
import { registerSceneFeatures, schemaDrift } from "./features-scene.js";
import { featureRegistration } from "../format/registry.js";

/*
  THE SCENE SCHEMAS ARE UPSTREAM'S NOW, AND THIS IS WHAT KEEPS THEM THAT WAY.

  Every range, unit, enum and log scale for a scene primitive used to be
  hand-copied out of tosijs-3d's elements into `features-scene.ts`. It drifted
  in every direction at once and every kind of drift was SILENT — the panel
  showed a control, the author moved it, and the scene did what it was already
  doing:

    underwaterFog  declared boolean; the attribute is a NUMBER 0..1
    ambient.preset defaulted to "birds"; unknown preset → falls back to motes
    ambient.where  defaulted to "air"; not in 'always'|'underwater'|'above'
    fog.mode       offered "none"; unknown mode → falls back to LINEAR
    applyFog       defaulted true; the element defaults false
    skybox         exposed 6 of 16 properties, and nobody decided the other 10

  ⚠️ **This file checks the FLOOR, and that is only half the range.** It
  compares against the INSTALLED tosijs-3d, which `peer-range.test.ts` pins to
  the floor of what we advertise — so a consumer on any version above it gets
  exactly the silent drift described above, and nothing here would know. CI's
  `drift` job installs the newest tosijs-3d and runs this file against that,
  which is the other half; it is a separate job because the rest of the suite
  fails on purpose once the pin is broken.

  `pick()` takes the SHAPE from `sceneSchemas` (tosijs-3d#63, our ask), so none
  of that can be restated wrongly — it is not restated at all. What is left to
  get wrong is the part that stays ours: WHICH keys we name, and the handful of
  defaults we deliberately override. Both are just strings until something
  checks them against the source.

  So: a key we name that upstream drops would silently vanish from the panel,
  and an override on a key that upstream retyped would silently contradict it.
  Neither throws at runtime — `pick` warns and omits, because this registers at
  page load and a throw there is a black screen. This file is what makes it
  loud, at the only moment it can still be cheap.
*/
registerSceneFeatures();

/** The features whose schema comes from `sceneSchemas`. */
const ADOPTED = [
  ["light", "light"],
  ["sun", "sun"],
  ["skybox", "skybox"],
  ["ground", "ground"],
  ["terrain", "terrain"],
  ["water", "water"],
  ["clouds", "clouds"],
  ["ambient", "ambient"],
  ["fog", "fog"],
  ["reflections", "reflections"],
] as const;

const propertiesOf = (
  feature: string
): Record<string, Record<string, unknown>> => {
  const schema = featureRegistration(feature)?.schema as
    | { properties?: Record<string, Record<string, unknown>> }
    | undefined;
  return schema?.properties ?? {};
};

const upstreamOf = (name: keyof typeof sceneSchemas) =>
  (
    sceneSchemas[name]() as {
      properties: Record<string, Record<string, unknown>>;
    }
  ).properties;

describe("scene schemas come from tosijs-3d, not from us", () => {
  it("names no property upstream has dropped", () => {
    // `pick` records what it could not find. Empty is the whole assertion —
    // and it is reported as the list, because "expected 0" tells you nothing
    // about WHICH field quietly left the panel.
    expect(schemaDrift).toEqual([]);
  });

  it("every adopted feature actually has properties", () => {
    // Guards the guard: an empty property map passes every check below.
    for (const [feature] of ADOPTED) {
      expect([feature, Object.keys(propertiesOf(feature)).length > 2]).toEqual([
        feature,
        true,
      ]);
    }
  });

  it("restates no range, unit, enum or scale of its own", () => {
    /*
      The failure this catches is a well-meaning "just tighten this one
      maximum" — which is how the last three versions of the terrain schema
      started. A default may differ (that is an authoring choice, checked
      below); the SHAPE may not.
    */
    const restated: string[] = [];
    for (const [feature, upstreamName] of ADOPTED) {
      const ours = propertiesOf(feature);
      const theirs = upstreamOf(upstreamName);
      for (const [key, spec] of Object.entries(ours)) {
        const source = theirs[key];
        if (!source) continue; // covered by the drift assertion above
        const facets = [
          "minimum",
          "maximum",
          "x-unit",
          "enum",
          "x-scale",
          "x-zero-stop",
        ] as const;
        for (const facet of facets) {
          const mine = JSON.stringify(spec[facet]);
          const upstreamFacet = JSON.stringify(source[facet]);
          if (mine !== upstreamFacet) {
            restated.push(
              `${feature}.${key}.${facet}: ${mine} (ours) vs ${upstreamFacet} (upstream)`
            );
          }
        }
      }
    }
    /*
      Four deliberate exceptions, each carrying its reason in the source:

      - `terrain.seed` is an INTEGER with a small ceiling — it is typed or
        stepped, never dragged, because no seed is near another.
      - `terrain.tileSize` has a floor upstream does not: finest-level tiles go
        as `(2·reach / tileSize)²`, so it is the PRODUCT of two sliders that
        kills the tab, and a schema cannot say "…unless reach is large".
      - `terrain.biome` stays a BOOLEAN because a JSON document has real
        booleans; `'on'|'off'` is an HTML-attribute concern and the bind maps it.
      (`terrain.radius` used to be a fourth: we gave it a log scale over its
      six decades, and tosijs-3d@0.8.1 added the same upstream — so the
      override went, and this test is what noticed by failing on the upgrade.)
    */
    expect(restated.sort()).toEqual(
      [
        'terrain.biome.enum: undefined (ours) vs ["off","on"] (upstream)',
        "terrain.seed.maximum: 9999 (ours) vs undefined (upstream)",
        "terrain.tileSize.minimum: 32 (ours) vs 1 (upstream)",
      ].sort()
    );
  });

  it("overrides only keys that still exist upstream", () => {
    // An override on a vanished key is not a crash — it is a property that
    // reappears with upstream's default and looks like it was never set.
    const orphaned: string[] = [];
    for (const [feature, upstreamName] of ADOPTED) {
      const theirs = upstreamOf(upstreamName);
      for (const key of Object.keys(propertiesOf(feature))) {
        if (!(key in theirs)) orphaned.push(`${feature}.${key}`);
      }
    }
    expect(orphaned).toEqual([]);
  });
});

describe("the drift that started this, pinned as regressions", () => {
  it("water.underwaterFog is a NUMBER, not a toggle", () => {
    const spec = propertiesOf("water").underwaterFog;
    expect(spec?.type).toBe("number");
    expect([spec?.minimum, spec?.maximum]).toEqual([0, 1]);
  });

  it("ambient.preset and .where are pickers over the REAL sets", () => {
    const preset = propertiesOf("ambient").preset;
    const where = propertiesOf("ambient").where;
    // The old defaults were "birds" and "air". Neither is a value.
    expect(preset?.enum).toContain("motes");
    expect(preset?.enum).not.toContain("birds");
    expect(where?.enum).toEqual(["always", "underwater", "above"]);
    expect(where?.default).not.toBe("air");
  });

  it("fog.mode no longer offers a 'none' that means linear", () => {
    const mode = propertiesOf("fog").mode;
    expect(mode?.enum).not.toContain("none");
    expect(mode?.enum).toContain("exp2");
  });

  it("skybox exposes the colours and the moon nobody decided to drop", () => {
    const sky = propertiesOf("skybox");
    for (const key of ["duskColor", "moonColor", "moonIntensity", "azimuth"]) {
      expect([key, key in sky]).toEqual([key, true]);
    }
  });

  it("a still sky is still the default, and now reachable on a log slider", () => {
    const scale = propertiesOf("skybox").realtimeScale;
    // The format's decision, not the element's — an ensemble is reproducible.
    expect(scale?.default).toBe(0);
    // And the named-decade cycler that stood in for this is gone.
    expect(scale?.enum).toBeUndefined();
    expect(scale?.["x-scale"]).toBe("log");
    expect(scale?.["x-zero-stop"]).toBe(true);
  });
});
