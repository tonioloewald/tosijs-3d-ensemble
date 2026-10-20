/*#
# Nested ensembles

A piece can be a whole ensemble: `"ensemble": "/assemblies/ocean-rig.json"`
in place of `mesh`. A level made of rigs, a fortress made of towers, a plaza
with lamp posts that are themselves arrangements.

```json
{ "id": "rig-a", "ensemble": "/assemblies/ocean-rig.json", "at": [120, 0, -40], "rot": [0, 30, 0] }
```

## Flattened when it loads

A nested ensemble is spliced into its parent when the parent is built: the
child's pieces become the parent's, with ids that are PATHS (`rig-a/pump`),
placed by the nesting piece's `at`, `rot` and `scale`. Every load re-reads
the child, so fixing the rig fixes every level that uses it. What this does
not give you yet is a per-instance override ("this level's rig, with the
pump moved"); that is a later step.

What happens to the child, in order:

- **Ids** become `<nesting id>/<child id>`, and so does everything in the
  child that names a piece: its links (`from`, `to`), and any feature field
  that holds a piece id (marked `x-piece-ref` in its schema, such as a
  planet's `terrain`). A child's link from `reactor` to `projector` becomes
  `rig-a/reactor` → `rig-a/projector`, and can never resolve against a
  same-named piece in the parent.
- **Transforms** compose: the child's whole arrangement (its own `scale`
  included) is placed under the nesting piece, so a child piece's world
  position is `at + rot · (scale ⊙ child position)`, its rotation the two
  rotations composed, and its scale the two multiplied. A parent stretched
  unevenly holding a child piece that is turned would need a shear, which
  no piece can hold; the scale along the child's own axes is kept and a
  `nested-shear` warning says so.
- **Its own points and zones** move into the parent, placed the same way,
  with path ids. **Its libraries** join the parent's; one whose name the
  parent already uses for a different file is renamed `<nesting id>/<name>`
  for the child's pieces.
- **Ignored:** the child's `preview` (scenery for its author), its
  `placement` (the parent places it), its `recommends` (the outer scene's).
- A nesting piece that is **disabled** contributes nothing.

## In the editor

From outside, a nested ensemble is one piece (SPEC: "a black box inside a
scene"): a click anywhere inside it selects it, and it moves, turns and
scales as a whole. **Open inside** (in its Properties) makes the child the
document, with its own history and its own file; **Back** returns to the
parent, rebuilt with the child as you left it.

## What it refuses

A chain that comes back to itself (A nests B nests A) is reported as
`nested-cycle`, naming the loop, and not followed. Deeper than
`MAX_NESTING_DEPTH` (8) is `nested-too-deep`. A child that could not be
loaded is `nested-missing`, and its piece contributes nothing.

## Names and urls

`ensemble` is a url (`/assemblies/ocean-rig.json`, `./tower.json`), relative
to the document that names it, or a bare name (`ocean-rig`), which means
`ocean-rig.json` beside that document. A nested url is FETCHED, so it meets
the same https rule as a library.
*/
/*{"parent":"Format","order":9}*/
import { featureRegistration } from "./registry.js";
import type {
  Ensemble,
  Euler,
  LibraryRef,
  Piece,
  Point,
  Vec3,
  Zone,
} from "./types.js";
import { narrowScale, scaleVector } from "./scale.js";
import { urlProblem } from "./url-policy.js";
import type { Problem } from "./validate.js";

/** How deep ensembles may nest before the loader stops following them. */
export const MAX_NESTING_DEPTH = 8;

/**
 * Where a nested ensemble lives, as a key the children map uses: `ref`
 * resolved against the url of the document that names it (`base`), and a
 * bare name read as `<name>.json`. Without a base a relative ref stays
 * relative (the page resolves it when it fetches).
 */
export function nestedUrl(ref: string, base?: string): string {
  const path = /[/.]/.test(ref) ? ref : `${ref}.json`;
  if (!base) return path;
  try {
    return new URL(path, base).href;
  } catch {
    // A RELATIVE base (`kits/rig.json`, `/assemblies/rig.json`): resolve it
    // the way the page will, and keep the answer relative, so the loader
    // and the flattener always agree on the key.
    const root = "https://relative.invalid/__/";
    try {
      const url = new URL(path, new URL(base, root));
      if (url.href.startsWith(root)) return url.href.slice(root.length);
      if (url.origin === "https://relative.invalid")
        return url.pathname + url.search;
      return url.href;
    } catch {
      return path;
    }
  }
}

