/*#
# Scene floorplan — visual regression without pixels

A **structural snapshot of what a scene actually draws**: one record per mesh
the camera can see, at its true world position and size. Comparing two of these
answers "did the picture change, and where" without ever rasterising anything.

```js
import { sceneFloorplan, floorplanDiff } from 'tosijs-3d-ensemble'

const before = sceneFloorplan(scene)
// …rebuild, edit, load a different file…
const moved = floorplanDiff(before, sceneFloorplan(scene))
if (moved.length) console.warn(moved)
```

## Why not a screenshot

Because a screenshot compares the wrong thing. Antialiasing, font hinting, GPU
driver and a shader that compiled differently all move pixels without moving
anything an author cares about, so an image diff reports 3.2% of pixels changed
and leaves you to work out whether that is a regression or a Tuesday. The
signal is real but it arrives wrapped in noise you cannot turn off.

A structural diff has the opposite properties. **A rectangle in the same place,
or very nearly, versus absent — that is non-flaky signal.** Tolerance is a
number you set rather than a rendering artefact you fight, and a failure names
the thing:

    ground: moved (0, 0, 0) → (0, -12, 0)
    watchtower: GONE

rather than a percentage and a heat map.

This is Tonio's observation about `tosijs-floorplan` applied to a renderer:
floorplan turns a DOM page into `{caption, bounds}` records and compares
those instead of images, and a scene graph already IS that data — Babylon keeps
an authoritative draw list because it has to. The two are the same idea over
different substrates, which is the argument in tosijs-ui#142.

## What it deliberately does NOT capture

Colour, material, lighting, shadow. This says a thing is *there, at that size,
in that place* — the layout claim, not the appearance one. Appearance still
wants a human, or a vision model looking at a picture; the point is that
LAYOUT no longer has to borrow the picture's flakiness to get checked.

`activeOnly` (the default) reads the post-frustum-culling draw list, so an
object behind the camera is legitimately absent. That is usually what you want
— "what does this look like" — but it makes the snapshot camera-dependent, so
compare snapshots taken from the same viewpoint or pass `activeOnly: false`.
*/
/*{"parent":"Runtime","order":6}*/

/** One drawn thing, at its true world geometry. */
export interface FloorplanRecord {
  /** The mesh's public name — what the library and the format both call it. */
  name: string;
  /** World-space centre. */
  at: [number, number, number];
  /** World-space HALF extents, which is what Babylon reports. */
  size: [number, number, number];
}

/** A named difference between two snapshots. */
export interface FloorplanChange {
  name: string;
  kind: "added" | "removed" | "moved" | "resized";
  /** Present for `moved`/`resized` — the values that differ. */
  before?: [number, number, number];
  after?: [number, number, number];
}

interface SceneLike {
  meshes: unknown[];
  getActiveMeshes?: () => { data?: unknown[]; length?: number } | unknown[];
}

const round = (n: number, dp: number) => {
  const f = 10 ** dp;
  // `+ 0` normalises -0, which otherwise makes an unchanged snapshot differ
  // from itself in a string comparison.
  return Math.round(n * f) / f + 0;
};

/**
 * Snapshot what the scene draws.
 *
 * `tolerance` is decimal places, not a distance: it is applied when the record
 * is MADE so two snapshots are comparable as data, rather than at comparison
 * time where every consumer would have to remember to pass the same number.
 */
export function sceneFloorplan(
  scene: unknown,
  opts: { activeOnly?: boolean; tolerance?: number; ignore?: RegExp } = {}
): FloorplanRecord[] {
  const { activeOnly = true, tolerance = 2, ignore } = opts;
  const s = scene as SceneLike | null;
  if (!s?.meshes) return [];

  let list: unknown[] = s.meshes;
  if (activeOnly && typeof s.getActiveMeshes === "function") {
    const active = s.getActiveMeshes();
    // Babylon returns a SmartArray (`.data` + `.length`), not an Array.
    const smart = active as { data?: unknown[]; length?: number };
    list = Array.isArray(active)
      ? active
      : (smart.data ?? []).slice(0, smart.length ?? 0);
  }

  const out: FloorplanRecord[] = [];
  for (const item of list) {
    const mesh = item as {
      name?: string;
      isEnabled?: () => boolean;
      getBoundingInfo?: () => {
        boundingBox: {
          centerWorld: { x: number; y: number; z: number };
          extendSizeWorld: { x: number; y: number; z: number };
        };
      };
    };
    const name = mesh?.name;
    if (!name || (ignore && ignore.test(name))) continue;
    if (typeof mesh.isEnabled === "function" && !mesh.isEnabled()) continue;
    const info = mesh.getBoundingInfo?.();
    if (!info) continue;
    const { centerWorld: c, extendSizeWorld: e } = info.boundingBox;
    out.push({
      name,
      at: [round(c.x, tolerance), round(c.y, tolerance), round(c.z, tolerance)],
      size: [
        round(e.x, tolerance),
        round(e.y, tolerance),
        round(e.z, tolerance),
      ],
    });
  }
  // Sorted, so a snapshot is stable against draw ORDER — which changes for
  // reasons that are not visual (material batching, insertion sequence) and
  // would otherwise report a difference nobody can see.
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * What changed between two snapshots, named.
 *
 * `epsilon` is a WORLD DISTANCE — the "or very nearly" that makes this
 * non-flaky. A rebuild that lands a piece 0.0001m from where it was has not
 * changed the picture, and a test that says otherwise is a test people stop
 * believing.
 */
export function floorplanDiff(
  before: FloorplanRecord[],
  after: FloorplanRecord[],
  epsilon = 0.01
): FloorplanChange[] {
  const changes: FloorplanChange[] = [];
  const byName = (list: FloorplanRecord[]) => {
    const map = new Map<string, FloorplanRecord[]>();
    for (const r of list)
      (map.get(r.name) ?? map.set(r.name, []).get(r.name)!).push(r);
    return map;
  };
  const a = byName(before);
  const b = byName(after);

  const far = (p: [number, number, number], q: [number, number, number]) =>
    Math.abs(p[0] - q[0]) > epsilon ||
    Math.abs(p[1] - q[1]) > epsilon ||
    Math.abs(p[2] - q[2]) > epsilon;

  for (const [name, olds] of a) {
    const news = b.get(name) ?? [];
    /*
      COUNT FIRST. A library mesh can legitimately appear many times, and
      "there are three fewer barrels" is the interesting sentence — matching
      them up individually would invent a pairing the scene never had.
    */
    if (news.length !== olds.length) {
      changes.push({
        name,
        kind: news.length > olds.length ? "added" : "removed",
      });
      continue;
    }
    for (let i = 0; i < olds.length; i++) {
      const o = olds[i]!;
      const n = news[i]!;
      if (far(o.at, n.at)) {
        changes.push({ name, kind: "moved", before: o.at, after: n.at });
      } else if (far(o.size, n.size)) {
        changes.push({ name, kind: "resized", before: o.size, after: n.size });
      }
    }
  }
  for (const [name] of b) {
    if (!a.has(name)) changes.push({ name, kind: "added" });
  }
  return changes;
}
