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
/*{"parent":"Format","order":3}*/
import type { Ensemble, Piece, Vec3 } from "./types";

/** The scene element (`<tosi-b3d>`), structurally typed so the format layer
 *  does not import the framework. */
export type SceneElement = HTMLElement & Record<string, unknown>;

/** JSON Schema (plus `x-` UI annotations the editor reads). */
export type FeatureSchema = Record<string, unknown>;

export interface FeatureContext {
  /** The `<tosi-b3d>` element to append components to. */
  scene: SceneElement;
  /**
   * The ELEMENT carrying this piece's body, when its body is an element.
   *
   * `null` for the two common cases that are not: a piece with no mesh (an
   * environment primitive, where the feature IS the body), and a plain piece
   * instantiated straight off the library as a node — see `node`.
   */
  element: SceneElement | null;
  /**
   * The Babylon NODE carrying this piece's body, when there is no element.
   *
   * A plain piece is not an element, because it does not need to be: nothing
   * manages its transform and nothing can shoot it. Typed loosely so the format
   * layer stays free of the engine.
   */
  node: unknown;
  /** The ensemble being built, as authored. */
  ensemble: Ensemble;
  /** The piece this feature is bound to. */
  piece: Piece;
  /** WORLD position of the piece: origin + `at` × scale. */
  at: Vec3;
  /** Effective scale for this piece: ensemble scale × piece scale. */
  scale: number;
  /** Library the ensemble instantiates meshes from; `''` when there is none. */
  library: string;
  /** Register teardown. Runs on dispose, in reverse order of registration. */
  onDispose(fn: () => void): void;
  /**
   * The handle another piece's `bind` returned. **`link` phase only** — during
   * `bind` the neighbours are still arriving.
   */
  handle(pieceId: string): unknown;
  /** Pieces carrying a role. **`link` phase only.** */
  piecesByRole(role: string): Piece[];
  /**
   * Another feature's handle on **this same piece**.
   *
   * Features compose: a `door` consults `interactive` to know when it was
   * used, and `interactive` consults `lockable` to know whether it may open.
   * Without this each of them would have to reimplement the others, or the
   * format would need one god-feature that knew about all of them.
   *
   * **`link` phase only** — during `bind` a piece's own siblings are still
   * arriving, which is the same reason reaching for another PIECE is illegal
   * then. Returns `undefined` when the feature is not on this piece, which is
   * the normal case: a door without a lock is just a door.
   */
  feature(name: string): unknown;
  /**
   * The time source, so effects honour pause and time scale.
   *
   * ⚠️ This scales EFFECT timing only. Craft motion cannot be scaled from here —
   * velocity comes from `b3d-aircraft` integrating against the engine delta.
   * Real slow-motion needs `owner.simTime`/`simDt` upstream (tosijs-3d#30).
   */
  simTime(): number;
}

