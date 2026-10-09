import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  THE EDITOR'S AO PREVIEW: a viewer's switch, the author's look.

  Whether AO runs is the viewer's choice (owner: "AO is a consumer choice"), so
  the toggle is remembered per browser and never written to the document. How
  AO looks is the document's `recommends`, and the preview must use it, or an
  author tunes a recommendation they never actually see.

  Checked on the renderer, not the attribute: AO is running (by whichever
  method tosijs-3d uses) while the preview is on, and not when it is off.

  ⚠️ 1400x1100: at the default viewport the left panels can sit below the fold
  and a click lands on nothing (see property-keystroke.pw.ts).
*/
type Ed = Element & {
  shadowRoot: ShadowRoot | null;
  ensemble: Record<string, unknown>;
  edit: (d: string, m: (e: Record<string, unknown>) => void) => void;
};

const state = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const b3d = ed.shadowRoot!.querySelector("tosi-b3d") as Element & {
      ssao: string;
      ssaoStrength: number;
      ssaoRadius: number;
      scene?: {
        postProcessRenderPipelineManager?: {
          supportedPipelines?: unknown[];
        };
      };
    };
    return {
      ssao: b3d.ssao,
      strength: b3d.ssaoStrength,
      radius: b3d.ssaoRadius,
      /*
        AO IS RUNNING, by either method. tosijs-3d 0.8.14 made `projected` the
        default: a material plugin ("ProjectedAo") on every lit material, not
        Babylon's post-process pipeline. This test checked only the pipeline
        and went red on that upgrade although AO was drawing, so it now asks
        both: an attached pipeline, or an enabled plugin on a visible mesh.
      */
      running:
        (b3d.scene?.postProcessRenderPipelineManager?.supportedPipelines
          ?.length ?? 0) > 0 ||
        (
          (
            b3d.scene as unknown as {
              meshes: Array<{
                isVisible: boolean;
                material?: {
                  pluginManager?: {
                    getPlugin(n: string): { isEnabled: boolean } | null;
                  };
                } | null;
              }>;
            }
          ).meshes ?? []
        ).some(
          (m) =>
            m.isVisible &&
            !!m.material?.pluginManager?.getPlugin("ProjectedAo")?.isEnabled
        ),
      docKeys: Object.keys(ed.ensemble),
      recommends: ed.ensemble.recommends ?? null,
    };
  });

/*
  Click the SWITCH, not the caption: the caption's <text> paints over the hit
  rect and takes the click itself (tosijs-3d#84, see schema-readout.pw.ts).
*/
const tapToggle = async (page: import("@playwright/test").Page) => {
  const at = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const t = Array.from(ed.shadowRoot!.querySelectorAll("text")).find(
      (x) => (x.textContent ?? "").trim() === "Ambient occlusion"
    );
    let group: Element | null = t ?? null;
    while (group && !group.getAttribute?.("data-w3d"))
      group = group.parentElement;
    const b = (group as SVGGraphicsElement | null)?.getBoundingClientRect();
    return b && { x: b.right - 18, y: b.y + b.height / 2 };
  });
  expect(at, "no Ambient occlusion toggle").toBeTruthy();
  await page.mouse.click(at!.x, at!.y);
  await page.waitForTimeout(800);
};

const ready = (page: import("@playwright/test").Page) =>
  page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );

test("the AO preview is the viewer's switch and the document's look", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await ready(page);
  await page.waitForTimeout(3000);

  const off = await state(page);
  expect(off.ssao).toBe("off");
  const defaults = { strength: off.strength, radius: off.radius };

  // The AUTHOR recommends a look.
  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.edit("recommend AO", (e) => {
      e.recommends = { ssaoStrength: 1.7, ssaoRadius: 3.5 };
    });
  });
  await page.waitForTimeout(600);
  expect((await state(page)).ssao, "a recommendation switched AO on").toBe(
    "off"
  );

  // The VIEWER switches it on, and sees the author's look.
  await tapToggle(page);
  const on = await state(page);
  expect([on.ssao, on.strength, on.radius]).toEqual(["on", 1.7, 3.5]);
  expect(on.running, "AO is not running while previewing").toBe(true);
  // …and the document gained nothing but what the author wrote.
  expect(on.docKeys).not.toContain("ssao");
  expect(on.recommends).toEqual({ ssaoStrength: 1.7, ssaoRadius: 3.5 });

  // The SLIDERS write the recommendation: click a quarter of the way along
  // the strength track (tosijs-3d's range, 0-3) and the document, the
  // preview and the panel must agree. Track, not caption: tosijs-3d#84.
  const track = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const caption = Array.from(ed.shadowRoot!.querySelectorAll("text")).find(
      (t) => (t.textContent ?? "").startsWith("ssaoStrength")
    );
    let group: Element | null = caption ?? null;
    while (group && group.getAttribute?.("data-w3d") !== "slider")
      group = group.parentElement;
    group?.setAttribute("data-probe", "ao-strength");
    const bar = Array.from(group?.querySelectorAll("rect") ?? [])
      .map((r) => r.getBoundingClientRect())
      .filter((b) => b.height > 0 && b.height < 12 && b.width > 20)
      .sort((x, y) => y.width - x.width)[0];
    return bar && { x: bar.x + bar.width * 0.25, y: bar.y + bar.height / 2 };
  });
  expect(track, "no ssaoStrength slider under the AO toggle").toBeTruthy();
  await page.mouse.click(track!.x, track!.y);
  await page.waitForTimeout(800);
  const slid = await state(page);
  const written = (slid.recommends as { ssaoStrength: number }).ssaoStrength;
  expect(written, "the slider did not write the document").not.toBe(1.7);
  expect(Math.abs(written - 0.75)).toBeLessThan(0.2);
  expect(slid.strength, "the preview did not follow").toBe(written);
  expect(
    await page.evaluate(
      () =>
        !!(
          document.querySelector("tosi-ensemble-editor") as Ed
        ).shadowRoot!.querySelector('[data-probe="ao-strength"]')
    ),
    "the panel was rebuilt under the slider"
  ).toBe(true);

  // A document with no recommendation previews at the element's defaults,
  // not the previous document's values.
  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.edit("drop recommendation", (e) => {
      delete e.recommends;
    });
  });
  await page.waitForTimeout(600);
  const bare = await state(page);
  expect([bare.ssao, bare.strength, bare.radius]).toEqual([
    "on",
    defaults.strength,
    defaults.radius,
  ]);

  // Remembered per browser: still on after a reload.
  await page.reload({ waitUntil: "domcontentloaded" });
  await ready(page);
  await page.waitForTimeout(3000);
  expect((await state(page)).ssao).toBe("on");

  // And off again.
  await tapToggle(page);
  const offAgain = await state(page);
  expect(offAgain.ssao).toBe("off");
  expect(offAgain.running, "AO still running after switching it off").toBe(
    false
  );

  expect(realErrors(errors)).toEqual([]);
});
