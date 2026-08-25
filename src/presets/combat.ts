/*#
# The combat preset

The fortification vocabulary — `destroyable`, `turret`, `launcher`, `radar`,
`protector`, `blip`, `launchpad`, and the roles that compose them — as an
**opt-in import**.

```js
import { registerCombatPreset } from 'tosijs-3d-ensemble/presets/combat'

registerCombatPreset()
```

## Why this is not in the core

The format describes an arrangement; it has no domain. A scene that is a
botanical garden, an architectural walkthrough or tosijs-3d's own standard demo
has no use for hit points, and should not have to ignore them — nor should its
author see `shield` in a role picker.

An earlier version shipped these as built-ins beside `terrain` and `water`, and
put a shield-reachability rule inside `validate` itself. That quietly made a
general scene format into a combat format. Everything here is the same code,
moved behind a call the consumer makes.

## What it registers

- **Features** — the capabilities above, bound to tosijs-3d's combat components.
- **Roles** — `structure`, `target`, `power`, `generator`, `shield`, `critical`,
  as feature presets an author picks by INTENT.
- **A validation rule** — a piece that projects a field with no incoming link is
  an unsolvable objective, which looks entirely normal until a player spends
  five minutes failing to kill something. That rule is meaningful only here.
*/
import { b3dCollisions, b3dLauncher, b3dTurret } from 'tosijs-3d'
import { registerFeature } from '../format/registry'
import { registerRole } from '../format/roles'
import { featuresOf } from '../format/roles'
import { registerCheck } from '../format/validate'
import { add } from '../runtime/features-scene'
import { attachBlip } from '../runtime/place-mesh'
import type { SceneElement } from '../format/registry'
import type { Problem } from '../format/validate'

const num = (min: number, max: number, def?: number, unit?: string) => ({
  type: 'number',
  minimum: min,
  maximum: max,
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { 'x-unit': unit } : {}),
})

/*
  ONE collisions processor per scene, shared by every piece that wants it.

  Refcounted rather than created per piece: `<tosi-b3d-collisions>` is a
  scene-level scanner, and a second one would do the same work twice. The count
  matters because the editor rebuilds constantly — the processor must go when
  the last collidable piece does, and must NOT go while others remain.
*/
const collisionUsers = new WeakMap<object, { element: SceneElement; count: number }>()

function ensureCollisions(
  ctx: { scene: SceneElement; onDispose: (fn: () => void) => void },
  debug: boolean
): SceneElement {
  let entry = collisionUsers.get(ctx.scene)
  if (!entry) {
    const element = b3dCollisions({ debug }) as unknown as SceneElement
    ctx.scene.appendChild(element)
    entry = { element, count: 0 }
    collisionUsers.set(ctx.scene, entry)
  }
  entry.count++
  ctx.onDispose(() => {
    if (--entry!.count <= 0) {
      entry!.element.remove()
      collisionUsers.delete(ctx.scene)
    }
  })
  return entry.element
}

let registered = false

/** Register the fortification vocabulary: features, roles and its one rule. */
export function registerCombatPreset(): void {
  if (registered) return
  registered = true

  registerFeature({
    name: 'collidable',
    schema: {
      type: 'object',
      title: 'Collidable',
      properties: {
        debug: { type: 'boolean', default: false, description: 'draw the collider volumes' },
      },
    },
    /*
      Collision in tosijs-3d is CONVENTION-driven: a scene-level
      `<tosi-b3d-collisions>` scans for collider meshes inside models
      (`*_collideBox`, `*_collideSphere`, `*_collideCylinder`). So this feature's
      job is to guarantee that processor exists, not to invent a collider — and
      it is shared, so ten collidable pieces make one of it.
    */
    bind: (_piece, cfg, ctx) => ensureCollisions(ctx, Boolean(cfg.debug)),
  })

  registerFeature({
    name: 'destroyable',
    schema: {
      type: 'object',
      title: 'Destroyable',
      properties: {
        hp: num(1, 9999, 12),
        armor: num(0, 100000, 0),
        explode: { type: 'boolean', default: true },
        collidable: {
          type: 'boolean',
          default: true,
          description: 'if you cannot hit it you cannot destroy it',
        },
      },
    },
    /*
      A DECORATOR, and now genuinely one.

      It used to register `body: true` and create the piece's element, because
      `b3d-destroyable` was the only way to place a library mesh and had no way
      out of the combat system. tosijs-3d 0.7.2 added `destroyable="off"`
      (tosijs-3d#39, our ask), so placement is uniform and this feature no
      longer creates anything.

      The combat spec still has to be applied at CREATION — the behaviour
      captures its spec when it attaches, so a later write is inert — which is
      why `placeMesh` reads this feature's config rather than the other way
      round. This binding contributes the collision that destruction implies,
      and hands back the body as its handle.
    */
    bind: (_piece, cfg, ctx) => {
      /*
        DESTROYABLE ROUTES THROUGH COLLISION, defaulting to on.

        If you cannot hit a thing you cannot destroy it, so "destroyable but not
        collidable" is almost always an authoring mistake rather than an
        intention. Opt out explicitly with `collidable: false` — a force field
        you shoot through but that still dies with its generator is the case
        that wants it.
      */
      if (cfg.collidable !== false) ensureCollisions(ctx, false)
      return ctx.element
    },
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


  registerCombatRoles()
  registerCombatChecks()
}

/**
 * Roles as feature presets.
 *
 * A role carries INTENT ("this is the power source") where a feature carries
 * MECHANISM ("destroyable, 16 hp"). A designer means the first; the runtime
 * needs the second.
 */
function registerCombatRoles(): void {
  /** Armoured scenery you cannot kill. */
  registerRole('structure', {})
  /** An ordinary destroyable. */
  registerRole('target', {
    destroyable: { hp: 12, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  })
  /** Kill this to drop a shield. */
  registerRole('power', {
    destroyable: { hp: 16, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  })
  /** A shield projector; dies with its power. */
  registerRole('generator', {
    destroyable: { hp: 14, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  })
  /** The field itself: shooting it directly is possible and a bad plan. */
  registerRole('shield', {
    destroyable: { hp: 120, armor: 25 },
    protector: { protection: 12 },
  })
  /** The objective, protected while its power stands. */
  registerRole('critical', {
    destroyable: { hp: 20, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  })
}

function registerCombatChecks(): void {
  registerCheck((ensemble): Problem[] =>
    ensemble.pieces.flatMap((piece, i) => {
      // Keyed on the protector FEATURE, not on a `shield` role name, so a
      // consumer's own role for a field is covered too.
      if (!featuresOf(piece).protector) return []
      if ((ensemble.links ?? []).some((l) => l.to === piece.id)) return []
      return [
        {
          severity: 'error' as const,
          code: 'unreachable-shield',
          message: `"${piece.id}" projects a field and has no incoming link — nothing can bring it down`,
          path: `/pieces/${i}`,
        },
      ]
    })
  )
}
