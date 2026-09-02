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
  b3dAmbient,
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
import { registerFeature } from "../format/registry";
import type { FeatureContext, SceneElement } from "../format/registry";

const num = (min: number, max: number, def?: number, unit?: string) => ({
  type: "number",
  minimum: min,
  maximum: max,
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { "x-unit": unit } : {}),
});

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
    schema: {
      type: "object",
      title: "Light",
      properties: {
        intensity: num(0, 10, 0.9),
        diffuse: { type: "string", "x-widget": "color" },
        specular: { type: "string", "x-widget": "color" },
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dLight({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  });

  registerFeature({
    name: "sun",
    schema: {
      type: "object",
      title: "Sun and shadows",
      properties: {
        intensity: num(0, 10, 1),
        shadowDarkness: num(0, 1, 0.4),
        shadowTextureSize: num(256, 4096, 1024),
        numCascades: num(1, 4, 2),
        activeDistance: num(10, 20000, 400, "m"),
      },
    },
    bind: (_piece, cfg, ctx) => {
      const placed = { ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] };
      return addSingleton(ctx, "tosi-b3d-sun", () => b3dSun(placed), placed);
    },
  });

  registerFeature({
    name: "skybox",
    schema: {
      type: "object",
      title: "Sky",
      properties: {
        timeOfDay: num(0, 24, 11, "h"),
        turbidity: num(0, 40, 10),
        luminance: num(0, 2, 1),
        latitude: num(-90, 90, 0, "°"),
        applyFog: { type: "boolean", default: true },
        /*
          TIME OF DAY MUST STAND STILL UNLESS ASKED NOT TO.

          `b3d-skybox` defaults `realtimeScale` to 10 and advances `timeOfDay`
          on a 100 ms interval, which works out at a full day/night cycle every
          FORTY MINUTES. An ensemble is a static description of an arrangement,
          so a file that says `timeOfDay: 11` and renders dusk is simply wrong —
          and leaving the editor open walked the sky into night, reported as
          "is it night time?" after a long session. Measured across this
          session: 10.06 → 10.23 → 10.29 with nothing touching it.

          So the format defaults it to 0 — a still sky — and a scene that wants
          a moving one opts in by saying so. That also makes an ensemble
          REPRODUCIBLE: load the same file twice and get the same light.
        */
        realtimeScale: num(0, 1000, 0),
      },
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
    schema: {
      type: "object",
      title: "Ground plane",
      properties: {
        width: num(1, 100000, 400, "m"),
        height: num(1, 100000, 400, "m"),
        color: { type: "string", "x-widget": "color" },
        texture: { type: "string", default: "checker" },
        textureTiles: num(1, 400, 20),
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dGround({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  });

  registerFeature({
    name: "camera",
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
    schema: {
      type: "object",
      title: "Reflection probe",
      properties: {
        probeSize: num(16, 1024, 128),
        refreshRate: num(0, 60, 1),
        maxDistance: num(1, 10000, 200, "m"),
      },
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
    schema: {
      type: "object",
      title: "Terrain",
      properties: {
        biome: { type: "string", default: "temperate" },
        seed: num(0, 1e9, 1),
        surfaceType: {
          type: "string",
          enum: ["plane", "sphere", "cylinder", "torus"],
          default: "plane",
        },
        radius: num(100, 1e7, 6000, "m"),
        grossScale: num(1, 1e6, 4000, "m"),
        grossAmplitude: num(0, 20000, 600, "m"),
        detailScale: num(1, 10000, 200, "m"),
        detailAmplitude: num(0, 2000, 30, "m"),
        baseHeight: num(-10000, 10000, 0, "m"),
        wireframe: { type: "boolean", default: false },
      },
    },
    /*
      The piece's `at` sets the terrain's BASE HEIGHT — a heightfield has no
      position in the way a mesh does, and ignoring `at` put a seabed authored
      at y=-140 through the camera at y=0. `x`/`z` are ignored on purpose: the
      field is unbounded, so there is nothing for them to mean.
    */
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dTerrain({ baseHeight: ctx.at[1], ...cfg })),
  });

  registerFeature({
    name: "water",
    schema: {
      type: "object",
      title: "Water",
      properties: {
        waterSize: num(10, 100000, 2000, "m"),
        waveHeight: num(0, 10, 0.3, "m"),
        waveLength: num(0.01, 10, 0.1),
        windForce: num(0, 100, 6),
        waterColor: { type: "string", "x-widget": "color", default: "#0a3d5c" },
        underwaterFog: { type: "boolean", default: true },
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dWater({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  });

  registerFeature({
    name: "clouds",
    schema: {
      type: "object",
      title: "Clouds",
      properties: {
        count: num(0, 500, 40),
        altitude: num(0, 20000, 900, "m"),
        thickness: num(0, 5000, 200, "m"),
        spread: num(100, 100000, 4000, "m"),
        coverage: num(0, 1, 0.5),
        opacity: num(0, 1, 0.8),
        castShadows: { type: "boolean", default: false },
      },
    },
    bind: (_piece, cfg, ctx) =>
      addSingleton(ctx, "tosi-b3d-clouds", () => b3dClouds({ ...cfg }), cfg),
  });

  registerFeature({
    name: "ambient",
    schema: {
      type: "object",
      title: "Ambient life",
      properties: {
        preset: { type: "string", default: "birds" },
        where: { type: "string", default: "air" },
        count: num(0, 500, 20),
        radius: num(10, 20000, 400, "m"),
        color: { type: "string", "x-widget": "color" },
      },
    },
    bind: (_piece, cfg, ctx) =>
      addSingleton(ctx, "tosi-b3d-ambient", () => b3dAmbient({ ...cfg }), cfg),
  });

  registerFeature({
    name: "fog",
    schema: {
      type: "object",
      title: "Fog",
      properties: {
        mode: {
          type: "string",
          enum: ["none", "linear", "exp", "exp2"],
          default: "exp2",
        },
        color: { type: "string", "x-widget": "color", default: "#8fa6b2" },
        density: num(0, 0.1, 0.002),
        start: num(0, 100000, 100, "m"),
        end: num(0, 100000, 4000, "m"),
        syncSkybox: { type: "boolean", default: true },
      },
    },
    bind: (_piece, cfg, ctx) =>
      addSingleton(ctx, "tosi-b3d-fog", () => b3dFog({ ...cfg }), cfg),
  });
}
