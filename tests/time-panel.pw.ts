import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { allPanelTexts } from "./panel-locate.js";

/*
  THE TIME PANEL (#3355): sim speed and the animation transport.

  ocean-rig's `reactor` is the sample library's `cube`, which carries an
  animation group. Library groups arrive STOPPED, so the first assertion is
  that the editor starts it. The rest MEASURE playback, frames advanced in a
  wall-clock interval, rather than reading `speedRatio` back: slow motion
  that leaves a rig at full speed is exactly what tosijs-3d#128 found, with
  every attribute reading correct.
*/

type Ed = HTMLElement & {
  ensemble?: { name?: string };
  load(src: string): Promise<void>;
  setTimeScale(n: number): void;
  setAnimationSpeed(n: number): void;
  scrubAnimations(t: number): void;
  playAnimations(on?: boolean): void;
  time: { playing: boolean; animations: number; timeScale: number };
  dirty: boolean;
};

test("the editor plays a rig's animations, slows them with the sim, and scrubs them", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      (document.querySelector("tosi-ensemble-editor") as Ed | null)?.ensemble
        ?.name === "pirate-cove",
    null,
    { timeout: 60_000 }
  );
  await page.evaluate(() =>
    (document.querySelector("tosi-ensemble-editor") as Ed).load(
      "/ensembles/ocean-rig.json"
    )
  );
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            (document.querySelector("tosi-ensemble-editor") as Ed).time
              .animations
        ),
      { message: "no animation groups arrived", timeout: 60_000 }
    )
    .toBeGreaterThan(0);

  /** Frames the reactor's clip advances in `ms` of wall time. */
  const advance = (ms: number) =>
    page.evaluate(async (ms) => {
      const ed = document.querySelector("tosi-ensemble-editor") as unknown as {
        _built: { pieces: Map<string, { element?: { mesh?: unknown } }> };
      };
      const body = ed._built.pieces.get("reactor")!.element!.mesh as {
        metadata: {
          animationGroups: Array<{
            isPlaying: boolean;
            from: number;
            to: number;
            animatables: Array<{ masterFrame: number }>;
          }>;
        };
      };
      const g = body.metadata.animationGroups[0]!;
      const frame = () => g.animatables[0]?.masterFrame ?? 0;
      const a = frame();
      await new Promise((r) => setTimeout(r, ms));
      const span = g.to - g.from;
      return {
        playing: g.isPlaying,
        frames: (frame() - a + span) % span,
        at: (frame() - g.from) / span,
      };
    }, ms);

  // Started: a library delivers it stopped.
  await expect
    .poll(async () => (await advance(100)).playing, { timeout: 10_000 })
    .toBe(true);
  const full = await advance(1000);
  expect(full.frames, "the rig never moved").toBeGreaterThan(10);

  // Closed at first; its button on the system bar opens it, and it says
  // what there is to play.
  const button = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as unknown as {
      _systemPanels: Map<string, Element & { isOpen: boolean }>;
      _scene: { _systemButtonOf: Map<Element, Element> };
    };
    const panel = ed._systemPanels.get("time")!;
    const r = ed._scene._systemButtonOf.get(panel)!.getBoundingClientRect();
    return { open: panel.isOpen, x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  expect(button.open).toBe(false);
  await page.mouse.click(button.x, button.y);
  await page.waitForTimeout(500);
  const texts = await allPanelTexts(page);
  expect(
    texts.some((t) => /^Animations \(\d+\)/.test(t)),
    texts.join(" | ")
  ).toBe(true);

  // Slow motion slows the rig (tosijs-3d#128: on its own it did not).
  await page.evaluate(() =>
    (document.querySelector("tosi-ensemble-editor") as Ed).setTimeScale(0.25)
  );
  await advance(200); // let a frame apply it
  const slow = await advance(1000);
  expect(
    slow.frames / full.frames,
    `full ${full.frames}, slow ${slow.frames}`
  ).toBeLessThan(0.5);

  // So does the transport's own speed, on top of the sim's.
  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.setTimeScale(1);
    ed.setAnimationSpeed(2);
  });
  await advance(200);
  const fast = await advance(1000);
  expect(
    fast.frames / full.frames,
    `full ${full.frames}, fast ${fast.frames}`
  ).toBeGreaterThan(1.5);

  // A scrub pauses the clip where it was put, and turns Play off.
  await page.evaluate(() =>
    (document.querySelector("tosi-ensemble-editor") as Ed).scrubAnimations(0.5)
  );
  await advance(200);
  const held = await advance(500);
  expect(held.playing).toBe(false);
  expect(held.frames).toBe(0);
  expect(Math.abs(held.at - 0.5)).toBeLessThan(0.02);
  expect(
    await page.evaluate(
      () => (document.querySelector("tosi-ensemble-editor") as Ed).time.playing
    )
  ).toBe(false);

  // Play resumes it.
  await page.evaluate(() =>
    (document.querySelector("tosi-ensemble-editor") as Ed).playAnimations()
  );
  await advance(200);
  expect((await advance(500)).frames).toBeGreaterThan(5);

  // None of it is the document's.
  expect(
    await page.evaluate(
      () => (document.querySelector("tosi-ensemble-editor") as Ed).dirty
    )
  ).toBe(false);
  expect(realErrors(errors)).toEqual([]);
});
