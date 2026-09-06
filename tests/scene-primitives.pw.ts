import { test, expect, type Page } from "@playwright/test";

/*
  THE STANDARD SCENE, VERIFIED AS A SCENE.

  "tosijs-3d's standard demo scene — sun, shadow rig, sky, ground, fog — is an
  ensemble, and loading it in one line is the point of the project." That claim
  is in CLAUDE.md, `static/ensembles/standard-scene.json` is the file it names,
  and until this test nothing had ever checked that loading it produces a sun.

  Every assertion here reads the RENDERER, not the element. That is the rule
  this project keeps relearning at cost: the attribute was set, the element
  accepted it, the test passed, and the mesh never moved. So `sun` is asserted
  as a DirectionalLight with the authored intensity, `ground` as a mesh whose
  bounding box is the authored width, and `fog` as `scene.fogMode` — never as
  "the attribute holds what we wrote".

  Values are read from the FILE rather than hard-coded, so editing the sample
  scene cannot leave this test asserting numbers nobody uses any more. A
  hard-coded 0.0015 here would silently become a test of history.
*/

/** Babylon's `Scene.FOGMODE_*`. Numbers on the wire, names in the assertion. */
const FOG_MODE = { none: 0, exp: 1, exp2: 2, linear: 3 } as const;

type Authored = {
  pieces: Array<{
    id: string;
    features?: Record<string, Record<string, number | string>>;
  }>;
};

const feature = (doc: Authored, id: string, name: string) =>
  doc.pieces.find((p) => p.id === id)!.features![name]!;

/**
 * Load the sample scene into the editor and hand back the rendered facts.
 *
 * The editor is the host because it already loads the package and builds
 * through `buildEnsemble` + `placeMesh` — the same path a game takes, which is
 * the property the one-package decision exists to guarantee. Nothing here
 * touches editor chrome.
 */
async function sceneFor(page: Page, url: string, expectName: string) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });

  await page.waitForFunction(
    () => {
      const ed = document.querySelector("tosi-ensemble-editor") as
        | (Element & { shadowRoot: ShadowRoot })
        | null;
      const b3d = ed?.shadowRoot?.querySelector("tosi-b3d") as
        | (Element & { scene?: unknown })
        | null;
      return !!b3d?.scene;
    },
    { timeout: 60_000 }
  );

  await page.evaluate(async (href) => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      load: (u: string) => Promise<void>;
    };
    await ed.load(href);
  }, url);

  /*
    ⚠️ WAIT FOR THE DOCUMENT, NOT A DURATION.

    The `/editor/` page carries its own `src` (the pirate cove), so a fixed
    sleep here measured whichever load happened to win — and on the first run
    it measured the cove while asserting against the standard scene, reporting
    a fog density of 0.00001 that belonged to a different document entirely.
    That is a confident wrong answer, which is the failure mode this whole lane
    exists to remove rather than reproduce.
  */
  await page.waitForFunction(
    (name) =>
      (
        document.querySelector("tosi-ensemble-editor") as Element & {
          ensemble?: { name?: string };
        }
      )?.ensemble?.name === name,
    expectName,
    { timeout: 30_000 }
  );
  // Now a beat for the renderer: a light's shadow rig lands on the next frame.
  await page.waitForTimeout(1500);

  const facts = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot;
      ensemble?: { name?: string };
    };
    const b3d = ed.shadowRoot.querySelector("tosi-b3d") as Element & {
      scene: {
        lights: Array<Record<string, unknown>>;
        meshes: Array<Record<string, unknown>>;
        activeCamera: Record<string, unknown> | null;
        fogMode: number;
        fogDensity: number;
        fogColor: { r: number; g: number; b: number };
      };
    };
    const s = b3d.scene;
    const light = (kind: string) =>
      s.lights
        .map(
          (l) =>
            l as unknown as {
              getClassName(): string;
              intensity: number;
              name: string;
            }
        )
        .find((l) => l.getClassName() === kind) ?? null;
    const mesh = (match: RegExp) =>
      s.meshes
        .map(
          (m) =>
            m as unknown as {
              name: string;
              getBoundingInfo(): {
                boundingBox: {
                  extendSizeWorld: { x: number; y: number; z: number };
                };
              };
            }
        )
        .find((m) => match.test(m.name)) ?? null;
    const ground = mesh(/^ground/);
    return {
      loaded: ed.ensemble?.name ?? null,
      lightKinds: s.lights
        .map((l) => (l as unknown as { getClassName(): string }).getClassName())
        .sort(),
      sun: (() => {
        const l = light("DirectionalLight");
        return l ? { intensity: l.intensity } : null;
      })(),
      fill: (() => {
        const l = light("HemisphericLight");
        return l ? { intensity: l.intensity } : null;
      })(),
      skyboxMesh: !!mesh(/^skybox/),
      // extendSize is the HALF extent, so a 400m plane reads 200.
      groundHalfWidth:
        ground?.getBoundingInfo().boundingBox.extendSizeWorld.x ?? null,
      hasCamera: !!s.activeCamera,
      fogMode: s.fogMode,
      fogDensity: s.fogDensity,
    };
  });

  return { facts, errors };
}

