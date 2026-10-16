import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A LIBRARY PIECE TURNS AND SCALES — measured on its rendered footprint.

  For most of this project's life it did neither: `b3d-destroyable` forwarded
  only position to `library.instantiate`, and `size` is the placeholder cube's
  edge. We wrote rotation and scale onto the instance root ourselves.
  tosijs-3d 0.8.1 fixed both (#47, #48): the element forwards `rx`/`ry`/`rz`,
  re-renders once its node exists, and has a UNIFORM `scale`, which it
  re-applies on every render.

  That last part made our node write a liability: a non-uniform scale written
  to the node was wiped by the next re-render — a move, a turn — measured as
  [2, 1, 3] back to [1, 1, 1] after one `ry` write. So this holds three
  pieces built from one document, side by side (a control and two subjects),
  and then turns the scaled one live:

  - `turned`: rot [0, 90, 0] swaps the control's x and z extents;
  - `stretched`: rot [0, 90, 0] and scale [2, 1, 3], so x = 3·z0 and z = 2·x0;
  - `doubled`: scale 2, through the element's own uniform `scale`;
  - and `stretched` keeps its stretch through a later turn and a move.
*/
test("library pieces turn and scale as authored, and keep it through edits", async ({
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

  const r = await page.evaluate(async () => {
    type V = { x: number; y: number; z: number };
    type Node = {
      scaling: V;
      computeWorldMatrix(force: boolean): void;
      getHierarchyBoundingVectors(): { min: V; max: V };
    };
    type El = Element & { mesh?: Node | null; meshName?: string };
    type Ed = Element & {
      ensemble: { pieces: unknown[] } & Record<string, unknown>;
      shadowRoot: ShadowRoot;
    };
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const frames = (n: number) =>
      new Promise<void>((done) => {
        const step = (k: number) =>
          k ? requestAnimationFrame(() => step(k - 1)) : done();
        step(n);
      });
    const all = () =>
      [...ed.shadowRoot.querySelectorAll("tosi-b3d-destroyable")] as El[];
    // A mesh name from the loaded kit, wide in one direction.
    let mesh: string | undefined;
    for (let i = 0; i < 200 && !mesh; i++) {
      mesh = all().find((e) => e.mesh)?.meshName;
      if (!mesh) await frames(3);
    }
    if (!mesh) return { error: "no library piece instantiated" };

    ed.ensemble = {
      ...ed.ensemble,
      pieces: [
        { id: "control", mesh, at: [0, 0, 0] },
        { id: "turned", mesh, at: [30, 0, 0], rot: [0, 90, 0] },
        {
          id: "stretched",
          mesh,
          at: [60, 0, 0],
          rot: [0, 90, 0],
          scale: [2, 1, 3],
        },
        { id: "doubled", mesh, at: [90, 0, 0], scale: 2 },
      ],
    };
    const byX = (x: number) =>
      all().find((e) => Number((e as unknown as { x: number }).x) === x);
    const size = (e: El | undefined) => {
      const node = e?.mesh;
      if (!node) return null;
      node.computeWorldMatrix(true);
      const { min, max } = node.getHierarchyBoundingVectors();
      return [max.x - min.x, max.y - min.y, max.z - min.z].map(
        (v) => Math.round(v * 1000) / 1000
      );
    };
    // Every piece meshed, then a few more frames for late renders.
    for (let i = 0; i < 200 && [0, 30, 60, 90].some((x) => !byX(x)?.mesh); i++)
      await frames(3);
    await frames(10);
    const built = {
      control: size(byX(0)),
      turned: size(byX(30)),
      stretched: size(byX(60)),
      doubled: size(byX(90)),
    };

    // Live edits on the stretched piece: the editor's own transform write.
    const stretched = byX(60) as unknown as {
      ry: number;
      x: number;
    };
    stretched.ry = 0;
    await frames(6);
    const unturned = size(byX(60));
    stretched.x = 61;
    await frames(6);
    const moved = size(byX(61));
    return { mesh, built, unturned, moved };
  });

  console.log(JSON.stringify(r));
  expect((r as { error?: string }).error).toBeUndefined();
  const { built, unturned, moved } = r as {
    built: Record<string, number[] | null>;
    unturned: number[] | null;
    moved: number[] | null;
  };
  const [x0, , z0] = built.control!;
  // The control must not be square, or a turn could not be seen.
  expect(Math.abs(x0! - z0!)).toBeGreaterThan(0.05);
  expect(built.turned![0]).toBeCloseTo(z0!, 2);
  expect(built.turned![2]).toBeCloseTo(x0!, 2);
  expect(built.stretched![0]).toBeCloseTo(z0! * 3, 2);
  expect(built.stretched![2]).toBeCloseTo(x0! * 2, 2);
  expect(built.doubled![0]).toBeCloseTo(x0! * 2, 2);
  expect(built.doubled![2]).toBeCloseTo(z0! * 2, 2);
  // A re-render must not undo a non-uniform scale.
  expect(unturned![0]).toBeCloseTo(x0! * 2, 2);
  expect(unturned![2]).toBeCloseTo(z0! * 3, 2);
  expect(moved).toEqual(unturned);

  expect(realErrors(errors)).toEqual([]);
});
