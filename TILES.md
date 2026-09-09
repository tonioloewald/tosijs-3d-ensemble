# Tile maps — a plan

<!--{"pin":"bottom","parent":"Project","order":4}-->

**Click out levels on a grid.** Fill in a bitmap, get a road network, a dungeon,
a town. This is the plan; nothing here is built yet.

Everything below is measured against the real kits rather than recalled — the
numbers come from parsing the `.glb` files directly, and the survey script is
in this document's appendix.

## What the kits actually are

Twenty-six kits are on the CDN. Six are tile-shaped and were measured:

| kit                 | items | module (x·z) | vertical module      | what a cell IS     |
| ------------------- | ----- | ------------ | -------------------- | ------------------ |
| `city-kit-roads`    | 60    | **1 × 1**    | 0.02 (flat)          | a road surface     |
| `tower-defense-kit` | 160   | **1 × 1**    | 0.2 slab             | a raised path tile |
| `mini-dungeon`      | 25    | **1 × 1**    | wall 1.1             | solid **or** open  |
| `castle-kit`        | —     | **1 × 1**    | wall 1.31            | solid or open      |
| `modular-buildings` | 108   | **1 × 1**    | **0.625 per storey** | a wall FACE        |
| `hexagon-kit`       | 72    | hex          | —                    | a hex cell         |

Four facts fall out of that, and they are what make this tractable:

1. **Every kit uses a 1 × 1 module, centred in X/Z, sitting on `y = 0`.**
   Measured on all six. So placement is arithmetic — `at = [col, level ×
levelHeight, row]` — with no per-kit offset table.
2. **A kit ships a manifest already.** `scenes[0].extras.library` carries
   `{count, categories, items:[{name, category, tags, size}]}`. Footprints come
   for free; we never have to measure a mesh to know it is 2 × 2.
3. **Roles repeat across themes.** `tower-defense-kit` ships the _same 38 roles
   twice_ — `tile-*` and `snow-tile-*`. `hexagon-kit` does it again with
   `path-*` and `river-*`. A theme swap is a mesh-name substitution over one
   vocabulary, which is worth designing for rather than discovering later.
4. **Topology is NOT recoverable from names.** `city-kit-roads` says
   `road-intersection`; `hexagon-kit` says `path-intersectionA` … `path-
intersectionH`. Kenney enumerates hex topology with LETTERS. Nothing in the
   file says which edges are open.

(4) is the whole reason this needs an authored layer. Which is what Tonio
predicted: _"this might involve adding metadata to a kit."_

## Three tiling models, not one

The kits disagree about what a cell means, and a design that assumes one of
these silently breaks the other two:

- **`floor`** — a cell holds a tile; its role is **which edges are open**.
  `city-kit-roads`, `tower-defense-kit`, `hexagon-kit`'s paths.
- **`solid`** — a cell is filled or empty; a wall's LOOK depends on its
  neighbours. `mini-dungeon`, `castle-kit`. This is a roguelike bitmap, and it
  is the same compiler as `floor` with the mask inverted.
- **`edge`** — a piece sits on the boundary BETWEEN cells.
  `modular-buildings` is a façade kit: `building-block`, `building-corner`,
  `building-window`, `building-door` are wall faces stacked 0.625 per storey.

**A door is always an edge**, in all three. `building-door`, `wall-opening`,
`wall-doorway`, `metal-gate`, `door-brown` — a door is a property of the
boundary between two cells, never of a cell. That is the invariant to build on.

## The core idea: edge codes, and rotation as data

A role is the set of open edges, as a bitmask — N E S W, MSB = north:

```
1010 = N + S   → straight
1100 = N + E   → corner
1110 = N + E + S → tee
1111           → crossroads
1000           → dead end
```

A tileset declares one mesh per **canonical** code and the compiler derives the
other three by rotation, exactly as Tonio described: `1100` turned 90° clockwise
is `0110`. The kits are built for this — there is one `road-curve`, not four.

