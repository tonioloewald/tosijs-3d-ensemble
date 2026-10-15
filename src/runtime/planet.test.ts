import { describe, expect, it } from "bun:test";
import { groundToLatLon } from "tosijs-3d";
import { pinFrame, terrainConfig } from "./features-scene.js";

/*
  THE PIN (ours until tosijs-3d#103): a terrain pinned at (lat, lon) must have
  its origin THERE, by tosijs-3d's own reckoning. So this asks sphere-map, not
  our arithmetic: pin, then read the origin back with groundToLatLon.
*/
describe("pinFrame", () => {
  const cases: Array<[number, number]> = [
    [45, 0],
    [12, 40],
    [-33.9, 18.4],
    [0, 179],
    [60, -120],
  ];
  for (const [lat, lon] of cases) {
    it(`puts the origin at ${lat}, ${lon}`, () => {
      const frame = { radius: 4000, ...pinFrame(lat, lon) };
      const back = groundToLatLon(0, 0, frame);
      expect(back.lat).toBeCloseTo(lat, 6);
      expect(back.lon).toBeCloseTo(lon, 6);
    });
  }

  it("matches sphere-map's own example: 45 N is worldV 0.75", () => {
    expect(pinFrame(45, 0).worldV).toBeCloseTo(0.75, 9);
  });

  it("terrainConfig turns a pin into worldU/worldV, and drops lat/lon", () => {
    const out = terrainConfig({ surfaceType: "sphere", lat: 12, lon: 40 });
    expect("lat" in out || "lon" in out).toBe(false);
    expect(out.worldU).toBeCloseTo(pinFrame(12, 40).worldU, 12);
    expect(out.worldV).toBeCloseTo(pinFrame(12, 40).worldV, 12);
    // No pin: the terrain keeps its own frame.
    expect("worldU" in terrainConfig({ surfaceType: "sphere" })).toBe(false);
  });
});
