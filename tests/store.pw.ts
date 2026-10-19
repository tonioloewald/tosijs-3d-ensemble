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
// The dev server mirrors static/ into docs/: clean both, pass or fail.
const MIRROR = "docs/ensembles/zz-store-test.json";
test.afterEach(() => {
  rmSync(SCRATCH, { force: true });
  rmSync(MIRROR, { force: true });
});

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

/*
  SAVE NEVER WRITES OVER THE DOCUMENT YOU LEFT (0.7.0 review M2). The editor
  kept the store id of the last document it opened through New, Open file
  and a plain `ensemble =`, so Save wrote the new document over the old
  file. A fake store records every write.
*/
test("after New or another document, Save does not overwrite the store document", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );
  const writes = await page.evaluate(async () => {
    type Ed = Element & {
      store: unknown;
      openFromStore(id: string): Promise<void>;
      saveToStore(id?: string): Promise<void>;
      newEnsemble(): void;
      ensemble: unknown;
    };
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const written: string[] = [];
    ed.store = {
      list: async () => [{ id: "harbour.json" }],
      read: async () => ({ name: "harbour", pieces: [] }),
      write: async (id: string) => {
        written.push(id);
        return { id };
      },
    };
    await ed.openFromStore("harbour.json");
    ed.newEnsemble();
    await ed.saveToStore();
    await ed.openFromStore("harbour.json");
    ed.ensemble = { name: "other", pieces: [] };
    await ed.saveToStore();
    return written;
  });
  expect(writes, "Save wrote over the store document that was left").toEqual(
    []
  );
});

/*
  A LOAD STILL IN FLIGHT NEVER LANDS OVER A DOCUMENT OPENED AFTER IT. The
  page's own `src` fetch, still pending, landed after `openFromStore` and
  replaced the store document, which (since M2) also dropped its store id:
  the next edit never read as dirty. Found adopting tosijs-3d 0.10.16, whose
  timing made it 1 run in 5. `load()` had a generation counter that only
  other loads advanced. Held here deterministically: a load made slow on
  purpose, then each explicit way of changing the document.
*/
test("a slow load does not land over a document opened after it", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );
  await page.waitForTimeout(3000);
  await page.route("**/slow-load.json", async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ name: "late", pieces: [] }),
    });
  });
  const results = await page.evaluate(async () => {
    type Ed = Element & {
      store: unknown;
      ensemble: { name: string; pieces: unknown[] };
      dirty: boolean;
      load(url: string): Promise<void>;
      openFromStore(id: string): Promise<void>;
      newEnsemble(): void;
      edit(d: string, m: (e: { name: string }) => void): void;
    };
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.store = {
      list: async () => [{ id: "harbour.json" }],
      read: async () => ({ name: "harbour", pieces: [] }),
      write: async (id: string) => ({ id }),
    };
    const out: Record<string, string> = {};
    const ways: Record<string, () => Promise<void> | void> = {
      openFromStore: () => ed.openFromStore("harbour.json"),
      setter: () => {
        ed.ensemble = { name: "assigned", pieces: [] };
      },
      newEnsemble: () => ed.newEnsemble(),
    };
    for (const [way, act] of Object.entries(ways)) {
      const slow = ed.load("/slow-load.json").catch(() => {});
      await act();
      const name = ed.ensemble.name;
      await slow;
      await new Promise((r) => setTimeout(r, 300));
      out[way] = ed.ensemble.name === name ? "kept" : `replaced by ${ed.ensemble.name}`;
    }
    // And the store binding survives, so an edit reads as dirty.
    const slow = ed.load("/slow-load.json").catch(() => {});
    await ed.openFromStore("harbour.json");
    await slow;
    ed.edit("rename", (e) => {
      e.name = "harbour 2";
    });
    out.dirty = String(ed.dirty);
    return out;
  });
  expect(results).toEqual({
    openFromStore: "kept",
    setter: "kept",
    newEnsemble: "kept",
    dirty: "true",
  });
});

/*
  SAVE CLEARS THE "•" ITSELF. The title was synced only when `_refreshStore`
  saw the store's LIST change, which a Save back to the same file never does,
  so the dot outlived every Save; Save as passed only when the new file showed
  up in the listing in time (found adopting tosijs-3d 0.10.16, 4 runs in 4).
  A store whose list never changes holds the plain Save.
*/
test("Save back to the same document clears the dirty mark", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );
  await page.waitForTimeout(3000);
  const titles = await page.evaluate(async () => {
    type Ed = Element & {
      store: unknown;
      shadowRoot: ShadowRoot;
      openFromStore(id: string): Promise<void>;
      saveToStore(id?: string): Promise<void>;
      edit(d: string, m: (e: { name: string }) => void): void;
    };
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.store = {
      list: async () => [{ id: "harbour.json" }],
      read: async () => ({ name: "harbour", pieces: [] }),
      write: async (id: string) => ({ id }),
    };
    const title = () =>
      (
        Array.from(ed.shadowRoot.querySelectorAll("tosi-b3d-panel")).find((p) =>
          (p as HTMLElement).title.startsWith("Ensemble")
        ) as HTMLElement | undefined
      )?.title;
    await ed.openFromStore("harbour.json");
    ed.edit("rename", (e) => {
      e.name = "harbour 2";
    });
    const edited = title();
    await ed.saveToStore();
    return { edited, saved: title() };
  });
  expect(titles).toEqual({ edited: "Ensemble •", saved: "Ensemble" });
});