/** The nested refs one document names (enabled pieces only). */
export function nestedRefs(ensemble: Ensemble): string[] {
  return ensemble.pieces
    .filter((p) => p.ensemble && p.enabled !== false)
    .map((p) => p.ensemble as string);
}

export interface FlattenOptions {
  /** The url of the root document, for resolving its relative refs. */
  base?: string;
}

export interface Flattened {
  ensemble: Ensemble;
  problems: Problem[];
}

/* ---- rotation, as tosijs-3d applies it: R = Ry(ry) · Rx(rx) · Rz(rz) ---- */

type M3 = [Vec3, Vec3, Vec3];
const RAD = Math.PI / 180;

/** The rotation matrix for an euler in DEGREES, tosijs-3d's yaw-pitch-roll. */
export function eulerMatrix(rot: Euler | undefined): M3 {
  const [x, y, z] = (rot ?? [0, 0, 0]).map((d) => (d ?? 0) * RAD) as Vec3;
  const cx = Math.cos(x),
    sx = Math.sin(x),
    cy = Math.cos(y),
    sy = Math.sin(y),
    cz = Math.cos(z),
    sz = Math.sin(z);
  return [
    [cy * cz + sy * sx * sz, -cy * sz + sy * sx * cz, sy * cx],
    [cx * sz, cx * cz, -sx],
    [-sy * cz + cy * sx * sz, sy * sz + cy * sx * cz, cy * cx],
  ];
}

/** The euler (DEGREES) of a rotation matrix, the inverse of `eulerMatrix`. */
export function matrixEuler(m: M3): Euler {
  const sx = Math.max(-1, Math.min(1, -m[1][2]));
  const x = Math.asin(sx);
  let y: number, z: number;
  if (Math.abs(sx) < 0.999999) {
    y = Math.atan2(m[0][2], m[2][2]);
    z = Math.atan2(m[1][0], m[1][1]);
  } else {
    // Gimbal lock: yaw and roll share an axis; put it all in yaw.
    y = Math.atan2(-m[2][0], m[0][0]);
    z = 0;
  }
  return [x / RAD, y / RAD, z / RAD].map(tidy) as Euler;
}

const mul = (a: M3, b: M3): M3 =>
  [0, 1, 2].map((i) =>
    [0, 1, 2].map(
      (j) =>
        a[i]![0]! * b[0]![j]! + a[i]![1]! * b[1]![j]! + a[i]![2]! * b[2]![j]!
    )
  ) as M3;
const apply = (m: M3, v: Vec3): Vec3 =>
  [0, 1, 2].map(
    (i) => m[i]![0]! * v[0] + m[i]![1]! * v[1] + m[i]![2]! * v[2]
  ) as Vec3;
/** Round away float dust (1e-15 → 0, 29.999999999 → 30) for a readable doc. */
const tidy = (n: number): number => {
  const r = Math.round(n * 1e9) / 1e9;
  return Object.is(r, -0) ? 0 : r;
};
const isIdentity = (m: M3, eps = 1e-9): boolean =>
  m.every((row, i) =>
    row.every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < eps)
  );

/** A placement: where a child arrangement's origin goes, and how. */
interface Frame {
  at: Vec3;
  rot: M3;
  /** Per-axis, in the frame's OWN axes (before its rotation). */
  scale: Vec3;
}

const IDENTITY: Frame = {
  at: [0, 0, 0],
  rot: eulerMatrix(undefined),
  scale: [1, 1, 1],
};

/** A point in the child's space, placed by the frame. */
const place = (f: Frame, v: Vec3): Vec3 =>
  apply(f.rot, [v[0] * f.scale[0], v[1] * f.scale[1], v[2] * f.scale[2]]).map(
    (c, i) => tidy(c + f.at[i]!)
  ) as Vec3;

/**
 * A child piece's rotation and scale, placed by the frame. Exact when the
 * frame's scale is uniform or the child is unrotated; otherwise the scale
 * along the child's own axes, and `shear` is true.
 */
