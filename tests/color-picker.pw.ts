import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { reveal } from "./panel-locate.js";

/*
  A COLOUR IS PICKED, NOT TYPED. The schema panel offered colours as hex
  text "until there is a picker", long after tosijs-3d shipped
  `colorPicker3d` (owner: "We do have a color picker! It was a showcase").
  Real clicks: the swatch opens the picker, a preset is chosen, and the
  DOCUMENT says so.

  The preset is found by its measured offset from the row, because a preset
  swatch has no text to locate it by: in the popup, the fifth swatch of the
  first preset row (a red) sat 137 px left of the panel's right edge and
  206 px below the row. If tosijs-3d moves its presets this reports "the pick
  wrote nothing", not a false pass.
*/
test("a colour field opens tosijs-3d's picker, and a pick is written", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1400, height: 1000 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d-destroyable"),
    { timeout: 60_000 }
  );
  await page.waitForTimeout(3000);
  const colour = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        ensemble: {
          pieces: Array<{ features?: { water?: { waterColor?: string } } }>;
        };
      };
      return (
        ed.ensemble.pieces.find((p) => p.features?.water)?.features?.water
          ?.waterColor ?? null
      );
    });
  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      ensemble: { pieces: Array<{ id: string; features?: object }> };
      select(id: string): void;
    };
    ed.select(
      ed.ensemble.pieces.find(
        (p) => (p.features as { water?: object } | undefined)?.water
      )!.id
    );
  });
  await page.waitForTimeout(1500);
  const before = await colour();

  const row = await reveal(page, "waterColor");
  expect(row, "no waterColor row").toBeTruthy();
  // The swatch, at the row's right end: opens the picker.
  await page.mouse.click(row!.panelRight - 40, row!.y + row!.h / 2);
  await page.waitForTimeout(1200);
  // A preset (see the note above).
  await page.mouse.click(row!.panelRight - 137, row!.y + 206);
  await page.waitForTimeout(1200);
  const after = await colour();
  console.log(JSON.stringify({ before, after }));
  expect(after, "the pick wrote nothing to the document").not.toBe(before);
  expect(after).toMatch(/^#|^rgba?\(/);
  expect(realErrors(errors)).toEqual([]);
});
