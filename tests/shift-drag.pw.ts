import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  ONE GESTURE, ONE OWNER (tosijs-3d 0.10.15). The default view controls now
  pan on shift-drag, and the editor's flat pointer reads shift as a tool's
  SECONDARY modifier. A shift-drag that both panned the view and drove the
  tool would be two things for one gesture (the ctrl-drag lesson in
  flat-pointer.ts). Measured: the camera's target and the selected piece,
  before and after a real shift-drag that starts on the piece.
*/
type V = { x: number; y: number; z: number };
type Ed = Element & {
  shadowRoot: ShadowRoot;
  ensemble: { pieces: Array<{ id: string; mesh?: string }> };
  setTool(name: string): void;
  select(id: string | null): void;
};

test("a shift-drag on empty sky does not move the camera AND a piece", async ({
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
  await page.waitForTimeout(5000);

  const read = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      const b3d = ed.shadowRoot.querySelector("tosi-b3d") as unknown as {
        scene: {
          activeCamera: { target: V; alpha: number; beta: number };
        };
      };
      const c = b3d.scene.activeCamera;
      return {
        target: { x: c.target.x, y: c.target.y, z: c.target.z },
        alpha: c.alpha,
        beta: c.beta,
        doc: JSON.stringify(ed.ensemble.pieces),
      };
    });

  // The canvas centre, a little up: open ground or sky, no panel.
  const box = (await page.locator("tosi-ensemble-editor").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height * 0.3;

  for (const tool of ["select", "insert"]) {
    await page.evaluate((t) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      try {
        ed.setTool(t);
      } catch {
        /* a tool this build lacks */
      }
    }, tool);
    await page.waitForTimeout(300);
    const before = await read();
    await page.keyboard.down("Shift");
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(x + i * 20, y + i * 6);
      await page.waitForTimeout(30);
    }
    await page.mouse.up();
    await page.keyboard.up("Shift");
    await page.waitForTimeout(500);
    const after = await read();
    const panned =
      Math.hypot(
        after.target.x - before.target.x,
        after.target.y - before.target.y,
        after.target.z - before.target.z
      ) > 1e-3;
    const orbited =
      Math.abs(after.alpha - before.alpha) > 1e-3 ||
      Math.abs(after.beta - before.beta) > 1e-3;
    const edited = after.doc !== before.doc;
    console.log(tool, { panned, orbited, edited });
    expect(
      [panned, orbited, edited].filter(Boolean).length,
      `${tool}: one shift-drag did ${JSON.stringify({
        panned,
        orbited,
        edited,
      })}`
    ).toBeLessThanOrEqual(1);
  }
  expect(realErrors(errors)).toEqual([]);
});

/*
  The case that matters: shift on a SCALE grip means "the other two axes"
  (transform.ts). If the view's shift-pan also fires, one gesture scales the
  piece and slides the world under it.
*/
test("a shift-drag on a scale grip scales without panning", async ({
  page,
}) => {
  test.setTimeout(300_000);
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
  await page.waitForTimeout(5000);
  const id = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      _built: { pieces: Map<string, { element?: { mesh?: unknown } }> };
    };
    const piece = ed.ensemble.pieces.find(
      (p) => p.mesh && ed._built.pieces.get(p.id)?.element?.mesh
    );
    if (!piece) return null;
    ed.setTool("select");
    // Scale grips are off by default: light the scale cell (3) alone.
    (
      ed as unknown as { setToolOption(k: string, v: unknown): void }
    ).setToolOption("cells", [3]);
    ed.select(piece.id);
    return piece.id;
  });
  expect(id, "no library piece").not.toBeNull();
  await page.waitForTimeout(1500);
  const grip = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      _handles: { gripOf(m: unknown): { kind: string; axis?: string } | null };
    };
    const b3d = ed.shadowRoot.querySelector("tosi-b3d") as unknown as {
      scene: {
        pick(
          x: number,
          y: number,
          pred: (m: unknown) => boolean
        ): { hit: boolean; pickedMesh: unknown };
        getEngine(): { getRenderingCanvas(): HTMLCanvasElement };
      };
    };
    const canvas = b3d.scene.getEngine().getRenderingCanvas();
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const isCube = (m: unknown) => ed._handles.gripOf(m)?.kind === "scale";
    for (let y = 0; y < rect.height; y += 6)
      for (let x = 0; x < rect.width; x += 6) {
        const hit = b3d.scene.pick(x * sx, y * sy, isCube);
        if (hit.hit) return { x: rect.left + x + 3, y: rect.top + y + 3 };
      }
    return null;
  });
  expect(grip, "no scale cube on screen").not.toBeNull();
  const read = () =>
    page.evaluate((id) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      const b3d = ed.shadowRoot.querySelector("tosi-b3d") as unknown as {
        scene: { activeCamera: { target: V } };
      };
      const t = b3d.scene.activeCamera.target;
      return {
        target: [t.x, t.y, t.z],
        scale: JSON.stringify(
          (ed.ensemble.pieces.find((p) => p.id === id) as { scale?: unknown })
            ?.scale ?? 1
        ),
      };
    }, id);
  const before = await read();
  await page.keyboard.down("Shift");
  await page.mouse.move(grip!.x, grip!.y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(grip!.x + i * 8, grip!.y - i * 8);
    await page.waitForTimeout(30);
  }
  await page.mouse.up();
  await page.keyboard.up("Shift");
  await page.waitForTimeout(800);
  const after = await read();
  const panned =
    Math.hypot(
      after.target[0]! - before.target[0]!,
      after.target[1]! - before.target[1]!,
      after.target[2]! - before.target[2]!
    ) > 1e-3;
  const scaled = after.scale !== before.scale;
  console.log(JSON.stringify({ before, after, panned, scaled }));
  expect(scaled, "the shift-drag on a scale cube did not scale").toBe(true);
  expect(panned, "the shift-drag on a scale cube also panned the view").toBe(
    false
  );
  expect(realErrors(errors)).toEqual([]);
});
