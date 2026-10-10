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

  /*
    Two quick changes: the last one wins. The FIRST response is held back
    2.5 s, so it lands after the second: without the staleness guard it would
    overwrite the document asked for last (0.5.1 review: a race test whose
    first request resolves first anyway cannot fail).
  */
  await page.route("**/ensembles/land-and-sky.json", async (route) => {
    await new Promise((r) => setTimeout(r, 2500));
    await route.continue();
  });
  const last = await page.evaluate(async () => {
    const el = document.querySelector("tosi-ensemble") as El;
    /*
      The first fetch must be IN FLIGHT when the second src arrives: two
      writes in one tick are batched into one render by tosijs, so the first
      would never even be requested (measured). Let it start, then change.
    */
    el.src = "/ensembles/land-and-sky.json";
    await new Promise((r) => setTimeout(r, 400));
    el.src = "/ensembles/standard-scene.json";
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 100));
      if (el.ensemble?.name === "standard-scene") break;
    }
    // The held-back land-and-sky lands now, and must be ignored.
    await new Promise((r) => setTimeout(r, 4000));
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

  /*
    A document WITH A LIBRARY survives a move too: the rebuild mounts the
    document's libraries in the scene it lands in, so a library piece is its
    real mesh, not a placeholder box (0.5.1 review: only the fetch path
    mounted libraries).
  */
  const withLibrary = await page.evaluate(async () => {
    const el = document.querySelector("tosi-ensemble") as El;
    const b3d = el.closest("tosi-b3d") as Element & {
      scene: { meshes: Array<{ name: string }> };
    };
    el.ensemble = {
      name: "with-library",
      libraries: [
        {
          name: "pirate",
          url: "https://cdn.tosijs.net/kenney/libraries/pirate-kit.glb",
        },
      ],
      pieces: [{ id: "barrel", mesh: "barrel", at: [0, 0, 0] }],
    } as never;
    el.remove();
    b3d.append(el);
    for (let i = 0; i < 150; i++) {
      await new Promise((r) => setTimeout(r, 200));
      // A LIBRARY piece, not a placeholder, asked of the build: a library
      // piece is placed by <tosi-b3d-destroyable>, a missing mesh becomes a
      // <tosi-b3d-box>. (Checking for `.mesh` was vacuous: a placeholder box
      // has one too, and the check passed with the mount removed.)
      const piece = (
        el as unknown as {
          built: {
            pieces: Map<string, { element?: Element | null }>;
          } | null;
        }
      ).built?.pieces.get("barrel");
      if (piece?.element?.tagName === "TOSI-B3D-DESTROYABLE") return true;
    }
    return false;
  });
  expect(withLibrary, "the library piece did not build after a move").toBe(
    true
  );

  expect(realErrors(errors)).toEqual([]);
});
