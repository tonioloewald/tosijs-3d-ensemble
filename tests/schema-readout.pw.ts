import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  THE READOUT AN AUTHOR ACTUALLY SEES — tosijs-3d's `x-unit` and
  `x-wavelength`, on a real slider, on screen.

  `src/editor/schema-panel.test.ts` pins the STRING `numberReadout` builds. It
  cannot see whether that function is wired to anything: delete the `format:`
  line from the slider and every one of those tests still passes. And it is a
  `format` callback on a widget whose default `showValue` is `'peek'`, so the
  string is only on screen while a pointer is over the control — there is no
  rest state to scrape, and the node carrying it is `display: none` until then.
  Confirmed non-vacuous the only way that counts: with the `format:` line
  removed this fails. What it reports then is worth knowing — the peek still
  happens, showing a bare `0.015`, which carries no unit and so falls out of
  the filter entirely, leaving the neighbouring caption as the whole received
  string. "The hover did nothing" and "the hover worked and the unit is
  missing" looked identical; reading only the hovered slider's own visible
  text, below, is what tells them apart.

  `terrain.grossScale` is the field the whole annotation exists for — a number
  called a scale that gets SMALLER as the hills get BIGGER. Owner, filing it
  upstream: *"it's not at all obvious when a scale is actually a frequency and
  where the useful values are."*

  ⚠️ **HOVER THE TRACK, NOT THE CAPTION.** The slider's transparent hit rect is
  the full 290x42 row, so pointing anywhere in it looks like it should work —
  and pointing at the caption does nothing at all, because the `<text>` paints
  over the rect and becomes the event target itself. Forty minutes went to a
  hover that landed inside the advertised hit area and produced no peek, no
  error and no value change. Filed as tosijs-3d#84; until it lands, the track
  is found by geometry here rather than by a magic offset, so it survives the
  panel being laid out differently.

  ⚠️ 1400x1100, for the reason `property-keystroke.pw.ts` records: at the
  default viewport the property panel renders below the fold and a pointer
  event lands on nothing at all, silently.
*/
test("a frequency slider shows its unit and its wavelength", async ({
  page,
}) => {
  test.setTimeout(120_000);
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

  const found = await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      load: (u: string) => Promise<void>;
      select: (id: string | null) => void;
      shadowRoot: ShadowRoot | null;
    };
    // The only shipped sample that carries a terrain, and so the only one
    // with a field annotated as a frequency.
    await ed.load("/ensembles/terrain-test.json");
    await new Promise((r) => setTimeout(r, 800));
    ed.select("land");
    await new Promise((r) => setTimeout(r, 800));

    // Find the slider by its CAPTION — which is what is on screen at rest,
    // the value being the thing this test is here to make appear.
    const caption = Array.from(
      ed.shadowRoot?.querySelectorAll("text") ?? []
    ).find((t) => (t.textContent ?? "").startsWith("Gross scale"));
    let group: Element | null = caption ?? null;
    while (group && group.getAttribute?.("data-w3d") !== "slider")
      group = group.parentElement;
    group?.setAttribute("data-probe", "gross-scale");

    // The TRACK: the 6px-high bar. Its centre is over the hit rect and clear
    // of the caption text, which is the combination that actually peeks.
    const track = Array.from(group?.querySelectorAll("rect") ?? [])
      .map((r) => r.getBoundingClientRect())
      .filter((b) => b.height > 0 && b.height < 12 && b.width > 20)
      .sort((a, b) => b.width - a.width)[0];

    return {
      rest: caption?.textContent ?? null,
      track: track && {
        x: track.x + track.width / 2,
        y: track.y + track.height / 2,
      },
    };
  });

  expect(found.track, "no Gross scale track on screen").toBeTruthy();
  // The caption at rest. If this ever reads as the value instead, `showValue`
  // changed and the assertion below is measuring something else.
  expect(found.rest).toContain("Gross scale");

  await page.mouse.move(found.track!.x, found.track!.y);
  await page.waitForTimeout(400);

  /*
    VISIBLE, not merely present, and read from THIS slider only. The readout
    node exists at all times and is `display: none` until the pointer
    arrives, so a plain scrape would pass without ever peeking.

    ⚠️ This used to also assert the CAPTION disappeared, "which is what peek
    means". It stopped meaning that in tosijs-3d 0.8.3 — `peek` now toggles
    the value text and leaves the caption alone — and the test went red on
    the upgrade for a widget behaviour we do not own. What it was really for
    is telling "the hover did nothing" (no readout at all) from "the hover
    worked and the unit is missing" (a bare `0.015`), and reading every
    visible string in the one slider says both without depending on layout.
  */
  const visible = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot | null;
    };
    const group = ed.shadowRoot?.querySelector('[data-probe="gross-scale"]');
    return Array.from(group?.querySelectorAll("text") ?? [])
      .filter(
        (t) => getComputedStyle(t as unknown as Element).display !== "none"
      )
      .map((t) => (t.textContent ?? "").trim());
  });

  /*
    THE CLAIM. `0.015 1/m ≈66.7 m` — the value, its unit, and the number a
    person thinks in. Not "a format function was passed": the digits, on the
    screen, in the document's own units.
  */
  expect(visible.join(" | ")).toContain("0.015 1/m ≈66.7 m");

  expect(realErrors(errors)).toEqual([]);
});
