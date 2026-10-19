import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { allPanelTexts } from "./panel-locate.js";

/*
  A VOLCANO PIECE SHAPES THE GROUND AND SMOKES. Measured in the RENDERER: a
  ray cast down onto the terrain's tiles finds a cone where the piece stands
  and plain ground away from it, and the vent's effect (placed by the
  terrain from the volcano's `vents`) emits particles. Then the piece MOVES,
  and the cone and the vent move with it.
*/
type V = { x: number; y: number; z: number };
type Ed = Element & {
  shadowRoot: ShadowRoot;
  ensemble: unknown;
  edit(
    d: string,
    m: (e: { pieces: Array<{ id: string; at: number[] }> }) => void
  ): void;
};

const doc = (at: [number, number, number]) => ({
  name: "fuji",
  pieces: [
    { id: "sun", at: [-0.6, 0.5, -0.3], features: { sun: {} } },
    { id: "fill", at: [0, 0, 0], features: { light: {} } },
    {
      id: "view",
      at: [0, 100, 0],
      features: {
        camera: { distance: 1600, elevation: 35, maxDistance: 5000 },
      },
    },
    {
      id: "land",
      at: [0, 0, 0],
      features: {
        terrain: { grossAmplitude: 4, detailAmplitude: 1, reach: 2500 },
      },
    },
    {
      id: "fuji",
      at,
      features: { volcano: { radius: 420, height: 260, activity: 0.5 } },
    },
  ],
});

test("a volcano piece raises a cone where it stands, smokes, and moves", async ({
  page,
}) => {
  test.setTimeout(240_000);
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

  // Ground height under (x, z) as RENDERED: a ray down onto terrain tiles.
  const probe = (points: Array<[number, number]>) =>
    page.evaluate((points) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Ed;
      const b3d = ed.shadowRoot.querySelector(
        "tosi-b3d"
      ) as unknown as Element & {
        scene: {
          pickWithRay(
            r: unknown,
            pred: (m: { name: string; isEnabled(): boolean }) => boolean
          ): { hit: boolean; pickedPoint: V | null } | null;
          particleSystems: Array<{ getActiveCount(): number }>;
        };
      };
      const terrain = b3d.querySelector("tosi-b3d-terrain") as
        | (Element & {
            vents: Array<{
              x: number;
              z: number;
              preset: string;
              activity: number;
            }>;
            originOffset: { x: number; z: number };
          })
        | null;
      const off = terrain?.originOffset ?? { x: 0, z: 0 };
      // No BABYLON global on the page: borrow a Ray from the scene and re-aim
      // it (its origin and direction are Vector3s with `set`).
      type Vec = V & { set(x: number, y: number, z: number): void };
      const scene = b3d.scene as unknown as {
        activeCamera: unknown;
        createPickingRay(
          x: number,
          y: number,
          m: null,
          c: unknown
        ): { origin: Vec; direction: Vec; length: number };
      };
      const heights = points.map(([x, z]) => {
        const ray = scene.createPickingRay(0, 0, null, scene.activeCamera);
        ray.origin.set(x - off.x, 5000, z - off.z);
        ray.direction.set(0, -1, 0);
        ray.length = 10000;
        const hit = b3d.scene.pickWithRay(
          ray,
          (m) => m.isEnabled() && /terrain|tile/i.test(m.name)
        );
        return hit?.hit && hit.pickedPoint ? hit.pickedPoint.y : null;
      });
      const effects = b3d.querySelectorAll("tosi-b3d-effect").length;
      const alive = b3d.scene.particleSystems.reduce(
        (n, ps) => n + ps.getActiveCount(),
        0
      );
      return {
        heights,
        vents: terrain?.vents?.map((v) => ({
          x: Math.round(v.x),
          z: Math.round(v.z),
          preset: v.preset,
          activity: v.activity,
        })),
        effects,
        alive,
      };
    }, points);

  await page.evaluate((d) => {
    (document.querySelector("tosi-ensemble-editor") as Ed).ensemble = d;
  }, doc([300, 0, -200]));

  // Flank (inside the cone, outside the crater) vs. far plain ground.
  const flank: [number, number] = [300 + 150, -200];
  const plain: [number, number] = [300 - 1200, -200];
  let r = await probe([flank, plain]);
  for (
    let i = 0;
    i < 80 && !(r.heights[0] !== null && r.heights[1] !== null && r.alive > 0);
    i++
  ) {
    await page.waitForTimeout(250);
    r = await probe([flank, plain]);
  }
  console.log("placed", JSON.stringify(r));
  expect(r.vents).toEqual([
    { x: 300, z: -200, preset: "volcano", activity: 0.5 },
  ]);
  expect(r.heights[0], "no ground under the flank").not.toBeNull();
  expect(r.heights[1], "no ground on the plain").not.toBeNull();
  expect(
    r.heights[0]! - r.heights[1]!,
    "no cone where the volcano stands"
  ).toBeGreaterThan(80);
  expect(r.effects, "the terrain placed no vent effect").toBeGreaterThan(0);
  expect(r.alive, "the vent emitted nothing").toBeGreaterThan(0);

  // The panel shows the DERIVED crater radius (420 × 0.22), not 0, and the
  // document still leaves it out (so it keeps following the radius).
  await page.evaluate(() => {
    (
      document.querySelector("tosi-ensemble-editor") as Ed & {
        select(id: string): void;
      }
    ).select("fuji");
  });
  await page.waitForTimeout(1500);
  const texts = (await allPanelTexts(page)).join(" | ");
  console.log("panel", texts.slice(0, 600));
  expect(texts, "the crater radius is not shown as worked out").toMatch(
    /92\.4/
  );
  const written = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      ensemble: {
        pieces: Array<{
          id: string;
          features?: Record<string, Record<string, unknown>>;
        }>;
      };
    };
    return Object.keys(
      ed.ensemble.pieces.find((p) => p.id === "fuji")!.features!.volcano!
    );
  });
  expect(written).not.toContain("craterRadius");

  // MOVE the volcano: the cone and the vent follow.
  await page.evaluate(() => {
    (document.querySelector("tosi-ensemble-editor") as Ed).edit("move", (e) => {
      e.pieces.find((p) => p.id === "fuji")!.at = [-500, 0, 400];
    });
  });
  const newFlank: [number, number] = [-500 + 150, 400];
  let m = await probe([newFlank, flank]);
  for (
    let i = 0;
    i < 80 &&
    !(
      m.vents?.[0]?.x === -500 &&
      m.heights[0] !== null &&
      m.heights[1] !== null &&
      m.heights[0]! - m.heights[1]! > 80
    );
    i++
  ) {
    await page.waitForTimeout(250);
    m = await probe([newFlank, flank]);
  }
  // The vent is a new effect after the rebuild: give it time to start.
  for (let i = 0; i < 40 && m.alive === 0; i++) {
    await page.waitForTimeout(250);
    m = await probe([newFlank, flank]);
  }
  console.log("moved", JSON.stringify(m));
  expect(m.alive, "the moved vent emitted nothing").toBeGreaterThan(0);
  expect(m.vents).toEqual([
    { x: -500, z: 400, preset: "volcano", activity: 0.5 },
  ]);
  expect(
    m.heights[0]! - m.heights[1]!,
    "the cone did not move with the piece"
  ).toBeGreaterThan(80);
  expect(realErrors(errors)).toEqual([]);
});
