import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  NESTED ENSEMBLES BUILD WHERE THEIR PARENTS PUT THEM. A level nests a rig
  twice (turned 90°, and doubled); the rig nests a lamp post twice (once
  turned), by a bare name relative to the rig's own url. Every lamp's LIGHT is
  read from the renderer and compared with positions worked out by hand:

    lamp-post.json   bulb at (0, 3, 0)
    kit/rig.json     post at (2, 0, 0); post2 at (-2, 0, 1) turned 90°;
                     deck lamp at (0, 1, 0)
    level.json       rig-a at (20, 0, 0) turned 90°; rig-b at (-20, 0, 0)
                     scale 2; rig-off disabled; its own lamp at (0, 5, 0)

  Turning 90° about y maps (x, y, z) to (z, y, -x).
*/
const FILES: Record<string, unknown> = {
  "level.json": {
    name: "level",
    pieces: [
      { id: "own", at: [0, 5, 0], features: { lamp: {} } },
      {
        id: "rig-a",
        ensemble: "kit/rig.json",
        at: [20, 0, 0],
        rot: [0, 90, 0],
      },
      { id: "rig-b", ensemble: "kit/rig.json", at: [-20, 0, 0], scale: 2 },
      {
        id: "rig-off",
        ensemble: "kit/rig.json",
        at: [0, 0, 50],
        enabled: false,
      },
    ],
  },
  "kit/rig.json": {
    name: "rig",
    pieces: [
      { id: "post", ensemble: "lamp-post", at: [2, 0, 0] },
      { id: "post2", ensemble: "lamp-post", at: [-2, 0, 1], rot: [0, 90, 0] },
      { id: "deck", at: [0, 1, 0], features: { lamp: {} } },
    ],
  },
  "kit/lamp-post.json": {
    name: "lamp-post",
    pieces: [{ id: "bulb", at: [0, 3, 0], features: { lamp: {} } }],
  },
};

const EXPECTED: Record<string, [number, number, number]> = {
  own: [0, 5, 0],
  "rig-a/post/bulb": [20, 3, -2],
  "rig-a/post2/bulb": [21, 3, 2],
  "rig-a/deck": [20, 1, 0],
  "rig-b/post/bulb": [-16, 6, 0],
  "rig-b/post2/bulb": [-24, 6, 2],
  "rig-b/deck": [-20, 2, 0],
};

test("a level of nested rigs builds every lamp where its parents put it", async ({
  page,
}) => {
  test.setTimeout(180_000);
  const errors = collectPageErrors(page);
  await page.route("**/nest-test/**", (route) => {
    const path = new URL(route.request().url()).pathname.replace(
      /^.*\/nest-test\//,
      ""
    );
    const body = FILES[path];
    return body
      ? route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(body),
        })
      : route.fulfill({ status: 404, body: "missing" });
  });
  await page.goto("/ensemble-element/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      ((
        document.querySelector("tosi-ensemble") as
          | (Element & { built?: { pieces: Map<string, unknown> } })
          | null
      )?.built?.pieces.size ?? 0) > 0,
    null,
    { timeout: 60_000 }
  );

  await page.evaluate(() => {
    (
      document.querySelector("tosi-ensemble") as HTMLElement & { src: string }
    ).src = "/nest-test/level.json";
  });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble") as Element & {
          built?: { pieces: Map<string, unknown> };
        }
      )?.built?.pieces.has("rig-b/post2/bulb"),
    null,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1000);

  const result = await page.evaluate((ids) => {
    const el = document.querySelector("tosi-ensemble") as Element & {
      built: {
        pieces: Map<
          string,
          {
            element?: Element & {
              light?: { position: { x: number; y: number; z: number } };
            };
          }
        >;
        problems: Array<{ code: string }>;
      };
    };
    const out: Record<string, number[] | null> = {};
    for (const id of ids) {
      const piece = el.built.pieces.get(id) as unknown as
        | {
            handles?: Map<
              string,
              {
                light?: { position: { x: number; y: number; z: number } };
                x?: number;
                y?: number;
                z?: number;
              }
            >;
          }
        | undefined;
      // The RENDERER's light, never the element's attributes: an attribute
      // being set is not a light that moved.
      const lamp = piece?.handles?.get("lamp");
      const p = lamp?.light?.position;
      out[id] = p ? [p.x, p.y, p.z] : null;
    }
    return {
      positions: out,
      ids: [...el.built.pieces.keys()].sort(),
      problems: el.built.problems.map((p) => p.code),
    };
  }, Object.keys(EXPECTED));
  console.log(JSON.stringify(result));

  expect(result.ids).toEqual(Object.keys(EXPECTED).sort());
  expect(result.problems.filter((c) => c.startsWith("nested"))).toEqual([]);
  for (const [id, want] of Object.entries(EXPECTED)) {
    const got = result.positions[id];
    expect(got, `${id} has no lamp`).not.toBeNull();
    for (let i = 0; i < 3; i++)
      expect(Math.abs(got![i]! - want[i]!), `${id}[${i}]`).toBeLessThan(1e-3);
  }
  expect(realErrors(errors)).toEqual([]);
});
