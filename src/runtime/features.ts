/*#
# Built-in features

The features tosijs-3d already has components for, registered so that every
consumer does not write the same glue. A consumer registers its own alongside
these with `registerFeature`, and the format, the editor and the file cannot
tell the difference.

Call `registerBuiltInFeatures()` once before building. It is idempotent.

## Environment primitives are features with no mesh

Terrain, water, clouds, ambient life and fog are authored the same way a turret
is — as a capability on a piece — except the piece has no `mesh`, so the
feature IS its body. That falls out of the format rather than being bolted on:
`features` was always an open map bound by registrations.

```jsonc
{ "id": "seabed", "at": [0, -140, 0], "features": { "terrain": { "biome": "ocean", "seed": 4 } } },
{ "id": "sea",    "at": [0, 0, 0],    "features": { "water": { "waterSize": 4000 } } }
```

What that buys is the thing worth having: an ensemble can carry the LANDFORM it
sits in, so a province is authorable as one object — a landform edit plus what
stands on it — and can be dragged over a sample terrain to see how the two
interact.

## Two features here are not what the spec assumed

- **`launchpad` has no runtime binding.** `b3d-spawner` spawns encounters
  relative to the PLAYER (`minDistance`/`maxDistance`), not at an authored pad,
  and it takes a `prefab` NAME rather than a craft mesh. So the feature is
  registered `editorOnly` — authorable, and honestly marked as something the
  runtime will not build until upstream has a place-anchored spawner.
- **`turret` cannot draw a library mesh.** `b3d-turret` has no `library`
  attribute — Manta passed one and it was silently ignored. The turret binds and
  aims; its appearance is the piece's own mesh.
*/
import { b3dAmbient, b3dClouds, b3dFog, b3dTerrain, b3dTurret, b3dLauncher, b3dWater } from 'tosijs-3d'
import { registerFeature } from '../format/registry'
import { attachBlip } from './place-mesh'
import type { FeatureContext, SceneElement } from '../format/registry'

const num = (min: number, max: number, def?: number, unit?: string) => ({
  type: 'number',
  minimum: min,
  maximum: max,
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { 'x-unit': unit } : {}),
})

/** Append an element to the scene and tear it down on dispose. */
function add(ctx: FeatureContext, el: unknown): SceneElement {
  const element = el as SceneElement
  ctx.scene.appendChild(element)
  ctx.onDispose(() => element.remove())
  return element
}

let registered = false

