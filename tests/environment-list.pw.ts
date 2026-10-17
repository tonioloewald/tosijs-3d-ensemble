import { test, expect, type Page } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  THE ENVIRONMENT LIST (owner, 2026-10-16): every environment feature is in
  the piece list whether or not the document has it, a one-per-scene one as a
  fixed row with a state circle (not included / disabled / enabled, picked
  from the circle's menu), a repeatable one as a subgroup with an inline add.
  Categories fold.

  Driven with real clicks on the rows and the menu, and asked of the DOCUMENT
  and the SCENE, not of the panel: "I don't seem to be able to toggle on
  terrain" was a list that rendered fine and offered nothing.
*/
type Piece = {
  id: string;
  enabled?: boolean;
  features?: Record<string, unknown>;
};
type Ed = Element & {
  shadowRoot: ShadowRoot;
  ensemble: { pieces: Piece[] };
};

/**
 * The on-screen box of the first <text> reading exactly `label`, with the box
 * of the panel it sits in (its outermost <svg>): a row scrolled out of its
 * panel still HAS a box, below the panel's clip, and a click there lands on
 * the scene. That is how the first run of this test failed.
 */
const textBox = (page: Page, label: string) =>
  page.evaluate((label) => {
    // The editor's own root: the circle opens no popup any more, and walking
    // every shadow root on the doc site is slow enough to time the test out.
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const t = Array.from(ed.shadowRoot.querySelectorAll("text")).find(
      (x) =>
        (x.textContent ?? "").trim() === label &&
        x.getBoundingClientRect().width > 0
    );
    if (!t) return null;
    let panel: Element = t;
    for (let el: Element | null = t; el; el = el.parentElement)
      if (el.tagName.toLowerCase() === "svg") panel = el;
    const b = t.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    return b.width > 0
      ? {
          x: b.x,
          y: b.y,
          w: b.width,
          h: b.height,
          inside: b.y >= p.y && b.y + b.height <= p.y + p.height,
          panel: { x: p.x + p.width / 2, y: p.y + p.height / 2 },
          // The state circle: the first column, 24 px wide, past the
          // panel's 8 px padding. Measured at x 28 against the name at 78.
          circleX: p.x + 8 + 12,
        }
      : null;
  }, label);

/** The first <text> whose content ENDS with `word` (a heading: "⛰️ terrain"). */
const revealIncluding = async (page: Page, word: string) => {
  const label = await page.evaluate((word) => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    return (
      Array.from(ed.shadowRoot.querySelectorAll("text"))
        .map((t) => (t.textContent ?? "").trim())
        .find((t) => t !== word && t.endsWith(` ${word}`)) ?? null
    );
  }, word);
  return label ? reveal(page, label) : null;
};

/** The heading's add icon, found by its <title> ("add terrain"). */
const addIcon = (page: Page, feature: string) =>
  page.evaluate((feature) => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const title = Array.from(ed.shadowRoot.querySelectorAll("title")).find(
      (t) => (t.textContent ?? "").trim() === `add ${feature}`
    );
    const b = title?.parentElement?.getBoundingClientRect();
    return b && b.width > 0
      ? { x: b.x + b.width / 2, y: b.y + b.height / 2 }
      : null;
  }, feature);

/** Scroll the row's panel until the row is inside it, as a person would. */
const reveal = async (page: Page, label: string) => {
  for (let i = 0; i < 40; i++) {
    const b = await textBox(page, label);
    if (process.env.DEBUG_REVEAL)
      console.log(
        new Date().toISOString().slice(14, 23),
        "reveal",
        label,
        JSON.stringify(b)
      );
    if (!b || b.inside) return b;
    await page.mouse.move(b.panel.x, b.panel.y);
    await page.mouse.wheel(0, b.y > b.panel.y ? 80 : -80);
    await page.waitForTimeout(120);
  }
  return textBox(page, label);
};

const pieces = (page: Page) =>
  page.evaluate(
    () => (document.querySelector("tosi-ensemble-editor") as Ed).ensemble.pieces
  );

