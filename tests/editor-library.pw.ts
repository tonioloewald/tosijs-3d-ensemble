import { test, expect } from "@playwright/test";
import { budget } from "./budget.js";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  `libraryUrl` MUST ACTUALLY MOUNT A LIBRARY — #10.

  The prop was declared and documented and never read: it appeared exactly
  twice in `ensemble-editor.ts`, once in the class doc's usage example and once
  in `initAttributes`, with no third occurrence. So an editor mounted exactly
  as the docs show came up with zero `tosi-b3d-library` elements and an empty
  insert palette while the `.glb` served fine.

  This asserts the OUTPUT the consumer measured, inverted: the element exists,
  and the scene can NAME meshes from it. Not "the attribute is set" — that was
  always true and is precisely what made the bug invisible.
*/
const KIT = "https://cdn.tosijs.net/kenney/libraries/pirate-kit.glb";

test("an editor given libraryUrl can name meshes from it", async ({ page }) => {
  // A cold CDN fetch of a real kit, plus a scene mount, does not fit in 30s.
  test.setTimeout(budget(120_000));
  const errors = collectPageErrors(page);

  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  // Wait for the custom element to be defined rather than for the page's own
  // editor to finish: what is under test is a FRESH mount, and borrowing the
  // page's would test whatever `src` had already done.
  await page.waitForFunction(
    () => !!customElements.get("tosi-ensemble-editor"),
    {
      timeout: 60_000,
    }
  );

  const result = await page.evaluate(async (kit) => {
    const ed = document.createElement("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot | null;
    };
    /*
        PROPERTIES, NOT ATTRIBUTES. HTML lowercases attribute names, so
        `setAttribute('libraryUrl', …)` writes `libraryurl` and the component
        never sees it — which would make this test fail for a reason that has
        nothing to do with the bug. The documented usage passes props anyway.
      */
    const props = ed as unknown as Record<string, string>;
    props.library = "pirate-kit";
    props.libraryUrl = kit;
    props.backdrop = "aquatic";
    // Off-screen but connected: the mount is deferred to a macrotask and
    // cancelled on disconnect, so it has to be in the document to run at all.
    (ed as HTMLElement).style.cssText =
      "position:fixed;left:-9999px;width:640px;height:480px";
    document.body.append(ed);

    const deadline = Date.now() + 60_000;
    let libs = 0;
    let names = 0;
    while (Date.now() < deadline) {
      /*
          `getNames()` lives on the LIBRARY element and takes no argument; the
          scene resolves one by type with `getLibrary(name)`. Asking the scene
          directly returns undefined forever, which reads exactly like a kit
          that never loaded — the guess-the-API trap CLAUDE.md names.
        */
      const scene = ed.shadowRoot?.querySelector("tosi-b3d") as
        | (Element & {
            getLibrary?: (t: string) => { getNames?: () => string[] } | null;
          })
        | null;
      libs = ed.shadowRoot?.querySelectorAll("tosi-b3d-library").length ?? 0;
      names = scene?.getLibrary?.("pirate-kit")?.getNames?.()?.length ?? 0;
      if (names > 0) break;
      await new Promise((r) => setTimeout(r, 250));
    }
    ed.remove();
    return { libs, names };
  }, KIT);

  // The consumer measured `tosi-b3d-library 0 elements` and `getNames() 0`.
  expect(result.libs).toBeGreaterThan(0);
  expect(result.names).toBeGreaterThan(0);
  expect(realErrors(errors)).toEqual([]);
});
