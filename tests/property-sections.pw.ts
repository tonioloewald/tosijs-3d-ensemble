import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { allPanelTexts, reveal } from "./panel-locate.js";

/*
  THE SKY PANEL FOLDS — on screen, not in a unit test.

  `schema-panel.test.ts` pins that the headers are EMITTED. It cannot see
  whether anything folds: a collapsible `label3d` in a plain `panel3d` draws
  its chevron and does nothing when tapped (tosijs-3d#99), which is exactly
  the dead control this project refuses to ship. So: select the sky, check a
  folded section's fields are NOT drawn, tap its header, check they are, and
  check the open set survives a re-render.

  ⚠️ 1400x1100, for the reason `property-keystroke.pw.ts` records: at the
  default viewport the property panel renders below the fold and a pointer
  lands on nothing at all, silently.
*/
type Ed = Element & {
  load: (u: string) => Promise<void>;
  select: (id: string | null) => void;
  shadowRoot: ShadowRoot | null;
};

/**
 * The captions the editor's chrome is showing: every <text> in its panels'
 * content. Drawn in the scene now, so nothing has a DOM box; a folded
 * section's rows are left out of the content altogether, which is what this
 * test asks about.
 */
const captions = (page: import("@playwright/test").Page) => allPanelTexts(page);

/** Tap a section header, found on screen (see panel-locate.ts). */
const tapHeader = async (
  page: import("@playwright/test").Page,
  caption: string
) => {
  const b = await reveal(page, caption);
  expect(b, `no "${caption}" header`).toBeTruthy();
  const at = { x: b!.x + b!.w / 2, y: b!.y + b!.h / 2 };
  expect(at.y, `"${caption}" is below the viewport`).toBeLessThan(
    await page.evaluate(() => innerHeight)
  );
  await page.mouse.click(at.x, at.y);
  await page.waitForTimeout(600);
};

/** A caption starting with `name` — captions carry units: `timeOfDay (h)`. */
const shows = (list: string[], name: string) =>
  list.some((c) => c === name || c.startsWith(`${name} `));

test("the sky's sections fold, open on a tap, and stay open", async ({
  page,
}) => {
  // ~55 s alone; it hit 120 s under release-doctor's load (2026-10-09).
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);

  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  // A clean open set: what an earlier run opened must not pre-open sections.
  await page.evaluate(() => localStorage.clear());
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Ed | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );
  await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    await ed.load("/ensembles/land-and-sky.json");
    await new Promise((r) => setTimeout(r, 800));
    ed.select("sky");
    await new Promise((r) => setTimeout(r, 800));
  });

  const atRest = await captions(page);
  // Every section header is drawn…
  for (const title of ["Sky", "Tint", "Sun & moon", "Stars", "Space", "Assets"])
    expect(atRest, `no "${title}" header`).toContain(`skybox · ${title}`);
  // …the first section is open, and a later one is folded.
  expect(shows(atRest, "timeOfDay")).toBe(true);
  expect(shows(atRest, "starfieldGain")).toBe(false);

  // FOLD the open Sky section: its ten rows push the later headers below
  // the panel's scroll limit, and closing is half of what a header does.
  await tapHeader(page, "skybox · Sky");
  const folded = await captions(page);
  expect(shows(folded, "timeOfDay"), "tapping Sky did not fold it").toBe(false);

  // Then OPEN Stars.
  await tapHeader(page, "skybox · Stars");
  const opened = await captions(page);
  expect(shows(opened, "starfieldGain"), "tapping Stars did not open it").toBe(
    true
  );

  // REMEMBERED: a re-render (deselect, reselect) keeps Stars open.
  await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.select(null);
    await new Promise((r) => setTimeout(r, 300));
    ed.select("sky");
    await new Promise((r) => setTimeout(r, 600));
  });
  expect(shows(await captions(page), "starfieldGain")).toBe(true);

  expect(realErrors(errors)).toEqual([]);
});
