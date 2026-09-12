/*#
# Scene features

The primitives a tosijs-3d scene is made of, registered as ensemble features so
that a whole scene — sun, sky, shadows, ground, weather — is **data you load**
rather than boilerplate you retype.

```typescript
import { registerSceneFeatures, loadEnsemble } from 'tosijs-3d-ensemble'

registerSceneFeatures()
await loadEnsemble('/ensembles/standard-scene.json', { scene })
```

## Each feature, in isolation and in combination

The example below builds ONE scene and the fences under it assert what each
feature put in the renderer. Isolation and combination in the same place is the
point: a feature that works alone and breaks beside another is the failure mode
a per-feature unit test cannot see, and `fog` + `skybox` are wired together on
purpose (`syncSkybox`).

```js
import { b3d } from 'tosijs-3d'
import { buildEnsemble, placeMesh, registerSceneFeatures } from 'tosijs-3d-ensemble'

registerSceneFeatures()

const scene = b3d({})
preview.append(scene)

// One document naming six primitives, built the way a game builds one.
globalThis.__featureDemo = {
  scene,
  ensemble: {
    name: 'feature-demo',
    pieces: [
      { id: 'view', at: [0, 1, 0], features: { camera: { distance: 14 } } },
      { id: 'fill', at: [0, 1, 0], features: { light: { intensity: 0.6 } } },
      { id: 'sun', at: [-0.4, 1, 0.3], features: { sun: { intensity: 1.2 } } },
      { id: 'sky', at: [0, 0, 0], features: { skybox: { timeOfDay: 9 } } },
      { id: 'floor', at: [0, 0, 0], features: { ground: { width: 60, height: 60 } } },
      { id: 'haze', at: [0, 0, 0], features: { fog: { mode: 'exp2', density: 0.0015 } } },
    ],
  },
  build: () =>
    buildEnsemble(globalThis.__featureDemo.ensemble, {
      scene,
      placePiece: placeMesh,
    }),
}
```

```test
// LINE COMMENTS ONLY in a fence: a block comment would end the enclosing doc
// comment at its first close token, because block comments do not nest.
// The fence has its OWN import scope — the example's imports are not in it —
// and specifiers must be SINGLE-quoted, which is the parser's rule rather than
// JavaScript's (filed as tosijs-ui#141).
import { buildEnsemble, placeMesh, sceneFloorplan, floorplanDiff } from 'tosijs-3d-ensemble'

const el = await waitFor('tosi-b3d', 5000)
const demo = globalThis.__featureDemo

// Wait for the SCENE rather than a duration — the engine mounts on a task.
for (let i = 0; i < 200 && !el.scene; i++) await waitMs(50)
const scene = el.scene
const built = demo.build()

test('every feature reported no problem AND put something in the renderer', async () => {
  // `problems` is the format's own report. It has been wrong in the direction
  // that matters — 20 of 20 "built" with an empty scene — so it is checked
  // ALONGSIDE the renderer, never instead of it.
  expect(built.problems.filter((p) => p.severity === 'error')).toEqual([])
  expect(built.pieces.size).toBe(6)

  await waitMs(400)
  const kinds = scene.lights.map((l) => l.getClassName())
  expect(kinds.includes('DirectionalLight')).toBe(true)   // sun
  expect(kinds.includes('HemisphericLight')).toBe(true)   // light
  expect(scene.meshes.some((m) => m.name.startsWith('skybox'))).toBe(true)
  expect(scene.meshes.some((m) => m.name.startsWith('ground'))).toBe(true)
  expect(Boolean(scene.activeCamera)).toBe(true)
})

test('the camera can actually SEE it — the cheap version of "looks right"', async () => {
  // The programmatic stand-in for a human refreshing the page and glancing at
  // it. Not a screenshot: a screenshot comparison is flaky, and this project
  // has already had `readPixels` report [1,1,1] for a frame that was visibly
  // red, so pixels are not a trustworthy witness either.
  //
  // `getActiveMeshes()` is: it is the post-frustum-culling draw list, so a
  // non-empty one means the camera is pointed at geometry that is being
  // rendered THIS frame. That catches the whole family of "it built fine and
  // the page is black" — an empty scene, a camera looking the wrong way, a
  // ground plane a thousand units below the eye — none of which a mesh count
  // or a problems array can see.
  await waitMs(600)
  expect(Boolean(scene.activeCamera)).toBe(true)
  const drawn = scene.getActiveMeshes().length
  expect(drawn > 0).toBe(true)

  // And the loop is turning. A frozen render loop is the other way a correct
  // scene shows nothing — a throw inside a render observer kills it silently,
  // and Babylon does not re-queue.
  expect(el.engine.getFps() > 0).toBe(true)
})

test('an authored value survives the trip to the renderer', async () => {
  await waitMs(400)

  // ⚠️ `sun.intensity` is NOT the light's intensity once a `skybox` is in the
  // same ensemble. b3d-shadows says so — "overridden by skybox when present" —
  // and a b3dSkybox sets a flag after which the sun stops writing
  // `light.intensity` at all, driving it from time-of-day and treating the
  // authored number as a multiplier.
  //
  // Worth an assertion rather than a note, because it is an authoring trap:
  // set 1.2, read something else, and nothing is wrong. This is also the case
  // for testing features in COMBINATION — alone, the sun owns its light.
  const sun = scene.lights.find((l) => l.getClassName() === 'DirectionalLight')
  expect(Boolean(sun)).toBe(true)
  expect(sun.intensity > 0).toBe(true)

  const ground = scene.meshes.find((m) => m.name.startsWith('ground'))
  const half = ground.getBoundingInfo().boundingBox.extendSizeWorld.x
  expect(Math.round(half)).toBe(30) // width 60

  // Fog reaches the SCENE, which is where it was once silently dead: an
  // authored `linear` ran EXP2 upstream, and a `none` we offered ran LINEAR.
  expect(scene.fogMode).toBe(2)
  expect(Math.round(scene.fogDensity * 1e6) / 1e6).toBe(0.0015)
})

test('a rebuild does not move the picture — structural, not pixels', async () => {
  // The visual-regression assertion, with no image in it. `sceneFloorplan`
  // snapshots what the camera can SEE, at world geometry; `floorplanDiff`
  // compares two snapshots with a tolerance you set rather than one the GPU
  // sets for you. A rectangle in the same place, or very nearly, versus
  // absent — that is signal. 3.2% of pixels differing is not.
  //
  // This is the assertion an editor most needs and could least make: it
  // rebuilds on every edit, so 'the rebuild moved something' is the whole
  // risk, and nothing short of looking could previously say.
  await waitMs(400)
  const before = sceneFloorplan(scene, { ignore: /^ensemble-editor-/ })
  expect(before.length > 0).toBe(true)

  const again = buildEnsemble(demo.ensemble, { scene, placePiece: placeMesh })
  await waitMs(500)
  const changes = floorplanDiff(before, sceneFloorplan(scene, { ignore: /^ensemble-editor-/ }))
  // A failure NAMES the thing — 'ground: moved (0,0,0) → (0,-12,0)' — instead
  // of handing you a heat map to interpret.
  expect(changes.map((c) => c.name + ':' + c.kind)).toEqual([])
  again.dispose()
})

test('a second build REUSES the singletons rather than stacking them', async () => {
  // A game builds once; the editor rebuilds on every edit, so this is the
  // difference between a session that stays put and one that degrades.
  //
  // The scene primitives are singletons on purpose — one sun, one sky, one
  // fog — so a second build must not add a second of each. My first version of
  // this test asserted the opposite and failed, which is the harness earning
  // its place: the assumption was wrong, not the code.
  await waitMs(300)
  const before = scene.lights.length
  const extra = buildEnsemble(demo.ensemble, { scene, placePiece: placeMesh })
  await waitMs(400)
  expect(scene.lights.length).toBe(before)
  extra.dispose()
})
```

That is the point of the format, and it is not a combat format: `describe an
arrangement, consume it anywhere`. A fortification is one kind of ensemble; so
is the standard demo scene, a botanical garden, or an architectural site.

## A scene feature is a feature with no mesh

`features` was always an open map bound by registrations, so a piece whose body
IS its feature needs no special case — it simply has no `mesh`:

```jsonc
{ "id": "sun",    "at": [0, 1, 0], "features": { "sun": { "intensity": 1 } } },
{ "id": "sky",    "at": [0, 0, 0], "features": { "skybox": { "timeOfDay": 11 } } },
{ "id": "ground", "at": [0, 0, 0], "features": { "ground": { "width": 400, "texture": "checker" } } }
```

## Combat is somewhere else, on purpose

`destroyable`, `turret`, `launcher`, `protector`, `blip` and `launchpad` are NOT
here — they are a domain vocabulary in [[presets/combat]], registered by a
consumer that wants them. An earlier version shipped them as built-ins next to
`terrain` and `water`, which quietly made every consumer's scene format a combat
format.
*/
/*{"parent":"Runtime","order":3}*/
import {
  DEFAULT_LIGHT,
  sceneSchemas,
  b3dAmbient,
  b3dAreaLight,
  b3dPointLight,
  b3dSpotLight,
  lightColor,
  lightSettingsSchema,
  b3dClouds,
  b3dFog,
  b3dGround,
  b3dLight,
  b3dReflections,
  b3dSkybox,
  b3dSound,
  b3dSun,
  b3dTerrain,
  b3dWater,
} from "tosijs-3d";
import { registerFeature } from "../format/registry.js";
import type { FeatureContext, SceneElement } from "../format/registry.js";

