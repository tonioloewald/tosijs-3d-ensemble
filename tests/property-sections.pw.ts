import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

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

/** The visible captions in the editor's chrome. */
const captions = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    return Array.from(ed.shadowRoot?.querySelectorAll("text") ?? [])
      .filter((t) => {
        const b = (t as SVGGraphicsElement).getBoundingClientRect();
        return (
          b.width > 0 &&
          getComputedStyle(t as unknown as Element).display !== "none"
        );
      })
      .map((t) => (t.textContent ?? "").trim());
  });

/** A caption starting with `name` — captions carry units: `timeOfDay (h)`. */
const shows = (list: string[], name: string) =>
  list.some((c) => c === name || c.startsWith(`${name} `));

test("the sky's sections fold, open on a tap, and stay open", async ({
  page,
}) => {
  test.setTimeout(120_000);
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
  for (const title of ["Time", "Air", "Sun & moon", "Stars", "Space"])
    expect(atRest, `no "${title}" header`).toContain(`skybox · ${title}`);
  // …the first section is open, and a later one is folded.
  expect(shows(atRest, "timeOfDay")).toBe(true);
  expect(shows(atRest, "starfieldGain")).toBe(false);

  // Tap the Stars header, by its caption's on-screen box.
  const header = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const t = Array.from(ed.shadowRoot?.querySelectorAll("text") ?? []).find(
      (x) => (x.textContent ?? "").trim() === "skybox · Stars"
    );
    const b = (t as SVGGraphicsElement | undefined)?.getBoundingClientRect();
    return b && { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });
  expect(header, "no Stars header on screen").toBeTruthy();
  await page.mouse.click(header!.x, header!.y);
  await page.waitForTimeout(600);

  const opened = await captions(page);
  expect(shows(opened, "starfieldGain"), "tapping Stars did not open it").toBe(
    true
  );
  // Opening one section does not fold another.
  expect(shows(opened, "timeOfDay")).toBe(true);

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
