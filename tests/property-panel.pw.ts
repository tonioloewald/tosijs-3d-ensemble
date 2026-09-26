import { test, expect } from "@playwright/test";
import { budget } from "./budget.js";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A SET STRING PROPERTY CAN BE EDITED, AND EDITING IT MOVES NOTHING ELSE.

  ⚠️ **Read what this does NOT cover before trusting it.** It drives the
  component API, not a physical keystroke — so it covers the WRITE path (the
  blocker: the editor skipped its own write whenever a box existed for a key,
  while the string branch could never bind one) and not the ROUTING path (the
  fields sat outside the panel's only `fieldGroup`, whose `attach()` makes the
  window key listener return early for everyone and routes the key to the
  GROUP's active field, so typing `123` into a colour committed `x: 1123` on
  the selected piece's position).

  Driving a real keystroke needs a pointer tap on the field's SVG to make it
  the group's active field. That now exists as `property-keystroke.pw.ts` and
  is the only test that covers routing; this one is kept because it isolates
  the WRITE path, so a failure in one of the two says which half broke.

  The position assertion below is the closest this level can get: it fails if
  an edit to a feature ever lands on the piece's transform.

  This is the end-to-end evidence two fixes were missing, and the review that
  found them said so: no test in this repo exercises the property panel, so
  neither the `boundKeys` fix nor the keyboard-group fix had anything watching
  the thing they claim to repair.

  Both failures were silent and neither was visible from a unit test:

  - the editor skipped its own write whenever a box EXISTED for a key, while
    the string branch could not bind one — so every already-set string and
    colour wrote nothing at all;
  - those fields sat outside the panel's only `fieldGroup`, whose `attach()`
    makes the window key listener return early for everyone and routes the key
    to the GROUP's active field — so typing `123` into a colour committed
    `x: 1123` on the selected piece's POSITION.

  Hence two assertions, and the second is the one that matters: the value the
  author typed lands where they typed it, and the piece has not moved.
*/
test("editing a SET string property reaches the document", async ({ page }) => {
  test.setTimeout(budget(120_000));
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

  const result = await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      load: (u: string) => Promise<void>;
      select: (id: string | null) => void;
      shadowRoot: ShadowRoot | null;
      ensemble?: { pieces?: Array<Record<string, unknown>> };
    };
    await ed.load("/ensembles/standard-scene.json");
    // `ground` is the piece whose `texture` the sample SETS — which is exactly
    // the case that wrote nothing, since unset fields worked once.
    ed.select("ground");
    await new Promise((r) => setTimeout(r, 400));

    const pieceOf = (id: string) =>
      ed.ensemble?.pieces?.find((p) => p.id === id) as
        | { at?: number[]; features?: { ground?: { texture?: string } } }
        | undefined;
    const before = pieceOf("ground");
    const beforeAt = [...(before?.at ?? [])];
    const beforeTexture = before?.features?.ground?.texture;

    // The component API for the same edit the field performs.
    (
      ed as unknown as {
        updateFeature: (
          id: string,
          feature: string,
          key: string,
          value: unknown,
          describe?: string,
          coalesce?: boolean
        ) => void;
      }
    ).updateFeature(
      "ground",
      "ground",
      "texture",
      "/other.svg",
      undefined,
      true
    );
    await new Promise((r) => setTimeout(r, 200));

    const after = pieceOf("ground");
    return {
      beforeTexture,
      afterTexture: after?.features?.ground?.texture,
      beforeAt,
      afterAt: [...(after?.at ?? [])],
    };
  });

  // The sample really does set it — otherwise this tests the easy case.
  expect(result.beforeTexture).toBe("/grid-10.svg");
  expect(result.afterTexture).toBe("/other.svg");
  // Nothing else moved.
  expect(result.afterAt).toEqual(result.beforeAt);
  expect(realErrors(errors)).toEqual([]);
});
