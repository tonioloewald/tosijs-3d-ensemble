/*#
# Scene features

The primitives a tosijs-3d scene is made of, registered as ensemble features so
that a whole scene — sun, sky, shadows, ground, weather — is **data you load**
rather than boilerplate you retype.

```js
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
import {
  b3dAmbient,
  b3dClouds,
  b3dFog,
  b3dGround,
  b3dLight,
  b3dReflections,
  b3dSkybox,
  b3dSun,
  b3dTerrain,
  b3dWater,
} from 'tosijs-3d'
import { registerFeature } from '../format/registry'
import type { FeatureContext, SceneElement } from '../format/registry'

const num = (min: number, max: number, def?: number, unit?: string) => ({
  type: 'number',
  minimum: min,
  maximum: max,
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { 'x-unit': unit } : {}),
})

/** Append an element to the scene and tear it down on dispose. */
export function add(ctx: FeatureContext, el: unknown): SceneElement {
  const element = el as SceneElement
  ctx.scene.appendChild(element)
  ctx.onDispose(() => element.remove())
  return element
}

let registered = false

/**
 * Register the scene primitives. Idempotent.
 *
 * Positioned features (`light`, `sun`, `ground`, `water`, `skybox`) take the
 * piece's `at`; global ones (`fog`, `clouds`, `ambient`, `reflections`) ignore
 * it, because "the fog is at (3, 0, 12)" means nothing.
 */
export function registerSceneFeatures(): void {
  if (registered) return
  registered = true

  registerFeature({
    name: 'light',
    schema: {
      type: 'object',
      title: 'Light',
      properties: {
        intensity: num(0, 10, 0.9),
        diffuse: { type: 'string', 'x-widget': 'color' },
        specular: { type: 'string', 'x-widget': 'color' },
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dLight({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  })

  registerFeature({
    name: 'sun',
    schema: {
      type: 'object',
      title: 'Sun and shadows',
      properties: {
        intensity: num(0, 10, 1),
        shadowDarkness: num(0, 1, 0.4),
        shadowTextureSize: num(256, 4096, 1024),
        numCascades: num(1, 4, 2),
        activeDistance: num(10, 20000, 400, 'm'),
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dSun({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  })

  registerFeature({
    name: 'skybox',
    schema: {
      type: 'object',
      title: 'Sky',
      properties: {
        timeOfDay: num(0, 24, 11, 'h'),
        turbidity: num(0, 40, 10),
        luminance: num(0, 2, 1),
        latitude: num(-90, 90, 0, '°'),
        applyFog: { type: 'boolean', default: true },
      },
    },
    bind: (_piece, cfg, ctx) => add(ctx, b3dSkybox({ ...cfg })),
  })

  registerFeature({
    name: 'ground',
    schema: {
      type: 'object',
      title: 'Ground plane',
      properties: {
        width: num(1, 100000, 400, 'm'),
        height: num(1, 100000, 400, 'm'),
        color: { type: 'string', 'x-widget': 'color' },
        texture: { type: 'string', default: 'checker' },
        textureTiles: num(1, 400, 20),
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dGround({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  })

  registerFeature({
    name: 'reflections',
    schema: {
      type: 'object',
      title: 'Reflection probe',
      properties: {
        probeSize: num(16, 1024, 128),
        refreshRate: num(0, 60, 1),
        maxDistance: num(1, 10000, 200, 'm'),
      },
    },
    bind: (_piece, cfg, ctx) => add(ctx, b3dReflections({ ...cfg })),
  })

  registerFeature({
    name: 'terrain',
    schema: {
      type: 'object',
      title: 'Terrain',
      properties: {
        biome: { type: 'string', default: 'temperate' },
        seed: num(0, 1e9, 1),
        surfaceType: { type: 'string', enum: ['plane', 'sphere', 'cylinder', 'torus'], default: 'plane' },
        radius: num(100, 1e7, 6000, 'm'),
        grossScale: num(1, 1e6, 4000, 'm'),
        grossAmplitude: num(0, 20000, 600, 'm'),
        detailScale: num(1, 10000, 200, 'm'),
        detailAmplitude: num(0, 2000, 30, 'm'),
        baseHeight: num(-10000, 10000, 0, 'm'),
        wireframe: { type: 'boolean', default: false },
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
  })

  registerFeature({
    name: 'water',
    schema: {
      type: 'object',
      title: 'Water',
      properties: {
        waterSize: num(10, 100000, 2000, 'm'),
        waveHeight: num(0, 10, 0.3, 'm'),
        waveLength: num(0.01, 10, 0.1),
        windForce: num(0, 100, 6),
        waterColor: { type: 'string', 'x-widget': 'color', default: '#0a3d5c' },
        underwaterFog: { type: 'boolean', default: true },
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(ctx, b3dWater({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })),
  })

  registerFeature({
    name: 'clouds',
    schema: {
      type: 'object',
      title: 'Clouds',
      properties: {
        count: num(0, 500, 40),
        altitude: num(0, 20000, 900, 'm'),
        thickness: num(0, 5000, 200, 'm'),
        spread: num(100, 100000, 4000, 'm'),
        coverage: num(0, 1, 0.5),
        opacity: num(0, 1, 0.8),
        castShadows: { type: 'boolean', default: false },
      },
    },
    bind: (_piece, cfg, ctx) => add(ctx, b3dClouds({ ...cfg })),
  })

  registerFeature({
    name: 'ambient',
    schema: {
      type: 'object',
      title: 'Ambient life',
      properties: {
        preset: { type: 'string', default: 'birds' },
        where: { type: 'string', default: 'air' },
        count: num(0, 500, 20),
        radius: num(10, 20000, 400, 'm'),
        color: { type: 'string', 'x-widget': 'color' },
      },
    },
    bind: (_piece, cfg, ctx) => add(ctx, b3dAmbient({ ...cfg })),
  })

  registerFeature({
    name: 'fog',
    schema: {
      type: 'object',
      title: 'Fog',
      properties: {
        mode: { type: 'string', enum: ['none', 'linear', 'exp', 'exp2'], default: 'exp2' },
        color: { type: 'string', 'x-widget': 'color', default: '#8fa6b2' },
        density: num(0, 0.1, 0.002),
        start: num(0, 100000, 100, 'm'),
        end: num(0, 100000, 4000, 'm'),
        syncSkybox: { type: 'boolean', default: true },
      },
    },
    bind: (_piece, cfg, ctx) => add(ctx, b3dFog({ ...cfg })),
  })
}
