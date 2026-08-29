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

## Scale goes on the NODE, because `size` is inert

`b3d-destroyable`'s `size` is the placeholder cube's edge length and is
*ignored when `library` is set* — so for every piece with a real mesh, writing
it does nothing. Measured before trusting it: rendered width stayed 5.273 at
`scale` 1, 2 and 4 alike. `piece.scale` was a documented field that moved
nothing, which is the worst kind of control there is.

The element's own `mesh` — the library instance's root `TransformNode` — does
scale, and the element does not rewrite its scaling the way it rewrites
position. So scale is applied there, which also makes per-axis scale free.
Filed as tosijs-3d#47: a scale attribute belongs on the element, and then this
goes away.

**The node does not exist yet when the element is appended.** `b3d-destroyable`
instantiates inside `lib.ready.then(...)`, so `element.mesh` is null for at
least a microtask after `appendChild`. Applying scale once, immediately, would
silently do nothing — the same failure as `size`, one layer down. `whenMeshed`
below is the retry, bounded so a piece that never instantiates cannot leave an
observer running forever.

## Nothing to instantiate from? Draw a box.

Without a library — or with a mesh name the library does not have — the piece
becomes a `b3d-box` at the same spot. The ARRANGEMENT is most of what an author
is judging, so cubes in the right places beat an empty scene.
*/
/*{"parent":"Internals","order":9}*/
import { b3dBox, b3dDestroyable, b3dRadarBlip } from 'tosijs-3d'
import { applyScale } from './node-scale'
import type { ScalableNode } from './node-scale'
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
  scale: Vec3,
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
      // Inert for a library piece — see the note above — but still the right
      // value for the placeholder path the element falls back to.
      size: scale[0],
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
    const stopWaiting = whenMeshed(ctx.scene, element, (node) => applyScale(node, scale))
    return {
      element,
      dispose: () => {
        stopWaiting()
        element.remove()
      },
    }
  }

  const box = b3dBox({
    // A box IS its size, so the placeholder takes the enclosing extent rather
    // than stretching — it is standing in for a mesh, not pretending to be one.
    size: Math.max(scale[0], scale[1], scale[2]),
    x: at[0],
    y: at[1],
    z: at[2],
    ...rotation,
    color: '#8a6a52',
  }) as unknown as SceneElement
  ctx.scene.appendChild(box)
  return { element: box, dispose: () => box.remove() }
}

/**
 * Run `apply` once the element has a node, now or on a later frame.
 *
 * Returns a canceller. The frame budget is what keeps this honest: a piece
 * whose library never resolves would otherwise leave an observer running for
 * the life of the scene, and the editor rebuilds hundreds of times a session.
 *
 * The observable comes from the SCENE element, not the piece — a
 * `b3d-destroyable` has no `.scene`, so reading it there returned undefined and
 * this bailed out silently, leaving the scale unapplied. Measured: the piece's
 * rendered size stayed put while `piece.scale` said `[4, 1, 1]`, which is the
 * same class of quiet nothing as the `size` attribute it replaced.
 *
 * ⚠️ The callback runs INSIDE a render observer, where Babylon has no isolation
 * and a throw kills the render loop permanently — the page goes black with no
 * error where anyone would look. Hence the guard.
 */
function whenMeshed(
  sceneElement: SceneElement,
  element: SceneElement,
  apply: (node: ScalableNode) => void,
  frameBudget = 240
): () => void {
  const host = element as unknown as { mesh?: ScalableNode | null }
  if (host.mesh) {
    apply(host.mesh)
    return () => {}
  }
  const scene = (sceneElement as unknown as { scene?: BabylonScene }).scene
  const observable = scene?.onBeforeRenderObservable
  if (!observable?.add) return () => {}
  let frames = 0
  let observer: unknown = null
  const stop = () => {
    if (observer) observable.remove?.(observer)
    observer = null
  }
  observer = observable.add(() => {
    try {
      if (host.mesh) {
        apply(host.mesh)
        stop()
        return
      }
      if (++frames > frameBudget) stop()
    } catch {
      stop()
    }
  })
  return stop
}

interface BabylonScene {
  onBeforeRenderObservable?: {
    add?: (fn: () => void) => unknown
    remove?: (observer: unknown) => void
  }
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
