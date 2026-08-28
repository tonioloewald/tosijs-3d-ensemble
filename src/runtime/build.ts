/*#
# Building an ensemble

`buildEnsemble` turns authored JSON into live scene objects. **The editor and
the game call this same function** — which is what makes "what you author is
what you get" true by construction rather than by discipline.

```typescript
import { buildEnsemble, loadEnsemble } from 'tosijs-3d-ensemble'

const built = buildEnsemble(ensemble, {
  scene: document.querySelector('tosi-b3d'),
  origin: [0, 0, 1200],
  library: 'enemies',
})

built.problems       // validation, non-fatal
built.pieces.get('reactor')?.element
built.dispose()      // and the scene is as it was
```

## Two phases, then teardown

1. **bind** — every piece gets its element, then each of its features creates
   its behaviour and returns a handle. Nothing may reach for a neighbour here.
2. **link** — every feature's `link` runs, and the instantiator wires the
   ensemble's `links` (chain reactions). Neighbours are all present by now.
3. **dispose** — teardown in reverse registration order.

Step 3 is not an afterthought. The editor rebuilds on every edit, so this path
runs hundreds of times a session where a game runs it once, and a leak a game
never notices will eat an editing session.

## Creating an element is not adding it

`b3dDestroyable()` only MAKES an element — nothing happens until it is appended.
The declarative `b3d({...}, ...children)` form does that implicitly, which is
why loading at runtime is where it bites: no error, no pieces, nothing in the
console. Every element this module creates is appended explicitly.
*/
/*{"parent":"Runtime","order":1}*/
import { featuresOf } from '../format/roles'
import { featureRegistration } from '../format/registry'
import { validate } from '../format/validate'
import { libraryNames, meshesByLibrary, mountLibraries, resolveLibrary } from './libraries'
import type { FeatureContext, SceneElement } from '../format/registry'
import type { Problem } from '../format/validate'
import type { Ensemble, Piece, Vec3 } from '../format/types'

export interface BuildOptions {
  /** The `<tosi-b3d>` element to append into. */
  scene: SceneElement
  /** Where the ensemble's local origin sits in the world. Default `[0,0,0]`. */
  origin?: Vec3
  /**
   * Extra library to resolve meshes against, beyond the ones the ensemble
   * declares. A host forcing its own content; usually unnecessary now that an
   * ensemble says what it needs.
   */
  library?: string
  /**
   * Mesh names, when known, so validation can check them. Derived from the
   * mounted libraries when omitted.
   */
  meshes?: Set<string> | Map<string, Set<string>>
  /**
   * Time source for features that animate. Defaults to `performance.now()/1000`.
   * See the caveat on `FeatureContext.simTime`: this scales EFFECT timing, not
   * craft motion.
   */
  simTime?: () => number
  /**
   * Give the piece a body. Defaults to `placeMesh` from `./place-mesh`, the
   * only part of this module that knows about tosijs-3d — swap it in a test, or
   * to render pieces some other way.
   *
   * Not called when a **body feature** already claimed the piece (see
   * `FeatureRegistration.body`).
   */
  placePiece?: (piece: Piece, at: Vec3, scale: number, ctx: PlaceContext) => Placement | null
}

/**
 * What placing a piece produced.
 *
 * Either an ELEMENT (a tosijs-3d component that manages its own transform) or a
 * NODE (a plain library instance that nothing manages). Most pieces are the
 * second: a rock does not need a component, and giving it one would make it a
 * participant in systems it has no business in.
 */
export interface Placement {
  element?: SceneElement | null
  node?: unknown
  dispose?: () => void
}

export interface PlaceContext {
  scene: SceneElement
  /** The library this piece resolves to, or `''` when there is none. */
  library: string
  /** Effective features, role preset already merged in. */
  features: Record<string, Record<string, unknown>>
}