const num = (min: number, max: number, def?: number, unit?: string) => ({
  type: "number",
  minimum: min,
  maximum: max,
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { "x-unit": unit } : {}),
});

type Spec = Record<string, unknown>;

/**
 * Property specs that this repo failed to find upstream. Empty; a test says so.
 *
 * Exported for that test, not for consumers.
 */
export const schemaDrift: string[] = [];

/**
 * The properties an author should see, taken from **tosijs-3d's own schema**.
 *
 * We used to hand-copy every range, unit and enum out of the elements. It
 * drifted in every direction at once, and every kind of drift was SILENT:
 *
 * | ours                              | the element                            |
 * | --------------------------------- | -------------------------------------- |
 * | `underwaterFog: boolean`          | a NUMBER, 0..1 — the toggle wrote `true` |
 * | `ambient.preset` default `birds`  | unknown preset → falls back to `motes` |
 * | `ambient.where` default `air`     | not in `'always' \| 'underwater' \| 'above'` |
 * | `fog.mode` offered `none`         | unknown mode → falls back to LINEAR    |
 * | `applyFog` default `true`         | the element defaults `false`           |
 * | 6 of skybox's 16 properties       | nobody decided to drop the other ten   |
 *
 * Not one of those was reported by anything. A panel showed a control, the
 * author moved it, and the scene did what it was already doing — which is this
 * project's oldest lesson (*a control that does nothing is worse than no
 * control*) reached by a route no test was watching.
 *
 * So the SHAPE of a property — its type, range, unit, scale and enum — now
 * comes from `sceneSchemas` (tosijs-3d#63, our ask), and cannot drift again
 * because it is not copied. Two things stay ours, because they are genuinely
 * editorial rather than factual:
 *
 * - **which** properties an author sees. `terrainSchema()` has 30, of which
 *   `poolSize`, `fillBudget` and `tileBuildMs` are engine tuning. A curated
 *   panel is the product; the full attribute list is the reference.
 * - **`overrides`**, for a default that is an AUTHORING choice rather than the
 *   element's resting state — a sun sized for a landscape, a still sky. Each
 *   one below says why it is not just drift wearing a nicer name.
 *
 * A key that upstream drops lands in `schemaDrift` and warns, rather than
 * throwing: this runs inside `registerSceneFeatures()` at page load, and a
 * throw there is a black screen. The test is what makes it loud.
 */