Canonical form = the rotation of a code with the lowest numeric value, plus the
number of 90° turns to get back. So sixteen codes reduce to **six** authored
entries: `0000`, `1000`, `1010`, `1100`, `1110`, `1111`.

Hex is the same idea at 6 bits — 64 codes reducing to 14 — which is why
`hexagon-kit` needed letters A–H. The lattice should be declared
(`square` | `hex`) even if only square ships first, because it changes the
code width and nothing else.

## What a tileset looks like

A separate, reusable JSON artifact — **not** part of an ensemble, because one
tileset serves many maps and outlives all of them:

```jsonc
{
  "name": "city-roads",
  "library": "roads",
  "model": "floor",
  "lattice": "square",
  "cell": 1,
  "levelHeight": 0.625,
  "roles": {
    "1010": [{ "mesh": "road-straight" }],
    "1100": [
      { "mesh": "road-curve", "footprint": [2, 2] },
      { "mesh": "road-bend" }
    ],
    "1110": [{ "mesh": "road-intersection" }],
    "1111": [{ "mesh": "road-crossroad" }, { "mesh": "road-roundabout" }],
    "1000": [{ "mesh": "road-end" }, { "mesh": "road-end-round" }]
  },
  "themes": { "snow": { "prefix": "snow-" } }
}
```

- **Several meshes per code** is the variety mechanism — "multiple tiles for the
  same grid position so you can vary landscape". Chosen by a seeded hash of the
  cell coordinate, so a map renders identically every time. The format's
  reproducibility rule already demands that.
- **`footprint`** is read from the kit manifest where possible and only
  overridden here. `road-curve` really is 2 × 2 while `road-bend` is 1 × 1;
  without this the compiler places a double-size curve in one cell and nothing
  says so.
- **`themes`** is a name substitution, because that is empirically what a theme
  IS in these kits.

**Bootstrapping**: a script can generate a draft tileset from the manifest —
names, categories, footprints, sizes are all there — leaving a human to fill in
the edge codes. Thirty-eight tiles is an afternoon, once, per kit. Inferring
codes from geometry (does the path meet the edge midpoint?) is possible and
fragile; not proposed.

## What a map looks like

**The grid stays a grid.** A 100 × 100 map is 10 000 cells; enumerating them as
pieces would be a 10 000-entry file describing something a bitmap says in a
hundred lines. That is against the format's whole argument — _describe an
arrangement, don't enumerate it_ — and it makes the file unreadable and
undiffable.

So a tilemap is a **feature**, and its body is the grid:

```jsonc
{
  "id": "town",
  "at": [0, 0, 0],
  "features": {
    "tilemap": {
      "tileset": "/tilesets/city-roads.json",
      "levels": [{ "y": 0, "rows": ["..###..", "..#.#..", "..###.."] }],
      "seed": 7,
      "doors": [{ "at": [3, 0, 1], "edge": "n", "kind": "swing" }],
      "overrides": [{ "at": [2, 0, 2], "mesh": "road-roundabout" }]
    }
  }
}
```

This costs nothing structurally: features are already a registry, a piece with
no mesh is already legal, and `buildEnsemble` already gives a feature a body.
Hand-placed props stay ordinary pieces sitting on top of the grid.

`rows` as strings is deliberate — a map is legible and hand-editable in a diff,
which a nested array of integers is not. One character per cell, and the
character selects a **layer** within the tileset (`.` empty, `#` road, `~`
water) rather than a mesh.

## Levels, stairs, shafts

`levels[]` with an explicit `y`, and `levelHeight` from the tileset (measured:
0.625 for `modular-buildings`, 1.1 for `mini-dungeon`, 1.31 for `castle-kit`).

A vertical connector is a cell whose role says it links levels:

```jsonc
{ "at": [4, 0, 6], "connects": "up", "mesh": "stairs" }
```

The kits have the vocabulary: `stairs`, `stairs-stone`, `wall-narrow-stairs`,
`tile-slope`, `tile-straight-slope-large`. A **shaft** or **lift** is the same
thing with no geometry between levels — which is exactly why it needs to be
declared rather than inferred: an empty cell above an empty cell is a hole, and
only the author knows whether that is a lift or a mistake.