export interface BuiltPiece {
  piece: Piece
  /** World position: origin + `at` × ensemble scale. */
  at: Vec3
  /** Ensemble scale × piece scale. */
  scale: number
  /** The element carrying this piece's body, if its body is an element. */
  element: SceneElement | null
  /** The Babylon node carrying this piece's body, if it is not an element. */
  node: unknown
  /** Handles returned by each feature's `bind`, keyed by feature name. */
  handles: Map<string, unknown>
}

export interface BuiltEnsemble {
  ensemble: Ensemble
  pieces: Map<string, BuiltPiece>
  problems: Problem[]
  /** Tear everything down. Safe to call twice. */
  dispose(): void
}

/**
 * Build an ensemble into a scene.
 *
 * Validation problems are RETURNED, never thrown, and never stop the build: a
 * malformed fortress should be reported and half-built in an editor, not
 * silently absent. A generator that wants to refuse checks `problems` itself.
 */
export function buildEnsemble(ensemble: Ensemble, opts: BuildOptions): BuiltEnsemble {
  const {
    scene,
    origin = [0, 0, 0] as Vec3,
    library = '',
    meshes,
    simTime = () => performance.now() / 1000,
    placePiece,
  } = opts

  const libraries = libraryNames(ensemble, library || undefined)
  const known = meshes ?? (libraries.length ? meshesByLibrary(scene, libraries) : undefined)
  const problems = validate(ensemble, known && (known as Map<string, Set<string>>).size !== 0 ? { meshes: known } : {})
  const ensembleScale = ensemble.scale ?? 1
  const pieces = new Map<string, BuiltPiece>()
  const disposers: Array<() => void> = []
  const onDispose = (fn: () => void) => disposers.push(fn)

  // Phase 1 — bind. Nothing here may reach for another piece.
  const bound: Array<{ built: BuiltPiece; feature: string; ctx: FeatureContext }> = []

  for (const piece of ensemble.pieces) {
    if (!piece.id || piece.ensemble) continue // reported by validate; not buildable
    const scale = ensembleScale * (piece.scale ?? 1)
    const at: Vec3 = [
      origin[0] + piece.at[0] * ensembleScale,
      origin[1] + piece.at[1] * ensembleScale,
      origin[2] + piece.at[2] * ensembleScale,
    ]
    const features = featuresOf(piece)
    // Resolved PER PIECE: a piece may name its own library, and otherwise the
    // first mounted one that actually has the mesh wins.
    const pieceLibrary = resolveLibrary(scene, libraries, piece) ?? ''
    const built: BuiltPiece = {
      piece,
      at,
      scale,
      element: null,
      node: null,
      handles: new Map(),
    }
    pieces.set(piece.id, built)

    /*
      A BODY feature creates the piece's body; every other feature decorates one.
      Body features therefore bind FIRST, and the rest see the result as
      `ctx.element` / `ctx.node`.

      The ordering matters for exactly one built-in — `destroyable` — and only
      because `b3d-destroyable` creates the mesh it owns. Destruction is a
      decorator conceptually; this is an upstream constraint, not a claim that
      being destroyable is how things exist.
    */
    const entries = Object.entries(features)
    const isBody = (name: string) => featureRegistration(name)?.body === true
    const ordered = [...entries.filter(([n]) => isBody(n)), ...entries.filter(([n]) => !isBody(n))]

    for (const [name, cfg] of ordered) {
      const reg = featureRegistration(name)
      if (!reg?.bind) continue

      // Once the body features have run, a plain piece still needs a body.
      if (!isBody(name) && !built.element && !built.node) {
        applyPlacement(
          built,
          placePiece?.(piece, at, scale, { scene, library: pieceLibrary, features }),
          onDispose
        )
      }

      const ctx = makeContext({
        scene,
        built,
        ensemble,
        piece,
        at,
        scale,
        library: pieceLibrary,
        onDispose,
        simTime,
        pieces,
      })
      // A feature that throws must not take the rest of the ensemble with it —
      // in the editor the author is mid-edit, and a half-built scene they can
      // see beats an empty one they cannot diagnose.
      try {
        const handle = reg.bind(piece, cfg, ctx)
        built.handles.set(name, handle)
        if (isBody(name) && isElement(handle)) built.element = handle
        bound.push({ built, feature: name, ctx })
      } catch (err) {
        problems.push({
          severity: 'error',
          code: 'bind-failed',
          message: `feature "${name}" failed to bind: ${String(err)}`,
          path: `/pieces/${ensemble.pieces.indexOf(piece)}/features/${name}`,
        })
      }
    }

    // A piece with no features at all, or only unregistered ones, still has a body.
    if (!built.element && !built.node) {
      applyPlacement(
        built,
        placePiece?.(piece, at, scale, { scene, library: pieceLibrary, features }),
        onDispose
      )
    }
  }

  // Phase 2 — link. Every piece is present, so reaching sideways is legal now.
  for (const { built, feature, ctx } of bound) {
    const reg = featureRegistration(feature)
    if (!reg?.link) continue
    try {
      reg.link(built.handles.get(feature) as never, ctx)
    } catch (err) {
      problems.push({
        severity: 'error',
        code: 'link-failed',
        message: `feature "${feature}" failed to link: ${String(err)}`,
        path: `/pieces/${ensemble.pieces.indexOf(built.piece)}/features/${feature}`,
      })
    }
  }

  let disposed = false
  return {
    ensemble,
    pieces,
    problems,
    dispose() {
      if (disposed) return
      disposed = true
      // Reverse order: a teardown that depends on something registered earlier
      // must run before that thing goes.
      for (const fn of disposers.reverse()) {
        try {
          fn()
        } catch {
          /* one bad teardown must not strand the rest */
        }
      }
      disposers.length = 0
      pieces.clear()
    },
  }
}

