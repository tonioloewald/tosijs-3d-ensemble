import { test, expect } from "@playwright/test";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { locate } from "./panel-locate.js";

/*
  OPEN AND SAVE THROUGH THE DEV SERVER (board #3363, from Manta: "open a level
  or a formation, edit it, save it"). Our site gives every editor tosijs-ui's
  data store over `static/ensembles` (`editableData`); this opens a sample,
  edits it, and saves it AS a scratch file with real clicks, then asks the
  DISK. It also checks the save did not reload the page under the editor
  (`static/` is a watched path).
*/
const SCRATCH = "static/ensembles/zz-store-test.json";

test("open from the store, edit, and save as a new file", async ({ page }) => {
  test.setTimeout(180_000);
  rmSync(SCRATCH, { force: true });
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as
          | (Element & { store?: unknown })
          | null
      )?.store,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(3000);
  type Ed = Element & {
    store: unknown;
    dirty: boolean;
    openFromStore(id: string): Promise<void>;
    edit(d: string, m: (e: { name: string }) => void): void;
    shadowRoot: ShadowRoot;
  };
  const title = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      return (
        Array.from(ed.shadowRoot.querySelectorAll("tosi-b3d-panel")).find((p) =>
          (p as HTMLElement).title.startsWith("Ensemble")
        ) as HTMLElement | undefined
      )?.title;
    });

  await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    (window as unknown as { __stillHere: boolean }).__stillHere = true;
    await ed.openFromStore("static/ensembles/pirate-cove.json");
  });
  await page.waitForTimeout(1500);
  expect(await title()).toBe("Ensemble");
  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.edit("rename", (e) => {
      e.name = "store-test";
    });
  });
  await page.waitForTimeout(300);
  expect(await title(), "an edit did not mark the document dirty").toBe(
    "Ensemble •"
  );

  // SAVE AS, with real clicks: type the name, press the button.
  const field = await locate(page, "save as…");
  expect(field, "no save-as field").toBeTruthy();
  await page.mouse.click(field!.x + field!.w / 2, field!.y + field!.h / 2);
  await page.keyboard.type("zz-store-test");
  await page.waitForTimeout(300);
  const button = await locate(page, "Save as");
  expect(button, "no Save as button").toBeTruthy();
  await page.mouse.click(button!.x + button!.w / 2, button!.y + button!.h / 2);
  await page.waitForTimeout(2500);

  expect(existsSync(SCRATCH), "nothing was written to disk").toBe(true);
  const written = JSON.parse(readFileSync(SCRATCH, "utf8")) as {
    name: string;
    pieces: unknown[];
  };
  expect(written.name).toBe("store-test");
  expect(written.pieces.length).toBeGreaterThan(5);
  expect(await title(), "still marked dirty after saving").toBe("Ensemble");
  expect(
    await page.evaluate(
      () => (window as unknown as { __stillHere?: boolean }).__stillHere
    ),
    "the save reloaded the page"
  ).toBe(true);

  rmSync(SCRATCH, { force: true });
  expect(realErrors(errors)).toEqual([]);
});
