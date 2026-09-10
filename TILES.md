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

## One code space, three loci — and the two families are duals

Tonio's observation, which reorganised this plan: a 16-value tileset always
splits into tiles that **bound an interior** and tiles that **define paths**,
and topologically the two are duals.

That is exactly right, and it is worth stating precisely because the precise
version tells you where to put the mesh.

A square lattice has three kinds of place:

| locus                        | where                   | what lives there   |
| ---------------------------- | ----------------------- | ------------------ |
| **face** (cell centre)       | `(x, z)`                | floors, path tiles |
| **edge** (between two cells) | `(x+½, z)` / `(x, z+½)` | façades, **doors** |
| **vertex** (four cells meet) | `(x+½, z+½)`            | region boundaries  |

- A **path** tile sits on a FACE, and its code is which of the four **edges**
  the path crosses.
- A **boundary** tile sits on a VERTEX, and its code is which of the four
  **faces** around it are inside.

Faces and vertices exchange under the dual, so those are the same 16 codes and
the same rotation algebra — **the boundary tileset is the path tileset offset
by half a cell in both axes.** One compiler, one code space, one rotation
table; the only difference is where the origin sits and what you sample.

And the third locus is the interesting one: an **edge is self-dual** — the edge
set maps to itself. Which is why "a door is always an edge" held across every
kit I measured. It is not a coincidence about doors; it is the only place that
means the same thing in both readings.

### The same six canonical codes, meaning different things

| code   | as a PATH (edges of a face) | as a BOUNDARY (faces round a vertex)      |
| ------ | --------------------------- | ----------------------------------------- |
| `0000` | nothing                     | outside                                   |
| `1000` | dead end                    | **outer** (convex) corner                 |
| `1100` | corner                      | straight run of wall                      |
| `1010` | straight through            | ⚠️ **saddle** — two diagonal cells inside |
| `1110` | tee                         | **inner** (concave) corner                |
| `1111` | crossroads                  | fully enclosed                            |

This is the reading that explains the kits. `tower-defense-kit` ships BOTH
families and the vocabulary says which is which: `tile-straight`,
`tile-crossing`, `tile-split`, `tile-end` are paths, while
**`tile-corner-inner` and `tile-corner-outer` are boundaries** — a convex/
concave distinction that cannot exist for a path, because a path corner has
only one form. `tile-wide-straight` / `tile-wide-corner` are the same route
read as a boundary PAIR rather than a centre line.

⚠️ **`1010` is the one that bites.** As a path it is an unremarkable straight.
As a boundary it is the classic marching-squares ambiguity: two diagonally
opposite cells inside, and you may join them or separate them. Both are
defensible, they look completely different, and an implementation that does not
choose deliberately produces a map that is subtly wrong in a way nobody can
name. The tileset declares which: `"saddle": "join" | "separate"`.

### What this replaces

The earlier draft called these "three tiling models" — `floor`, `solid`, `edge`
— and treated them as three compilers. They are one compiler with a declared
locus:

```jsonc
"locus": "face"    // path tiles, floors        (city-kit-roads, TD paths)
"locus": "vertex"  // region boundaries         (TD's corner-inner/outer)
"locus": "edge"    // façades and doors         (modular-buildings)
```

`mini-dungeon` and `castle-kit` turn out not to be autotile sets at all —
`wall`, `wall-half`, `wall-narrow`, `wall-opening`, `wall-corner` and no
inner/outer pair. They are cell-filling blocks, which is `locus: "face"` with a
solid/empty layer rather than a boundary set. Worth knowing before building a
marching-squares compiler for a kit that cannot use one.

## In 3D: volumes and manifolds, and the duality stops being exact

Extend to six bits — the faces of a cube — and Tonio's two families become
**volumes** and **manifolds**. Degenerate cases are what name them: an isolated
solid cell is a **pillar** or a floating blob; a highly connected path network
is a **mesh** in the scaffolding sense, a lattice of tubes.

The numbers, computed rather than recalled (`scratchpad/canon.mjs`, Burnside by
brute force over the rotation group):

