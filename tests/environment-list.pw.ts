import { test, expect, type Page } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import {
  locate,
  reveal as revealLocated,
  type Located,
} from "./panel-locate.js";

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

/*
  THE CHROME IS IN THE SCENE (tosijs-3d system panels, flat-ui "scene"), so a
  row has no DOM box: `locate` derives where it is on screen (see
  panel-locate.ts, and tosijs-3d#113 for the proper hook). `circleX` is a
  row's leading state circle: the first column, 24 px wide, past the panel's
  8 px padding.
*/
/** How long a state may take to show after a click (see the first poll). */
const SETTLE = 60_000;

const withCircle = (b: Located | null) =>
  b && { ...b, circleX: b.panelX + 8 + 12 };
const textBox = async (page: Page, label: string) =>
  withCircle(await locate(page, label));

/** A subgroup heading ("⛰️ terrain"): the first <text> ending in ` word`. */
const revealIncluding = async (page: Page, word: string) =>
  withCircle(await revealLocated(page, ` ${word}`, "endsWith"));

/** The heading's add icon, found by its <title> ("add terrain"). */
const addIcon = (page: Page, feature: string) =>
  locate(page, `add ${feature}`, "exact", "title");

/** Scroll the row's panel until the row is inside it. */
const reveal = async (page: Page, label: string) =>
  withCircle(await revealLocated(page, label));

const pieces = (page: Page) =>
  page.evaluate(
    () => (document.querySelector("tosi-ensemble-editor") as Ed).ensemble.pieces
  );

test("environment features are listed, added from a heading, and toggled on and off", async ({
  page,
}) => {
  test.setTimeout(480_000);
  await page.setViewportSize({ width: 1400, height: 1300 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  /*
    THE DOC SITE'S TEST BUTTON SITS ON THE EDITOR. tosijs-ui's
    `button.test-widget` is fixed at the bottom left (23, 1254, 62 × 36 at
    this size), takes the pointer, and is right where the Scene list ends
    once it is long: a click on the new terrain's circle landed on it
    ("Running") 3 runs in 4 (2026-10-20, elementFromPoint). Hidden here;
    the overlap is filed upstream.
  */
  await page.addStyleTag({
    content: "button.test-widget { display: none !important; }",
  });
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
  await page.mouse.click(plus!.x + plus!.w / 2, plus!.y + plus!.h / 2);
  /*
    POLLED, never a fixed wait. In-scene panels take a press on a RENDERED
    frame, and headless software WebGL on a loaded machine has measured
    ~1 fps: a click landed 8-14 s later (2026-10-20), so a fixed 1.5 s read
    failed while the editor was working. Sampling THROUGH the interval
    waits as long as it takes, and still fails if the state never comes.
  */
  await expect
    .poll(async () => (await has("terrain")).length, {
      message: "the (+) added no terrain",
      timeout: SETTLE,
    })
    .toBe(1);
  const added = await has("terrain");
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
  await expect
    .poll(async () => (await has("terrain"))[0]!.enabled, {
      message: "the circle did not disable it",
      timeout: SETTLE,
    })
    .toBe(false);

  // 2. A one-per-scene row's circle is a TOGGLE, not a menu (owner: "I don't
  //    think we need the toggle to spawn a menu if more vertical also
  //    does"). Fog is absent: a tap turns it on, adding it.
  expect(await has("fog")).toHaveLength(0);
  // The fog's state as one word: absent, on or off.
  const fogState = async () => {
    const f = await has("fog");
    return f.length === 0 ? "absent" : f[0]!.enabled === false ? "off" : "on";
  };
  const tapCircle = async (row: string, expected: string, message: string) => {
    const r = await reveal(page, row);
    expect(r, `no '${row}' row`).toBeTruthy();
    await page.mouse.click(r!.circleX, r!.y + r!.h / 2);
    await expect.poll(fogState, { message, timeout: SETTLE }).toBe(expected);
  };
  await tapCircle("fog", "on", "tapping fog's circle did not turn it on");
  // Turning fog on selected it; its row is highlighted, still named "fog".
  await tapCircle("fog", "off", "the second tap did not turn fog off");
  await tapCircle("fog", "on", "the third tap did not turn fog back on");
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
  if (meshRowBefore)
    await expect
      .poll(async () => await textBox(page, aMesh!.id), {
        message: "the folded category still shows its rows",
        timeout: SETTLE,
      })
      .toBeNull();

  expect(realErrors(errors)).toEqual([]);
});
