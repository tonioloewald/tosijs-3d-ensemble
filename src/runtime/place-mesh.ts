/*#
# Placing a piece's mesh

The instantiator places the piece's body; features then attach behaviour to it.
This is the only module that knows how a mesh reaches a tosijs-3d scene, which
is why `buildEnsemble` takes it as an option — a test swaps it for a stub, and a
consumer rendering pieces some other way can too.

## Why a destroyable places even an indestructible thing

`b3dDestroyable` is currently the only element that instantiates a LIBRARY mesh
by name (`library` + `meshName`, added in 0.7.0 for exactly this). `b3d-loader`
takes a `url` and loses the canonical frame; `b3d-aircraft` gets the frame right
and flies away. So a piece with no `destroyable` feature is placed as a
destroyable with enormous armour — the same trick Manta's `structure` role used.

That is a workaround, and it is recorded as one: a "place a library mesh, no
combat" element belongs upstream, not here.
*/
import { b3dDestroyable, b3dRadarBlip } from 'tosijs-3d'
import type { SceneElement } from '../format/registry'
import type { Piece, Vec3 } from '../format/types'
import type { PlaceContext } from './build'

/** Armour that means "scenery": shooting it is possible and pointless. */
const INDESTRUCTIBLE = 100_000

export function placeMesh(
  piece: Piece,
  at: Vec3,
  scale: number,
  ctx: PlaceContext
): SceneElement | null {
  // A piece with no mesh is legitimate: environment primitives (terrain, water,
  // clouds, a medium layer) ARE their feature, and there is no library mesh to
  // instantiate. Those pieces bind their feature and place nothing here.
  if (!piece.mesh) return null

  const destroyable = ctx.features.destroyable as
    | { hp?: number; armor?: number; explode?: boolean }
    | undefined

  const el = b3dDestroyable({
    /*
      `library` is passed ONLY when there is one. b3d-destroyable draws a
      placeholder cube when the attribute is absent, but with a library NAME it
      waits for a `<tosi-b3d-library>` that never arrives and logs after five
      seconds — so an ensemble opened without its library rendered as nothing at
      all. Cubes in the right places are the useful failure: the ARRANGEMENT is
      most of what an author is judging.
    */
    ...(ctx.library ? { library: ctx.library } : {}),
    meshName: piece.mesh,
    x: at[0],
    y: at[1],
    z: at[2],
    // DEGREES. tosijs-3d elements take euler degrees; Babylon is radians, and a
    // bare number is valid in either, so this is a silent-wrong-orientation trap.
    rx: piece.rot?.[0] ?? 0,
    ry: piece.rot?.[1] ?? 0,
    rz: piece.rot?.[2] ?? 0,
    size: scale,
    capacity: destroyable?.hp ?? 1,
    armor: destroyable?.armor ?? (destroyable ? 0 : INDESTRUCTIBLE),
    explode: destroyable?.explode ? 'on' : 'off',
  }) as unknown as SceneElement

  // Creating an element does not add it. This is the step whose absence
  // produces no errors, no pieces, and nothing in the console.
  ctx.scene.appendChild(el)
  return el
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
