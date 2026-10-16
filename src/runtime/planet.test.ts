import { describe, expect, it } from "bun:test";
import { sceneSchemas } from "tosijs-3d";
import { registerSceneFeatures, terrainConfig } from "./features-scene.js";
import { effectiveConfig, featureRegistration } from "../format/registry.js";

registerSceneFeatures();

/*
  THE PIN is tosijs-3d's since 0.10.8 (#103): the terrain stores `lat`/`lon`
  itself. Ours was a conversion to worldU/worldV; what remains ours is only
  that the document's pin reaches the element untouched. Whether the element
  then puts its origin THERE is asked of the element, in tests/planet.pw.ts.
*/
describe("the pin", () => {
  it("terrainConfig hands lat/lon to the element as they are", () => {
    const out = terrainConfig({ surfaceType: "sphere", lat: 12, lon: 40 });
    expect([out.lat, out.lon]).toEqual([12, 40]);
    expect("worldU" in out || "worldV" in out).toBe(false);
  });
});

/*
  PRESETS: a planet's `world` writes its sea, air and craters into the
  element's own attributes once. Writing the plain defaults on every bind
  would undo it on the first live edit, so upstream names those fields
  (`x-preset-written`) and they must be shown but never written.
*/
describe("preset-written planet fields", () => {
  const upstream = sceneSchemas.planet() as unknown as {
    "x-preset-written": Record<string, string[]>;
  };
  const written = Object.values(upstream["x-preset-written"]).flat();
  const planet = featureRegistration("planet")!;

  it("upstream names some (or this test is vacuous)", () => {
    expect(written).toContain("ocean");
    expect(written.length).toBeGreaterThan(5);
  });

  it("are shown in the panel, with their default", () => {
    const props = planet.schema!.properties as Record<
      string,
      { default?: unknown }
    >;
    for (const key of written) expect([key, key in props]).toEqual([key, true]);
    expect(props.ocean?.default).toBe(0.6);
  });

  it("are never written by the bind unless the document sets them", () => {
    const out = effectiveConfig(planet, { world: "mars" });
    for (const key of written) expect([key, key in out]).toEqual([key, false]);
    // ...while an ordinary default still is.
    expect(out.radius).toBe(50);
    // ...and the author's own value always is.
    expect(effectiveConfig(planet, { world: "mars", ocean: 0.2 }).ocean).toBe(
      0.2
    );
  });
});
