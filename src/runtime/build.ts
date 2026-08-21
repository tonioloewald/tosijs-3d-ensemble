/*#
# Building an ensemble

`buildEnsemble` turns authored JSON into live scene objects. **The editor and
the game call this same function** — which is what makes "what you author is
what you get" true by construction rather than by discipline.

```js
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
import { featuresOf } from '../format/roles'
import { featureRegistration } from '../format/registry'
import { validate } from '../format/validate'
import type { FeatureContext, SceneElement } from '../format/registry'
import type { Problem } from '../format/validate'
import type { Ensemble, Piece, Vec3 } from '../format/types'

export interface BuildOptions {
  /** The `<tosi-b3d>` element to append into. */
  scene: SceneElement
  /** Where the ensemble's local origin sits in the world. Default `[0,0,0]`. */
  origin?: Vec3
  /** Library to instantiate meshes from. Default `'enemies'`. */
  library?: string
  /** Mesh names, when known, so validation can check them. */
  meshes?: Set<string>
  /**
   * Time source for features that animate. Defaults to `performance.now()/1000`.
   * See the caveat on `FeatureContext.simTime`: this scales EFFECT timing, not
   * craft motion.
   */
  simTime?: () => number
  /**
   * Place the piece's mesh. Defaults to `placeMesh` from `./place-mesh`, which
   * is the only part of this module that knows about tosijs-3d — swap it in a
   * test, or to render pieces some other way.
   */
  placePiece?: (piece: Piece, at: Vec3, scale: number, ctx: PlaceContext) => SceneElement | null
}

export interface PlaceContext {
  scene: SceneElement
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
  /** The element carrying this piece's mesh, if one was placed. */
  element: SceneElement | null
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
    library = 'enemies',
    meshes,
    simTime = () => performance.now() / 1000,
    placePiece,
  } = opts

  const problems = validate(ensemble, meshes ? { meshes } : {})
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
    const element = placePiece
      ? placePiece(piece, at, scale, { scene, library, features })
      : null
    if (element) onDispose(() => element.remove())

    const built: BuiltPiece = { piece, at, scale, element, handles: new Map() }
    pieces.set(piece.id, built)

    for (const [name, cfg] of Object.entries(features)) {
      const reg = featureRegistration(name)
      if (!reg?.bind) continue
      const ctx = makeContext({ scene, element, ensemble, piece, at, scale, onDispose, simTime, pieces })
      // A feature that throws must not take the rest of the ensemble with it —
      // in the editor the author is mid-edit, and a half-built scene they can
      // see beats an empty one they cannot diagnose.
      try {
        built.handles.set(name, reg.bind(piece, cfg, ctx))
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

function makeContext(a: {
  scene: SceneElement
  element: SceneElement | null
  ensemble: Ensemble
  piece: Piece
  at: Vec3
  scale: number
  onDispose: (fn: () => void) => void
  simTime: () => number
  pieces: Map<string, BuiltPiece>
}): FeatureContext {
  return {
    scene: a.scene,
    element: a.element,
    ensemble: a.ensemble,
    piece: a.piece,
    at: a.at,
    scale: a.scale,
    onDispose: a.onDispose,
    simTime: a.simTime,
    handle: (id: string) => {
      const built = a.pieces.get(id)
      if (!built) return undefined
      // The piece's own element is the useful default; a named feature handle
      // is reachable through `pieces` for anything finer.
      return built.element ?? built
    },
    piecesByRole: (role: string) =>
      a.ensemble.pieces.filter((p) => p.role === role),
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
  return buildEnsemble((await response.json()) as Ensemble, opts)
}
