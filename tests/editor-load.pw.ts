import { test, expect } from "@playwright/test";

/*
  PAGE-LEVEL EDITOR BEHAVIOUR — the part that is not a doc fence.

  The scene assertions that used to live here (sun, fill, skybox, ground extent,
  fog mode) moved into a ` ```test ` fence on `<tosi-ensemble>`'s own doc page,
  where they belong: next to the feature, running in a plain browser, and
  visible to a human who refreshes the page. See `tests/doc-tests.pw.ts`.

  What stays is what is genuinely about the PAGE rather than the scene: the
  editor carries its own `src`, and an explicit `load()` has to win against it.
  No doc example has that shape, so no fence can express it.
*/
test.describe("a load is not overtaken by the page's own src", () => {
  test("an explicit load survives the mount's in-flight fetch", async ({
    page,
  }) => {
    /*
      The page carries `src="/ensembles/pirate-cove.json"`. The mount defers,
      sets `_loadedSrc` and STARTS that fetch — a guard about starting a load,
      not about it landing. So an explicit `load()` won, and then the older
      fetch resolved and silently replaced it:

          t=102ms   ensemble.name  "standard-scene"   ← the explicit load
          t=870ms   ensemble.name  "pirate-cove"      ← the mount's, landing

      That is the 0.1.2 data-loss bug reached by the other door — that fix
      stopped a second load from STARTING, and nothing stopped the first from
      FINISHING. `load()` carries a generation now, and this watches the whole
      window rather than sampling the end of it: the failure was invisible to a
      single reading taken at the wrong moment, which is how it survived.
    */
    await page.goto("/editor/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () =>
        !!(
          document.querySelector("tosi-ensemble-editor") as
            | (Element & { shadowRoot: ShadowRoot })
            | null
        )?.shadowRoot?.querySelector("tosi-b3d"),
      { timeout: 60_000 }
    );

    const names = await page.evaluate(async () => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        load: (u: string) => Promise<void>;
        ensemble?: { name?: string };
      };
      const seen: string[] = [];
      const tick = setInterval(() => {
        const n = ed.ensemble?.name;
        if (n && seen[seen.length - 1] !== n) seen.push(n);
      }, 50);
      void ed.load("/ensembles/standard-scene.json");
      await new Promise((r) => setTimeout(r, 6000));
      clearInterval(tick);
      return seen;
    });

    // It may legitimately show the cove BEFORE the explicit load lands. What it
    // must never do is go back to it afterwards.
    expect(names[names.length - 1]).toBe("standard-scene");
    expect(names.lastIndexOf("pirate-cove")).toBeLessThan(
      names.lastIndexOf("standard-scene")
    );
  });
});