/**
 * EVERY property upstream's schema declares for a scene primitive.
 *
 * Not the same list as `pick()` returns, and the difference is the point.
 * `pick` is EDITORIAL — which properties an author should see in a panel, 17
 * of terrain's 30, with `poolSize` and `fillBudget` left out as engine tuning.
 * That makes it exactly the wrong allow-list for deciding what a DOCUMENT may
 * carry: a file written by hand or by a generator may legitimately set an
 * attribute the panel does not offer, and `b3d-terrain`'s `majorRadius` and
 * `minorRadius` are the two dimensions a torus is made of.
 *
 * Narrowing to the curated list silently stripped them — a safety filter
 * deleting real content, which is worse than the injection it was added to
 * stop. So `declaredConfig` narrows to THIS, and `innerHTML` is still not in
 * it.
 */
const acceptsOf = (name: keyof typeof sceneSchemas): string[] =>
  Object.keys(
    (sceneSchemas[name]() as { properties: Record<string, unknown> }).properties
  );

const pick = (
  name: keyof typeof sceneSchemas,
  keys: readonly string[],
  overrides: Record<string, Spec> = {}
): Record<string, Spec> => {
  const source = (sceneSchemas[name]() as { properties: Record<string, Spec> })
    .properties;
  const out: Record<string, Spec> = {};
  for (const key of keys) {
    const spec = source[key];
    if (!spec) {
      const where = `${name}.${key}`;
      if (!schemaDrift.includes(where)) {
        schemaDrift.push(where);
        console.warn(
          `tosijs-3d-ensemble: "${where}" is no longer in tosijs-3d's schema — the field is omitted from the panel rather than shown with invented bounds.`
        );
      }
      continue;
    }
    // Upstream says `format: 'color'`; our panel reads `x-widget`. One line
    // here beats teaching every call site both spellings.
    const widget = spec.format === "color" ? { "x-widget": "color" } : {};
    out[key] = { ...spec, ...widget, ...(overrides[key] ?? {}) };
  }
  return out;
};

/**
 * Apply a feature's config to the element it created, without rebuilding.
 *
 * Every scene feature is a thin mapping from config onto element attributes, so
 * "update" is just assignment — the transforms in the binds are DEFAULTS
 * (`stillSky` supplies `realtimeScale: 0` when the config omits it) and
 * placement (`x`/`y`/`z` from `ctx.at`), neither of which a feature-value edit
 * changes.
 *
 * Assign only what DIFFERS. tosijs is observant: an element property write is a
 * pin-point update and an unchanged write is skipped, but going through every
 * key on every frame of a drag would still churn the ones nobody touched.
 */
export function updateAttrs(
  handle: unknown,
  cfg: Record<string, unknown>
): boolean {
  const element = handle as Record<string, unknown> | null;
  if (!element || typeof element !== "object") return false;
  for (const [key, value] of Object.entries(cfg)) {
    if (element[key] !== value) element[key] = value;
  }
  return true;
}

/**
 * Ask a terrain to actually build its ground.
 *
 * ⚠️ **A terrain that is appended and configured renders NOTHING.** It
 * preallocates a tile pool — 120 meshes with `isVisible: false` and no
 * bounds — and fills it only when told to. Measured: `regenerate()` took the
 * visible count from 0 to 120 in one call.
 *
 * Upstream says so for the authored hooks ("Set it, then `regenerate()`"), and
 * it is true of the ordinary attributes too. So this is the first built-in
 * feature to be exercised in a live scene, and it did not work — which is the
 * changelog's "thin bindings, unverified" arriving on schedule.
 *
 * DEFERRED, because the element runs `sceneReady` after it joins the document
 * and there is nothing to regenerate before that. Retried on a short budget for
 * the same reason `place-mesh` retries: "appended" is not "ready", and calling
 * once, immediately, is a silent no-op one layer down.
 */
function regenerateWhenReady(element: unknown, ctx: FeatureContext): void {
  const target = element as { regenerate?: () => void } | null;
  if (!target?.regenerate) return;
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    try {
      target.regenerate?.();
      clearInterval(timer);
    } catch {
      // Not ready yet. A throw here is expected early and fatal late, so the
      // budget is what turns "too soon" into "give up" rather than a spin.
      if (tries >= 40) clearInterval(timer);
    }
  }, 50);
  ctx.onDispose(() => clearInterval(timer));
}

/** Append an element to the scene and tear it down on dispose. */
export function add(ctx: FeatureContext, el: unknown): SceneElement {
  const element = el as SceneElement;
  ctx.scene.appendChild(element);
  ctx.onDispose(() => element.remove());
  return element;
}

/*
  THERE CAN ONLY BE ONE SKY.

  A scene-wide feature — sky, sun, fog, ambient, clouds, reflections — is not a
  thing you place, it is a property of the scene. Two of them is not "two
  skies", it is a bug: the owner's rule is that whoever wants sky should
  "create it if needed and modify what's there otherwise".

  Getting this wrong cost a day. `add` removes its element on dispose, and the
  editor rebuilds by disposing then building, so every rebuild destroyed the
  skybox element and made a new one. `b3d-skybox` builds a
  `new SkyMaterial('skybox', scene)` in `sceneReady` and never disposes it, so
  they accumulated — MEASURED: five SkyMaterials, four orphaned, on a fresh page
  load with no edits at all. They share a name, so Babylon's effect cache gives
  them one shared GL program, and disposing any one of them DELETES that program
  for the survivor. The survivor keeps answering `isReady() === true`, because
  Babylon never revalidates the GL object, and draws pure black.

  That is the black sky, and the reason it was intermittent — roughly one load
  in three or four came up blue — is that it depended on which of the five got
  disposed last. Filed as tosijs-3d#51; this side of it is ours.

  So a singleton is DISCOVERED, not tracked: `querySelector` finds a sky
  whichever layer made it, including the editor's backdrop, so the two can never
  both create one.
*/
interface Claim {
  element: SceneElement;
  /** Did the build that just ran still want this? Cleared on dispose. */
  claimed: boolean;
}

