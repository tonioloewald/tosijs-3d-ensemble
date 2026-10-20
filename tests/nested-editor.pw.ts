import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { allPanelTexts, locate, reveal } from "./panel-locate.js";

/*
  DRILL IN, EDIT, POP OUT (board #3362, from Manta): "I edit a level which may
  itself use other ensembles. I can drill into an ensemble and edit that. Pop
  back out and check it works." With real clicks:

  1. a level nests the same rig twice; a click on a lamp INSIDE rig-a selects
     rig-a (a nested ensemble is a black box);
  2. "Open inside ⤵" makes the rig the document (breadcrumb, its own ids);
  3. an edit there saves to the RIG's store entry (idFor), not the level's;
  4. "⤴ Back to level" rebuilds the level, and BOTH rigs show the edit, read
     from the renderer's lights.
*/
const FILES: Record<string, unknown> = {
  "level.json": {
    name: "level",
    pieces: [
      { id: "sun", at: [-0.6, 0.5, -0.3], features: { sun: {} } },
      { id: "rig-a", ensemble: "kit/rig.json", at: [6, 0, 0], rot: [0, 90, 0] },
      { id: "rig-b", ensemble: "kit/rig.json", at: [-6, 0, 0] },
    ],
  },
  "kit/rig.json": {
    name: "rig",
    pieces: [
      { id: "deck", at: [0, 1, 0], features: { lamp: {} } },
      { id: "mast", at: [2, 2, 0], features: { lamp: {} } },
    ],
  },
};

type Ed = Element & {
  shadowRoot: ShadowRoot;
  store: unknown;
  ensemble: { name: string; pieces: Array<{ id: string; at: number[] }> };
  selection: { id: string } | null;
  nestPath: string[];
  dirty: boolean;
  load(url: string): Promise<void>;
  update(id: string, patch: Record<string, unknown>): void;
  saveToStore(id?: string): Promise<void>;
};

const lightAt = (page: import("@playwright/test").Page, id: string) =>
  page.evaluate((id) => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      _built: {
        pieces: Map<
          string,
          {
            handles: Map<
              string,
              { light?: { position: { x: number; y: number; z: number } } }
            >;
          }
        >;
      };
    };
    const p = ed._built?.pieces.get(id)?.handles.get("lamp")?.light?.position;
    return p ? [p.x, p.y, p.z].map((v) => Math.round(v * 1000) / 1000) : null;
  }, id);

test("drill into a nested rig, edit it, save it, pop out and see it in both places", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);
  await page.route("**/nest-edit/**", (route) => {
    const path = new URL(route.request().url()).pathname.replace(
      /^.*\/nest-edit\//,
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
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      (
        document.querySelector("tosi-ensemble-editor") as Element & {
          ensemble?: { name?: string };
        }
      )?.ensemble?.name === "pirate-cove",
    null,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1500);

  await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    const w = window as unknown as { __writes: string[] };
    w.__writes = [];
    ed.store = {
      list: async () => [],
      read: async () => ({ name: "x", pieces: [] }),
      write: async (id: string) => {
        w.__writes.push(id);
        return { id };
      },
      idFor: (src: string) =>
        src.endsWith("/nest-edit/kit/rig.json")
          ? "store/rig.json"
          : src.endsWith("/nest-edit/level.json")
          ? "store/level.json"
          : null,
    };
    await ed.load("/nest-edit/level.json");
  });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element & {
          _built?: { pieces: Map<string, unknown> };
        }
      )._built?.pieces.has("rig-b/mast"),
    null,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1500);
  expect(await lightAt(page, "rig-a/deck")).toEqual([6, 1, 0]);
  expect(await lightAt(page, "rig-b/deck")).toEqual([-6, 1, 0]);

  // 1. A click on a lamp INSIDE rig-a selects rig-a: find its beacon on screen.
  const spot = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      _beacons: { index(): Map<unknown, string> };
    };
    const b3d = ed.shadowRoot.querySelector("tosi-b3d") as unknown as {
      scene: {
        pick(
          x: number,
          y: number,
          f: (m: unknown) => boolean
        ): { hit: boolean };
        getEngine(): { getRenderingCanvas(): HTMLCanvasElement };
      };
    };
    const beacons = ed._beacons.index();
    const canvas = b3d.scene.getEngine().getRenderingCanvas();
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const mine = (m: unknown) => beacons.get(m) === "rig-a/deck";
    for (let y = 0; y < rect.height; y += 4)
      for (let x = 0; x < rect.width; x += 4)
        if (b3d.scene.pick(x * sx, y * sy, mine).hit)
          return { x: rect.left + x + 2, y: rect.top + y + 2 };
    return null;
  });
  expect(spot, "rig-a's deck lamp is not on screen").not.toBeNull();
  await page.mouse.click(spot!.x, spot!.y);
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            (document.querySelector("tosi-ensemble-editor") as Ed).selection?.id
        ),
      {
        message: "a click inside the rig did not select the rig",
        timeout: 30_000,
      }
    )
    .toBe("rig-a");

  // 2. Open inside, with a real click.
  await expect
    .poll(async () => (await allPanelTexts(page)).join(" "), {
      timeout: 30_000,
    })
    .toContain("Open inside ⤵");
  const open = await reveal(page, "Open inside ⤵");
  expect(open, "no Open inside button").toBeTruthy();
  await page.mouse.click(open!.x + open!.w / 2, open!.y + open!.h / 2);
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const ed = document.querySelector("tosi-ensemble-editor") as Ed;
          return { name: ed.ensemble.name, path: ed.nestPath };
        }),
      { message: "Open inside did not open the rig", timeout: 30_000 }
    )
    .toEqual({ name: "rig", path: ["level", "rig-a"] });
  expect(await lightAt(page, "deck")).toEqual([0, 1, 0]);

  // 3. Edit inside, and Save writes the RIG's entry.
  const saved = await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.update("deck", { at: [0, 4, 0] });
    const dirty = ed.dirty;
    await ed.saveToStore();
    return {
      dirty,
      clean: !ed.dirty,
      writes: (window as unknown as { __writes: string[] }).__writes,
    };
  });
  expect(saved).toEqual({
    dirty: true,
    clean: true,
    writes: ["store/rig.json"],
  });

  // 4. Back out, with a real click, and both rigs carry the edit.
  const back = await reveal(page, "⤴ Back to level");
  expect(back, "no Back button").toBeTruthy();
  await page.mouse.click(back!.x + back!.w / 2, back!.y + back!.h / 2);
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const ed = document.querySelector("tosi-ensemble-editor") as Ed;
          return { name: ed.ensemble.name, selected: ed.selection?.id };
        }),
      { message: "Back did not return to the level", timeout: 30_000 }
    )
    .toEqual({ name: "level", selected: "rig-a" });
  await expect
    .poll(() => lightAt(page, "rig-a/deck"), { timeout: 30_000 })
    .toEqual([6, 4, 0]);
  expect(await lightAt(page, "rig-b/deck")).toEqual([-6, 4, 0]);
  expect(realErrors(errors)).toEqual([]);
});

