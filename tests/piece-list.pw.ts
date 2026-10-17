import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  THE PIECE LIST'S FILTER, AND THE CLAIM IT WAS SHIPPED ON.

  The filter reaches the LIVE tables through `setFilter` rather than
  re-rendering the panel, and that is the whole reason the feature had to be
  built upstream (tosijs-3d#67, ours): re-rendering would discard the scroll
  position, the selection and the focus index the table owns — and the filter
  field itself, mid-word.

  The changelog states the consequence as a measurement: *filtering out the
  selected `flagship` left it selected, and it came back when the filter
  cleared.* That was measured by hand once, in a browser, and then nothing
  watched it. Hiding is a VIEW state, and the only way to know it stayed one
  is to hide the selected row and ask the document whether it noticed.

  ⚠️ 1400x1100, for the reason `property-keystroke.pw.ts` records: at the
  default viewport the panels render below the fold and a click lands on
  nothing at all, silently.
*/
test("filtering hides rows without touching the selection", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);

  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => {
      const ed = document.querySelector("tosi-ensemble-editor") as
        | (Element & { ensemble?: { pieces?: unknown[] } })
        | null;
      return (ed?.ensemble?.pieces?.length ?? 0) > 10;
    },
    null,
    { timeout: 60_000 }
  );

  /** Which piece ids the list is currently SHOWING, and what is selected. */
  const view = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        shadowRoot: ShadowRoot | null;
        selection?: { id?: string } | null;
        ensemble?: { pieces?: Array<{ id: string }> };
      };
      const ids = new Set((ed.ensemble?.pieces ?? []).map((p) => p.id));
      /*
        SCOPED TO THE PIECE-LIST PANEL, not the whole shadow root. The
        property panel puts the SELECTED piece's name on screen too, so a
        blanket scrape reported `flagship` as "still shown" when the list had
        correctly hidden it — the probe reading the answer off the wrong
        panel, which is the same shape as the very first scene test measuring
        the wrong document.
      */
      const field = Array.from(
        ed.shadowRoot?.querySelectorAll("text") ?? []
      ).find((t) => (t.textContent ?? "").includes("filter"));
      let panel: Element | null = field ?? null;
      for (let i = 0; i < 4 && panel?.parentElement; i++)
        panel = panel.parentElement;
      const shown = Array.from(panel?.querySelectorAll("text") ?? [])
        .map((t) => (t.textContent ?? "").trim())
        .filter((t) => ids.has(t));
      return { shown, selected: ed.selection?.id ?? null };
    });

  const box = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot | null;
      select: (id: string) => void;
    };
    ed.select("flagship");
    const node = Array.from(ed.shadowRoot?.querySelectorAll("text") ?? []).find(
      (t) => (t.textContent ?? "").includes("filter")
    );
    const r = (node as SVGGraphicsElement | undefined)?.getBoundingClientRect();
    return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  expect(box, "no filter field on screen").toBeTruthy();

  const before = await view();
  expect(before.selected).toBe("flagship");
  expect(before.shown).toContain("flagship");

  // Type a filter that CANNOT match the selected row.
  await page.mouse.click(box!.x, box!.y);
  await page.keyboard.type("palm");
  await page.waitForTimeout(600);

  const filtered = await view();
  expect(filtered.shown.length, "the filter narrowed nothing").toBeLessThan(
    before.shown.length
  );
  expect(filtered.shown, "the filtered-out row is still drawn").not.toContain(
    "flagship"
  );
  /*
    THE POINT. The row is gone from the view and the DOCUMENT still has it
    selected — which is what "hiding is a view state" means, and what a
    re-render would have destroyed.
  */
  expect(filtered.selected, "filtering changed the selection").toBe("flagship");

  // Clear it, one key at a time — same field, same route.
  for (let i = 0; i < 4; i++) await page.keyboard.press("Backspace");
  await page.waitForTimeout(600);

  const cleared = await view();
  expect(cleared.shown, "the row did not come back").toContain("flagship");
  expect(cleared.selected).toBe("flagship");

  expect(realErrors(errors)).toEqual([]);
});

/*
  RENAMING A PIECE, through the field a reader would use.

  This was `fixme` for a day and a half with a doc comment cataloguing five
  eliminated causes, because typing into the id field changed nothing and every
  obvious explanation was wrong: the click landed, `renamePiece` called
  directly worked, the `row3d` wrapper was innocent, and the property panel next
  door accepted keystrokes fine.

  The cause was ORDER. `fieldGroup` iterates `config.fields` ONCE at
  construction to wrap each field's focus callback, and that wrapper is how a
  tap tells the group which field to make active. `_renderProperties` built the
  group and THEN built the panel that creates the id field, so the field was
  never wrapped: tapping it reported to nobody, `active` never changed, and the
  group's window listener — which returns early for every field, in or out —
  swallowed the key. Not misrouted. Gone. Filed as tosijs-3d#82.

  ⚠️ **The fix shipped and this test stayed skipped**, with TODO.md claiming it
  was covered here. It was not: a `fixme` asserts nothing, and a fixed bug
  behind one is indistinguishable from a broken one. Un-skipping it found the
  assertion had its own bug — see below.

  ⚠️ The character lands at the CARET, which is where the click was, and the
  click is the middle of the text. So typing `X` into `flagship` gives
  `flagXship`, not `flagshipX`. The original assertion asked for an id that
  still `includes('flagship')`, which no successful rename can satisfy — so it
  would have failed on the day the fix landed too, for the opposite reason.
  Assert the rename HAPPENED, not where the letter went.
*/
test("the id field renames the piece in the document", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);

  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => {
      const ed = document.querySelector("tosi-ensemble-editor") as
        | (Element & { ensemble?: { pieces?: unknown[] } })
        | null;
      return (ed?.ensemble?.pieces?.length ?? 0) > 10;
    },
    null,
    { timeout: 60_000 }
  );

  const box = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot | null;
      select: (id: string) => void;
    };
    ed.select("flagship");
    /*
      The id field shows the piece's id — and so does its row in the list, on
      the LEFT. Taking the first match clicked the ROW instead, which merely
      re-selected the piece and sent the keystroke nowhere. The properties
      panel is the right-hand column, so pick the rightmost.
    */
    const rects = Array.from(ed.shadowRoot?.querySelectorAll("text") ?? [])
      .filter((t) => (t.textContent ?? "").trim() === "flagship")
      .map((t) => (t as SVGGraphicsElement).getBoundingClientRect())
      .sort((a, b) => b.x - a.x);
    const r = rects[0];
    return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  expect(box, "no id field on screen").toBeTruthy();

  await page.mouse.click(box!.x, box!.y);
  /*
    TWO characters, typed at Playwright's speed — faster than a person. On
    tosijs-3d 0.8.4 one `X` became `XX` (the key delivered twice across a
    mid-event re-render). `XY` would show a dropped key as well as a doubled
    one. Falsified: with the rename synchronous again this reads
    `flagXXYship`.
  */
  await page.keyboard.type("XY");
  await page.waitForTimeout(800);

  const ids = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      ensemble?: { pieces?: Array<{ id: string }> };
    };
    return (ed.ensemble?.pieces ?? []).map((p) => p.id);
  });

  // THE DOCUMENT CHANGED, which is the only claim worth making here.
  // `flagship` is gone and something that was clearly it is in its place.
  expect(ids).not.toContain("flagship");
  expect(ids.filter((id) => id.includes("flag") && id.includes("X"))).toEqual([
    "flagXYship",
  ]);
  expect(realErrors(errors)).toEqual([]);
});
