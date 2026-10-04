import { describe, expect, it } from "bun:test";
import { sceneSchemas } from "tosijs-3d";
import {
  registerSceneFeatures,
  schemaDrift,
  weatherCellConfig,
} from "./features-scene.js";
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
  ["cloudDeck", "cloudDeck"],
  ["moon", "moon"],
  ["sound", "sound"],
  ["weatherCell", "weatherCell"],
  ["lightning", "lightning"],
  ["lightShafts", "lightShafts"],
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
      The deliberate exceptions, each carrying its reason in the source:

      - `terrain.seed` is an INTEGER with a small ceiling — it is typed or
        stepped, never dragged, because no seed is near another.
      - `terrain.tileSize` has a floor upstream does not: finest-level tiles go
        as `(2·reach / tileSize)²`, so it is the PRODUCT of two sliders that
        kills the tab, and a schema cannot say "…unless reach is large".
      - `terrain.biome` stays a BOOLEAN because a JSON document has real
        booleans; `'on'|'off'` is an HTML-attribute concern and the bind maps it.
      - `cloudDeck.follow`/`shadows` are BOOLEANS and `cloudDeck.seed` an
        integer with a ceiling, for exactly the reasons `terrain.biome` and
        `terrain.seed` are.
      - `lightning.bolts`/`sprites`/`thunder`/`shadows` and
        `lightShafts.underwater` are BOOLEANS, the same `'on'|'off'` reason.
      (`terrain.radius` used to be a fourth: we gave it a log scale over its
      six decades, and tosijs-3d@0.8.1 added the same upstream — so the
      override went, and this test is what noticed by failing on the upgrade.
      The same happened in 0.8.4: `spaceStart`/`spaceFull` briefly carried a
      translated `x-unit` because upstream spelled it `unit` (tosijs-3d#85),
      and this test failed the moment the spelling was fixed.)
    */
    expect(restated.sort()).toEqual(
      [
        'terrain.biome.enum: undefined (ours) vs ["off","on"] (upstream)',
        "terrain.seed.maximum: 9999 (ours) vs undefined (upstream)",
        "terrain.tileSize.minimum: 32 (ours) vs 1 (upstream)",
        'cloudDeck.follow.enum: undefined (ours) vs ["on","off"] (upstream)',
        'cloudDeck.shadows.enum: undefined (ours) vs ["on","off"] (upstream)',
        "cloudDeck.seed.maximum: 9999 (ours) vs undefined (upstream)",
        'lightning.bolts.enum: undefined (ours) vs ["on","off"] (upstream)',
        'lightning.sprites.enum: undefined (ours) vs ["on","off"] (upstream)',
        'lightning.thunder.enum: undefined (ours) vs ["on","off"] (upstream)',
        'lightning.shadows.enum: undefined (ours) vs ["on","off"] (upstream)',
        'lightShafts.underwater.enum: undefined (ours) vs ["on","off"] (upstream)',
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
    for (const key of ["duskColor", "moonColor", "moonIntensity"]) {
      expect([key, key in sky]).toEqual([key, true]);
    }
  });

  it("skybox does NOT offer azimuth, because azimuth does nothing", () => {
    /*
      It used to be in the list above, as a field "nobody decided to drop".
      Reading the element for 0.8.3 found it dead: written to
      `material.azimuth`, whose setter b3d-skybox itself defines as a no-op.
      A control that does nothing is worse than no control. tosijs-3d#86 —
      when it lives again, this flips.
    */
    expect("azimuth" in propertiesOf("skybox")).toBe(false);
  });

  it("skybox offers the night sky and the edge of space", () => {
    const sky = propertiesOf("skybox");
    for (const key of [
      "starfieldData",
      "starfieldCube",
      "starfieldTilt",
      "nebulae",
      "spaceColor",
      "spaceStart",
      "rayleigh",
    ]) {
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

/*
  THE CLOUD DECK'S BOOLEANS REACH THE ELEMENT AS 'on' / 'off'.

  The format keeps real booleans (a JSON document has them); `b3d-cloud-deck`
  spells `follow` and `shadows` as `'on' | 'off'`, because an absent HTML
  boolean attribute reads false. Without the mapping an editor checkbox would
  write `false` to an attribute that only knows two strings, and do nothing.
  Flagged by the 0.4.0 review as new behaviour no test would miss.
*/
describe("cloudDeck maps booleans to the element's on/off", () => {
  it("on update, both directions", () => {
    const reg = featureRegistration("cloudDeck")!;
    const el: Record<string, unknown> = {};
    reg.update!(el as never, { follow: false, shadows: true }, {} as never);
    expect([el.follow, el.shadows]).toEqual(["off", "on"]);
    reg.update!(el as never, { follow: true }, {} as never);
    expect(el.follow).toBe("on");
    // A key the config does not mention is left alone, not reset.
    expect(el.shadows).toBe("on");
  });
});

/*
  THE WEATHER: the same on/off mapping, a cell placed by its piece, and a
  freshly inserted cell that is a storm rather than nothing.
*/
describe("weather features", () => {
  it("lightning and shafts map booleans to the element's on/off", () => {
    registerSceneFeatures();
    const el: Record<string, unknown> = {};
    featureRegistration("lightning")!.update!(
      el as never,
      { bolts: false, thunder: true, shadows: false, rate: 2 },
      {} as never
    );
    expect([el.bolts, el.thunder, el.shadows, el.rate]).toEqual([
      "off",
      "on",
      "off",
      2,
    ]);
    expect("sprites" in el).toBe(false); // unmentioned: left alone
    const shafts: Record<string, unknown> = {};
    featureRegistration("lightShafts")!.update!(
      shafts as never,
      { underwater: false },
      {} as never
    );
    expect(shafts.underwater).toBe("off");
  });

  it("a weather cell stands where its piece is", () => {
    // The CONFIG, not the element: creator props are not readable
    // synchronously (see `stillSky`), so the element would show its defaults.
    expect(
      weatherCellConfig({ radius: 500, x: 9, z: 9 }, [120, 5, -40])
    ).toEqual({ radius: 500, x: 120, z: -40 });
  });

  it("a new cell defaults to a storm, not the element's all-zero calm", () => {
    registerSceneFeatures();
    const props = (
      featureRegistration("weatherCell")!.schema as {
        properties: Record<string, { default?: unknown }>;
      }
    ).properties;
    expect(props.storminess!.default).toBe(1);
    expect(props.coverage!.default).toBe(1.7);
    // Position is the piece's, never a field.
    expect("x" in props || "z" in props).toBe(false);
  });
});

/*
  UPSTREAM'S SECTIONS cover every field we pick.

  The sky, water and cloud deck carry tosijs-3d's own `x-sections` (0.8.9).
  A picked field upstream does not section would render ABOVE the first
  header, ungrouped and never folded — a quiet way for a long panel to come
  back. So every picked field of a sectioned feature must be in a section.
*/
describe("sectioned features group every field they pick", () => {
  it.each(["skybox", "water", "cloudDeck"])("%s", (name) => {
    registerSceneFeatures();
    const schema = featureRegistration(name)!.schema as {
      properties: Record<string, unknown>;
      "x-sections"?: Array<{ title: string; keys: string[] }>;
    };
    expect(schema["x-sections"]?.length).toBeGreaterThan(0);
    const claimed = new Set(schema["x-sections"]!.flatMap((s) => s.keys));
    const loose = Object.keys(schema.properties).filter((k) => !claimed.has(k));
    expect(loose).toEqual([]);
  });
});
