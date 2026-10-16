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
type Piece = { id: string; enabled?: boolean; features?: Record<string, unknown> };
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
    // Every root, not just the editor's: the state menu is a POPUP, drawn
    // in a layer of its own outside the editor's shadow root.
    const all: Element[] = [];
    const walk = (root: Document | ShadowRoot) => {
      all.push(...Array.from(root.querySelectorAll("text")));
      for (const el of Array.from(root.querySelectorAll("*")))
        if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(document);
    const t = all.find(
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

/** Scroll the row's panel until the row is inside it, as a person would. */
const reveal = async (page: Page, label: string) => {
  for (let i = 0; i < 40; i++) {
    const b = await textBox(page, label);
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

test("environment features are listed, included, disabled and removed from the list", async ({
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

  // 1. An inline add: "add terrain" puts a terrain in the document and scene.
  expect(await has("terrain")).toHaveLength(0);
  const add = await reveal(page, "add terrain");
  expect(add, "no inline 'add terrain' row").toBeTruthy();
  await page.mouse.click(add!.x + add!.w / 2, add!.y + add!.h / 2);
  await page.waitForTimeout(2000);
  const terrains = await has("terrain");
  expect(terrains, "the add row added no terrain").toHaveLength(1);
  expect(
    await page.evaluate(
      () =>
        !!(document.querySelector("tosi-ensemble-editor") as Ed).shadowRoot.querySelector(
          "tosi-b3d-terrain"
        )
    )
  ).toBe(true);

  // 2. A fixed row's circle: fog, not in the document, included DISABLED.
  expect(await has("fog")).toHaveLength(0);
  const fog = await reveal(page, "fog");
  expect(fog, "no fixed 'fog' row").toBeTruthy();
  // The circle is the row's first column, left of the kind icon.
  await page.mouse.click(fog!.circleX, fog!.y + fog!.h / 2);
  await page.waitForTimeout(600);
  const disabled = await textBox(page, "Disabled");
  expect(disabled, "the circle opened no state menu").toBeTruthy();
  await page.mouse.click(disabled!.x + disabled!.w / 2, disabled!.y + disabled!.h / 2);
  await page.waitForTimeout(1500);
  const fogs = await has("fog");
  expect(fogs).toHaveLength(1);
  expect(fogs[0]!.enabled).toBe(false);

  // 3. Same circle: Enabled, then Not included.
  const pick = async (row: string, item: string) => {
    const r = await reveal(page, row);
    expect(r, `no '${row}' row`).toBeTruthy();
    await page.mouse.click(r!.circleX, r!.y + r!.h / 2);
    await page.waitForTimeout(600);
    const m = await textBox(page, item);
    expect(m, `no '${item}' in the state menu`).toBeTruthy();
    await page.mouse.click(m!.x + m!.w / 2, m!.y + m!.h / 2);
    await page.waitForTimeout(1500);
  };
  // Including it SELECTED it, and the list marks the selected row with ▸
  // (the table has no selection of its own); plain "fog" is now the
  // properties panel's title, not the row.
  await pick(`▸ ${fogs[0]!.id}`, "Enabled");
  expect((await has("fog"))[0]!.enabled).not.toBe(false);
  await pick(`▸ ${fogs[0]!.id}`, "Not included");
  expect(await has("fog")).toHaveLength(0);
  // ...and the fixed row is still there, to include it again.
  expect(await textBox(page, "fog")).toBeTruthy();

  // 4. A category folds.
  const objects = await reveal(page, "objects");
  expect(objects, "no 'objects' category").toBeTruthy();
  const aMesh = (await pieces(page)).find((p) => !p.features || !Object.keys(p.features).length);
  const meshRowBefore = aMesh ? await textBox(page, aMesh.id) : null;
  await page.mouse.click(objects!.x + objects!.w / 2, objects!.y + objects!.h / 2);
  await page.waitForTimeout(800);
  if (meshRowBefore) expect(await textBox(page, aMesh!.id)).toBeNull();

  expect(realErrors(errors)).toEqual([]);
});
