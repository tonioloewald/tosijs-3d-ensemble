import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  <tosi-ensemble> IS DECLARATIVE ALL THE WAY (0.5.1).

  Driven on the element's own doc page, whose example now has no setup call.
  That page does NOT prove the element registers the scene features itself:
  something else on it registers them first (falsified 2026-10-10, it passed
  with the call removed). The fresh-process unit test
  (src/runtime/ensemble-element.test.ts) proves that. This file drives what an
  attribute-only consumer relies on next:

  - `at` changed: the build moves (measured on the ground mesh, not the attr);
  - `src` changed: the new document loads;
  - two quick `src` changes: the LAST one is what shows;
  - a bad `src`: an `error` event, never an unhandled rejection;
  - an in-memory `.ensemble` survives a MOVE (re-parenting rebuilds it).
*/
type El = HTMLElement & {
  src: string;
  at: string;
  ensemble: { name: string; pieces: unknown[] } | null;
  built: { pieces: Map<string, unknown> } | null;
};

test("tosi-ensemble follows its attributes, survives a move, reports errors", async ({
  page,
}) => {
  test.setTimeout(180_000);
  const errors = collectPageErrors(page);
  await page.goto("/ensemble-element/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      ((document.querySelector("tosi-ensemble") as El | null)?.built?.pieces
        .size ?? 0) > 0,
    null,
    { timeout: 60_000 }
  );

  // A helper the page keeps: resolve on the next event of a kind.
  await page.evaluate(() => {
    const el = document.querySelector("tosi-ensemble") as El;
    (window as unknown as { next: (t: string) => Promise<unknown> }).next = (
      type: string
    ) =>
      new Promise((resolve) =>
        el.addEventListener(type, (e) => resolve((e as CustomEvent).detail), {
          once: true,
        })
      );
  });

  // `at`: the ground moves with the origin.
  const groundX = await page.evaluate(async () => {
    const el = document.querySelector("tosi-ensemble") as El;
    const b3d = el.closest("tosi-b3d") as Element & {
      scene: {
        meshes: Array<{ name: string; getAbsolutePosition(): { x: number } }>;
      };
    };
    const x = () =>
      b3d.scene.meshes
        .find((m) => m.name.startsWith("ground"))!
        .getAbsolutePosition().x;
    const before = x();
    const built = (
      window as unknown as { next: (t: string) => Promise<unknown> }
    ).next("built");
    el.at = "30 0 0";
    await built;
    /*
      POLL, don't wait a fixed time: the rebuilt ground exists as soon as
      \`built\` fires, but tosijs-3d applies an element's position on its next
      frame, so it sits at 0 for a moment (measured: at 0 when \`built\` fires,
      at the new origin within 500 ms, every round). A fixed 500 ms lost that
      race once in four under load.
    */
    let after = x();
    for (let i = 0; i < 50 && Math.abs(after - before - 30) > 0.5; i++) {
      await new Promise((r) => setTimeout(r, 100));
      after = x();
    }
    return { before, after };
  });
  expect(groundX.after - groundX.before).toBeCloseTo(30, 0);

  // `src`: a new document loads.
  const loaded = await page.evaluate(async () => {
    const el = document.querySelector("tosi-ensemble") as El;
    const built = (
      window as unknown as { next: (t: string) => Promise<unknown> }
    ).next("built");
    el.src = "/ensembles/storm.json";
    await built;
    return el.ensemble?.name;
  });
  expect(loaded).toBe("storm");

  // Two quick changes: the last one wins, whichever response lands first.
  const last = await page.evaluate(async () => {
    const el = document.querySelector("tosi-ensemble") as El;
    el.src = "/ensembles/land-and-sky.json";
    el.src = "/ensembles/standard-scene.json";
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 100));
      if (el.ensemble?.name === "standard-scene") break;
    }
    // Give a slower land-and-sky response time to land, and be ignored.
    await new Promise((r) => setTimeout(r, 3000));
    return el.ensemble?.name;
  });
  expect(last).toBe("standard-scene");

  // A bad `src`: an `error` event naming it.
  const failed = (await page.evaluate(async () => {
    const el = document.querySelector("tosi-ensemble") as El;
    const err = (
      window as unknown as { next: (t: string) => Promise<unknown> }
    ).next("error");
    el.src = "/ensembles/does-not-exist.json";
    return await Promise.race([
      err,
      new Promise((r) => setTimeout(() => r(null), 10_000)),
    ]);
  })) as { src: string } | null;
  expect(failed, "no error event for a bad src").not.toBeNull();
  expect(failed!.src).toBe("/ensembles/does-not-exist.json");

  // An in-memory document survives a MOVE: dispose on disconnect, rebuild on
  // reconnect from what the element holds (there is no `src` to refetch).
  const moved = await page.evaluate(async () => {
    const el = document.querySelector("tosi-ensemble") as El;
    const b3d = el.closest("tosi-b3d")!;
    el.removeAttribute("src");
    (el as unknown as { src: string }).src = "";
    const built = (
      window as unknown as { next: (t: string) => Promise<unknown> }
    ).next("built");
    el.ensemble = {
      name: "in-memory",
      pieces: [{ id: "sky", at: [0, 0, 0], features: { skybox: {} } }],
    };
    await built;
    const rebuilt = (
      window as unknown as { next: (t: string) => Promise<unknown> }
    ).next("built");
    el.remove();
    const gone = el.built === null;
    b3d.append(el);
    await Promise.race([rebuilt, new Promise((r) => setTimeout(r, 5000))]);
    return {
      gone,
      name: el.ensemble?.name,
      pieces: el.built?.pieces.size ?? 0,
    };
  });
  expect(moved).toEqual({ gone: true, name: "in-memory", pieces: 1 });

  expect(realErrors(errors)).toEqual([]);
});
