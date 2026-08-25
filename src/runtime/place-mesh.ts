/*#
# Placing a piece's body

The instantiator gives a piece its body; features then decorate it. This is the
only module that knows how a mesh reaches a tosijs-3d scene, which is why
`buildEnsemble` takes it as an option — a test swaps it for a stub.

## `destroyable` is a DECORATOR, and now it really is one

Most of what an ensemble describes — a lamp post, a rock, a ground plane, a
whole standard demo scene — can never be shot, and giving it hit points is not a
harmless default: terrain that quietly accumulates damage and vanishes at
100 000 is a worse outcome than terrain that was never a combatant.

For a while that forced an awkward shape. `b3d-destroyable` is the only element
that instantiates a library mesh BY NAME, and it had no way out of the combat
system, so either everything was a combatant or destruction had to CREATE the
body rather than decorate one. We placed plain pieces as raw library nodes to
dodge it, and `destroyable` had to register `body: true`.

**tosijs-3d 0.7.2 added `destroyable="off"`** (tosijs-3d#39, our ask), so that is
over. Every mesh piece is placed the same way and `destroyable` is a genuine
decorator: it contributes hit points to a body that already exists rather than
being the reason the body exists.

## Nothing to instantiate from? Draw a box.

Without a library — or with a mesh name the library does not have — the piece
becomes a `b3d-box` at the same spot. The ARRANGEMENT is most of what an author
is judging, so cubes in the right places beat an empty scene.
*/
import { b3dBox, b3dDestroyable, b3dRadarBlip } from 'tosijs-3d'
import type { SceneElement } from '../format/registry'
import type { Piece, Vec3 } from '../format/types'
import type { PlaceContext, Placement } from './build'

interface LibraryElement {
  getNames?: () => string[]
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
  const has = library?.getNames?.().includes(piece.mesh) ?? false

  const rotation = {
    // DEGREES. tosijs-3d takes euler degrees; Babylon is radians, and a bare
    // number is valid in either — so the wrong one silently reorients a piece.
    rx: piece.rot?.[0] ?? 0,
    ry: piece.rot?.[1] ?? 0,
    rz: piece.rot?.[2] ?? 0,
  }

  if (has) {
    const combat = ctx.features.destroyable as
      | { hp?: number; armor?: number; explode?: boolean }
      | undefined
    const element = b3dDestroyable({
      library: ctx.library,
      meshName: piece.mesh,
      x: at[0],
      y: at[1],
      z: at[2],
      ...rotation,
      size: scale,
      /*
        The combat spec is set HERE, at creation, not by the feature afterwards.
        A destroyable behaviour captures its spec when it ATTACHES, so an
        attribute written later is silently inert — measured by manta-recon, and
        the reason `setChain()` exists at all.
      */
      destroyable: combat ? 'on' : 'off',
      ...(combat
        ? {
            capacity: combat.hp ?? 12,
            armor: combat.armor ?? 0,
            explode: combat.explode === false ? 'off' : 'on',
          }
        : {}),
    }) as unknown as SceneElement

    // Creating an element does not add it. This is the step whose absence
    // produces no errors, no pieces, and nothing in the console.
    ctx.scene.appendChild(element)
    return { element, dispose: () => element.remove() }
  }

  const box = b3dBox({
    size: scale,
    x: at[0],
    y: at[1],
    z: at[2],
    ...rotation,
    color: '#8a6a52',
  }) as unknown as SceneElement
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