const singletons = new WeakMap<object, Map<string, Claim>>();

/**
 * Create a scene-wide element, or update the one already there.
 *
 * Never removed on dispose — that is the whole point, since dispose-then-build
 * is exactly what churns it. Dispose only releases the CLAIM;
 * `reapUnclaimedSingletons` removes what the following build did not re-claim,
 * so deleting the `sky` piece still removes the sky.
 */
export function addSingleton(
  ctx: FeatureContext,
  tag: string,
  make: () => unknown,
  cfg: Record<string, unknown>
): SceneElement {
  const scene = ctx.scene as unknown as object;
  let claims = singletons.get(scene);
  if (!claims) {
    claims = new Map();
    singletons.set(scene, claims);
  }

  // Discover rather than trust the map: a scene can be torn down under us, and
  // the backdrop appends its own sky without going through here.
  let claim = claims.get(tag);
  if (!claim?.element.isConnected) {
    const found = (
      ctx.scene as unknown as {
        querySelector?: (sel: string) => SceneElement | null;
      }
    ).querySelector?.(tag);
    claim = found ? { element: found, claimed: true } : undefined;
  }

  if (claim) {
    // Modify what's there. These are tosijs elements, so assigning properties
    // is the reactive path — no teardown, no new material, no dead program.
    Object.assign(claim.element, cfg);
    claim.claimed = true;
  } else {
    const element = make() as SceneElement;
    ctx.scene.appendChild(element);
    claim = { element, claimed: true };
  }

  claims.set(tag, claim);
  const held = claim;
  ctx.onDispose(() => {
    held.claimed = false;
  });
  return claim.element;
}

/**
 * Remove scene-wide elements the latest build did not ask for.
 *
 * Call AFTER a rebuild, never between dispose and build — in between, every
 * claim is released and this would remove the sky the next line recreates,
 * which is the churn it exists to prevent.
 */
/**
 * Sky config with the clock stopped unless the ensemble asked otherwise.
 *
 * Pure, and separate from the feature, because the element does NOT expose
 * creator props synchronously — a test that read `el.realtimeScale` straight
 * after `b3dSkybox(...)` got the CLASS DEFAULT back and would have passed for
 * entirely the wrong reason. What matters is the config handed over, so that is
 * what is testable.
 */
export function stillSky(
  cfg: Record<string, unknown>
): Record<string, unknown> {
  return { realtimeScale: 0, ...cfg };
}

/*
  A STILL SKY ONLY GETS ONE CHANCE, AND IT USUALLY MISSES.

  `b3d-skybox` re-runs `updateSky` from its frame observer ONLY when
  `timeOfDay` differs from the last value it drew:

      if (attrs.timeOfDay !== this._lastSkyTime) { ...; this.updateSky() }

  and `updateSky` writes `sunPosition`, `rayleigh` and `turbidity` only inside
  `if (sunEl?.light != null)`. The sun is a SEPARATE element whose light appears
  on its own schedule, so when that first call lands before it, the SkyMaterial
  keeps its defaults and the sky renders dark — which reads as night, and was
  reported as night.

  With the upstream default `realtimeScale: 10` this healed itself by accident:
  `timeOfDay` drifted every tick, the gate reopened constantly, and some later
  pass caught the sun. Pinning the clock to 0 — to stop the sky wandering into
  actual night — removed the accident, and four loads in five came up dark. One
  fix uncovered the other.

  So nudge it until the sun is really there. On TIMERS, not a render observer:
  a backgrounded tab stops rAF entirely and this has to converge whether or not
  anyone is watching. Filed upstream — `updateSky` should re-run when its INPUTS
  change, not only when the clock does.
*/
function refreshSkyWhenSunExists(
  element: SceneElement,
  ctx: FeatureContext
): void {
  const sky = element as unknown as {
    updateSky?: () => void;
    sunEl?: { light?: unknown } | null;
    isConnected?: boolean;
  };
  let ticks = 0;
  const timer = setInterval(() => {
    // Bounded: a scene with no sun at all must not poll for the whole session.
    if (sky.isConnected === false || ++ticks > 30) {
      clearInterval(timer);
      return;
    }
    try {
      sky.updateSky?.();
    } catch {
      clearInterval(timer);
      return;
    }
    // The pass above ran WITH the light present, so the material is written.
    if (sky.sunEl?.light != null) clearInterval(timer);
  }, 100);
  ctx.onDispose(() => clearInterval(timer));
}

export function reapUnclaimedSingletons(scene: unknown): void {
  const claims = singletons.get(scene as object);
  if (!claims) return;
  for (const [tag, claim] of [...claims]) {
    if (claim.claimed) continue;
    claim.element.remove();
    claims.delete(tag);
  }
}

interface ArcCamera {
  radius: number;
  alpha: number;
  beta: number;
  target: { x: number; y: number; z: number };
  lowerRadiusLimit?: number | null;
  upperRadiusLimit?: number | null;
  lowerBetaLimit?: number | null;
  upperBetaLimit?: number | null;
}

/**
 * Run `apply` once the scene has a camera, and return a canceller.
 *
 * The camera arrives with the scene, which may not have happened when a feature
 * binds — an ensemble can be appended before `<tosi-b3d>` is ready. Polls on
 * animation frames with a deadline rather than an interval that outlives the
 * page, and swallows nothing silently: if the camera never appears, the feature
 * simply did not apply, and the scene keeps its own.
 */