test.describe("the standard scene builds a standard scene", () => {
  test("every primitive reaches the renderer, and carries its authored value", async ({
    page,
    request,
  }) => {
    const doc = (await (
      await request.get("/ensembles/standard-scene.json")
    ).json()) as Authored;
    /*
      GUARD THE FIXTURE FIRST. The dev server answers a missing asset with the
      SPA shell at 200 (tosijs-ui#116), so "it parsed as JSON and has the
      pieces we expect" is the only honest proof we fetched the file rather
      than the site.
    */
    expect(doc.pieces.map((p) => p.id)).toEqual([
      "view",
      "key-light",
      "sun",
      "sky",
      "ground",
      "haze",
    ]);

    const { facts, errors } = await sceneFor(
      page,
      "/ensembles/standard-scene.json",
      "standard-scene"
    );
    expect(errors).toEqual([]);
    expect(facts.loaded).toBe("standard-scene");

    // `sun` — a directional light at the authored intensity, not an element
    // that accepted the word "intensity".
    expect(facts.sun).not.toBeNull();
    expect(facts.sun!.intensity).toBeCloseTo(
      Number(feature(doc, "sun", "sun").intensity),
      3
    );

    // `light` is a hemispheric FILL and must not have been collapsed into the
    // lamp or the sun — a distinction the format holds deliberately.
    expect(facts.fill).not.toBeNull();
    expect(facts.fill!.intensity).toBeCloseTo(
      Number(feature(doc, "key-light", "light").intensity),
      3
    );

    expect(facts.skyboxMesh).toBe(true);
    expect(facts.hasCamera).toBe(true);

    // `ground` — the authored width in WORLD units. This is the assertion that
    // would have caught `piece.scale` rendering 5.273 at every scale.
    expect(facts.groundHalfWidth).toBeCloseTo(
      Number(feature(doc, "ground", "ground").width) / 2,
      0
    );
  });

  test("fog reaches the SCENE, which is where it was once silently dead", async ({
    page,
    request,
  }) => {
    /*
      tosijs-3d#32: `b3d-fog` accepted `mode: 'linear'` with `start`/`end` while
      the scene ran EXP2, so the distances were dead config that read as
      working. Fixed upstream — and the only way to know it stays fixed is to
      ask the SCENE what mode it is in, which is what this does.

      We also removed `"none"` from our own fog schema this week, having found
      it rendered LINEAR. Same fault, same organ, found a different way.
    */
    const doc = (await (
      await request.get("/ensembles/standard-scene.json")
    ).json()) as Authored;
    const authored = feature(doc, "haze", "fog");
    const { facts } = await sceneFor(
      page,
      "/ensembles/standard-scene.json",
      "standard-scene"
    );

    expect(facts.fogMode).toBe(
      FOG_MODE[authored.mode as keyof typeof FOG_MODE]
    );
    expect(facts.fogDensity).toBeCloseTo(Number(authored.density), 6);
  });
});

test.describe("a load is not overtaken by the page's own src", () => {
  test("an explicit load survives the mount's in-flight fetch", async ({
    page,
  }) => {
    /*
      The page carries `src="/ensembles/pirate-cove.json"`. The mount defers,
      sets `_loadedSrc` and STARTS that fetch — a guard about starting a load,
      not about it landing. So an explicit `load()` won, and then the older
      fetch resolved and silently replaced it:

          t=102ms   ensemble.name  "standard-scene"   ← the explicit load
          t=870ms   ensemble.name  "pirate-cove"      ← the mount's, landing

      That is the 0.1.2 data-loss bug reached by the other door — that fix
      stopped a second load from STARTING, and nothing stopped the first from
      FINISHING. `load()` carries a generation now, and this watches the whole
      window rather than sampling the end of it: the failure was invisible to a
      single reading taken at the wrong moment, which is how it survived.
    */
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

    const names = await page.evaluate(async () => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        load: (u: string) => Promise<void>;
        ensemble?: { name?: string };
      };
      const seen: string[] = [];
      const tick = setInterval(() => {
        const n = ed.ensemble?.name;
        if (n && seen[seen.length - 1] !== n) seen.push(n);
      }, 50);
      void ed.load("/ensembles/standard-scene.json");
      await new Promise((r) => setTimeout(r, 6000));
      clearInterval(tick);
      return seen;
    });

    // It may legitimately show the cove BEFORE the explicit load lands. What it
    // must never do is go back to it afterwards.
    expect(names[names.length - 1]).toBe("standard-scene");
    expect(names.lastIndexOf("pirate-cove")).toBeLessThan(
      names.lastIndexOf("standard-scene")
    );
  });
});