export interface FeatureRegistration<Handle = unknown> {
  /** The key in a piece's `features` map. */
  name: string;
  /** JSON Schema; drives validation AND the editor's property panel. */
  schema: FeatureSchema;
  /** Create the behaviour and return a handle. Touch nothing else. */
  bind?(
    piece: Piece,
    cfg: Record<string, unknown>,
    ctx: FeatureContext
  ): Handle;
  /**
   * Apply a CHANGED config to the handle this feature already returned.
   *
   * Return true if it was applied. Return false, or omit this, and the caller
   * rebuilds the whole ensemble instead — which is correct but expensive, and
   * in an editor it is visible: a rebuild disposes and re-instantiates every
   * piece, and `place-mesh` applies rotation on a RETRY over several frames, so
   * rebuilding once per frame means no piece's rotation ever settles. Dragging
   * a sky slider straightened every ship in the scene until the drag ended.
   *
   * Most features are a thin mapping onto an element's attributes, and for
   * those this is one line — see `updateAttrs`.
   */
  update?(handle: Handle, cfg: Record<string, unknown>, piece: Piece): boolean;
  /** Reach for neighbours. Runs after every piece has bound. */
  link?(handle: Handle, ctx: FeatureContext): void;
  /**
   * This feature CREATES the piece's body, instead of decorating one.
   *
   * Body features bind first, and their element becomes the piece's element for
   * everything that follows.
   *
   * **No built-in uses this any more.** `destroyable` did, because
   * `b3d-destroyable` was the only way to place a library mesh and could not
   * opt out of combat — so destruction had to CREATE the body rather than
   * decorate one. tosijs-3d 0.7.2's `destroyable="off"` ended that, and
   * placement is now uniform.
   *
   * It stays in the contract for the case it was always right for: a feature
   * whose body is genuinely its own — a procedural mesh, a particle system, a
   * consumer's own geometry — rather than a decoration on a placed one.
   */
  body?: boolean;
  /**
   * What this feature LOOKS LIKE in a list, one glyph wide.
   *
   * On the registration and not in a `switch` in the editor, because the whole
   * property of a registry is that a consumer's feature is indistinguishable
   * from a built-in — and a switch breaks that at exactly the point a consumer
   * would notice: theirs is the only row with a blank icon.
   *
   * ⚠️ AN EMOJI TODAY, AN ICON NAME LATER. tosijs-3d's `iconData` holds 61
   * icons and every one is UI chrome — arrows, corners, play, trash, keyboard.
   * There is no sun, no light, no water, no mesh, no marker. Asked for in
   * tosijs-3d#64 along with an icon COLUMN type for `table`, since a cell
   * currently renders `String(v)` and has no route to a glyph.
   *
   * Emoji were verified in the browser rather than assumed: they render in
   * colour and `getComputedTextLength` measures them correctly (26.1 → 50.3px
   * for a two-character prefix), so the SVG UI lays a row out properly. That
   * was checked on the DOM overlay path ONLY — the in-scene texture path
   * rasterises the same SVG, and coloured glyphs and font fallback are exactly
   * where the two could diverge. Flagged in the issue; nobody has looked.
   */
  icon?: string;
  /**
   * This feature puts a real thing at `at`, and that thing cannot be seen.
   *
   * A lamp is a light: it has a location, it can be moved, and there is no
   * geometry anywhere to click. An editor supplies a beacon for it — see
   * `beacon-view.ts` — and this is how it knows to.
   *
   * Declared rather than inferred, because "has no geometry" is not the same
   * question. `skybox` is everywhere, `fog` and `ambient` are settings, and
   * `sun`'s `at` is a DIRECTION — a dot at `[-0.5, 1, 0.4]` would be a
   * confident lie about where the sun is. Inferring from "this piece has no
   * body" puts three junk dots near the origin.
   */
  marker?: boolean;
  /**
   * This feature can BE a piece — it is not a decoration on a placed mesh.
   *
   * The format has always allowed it: a piece with no `mesh` whose features are
   * its body is an "environment primitive", which is how `sun`, `skybox`,
   * `water` and `terrain` exist. What was missing was any way to CREATE one:
   * the insert palette lists library meshes, and every environment primitive
   * has no mesh, so an author could edit the ones a file already had and never
   * add another. "I can't add a terrain to a new scene."
   *
   * So the palette offers these under **utilities**, and a consumer's own
   * standalone feature appears there for free — the same registry property that
   * gives it an icon, a panel and a beacon.
   *
   * False for a decorator: `destroyable`, `spin`, `door` and `collidable`
   * modify a piece that already has a body, and offering them as things to
   * insert would produce pieces that are nothing at all.
   */
  primitive?: boolean;
  /**
   * A visualiser the editor shows but the runtime has no binding for.
   *
   * Legitimate, but mark it — otherwise an author can build something the game
   * cannot load, and find out at ship time.
   */
  editorOnly?: boolean;
}

const features = new Map<string, FeatureRegistration<never>>();

/** Register a feature. Overwrites a registration of the same name. */
export function registerFeature<Handle>(
  reg: FeatureRegistration<Handle>
): void {
  features.set(reg.name, reg as FeatureRegistration<never>);
}

/** Look up one feature registration. */
export function featureRegistration(
  name: string
): FeatureRegistration<never> | undefined {
  return features.get(name);
}

/**
 * Every registered feature.
 *
 * The editor's palette is THIS, not a hardcoded list — which is what puts a
 * consumer's escort-zone feature beside `turret` with no special case.
 */
export function registeredFeatures(): FeatureRegistration<never>[] {
  return [...features.values()];
}

/** Drop a registration. Mainly for tests, which must not leak into each other. */
export function unregisterFeature(name: string): boolean {
  return features.delete(name);
}
