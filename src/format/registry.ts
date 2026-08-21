/*#
# The feature registry

A feature is a **registration**, not a case in a switch. That is what makes the
format open: a consumer's feature is indistinguishable from a shipped one in the
file, in the editor's palette, in `ref` pick lists, and in save/load.

```typescript
import { registerFeature } from 'tosijs-3d-ensemble'

registerFeature({
  name: 'turret',
  schema: {
    type: 'object',
    title: 'Turret',
    properties: {
      range: { type: 'number', minimum: 20, maximum: 2000, default: 260, 'x-unit': 'm' },
      smart: { type: 'boolean', default: false, description: 'leads its target' },
    },
  },
  bind(piece, cfg, ctx) {
    const el = b3dTurret({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })
    ctx.scene.appendChild(el)
    ctx.onDispose(() => el.remove())
    return el
  },
})
```

## `bind` and `link` are two phases, and that is not a style preference

A `protector` that resolves its power source during `bind` works only if the
reactor happened to bind first — so the same ensemble behaves differently
depending on the order pieces appear in the file, and reordering them in the
editor silently changes behaviour. That is a nasty bug class: it looks like an
intermittent content problem, not a lifecycle one.

So **`bind` creates and returns a handle, touching nothing else**, and
**`link` runs after every piece has bound** and is the only place `ctx.handle`,
`ctx.piecesByRole` and zone lookups are legal. Same shape as tosijs-3d's
scene-listener contract, for the same reason: a thing that reaches for its
neighbours cannot run while the neighbours are still arriving.

## Rebuilding must be idempotent

The editor rebuilds an ensemble on **every edit** — hundreds of times a session
where a game does it once. `onDispose` is necessary and not sufficient; the test
worth writing is *build → dispose → build*, asserting the scene's mesh, observer
and material counts return to where they started. A leak a game never notices
will eat an editing session.

## Guard your per-frame work

A throw inside a Babylon render observer kills the render loop **permanently** —
`notifyObservers` has no isolation and the loop does not re-queue, so the page
goes black with no error where anyone would look. A `bind`/`link` that registers
per-frame work must guard itself.
*/
import type { Ensemble, Piece, Vec3 } from './types'

/** The scene element (`<tosi-b3d>`), structurally typed so the format layer
 *  does not import the framework. */
export type SceneElement = HTMLElement & Record<string, unknown>

/** JSON Schema (plus `x-` UI annotations the editor reads). */
export type FeatureSchema = Record<string, unknown>

export interface FeatureContext {
  /** The `<tosi-b3d>` element to append components to. */
  scene: SceneElement
  /**
   * The ELEMENT carrying this piece's body, when its body is an element.
   *
   * `null` for the two common cases that are not: a piece with no mesh (an
   * environment primitive, where the feature IS the body), and a plain piece
   * instantiated straight off the library as a node — see `node`.
   */
  element: SceneElement | null
  /**
   * The Babylon NODE carrying this piece's body, when there is no element.
   *
   * A plain piece is not an element, because it does not need to be: nothing
   * manages its transform and nothing can shoot it. Typed loosely so the format
   * layer stays free of the engine.
   */
  node: unknown
  /** The ensemble being built, as authored. */
  ensemble: Ensemble
  /** The piece this feature is bound to. */
  piece: Piece
  /** WORLD position of the piece: origin + `at` × scale. */
  at: Vec3
  /** Effective scale for this piece: ensemble scale × piece scale. */
  scale: number
  /** Library the ensemble instantiates meshes from; `''` when there is none. */
  library: string
  /** Register teardown. Runs on dispose, in reverse order of registration. */
  onDispose(fn: () => void): void
  /**
   * The handle another piece's `bind` returned. **`link` phase only** — during
   * `bind` the neighbours are still arriving.
   */
  handle(pieceId: string): unknown
  /** Pieces carrying a role. **`link` phase only.** */
  piecesByRole(role: string): Piece[]
  /**
   * The time source, so effects honour pause and time scale.
   *
   * ⚠️ This scales EFFECT timing only. Craft motion cannot be scaled from here —
   * velocity comes from `b3d-aircraft` integrating against the engine delta.
   * Real slow-motion needs `owner.simTime`/`simDt` upstream (tosijs-3d#30).
   */
  simTime(): number
}

export interface FeatureRegistration<Handle = unknown> {
  /** The key in a piece's `features` map. */
  name: string
  /** JSON Schema; drives validation AND the editor's property panel. */
  schema: FeatureSchema
  /** Create the behaviour and return a handle. Touch nothing else. */
  bind?(piece: Piece, cfg: Record<string, unknown>, ctx: FeatureContext): Handle
  /** Reach for neighbours. Runs after every piece has bound. */
  link?(handle: Handle, ctx: FeatureContext): void
  /**
   * This feature CREATES the piece's body, instead of decorating one.
   *
   * Body features bind first, and their element becomes the piece's element for
   * everything that follows. `destroyable` is one, not because destruction is
   * fundamental — it is a decorator, and most things never have it — but
   * because `b3d-destroyable` creates the mesh it owns, so it cannot decorate a
   * body that already exists. When tosijs-3d can place a library mesh without a
   * combatant (UPSTREAM.md #2), this flag stops being needed for it.
   */
  body?: boolean
  /**
   * A visualiser the editor shows but the runtime has no binding for.
   *
   * Legitimate, but mark it — otherwise an author can build something the game
   * cannot load, and find out at ship time.
   */
  editorOnly?: boolean
}

const features = new Map<string, FeatureRegistration<never>>()

/** Register a feature. Overwrites a registration of the same name. */
export function registerFeature<Handle>(reg: FeatureRegistration<Handle>): void {
  features.set(reg.name, reg as FeatureRegistration<never>)
}

/** Look up one feature registration. */
export function featureRegistration(name: string): FeatureRegistration<never> | undefined {
  return features.get(name)
}

/**
 * Every registered feature.
 *
 * The editor's palette is THIS, not a hardcoded list — which is what puts a
 * consumer's escort-zone feature beside `turret` with no special case.
 */
export function registeredFeatures(): FeatureRegistration<never>[] {
  return [...features.values()]
}

/** Drop a registration. Mainly for tests, which must not leak into each other. */
export function unregisterFeature(name: string): boolean {
  return features.delete(name)
}
