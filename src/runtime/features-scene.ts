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
  DEFAULT_LIGHT,
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

/**
 * A LOG10 slider over decades — the right instrument for a multiplicative
 * quantity.
 *
 * A linear track is wrong for anything whose useful values span orders of
 * magnitude: terrain's `grossScale` ran 1..1,000,000 with its default at 0.4%
 * of the travel, so every value an author wanted lived in the first few pixels.
 * Measured across the terrain schema, EVERY default sat between 0.00% and 3% of
 * its track. Owner: "a lot of these are precisely the kind of thing a -3 to 3
 * log 10 scale would be perfect for".
 *
 * Given in DECADES, because that is how you think about these: `decades(-3, 3)`
 * is 0.001 to 1000, and the default lands in the middle where it belongs.
 *
 * ⚠️ Only for a quantity that is POSITIVE and multiplicative. `slider3d` falls
 * back to linear for a range including zero, silently, so a field whose zero
 * means something — `reach: 0` is "auto", `baseHeight` can be negative — keeps
 * a tightened LINEAR range instead. Where "flat" is the useful zero, a
 * thousandth of a metre is flat, so the bottom decade stands in for it.
 */
const decades = (from: number, to: number, def?: number, unit?: string) => ({
  type: "number",
  minimum: 10 ** from,
  maximum: 10 ** to,
  "x-scale": "log",
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { "x-unit": unit } : {}),
});

const num = (min: number, max: number, def?: number, unit?: string) => ({
  type: "number",
  minimum: min,
  maximum: max,
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { "x-unit": unit } : {}),
});

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
      properties: {
        intensity: num(0, 10, 0.9),
        diffuse: { type: "string", "x-widget": "color" },
        specular: { type: "string", "x-widget": "color" },
      },
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
    icon: "🌌",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
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
        /*
          LOG-SPACED, AND STILL ABLE TO REACH ZERO.

          A linear 0..1000 track puts every value anyone wants in the first
          thousandth of its travel — 1 and 10 are indistinguishable positions.
          `slider3d` has a `log` scale for exactly that, but it "requires
          min > 0; a range including zero falls back to linear", and 0 is both
          the default here and the only way to say "do not move".

          The values worth having are decades, so they are named ones. That
          keeps Off reachable, spaces the rest logarithmically, and says what
          each means — `600` is not self-evidently ten minutes of sky per
          second.
        */
        realtimeScale: {
          type: "number",
          title: "Time speed",
          enum: [0, 1, 10, 60, 600, 3600],
          default: 0,
          "x-labels": {
            "0": "Off",
            "1": "realtime",
            "10": "10×",
            "60": "1 min/s",
            "600": "10 min/s",
            "3600": "1 hr/s",
          },
        },
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
    icon: "🟫",
    primitive: true,
    insertAt: "height",
    update: updateAttrs,
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
      properties: {
        /*
          ⚠️ THESE NUMBERS COME FROM tosijs-3d's OWN TERRAIN DEMO, not from us.

          The previous set was invented, and every one was wrong — not merely
          badly ranged. `grossScale` is a FREQUENCY, not a wavelength: the demo
          runs it 0.005..0.3 with a default of 0.015, and the comment there
          explains why ("at h-size 8 a grossScale of 0.015 means ~530m
          features"). We had it as metres, 1..1,000,000, defaulting to 4000 —
          a number four orders of magnitude outside the useful range, wearing a
          unit it does not have.

          Owner: "a whole bunch of the values do all their useful work between 0
          and 1", which was literal and which I first read as a statement about
          the SLIDER TRACK. It was about the values.

          So these are lifted from `b3d-terrain`'s demo — its defaults and its
          own slider bounds where it has them. It is a hand-copy and will drift
          again, which is the argument for tosijs-3d#66 rather than a reason to
          keep guessing in the meantime.
        */
        biome: { type: "boolean", default: false },
        biomeSeaLevel: {
          ...num(-10000, 10000, 0, "m"),
          "x-requires": { biome: true },
        },
        biomeLapseRate: {
          ...num(0, 0.02, 0, undefined),
          "x-requires": { biome: true },
        },
        // A seed is typed or stepped, never dragged: no seed is near another.
        seed: { type: "integer", minimum: 0, maximum: 9999, default: 111 },
        surfaceType: {
          type: "string",
          enum: ["plane", "sphere", "cylinder", "torus"],
          default: "plane",
        },
        // For the curved surfaces. The demo uses 1000 on a cylinder; what it
        // does on a torus is an open question upstream (tosijs-3d#66).
        radius: decades(1, 5, 1000, "m"),
        /*
          FREQUENCIES, divided by `horizScale`. Demo sliders exactly: gross
          0.005..0.3, detail 0.02..1. Both do all their work below 1, which is
          what a linear track over six decades destroyed.
        */
        grossScale: num(0.005, 0.3, 0.015),
        detailScale: num(0.02, 1, 0.09),
        horizScale: num(0.1, 64, 8),
        // METRES of relief, and the demo's own slider bounds.
        grossAmplitude: num(0, 400, 250, "m"),
        detailAmplitude: num(0, 50, 45, "m"),
        baseHeight: num(-1000, 1000, 0, "m"),
        /*
          WORLD SHAPE. The demo's own comment calls `tileSize` / `lodLevels` /
          `reach` "world-shape choices" and uses 128 / 3 / 5000 — "big tiles +
          few levels keep the pool small and the meshes cheap".

          ⚠️ Finest-level tiles go as `(2·reach / tileSize)²`, and these are two
          separate sliders, so it is the PRODUCT that kills the tab. The demo's
          own pairing is 6,100 tiles; 10m tiles with the same reach would be a
          million. A schema cannot say "…unless tileSize is small", so the
          floor on tileSize is doing the work the element should do itself.
        */
        tileSize: decades(1.5, 2.7, 128, "m"),
        lodLevels: { type: "integer", minimum: 1, maximum: 8, default: 3 },
        reach: num(0, 8000, 0, "m"),
        wireframe: { type: "boolean", default: false },
      },
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
    icon: "☁️",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
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
    icon: "🌗",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
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
    icon: "🌫️",
    primitive: true,
    insertAt: [0, 0, 0],
    update: updateAttrs,
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