/** Register the built-in features. Idempotent. */
export function registerBuiltInFeatures(): void {
  if (registered) return
  registered = true

  registerFeature({
    name: 'destroyable',
    schema: {
      type: 'object',
      title: 'Destroyable',
      properties: {
        hp: num(1, 9999, 12),
        armor: num(0, 100000, 0),
        explode: { type: 'boolean', default: true },
      },
    },
    // The piece's element IS the destroyable — `placeMesh` configures it from
    // this feature's config, because a library mesh can only reach the scene
    // through `b3d-destroyable` today. Binding here would place it twice.
    bind: (_piece, _cfg, ctx) => ctx.element,
  })

  registerFeature({
    name: 'blip',
    schema: {
      type: 'object',
      title: 'Radar blip',
      properties: {
        faction: { type: 'string', default: 'hostile' },
        profile: num(0, 5, 1),
      },
    },
    bind: (_piece, cfg, ctx) => {
      if (!ctx.element) return null
      ctx.onDispose(attachBlip(ctx.element, cfg))
      return ctx.element
    },
  })

  registerFeature({
    name: 'turret',
    schema: {
      type: 'object',
      title: 'Turret',
      properties: {
        range: num(20, 2000, 260, 'm'),
        fireRate: num(0.1, 20, 1.1, '/s'),
        damage: num(1, 200, 4),
        muzzleSpeed: num(20, 2000, 240, 'm/s'),
        traverseRate: num(0.1, 10, 1.2, '/s'),
        smart: {
          type: 'boolean',
          default: false,
          description: 'leads its target instead of firing where you are',
        },
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(
        ctx,
        b3dTurret({
          x: ctx.at[0],
          y: ctx.at[1],
          z: ctx.at[2],
          range: cfg.range ?? 260,
          fireRate: cfg.fireRate ?? 1.1,
          damage: cfg.damage ?? 4,
          muzzleSpeed: cfg.muzzleSpeed ?? 240,
          traverseRate: cfg.traverseRate ?? 1.2,
          smart: cfg.smart ? 'on' : 'off',
        })
      ),
    // A dead platform stops shooting.
    link: (turret, ctx) => {
      const el = turret as SceneElement | null
      if (!el || !ctx.element) return
      ctx.element.addEventListener('destroyed', () => el.remove())
    },
  })

  registerFeature({
    name: 'launcher',
    schema: {
      type: 'object',
      title: 'Missile launcher',
      properties: {
        range: num(50, 4000, 600, 'm'),
        reloadRate: num(0.1, 60, 3, 's'),
        damage: num(1, 500, 30),
      },
    },
    bind: (_piece, cfg, ctx) =>
      add(
        ctx,
        b3dLauncher({
          x: ctx.at[0],
          y: ctx.at[1],
          z: ctx.at[2],
          damage: cfg.damage ?? 30,
          reloadRate: cfg.reloadRate ?? 3,
        })
      ),
  })

  registerFeature({
    name: 'protector',
    schema: {
      type: 'object',
      title: 'Shield field',
      properties: {
        protection: num(0, 200, 12),
        source: {
          type: 'string',
          'x-widget': 'ref',
          'x-roles': ['power', 'generator'],
          description: 'the piece whose destruction drops this field',
        },
      },
    },
    bind: (_piece, cfg, ctx) => ({ cfg, ctx }),
    /*
      LINK phase, and it has to be. A protector resolving its power source during
      `bind` works only if the source happened to bind first — the same ensemble
      would then behave differently depending on the order pieces appear in the
      file, and reordering them in the editor would silently change the game.

      Protection is written to the COMBAT RECORD rather than as an attribute:
      the destroyable behaviour captures its spec when it attaches, so
      `protection` assigned afterwards is silently inert. Manta measured that.
    */
    link: (handle, ctx) => {
      const { cfg } = handle as { cfg: Record<string, unknown> }
      const sourceId = cfg.source as string | undefined
      if (!sourceId) return
      const source = ctx.handle(sourceId) as (SceneElement & { combatId?: string }) | undefined
      const target = ctx.element as (SceneElement & { combatId?: string }) | null
      const combat = (ctx.scene as unknown as { combat?: Map<string, Record<string, unknown>> }).combat
      if (!source?.combatId || !target?.combatId || !combat) return
      const record = combat.get(target.combatId)
      if (!record) return
      record.protectedBy = source.combatId
      record.protection = cfg.protection ?? 12
      source.addEventListener('destroyed', () => {
        record.protection = 0
        record.protectedBy = null
      })
    },
  })

  registerFeature({
    name: 'launchpad',
    // No runtime binding — see the note at the top of this file. Marked so an
    // author finds out here rather than at ship time.
    editorOnly: true,
    schema: {
      type: 'object',
      title: 'Launch pad',
      properties: {
        craft: { type: 'string', 'x-widget': 'mesh' },
        interval: num(1, 300, 20, 's'),
        maxAlive: num(1, 32, 4),
      },
    },
  })

  registerEnvironment()
}

/*
  ENVIRONMENT PRIMITIVES.

  Each is a thin binding to the tosijs-3d element of the same name. They take
  the piece's position where the element has one (water, clouds) and ignore it
  where the element is global (fog, ambient) — an ambient population is a
  property of the world, not a thing standing at a spot.
*/
function registerEnvironment(): void {
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