## Interiors, exteriors, and the meta-elements

The format already has what this needs, and it is the reason not to invent
anything:

- **`Point`** has `at`, `facing` (euler degrees) and a free-string `kind`,
  whose documented conventions already include `entrance`.
- **`Zone`** has `at`, `radius`, a free-string `kind` and an open payload.

So a door between an exterior map and an interior one is a pair of Points with
`kind: 'portal'`, each naming the other; a Zone with `kind: 'interior'` is what
a game reads to decide it should swap the maps or fade the exterior. **None of
that is tile machinery** — it is the existing arrangement vocabulary, which is
the argument that this belongs in the ensemble format at all rather than in a
game.

Whether a building is _modelled_ inside and out, or _teleported_ between, then
becomes a content decision rather than a format one. Both are the same two
Points.

## Accessories: where a thing may sit in a cell

A lamp, a table, a bookcase and a barrel do not want the same places. The
tileset declares **anchors**, and an accessory declares which it accepts:

```jsonc
"anchors": {
  "centre":  [0, 0, 0],
  "wall-n":  [0, 0, -0.5],
  "corner-ne": [0.5, 0, -0.5],
  "ceiling": [0, 1, 0]
},
"accessories": {
  "furniture:bookcase": { "anchors": ["wall-n", "wall-e", "wall-s", "wall-w"], "facesAway": true },
  "furniture:table":    { "anchors": ["centre"] },
  "furniture:lamp":     { "anchors": ["ceiling"] }
}
```

`facesAway` is the rotation rule — a bookcase's back goes to the wall — which
is a property of the OBJECT, not of the anchor, and is the sort of thing that
is obvious until you place a chair.

## Milestones

|       | what                                                                                  | done when                                                                 |
| ----- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **0** | Tileset schema + a generated draft for `city-kit-roads`, edge codes filled in by hand | the draft round-trips through `validate`                                  |
| **1** | `tilemap` feature: square lattice, `floor` model, 1 × 1 only, seeded variants         | a bitmap renders a road network in the browser, verified by a scene fence |
| **2** | `solid` model (mini-dungeon), multi-cell footprints, overrides                        | a dungeon bitmap renders walls that agree with their neighbours           |
| **3** | Levels, stairs, lifts; portal Points and interior Zones                               | two levels connected by a stair, and an interior you can enter            |
| **4** | Editor: paint cells, pick layers, drop accessories on anchors                         | clicking out a level is faster than writing the JSON                      |
| **5** | `edge` model (`modular-buildings` façades), doors as edge annotations                 | a building with windows and a door that is on the wall between two cells  |

Hex stays designed-for and unbuilt until something wants it.

## Open questions, for the discussion this is meant to start

1. **Grid or pieces?** Recommended: grid. It is the point of the feature, and
   a compiled grid is a file nobody can read. But it means the editor has to
   paint a grid rather than place pieces, which is milestone 4 and real work.
2. **Where does a tileset live** — this repo, alongside the kit on the CDN, or
   a consumer's own? Recommended: this repo ships the ones for the Kenney kits,
   because the format is the thing that gives them meaning; a consumer's kit is
   theirs.
3. **Is a tileset ours or tosijs-3d's?** It is about libraries, which is theirs;
   it is about arrangement, which is ours. Recommended: **ours** — a tileset
   says how meshes compose into a place, and that is an arrangement claim.
4. **The manifest gap is upstream's.** `scenes[0].extras.library` is the
   authoritative catalogue and Babylon drops scene extras, so `getManifest()`
   reconstructs a thinner version from node extras. We can parse the file
   ourselves, but a tileset generator would rather ask the library. Worth
   filing.
5. **How much variety is too much?** Seeded selection makes a map reproducible,
   but changing the seed reshuffles every cell. An author who likes one
   corner's boulder wants to pin it — hence `overrides`, which may want to be
   the primary mechanism rather than an escape hatch.
