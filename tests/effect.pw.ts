import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  AN EFFECT PIECE MAKES PARTICLES, where the piece stands. Measured in the
  renderer: live particles in Babylon's systems, not an element that exists.
  Then an edit to `preset` reaches the element without a rebuild, and a
  `recipe` in the document is NOT handed to it (its fetched URLs are not yet
  marked upstream, tosijs-3d#120; see features-scene.ts).
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
                    texture: "https://example.invalid/x.png",
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
