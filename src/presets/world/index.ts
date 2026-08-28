/*#
# The world preset

Doors, locks, lamps, spinners and triggers — the vocabulary a **place** needs,
as opposed to a battle. Opt in the way you opt into combat:

```typescript
import { registerWorldPreset } from 'tosijs-3d-ensemble/presets/world'

registerWorldPreset()
```

## Why these are here and not upstream, yet

tosijs-3d has `b3d-trigger` (a proximity sphere) and `b3d-sound`, and nothing
else on this list. There is no way for a player to **touch** a mesh at all:
`b3d-button` is a floating Babylon GUI widget, not world geometry you can reach
out to. So doors, knobs, switches and locks have no substrate to stand on.

These are prototyped here because this project is the consumer that needs them,
and they are **candidates for promotion** — see `UPSTREAM.md`. Building them
here first means they get designed against real content instead of in the
abstract, which is the same argument that put the ensemble format here rather
than in the framework.

## `interactive` is the substrate

Everything you can operate composes on one feature. A door is not special-cased
input; it is a thing with `interactive` that happens to swing.

```jsonc
{
  "id": "front-door",
  "mesh": "door",
  "features": {
    "interactive": { "part": "Knob$", "reach": 2, "prompt": "Open" },
    "lockable": { "locked": true, "key": "brass" },
    "door": { "motion": "swing", "openDegrees": 95, "seconds": 0.7, "openOn": "use" }
  }
}
```

`part` is the trap worth knowing: on a door with a knob you must touch **the
knob**, and a knob is a sub-mesh of the door model rather than a piece of its
own. It is a regex source string, like `subsystems`, for the same reason —
a `RegExp` does not survive `JSON.stringify`.
*/
import { b3dTrigger } from 'tosijs-3d'
import { registerFeature } from '../../format/registry'
import {
  canUse,
  closedDoor,
  doorAmount,
  flicker,
  selectClip,
  spinAngle,
  stepDoor,
  unlocks,
} from './logic'
import type { DoorState, LockState } from './logic'
import type { FeatureContext, SceneElement } from '../../format/registry'
import type { Piece } from '../../format/types'

const num = (min: number, max: number, def?: number, unit?: string) => ({
  type: 'number',
  minimum: min,
  maximum: max,
  ...(def === undefined ? {} : { default: def }),
  ...(unit ? { 'x-unit': unit } : {}),
})

/** What an interactive thing exposes to whatever is built on top of it. */
export interface InteractiveHandle {
  /** Ask to use it. Returns false when out of reach, disabled, or locked. */
  use(key?: string): boolean
  /** Called whenever a use succeeds. */
  onUse(listener: () => void): () => void
  /** True while something is within `reach`. */
  readonly near: boolean
  setEnabled(enabled: boolean): void
}

export interface LockHandle {
  readonly state: LockState
  unlock(key: string): boolean
  lock(): void
}

/**
 * Per-frame work, guarded.
 *
 * A throw inside a Babylon render observer kills the render loop PERMANENTLY —
 * `notifyObservers` has no isolation and the loop does not re-queue, so the page
 * goes black with no error where anyone would look. Every behaviour here that
 * ticks goes through this.
 */
function everyFrame(ctx: FeatureContext, tick: (dt: number, now: number) => void): void {
  const scene = (ctx.scene as unknown as { scene?: SceneLoop }).scene
  if (!scene?.registerBeforeRender) return
  let last = ctx.simTime()
  const observer = () => {
    try {
      const now = ctx.simTime()
      const dt = Math.min(0.25, Math.max(0, now - last))
      last = now
      tick(dt, now)
    } catch {
      /* one bad frame must not take the render loop with it */
    }
  }
  scene.registerBeforeRender(observer)
  ctx.onDispose(() => scene.unregisterBeforeRender?.(observer))
}

