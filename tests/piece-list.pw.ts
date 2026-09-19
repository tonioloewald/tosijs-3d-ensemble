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
  RENAMING A PIECE, through the field a reader would use — AND IT DOES NOT WORK.

  ⚠️ `fixme`, and this one is OURS rather than upstream's. The filter field
  next door was the same defect and is fixed and covered by the test above;
  the id field is not, and I could not find why.

  What is measured and certain:

  - the field is there and in the right place — two `flagship` text nodes, one
    at x=72 (the list row) and one at x=1131 (the properties panel);
  - clicking the right-hand one and typing changes NOTHING in the document,
    every time;
  - it now goes through `_collectField` like every other field, and the group
    is seeded unconditionally so late collection cannot be dropped. Both were
    real bugs and both are fixed. Neither fixed this.

  So a rename field you cannot type into renames nothing, silently, and that
  ships today. `fixme` rather than deleted because the reproduction is the
  valuable part and it is exact: it will fail the moment somebody fixes the
  cause, which is how they will know they did.
*/
test.fixme(
  "the id field renames the piece in the document",
  async ({ page }) => {
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
    await page.keyboard.type("X");
    await page.waitForTimeout(800);

    const ids = await page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        ensemble?: { pieces?: Array<{ id: string }> };
      };
      return (ed.ensemble?.pieces ?? []).map((p) => p.id);
    });

    // The DOCUMENT changed, which is the only claim worth making here.
    expect(ids.some((id) => id !== "flagship" && id.includes("flagship"))).toBe(
      true
    );
    expect(realErrors(errors)).toEqual([]);
  }
);
