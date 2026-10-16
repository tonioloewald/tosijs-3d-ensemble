import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A STILL SKY IS LIT ON A COLD LOAD — five loads, measured from screenshots.

  Our skybox pins `realtimeScale: 0` so a scene does not drift into night.
  That exposed tosijs-3d#55: `updateSky` re-ran only when the CLOCK changed,
  and wrote the sun-dependent uniforms only once the sun's light existed — a
  separate element on its own schedule. A first pass that landed early left
  the SkyMaterial at its defaults, and four loads in five came up dark. We
  nudged `updateSky` on a timer until the sun appeared
  (`refreshSkyWhenSunExists`). tosijs-3d 0.8.1 gates the retry on the outcome,
  so that is gone, and this is what says so.

  The intermittent rule: one clean load is a coin flip on a bug that failed
  80% of the time, so this takes five FRESH page loads (the race is at load),
  touching nothing — a write to `timeOfDay` would re-run `updateSky` and hide
  it, which is why land-and-sky.pw.ts cannot answer this. The page is
  `/ensemble-element/`: `standard-scene.json` from pure markup, sky at 10:30.
*/
const LOADS = 5;

test("a still sky comes up lit on every cold load", async ({ page }) => {
  test.setTimeout(LOADS * 60_000);
  const errors = collectPageErrors(page);
  const medians: number[] = [];
  const skyMedian = async () => {
    const box = (await page.locator("tosi-b3d").first().boundingBox())!;
    // Inset past the corner buttons.
    const shot = await page.screenshot({
      clip: {
        x: box.x + 80,
        y: box.y + 80,
        width: box.width - 160,
        height: box.height - 120,
      },
    });
    return page.evaluate(async (b64: string) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const lum: number[] = [];
      for (let k = 0; k < d.length; k += 4)
        lum.push((d[k]! + d[k + 1]! + d[k + 2]!) / 3);
      lum.sort((a, b) => a - b);
      return lum[lum.length >> 1]!;
    }, shot.toString("base64"));
  };
  for (let i = 0; i < LOADS; i++) {
    await page.goto("/ensemble-element/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () =>
        !!(
          document.querySelector("tosi-ensemble") as
            | (Element & { built?: { pieces?: Map<string, unknown> } })
            | null
        )?.built?.pieces?.size,
      { timeout: 60_000 }
    );
    // Long enough for the sun to arrive and any retry to settle.
    await page.waitForTimeout(4000);
    /*
      LOOK UP. The default view is mostly ground plane under haze, and a
      clip of it measured the same 173 every load whatever the sky did — a
      vacuous pass, caught by eye. Tilting the CAMERA does not touch the
      skybox, so it cannot re-run updateSky and hide the race.
    */
    await page.evaluate(() => {
      const cam = (
        document.querySelector("tosi-b3d") as unknown as {
          scene: {
            activeCamera: {
              beta: number;
              upperBetaLimit: number | null;
              lowerBetaLimit: number | null;
            };
          };
        }
      ).scene.activeCamera;
      cam.upperBetaLimit = null;
      cam.lowerBetaLimit = null;
      cam.beta = 2.7;
    });
    await page.waitForTimeout(1500);
    medians.push(await skyMedian());
  }
  /*
    THE CONTROL, so a pass means something: the same view at 1 am must read
    dark. (Measured: 10:30 is a deep blue zenith, 1 am near black.)
  */
  await page.evaluate(() => {
    (
      document.querySelector("tosi-b3d-skybox") as unknown as {
        timeOfDay: number;
      }
    ).timeOfDay = 1;
  });
  await page.waitForTimeout(2000);
  const night = await skyMedian();
  console.log(
    `sky medians over ${LOADS} cold loads: ${medians.join(
      ", "
    )}; 1 am: ${night}`
  );
  expect(night, "the control: 1 am must read dark").toBeLessThan(20);
  for (const m of medians)
    expect(m, `${medians.join(", ")} (1 am: ${night})`).toBeGreaterThan(
      night + 25
    );
  expect(realErrors(errors)).toEqual([]);
});