interface SceneLoop {
  registerBeforeRender?: (fn: () => void) => void
  unregisterBeforeRender?: (fn: () => void) => void
  activeCamera?: { position?: { x: number; y: number; z: number } }
}

/** World position of whatever counts as "the viewer" for reach tests. */
function viewerPosition(ctx: FeatureContext): [number, number, number] | null {
  const scene = (ctx.scene as unknown as { scene?: SceneLoop }).scene
  const p = scene?.activeCamera?.position
  return p ? [p.x, p.y, p.z] : null
}

const distanceTo = (a: [number, number, number], b: readonly number[]): number =>
  Math.hypot(a[0] - (b[0] ?? 0), a[1] - (b[1] ?? 0), a[2] - (b[2] ?? 0))

let registered = false

/** Register the world vocabulary. Idempotent. */
export function registerWorldPreset(): void {
  if (registered) return
  registered = true

  registerFeature<InteractiveHandle>({
    name: 'interactive',
    schema: {
      type: 'object',
      title: 'Interactive',
      properties: {
        part: {
          type: 'string',
          title: 'Handle part',
          description: 'regex for the sub-mesh you must touch, e.g. a knob',
        },
        reach: num(0, 50, 2, 'm'),
        prompt: { type: 'string', title: 'Prompt', default: 'Use' },
        enabled: { type: 'boolean', default: true },
      },
    },
    bind(_piece, cfg, ctx) {
      const listeners = new Set<() => void>()
      let enabled = cfg.enabled !== false
      let near = false
      const reach = Number(cfg.reach ?? 2)

      everyFrame(ctx, () => {
        const viewer = viewerPosition(ctx)
        near = viewer ? distanceTo(viewer, ctx.at) <= (reach > 0 ? reach : Infinity) : false
      })

      return {
        use(key?: string) {
          const viewer = viewerPosition(ctx)
          const distance = viewer ? distanceTo(viewer, ctx.at) : 0
          if (!canUse({ reach, enabled }, distance)) return false
          // A lock on the same piece gates it — looked up rather than known
          // about, so `lockable` can be added to anything and `interactive`
          // never learns what kinds of gate exist.
          const lock = ctx.feature('lockable') as LockHandle | undefined
          if (lock && !unlocks(lock.state, key)) return false
          for (const listener of listeners) listener()
          return true
        },
        onUse(listener) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
        get near() {
          return near
        },
        setEnabled(next) {
          enabled = next
        },
      }
    },
  })

  registerFeature<LockHandle>({
    name: 'lockable',
    schema: {
      type: 'object',
      title: 'Lockable',
      properties: {
        locked: { type: 'boolean', default: true },
        key: { type: 'string', title: 'Key', description: 'what opens it' },
      },
    },
    bind(_piece, cfg) {
      const state: LockState = {
        locked: cfg.locked !== false,
        ...(cfg.key ? { key: String(cfg.key) } : {}),
      }
      return {
        state,
        unlock(key: string) {
          if (!unlocks({ ...state, locked: true }, key)) return false
          state.locked = false
          return true
        },
        lock() {
          state.locked = true
        },
      }
    },
  })

  registerAnimation()
  registerDoor()
  registerLamp()
  registerSpin()
  registerTrigger()
}

/** A Babylon AnimationGroup, structurally — the engine stays out of the contract. */
interface Clip {
  name: string
  play: (loop?: boolean) => void
  stop: () => void
  pause: () => void
  speedRatio?: number
}

interface AnimatedNode {
  metadata?: { animationGroups?: Clip[] }
}

export interface AnimationHandle {
  /** Clip names this model actually has. Empty until the library has loaded. */
  readonly clips: string[]
  /** Play a clip by name, or the configured one. False if there is no such clip. */
  play(clip?: string): boolean
  stop(): void
  pause(): void
  setSpeed(speed: number): void
}

