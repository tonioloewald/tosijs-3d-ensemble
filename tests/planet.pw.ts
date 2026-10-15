import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A WORLD FROM ITS PLANET (board #3317), measured on the elements.

  planet.json: a sphere terrain pinned at 30° N, 40° E, and a planet piece
  drawn from it. Three claims, each asked of tosijs-3d rather than of us:

  - the PIN: the terrain's own latLonAt at its origin is the pinned place;
  - the LINK: the globe was handed that terrain's surface (same radius);
  - the PLACE: the globe's root sits where its piece is.

  The look was checked by eye against tosijs-3d's own sphere-map demo as a
  control: without `center` the same settings rendered one dry snowfield.
*/
test("a planet drawn from a terrain pinned at 30 N, 40 E", async ({ page }) => {
  test.setTimeout(180_000);
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
    type Ed = Element & {
      load: (u: string) => Promise<void>;
      shadowRoot: ShadowRoot | null;
    };
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    await ed.load("/ensembles/planet.json");
    const b3d = ed.shadowRoot!.querySelector("tosi-b3d")!;
    const terrain = () =>
      b3d.querySelector("tosi-b3d-terrain") as
        | (Element & {
            originOffset?: { x: number; z: number };
            latLonAt?: (
              x: number,
              z: number
            ) => { lat: number; lon: number } | null;
            radius: number;
          })
        | null;
    const planet = () =>
      b3d.querySelector("tosi-b3d-planet") as
        | (Element & {
            surface?: { radius: number } | null;
            rootNode?: { position: { x: number; y: number; z: number } } | null;
          })
        | null;
    // The link runs on a timer and the terrain builds its shape first.
    for (let i = 0; i < 120 && !planet()?.surface; i++)
      await new Promise((r) => setTimeout(r, 250));
    const t = terrain();
    const p = planet();
    const off = t?.originOffset ?? { x: 0, z: 0 };
    return {
      here: t?.latLonAt?.(off.x, off.z) ?? null,
      surfaceRadius: p?.surface?.radius ?? null,
      terrainRadius: t?.radius ?? null,
      root: p?.rootNode
        ? [p.rootNode.position.x, p.rootNode.position.y, p.rootNode.position.z]
        : null,
    };
  });

  expect(r.here, "the terrain reports no place").not.toBeNull();
  expect(r.here!.lat).toBeCloseTo(30, 3);
  expect(r.here!.lon).toBeCloseTo(40, 3);
  expect(r.surfaceRadius, "the globe was not drawn from the terrain").toBe(
    r.terrainRadius
  );
  expect(r.root).toEqual([0, 440, 220]);

  expect(realErrors(errors)).toEqual([]);
});
