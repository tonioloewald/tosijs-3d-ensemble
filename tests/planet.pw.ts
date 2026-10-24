import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A WORLD FROM ITS PLANET, EITHER WAY ROUND (board #3317), measured on the
  elements.

  planet.json: a sphere terrain pinned at 30° N, 40° E, and a planet piece
  linked to it. The owner: "can we allow it to work either way?" — so both
  directions are built from the same document and asked of tosijs-3d:

  - TERRAIN-SOURCED (the file as written, `planet.terrain: "land"`): the
    terrain's `latLonAt` at its origin is the pin, and the globe was handed
    that ground (its surface has the ground's radius), through a selector the
    link phase wrote from the piece id.
  - PLANET-SOURCED (`terrain.planet: "globe"`): the ground takes the globe's
    shape, so where the globe has sea the ground is under 0 and where it has
    land the ground is over it. Counted over 200 directions.
  - THE CONTROL: the same document with NEITHER link. Sea/land agreement is
    then near chance, which is what makes the linked count mean anything.

  The look was checked by eye against tosijs-3d's own sphere-map demo: without
  `center` the same settings rendered one dry snowfield.
*/
test("a planet and its terrain are one world, from either side", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );

  const r = await page.evaluate(async () => {
    type V = { x: number; y: number; z: number };
    type Doc = {
      pieces: Array<{ id: string; features?: Record<string, unknown> }>;
    } & Record<string, unknown>;
    type Ed = Element & {
      load: (u: string) => Promise<void>;
      ensemble: Doc;
      shadowRoot: ShadowRoot | null;
    };
    type Terrain = Element & {
      id: string;
      originOffset?: { x: number; z: number };
      latLonAt?: (x: number, z: number) => { lat: number; lon: number } | null;
      radius: number;
      generationKey?: string;
      planetSource?: () => unknown;
      planetSurface?: () => {
        seaLevel: number;
        heightAt(d: V): number;
      } | null;
    };
    type Planet = Element & {
      id: string;
      terrain?: string;
      surface?: { radius: number } | null;
      shapeKey?: string;
      relativeHeightAt?: (d: V) => number;
      rootNode?: { position: V } | null;
    };
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const b3d = () => ed.shadowRoot!.querySelector("tosi-b3d")!;
    const terrain = () =>
      b3d().querySelector("tosi-b3d-terrain") as Terrain | null;
    const planet = () =>
      b3d().querySelector("tosi-b3d-planet") as Planet | null;
    const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
    // The same 200 directions every time, so the three counts compare.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const dirs: V[] = [];
    while (dirs.length < 200) {
      const v = { x: rand() * 2 - 1, y: rand() * 2 - 1, z: rand() * 2 - 1 };
      const n = Math.hypot(v.x, v.y, v.z);
      if (n > 0.1 && n <= 1) dirs.push({ x: v.x / n, y: v.y / n, z: v.z / n });
    }
    /** How often the ground and the globe agree on sea vs land. */
    const agreement = () => {
      const surface = terrain()?.planetSurface?.();
      const globe = planet();
      if (!surface || !globe?.relativeHeightAt) return null;
      let agree = 0;
      for (const d of dirs)
        if (
          surface.heightAt(d) - surface.seaLevel > 0 ===
          globe.relativeHeightAt(d) > 0
        )
          agree++;
      return agree / dirs.length;
    };
    /** Until the ground's shape stops changing. */
    const settle = async () => {
      let last = "";
      for (let i = 0; i < 120; i++) {
        await sleep(250);
        const key = `${terrain()?.generationKey}|${planet()?.shapeKey}`;
        if (key === last && terrain()?.generationKey) return;
        last = key;
      }
    };

    // 1. TERRAIN-SOURCED, as the file says.
    await ed.load("/ensembles/planet.json");
    for (let i = 0; i < 120 && !planet()?.surface; i++) await sleep(250);
    await settle();
    const t = terrain();
    const p = planet();
    const off = t?.originOffset ?? { x: 0, z: 0 };
    const terrainSourced = {
      here: t?.latLonAt?.(off.x, off.z) ?? null,
      selector: p?.terrain ?? null,
      resolves: !!p?.terrain && b3d().querySelector(p.terrain) === t,
      surfaceRadius: p?.surface?.radius ?? null,
      terrainRadius: t?.radius ?? null,
      root: p?.rootNode
        ? [p.rootNode.position.x, p.rootNode.position.y, p.rootNode.position.z]
        : null,
    };

    const withLinks = (planetLink: boolean, terrainLink: boolean): Doc => {
      const doc = JSON.parse(JSON.stringify(ed.ensemble)) as Doc;
      for (const piece of doc.pieces) {
        const f = piece.features ?? {};
        if (f.planet) {
          const cfg = { ...(f.planet as Record<string, unknown>) };
          if (planetLink) cfg.terrain = "land";
          else delete cfg.terrain;
          f.planet = cfg;
        }
        if (f.terrain) {
          const cfg = { ...(f.terrain as Record<string, unknown>) };
          if (terrainLink) cfg.planet = "globe";
          else delete cfg.planet;
          f.terrain = cfg;
        }
      }
      return doc;
    };

    // 2. THE CONTROL: neither linked.
    ed.ensemble = withLinks(false, false);
    await sleep(500);
    await settle();
    const unlinked = agreement();

    // 3. PLANET-SOURCED.
    ed.ensemble = withLinks(false, true);
    await sleep(500);
    await settle();
    const t3 = terrain();
    const planetSourced = {
      selectorResolves: t3?.planetSource?.() === planet(),
      agreement: agreement(),
    };
    return { terrainSourced, unlinked, planetSourced };
  });

  console.log(JSON.stringify(r));
  const ts = r.terrainSourced;
  expect(ts.here, "the terrain reports no place").not.toBeNull();
  expect(ts.here!.lat).toBeCloseTo(30, 3);
  expect(ts.here!.lon).toBeCloseTo(40, 3);
  expect(ts.selector, "the link phase wrote no selector").toMatch(/^#/);
  expect(ts.resolves, "the selector does not name the terrain").toBe(true);
  expect(ts.surfaceRadius, "the globe was not drawn from the terrain").toBe(
    ts.terrainRadius
  );
  expect(ts.root).toEqual([0, 440, 220]);

  expect(r.planetSourced.selectorResolves, "the ground has no planet").toBe(
    true
  );
  // The control first: unlinked, sea and land agree about as often as not.
  expect(r.unlinked).not.toBeNull();
  expect(r.unlinked!).toBeLessThan(0.75);
  /*
    Linked, they disagree only near the waterline. Measured 0.875 against the
    control's 0.465: the ground's own detail layer (24 m here) moves its
    coastline off the globe's, so the floor is 0.8, not "all of them", and
    the margin over the control is what proves the link.
  */
  expect(r.planetSourced.agreement!).toBeGreaterThan(0.8);
  expect(r.planetSourced.agreement! - r.unlinked!).toBeGreaterThan(0.25);

  expect(realErrors(errors)).toEqual([]);
});

/*
  CLEARING A FIELD THE PRESET WROTE PUTS THE PRESET'S VALUE BACK (board
  #3356). `ocean` is written by a planet's `world` preset, so it has no
  default to fall back on (`x-apply-default: false`): removing it from the
  document updated nothing, and the planet kept the author's last value.
  Such a removal now rebinds the feature, which applies the preset again.
*/
test("clearing a preset-written planet field restores the preset's value", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      (
        document.querySelector("tosi-ensemble-editor") as Element & {
          ensemble?: { name?: string };
        }
      )?.ensemble?.name === "pirate-cove",
    null,
    { timeout: 60_000 }
  );
  type Ed = Element & {
    ensemble: {
      pieces: Array<{
        id: string;
        features?: Record<string, Record<string, unknown>>;
      }>;
    };
    edit(d: string, m: (e: Ed["ensemble"]) => void): void;
    _built: {
      pieces: Map<string, { handles: Map<string, Record<string, unknown>> }>;
    };
  };
  const ocean = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      return ed._built?.pieces.get("globe")?.handles.get("planet")?.ocean as
        | number
        | undefined;
    });
  await page.evaluate(() => {
    (
      document.querySelector("tosi-ensemble-editor") as unknown as {
        ensemble: unknown;
      }
    ).ensemble = {
      name: "worlds",
      pieces: [
        { id: "sun", at: [-0.6, 0.5, -0.3], features: { sun: {} } },
        {
          id: "globe",
          at: [0, 20, 0],
          features: { planet: { world: "earth", radius: 20 } },
        },
      ],
    };
  });
  await expect.poll(ocean, { timeout: 30_000 }).not.toBeUndefined();
  await page.waitForTimeout(1000);
  const preset = await ocean();

  await page.evaluate(() => {
    (document.querySelector("tosi-ensemble-editor") as Ed).edit(
      "ocean",
      (e) => {
        e.pieces.find((p) => p.id === "globe")!.features!.planet!.ocean = 0.123;
      }
    );
  });
  await expect.poll(ocean, { timeout: 30_000 }).toBe(0.123);

  await page.evaluate(() => {
    (document.querySelector("tosi-ensemble-editor") as Ed).edit(
      "clear ocean",
      (e) => {
        delete e.pieces.find((p) => p.id === "globe")!.features!.planet!.ocean;
      }
    );
  });
  await expect
    .poll(ocean, {
      message: "clearing ocean kept the author's value",
      timeout: 30_000,
    })
    .toBe(preset);
  expect(preset).not.toBe(0.123);
});