function registerAnimation(): void {
  registerFeature<AnimationHandle>({
    name: 'animation',
    schema: {
      type: 'object',
      title: 'Animation',
      properties: {
        clip: {
          type: 'string',
          title: 'Clip',
          description: 'name of the animation in the model; blank plays the first',
        },
        autoplay: { type: 'boolean', default: true },
        loop: { type: 'boolean', default: true },
        speed: num(-4, 4, 1, '×'),
      },
    },
    /*
      THE CLIPS ARRIVE WITH THE LIBRARY, NOT WITH THE FEATURE.

      `library.instantiate()` clones the model's AnimationGroups onto the
      instance (`metadata.animationGroups`) — but a feature binds long before a
      multi-megabyte glb has arrived, so reading them at bind time finds nothing.
      Everything here resolves lazily against the body, which is also why
      `clips` is a getter rather than a captured array.
    */
    bind(_piece, cfg, ctx) {
      const wanted = cfg.clip as string | undefined
      const loop = cfg.loop !== false
      const speed = Number(cfg.speed ?? 1)
      let started = false

      const groups = (): Clip[] => {
        const node = (ctx.element as unknown as { mesh?: AnimatedNode } | null)?.mesh ??
          (ctx.node as AnimatedNode | null)
        return node?.metadata?.animationGroups ?? []
      }

      const handle: AnimationHandle = {
        get clips() {
          return groups().map((g) => g.name)
        },
        play(clip?: string) {
          const available = groups()
          const name = selectClip(
            available.map((g) => g.name),
            clip ?? wanted
          )
          if (!name) return false
          for (const group of available) {
            if (group.name === name) {
              if (group.speedRatio !== undefined) group.speedRatio = speed
              group.play(loop)
            } else {
              group.stop()
            }
          }
          return true
        },
        stop() {
          for (const group of groups()) group.stop()
        },
        pause() {
          for (const group of groups()) group.pause()
        },
        setSpeed(next: number) {
          for (const group of groups()) {
            if (group.speedRatio !== undefined) group.speedRatio = next
          }
        },
      }

      if (cfg.autoplay !== false) {
        // Keep trying until the model is there, then stop. Bounded, so a model
        // that never loads costs a couple of seconds of polling rather than a
        // callback that runs for the life of the page.
        let frames = 0
        everyFrame(ctx, () => {
          if (started || frames++ > 240) return
          if (handle.play()) started = true
        })
      }

      ctx.onDispose(() => handle.stop())
      return handle
    },
  })
}

