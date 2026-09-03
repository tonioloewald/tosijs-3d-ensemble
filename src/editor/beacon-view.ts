/*#
# Beacons — a collision cube for anything abstract that has a position

A lamp is a LIGHT. It has a position, it can be moved, it appears in the piece
list — and there is nothing in the scene to click, because a Babylon light has
no geometry. Selecting the lantern meant finding it in the list every time, and
the report was blunt: "I can't move the lantern (or select it by clicking on
it)."

Two different faults produced that one sentence, and only one of them is here.
The other was that `lamp` never claimed its light as the piece's BODY, so the
editor wrote a new position into the file with nothing in the scene to write it
to — see `body` in `features-scene.ts`.

## Only where a feature says so

A beacon is not given to every bodiless piece. Most environment primitives have
no location for one to mark: a skybox is everywhere, `fog` and `ambient` are
settings, and `sun`'s `at` is a DIRECTION — a dot floating at `[-0.5, 1, 0.4]`
would be a confident lie about where the sun is. Three junk dots near the origin
is what the blanket rule produces.

So the feature declares it, next to its icon and its schema: `marker: true`
means "this puts a real thing at `at`, and it cannot be seen". A consumer's
feature gets a beacon the same way it gets an icon, which is the property that
makes the registry worth having.

A CUBE, not a sphere: it is a stand-in for a thing rather than a thing. Owner:
*"really we should provide a simple collision cube for any abstract thing that
has a position that we might need to select"* — and the generality is the
point. Lamps are the case that surfaced it; positional sound, a placed camera,
and later reference points and zones are the same shape of problem.

## Invisible, and that is not a contradiction

The first version drew an amber cube. It works, and it is clutter: a solid the
author cannot move, delete or edit, sitting in a view whose whole purpose is
judging an arrangement. A COLLISION cube is what was asked for, and collision
geometry is not seen.

⚠️ **This is only pickable because we pass our own predicate.** Babylon's
default picking test is `isEnabled() && isVisible && isPickable`, so an
invisible mesh is normally unpickable — but `pickPiece` supplies a predicate,
and Babylon consults the predicate INSTEAD of that test rather than as well as
it. An invisible collision proxy therefore works here and would silently stop
working for any caller that picks without a predicate. Verified by ray rather
than reasoned about, because "it should still be pickable" is exactly the kind
of claim this project has been wrong about before.

Finding it without seeing it is not the problem it sounds like: a lamp is
already visible as the light it casts, and it is a row in the piece list. What
it needed was somewhere for a ray to land.
*/
/*{"parent":"Internals","order":7}*/
import { MeshBuilder } from "@babylonjs/core";
import type { Vec3 } from "../format/types";

/** Where a beacon sits, and which piece it stands for. */
export interface Beacon {
  id: string;
  at: Vec3;
}

/**
 * Big enough to hit on a phone, small enough not to read as scenery.
 *
 * It does NOT scale with the piece: a beacon marks a point, and a point has no
 * size. Scaling it with the camera was tempting and wrong for the same reason
 * the handles do it and the selection box does not — a handle is a control, a
 * marker is a fact about the world.
 */
const SIZE = 0.45;

export interface BeaconView {
  /** Create, move and retire beacons to match. One call does all three. */
  sync(beacons: Beacon[]): void;
  /** Mesh → piece id, for the pick index. */
  index(): Map<unknown, string>;
  /** Are these meshes still in a live scene? See `SelectionView.alive`. */
  alive(): boolean;
  dispose(): void;
}

interface Dot {
  position: { x: number; y: number; z: number };
  isPickable: boolean;
  isVisible: boolean;
  isDisposed: () => boolean;
  dispose: () => void;
  computeWorldMatrix: (force: boolean) => void;
}

export function createBeaconView(scene: unknown): BeaconView {
  const s = scene as never;
  const dots = new Map<string, Dot>();

  /*
    No material at all — not a transparent one. An invisible mesh is never
    submitted for rendering, so a material would be a StandardMaterial created
    and disposed for nothing. It would also show up in the material count that
    `build → dispose → build` asserts on, which is a test worth not muddying.
  */

  return {
    sync(beacons) {
      const wanted = new Set(beacons.map((b) => b.id));
      for (const [id, dot] of dots) {
        if (!wanted.has(id)) {
          dot.dispose();
          dots.delete(id);
        }
      }
      for (const { id, at } of beacons) {
        let dot = dots.get(id);
        if (!dot) {
          dot = MeshBuilder.CreateBox(
            `ensemble-beacon-${id}`,
            { size: SIZE },
            s
          ) as unknown as Dot;
          dot.isPickable = true;
          dot.isVisible = false;
          dots.set(id, dot);
        }
        dot.position.x = at[0];
        dot.position.y = at[1];
        dot.position.z = at[2];
        /*
          A mesh positioned but never RENDERED has no world matrix, so a ray
          cast in the same frame finds it at the ORIGIN and answers confidently
          and wrongly. Clicking immediately after a rebuild is exactly that
          case.
        */
        dot.computeWorldMatrix(true);
      }
    },
    index() {
      const map = new Map<unknown, string>();
      for (const [id, dot] of dots) map.set(dot, id);
      return map;
    },
    alive() {
      return [...dots.values()].every((dot) => !dot.isDisposed());
    },
    dispose() {
      for (const dot of dots.values()) dot.dispose();
      dots.clear();
    },
  };
}