function compose(
  f: Frame,
  rot: Euler | undefined,
  scale: number | Vec3 | undefined
): { rot: Euler; scale: Vec3; shear: boolean } {
  const r = eulerMatrix(rot);
  const s = scaleVector(scale);
  const uniform =
    Math.abs(f.scale[0] - f.scale[1]) < 1e-9 &&
    Math.abs(f.scale[1] - f.scale[2]) < 1e-9;
  let along: Vec3;
  if (uniform) along = [f.scale[0], f.scale[0], f.scale[0]];
  else {
    // The frame's stretch, measured along each of the child's axes.
    along = [0, 1, 2].map((i) => {
      const axis: Vec3 = [r[0]![i]!, r[1]![i]!, r[2]![i]!];
      return Math.hypot(
        axis[0] * f.scale[0],
        axis[1] * f.scale[1],
        axis[2] * f.scale[2]
      );
    }) as Vec3;
  }
  return {
    rot: matrixEuler(mul(f.rot, r)),
    scale: s.map((c, i) => tidy(c * along[i]!)) as Vec3,
    shear: !uniform && !isAxisAligned(r),
  };
}

/** True when every column of the rotation is a coordinate axis. */
const isAxisAligned = (m: M3, eps = 1e-9): boolean =>
  [0, 1, 2].every(
    (j) =>
      [0, 1, 2].filter((i) => Math.abs(Math.abs(m[i]![j]!) - 1) < eps)
        .length === 1
  );

/* ---- the splice ---- */

/** Feature fields that hold a piece id, by feature: from `x-piece-ref`. */
function pieceRefKeys(feature: string): string[] {
  const props = (
    featureRegistration(feature)?.schema as {
      properties?: Record<string, { "x-piece-ref"?: boolean }>;
    }
  )?.properties;
  return Object.entries(props ?? {})
    .filter(([, spec]) => spec?.["x-piece-ref"])
    .map(([key]) => key);
}

/**
 * Splice every nested ensemble into its parent, recursively. `children` maps
 * `nestedUrl(ref, base)` to the loaded child; a ref it does not hold is
 * reported, not fetched (see `collectNested` for loading them).
 */