function whenCamera(
  ctx: { scene: SceneElement },
  apply: (camera: ArcCamera) => void
): () => void {
  const scene = ctx.scene as unknown as { camera?: ArcCamera };
  if (scene.camera?.target) {
    apply(scene.camera);
    return () => {};
  }
  let cancelled = false;
  const deadline = 120; // frames — about two seconds, then give up quietly
  let frames = 0;
  const tick = () => {
    if (cancelled) return;
    if (scene.camera?.target) {
      // A throw here would land inside a rAF callback, not the render loop, but
      // guard anyway: the editor rebuilds constantly and one bad frame should
      // not take the session.
      try {
        apply(scene.camera);
      } catch {
        /* the scene keeps its own camera */
      }
      return;
    }
    if (++frames > deadline) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return () => {
    cancelled = true;
  };
}

let registered = false;

/**
 * Register the scene primitives. Idempotent.
 *
 * Positioned features (`light`, `sun`, `ground`, `water`, `skybox`) take the
 * piece's `at`; global ones (`fog`, `clouds`, `ambient`, `reflections`) ignore
 * it, because "the fog is at (3, 0, 12)" means nothing.
 */
export function registerSceneFeatures(): void {
  if (registered) return;
  registered = true;

  registerFeature({
    name: "light",
    icon: "🔦",
    primitive: true,
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Light",
      // `0.9` rather than the element's `1`: a fill sits UNDER a sun, and a
      // full-strength hemispheric wash flattens the shadows the sun is there
      // to cast.
      "x-accepts": acceptsOf("light"),
      properties: pick("light", ["intensity", "diffuse", "specular"], {
        intensity: { default: 0.9 },
      }),
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dLight({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  });

  /*
    A LAMP IS NOT THE `light` FEATURE, AND MUST NOT REPLACE IT.

    `light` is a HemisphericLight — an ambient fill, which is what a scene's
    `fill` piece wants and what it has always meant. A lamp is a thing you PLACE:
    a point, spot or area light with a range, a cone, geometry you can see, and
    a time-varying program. Collapsing them would have broken every fill in
    every file to gain nothing.

    The whole of it is ONE field. `lightSettingsSchema()` marks it
    `x-widget: "light"`, so a generated panel hands the entire lamp to
    tosijs-3d's editor — power, colour, intensity and the four-curve program
    with its shared attack/sustain splits — and we write no widget code and hold
    no invariants we cannot express.
  */
  registerFeature({
    name: "lamp",
    icon: "💡",
    primitive: true,
    /*
      NOT `updateAttrs`. A lamp's config is ONE field, `settings`, and the bind
      spreads it across the light element's own attributes — so the blanket
      helper would have set `element.settings = {…}`, an attribute no light has,
      and reported success. That is a control that does nothing, arrived at by
      assuming every feature maps config onto attributes 1:1. Ten of thirteen
      do; this is one that does not.
    */
    update: (handle, cfg) => {
      const element = handle as unknown as Record<string, unknown> & {
        tagName?: string;
      };
      if (!element?.tagName) return false;
      const settings = {
        ...DEFAULT_LIGHT,
        ...((cfg.settings as Partial<typeof DEFAULT_LIGHT>) ?? {}),
      };
      /*
        A CHANGED `kind` IS A DIFFERENT ELEMENT, so it is structural and the
        caller must rebuild. Saying "applied" here would leave a point light in
        the scene while the document said spot, with nothing to report it.
      */
      const wanted =
        settings.kind === "spot"
          ? "TOSI-B3D-SPOT-LIGHT"
          : settings.kind === "area"
          ? "TOSI-B3D-AREA-LIGHT"
          : "TOSI-B3D-POINT-LIGHT";
      if (element.tagName.toUpperCase() !== wanted) return false;
      return updateAttrs(handle, {
        intensity: settings.intensity,
        range: settings.range,
        diffuse: lightColor(settings),
        // Strings, not booleans — see the note in `bind`.
        on: settings.on ? "on" : "off",
        shadows: settings.shadows ? "on" : "off",
        ...(settings.kind === "spot" ? { angle: settings.angle } : {}),
        program: settings.program ?? null,
      });
    },
    marker: true,
    /*
      THE LIGHT IS THE PIECE'S BODY, and saying so is what makes a lamp
      MOVABLE. Without this the element is just a handle: `built.element` stays
      null, `placeMesh` finds no `mesh` and supplies nothing, and the piece ends
      up with no body at all — so the editor writes a new position into the JSON
      and there is nothing in the scene to write it to. Dragging the lantern
      updated the file and moved no light.

      This is the case `body` was always for and the registry doc says so: a
      feature whose body is genuinely its own, rather than a decoration on a
      placed mesh.
    */
    body: true,
    schema: {
      type: "object",
      title: "Lamp",
      properties: {
        settings: lightSettingsSchema({ title: "Lamp" }) as never,
      },
    },
    bind: (_piece, cfg, ctx) => {
      const settings = {
        ...DEFAULT_LIGHT,
        ...((cfg.settings as Partial<typeof DEFAULT_LIGHT>) ?? {}),
      };
      const place = { x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] };
      /*
        `on` and `shadows` cross as 'on'/'off' STRINGS, not booleans: an absent
        HTML boolean attribute reads false, so a lamp written with a true
        default would arrive switched off. Upstream calls that out and tosijs
        now throws on a true-default boolean rather than failing silently.
      */
      const common = {
        ...place,
        intensity: settings.intensity,
        range: settings.range,
        diffuse: lightColor(settings),
        on: settings.on ? "on" : "off",
        shadows: settings.shadows ? "on" : "off",
      };
      const element =
        settings.kind === "spot"
          ? b3dSpotLight({ ...common, angle: settings.angle })
          : settings.kind === "area"
          ? b3dAreaLight(common)
          : b3dPointLight(common);
      const mounted = add(ctx, element);
      /*
        The program is an OBJECT, so it is set as a property rather than an
        attribute — an attribute would stringify it.
      */
      (mounted as unknown as { program?: unknown }).program =
        settings.program ?? null;
      return mounted;
    },
  });

  registerFeature({
    name: "sun",
    icon: "☀️",
    primitive: true,
    insertAt: [-0.5, 1, 0.4],
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Sun and shadows",
      /*
        The overrides are LANDSCAPE defaults. The element rests at values
        tuned for a small demo scene — `activeDistance: 30`, no cascades, no
        shadow map — and an ensemble is routinely a coastline. `x`/`y`/`z` are
        not picked: they are the sun's DIRECTION, and the piece's `at` is it.
      */
      "x-accepts": acceptsOf("sun"),
      properties: pick(
        "sun",
        [
          "intensity",
          "shadowDarkness",
          "shadowTextureSize",
          "numCascades",
          "activeDistance",
          "shadowMaxZ",
        ],
        {
          shadowDarkness: { default: 0.4 },
          shadowTextureSize: { default: 1024 },
          numCascades: { default: 2 },
          activeDistance: { default: 400 },
        }
      ),
    },
    bind: (_piece, cfg, ctx) => {
      const placed = { ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] };
      return addSingleton(ctx, "tosi-b3d-sun", () => b3dSun(placed), placed);
    },
  });

  registerFeature({
    name: "skybox",
    icon: "🌌",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Sky",
      /*
        TIME OF DAY MUST STAND STILL UNLESS ASKED NOT TO.

        `b3d-skybox` defaults `realtimeScale` to 10 and advances `timeOfDay`
        on a 100 ms interval, which works out at a full day/night cycle every
        FORTY MINUTES. An ensemble is a static description of an arrangement,
        so a file that says `timeOfDay: 11` and renders dusk is simply wrong —
        and leaving the editor open walked the sky into night, reported as "is
        it night time?" after a long session. Measured across one session:
        10.06 → 10.23 → 10.29 with nothing touching it.

        So the format defaults it to 0 — a still sky — and a scene that wants a
        moving one opts in. That also makes an ensemble REPRODUCIBLE: load the
        same file twice and get the same light.

        ⚠️ The named-decade CYCLER this used to be is gone. It stood in for a
        slider that could span 0..3600 and still reach zero, and 0.8.0's
        `slider3d` has exactly that (`x-scale: log` + `x-zero-stop`) — which is
        how upstream's own `realtimeScale` is already spelled. Keeping the
        cycler would mean keeping a hand-written enum next to a schema that
        describes the control properly (tosijs-3d#62).

        `timeOfDay` opens at 11 rather than the element's 6.5 for the same
        reason a photograph is not taken at dawn: an author needs to SEE the
        thing being arranged, and 6.5 is half-light.
      */
      "x-accepts": acceptsOf("skybox"),
      properties: pick(
        "skybox",
        [
          "timeOfDay",
          "realtimeScale",
          "latitude",
          "azimuth",
          "turbidity",
          "luminance",
          "sunColor",
          "duskColor",
          "moonColor",
          "moonIntensity",
          "applyFog",
        ],
        {
          timeOfDay: { default: 11 },
          realtimeScale: { default: 0, title: "Time speed" },
        }
      ),
    },
    bind: (_piece, cfg, ctx) => {
      const still = stillSky(cfg);
      const element = addSingleton(
        ctx,
        "tosi-b3d-skybox",
        () => b3dSkybox({ ...still }),
        still
      );
      refreshSkyWhenSunExists(element, ctx);
      return element;
    },
  });

  registerFeature({
    name: "ground",
    icon: "🟫",
    primitive: true,
    insertAt: "height",
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Ground plane",
      // A ground plane is the FLOOR of an arrangement, so it opens big enough
      // to stand something on — the element's 4×4 m is a demo prop. `checker`
      // because an untextured grey plane gives an author no sense of scale.
      "x-accepts": acceptsOf("ground"),
      properties: pick(
        "ground",
        ["width", "height", "color", "texture", "textureTiles"],
        {
          width: { default: 400 },
          height: { default: 400 },
          texture: { default: "checker" },
          textureTiles: { default: 20 },
        }
      ),
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dGround({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  });

  registerFeature({
    name: "camera",
    icon: "🎥",
    primitive: true,
    /*
      NO `update`: this feature's handle is a stop FUNCTION, not an element —
      it drives the scene camera through `whenCamera`. `updateAttrs` would have
      returned false anyway, but by accident rather than by decision, and the
      caller's rebuild is the correct answer here.
    */
    marker: true,
    schema: {
      type: "object",
      title: "Camera",
      properties: {
        distance: num(0.1, 20000, 12, "m"),
        heading: num(-360, 360, -60, "°"),
        elevation: num(-89, 89, 20, "°"),
        minDistance: num(0.1, 20000),
        maxDistance: num(0.1, 20000),
        minElevation: num(-89, 89),
        maxElevation: num(-89, 89),
      },
    },
    /*
      The camera is the scene's, not ours — so this feature CONFIGURES it and
      puts it back on dispose, rather than creating one. The editor rebuilds on
      every edit; a feature that left the camera where it moved it would walk
      the view across the world one keystroke at a time.

      The piece's `at` is the LOOK-AT point, which is the useful meaning of a
      position for a camera. `distance`/`heading`/`elevation` are the orbit
      around it, in degrees — matching the format's rule that angles are degrees
      everywhere, while Babylon's arc camera is radians.

      Without this, a scene comes up wherever the default camera happens to sit:
      8 m from the origin, pointing at the ground, which renders as a featureless
      grey rectangle that looks exactly like a broken scene.
    */
    bind: (_piece, cfg, ctx) => {
      const deg = (n: number) => (n * Math.PI) / 180;
      const stop = whenCamera(ctx, (camera) => {
        const before = {
          radius: camera.radius,
          alpha: camera.alpha,
          beta: camera.beta,
          target: {
            x: camera.target.x,
            y: camera.target.y,
            z: camera.target.z,
          },
        };
        camera.radius = (cfg.distance as number) ?? 12;
        camera.alpha = deg((cfg.heading as number) ?? -60);
        // Babylon's beta is measured from straight DOWN, so an elevation of 0°
        // (level with the target) is beta = 90°, not 0.
        camera.beta = deg(90 - ((cfg.elevation as number) ?? 20));
        camera.target.x = ctx.at[0];
        camera.target.y = ctx.at[1];
        camera.target.z = ctx.at[2];
        if (cfg.minDistance !== undefined)
          camera.lowerRadiusLimit = cfg.minDistance as number;
        if (cfg.maxDistance !== undefined)
          camera.upperRadiusLimit = cfg.maxDistance as number;
        if (cfg.maxElevation !== undefined) {
          camera.lowerBetaLimit = deg(90 - (cfg.maxElevation as number));
        }
        if (cfg.minElevation !== undefined) {
          camera.upperBetaLimit = deg(90 - (cfg.minElevation as number));
        }
        ctx.onDispose(() => {
          camera.radius = before.radius;
          camera.alpha = before.alpha;
          camera.beta = before.beta;
          camera.target.x = before.target.x;
          camera.target.y = before.target.y;
          camera.target.z = before.target.z;
        });
      });
      ctx.onDispose(stop);
      return null;
    },
  });

  registerFeature({
    name: "sound",
    icon: "🔊",
    primitive: true,
    update: updateAttrs,
    marker: true,
    schema: {
      type: "object",
      title: "Sound",
      properties: {
        url: { type: "string", title: "Audio file" },
        loop: { type: "boolean", default: true },
        autoplay: { type: "boolean", default: true },
        volume: num(0, 1, 1),
        spatialSound: { type: "boolean", default: true },
        refDistance: num(0.1, 100, 1, "m"),
        maxDistance: num(1, 2000, 60, "m"),
        rolloffFactor: num(0, 10, 1),
      },
    },
    /*
      A placed sound is a thing at a POSITION, which is why it belongs to a
      piece rather than to the scene: "the fountain burbles" is a fact about
      where the fountain is, and moving the fountain should move the burble.
    */
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dSound({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  });

  registerFeature({
    name: "reflections",
    icon: "🪞",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Reflection probe",
      // `probeSize: 0` is the element's "off"; a probe you have placed on
      // purpose should render, so it opens at a usable resolution.
      "x-accepts": acceptsOf("reflections"),
      properties: pick(
        "reflections",
        ["probeSize", "refreshRate", "maxDistance", "farDistance"],
        { probeSize: { default: 128 }, maxDistance: { default: 200 } }
      ),
    },
    bind: (_piece, cfg, ctx) =>
      addSingleton(
        ctx,
        "tosi-b3d-reflections",
        () => b3dReflections({ ...cfg }),
        cfg
      ),
  });

  registerFeature({
    name: "terrain",
    icon: "⛰️",
    primitive: true,
    insertAt: "height",
    // `biome` is an on/off ENUM upstream, so it needs the same mapping the
    // bind applies. `updateAttrs` alone would write a boolean and do nothing.
    update: (handle, cfg) => {
      const changed = updateAttrs(handle, {
        ...cfg,
        biome: cfg.biome ? "on" : "off",
      });
      // Setting attributes is not rebuilding the ground. Without this a slider
      // moves a number and the terrain keeps its old shape — the same silent
      // nothing as never generating it in the first place.
      (handle as { regenerate?: () => void })?.regenerate?.();
      return changed;
    },
    schema: {
      type: "object",
      title: "Terrain",
      /*
        ⚠️ THIS SCHEMA WAS HAND-WRITTEN AND WRONG THREE SEPARATE WAYS IN ONE
        DAY, and then wrong again in ways nobody counted.

        `biome` was declared a free string when it is an on/off enum. Every
        default sat under 3% of its slider track. `reach` was unbounded into
        tab-death. Then the VALUES turned out to be invented: `grossScale` is a
        FREQUENCY (0.005..0.3) and we had it as metres, 1..1,000,000,
        defaulting to 4000 — four orders of magnitude outside the useful range,
        wearing a unit it does not have.

        The second pass hand-copied `b3d-terrain`'s demo instead of guessing,
        which was better and still a copy, and the note here said so: "it will
        drift again, which is the argument for tosijs-3d#66". #66 landed in
        0.8.0. The ranges, units and log scales below are now the element's
        own, and cannot drift, because nothing here restates them.

        What stays ours is the CURATION — `terrainSchema()` has 30 properties
        and `poolSize`, `fillBudget`, `tileBuildMs`, `profile` and `debugColor`
        are engine tuning, not authoring — plus the four overrides, each of
        which is a decision rather than a copy.
      */
      "x-accepts": acceptsOf("terrain"),
      properties: pick(
        "terrain",
        [
          "seed",
          "surfaceType",
          "radius",
          "grossScale",
          "detailScale",
          "horizScale",
          "grossAmplitude",
          "detailAmplitude",
          "baseHeight",
          "normalSmoothing",
          "biome",
          "biomeSeaLevel",
          "biomeLapseRate",
          "tileSize",
          "lodLevels",
          "reach",
          "wireframe",
        ],
        {
          // A seed is typed or stepped, never dragged: no seed is near another.
          seed: { type: "integer", maximum: 9999, default: 111 },
          // An ensemble's terrain is a landscape. A cylinder is a planet.
          surfaceType: { default: "plane" },
          /*
            ⚠️ NO `x-scale` HERE ANY MORE. We added one because six decades of
            travel make a linear track unusable; tosijs-3d@0.8.1 added the same
            to `terrainSchema()`, so restating it is exactly the drift this
            file exists to stop. The drift test is what noticed — it failed on
            the upgrade because our exception list still claimed a deviation
            that had stopped being one.
          */
          radius: { default: 1000 },
          /*
            THE FORMAT KEEPS A BOOLEAN. Upstream spells this `'on' | 'off'`
            because an absent HTML boolean attribute reads false, but that is
            an ELEMENT concern — a JSON document has real booleans, and files
            already say `"biome": true`. The bind maps it; see below.
          */
          biome: { type: "boolean", enum: undefined, default: false },
          biomeSeaLevel: { "x-requires": { biome: true } },
          biomeLapseRate: { "x-requires": { biome: true } },
          grossAmplitude: { default: 250 },
          detailAmplitude: { default: 45 },
          horizScale: { default: 8 },
          /*
            ⚠️ A FLOOR THE ELEMENT DOES NOT HAVE. Finest-level tiles go as
            `(2·reach / tileSize)²`, and these are two separate sliders — so it
            is the PRODUCT that kills the tab. Upstream allows `tileSize: 1`,
            which with a 5 km reach is a hundred million tiles. A schema cannot
            say "…unless reach is large", so the floor stands in for a
            constraint the element should hold itself.
          */
          tileSize: { minimum: 32, default: 128 },
          lodLevels: { default: 3 },
        }
      ),
    },
    /*
      The piece's `at` sets the terrain's BASE HEIGHT — a heightfield has no
      position in the way a mesh does, and ignoring `at` put a seabed authored
      at y=-140 through the camera at y=0. `x`/`z` are ignored on purpose: the
      field is unbounded, so there is nothing for them to mean.
    */
    bind: (_piece, cfg, ctx) => {
      const element = add(
        ctx,
        b3dTerrain({
          baseHeight: ctx.at[1],
          ...cfg,
          // `'on'`/`'off'` STRINGS, like the lamp's switches: an absent HTML
          // boolean attribute reads false, so upstream spells these as an
          // enum and a raw boolean would not survive the trip.
          biome: cfg.biome ? "on" : "off",
        })
      );
      regenerateWhenReady(element, ctx);
      return element;
    },
  });

  registerFeature({
    name: "water",
    icon: "🌊",
    primitive: true,
    insertAt: "height",
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Water",
      /*
        ⚠️ `underwaterFog` IS A NUMBER, and we declared it a boolean.

        The panel rendered a toggle, an author flipped it, and `true` went to a
        `number` attribute — discarded in silence until tosijs 1.9, which
        applies it instead. Either way the murk never changed. It is 0..1 here
        because that is what the element reads, which is the whole argument for
        not hand-copying this file (tosijs-3d#63).

        `waterSize` opens at an ensemble's scale rather than the element's
        128 m, and the colour is a deeper blue than the element's default
        because an arrangement usually sits ON the sea, not in a pool.
      */
      "x-accepts": acceptsOf("water"),
      properties: pick(
        "water",
        [
          "waterSize",
          "waveHeight",
          "waveLength",
          "windForce",
          "bumpHeight",
          "waterColor",
          "underwaterFog",
          "underwaterMurk",
        ],
        {
          waterSize: { default: 2000 },
          waveHeight: { default: 0.3 },
          windForce: { default: 6 },
          waterColor: { default: "#0a3d5c" },
        }
      ),
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dWater({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  });

  registerFeature({
    name: "clouds",
    icon: "☁️",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Clouds",
      // Higher, thicker and wider than the element's defaults, which are sized
      // for a scene you can walk across. `castShadows` stays off: the changelog
      // is explicit that it costs a caster pass per frame.
      "x-accepts": acceptsOf("clouds"),
      properties: pick(
        "clouds",
        [
          "coverage",
          "count",
          "altitude",
          "thickness",
          "spread",
          "size",
          "color",
          "opacity",
          "castShadows",
        ],
        {
          count: { default: 40 },
          altitude: { default: 900 },
          thickness: { default: 200 },
          spread: { default: 4000 },
          opacity: { default: 0.8 },
        }
      ),
    },
    bind: (_piece, cfg, ctx) =>
      addSingleton(ctx, "tosi-b3d-clouds", () => b3dClouds({ ...cfg }), cfg),
  });

  registerFeature({
    name: "ambient",
    icon: "🌗",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Ambient life",
      /*
        ⚠️ NO DEFAULT OVERRIDES HERE, because ours were not defaults — they
        were WRONG VALUES. `preset` defaulted to `birds` and the element knows
        `motes`, `bubbles`, `rain`, `snow`, `dust` and `leaves`; an unknown
        preset falls back to `motes` (`PRESETS[this.preset] ?? PRESETS.motes`).
        `where` defaulted to `air` and the attribute is
        `'always' | 'underwater' | 'above'`. So the feature shipped with a
        default that could not be honoured, and honoured it by ignoring it.

        Both were free strings in our schema, which is exactly how a typo
        survives: with the enum in place the panel is a picker over the real
        set and the wrong value is unreachable.
      */
      "x-accepts": acceptsOf("ambient"),
      properties: pick("ambient", [
        "preset",
        "where",
        "count",
        "radius",
        "color",
      ]),
    },
    bind: (_piece, cfg, ctx) =>
      addSingleton(ctx, "tosi-b3d-ambient", () => b3dAmbient({ ...cfg }), cfg),
  });

  registerFeature({
    name: "fog",
    icon: "🌫️",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
    schema: {
      type: "object",
      title: "Fog",
      /*
        ⚠️ `none` IS GONE FROM `mode`, and it was never real. `b3d-fog` reads
        `FOG_MODES[attrs.mode] ?? FOGMODE_LINEAR`, so choosing "none" gave you
        LINEAR fog — the one setting an author picks in order to see the
        horizon did the opposite, quietly. Delete the fog piece, or take
        `density` to zero, which the log slider's zero stop now reaches.

        `syncSkybox` is ours on purpose: an ensemble owns its sky as well as its
        fog, and letting them disagree is a mistake the file can make but never
        wants to. `exp2` likewise — atmospheric depth rather than a wall.
      */
      "x-accepts": acceptsOf("fog"),
      properties: pick(
        "fog",
        ["mode", "color", "density", "start", "end", "syncSkybox"],
        {
          mode: { default: "exp2" },
          color: { default: "#8fa6b2" },
          density: { default: 0.002 },
          start: { default: 100 },
          end: { default: 4000 },
          syncSkybox: { default: true },
        }
      ),
    },
    bind: (_piece, cfg, ctx) =>
      addSingleton(ctx, "tosi-b3d-fog", () => b3dFog({ ...cfg }), cfg),
  });
}
