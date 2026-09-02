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

## Rotation and scale go on the NODE; only position survives the element

`b3d-destroyable`'s `size` is the placeholder cube's edge length and is
*ignored when `library` is set* — so for every piece with a real mesh, writing
it does nothing. Worse, the element forwards only `{x, y, z, canonical}` to
`library.instantiate`, so **`rx`/`ry`/`rz` never reach the instance either**.

Both measured before trusting anything: rendered width stayed 5.273 at `scale`
1, 2 and 4 alike, and an authored `rot: [0, 45, 0]` left the footprint at
3.63 × 3.63 — identical to no rotation. `piece.scale` and `piece.rot` were
documented fields that moved nothing, which is the worst kind of control there
is. Position is the exception and always worked, because the element rewrites
`mesh.position` from `x`/`y`/`z` every frame.

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
import { b3dBox, b3dDestroyable, b3dRadarBlip } from "tosijs-3d";
import { applyEuler, applyScale } from "./node-transform";
import type { TransformableNode } from "./node-transform";
import type { SceneElement } from "../format/registry";
import type { Piece, Vec3 } from "../format/types";
import type { PlaceContext, Placement } from "./build";

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
      // Inert for a library piece — see the note above — but still the right
      // value for the placeholder path the element falls back to.
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

    // Creating an element does not add it. This is the step whose absence
    // produces no errors, no pieces, and nothing in the console.
    ctx.scene.appendChild(element);
    const stopWaiting = whenMeshed(element, (node) => {
      // BOTH, and both for the same reason: the element forwards neither to the
      // library instance. `rx`/`ry`/`rz` are dropped by `instantiate`, and
      // `size` is the placeholder cube's edge. Only position survives the trip.
      applyEuler(node, [rotation.rx, rotation.ry, rotation.rz]);
      applyScale(node, scale);
    });
    return {
      element,
      dispose: () => {
        stopWaiting();
        element.remove();
        reapOrphan(element);
      },
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

/** Poll interval for the setup waits below. */
const TICK_MS = 50;

/**
 * ~12s of ticks. Bounded so a piece whose library never resolves cannot leave a
 * timer running for the life of the session — the editor rebuilds hundreds of
 * times and each rebuild arms these.
 */
const TICK_BUDGET = 240;

/**
 * Run `apply` once the element has a node, now or on a later tick.
 *
 * Returns a canceller. The budget is what keeps this honest: a piece whose
 * library never resolves would otherwise leave a timer running for the life of
 * the scene, and the editor rebuilds hundreds of times a session.
 *
 * The guard around `apply` stays even though this no longer runs inside a
 * render observer: the callback is consumer code reaching into Babylon, and
 * swallowing its throw is what keeps one bad piece from stopping the rest.
 */
function whenMeshed(
  element: SceneElement,
  apply: (node: TransformableNode) => void,
  tickBudget = TICK_BUDGET
): () => void {
  const host = element as unknown as { mesh?: TransformableNode | null };
  if (host.mesh) {
    apply(host.mesh);
    return () => {};
  }
  /*
    A TIMER, NOT A RENDER OBSERVER.

    This waited on `scene.onBeforeRenderObservable` with a budget counted in
    FRAMES. A backgrounded tab stops rAF entirely, so the observer never fires
    and the budget never advances: come back to the tab and the pieces that had
    not yet been meshed have no rotation and no scale, forever. Reported as
    "daytime with partial content, and I ONLY ever see this when bringing the
    editor back from background".

    `setTimeout` is throttled in a hidden tab but it still RUNS, so this
    converges whether or not anyone is watching — which is the property a
    setup step needs and a per-frame effect does not.
  */
  let ticks = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  const stop = () => {
    if (timer !== null) clearInterval(timer);
    timer = null;
  };
  timer = setInterval(() => {
    try {
      if (host.mesh) {
        apply(host.mesh);
        stop();
        return;
      }
      if (++ticks > tickBudget) stop();
    } catch {
      stop();
    }
  }, TICK_MS);
  return stop;
}

/**
 * Dispose an instance that arrives AFTER its element was removed.
 *
 * `b3d-destroyable` instantiates inside `lib.ready.then(...)`, so there is a
 * window between "element appended" and "node exists". Remove the element
 * inside that window — which the editor does constantly, because it rebuilds on
 * every edit — and the disconnect finds nothing to dispose, then the pending
 * callback creates a node belonging to nobody. It is never disposed and never
 * moves again.
 *
 * Measured: four edits in quick succession left FOUR copies of the same tower
 * standing in the scene, 210 meshes where there had been 81, and it did not
 * settle. Reported as "movement seems to duplicate objects", which is exactly
 * what a ghost left at the old position looks like.
 *
 * Filed as tosijs-3d#49 — an element that has been disconnected should not
 * instantiate, or should dispose what it instantiated. Until then this watches
 * for the orphan and reaps it.
 */
function reapOrphan(element: SceneElement, tickBudget = TICK_BUDGET): void {
  const host = element as unknown as {
    mesh?: { dispose?: () => void; isDisposed?: () => boolean } | null;
  };
  const reap = () => {
    const node = host.mesh;
    if (!node || node.isDisposed?.()) return false;
    // Only ever an orphan: if the element came back, it owns this again.
    if (element.isConnected) return true;
    node.dispose?.();
    return true;
  };
  if (reap()) return;
  // Timer, not a render observer — see `whenMeshed`. An orphan that arrives
  // while the tab is hidden must still be reaped when it does arrive.
  let ticks = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  const stop = () => {
    if (timer !== null) clearInterval(timer);
    timer = null;
  };
  timer = setInterval(() => {
    try {
      if (reap() || ++ticks > tickBudget) stop();
    } catch {
      stop();
    }
  }, TICK_MS);
}

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
