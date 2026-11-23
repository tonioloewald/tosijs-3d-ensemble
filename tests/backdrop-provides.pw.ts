import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A CONSUMER'S FLOOR REPLACES THE BACKDROP'S GRID (board #4210).

  The editor's backdrop lays a grid ground at y 0 unless the ensemble has a
  floor of its own, and "a floor" used to mean a feature NAMED `ground` or
  `terrain`. pod-3d's tiled floor is neither, so the grid lay coincident with
  it and covered it. A feature now says `provides: ["ground"]`.

  Asked of the scene, not the set: the backdrop's ground is a
  `tosi-b3d-ground` element in the editor's shadow root, and the document
  here has no ground of its own, so any such element is the backdrop's.
*/
type Ed = Element & {
  shadowRoot: ShadowRoot | null;
  ensemble: unknown;
};

test("a feature that provides ground removes the backdrop's grid", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d-destroyable"),
    { timeout: 60_000 }
  );
  // Let the page's own `src` load land first, so it cannot overtake ours.
  await page.waitForTimeout(2000);

  const grounds = (features: Record<string, unknown>) =>
    page.evaluate(async (features) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      ed.ensemble = {
        name: "floor-test",
        version: 1,
        pieces: [{ id: "floor", at: [0, 0, 0], features }],
      };
      await new Promise((r) => setTimeout(r, 1500));
      return ed.shadowRoot!.querySelectorAll("tosi-b3d-ground").length;
    }, features);

  await page.evaluate(() => {
    const doc = document.querySelector("tosi-doc-system") as unknown as {
      context: Record<string, Record<string, (reg: unknown) => void>>;
    };
    const { registerFeature } = doc.context["tosijs-3d-ensemble"];
    // Two features with no body: one says it is a floor, one says nothing.
    registerFeature({
      name: "podFloor",
      schema: { type: "object", "x-accepts": "*" },
      primitive: true,
      provides: ["ground"],
    });
    registerFeature({
      name: "podProp",
      schema: { type: "object", "x-accepts": "*" },
      primitive: true,
    });
  });

  // A control first: a feature that provides nothing leaves the grid.
  expect(await grounds({ podProp: {} })).toBe(1);
  expect(await grounds({ podFloor: {} })).toBe(0);
  // And the grid comes back when the floor goes.
  expect(await grounds({ podProp: {} })).toBe(1);

  expect(realErrors(errors)).toEqual([]);
});