test("environment features are listed, added from a heading, and toggled on and off", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1400, height: 1300 });
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
  const has = async (feature: string) =>
    (await pieces(page)).filter((p) => p.features?.[feature]);

  // 1. A subgroup's heading carries the add: its (+) puts a terrain in the
  //    document and the scene (owner: "can't we put a (+) button on the
  //    heading line?").
  expect(await has("terrain")).toHaveLength(0);
  const heading = await revealIncluding(page, "terrain");
  expect(heading, "no terrain subgroup heading").toBeTruthy();
  const plus = await addIcon(page, "terrain");
  expect(plus, "no add icon on the terrain heading").toBeTruthy();
  await page.mouse.click(plus!.x, plus!.y);
  await page.waitForTimeout(2000);
  const added = await has("terrain");
  expect(added, "the (+) added no terrain").toHaveLength(1);
  // Sea level at the insert height (owner: "WAY below sea level" otherwise).
  expect(added[0]!.features!.terrain).toEqual({ center: true });
  // ...and the list kept the new, selected row in view rather than
  // scrolling back to the top (owner, 2026-10-17).
  const row = await textBox(page, added[0]!.id);
  expect(row?.inside, "the new terrain's row is out of view").toBe(true);

  expect(
    await page.evaluate(
      () =>
        !!(
          document.querySelector("tosi-ensemble-editor") as Ed
        ).shadowRoot.querySelector("tosi-b3d-terrain")
    )
  ).toBe(true);

  /*
    Then OFF, through its circle: a repeatable's circle toggles too. It also
    keeps the rest of this test quick: headless Chromium draws WebGL in
    software, and a terrain standing above the sea made every later step
    take 15-25 s.
  */
  await page.mouse.click(row!.circleX, row!.y + row!.h / 2);
  await page.waitForTimeout(1500);
  expect(
    (await has("terrain"))[0]!.enabled,
    "the circle did not disable it"
  ).toBe(false);

  // 2. A one-per-scene row's circle is a TOGGLE, not a menu (owner: "I don't
  //    think we need the toggle to spawn a menu if more vertical also
  //    does"). Fog is absent: a tap turns it on, adding it.
  expect(await has("fog")).toHaveLength(0);
  const tapCircle = async (row: string) => {
    const r = await reveal(page, row);
    expect(r, `no '${row}' row`).toBeTruthy();
    await page.mouse.click(r!.circleX, r!.y + r!.h / 2);
    await page.waitForTimeout(1500);
  };
  await tapCircle("fog");
  let fogs = await has("fog");
  expect(fogs, "tapping fog's circle did not turn it on").toHaveLength(1);
  expect(fogs[0]!.enabled).not.toBe(false);
  // Turning fog on selected it; its row is highlighted, still named "fog".
  await tapCircle("fog");
  fogs = await has("fog");
  expect(fogs[0]!.enabled, "the second tap did not turn fog off").toBe(false);
  await tapCircle("fog");
  expect((await has("fog"))[0]!.enabled).not.toBe(false);
  // Off is never gone: a singleton is on or off (owner, 2026-10-17).
  expect(await has("fog")).toHaveLength(1);

  // 3. ...and the toggle opened no menu.
  expect(await textBox(page, "Disabled")).toBeNull();

  // 4. A category folds.
  const objects = await reveal(page, "objects");
  expect(objects, "no 'objects' category").toBeTruthy();
  const aMesh = (await pieces(page)).find(
    (p) => !p.features || !Object.keys(p.features).length
  );
  const meshRowBefore = aMesh ? await textBox(page, aMesh.id) : null;
  await page.mouse.click(
    objects!.x + objects!.w / 2,
    objects!.y + objects!.h / 2
  );
  await page.waitForTimeout(800);
  if (meshRowBefore) expect(await textBox(page, aMesh!.id)).toBeNull();

  expect(realErrors(errors)).toEqual([]);
});
