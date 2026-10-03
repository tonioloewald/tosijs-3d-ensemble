import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  RAPID EDITS LEAVE NO GHOSTS, AND NOTHING KEEPS TICKING.

  Two regressions in one place, because they were one piece of code:

  - GHOSTS. `b3d-destroyable` used to instantiate after its element was
    removed, so four quick edits stood four copies of a tower in the scene (210
    meshes where there had been 81). tosijs-3d 0.8.1 fixed that upstream
    (#49), and our orphan reaper, which polled every removed element for 12 s,
    was deleted in favour of THIS check: a burst of edits, each a rebuild,
    must settle at the mesh count it started from.
  - TIMERS. That reaper was itself the leak by then: the late node could no
    longer arrive, so every poll ran its full budget, 38 timers at 20 Hz per
    rebuild of the pirate cove. Measured ~2,700 interval ticks a second after
    two editor visits, enough to slow the re-parent lane's trips from 5 s to
    40 s. After a burst of edits the page should be near idle.
*/
test("a burst of edits settles at the same scene, and goes quiet", async ({
  page,
}) => {
  test.setTimeout(180_000);
  const errors = collectPageErrors(page);
  await page.addInitScript(() => {
    const w = window as unknown as { __ticks: number };
    w.__ticks = 0;
    const si = window.setInterval.bind(window);
    (window as unknown as { setInterval: unknown }).setInterval = (
      cb: (...a: unknown[]) => void,
      ms?: number,
      ...rest: unknown[]
    ) =>
      si(
        (...a: unknown[]) => {
          w.__ticks++;
          cb(...a);
        },
        ms,
        ...rest
      );
  });
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );

  // The mesh count once every piece is built and the count holds still.
  const settled = () =>
    page.evaluate(async () => {
      type View = {
        shadowRoot: ShadowRoot | null;
        _built?: { pieces?: Map<string, unknown> } | null;
        ensemble?: { pieces?: unknown[] };
      };
      const ed = document.querySelector("tosi-ensemble-editor") as
        | (Element & View)
        | null;
      let last = -1;
      let stable = 0;
      for (let i = 0; i < 200 && stable < 6; i++) {
        await new Promise((r) => setTimeout(r, 250));
        const b3d = ed?.shadowRoot?.querySelector("tosi-b3d") as
          | (Element & { scene?: { meshes?: unknown[] } })
          | null;
        const n = b3d?.scene?.meshes?.length ?? 0;
        const ready =
          (ed?._built?.pieces?.size ?? 0) >=
          (ed?.ensemble?.pieces?.length ?? 1);
        stable = ready && n > 0 && n === last ? stable + 1 : 0;
        last = n;
      }
      return last;
    });

  const before = await settled();
  expect(before).toBeGreaterThan(0);
  for (const burst of [4, 10]) {
    await page.evaluate((n) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        edit: (
          d: string,
          m: (e: { pieces: Array<{ mesh?: string; at: number[] }> }) => void
        ) => void;
      };
      // No pause between edits: each one rebuilds while the last is loading.
      for (let i = 0; i < n; i++)
        ed.edit(`nudge ${i}`, (e) => {
          const piece = e.pieces.find((p) => p.mesh)!;
          piece.at[0] = (piece.at[0] ?? 0) + 0.5;
        });
    }, burst);
    expect(await settled(), `${burst} rapid edits changed the scene`).toBe(
      before
    );
  }

  // Quiet: measured 6.5 ticks/s here once the reaper went, ~2,700 with it.
  await page.waitForTimeout(1000);
  const ticksPerSec = await page.evaluate(async () => {
    const w = window as unknown as { __ticks: number };
    const t = w.__ticks;
    await new Promise((r) => setTimeout(r, 2000));
    return (w.__ticks - t) / 2;
  });
  expect(ticksPerSec, "intervals still running after the edits").toBeLessThan(
    100
  );

  expect(realErrors(errors)).toEqual([]);
});