|                                        | codes | canonical, up to rotation |
| -------------------------------------- | ----- | ------------------------- |
| 2D paths — 4 edges of a face           | 16    | **6**                     |
| 2D boundaries — 4 faces round a vertex | 16    | **6**                     |
| 3D paths — 6 faces of a cell           | 64    | **10**                    |
| 3D surfaces — 8 corners of a cell      | 256   | **23**                    |

⚠️ **The duality is exact in 2D and NOT in 3D.** The square lattice is
self-dual: a face has four edges, a vertex has four faces, so both families are
16 codes and both reduce to the same six. The cubic lattice is not — its dual
is the octahedral one. A cell has **six** faces but a vertex is surrounded by
**eight** cells, so paths and surfaces diverge: 64 against 256, ten canonical
classes against twenty-three.

That asymmetry is the whole practical story:

- **Ten path classes is an afternoon.** Degrees `0,1,2,2,3,3,4,4,5,6` — a
  blob, a stub, a straight, an elbow, a tee, a tripod, and so on up to the
  six-way junction. A kit can plausibly ship all ten, and a tileset can name
  them.
- **Twenty-three surface classes is a modelling job**, and it is why marching
  cubes is a library that generates geometry rather than a tileset that indexes
  it. If we ever want smooth volumes, the honest route is to generate the mesh,
  not to author twenty-three tiles per theme — and that is a different feature
  from this one.

(The familiar "15 cases" figure for marching cubes quotients by reflection and
complement as well as rotation. Up to rotation alone it is 23, which is the
number that matters if you are indexing authored meshes, because a mirrored
tile is a different model.)

### Stairs, shafts and lifts stop being special

**Seven of the ten path classes touch ±Y.** Vertical connectivity is just two
more bits, so a stair is a 3D elbow (one lateral, one vertical), a shaft is a
straight through ±Y, and a lift is a shaft with a moving part. None of them
needs its own field.

That deletes something from the earlier draft. It proposed:

```jsonc
{ "at": [4, 0, 6], "connects": "up", "mesh": "stairs" }
```

which is a special case for a thing the code already says. `connects` goes; a
cell's vertical links are bits of its code like any other. What genuinely
remains is that a lift **moves**, which is a feature bound to the cell rather
than a property of its topology — and features are already a registry.

### Both families degenerate, and the two fixes are dual

Tonio's next step, and it is the one that makes the classification earn its
keep: once you can name a pillar or a blob, you can **strip** it.

**Volumes: a cell with no exposed face is invisible.** Count the faces adjacent
to something non-solid. Zero means every neighbour is solid, so the cell
contributes no surface and can be omitted entirely — the shell renders, the
fill does not. On any solid region bigger than a few cells this is most of the
cells. It is a pure optimisation: nothing visible changes, so it can default to
on.

Six means fully exposed, which is the **pillar** — and that one is usually
deliberate.

**Manifolds: a saturated region is not a network, it is a place.** The dual
statement, and the one Tonio named: a block of road cells that are all
fully-connected is not a mesh of crossroads, it is a **parking lot**. Rendering
it as `road-crossroad` next to `road-crossroad` is technically correct and
looks wrong, because the thing being described stopped being a road.

**The kit already ships this**, which is the best evidence the reading is
right:

| piece             | footprint | what it is                               |
| ----------------- | --------- | ---------------------------------------- |
| `road-crossroad`  | 1 × 1     | a junction                               |
| `road-curve`      | **2 × 2** | four cells of tight corner, as one sweep |
| `road-roundabout` | **3 × 3** | a saturated junction, as one place       |

So the mechanism is **promotion**: where a pattern matches, replace a block of
cells with the single larger piece the kit provides. Roundabouts and sweeping
curves are not special-cased content — they are what saturation collapse looks
like when the kit has been designed by someone who already knew this.

```jsonc
"degenerate": {
  "interior": "strip",     // volume: no exposed face, no geometry
  "isolated": "pillar",    // volume: fully exposed, and usually meant
  "saturated": { "min": 2, "mesh": "road-square" }
},
"promote": [
  { "match": "curve", "size": [2, 2], "mesh": "road-curve" },
  { "match": "cross", "size": [3, 3], "mesh": "road-roundabout" }
]
```