/*
  0.8.0 review majors, the editor's nested state:
  M1 loading the same nested document twice keeps its nested pieces (the
     setter built before the url was known, so refs resolved against the page);
  M2 Back with unsaved changes, then Open inside again: still unsaved;
  M3 opening another document while drilled in clears the drill stack.
*/
test("reload, re-drill and open-while-inside keep the nested state honest", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const requested: string[] = [];
  await page.route("**/nest-edit/**", (route) => {
    const path = new URL(route.request().url()).pathname.replace(
      /^.*\/nest-edit\//,
      ""
    );
    requested.push(path);
    const body = FILES[path];
    return body
      ? route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(body),
        })
      : route.fulfill({ status: 404, body: "missing" });
  });
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      (
        document.querySelector("tosi-ensemble-editor") as Element & {
          ensemble?: { name?: string };
        }
      )?.ensemble?.name === "pirate-cove",
    null,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1500);
  const has = (id: string) =>
    page.evaluate(
      (id) =>
        !!(
          document.querySelector("tosi-ensemble-editor") as Element & {
            _built?: { pieces: Map<string, unknown> };
          }
        )._built?.pieces.has(id),
      id
    );

  // M1: load, then load the SAME url again.
  await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed;
    ed.store = {
      list: async () => [],
      read: async () => ({ name: "x", pieces: [] }),
      write: async (id: string) => ({ id }),
      idFor: (src: string) =>
        src.endsWith("/nest-edit/kit/rig.json") ? "store/rig.json" : null,
    };
    await ed.load("/nest-edit/level.json");
  });
  await expect.poll(() => has("rig-a/deck"), { timeout: 30_000 }).toBe(true);
  await page.evaluate(async () => {
    await (document.querySelector("tosi-ensemble-editor") as Ed).load(
      "/nest-edit/level.json"
    );
  });
  await expect
    .poll(() => has("rig-a/deck"), {
      message: "reloading the same document lost its nested pieces",
      timeout: 30_000,
    })
    .toBe(true);
  expect(
    requested.filter((r) => !r.startsWith("level") && !r.startsWith("kit/")),
    "a nested ref was fetched against the page"
  ).toEqual([]);

  // M2: drill in, edit, Back WITHOUT saving, drill in again: still unsaved.
  const dirtyAgain = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      drillIn(id: string): boolean;
      popOut(): boolean;
    };
    ed.drillIn("rig-a");
    ed.update("deck", { at: [0, 7, 0] });
    const first = ed.dirty;
    ed.popOut();
    ed.drillIn("rig-a");
    return {
      first,
      again: ed.dirty,
      deck: ed.ensemble.pieces.find((p) => p.id === "deck")!.at,
    };
  });
  expect(dirtyAgain).toEqual({ first: true, again: true, deck: [0, 7, 0] });

  // M3: open another document while inside: the drill stack goes.
  const after = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      popOut(): boolean;
    };
    ed.ensemble = { name: "other", pieces: [] } as never;
    return { path: ed.nestPath, back: ed.popOut(), name: ed.ensemble.name };
  });
  expect(after).toEqual({ path: ["other"], back: false, name: "other" });
});

