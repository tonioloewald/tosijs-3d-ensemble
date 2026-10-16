import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A ROTATE DRAG TURNS THE PIECE WHILE YOU DRAG, on a piece built WITHOUT a
  rotation. A real mouse on a real ring, measured mid-drag on the node.

  Owner: "Rotation doesn't seem to be live". Measured on the node's world
  `forward`, NOT `node.rotation`: the element turns the node through its
  quaternion, so `.rotation` reads 0 on a visibly turned piece. A probe that
  read `.rotation` blamed upstream (tosijs-3d#108, retracted) for what was
  ours: the panel path rebuilt the scene every step (the test below). This
  one holds the drag path, on an unrotated piece, read before release.
*/
type V = { x: number; y: number; z: number };
type Ed = Element & {
  shadowRoot: ShadowRoot;
  ensemble: { pieces: Array<{ id: string; mesh?: string; rot?: number[] }> };
  setTool(name: string): void;
  select(id: string | null): void;
};

test("dragging a rotate ring turns an unrotated piece live", async ({
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

  // An unrotated mesh piece whose instance exists; select it.
  const id = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      _built: { pieces: Map<string, { element?: { mesh?: unknown } }> };
    };
    const piece = ed.ensemble.pieces.find(
      (p) =>
        p.mesh &&
        !(p.rot ?? []).some((v) => v !== 0) &&
        ed._built.pieces.get(p.id)?.element?.mesh
    );
    if (!piece) return null;
    ed.setTool("select");
    ed.select(piece.id);
    return piece.id;
  });
  expect(id, "no unrotated library piece in the default scene").not.toBeNull();
  await page.waitForTimeout(1500);

  // Find a rotate ring on screen by picking for one.
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
    const isRing = (m: unknown) => ed._handles.gripOf(m)?.kind === "rotate";
    for (let y = 0; y < rect.height; y += 6)
      for (let x = 0; x < rect.width; x += 6) {
        const hit = b3d.scene.pick(x * sx, y * sy, isRing);
        if (hit.hit) {
          return {
            x: rect.left + x,
            y: rect.top + y,
            axis: ed._handles.gripOf(hit.pickedMesh)?.axis ?? "?",
          };
        }
      }
    return null;
  });
  expect(grip, "no rotate ring on screen").not.toBeNull();

  const facing = () =>
    page.evaluate((id) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
        _built: {
          pieces: Map<
            string,
            {
              element: {
                ry: number;
                mesh: {
                  computeWorldMatrix(f: boolean): void;
                  forward: V;
                  right: V;
                };
              };
            }
          >;
        };
      };
      const el = ed._built.pieces.get(id!)!.element;
      el.mesh.computeWorldMatrix(true);
      const f = el.mesh.forward;
      const r = el.mesh.right;
      return { f: [f.x, f.y, f.z], r: [r.x, r.y, r.z], rx: el.ry };
    }, id);
  const angle = (a: number[], b: number[]) =>
    (Math.acos(
      Math.max(-1, Math.min(1, a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!))
    ) *
      180) /
    Math.PI;

  const before = await facing();
  await page.mouse.move(grip!.x, grip!.y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(grip!.x + i * 10, grip!.y + i * 6);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(300);
  const during = await facing();
  await page.mouse.up();
  await page.waitForTimeout(500);

  const turned = Math.max(angle(before.f, during.f), angle(before.r, during.r));
  console.log(JSON.stringify({ id, grip, before, during, turned }));
  expect(turned, "the piece did not turn during the drag").toBeGreaterThan(5);
  expect(realErrors(errors)).toEqual([]);
});

/*
  THE PANEL'S ROTATION FIELD, which is what "not live" turned out to be: it
  goes `update()` → `edit()`, and `edit()` rebuilt the whole scene for any
  change outside `features`, so a scrub re-instantiated every piece each step.
  Now a transform-only edit is written to the body in place. Asked of the
  renderer: the SAME instance turns, within a few frames.
*/
test("the panel's rotation field turns the piece in place", async ({
  page,
}) => {
  test.setTimeout(180_000);
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
  const r = await page.evaluate(async () => {
    type Node = { computeWorldMatrix(f: boolean): void; forward: V };
    const ed = document.querySelector(
      "tosi-ensemble-editor"
    ) as unknown as Ed & {
      update(id: string, patch: Record<string, unknown>): void;
      _built: { pieces: Map<string, { element?: { mesh?: Node | null } }> };
    };
    const frames = (n: number) =>
      new Promise<void>((done) => {
        const step = (k: number) =>
          k ? requestAnimationFrame(() => step(k - 1)) : done();
        step(n);
      });
    const piece = ed.ensemble.pieces.find(
      (p) =>
        p.mesh &&
        !(p.rot ?? []).some((v) => v !== 0) &&
        ed._built.pieces.get(p.id)?.element?.mesh
    )!;
    const el = () => ed._built.pieces.get(piece.id)!.element!;
    const forward = () => {
      const n = el().mesh!;
      n.computeWorldMatrix(true);
      return [n.forward.x, n.forward.y, n.forward.z];
    };
    const element = el();
    const before = forward();
    // A scrub: several steps, as a dragged field sends them.
    for (const ry of [15, 30, 45, 60]) {
      ed.update(piece.id, { rot: [0, ry, 0] });
      await frames(2);
    }
    const sameInstance = el() === element && !!el().mesh;
    const after = forward();
    const dot = before.reduce((a, v, i) => a + v * after[i]!, 0);
    return {
      id: piece.id,
      sameInstance,
      turned: (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI,
    };
  });
  console.log(JSON.stringify(r));
  expect(r.sameInstance, "the scrub rebuilt the piece").toBe(true);
  expect(r.turned).toBeCloseTo(60, 0);
  expect(realErrors(errors)).toEqual([]);
});

/*
  A MOVE CARRIES THE PIECE'S FEATURES WITH IT (0.6.0 review M2). The in-place
  transform path writes the BODY; a feature that placed itself from the
  piece's `at` when it bound (here a sound, elsewhere a turret mount or a
  trigger volume) was left behind, and a reload disagreed with the editor.
  A piece with features rebuilds on a move instead. Asked of the feature's
  own element.
*/
test("moving a piece moves the features placed from it", async ({ page }) => {
  test.setTimeout(180_000);
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
  const r = await page.evaluate(async () => {
    type Doc = { pieces: Array<Record<string, unknown>> };
    const ed = document.querySelector("tosi-ensemble-editor") as unknown as {
      ensemble: Doc;
      update(id: string, patch: Record<string, unknown>): void;
      shadowRoot: ShadowRoot;
    };
    const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
    const mesh = (ed.ensemble.pieces.find((p) => p.mesh) as { mesh: string })
      .mesh;
    ed.ensemble = {
      ...ed.ensemble,
      pieces: [
        { id: "noisy", mesh, at: [0, 0, 0], features: { sound: {} } },
      ],
    };
    await sleep(1500);
    const soundX = () =>
      Number(
        (
          ed.shadowRoot.querySelector("tosi-b3d-sound") as unknown as {
            x: number;
          } | null
        )?.x
      );
    const before = soundX();
    ed.update("noisy", { at: [5, 0, 0] });
    await sleep(1500);
    return { before, after: soundX() };
  });
  console.log(JSON.stringify(r));
  expect(r.before).toBe(0);
  expect(r.after, "the sound stayed where the piece used to be").toBe(5);
  expect(realErrors(errors)).toEqual([]);
});