/** A body feature returns its element; anything else it returns is not a body. */
function isElement(value: unknown): value is SceneElement {
  return typeof value === 'object' && value !== null && 'appendChild' in value
}

function applyPlacement(
  built: BuiltPiece,
  placement: Placement | null | undefined,
  onDispose: (fn: () => void) => void
): void {
  if (!placement) return
  built.element = placement.element ?? null
  built.node = placement.node ?? null
  if (placement.dispose) onDispose(placement.dispose)
}

function makeContext(a: {
  scene: SceneElement
  built: BuiltPiece
  ensemble: Ensemble
  piece: Piece
  at: Vec3
  scale: number
  library: string
  onDispose: (fn: () => void) => void
  simTime: () => number
  pieces: Map<string, BuiltPiece>
}): FeatureContext {
  return {
    scene: a.scene,
    get element() {
      // A getter, not a snapshot: a body feature may set this AFTER a decorator
      // has already been handed its context.
      return a.built.element
    },
    get node() {
      return a.built.node
    },
    ensemble: a.ensemble,
    piece: a.piece,
    at: a.at,
    scale: a.scale,
    library: a.library,
    onDispose: a.onDispose,
    simTime: a.simTime,
    handle: (id: string) => {
      const built = a.pieces.get(id)
      if (!built) return undefined
      // The piece's own body is the useful default; a named feature handle is
      // reachable through `pieces` for anything finer.
      return built.element ?? built.node ?? built
    },
    piecesByRole: (role: string) => a.ensemble.pieces.filter((p) => p.role === role),
    feature: (name: string) => a.built.handles.get(name),
  }
}

/** Fetch and build. Ensembles are content, so they load like content. */
export async function loadEnsemble(
  url: string,
  opts: BuildOptions
): Promise<BuiltEnsemble> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`ensemble "${url}": ${response.status} ${response.statusText}`)
  }
  const ensemble = (await response.json()) as Ensemble
  /*
    MOUNT WHAT THE FILE ASKS FOR, then build. This is what makes an ensemble
    loadable anywhere: the consumer supplies a scene, and the content declares
    its own dependencies rather than relying on the caller to have mounted the
    right libraries first.
  */
  await mountLibraries(ensemble, opts.scene)
  return buildEnsemble(ensemble, opts)
}
