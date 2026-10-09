import { describe, expect, it } from "bun:test";
import { migrate } from "./migrate.js";
import { terrainConfig } from "../runtime/features-scene.js";

/*
  `terrain.biomeTemperature: -1` (our #13): the pre-0.9 "default", which
  tosijs-3d 0.9.0 reads as -50 °C. Read as the default at bind, removed by
  `migrate()`, and EXACTLY -1 only, because any other number could be in
  either scale.
*/
const doc = (biomeTemperature: unknown) =>
  ({
    name: "t",
    pieces: [
      {
        id: "land",
        at: [0, 0, 0],
        features: { terrain: { biome: true, biomeTemperature } },
      },
    ],
  } as never);

describe("terrainConfig", () => {
  it("reads -1 as tosijs-3d's default, not -50 °C", () => {
    const out = terrainConfig({ biomeTemperature: -1 });
    expect(out.biomeTemperature).toBe(0.45);
  });

  it("leaves any other temperature alone, and maps biome to on/off", () => {
    expect(terrainConfig({ biomeTemperature: -0.8, biome: true })).toEqual({
      biomeTemperature: -0.8,
      biome: "on",
    });
    expect(terrainConfig({}).biome).toBe("off");
  });
});

describe("migrate removes the legacy biomeTemperature -1", () => {
  it("removes it and says so", () => {
    const { ensemble, changes } = migrate(doc(-1)) as never as {
      ensemble: { pieces: Array<{ features: { terrain: object } }> };
      changes: Array<{ path: string }>;
    };
    expect("biomeTemperature" in ensemble.pieces[0]!.features.terrain).toBe(
      false
    );
    expect(changes.map((c) => c.path)).toContain(
      "/pieces/0/features/terrain/biomeTemperature"
    );
  });

  it("is idempotent, and never converts another value", () => {
    const once = migrate(doc(-1)) as never as { ensemble: never };
    const twice = migrate(once.ensemble) as never as { changes: unknown[] };
    expect(twice.changes).toEqual([]);
    const other = migrate(doc(0.3)) as never as {
      ensemble: {
        pieces: Array<{ features: { terrain: { biomeTemperature: number } } }>;
      };
      changes: unknown[];
    };
    expect(other.ensemble.pieces[0]!.features.terrain.biomeTemperature).toBe(
      0.3
    );
    expect(other.changes).toEqual([]);
  });
});