⚠️ **The two are not equally safe, and should not default the same way.**
Stripping an interior cell changes nothing anybody can see, so it is on by
default. Promotion is a JUDGEMENT — a 2 × 2 of crossroads might be four
deliberate junctions in a dense grid — so it is opt-in, carries a minimum size,
and loses to `overrides`. An author who pinned a cell has already said what
they want there.

**Classification is output, not just an internal step.** Each cell gets a label
— `interior`, `shell`, `isolated`, `saturated` — and it is readable, because
that is what lets a consumer reason about the map rather than only look at it:
a pathfinder wants the saturated regions as areas, an occlusion system wants
the shell, and a lighting pass wants to know which pillars stand alone. Marking
them is what makes stripping them safe.

(One consequence for testing: stripping means a map with N filled cells does
NOT produce N meshes, so a scene test that asserts a count has to count the
shell. `sceneFloorplan` reads the post-cull draw list, which is the right
number for "what does this look like" and the wrong one for "did every cell
compile" — those are two different questions and the second wants `problems`.)

### Both families need an answer for the degenerate end

The zero and one cases are where a generator produces something silly and says
nothing:

- an isolated **path** cell — code `000000`, connected to nothing — is a
  floating node, and almost always an authoring slip
- an isolated **solid** cell is a pillar, which is sometimes exactly what you
  meant

So the tileset says which: `"isolated": "pillar" | "omit" | "warn"`. Defaulting
to `warn` for paths and `pillar` for volumes matches what each usually means,
and neither silently invents geometry.

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
  same grid position so you can vary landscape". Which one you get is seeded;
  see below.
- **`footprint`** is read from the kit manifest where possible and only
  overridden here. `road-curve` really is 2 × 2 while `road-bend` is 1 × 1;
  without this the compiler places a double-size curve in one cell and nothing
  says so.
- **`themes`** is a name substitution, because that is empirically what a theme
  IS in these kits.

## Variety is seeded, and the seed is the consumer's to change

Tonio's call: **seeded, and overridable by the consumer.** Three things follow
from that, and they are the design rather than a detail.

**The seed is DECORATIVE ONLY.** It selects among meshes that are already
interchangeable for a cell — same code, same footprint — so changing it can
never change what the level IS. A road stays a road, a corner stays a corner;
you get a different boulder. That property is what makes a consumer override
safe to offer at all: if the seed could move a wall, handing it to a game would
be handing it a level editor it did not ask for.

Worth a test rather than a promise: **the same map at two different seeds must
produce the same edge code in every cell.**

**Hash the coordinate; do not walk a PRNG.** `variant = hash(seed, level, x, y)
% choices.length`. A sequential generator would be simpler and is wrong here:
inserting one cell shifts every subsequent draw, so painting a tile in the
top-left reshuffles the whole map underneath the author's hands. Hashing the
coordinate makes each cell independent, which is what an editor needs and what
makes a diff of a hand-edited map readable.

**Precedence, most specific first:**

|                       | wins over         | because                                   |
| --------------------- | ----------------- | ----------------------------------------- |
| a cell in `overrides` | everything        | the author pinned that one on purpose     |
| `ctx.seed` (consumer) | the file's `seed` | "give me another variation of this level" |
| `seed` in the file    | the default       | the author chose a look                   |
| `0`                   | —                 | absent means reproducible, not random     |

So an author who likes one corner's boulder pins that cell and keeps it through
every reseed, which is the answer to the question this replaced: `overrides`
stays the escape hatch, because the seed is now cheap to re-roll without losing
the parts you cared about.

**Where the consumer's seed goes.** `BuildOptions.seed`, surfaced as
`ctx.seed` — not a tilemap-only option, because any feature with a choice to
make wants the same reproducibility rule and the same override. One number for
the build is the simple version; per-piece (`seeds: { town: 12 }`) can follow
if one map in a scene ever needs to differ from another, and nothing about the
simple version blocks it.

⚠️ Absent means **`0`, not `Math.random()`**. An ensemble is a static
description and has to render the same twice — the same argument that makes
`realtimeScale` default to a still sky. A consumer who genuinely wants a
different world each run passes a random seed and has said so.

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

## Most of Kenney's kits are tile ASSEMBLY kits — and that is the same machinery

Tonio's generalisation, and the measurement backs it: only a minority of these
kits autotile. `city-kit-roads`, tower-defense's paths and hexagon's
paths/rivers are true tilesets. Everything else — `modular-buildings`,
`castle-kit`, `mini-dungeon`, the suburban lot — is a kit of PARTS you assemble
something out of.

The temptation is to conclude that assembly needs its own system. It does not,
and `modular-buildings` shows why:

| piece                       | size             | what it is             |
| --------------------------- | ---------------- | ---------------------- |
| `building-block`            | 1 × 0.63 × 1     | a straight run of wall |
| `building-corner`           | 1 × 0.63 × 1     | a corner               |
| `roof-flat-center`          | 1 × **0.11** × 1 | roof interior          |
| `roof-flat-border-straight` | 1 × **0.21** × 1 | roof edge              |
| `roof-flat-border-corner`   | 1 × 0.21 × 1     | roof outer corner      |
| `roof-flat-corner`          | 1 × 0.11 × 1     | the other corner form  |

Those are **boundary sets** — the same six canonical codes — applied not to the
map but to **a building's own footprint**. Walls are the boundary of the
footprint region; the roof is the same region read at the face locus, with
`center` inside and `border-*` around the edge. The height difference is the
physical tell: the centre is 0.11 and the border is 0.21, because the border
carries the parapet. That is exactly why a boundary set has to exist at all.

### So an assembly kit is autotile sets over NESTED regions

One region — a building's cells — read three ways at once:

| locus                      | gives you                                     |
| -------------------------- | --------------------------------------------- |
| **face**                   | floors, and the roof (`center` / `border-*`)  |
| **boundary** (vertex/edge) | walls (`block` / `corner`), fences            |
| **stacked**                | storeys, at the kit's vertical module (0.625) |

And the map's road network is the same compiler pointed at a bigger region.
There is no "assembly system" to build: **the tiling machinery IS the assembly
machinery, scoped to a region instead of to the map.**

That is worth stating because it changes what milestone 1b costs. A building is
not a new subsystem — it is a region, a tileset per locus, a storey count and a
roof. The parts that genuinely remain unshared are the _composition rules_: a
door goes on the ground floor on the street-facing edge, a window does not go
where a door is, and a chimney goes on the roof. Those are placement
constraints over an already-tiled region, which is the accessory/anchor problem
one level up.

⚠️ **Where this stops.** `mini-dungeon` and `castle-kit` really are just parts —
`wall`, `wall-half`, `wall-narrow`, `wall-opening`, `wall-corner`, and no
inner/outer pair anywhere. They have a corner piece but not a corner SET, so a
compiler can place them from a region boundary but cannot pick between
variants, because there are none to pick. Recognising which kind of kit you
have is a tileset-authoring judgement, not something to infer at build time.

## Buildings are not tiles — and that is what makes the demo worth building

Tonio: roads alone are not compelling; combine them with a building kit. Right,
and measuring the building kits changed the design rather than just the demo.

| kit                   | building footprints                                  |
| --------------------- | ---------------------------------------------------- |
| `city-kit-commercial` | **0.5 × 0.5** (14 of them), skyscrapers ~1.36 × 1.36 |
| `city-kit-suburban`   | ~1.03 × 1.03 to 1.3 × 1.03                           |

**None of those is a grid module.** Four commercial buildings fit in one road
cell; a suburban house is _slightly bigger_ than a cell; a skyscraper overflows
one and does not fill two. These are free-standing props with organic sizes,
not tiles that tile.

So the two layers are different kinds of thing, and pretending otherwise is how
you end up with a city on a lattice that looks like a spreadsheet:

- **Roads are a tileset.** Autotiled from a bitmap, edge codes, rotation.
- **Buildings are props with a placement rule.** A cell is marked _buildable_;
  what lands there is chosen from a kit, placed with an anchor and a jitter,
  and **rotated to face the street**.

### A layer reads another layer

That last clause is the whole demo. A lot's orientation is not authored — it is
**derived from the road layer**: look at the cell's four neighbours, find the
road-facing edge, face that way. A corner lot has two candidates and picks one.

This is the thing that makes clicking out a city feel like more than filling in
cells, and it is a real design commitment: **a layer may read another layer's
codes.** Everything else in this plan is per-cell and local; this is not, and it
is worth being explicit that it is the exception rather than discovering later
that half the features want it.

### A cell can host an ENSEMBLE, not just a mesh

`city-kit-suburban` ships the rest of a plot: `driveway-long` / `driveway-short`,
`fence` and `fence-1x2` … `fence-3x3` (sized in cell units), `path-stones-*`,
`planter`, `tree-large` / `tree-small`.

A suburban lot is therefore not one mesh — it is a house, a driveway meeting
the street, a fence along the boundary and a tree. Which is an **arrangement**,
which is the thing this format already describes. `Piece.ensemble` exists and
is reserved for exactly this ("the loader does not flatten yet"), so a lot is a
small ensemble instanced per cell and rotated as one.

That also lands the fence in the right place without inventing anything: a
fence is on the lot BOUNDARY, and a boundary is the edge locus — the self-dual
one, where doors already live.

### The example this argues for

A suburban block, in one map:

| layer  | locus          | source                                           |
| ------ | -------------- | ------------------------------------------------ |
| roads  | face           | `city-kit-roads`, autotiled from a bitmap        |
| lots   | face           | cells adjacent to a road, hosting a lot ensemble |
| fences | edge           | lot boundaries, sized pieces                     |
| trees  | face, jittered | filler on empty cells                            |

It exercises two tilesets, two loci, a derived rotation, props-that-are-not-
tiles, and a nested ensemble — which is considerably more of the design than
a road network alone would have tested, and is the argument for building it
this way round rather than adding buildings afterwards.

## An ensemble as a resource for another ensemble

Tonio's closing move, and it is the one that makes the rest of this cohere: if
a tile can be an assembly of smaller pieces, then **an ensemble is a set of
tiles**, and one ensemble should be usable as a source for another the way a
`.glb` is.

That makes the format self-hosting. A fancy wall segment — block, window
insert, trim, a lamp bracket — is authored ONCE as a small arrangement, and
then autotiles exactly like a mesh does. Nothing about the tiling machinery
changes; only where a role's geometry comes from.

### Two mechanisms, and they are not the same one

Worth separating, because the format already half-has both and conflating them
is how this gets muddled:

|                         | what it does                                             | status                                                               |
| ----------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| **nesting**             | place ONE instance of another ensemble at a position     | `Piece.ensemble` exists, reserved, "the loader does not flatten yet" |
| **ensemble-as-library** | name MANY reusable parts that others instantiate by name | new                                                                  |

The second is the request. `LibraryRef` is currently `{ name, url }` pointing
at a `.glb`; the smallest honest change is to let the url point at an ensemble
and say so:

```jsonc
"libraries": [
  { "name": "roads", "url": "https://cdn.tosijs.net/kenney/libraries/city-kit-roads.glb" },
  { "name": "trim",  "url": "/tiles/fancy-walls.json", "kind": "ensemble" }
]
```

…and then `mesh: "trim/fancy-window"` resolves against it. **`kind` explicit
rather than sniffed from the extension**: a URL without one is normal, a
content-type is a network round trip before you can validate, and guessing is
how a `.json` that happens to be a manifest becomes a confusing error.

### What an ensemble exposes, and the origin convention

Its **top-level piece ids**. A single-mesh tile is one piece; a multi-part tile
is a piece that is itself a nested ensemble, which is the first mechanism doing
its job inside the second. No new concept, and no `parts:` map to keep in step
with the pieces it describes.

⚠️ **A tile ensemble must be authored centred in X/Z and sitting on `y = 0`.**
Not an arbitrary rule — it is what all six measured kits already do, so a tile
authored here drops into a grid beside a Kenney tile with no offset table. An
ensemble used as a library that does not follow it produces content that is
subtly misaligned in a way that looks like a tiling bug, so `validate` should
say so rather than let it through.

### Cycles

A resource graph can loop: A uses B uses A. `validate` returns problems and
never throws, so the answer is a `cyclic-resource` error naming the path, and a
loader that refuses to expand rather than recursing until the tab dies. Cheap
to add now, and the sort of thing that is discovered at 3am otherwise.

### Why this is the right shape rather than a convenience

It closes the loop the rest of this plan opened. An assembly kit is autotile
sets over nested regions; a region's tiles can themselves be assemblies; and an
assembly is an arrangement, which is the thing this format exists to describe.
So a "tileset" stops being a special artifact — it is metadata over a source,
and the source may be a `.glb` from Kenney or an ensemble somebody authored in
the editor this morning.

That also gives the editor a job it does not have yet and obviously should:
**select some pieces, save them as a tile.**

## Baking at a boundary — and where the boundary is

A tile assembled from five pieces, used two hundred times, is a thousand nodes.
Tonio: bake a tile into a single mesh, or at least a smaller set, allowing for
parts that are optional or loosely placed.

**The prerequisite holds for the kits that matter most, measured** — but it is
not universal, and the difference decides how merging has to be written:

| kit                 | materials | textures | meshes |
| ------------------- | --------- | -------- | ------ |
| `city-kit-roads`    | **1**     | 1        | 72     |
| `modular-buildings` | **1**     | 1        | 108    |
| `city-kit-suburban` | **1**     | 1        | 40     |
| `mini-dungeon`      | **1**     | 1        | 29     |

| `space-kit` | **11** | — | 153 |

For the first four, any subset merges into one geometry with no atlasing work —
which is not typical of asset packs and is what makes this cheap. `space-kit`
is the counter-example, so **merging groups by material** rather than assuming
one. That is standard and costs nothing; assuming otherwise would have produced
a merger that silently welded two materials into whichever it kept.

⚠️ I claimed "every kit" here on the strength of four. `space-kit` was the
fifth. Worth leaving the correction visible rather than tidying it away.

### Two optimisations, and they are not the same one

- **Instancing** — one geometry, many transforms, one draw call. Variability is
  free because each instance carries its own matrix.
- **Merging** — several _different_ geometries in fixed relative positions,
  welded into one. Per-part transforms are gone.

An assembled tile is many different meshes, so instancing alone does nothing
for it. **The point of baking is to make the tile instanceable**: merge the
assembly once per tile variant, then instance that single geometry across every
occurrence. Two hundred uses of a five-part tile go from a thousand nodes to
one geometry and two hundred instances.

### The boundary is where variability starts

Parts get classified, and the classification IS the boundary:

| class      | example                                | treatment                                                |
| ---------- | -------------------------------------- | -------------------------------------------------------- |
| `fixed`    | walls, floor, trim                     | merged into the tile's baked geometry                    |
| `optional` | "this bed may or may not be here"      | excluded; instanced by its own mesh across the whole map |
| `placed`   | "this lamp goes somewhere around here" | excluded; instanced, carrying its jitter                 |

⚠️ **Do not bake per combination.** Three optional parts is eight variants; ten
is a thousand and twenty-four. Excluding them costs one extra instanced
geometry each — shared across the entire map rather than per tile — which is
both cheaper and bounded.

### Three more things that must not be baked, for reasons other than variety

The boundary is not only about variability, and each of these is a way to lose
something that used to work:

- **Anything interactive.** A door that opens needs its own transform, and
  doors are edge pieces, which the plan already treats separately.
- **Anything a feature binds to.** A lamp with a light program, a destroyable
  crate — `bind` returns a handle to a thing, and merging dissolves the thing.
- **Anything the editor must select.** Which means **baking is off in the
  editor by construction**, not by a flag someone remembers: the editor's whole
  job is picking pieces apart, and it already rebuilds hundreds of times a
  session where a game builds once.

### The invariant worth testing

Merging must not change the picture, and "looks the same" is not checkable. Two
things are:

- **Total triangle count is preserved.** Merging regroups geometry; it does not
  add or remove any.
- **The union bounding box is preserved.** Same extent, differently grouped.

Both are cheap, exact, and catch the real failure — a part silently dropped
from the bake, which otherwise shows up as a hole somebody notices in a
screenshot three weeks later.

⚠️ A `sceneFloorplan` diff will NOT be empty across a bake, and should not be:
five records become one, by design. Comparing floorplans is the wrong tool
here, and saying so is worth more than a test that appears to check something.

### Where it happens

Load-time first — merge in the browser after the grid compiles — because it
needs no new artifact and no build step, and the numbers above say it is cheap.
A build-time bake producing a merged `.glb` per tile variant is a later option
and a bigger commitment: it adds a generated file to keep in step with the
tileset that produced it.

## Why this generalises: spaceships

Tonio's observation, and `space-kit` (153 items) is the check on it rather than
the illustration:

| family                                                | items   | reading                                               |
| ----------------------------------------------------- | ------- | ----------------------------------------------------- |
| `corridor`, `_corner`, `_cross`, `_split`, `_end`     | 1 × 1   | a **path** set                                        |
| `corridor_wall`, `corridor_wallCorner`                | 1 × 1   | the **boundary** set beside it                        |
| `monorail_trackStraight/_CornerLarge/_Slope/_Support` | —       | a **second** path network, with a vertical transition |
| `pipe`                                                | 18      | a **third**                                           |
| `hangar`, `platform`, `rocket`                        | various | props, not tiles                                      |

So a ship is the same three loci: corridors are paths on faces, hull plating is
the boundary of the pressurised region, airlocks are edges. It is 3D from the
start, which the six-bit code already covers — a ladder between decks is an
elbow and a lift shaft is a straight, and neither needs a special field.
Interior and exterior are the portal Points and Zones the plan already uses,
and a fleet is the baking argument at its most favourable: bake the ship once,
instance it.

**Three requirements it adds that a town did not.**

1. **Several independent path networks in one map.** Corridors, monorail and
   pipes are three, and they overlap without interacting — a pipe may run
   through a corridor's cell. So layers are not a short list of known kinds
   (roads, lots, fences); a map has N layers, each with its own tileset and its
   own codes, and only some pairs interact.
2. **A cell carries FEATURES, not only geometry.** An engine cell, a reactor, a
   door that opens. The format already has this — a piece has `features` — so a
   tilemap cell must be able to say so too, or every functional cell has to be
   hand-placed alongside the grid and kept in step with it. Worth building in
   from the start rather than retrofitting.
3. **Symmetry.** Ships are overwhelmingly mirror-symmetric and towns are not.
   An editor that mirrors an edit across an axis is the difference between
   building half a ship and building all of it twice. That is an editor
   affordance rather than a format one, but it should be designed for before
   the editor's grid painting is written.

**And the connectivity graph wants to be output.** The codes already describe a
graph — which cells connect to which, through which faces — and a ship is where
that stops being an implementation detail: power, fuel and atmosphere route
along it, and a hull breach is a change to it. The plan already says the cell
CLASSIFICATION is output; the graph is the same argument one step further, and
it is the thing that makes a tilemap useful to a game rather than only to a
renderer.

None of that changes the design. It is the case that most rewards it, which is
the useful kind of confirmation — and `manta-recon` is the consumer that would
reach for it first.

## Generated ships, and the one requirement that changes

Tonio, as a direction rather than a commitment: generate ship floor plans
**together with their system spec** — Starfield's ship builder with a combat
system worth the name.

Three things about that are already the plan, and one is not.

**Already the plan.** A generator is a first-class consumer of this format —
`validate` returns problems rather than throwing precisely so a generator can
decide whether to emit, and `build.js` imports under plain Node so it can. And
it is the strongest argument yet for the grid staying a grid: a generator
emitting ten thousand pieces is producing something nobody can read or diff,
while a generator emitting a bitmap is producing the thing it was actually
reasoning about.

**The spec is a reduction over the graph.** A ship with three reactor cells and
eight thruster cells has a power budget and a thrust figure; those are computed
from the layout, not authored beside it and kept in step by hand. That is why
cells carrying features and the connectivity graph being OUTPUT both matter —
they are the substrate a spec reduces over. What the reductions ARE is domain
(power, thrust, heat, crew), so they belong in a preset the way combat does,
not in the format. The format's job is to expose enough that a preset can
compute them and nothing more.

**⚠️ What is new: the map has to change at RUNTIME.** A combat system worth
having damages the ship — a hull breach removes cells, a severed corridor
splits the power graph, and the spec recomputes because the layout did. So a
tilemap cannot be a build-time expansion that is thereafter frozen. It needs:

- **incremental edits** — change these cells, re-tile their neighbourhood,
  without rebuilding the map
- **an incrementally maintained graph**, since recomputing connectivity for a
  whole ship on every hit is the obvious thing that will not hold up
- **a bake that survives it**, which is the awkward one: baked geometry is
  frozen by construction, so a damaged region has to fall back to unbaked
  pieces, or re-bake. Worth designing the bake so a region can be re-baked
  rather than only the whole map.

The happy accident is that **the editor needs the same three things.** It
rebuilds on every edit, wants only the touched neighbourhood re-tiled, and must
not bake what it is editing. So incremental re-tiling is not a feature for a
hypothetical game — it is the editor's own requirement with a second customer,
which is the best possible reason to build it properly the first time.

I have not put it in the milestones. It changes what milestone 1's compiler
should look like on the inside — a function from a whole grid to a whole scene
is the wrong shape if the second caller wants to change nine cells — and that
is the sort of thing worth knowing before writing it rather than after.

## Levels, stairs, shafts

`levels[]` with an explicit `y`, and `levelHeight` from the tileset (measured:
0.625 for `modular-buildings`, 1.1 for `mini-dungeon`, 1.31 for `castle-kit`).

Vertical connectors need no special field — see "Stairs, shafts and lifts stop
being special" above. In a 3D code a stair is an elbow and a shaft is a
straight; the kits have the geometry (`stairs`, `stairs-stone`,
`wall-narrow-stairs`, `tile-slope`, `tile-straight-slope-large`).

⚠️ A **2D** map with `levels[]` is the cheap version and it does need one: with
4-bit codes there is no bit that means "up", so a level-linking cell has to be
declared. That is an argument for going to 6-bit codes sooner rather than
bolting `connects` onto the 2D compiler and then deleting it.

What a lift needs beyond topology is that it MOVES, which is a feature bound to
the cell rather than a fact about its shape.

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

|        | what                                                                                                                                                                                                                      | done when                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **0**  | Tileset schema + a generated draft for `city-kit-roads`, edge codes filled in by hand                                                                                                                                     | the draft round-trips through `validate`                                                  |
| **1**  | `tilemap` feature: square lattice, face locus, 1 × 1, coordinate-hashed variants + `ctx.seed`. **Compile per NEIGHBOURHOOD, not per map** — the editor and a damage model both need it, and the shape is hard to retrofit | a bitmap renders a road network in the browser, verified by a scene fence                 |
| **1c** | Ensemble-as-library: `LibraryRef.kind: "ensemble"`, ids as items, cycle detection, the centred/`y=0` rule enforced                                                                                                        | a hand-assembled tile authored in the editor autotiles beside a Kenney one                |
| **1b** | **Roads + buildings in one map** — a second layer of props, rotation derived from the road layer, lots as nested ensembles                                                                                                | a suburban block renders, houses face the street, and it is worth showing someone         |
| **1d** | Bake: classify parts `fixed` / `optional` / `placed`, merge the fixed core per tile variant, instance it; off in the editor                                                                                               | a 100 × 100 block renders at a sane draw count, triangle count and union bounds unchanged |
| **2**  | `solid` model (mini-dungeon), multi-cell footprints, overrides                                                                                                                                                            | a dungeon bitmap renders walls that agree with their neighbours                           |
| **3**  | Levels, stairs, lifts; portal Points and interior Zones                                                                                                                                                                   | two levels connected by a stair, and an interior you can enter                            |
| **4**  | Editor: paint cells, pick layers, drop accessories on anchors                                                                                                                                                             | clicking out a level is faster than writing the JSON                                      |
| **5**  | `edge` model (`modular-buildings` façades), doors as edge annotations                                                                                                                                                     | a building with windows and a door that is on the wall between two cells                  |

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
5. ~~**How much variety is too much?**~~ **Decided** — see "Variety is seeded,
   and the seed is the consumer's to change" above.
