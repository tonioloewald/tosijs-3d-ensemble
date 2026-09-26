import { test, expect } from "@playwright/test";
import { budget } from "./budget.js";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A REAL KEYSTROKE, ON A REAL FIELD — the half `property-panel.pw.ts` cannot
  reach, and the one that was broken.

  0.3.0 shipped two defects in this one interaction, and they failed in
  opposite directions:

  - the WRITE path: the editor skipped its own write whenever a box existed
    for a key, while the string branch could never bind one — so every
    already-set string and colour wrote nothing;
  - the ROUTING path: those fields sat outside the panel's only `fieldGroup`,
    whose `attach()` makes tosijs-3d's window key listener return early for
    EVERYONE and routes the key to the group's own active field. Typing `123`
    into a colour committed `x: 1123` on the selected piece's position.

  The component API covers the first and is blind to the second, which is why
  that test says so in its own doc comment rather than implying coverage. This
  one drives the actual sequence: tap the field so the group makes it active,
  then send keys through the window the way a keyboard does.

  DIGITS on purpose. If the routing regressed, they land in the position
  vector sitting directly above this field in the same panel — so the second
  assertion is not decoration, it is the exact corruption that shipped.
*/
test("typing into a SET string property edits it, and moves nothing", async ({
  page,
}) => {
  test.setTimeout(budget(120_000));
  /*
    A TALLER VIEWPORT, because the click has to land on the field.

    At Playwright's default 1280x720 the property panel renders BELOW the fold
    — the texture row's `getBoundingClientRect()` returns y = 765, and
    `document.elementFromPoint` at that point is `null`. A `page.mouse.click`
    there hits nothing at all, silently, and the test reads exactly like a
    field that refuses to accept input.
  */
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);

  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as
          | (Element & { shadowRoot: ShadowRoot })
          | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );

  // `ground` is the piece whose `texture` the shipped sample SETS — the case
  // that wrote nothing, since unset fields worked once and then died.
  const before = await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      load: (u: string) => Promise<void>;
      select: (id: string | null) => void;
      shadowRoot: ShadowRoot | null;
      ensemble?: { pieces?: Array<Record<string, unknown>> };
    };
    await ed.load("/ensembles/standard-scene.json");
    await new Promise((r) => setTimeout(r, 600));
    ed.select("ground");
    await new Promise((r) => setTimeout(r, 600));

    const piece = ed.ensemble?.pieces?.find((p) => p.id === "ground") as
      | { at?: number[]; features?: { ground?: { texture?: string } } }
      | undefined;

    // Locate the field by the value it is showing, and hand back page
    // coordinates — the click has to be a real one, through the browser, or
    // the group never makes it active.
    const node = Array.from(ed.shadowRoot?.querySelectorAll("text") ?? []).find(
      (t) => (t.textContent ?? "").includes("grid-10.svg")
    );
    const box = (
      node as SVGGraphicsElement | undefined
    )?.getBoundingClientRect();

    return {
      texture: piece?.features?.ground?.texture,
      at: [...(piece?.at ?? [])],
      box: box && { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    };
  });

  // The precondition IS the case under test: an UNSET field always worked.
  expect(before.texture).toBe("/grid-10.svg");
  expect(before.box).toBeTruthy();

  await page.mouse.click(before.box!.x, before.box!.y);
  await page.keyboard.type("99");
  await page.waitForTimeout(400);

  const after = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      ensemble?: { pieces?: Array<Record<string, unknown>> };
    };
    const piece = ed.ensemble?.pieces?.find((p) => p.id === "ground") as
      | { at?: number[]; features?: { ground?: { texture?: string } } }
      | undefined;
    return {
      texture: piece?.features?.ground?.texture,
      at: [...(piece?.at ?? [])],
    };
  });

  // THE WRITE REACHED THE DOCUMENT. Not "the field shows it" — the document.
  expect(after.texture).not.toBe(before.texture);
  // EXACTLY two more 9s. `toContain("9")` passed whether each key landed
  // once or twice — and on tosijs-3d 0.8.4 the rename field next door did
  // double every key (tosijs-3d#94), which only a count can see.
  const nines = (t?: string) => (t?.match(/9/g) ?? []).length;
  expect(nines(after.texture)).toBe(nines(before.texture) + 2);

  // AND IT WENT WHERE IT WAS TYPED. This is the assertion that fails if the
  // field ever leaves the keyboard group again: the digits land on `at[0]`.
  expect(after.at).toEqual(before.at);

  expect(realErrors(errors)).toEqual([]);
});
