/*#
# Placing a piece's body

The instantiator gives a piece its body; features then decorate it. This is the
only module that knows how a mesh reaches a tosijs-3d scene, which is why
`buildEnsemble` takes it as an option — a test swaps it for a stub.

## A plain piece is not a combatant

**`destroyable` is a DECORATOR, not the way things exist.** Most of what an
ensemble describes — a lamp post, a rock, a ground plane, a whole standard demo
scene — can never be shot, and giving it hit points is not a harmless default:
terrain that quietly accumulates damage and vanishes at 100 000 is a worse
outcome than terrain that was never a combatant.

So a plain piece is instantiated straight off the library as a Babylon node:
no element, no combat record, nothing to damage. A piece that DECLARES
`destroyable` is placed by that feature instead (it is registered `body: true`),
because in tosijs-3d today `b3d-destroyable` creates the mesh it owns.

An earlier version placed everything through `b3d-destroyable` with
`armor: 100_000`. That is the bad design named above, and it is gone.

## Nothing to instantiate from? Draw a box.

Without a library — or with a mesh name the library does not have — the piece
becomes a `b3d-box` at the same spot. The ARRANGEMENT is most of what an author
is judging, so cubes in the right places beat an empty scene, and a box is a
primitive with no combat behaviour either.
*/
import { b3dBox, b3dRadarBlip } from 'tosijs-3d'
import type { SceneElement } from '../format/registry'
import type { Piece, Vec3 } from '../format/types'
import type { PlaceContext, Placement } from './build'

interface LibraryElement {
  ready?: Promise<void>
  getNames?: () => string[]
  instantiate?: (name: string, options?: Record<string, unknown>) => unknown
}

interface SceneWithLibraries {
  getLibrary?: (type: string) => LibraryElement | null
}

export function placeMesh(
  piece: Piece,
  at: Vec3,
  scale: number,
  ctx: PlaceContext
): Placement | null {
  // No mesh is legitimate: an environment primitive (terrain, sun, sky, water)
  // IS its feature, and there is nothing to instantiate.
  if (!piece.mesh) return null

  const library = ctx.library
    ? (ctx.scene as unknown as SceneWithLibraries).getLibrary?.(ctx.library)
    : null

  const node = library?.instantiate?.(piece.mesh, {
    x: at[0],
    y: at[1],
    z: at[2],
    // DEGREES. tosijs-3d takes euler degrees; Babylon is radians, and a bare
    // number is valid in either — so the wrong one silently reorients a piece.
    rx: piece.rot?.[0] ?? 0,
    ry: piece.rot?.[1] ?? 0,
    rz: piece.rot?.[2] ?? 0,
    canonical: true,
  }) as { scaling?: { setAll: (n: number) => void }; dispose?: () => void } | null

  if (node) {
    node.scaling?.setAll(scale)
    return { node, dispose: () => node.dispose?.() }
  }

  const box = b3dBox({
    size: scale,
    x: at[0],
    y: at[1],
    z: at[2],
    rx: piece.rot?.[0] ?? 0,
    ry: piece.rot?.[1] ?? 0,
    rz: piece.rot?.[2] ?? 0,
    color: '#8a6a52',
  }) as unknown as SceneElement

  // Creating an element does not add it. The declarative `b3d(...)` form
  // appends implicitly; building at runtime is where forgetting it costs you an
  // afternoon, because there is no error and no piece.
  ctx.scene.appendChild(box)
  return { element: box, dispose: () => box.remove() }
}

/** `b3dRadarBlip` as a child of the piece — it travels with what it marks. */
export function attachBlip(
  element: SceneElement,
  cfg: { faction?: string; profile?: number }
): () => void {
  const blip = b3dRadarBlip({
    faction: cfg.faction ?? 'hostile',
    profile: cfg.profile ?? 1,
  }) as unknown as SceneElement
  element.appendChild(blip)
  return () => blip.remove()
}
