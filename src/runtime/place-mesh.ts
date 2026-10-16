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

## Rotation and scale: the element's, since tosijs-3d 0.8.1

For years they were not. `b3d-destroyable` forwarded only position to
`library.instantiate`, and `size` is the placeholder cube's edge, so an
authored `rot: [0, 45, 0]` left the footprint at 3.63 × 3.63 and `scale` 1, 2
and 4 all rendered 5.273 wide. We wrote both onto the instance's node, after
polling for it to exist. tosijs-3d#47 and #48 fixed that upstream: the element
forwards `rx`/`ry`/`rz`, has a uniform `scale`, and re-renders once its node
exists. So the rotation is simply the element's attributes, and the scale goes
through `scaleElement` (`node-transform.ts`), which uses the element's `scale`
and keeps a non-uniform one on the node through the element's re-renders.
No poll is left: the element's own post-load render applies both.

## Nothing to instantiate from? Draw a box.

Without a library — or with a mesh name the library does not have — the piece
becomes a `b3d-box` at the same spot. The ARRANGEMENT is most of what an author
is judging, so cubes in the right places beat an empty scene.
*/
/*{"parent":"Internals","order":9}*/
import { b3dBox, b3dDestroyable, b3dRadarBlip } from "tosijs-3d";
import { scaleElement } from "./node-transform.js";
import type { ScalableElement } from "./node-transform.js";
import type { SceneElement } from "../format/registry.js";
import type { Piece, Vec3 } from "../format/types.js";
import type { PlaceContext, Placement } from "./build.js";

interface LibraryElement {
  getNames?: () => string[];
}

interface SceneWithLibraries {
  getLibrary?: (type: string) => LibraryElement | null;
}

export function placeMesh(
  piece: Piece,
  at: Vec3,
  scale: Vec3,
  ctx: PlaceContext
): Placement | null {
  // No mesh is legitimate: an environment primitive (terrain, sun, sky, water)
  // IS its feature, and there is nothing to instantiate.
  if (!piece.mesh) return null;

  const library = ctx.library
    ? (ctx.scene as unknown as SceneWithLibraries).getLibrary?.(ctx.library)
    : null;
  const has = library?.getNames?.().includes(piece.mesh) ?? false;

  const rotation = {
    // DEGREES. tosijs-3d takes euler degrees; Babylon is radians, and a bare
    // number is valid in either — so the wrong one silently reorients a piece.
    rx: piece.rot?.[0] ?? 0,
    ry: piece.rot?.[1] ?? 0,
    rz: piece.rot?.[2] ?? 0,
  };

  if (has) {
    const combat = ctx.features.destroyable as
      | { hp?: number; armor?: number; explode?: boolean }
      | undefined;
    const element = b3dDestroyable({
      library: ctx.library,
      meshName: piece.mesh,
      x: at[0],
      y: at[1],
      z: at[2],
      ...rotation,
      // The placeholder cube's edge, if the element falls back to one; a
      // library piece's scale is `scaleElement`'s, below.
      size: scale[0],
      /*
        The combat spec is set HERE, at creation, not by the feature afterwards.
        A destroyable behaviour captures its spec when it ATTACHES, so an
        attribute written later is silently inert — measured by manta-recon, and
        the reason `setChain()` exists at all.
      */
      destroyable: combat ? "on" : "off",
      ...(combat
        ? {
            capacity: combat.hp ?? 12,
            armor: combat.armor ?? 0,
            explode: combat.explode === false ? "off" : "on",
          }
        : {}),
    }) as unknown as SceneElement;

    // Before it is appended, so the post-load render already carries it.
    scaleElement(element as unknown as ScalableElement, scale);
    // Creating an element does not add it. This is the step whose absence
    // produces no errors, no pieces, and nothing in the console.
    ctx.scene.appendChild(element);
    return {
      element,
      // No orphan reaper any more — see the note at the end of this file.
      dispose: () => element.remove(),
    };
  }

  const box = b3dBox({
    // A box IS its size, so the placeholder takes the enclosing extent rather
    // than stretching — it is standing in for a mesh, not pretending to be one.
    size: Math.max(scale[0], scale[1], scale[2]),
    x: at[0],
    y: at[1],
    z: at[2],
    ...rotation,
    color: "#8a6a52",
  }) as unknown as SceneElement;
  ctx.scene.appendChild(box);
  return { element: box, dispose: () => box.remove() };
}

/*
  THE ORPHAN REAPER IS GONE, and it went because it had become the leak.

  `b3d-destroyable` used to instantiate inside `lib.ready.then(...)` even after
  its element was removed, leaving a node nobody disposed: four quick edits
  stood four copies of a tower in the scene (210 meshes where there had been
  81). We filed tosijs-3d#49 and polled every removed element for 12 s to
  dispose any late arrival.

  tosijs-3d 0.8.1 fixed it upstream (`loadGeneration`: a stale callback
  discards itself), so the late node can no longer arrive and the poll always
  ran its full budget. Every rebuild armed one per piece: 38 timers at 20 Hz for
  12 s on the pirate cove, on every edit and every visit. Measured on 0.8.9 in
  the re-parent lane: ~2,700 interval ticks a second after two visits, trips
  slowing from 5 s to 40 s until they missed the settle window. Removing it was
  tested against the regression it guarded: rapid edits leave the mesh count
  where it was.
*/

/** `b3dRadarBlip` as a child of the piece — it travels with what it marks. */
export function attachBlip(
  element: SceneElement,
  cfg: { faction?: string; profile?: number }
): () => void {
  const blip = b3dRadarBlip({
    faction: cfg.faction ?? "hostile",
    profile: cfg.profile ?? 1,
  }) as unknown as SceneElement;
  element.appendChild(blip);
  return () => blip.remove();
}
