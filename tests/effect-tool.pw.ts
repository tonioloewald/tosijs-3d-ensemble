import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { reveal } from "./panel-locate.js";

/*
  EDITING AN EFFECT IN PLACE (tosijs-3d#122, ours). On an effect piece,
  "Edit effect ✨" (a real click) mounts tosijs-3d's effect tool in the
  editor's own scene:
  - its panel is up and it plays (live particles), while the piece's own
    effect is set aside (no <tosi-b3d-effect> left);
  - a `commit` from the tool writes the recipe into the document as one
    undo step (the tool's own commit emission is tosijs-3d's, tested there;
    this drives the event the editor listens for);
  - "Done editing effect" unmounts it: the camera is back where it was and
    the piece's own effect plays, now with the recipe.
*/
type Ed = Element & {
  shadowRoot: ShadowRoot;
  ensemble: {
    pieces: Array<{
      id: string;
      features?: Record<string, Record<string, unknown>>;
    }>;
  };
  editingEffect: string | null;
  select(id: string): void;
  canUndo(): boolean;
  undo(): void;
  _effectTool: { handle: EventTarget & { api: { recipe: unknown } } } | null;
};

test("Edit effect mounts the tool in place, commits into the document, and closes cleanly", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.addStyleTag({
    content: "button.test-widget { display: none !important; }",
  });
  await page.waitForFunction(
    () =>
      (
        document.querySelector("tosi-ensemble-editor") as Element & {
          ensemble?: { name?: string };
        }
      )?.ensemble?.name === "pirate-cove",
    null,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1500);

  const state = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      const b3d = ed.shadowRoot.querySelector(
        "tosi-b3d"
      ) as unknown as Element & {
        scene: {
          activeCamera: { alpha: number; beta: number; radius: number };
          particleSystems: Array<{ getActiveCount(): number }>;
        };
      };
      const cam = b3d.scene.activeCamera;
      return {
        editing: ed.editingEffect,
        pieceEffects: b3d.querySelectorAll("tosi-b3d-effect").length,
        alive: b3d.scene.particleSystems.reduce(
          (n, p) => n + p.getActiveCount(),
          0
        ),
        camera: [cam.alpha, cam.beta, cam.radius].map(
          (v) => Math.round(v * 1000) / 1000
        ),
        recipe: !!ed.ensemble.pieces.find((p) => p.id === "vent")?.features
          ?.effect?.recipe,
      };
    });

  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    (ed as unknown as { ensemble: unknown }).ensemble = {
      name: "vent-test",
      pieces: [
        { id: "sun", at: [-0.6, 0.5, -0.3], features: { sun: {} } },
        {
          id: "vent",
          at: [0, 0, 0],
          features: { effect: { preset: "geyser" } },
        },
      ],
    };
    ed.select("vent");
  });
  await expect
    .poll(async () => (await state()).pieceEffects, { timeout: 30_000 })
    .toBe(1);
  const before = await state();

  // Open, with a real click.
  const open = await reveal(page, "Edit effect ✨");
  expect(open, "no Edit effect button").toBeTruthy();
  await page.mouse.click(open!.x + open!.w / 2, open!.y + open!.h / 2);
  await expect
    .poll(async () => (await state()).editing, { timeout: 30_000 })
    .toBe("vent");
  await expect
    .poll(async () => (await state()).alive, {
      message: "the hosted tool plays nothing",
      timeout: 30_000,
    })
    .toBeGreaterThan(0);
  expect(
    (await state()).pieceEffects,
    "the piece's own effect still plays beside the tool"
  ).toBe(0);
  expect(
    await page.evaluate(() =>
      Array.from(
        (
          document.querySelector("tosi-ensemble-editor") as Ed
        ).shadowRoot.querySelectorAll("tosi-b3d-panel")
      ).some((p) => (p as HTMLElement).title === "Effect")
    ),
    "no Effect panel"
  ).toBe(true);

  // A commit from the tool lands in the document, as one undo step.
  const committed = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const handle = ed._effectTool!.handle;
    const recipe = structuredClone(handle.api.recipe) as { name?: string };
    recipe.name = "my geyser";
    handle.dispatchEvent(new CustomEvent("commit", { detail: { recipe } }));
    const saved = ed.ensemble.pieces.find((p) => p.id === "vent")!.features!
      .effect!.recipe as { name?: string } | undefined;
    return { name: saved?.name, undo: ed.canUndo() };
  });
  expect(committed).toEqual({ name: "my geyser", undo: true });
  expect(
    (await state()).pieceEffects,
    "a commit brought the piece's effect back beside the tool"
  ).toBe(0);

  // Done: unmounted, camera back, the piece's own effect plays the recipe.
  const done = await reveal(page, "Done editing effect");
  expect(done, "no Done button").toBeTruthy();
  await page.mouse.click(done!.x + done!.w / 2, done!.y + done!.h / 2);
  await expect
    .poll(async () => (await state()).editing, { timeout: 30_000 })
    .toBeNull();
  const after = await state();
  expect(after.camera, "the camera was not put back").toEqual(before.camera);
  expect(after.pieceEffects).toBe(1);
  expect(after.recipe).toBe(true);
  expect(realErrors(errors)).toEqual([]);
});
