import { test, expect } from "@playwright/test";
import { EFFECT_PRESETS } from "tosijs-3d/effect-presets";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { allPanelTexts } from "./panel-locate.js";

/*
  AN EFFECT PIECE MAKES PARTICLES, where the piece stands. Measured in the
  renderer: live particles in Babylon's systems, not an element that exists.
  Then an edit to `preset` reaches the element without a rebuild, and a
  `recipe` with an http texture inside it is NOT handed to it (the https
  rule reaches into recipes, tosijs-3d#120).
*/
type Ps = { getActiveCount(): number; emitter: unknown; name: string };
type Ed = Element & {
  shadowRoot: ShadowRoot;
  ensemble: unknown;
  edit(
    d: string,
    m: (e: { pieces: Array<Record<string, unknown>> }) => void
  ): void;
};

test("an effect piece emits particles where it stands, and takes a preset edit live", async ({
  page,
}) => {
  test.setTimeout(180_000);
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );
  await page.waitForTimeout(3000);

  const read = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      const b3d = ed.shadowRoot.querySelector(
        "tosi-b3d"
      ) as unknown as Element & {
        scene: { particleSystems: Ps[] };
      };
      const els = Array.from(b3d.querySelectorAll("tosi-b3d-effect")) as Array<
        Element & { preset: string; x: number; z: number; recipe: unknown }
      >;
      const alive = b3d.scene.particleSystems.reduce(
        (n, ps) => n + ps.getActiveCount(),
        0
      );
      return {
        effects: els.map((e) => ({
          preset: e.preset,
          x: e.x,
          z: e.z,
          recipe: e.recipe ?? null,
        })),
        systems: b3d.scene.particleSystems.length,
        alive,
        elements: els,
      };
    });

  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.ensemble = {
      name: "vents",
      pieces: [
        { id: "sun", at: [-0.6, 0.5, -0.3], features: { sun: {} } },
        { id: "fill", at: [0, 0, 0], features: { light: {} } },
        { id: "floor", at: [0, 0, 0], features: { ground: {} } },
        {
          id: "vent",
          at: [12, 0, -4],
          features: {
            effect: {
              preset: "geyser",
              recipe: {
                layers: [
                  {
                    kind: "particles",
                    texture: "http://example.invalid/x.png",
                  },
                ],
              },
            },
          },
        },
      ],
    };
  });

  // Particles take a moment to start; sample THROUGH the interval.
  let first = await read();
  for (let i = 0; i < 40 && first.alive === 0; i++) {
    await page.waitForTimeout(250);
    first = await read();
  }
  console.log(JSON.stringify({ ...first, elements: undefined }));
  expect(first.effects.length, "no <tosi-b3d-effect> built").toBe(1);
  expect(first.effects[0]).toMatchObject({ preset: "geyser", x: 12, z: -4 });
  expect(
    first.effects[0]!.recipe,
    "the document's recipe reached the element"
  ).toBeNull();
  expect(first.alive, "the geyser emitted no particles").toBeGreaterThan(0);

  // A preset edit lands on the SAME element (no rebuild) and it keeps emitting.
  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    (window as unknown as { __before: Element }).__before =
      ed.shadowRoot.querySelector("tosi-b3d-effect")!;
    ed.edit("preset", (e) => {
      const vent = e.pieces.find((p) => p.id === "vent")!;
      (vent.features as { effect: { preset: string } }).effect.preset =
        "sparks";
    });
  });
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const el = ed.shadowRoot.querySelector("tosi-b3d-effect") as Element & {
      preset: string;
    };
    return {
      preset: el.preset,
      same: el === (window as unknown as { __before: Element }).__before,
    };
  });
  expect(after).toEqual({ preset: "sparks", same: true });
  let later = await read();
  for (let i = 0; i < 40 && later.alive === 0; i++) {
    await page.waitForTimeout(250);
    later = await read();
  }
  expect(later.alive, "sparks emitted nothing after the edit").toBeGreaterThan(
    0
  );
  expect(realErrors(errors)).toEqual([]);
});

/*
  YOUR OWN EFFECT: a clean recipe (a real preset's, its sprite swapped for
  inline SVG markup, which fetches nothing) reaches the element and plays.
  And the activity slider names its stops (tosijs-3d#121).
*/
test("a clean recipe plays, and activity shows its stop names", async ({
  page,
}) => {
  test.setTimeout(180_000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1400, height: 1100 });
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );
  await page.waitForTimeout(3000);
  const recipe = structuredClone(EFFECT_PRESETS.sparks!) as unknown as {
    layers: Array<{ kind: string; texture?: string }>;
  };
  const layer = recipe.layers.find((l) => l.kind === "particles")!;
  layer.texture =
    "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><circle cx='8' cy='8' r='7' fill='white'/></svg>";

  await page.evaluate((recipe) => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      select(id: string): void;
    };
    ed.ensemble = {
      name: "own",
      pieces: [
        { id: "sun", at: [-0.6, 0.5, -0.3], features: { sun: {} } },
        { id: "fill", at: [0, 0, 0], features: { light: {} } },
        {
          id: "mine",
          at: [0, 1, 0],
          features: { effect: { preset: "", recipe, activity: 0.5 } },
        },
      ],
    };
    ed.select("mine");
  }, recipe);

  let state = { hasRecipe: false, alive: 0 };
  for (let i = 0; i < 40 && !(state.hasRecipe && state.alive > 0); i++) {
    await page.waitForTimeout(250);
    state = await page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      const b3d = ed.shadowRoot.querySelector(
        "tosi-b3d"
      ) as unknown as Element & {
        scene: { particleSystems: Ps[] };
      };
      const el = b3d.querySelector("tosi-b3d-effect") as
        | (Element & { recipe: unknown })
        | null;
      return {
        hasRecipe: !!el?.recipe,
        alive: b3d.scene.particleSystems.reduce(
          (n, ps) => n + ps.getActiveCount(),
          0
        ),
      };
    });
  }
  expect(state.hasRecipe, "the clean recipe did not reach the element").toBe(
    true
  );
  expect(state.alive, "the recipe emitted no particles").toBeGreaterThan(0);

  await page.waitForTimeout(1000);
  const texts = (await allPanelTexts(page)).join(" ");
  expect(texts, "the activity slider does not name its stop").toContain(
    "semi-active"
  );
  expect(realErrors(errors)).toEqual([]);
});
