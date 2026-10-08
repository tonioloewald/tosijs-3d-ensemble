import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  SCENE WIND MOVES THE WEATHER.

  `wind` writes the host's windSpeed / windBearingDeg, and the reason a
  document wants that is a `weatherCell` with `drift: 'wind'`, which travels
  on the SCENE's wind. So this measures the cell moving, not the attribute
  being set: east at a bearing of 90°, and still once the wind piece is gone.
*/
type Ed = Element & {
  load: (u: string) => Promise<void>;
  edit: (
    d: string,
    m: (e: { pieces: Array<Record<string, unknown>> }) => void
  ) => void;
  shadowRoot: ShadowRoot | null;
};

test("a wind piece blows a drifting storm across the scene", async ({
  page,
}) => {
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

  const result = await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    await ed.load("/ensembles/storm.json");
    await new Promise((r) => setTimeout(r, 3000));
    const b3d = ed.shadowRoot!.querySelector("tosi-b3d") as Element & {
      windSpeed: number;
      windBearingDeg: number;
    };
    const cellX = () =>
      (
        b3d.querySelector("tosi-b3d-weather-cell") as
          | (Element & { x: number })
          | null
      )?.x ?? NaN;
    const calm = b3d.windSpeed;

    ed.edit("blow", (e) => {
      e.pieces.push({
        id: "wind",
        at: [0, 0, 0],
        features: { wind: { windSpeed: 25, windBearingDeg: 90 } },
      });
      const cell = e.pieces.find((p) => p.id === "squall")!;
      (
        cell.features as { weatherCell: Record<string, unknown> }
      ).weatherCell.drift = "wind";
    });
    await new Promise((r) => setTimeout(r, 2000));
    const blowing = { speed: b3d.windSpeed, bearing: b3d.windBearingDeg };
    const x0 = cellX();
    await new Promise((r) => setTimeout(r, 4000));
    const x1 = cellX();

    ed.edit("calm", (e) => {
      e.pieces.splice(
        e.pieces.findIndex((p) => p.id === "wind"),
        1
      );
    });
    await new Promise((r) => setTimeout(r, 1500));
    const after = b3d.windSpeed;
    const x2 = cellX();
    await new Promise((r) => setTimeout(r, 3000));
    const x3 = cellX();
    return { calm, blowing, x0, x1, after, x2, x3 };
  });

  expect(result.blowing).toEqual({ speed: 25, bearing: 90 });
  // Toward +X at 25 m/s for 4 s: it moved east, and by a wind-sized amount.
  expect(result.x1 - result.x0, "the storm did not drift").toBeGreaterThan(20);
  // The wind piece removed: the host's wind is back, and the storm stops.
  expect(result.after).toBe(result.calm);
  expect(Math.abs(result.x3 - result.x2)).toBeLessThan(5);

  expect(realErrors(errors)).toEqual([]);
});