export function flattenEnsemble(
  root: Ensemble,
  children: ReadonlyMap<string, Ensemble>,
  options: FlattenOptions = {}
): Flattened {
  const problems: Problem[] = [];
  if (!root.pieces.some((p) => p.ensemble)) return { ensemble: root, problems };

  const libraries: LibraryRef[] = [...(root.libraries ?? [])];
  const links = [...(root.links ?? [])];
  const points: Point[] = [...(root.points ?? [])];
  const zones: Zone[] = [...(root.zones ?? [])];

  /** A child's library name in the flat document (renamed on a clash). */
  const adoptLibrary = (lib: LibraryRef, prefix: string): string => {
    const same = libraries.find((l) => l.name === lib.name);
    if (!same) {
      libraries.push(lib);
      return lib.name;
    }
    if (same.url === lib.url) return lib.name;
    const renamed = `${prefix}/${lib.name}`;
    if (!libraries.some((l) => l.name === renamed))
      libraries.push({ ...lib, name: renamed });
    return renamed;
  };

  const splice = (
    doc: Ensemble,
    frame: Frame,
    prefix: string,
    base: string | undefined,
    chain: string[],
    path: string
  ): Piece[] => {
    const out: Piece[] = [];
    const docScale = doc.scale ?? 1;
    const inner: Frame =
      prefix === ""
        ? IDENTITY
        : {
            ...frame,
            scale: frame.scale.map((c) => c * docScale) as Vec3,
          };
    const id = (local: string) => (prefix ? `${prefix}/${local}` : local);

    // Library names as the flat document knows them.
    const libraryName = new Map<string, string>();
    if (prefix)
      for (const lib of doc.libraries ?? [])
        libraryName.set(lib.name, adoptLibrary(lib, prefix));

    doc.pieces.forEach((piece, index) => {
      const at = `${path}/pieces/${index}`;
      if (piece.ensemble) {
        if (piece.enabled === false) return;
        const key = nestedUrl(piece.ensemble, base);
        if (chain.includes(key)) {
          problems.push({
            severity: "error",
            code: "nested-cycle",
            message: `"${id(piece.id)}" nests ${
              piece.ensemble
            }, which contains itself: ${[...chain, key].join(" → ")}`,
            path: `${at}/ensemble`,
          });
          return;
        }
        if (chain.length >= MAX_NESTING_DEPTH) {
          problems.push({
            severity: "error",
            code: "nested-too-deep",
            message: `"${id(piece.id)}" is nested ${
              chain.length + 1
            } deep; the limit is ${MAX_NESTING_DEPTH}`,
            path: `${at}/ensemble`,
          });
          return;
        }
        const child = children.get(key);
        const refused = urlProblem(key, "nested");
        if (refused) {
          problems.push({
            severity: "error",
            code: refused.code,
            message: `"${id(piece.id)}": ${refused.message}`,
            path: `${at}/ensemble`,
          });
          return;
        }
        if (!child) {
          problems.push({
            severity: "warning",
            code: "nested-missing",
            message: `"${id(piece.id)}" nests ${
              piece.ensemble
            }, which is not loaded; it contributes nothing`,
            path: `${at}/ensemble`,
          });
          return;
        }
        if (piece.features && Object.keys(piece.features).length)
          problems.push({
            severity: "warning",
            code: "nested-features-ignored",
            message: `"${id(
              piece.id
            )}" nests an ensemble; features on the nesting piece itself are ignored`,
            path: `${at}/features`,
          });
        // The child's frame: this piece's placement, under the current one.
        const local = compose(inner, piece.rot, piece.scale);
        const childFrame: Frame = {
          at: prefix ? place(inner, piece.at) : (piece.at.map(tidy) as Vec3),
          rot: eulerMatrix(local.rot),
          scale: local.scale,
        };
        if (local.shear)
          problems.push({
            severity: "warning",
            code: "nested-shear",
            message: `"${id(
              piece.id
            )}" is turned inside a parent stretched unevenly; a piece cannot hold the shear, so its stretch is kept along its own axes`,
            path: `${at}/scale`,
          });
        out.push(
          ...splice(
            child,
            childFrame,
            id(piece.id),
            key,
            [...chain, key],
            `${at}/ensemble`
          )
        );
        return;
      }
      if (!prefix) {
        out.push(piece);
        return;
      }
      // A child piece: renamed, placed, and its references rewritten.
      const placed = compose(inner, piece.rot, piece.scale);
      if (placed.shear)
        problems.push({
          severity: "warning",
          code: "nested-shear",
          message: `"${id(
            piece.id
          )}" is turned inside a parent stretched unevenly; a piece cannot hold the shear, so its stretch is kept along its own axes`,
          path: `${at}/scale`,
        });
      const features = piece.features
        ? Object.fromEntries(
            Object.entries(piece.features).map(([name, cfg]) => {
              if (!cfg || typeof cfg !== "object") return [name, cfg];
              const refs = pieceRefKeys(name);
              if (!refs.length) return [name, cfg];
              const copy = { ...(cfg as Record<string, unknown>) };
              for (const key of refs)
                if (typeof copy[key] === "string" && copy[key])
                  copy[key] = id(copy[key] as string);
              return [name, copy];
            })
          )
        : undefined;
      const renamedLibrary =
        piece.library !== undefined
          ? libraryName.get(piece.library) ?? piece.library
          : undefined;
      const scale = narrowScale(placed.scale);
      const nonTrivialRot = placed.rot.some((v) => v !== 0);
      out.push({
        ...piece,
        id: id(piece.id),
        at: place(inner, piece.at),
        ...(nonTrivialRot ? { rot: placed.rot } : { rot: undefined }),
        ...(scale === 1 ? { scale: undefined } : { scale }),
        ...(renamedLibrary !== undefined ? { library: renamedLibrary } : {}),
        ...(features ? { features } : {}),
      });
    });

    if (prefix) {
      for (const link of doc.links ?? [])
        links.push({ ...link, from: id(link.from), to: id(link.to) });
      for (const point of doc.points ?? []) {
        const facing = point.facing
          ? compose(inner, point.facing, 1).rot
          : undefined;
        points.push({
          ...point,
          id: id(point.id),
          at: place(inner, point.at),
          ...(facing ? { facing } : {}),
        });
      }
      for (const zone of doc.zones ?? [])
        zones.push({
          ...zone,
          id: id(zone.id),
          at: place(inner, zone.at),
          radius: tidy(zone.radius * Math.max(...inner.scale)),
        });
    }
    return out;
  };

  const pieces = splice(
    root,
    IDENTITY,
    "",
    options.base,
    options.base ? [options.base] : [],
    ""
  ).map((p) => {
    // Drop the undefined keys the splice left, so the document stays clean.
    const clean = { ...p } as Record<string, unknown>;
    for (const k of Object.keys(clean))
      if (clean[k] === undefined) delete clean[k];
    return clean as unknown as Piece;
  });

  const ensemble: Ensemble = {
    ...root,
    pieces,
    ...(libraries.length ? { libraries } : {}),
    ...(links.length ? { links } : {}),
    ...(points.length ? { points } : {}),
    ...(zones.length ? { zones } : {}),
  };
  return { ensemble, problems };
}
