import { test, expect } from "@playwright/test";
import { EFFECT_PRESETS } from "tosijs-3d/effect-presets";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { allPanelTexts, reveal } from "./panel-locate.js";

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
      // Software WebGL on a loaded machine runs at ~1 fps (2026-10-20).
      timeout: 60_000,
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
    // What the real tool holds when it commits: its own working recipe.
    handle.api.recipe = recipe;
    handle.dispatchEvent(new CustomEvent("commit", { detail: { recipe } }));
    const saved = ed.ensemble.pieces.find((p) => p.id === "vent")!.features!
      .effect!.recipe as { name?: string } | undefined;
    return { name: saved?.name, undo: ed.canUndo() };
  });
  expect(committed).toEqual({ name: "my geyser", undo: true });

  // 0.8.1 review major: UNDO the first commit with the tool open. The
  // document goes back to the preset, so the TOOL must too; it kept the
  // undone recipe, and the next commit wrote it back.
  const undone = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.undo();
    const cfg = ed.ensemble.pieces.find((p) => p.id === "vent")!.features!
      .effect!;
    return {
      docRecipe: cfg.recipe ?? null,
      tool: JSON.stringify(ed._effectTool!.handle.api.recipe),
    };
  });
  expect(undone.docRecipe).toBeNull();
  // The tool hands back a NORMALISED copy, so compare what identifies it.
  expect(JSON.parse(undone.tool).name).toBe(EFFECT_PRESETS.geyser!.name);
  expect(JSON.parse(undone.tool).layers.length).toBe(
    EFFECT_PRESETS.geyser!.layers.length
  );
  // And a PRESET changed with the tool open is what the tool plays.
  const switched = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      edit(
        d: string,
        m: (e: {
          pieces: Array<{
            id: string;
            features?: Record<string, Record<string, unknown>>;
          }>;
        }) => void
      ): void;
    };
    ed.edit("preset", (e) => {
      e.pieces.find((p) => p.id === "vent")!.features!.effect!.preset =
        "sparks";
    });
    return JSON.stringify(ed._effectTool!.handle.api.recipe);
  });
  expect(JSON.parse(switched).name).toBe(EFFECT_PRESETS.sparks!.name);
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
  // The commit was undone and the preset switched: the document says sparks.
  expect(after.recipe).toBe(false);
  expect(
    await page.evaluate(
      () =>
        (
          document.querySelector("tosi-ensemble-editor") as Ed
        ).ensemble.pieces.find((p) => p.id === "vent")!.features!.effect!.preset
    )
  ).toBe("sparks");
  expect(realErrors(errors)).toEqual([]);
});

/*
  OPENING ANOTHER DOCUMENT WITH THE TOOL OPEN REBUILDS ONCE (#3438, 0.8.1
  review): closing the tool rebuilt, and then the new document rebuilt again.
*/
test("a new document with the effect tool open closes it and rebuilds once", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
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
  const r = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      editEffect(id: string): boolean;
      rebuild(o?: unknown): void;
    };
    (ed as unknown as { ensemble: unknown }).ensemble = {
      name: "vent-test",
      pieces: [
        {
          id: "vent",
          at: [0, 0, 0],
          features: { effect: { preset: "geyser" } },
        },
      ],
    };
    const opened = ed.editEffect("vent");
    let rebuilds = 0;
    const real = ed.rebuild.bind(ed);
    ed.rebuild = (o?: unknown) => {
      rebuilds++;
      real(o);
    };
    (ed as unknown as { ensemble: unknown }).ensemble = {
      name: "other",
      pieces: [],
    };
    ed.rebuild = real;
    return { opened, rebuilds, editing: ed.editingEffect };
  });
  expect(r).toEqual({ opened: true, rebuilds: 1, editing: null });
});

/*
  THE TOOL FOLLOWS ITS PIECE, AND ITS FIELDS DO WHAT THEY SAY (#3437, 0.8.1
  review). With the tool open, a moved piece left the effect playing where
  it was, and `activity`, `scale` and `ground` edits reached only the
  set-aside element: controls that did nothing. Now the tool's node follows,
  `activity` reaches its player, and the rest show as values.
*/
test("with the effect tool open, the piece's move and activity reach it; scale is read-only", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
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
  type Tool = {
    node: { position: { x: number; y: number; z: number } };
    handle: { api: { player: { activity: number } | null } };
  };
  const opened = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      editEffect(id: string): boolean;
    };
    (ed as unknown as { ensemble: unknown }).ensemble = {
      name: "vent-test",
      pieces: [
        {
          id: "vent",
          at: [0, 0, 0],
          features: { effect: { preset: "geyser", scale: 2 } },
        },
      ],
    };
    ed.select("vent");
    return ed.editEffect("vent");
  });
  expect(opened).toBe(true);
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            !!(
              document.querySelector("tosi-ensemble-editor") as unknown as {
                _effectTool: Tool;
              }
            )._effectTool.handle.api.player
        ),
      { timeout: 60_000 }
    )
    .toBe(true);

  const after = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      update(id: string, patch: Record<string, unknown>): void;
      updateFeature(id: string, f: string, k: string, v: unknown): void;
    };
    ed.update("vent", { at: [4, 0, -3] });
    ed.updateFeature("vent", "effect", "activity", 0.25);
    return ed.editingEffect;
  });
  expect(after).toBe("vent");
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            (
              document.querySelector("tosi-ensemble-editor") as unknown as {
                _effectTool: Tool;
              }
            )._effectTool.handle.api.player!.activity
        ),
      { message: "activity never reached the tool", timeout: 10_000 }
    )
    .toBe(0.25);
  // A new preset hands the tool a new recipe, whose player starts at the
  // recipe's own activity; the document's still wins (0.9.0 review).
  const before = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      updateFeature(id: string, f: string, k: string, v: unknown): void;
      _effectTool: { synced?: string };
    };
    const synced = ed._effectTool.synced;
    ed.updateFeature("vent", "effect", "preset", "volcano");
    return synced;
  });
  await expect
    .poll(
      () =>
        page.evaluate((before) => {
          const t = (
            document.querySelector("tosi-ensemble-editor") as unknown as {
              _effectTool: Tool & { synced?: string };
            }
          )._effectTool;
          return t.synced === before
            ? "not swapped"
            : t.handle.api.player!.activity;
        }, before),
      { message: "a preset change reset the tool's activity", timeout: 10_000 }
    )
    .toBe(0.25);
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const p = (
            document.querySelector("tosi-ensemble-editor") as unknown as {
              _effectTool: Tool;
            }
          )._effectTool.node.position;
          return [p.x, p.z].map((v) => Math.round(v * 100) / 100);
        }),
      { message: "the tool stayed where the piece was", timeout: 10_000 }
    )
    .toEqual([4, -3]);
  // Scale reads as its value, not a slider that would move nothing.
  const texts = await allPanelTexts(page);
  expect(
    texts.some((t) => /^scale\b.*: 2/i.test(t)),
    texts.join(" | ")
  ).toBe(true);
  expect(realErrors(errors)).toEqual([]);
});
