import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  INSERTING AN ENVIRONMENT PRIMITIVE, the way an author does it: the Insert
  tool, the "utilities" shelf, a pick, a click in the scene.

  Nothing had driven this in a browser. The owner, on the default scene: "I
  don't seem to be able to toggle on terrain". So this places a terrain and a
  cloud deck with real mouse clicks and asks the RENDERER whether they exist:
  a document piece, its element, and meshes drawn.
*/
type Ed = Element & {
  shadowRoot: ShadowRoot | null;
  ensemble: {
    pieces: Array<{ id: string; features?: Record<string, unknown> }>;
  };
  setTool(name: string): void;
  setToolOption(key: string, value: unknown): void;
};

test("terrain and a cloud deck can be inserted into the default scene", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
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
  const b3d = page.locator("tosi-ensemble-editor tosi-b3d").first();
  const box = (await b3d.boundingBox())!;
  // The middle of the view, a little low: the ground or sea, not the sky.
  const at = { x: box.x + box.width / 2, y: box.y + box.height * 0.65 };

  const insert = async (feature: string) => {
    const before = await page.evaluate(
      () =>
        (document.querySelector("tosi-ensemble-editor") as Ed).ensemble.pieces
          .length
    );
    await page.evaluate((feature) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      ed.setTool("insert");
      ed.setToolOption("library", "utilities");
      ed.setToolOption("mesh", undefined);
      ed.setToolOption("feature", feature);
    }, feature);
    await page.waitForTimeout(500);
    await page.mouse.click(at.x, at.y);
    await page.waitForTimeout(3000);
    return page.evaluate(
      ({ feature, before }) => {
        const ed = document.querySelector("tosi-ensemble-editor") as Ed;
        const pieces = ed.ensemble.pieces;
        const added = pieces.slice(before);
        const tag = {
          terrain: "tosi-b3d-terrain",
          cloudDeck: "tosi-b3d-cloud-deck",
        }[feature]!;
        const el = ed.shadowRoot!.querySelector(tag) as
          | (Element & { scene?: unknown })
          | null;
        const scene = (
          ed.shadowRoot!.querySelector("tosi-b3d") as unknown as {
            scene: {
              meshes: Array<{
                name: string;
                isVisible: boolean;
                isEnabled(): boolean;
                getTotalVertices(): number;
              }>;
            };
          }
        ).scene;
        return {
          added: added.map((p) => [p.id, Object.keys(p.features ?? {})]),
          element: !!el,
          tag,
          visibleMeshes: scene.meshes.filter(
            (m) => m.isVisible && m.isEnabled() && m.getTotalVertices() > 0
          ).length,
        };
      },
      { feature, before }
    );
  };

  const meshesBefore = await page.evaluate(
    () =>
      (
        (
          document.querySelector("tosi-ensemble-editor") as Ed
        ).shadowRoot!.querySelector("tosi-b3d") as unknown as {
          scene: {
            meshes: Array<{
              isVisible: boolean;
              isEnabled(): boolean;
              getTotalVertices(): number;
            }>;
          };
        }
      ).scene.meshes.filter(
        (m) => m.isVisible && m.isEnabled() && m.getTotalVertices() > 0
      ).length
  );
  const terrain = await insert("terrain");
  const deck = await insert("cloudDeck");
  console.log(JSON.stringify({ meshesBefore, terrain, deck }));

  expect(terrain.added, "clicking placed no terrain piece").toHaveLength(1);
  expect(terrain.element, "no <tosi-b3d-terrain> in the scene").toBe(true);
  expect(terrain.visibleMeshes).toBeGreaterThan(meshesBefore);
  expect(deck.added, "clicking placed no cloud deck piece").toHaveLength(1);
  expect(deck.element, "no cloud deck element in the scene").toBe(true);
  expect(realErrors(errors)).toEqual([]);
});
