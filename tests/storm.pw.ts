import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  THE WEATHER WORKS: a storm cell placed by its piece, and lightning that
  strikes INSIDE it.

  Unit tests pin the configs (`weatherCellConfig`, the on/off mapping). They
  cannot see whether the composition does anything: a cell at the wrong place,
  lightning that never finds a cell, or a cell with no storminess would all
  pass them. So this loads `storm.json` and watches real strikes, with their
  positions, which only a cell at the piece's position can explain.

  `b3d-lightning` exposes `strikeCount` and a bubbling `strike` event with
  `x`/`z` — tosijs-3d's own test hook.
*/
test("a storm cell strikes lightning where its piece stands", async ({
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
    type Ed = Element & {
      load: (u: string) => Promise<void>;
      shadowRoot: ShadowRoot | null;
    };
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    await ed.load("/ensembles/storm.json");
    const b3d = ed.shadowRoot!.querySelector("tosi-b3d")!;

    // Every piece built: the elements are where the features put them.
    let cell: (Element & { x: number; z: number; radius: number }) | null =
      null;
    let lightning: (Element & { strikeCount: number }) | null = null;
    for (let i = 0; i < 120 && !(cell && lightning); i++) {
      await new Promise((r) => setTimeout(r, 250));
      cell = b3d.querySelector("tosi-b3d-weather-cell");
      lightning = b3d.querySelector("tosi-b3d-lightning");
    }
    const shafts = b3d.querySelectorAll("tosi-b3d-light-shafts").length;
    if (!cell || !lightning) return { cell: !!cell, lightning: !!lightning };

    // Collect strikes for up to 30 s (rate 2 over a storminess-1 cell is
    // about one a second).
    const strikes: Array<{ x: number; z: number; kind: string }> = [];
    b3d.addEventListener("strike", (e) => {
      const d = (e as CustomEvent).detail;
      strikes.push({ x: d.x, z: d.z, kind: d.kind });
    });
    for (let i = 0; i < 120 && strikes.length < 5; i++)
      await new Promise((r) => setTimeout(r, 250));
    return {
      cell: { x: cell.x, z: cell.z, radius: cell.radius },
      lightning: true,
      lightningCount: b3d.querySelectorAll("tosi-b3d-lightning").length,
      shafts,
      strikeCount: lightning.strikeCount,
      strikes,
    };
  });

  // The cell stands where the piece is, with the radius the file gave it.
  expect(result.cell).toEqual({ x: 700, z: 400, radius: 600 });
  // One lightning for the scene, and the shafts are up.
  expect(result.lightningCount).toBe(1);
  expect(result.shafts).toBe(1);

  // It STRIKES, and inside the cell: a strike is under the storm or it is
  // not this storm's.
  expect(result.strikes!.length, "no strikes in 30 s").toBeGreaterThan(0);
  for (const s of result.strikes!) {
    const d = Math.hypot(s.x - 700, s.z - 400);
    expect(
      d,
      `a ${s.kind} strike ${Math.round(d)} m from the cell`
    ).toBeLessThan(600);
  }

  expect(realErrors(errors)).toEqual([]);
});