/*
  0.8.0 review: scrubbing a nested piece's transform REBUILT THE SCENE every
  step (the old "rotation isn't live" regression, back for nested pieces).
  Children without features are now written in place, like any plain piece:
  12 rotation steps, no rebuild, and a child's node really turned.
*/
const KIT = "https://cdn.tosijs.net/kenney/libraries/pirate-kit.glb";
const MESH_FILES: Record<string, unknown> = {
  "level.json": {
    name: "level",
    libraries: [{ name: "pirate", url: KIT }],
    pieces: [{ id: "rig-a", ensemble: "kit/rig.json", at: [0, 0, 0] }],
  },
  "kit/rig.json": {
    name: "rig",
    libraries: [{ name: "pirate", url: KIT }],
    pieces: [
      { id: "deck", mesh: "structure-platform-dock", at: [3, 0, 0] },
      { id: "sand", mesh: "patch-sand", at: [-3, 0, 0] },
    ],
  },
};

test("scrubbing a nested piece's rotation moves its children live, without rebuilding", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  await page.route("**/nest-mesh/**", (route) => {
    const path = new URL(route.request().url()).pathname.replace(
      /^.*\/nest-mesh\//,
      ""
    );
    const body = MESH_FILES[path];
    return body
      ? route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(body),
        })
      : route.fulfill({ status: 404, body: "missing" });
  });
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      (
        document.querySelector("tosi-ensemble-editor") as Element & {
          ensemble?: { name?: string };
        }
      )?.ensemble?.name === "pirate-cove",
    null,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    await (document.querySelector("tosi-ensemble-editor") as Ed).load(
      "/nest-mesh/level.json"
    );
  });
  type Body = {
    element?: {
      mesh?: {
        computeWorldMatrix(f: boolean): void;
        forward: { x: number; z: number };
      };
    } | null;
    node?: {
      computeWorldMatrix(f: boolean): void;
      forward: { x: number; z: number };
    } | null;
  };
  const facing = () =>
    page.evaluate(() => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        _built?: { pieces: Map<string, Body> };
      };
      const b = ed._built?.pieces.get("rig-a/deck");
      const n = b?.element?.mesh ?? b?.node;
      if (!n) return null;
      n.computeWorldMatrix(true);
      return Math.round((Math.atan2(n.forward.x, n.forward.z) * 180) / Math.PI);
    });
  await expect.poll(facing, { timeout: 60_000 }).not.toBeNull();
  await page.waitForTimeout(1500);
  const before = await facing();

  const rebuilds = await page.evaluate(async () => {
    const ed = document.querySelector("tosi-ensemble-editor") as Ed & {
      rebuild(o?: unknown): void;
    };
    let count = 0;
    const real = ed.rebuild.bind(ed);
    ed.rebuild = (o?: unknown) => {
      count++;
      real(o);
    };
    for (let deg = 0; deg <= 90; deg += 7.5) {
      ed.update("rig-a", { rot: [0, deg, 0] });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    ed.rebuild = real;
    return count;
  });
  await page.waitForTimeout(500);
  const after = await facing();
  console.log(JSON.stringify({ before, after, rebuilds }));
  expect(rebuilds, "scrubbing a nested piece rebuilt the scene").toBe(0);
  expect(Math.abs(((after! - before! + 540) % 360) - 180)).toBe(90);
  // ...and it MOVED with the turn: (3, 0, 0) turned 90° about y is (0, 0, -3).
  const where = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      _built?: {
        pieces: Map<
          string,
          {
            element?: {
              mesh?: {
                getAbsolutePosition(): { x: number; y: number; z: number };
              };
            } | null;
            node?: {
              getAbsolutePosition(): { x: number; y: number; z: number };
            } | null;
          }
        >;
      };
    };
    const b = ed._built!.pieces.get("rig-a/deck")!;
    const p = (b.element?.mesh ?? b.node)!.getAbsolutePosition();
    return [p.x, p.y, p.z].map((v) => Math.round(v * 100) / 100);
  });
  expect(where).toEqual([0, 0, -3]);
});