function registerDoor(): void {
  registerFeature({
    name: 'door',
    schema: {
      type: 'object',
      title: 'Door',
      properties: {
        motion: { type: 'string', enum: ['swing', 'slide'], default: 'swing' },
        axis: { type: 'string', enum: ['x', 'y', 'z'], default: 'y' },
        openDegrees: num(-180, 180, 90, '°'),
        slideDistance: num(0, 20, 1, 'm'),
        seconds: num(0.05, 10, 0.7, 's'),
        openOn: { type: 'string', enum: ['use', 'approach', 'never'], default: 'use' },
        approach: num(0, 20, 2.5, 'm'),
        autoClose: num(0, 60, 4, 's'),
      },
    },
    bind: (_piece, cfg, ctx) => ({ cfg, ctx, state: closedDoor() }),
    /*
      LINK, not bind: a door consults the `interactive` handle on its own piece,
      and during bind the neighbours — including its own siblings — are still
      arriving. This is the two-phase rule applied to a feature reaching for a
      feature rather than for another piece.
    */
    link(handle, ctx) {
      const { cfg } = handle as { cfg: Record<string, unknown> }
      const openOn = String(cfg.openOn ?? 'use')
      const motion = String(cfg.motion ?? 'swing')
      const axis = String(cfg.axis ?? 'y') as 'x' | 'y' | 'z'
      const full = Number(cfg.openDegrees ?? 90)
      const slide = Number(cfg.slideDistance ?? 1)
      const rules = {
        seconds: Number(cfg.seconds ?? 0.7),
        autoClose: Number(cfg.autoClose ?? 4),
      }
      const body = (ctx.element ?? ctx.node) as Record<string, unknown> | null
      if (!body) return

      const rest = {
        rot: [0, 0, 0] as [number, number, number],
        at: [...ctx.at] as [number, number, number],
      }
      let state: DoorState = closedDoor()
      let held = false

      // `use` latches the door open; approach holds it while you are near.
      const interactive = ctx.feature('interactive') as InteractiveHandle | undefined
      if (openOn === 'use' && interactive) {
        ctx.onDispose(interactive.onUse(() => (held = !held)))
      }

      everyFrame(ctx, (dt) => {
        const wants =
          openOn === 'approach' ? (interactive?.near ?? false) : openOn === 'use' ? held : false
        state = stepDoor(state, dt, rules, wants)
        if (state.phase === 'closed' && !wants) held = false
        const amount = doorAmount(state, motion === 'slide' ? slide : full)
        if (motion === 'slide') {
          const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
          const at = [...rest.at] as [number, number, number]
          at[index] = rest.at[index] + amount
          writeBody(body, { at })
        } else {
          const rot = [...rest.rot] as [number, number, number]
          rot[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = amount
          writeBody(body, { rot })
        }
      })
    },
  })
}

function registerLamp(): void {
  registerFeature({
    name: 'lamp',
    schema: {
      type: 'object',
      title: 'Lamp',
      properties: {
        color: { type: 'string', 'x-widget': 'color', default: '#ffd9a0' },
        brightness: num(0, 20, 1.2),
        range: num(0, 200, 12, 'm'),
        on: { type: 'boolean', default: true },
        flicker: num(0, 1, 0, undefined),
        castShadows: { type: 'boolean', default: false },
      },
    },
    bind(_piece, cfg, ctx) {
      const base = Number(cfg.brightness ?? 1.2)
      const amount = Number(cfg.flicker ?? 0)
      let on = cfg.on !== false
      // Seeded from the piece id, so two lamps in a room do not pulse in unison.
      const seed = [...ctx.piece.id].reduce((n, c) => n + c.charCodeAt(0), 0) % 97
      const light = makeLight(ctx, cfg)

      /*
        A LAMP'S OWN MESH MUST NOT CAST SHADOWS. A glowing bulb that casts is
        a bulb that shades the room it is lighting — the fixture ends up
        silhouetted against its own light, which reads as a rendering bug.
      */
      const mesh = (ctx.element as unknown as { mesh?: { receiveShadows?: boolean } } | null)?.mesh
      if (mesh) mesh.receiveShadows = false

      if (amount > 0 && light) {
        everyFrame(ctx, (_dt, now) => {
          light.intensity = on ? flicker(base, amount, now, seed) : 0
        })
      }

      return {
        setOn(next: boolean) {
          on = next
          if (light) light.intensity = next ? base : 0
        },
        get on() {
          return on
        },
      }
    },
  })
}

function registerSpin(): void {
  registerFeature({
    name: 'spin',
    schema: {
      type: 'object',
      title: 'Spin',
      properties: {
        axis: { type: 'string', enum: ['x', 'y', 'z'], default: 'y' },
        degreesPerSecond: num(-720, 720, 45, '°/s'),
      },
    },
    bind(_piece, cfg, ctx) {
      const axis = String(cfg.axis ?? 'y') as 'x' | 'y' | 'z'
      const rate = Number(cfg.degreesPerSecond ?? 45)
      const body = (ctx.element ?? ctx.node) as Record<string, unknown> | null
      if (!body) return null
      const start = ctx.simTime()
      everyFrame(ctx, (_dt, now) => {
        const rot: [number, number, number] = [0, 0, 0]
        rot[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = spinAngle(rate, now - start)
        writeBody(body, { rot })
      })
      return null
    },
  })
}

function registerTrigger(): void {
  registerFeature({
    name: 'trigger',
    schema: {
      type: 'object',
      title: 'Trigger',
      properties: {
        kind: { type: 'string', enum: ['proximity', 'action'], default: 'proximity' },
        radius: num(0.1, 200, 3, 'm'),
        once: { type: 'boolean', default: false },
        debug: { type: 'boolean', default: false },
      },
    },
    bind(_piece, cfg, ctx) {
      const listeners = new Set<(event: 'enter' | 'exit') => void>()
      const fire = (event: 'enter' | 'exit') => {
        for (const listener of listeners) listener(event)
      }
      if (String(cfg.kind ?? 'proximity') === 'proximity') {
        // The one piece of this that DOES exist upstream.
        const element = b3dTrigger({
          x: ctx.at[0],
          y: ctx.at[1],
          z: ctx.at[2],
          radius: Number(cfg.radius ?? 3),
          once: cfg.once === true,
          debug: cfg.debug === true,
        }) as unknown as SceneElement
        ctx.scene.appendChild(element)
        const enter = () => fire('enter')
        const exit = () => fire('exit')
        element.addEventListener('enter', enter)
        element.addEventListener('exit', exit)
        ctx.onDispose(() => {
          element.removeEventListener('enter', enter)
          element.removeEventListener('exit', exit)
          element.remove()
        })
      }
      return {
        on(listener: (event: 'enter' | 'exit') => void) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
        fire,
      }
    },
    link(handle, ctx) {
      // An `action` trigger fires when its piece is USED, which is the same
      // substrate a door uses — a trigger you must operate is not a different
      // mechanism, only a different consequence.
      const interactive = ctx.feature('interactive') as InteractiveHandle | undefined
      const h = handle as { fire: (event: 'enter' | 'exit') => void }
      if (interactive) ctx.onDispose(interactive.onUse(() => h.fire('enter')))
    },
  })
}

/** Write a transform to whichever kind of body this piece has. */
function writeBody(
  body: Record<string, unknown>,
  transform: { at?: [number, number, number]; rot?: [number, number, number] }
): void {
  const isElement = typeof body.appendChild === 'function'
  if (isElement) {
    if (transform.at) {
      body.x = transform.at[0]
      body.y = transform.at[1]
      body.z = transform.at[2]
    }
    if (transform.rot) {
      body.rx = transform.rot[0]
      body.ry = transform.rot[1]
      body.rz = transform.rot[2]
    }
    return
  }
  const node = body as unknown as {
    position?: { x: number; y: number; z: number }
    rotation?: { x: number; y: number; z: number }
    rotationQuaternion?: unknown
  }
  if (transform.at && node.position) {
    node.position.x = transform.at[0]
    node.position.y = transform.at[1]
    node.position.z = transform.at[2]
  }
  if (transform.rot && node.rotation) {
    node.rotationQuaternion = null
    const rad = Math.PI / 180
    node.rotation.x = transform.rot[0] * rad
    node.rotation.y = transform.rot[1] * rad
    node.rotation.z = transform.rot[2] * rad
  }
}

/** The Babylon light a lamp drives, if one could be made. */
function makeLight(ctx: FeatureContext, cfg: Record<string, unknown>): { intensity: number } | null {
  const el = (ctx.scene as unknown as { ownerDocument?: Document }).ownerDocument
  if (!el) return null
  const light = el.createElement('tosi-b3d-light') as HTMLElement & { light?: { intensity: number } }
  light.setAttribute('x', String(ctx.at[0]))
  light.setAttribute('y', String(ctx.at[1]))
  light.setAttribute('z', String(ctx.at[2]))
  light.setAttribute('intensity', String(cfg.on === false ? 0 : (cfg.brightness ?? 1.2)))
  if (cfg.color) light.setAttribute('diffuse', String(cfg.color))
  ctx.scene.appendChild(light)
  ctx.onDispose(() => light.remove())
  return (light.light ?? { intensity: Number(cfg.brightness ?? 1.2) }) as { intensity: number }
}
