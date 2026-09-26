import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  LAND AND SKY — tosijs-3d 0.8.3's world, as an ensemble.

  `static/ensembles/land-and-sky.json` is upstream's kitchen-sink demo written
  as a document: terrain with a climate, a sea, the cloud deck, fog, and the
  ENCODED galaxy hosted at `https://3d.tosijs.net/sky/…`. Three claims, each
  of which failed silently at least once while writing it:

  1. **The galaxy is actually fetched — from the PINNED version.**
     `b3d-skybox` used to build its starfield once, in `sceneReady`, and the
     editor's backdrop has already created the sky before the document
     arrives — so the first version assigned `starfieldData` to an element
     that would never read it. Zero requests to `/sky/`, a daytime sky, no
     error. We re-mounted the sky to force it (0.8.3); tosijs-3d 0.8.4 made
     those attributes live (#88) and the re-mount is gone. This is the claim
     that says the upstream fix holds for us.

  2. **The sky is not black.** This project's worst bug
     was a sky rendered black by SkyMaterial churn, intermittently. So the
     sky's brightness at 14:00 is measured from a SCREENSHOT — the ground
     truth for anything visual here, since `readPixels` has lied before — and
     the test should be run with `--repeat-each` when this path changes.

  3. **One sky, one deck.** Singletons, discovered rather than tracked.

  Falsified on 0.8.3: with the re-mount removed, (1) failed with "no /sky/
  requests at all" — the exact silent failure it was written for.

  What it does NOT claim: that the stars look right. Headless SwiftShader
  draws them as faint specks — and upstream's own demo, screenshotted headless
  at 1 am as a control, looks the same. So "the data cube arrived" is the
  claim, and the picture is for a human with a GPU.

  ⚠️ The camera is at y≈196, below the deck. At y≈273 it sat inside the
  deck's whiteout band (altitude 280), which renders as a flat colour over
  the whole view and looks exactly like a broken scene.
*/
test("the land-and-sky sample builds its world and its galaxy", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1400, height: 1000 });
  const errors = collectPageErrors(page);
  const sky: string[] = [];
  page.on("response", (r) => {
    if (r.url().includes("3d.tosijs.net/sky/"))
      sky.push(`${r.status()} ${r.url()}`);
  });

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

  const counts = await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      load: (u: string) => Promise<void>;
      select: (id: string | null) => void;
      shadowRoot: ShadowRoot;
    };
    await ed.load("/ensembles/land-and-sky.json");
    ed.select(null);
    await new Promise((r) => setTimeout(r, 6000));
    const root = ed.shadowRoot;
    const skybox = root.querySelector("tosi-b3d-skybox") as
      | (Element & { timeOfDay: number })
      | null;
    // Noon-ish, so "is the sky alive" has an unambiguous answer.
    if (skybox) skybox.timeOfDay = 14;
    await new Promise((r) => setTimeout(r, 2500));
    return {
      skies: root.querySelectorAll("tosi-b3d-skybox").length,
      decks: root.querySelectorAll("tosi-b3d-cloud-deck").length,
      terrains: root.querySelectorAll("tosi-b3d-terrain").length,
      waters: root.querySelectorAll("tosi-b3d-water").length,
      // INSIDE the sky, which is the only place a moon is drawn from.
      // `big-moon` precedes `sky` in the file, so this is also the two-phase
      // contract: attached in `link`, after every piece has bound.
      moons: skybox?.querySelectorAll("tosi-b3d-moon").length ?? 0,
    };
  });
  expect(counts).toEqual({
    skies: 1,
    decks: 1,
    terrains: 1,
    waters: 1,
    moons: 2,
  });

  // 1. All six faces of the data cube, fetched and served.
  const faces = sky.filter(
    (s) => s.startsWith("200") && s.includes("/sky/0.8.4/stars_")
  );
  expect(faces.length, sky.join("\n") || "no /sky/ requests at all").toBe(6);

  // 2. The top of the view is SKY, and it is lit.
  const shot = await page.screenshot({
    clip: { x: 340, y: 70, width: 720, height: 160 },
  });
  const median = await page.evaluate(async (b64: string) => {
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
    for (let i = 0; i < d.length; i += 4)
      lum.push((d[i] + d[i + 1] + d[i + 2]) / 3);
    lum.sort((a, b) => a - b);
    return lum[lum.length >> 1];
  }, shot.toString("base64"));
  // Measured: 96 at 14:00. The failures this separates it from measured 26–28
  // — the 1 am sky, and the flat colour the camera sees from inside the deck.
  expect(median, "the sky at 14:00 is dark").toBeGreaterThan(70);

  expect(realErrors(errors)).toEqual([]);
});
