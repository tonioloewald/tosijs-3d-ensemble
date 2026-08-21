# Assembly Editor — specification

**Status:** proposal. Written after building a working prototype inside
manta-recon (`src/prefab*.ts`, `src/bench-*.ts`, `static/prefab.html`) and
discovering it does not belong there.

**Two deliverables, not one:** an `assembly` format + instantiator that goes
**upstream into tosijs-3d**, and a graphical **editor** in its own project that
depends on tosijs-3d and tosijs-ui.

## Where each piece lives

Three concerns, and they do **not** all belong in the same place.

| | goes in | why |
|---|---|---|
| **The assembly FORMAT** (types, defaults, validation) | **tosijs-3d** | every consumer that ships levels needs it; only authors need an editor |
| **The INSTANTIATOR** (JSON → live scene objects) | **tosijs-3d** | it is a runtime concern. A game loads assemblies with no editor present |
| **The EDITOR** | **its own project** | authoring UI, schema machinery, file I/O — needed by authors, nobody else |

Owner: *"The 'prefab' structure and the tool for instantiating it belong in
tosijs-3d, the editor is simply a tool for creating those graphically."*

That is the right line and it corrects an earlier draft of this document, which
argued the whole thing should sit outside tosijs-3d. The mistake was treating
"format" and "editor" as one deliverable. They have different audiences:

- A **shipped game** carries the format and the loader and no editor at all.
  That is the common case, and it must not pay for authoring.
- An **author** additionally wants the editor, which depends on tosijs-3d (for
  the scene and the loader) and tosijs-ui (for the interface).

So `tosijs-3d` gains something like `b3d-assembly` — the schema, `validate()`,
and `loadAssembly(url, origin)` / `buildAssembly(data, origin)` — and the editor
project depends on it rather than reimplementing it. **The editor writes
exactly what the runtime reads, because it is the same code**, which is the
property that makes "what you author is what you get" true by construction
rather than by discipline.

It also settles the awkward part of the earlier draft: the *runtime binding*
(feature → behaviour) is not a consumer concern after all. Features like
`destroyable`, `turret`, `radar` and `launchpad` map onto components tosijs-3d
already ships, so the binding is the instantiator's own job. What stays
consumer-supplied is the SCHEMA for anything custom, plus roles and scenarios.

### Not in Manta

Manta keeps: its assemblies (`static/assemblies/*.json`), its roles, its
scenarios, and any Manta-specific features. It deletes the format, the
instantiator and the bench.

## Naming

"Prefab" carries Unity baggage (a prefab there is a serialized *scene object
with components and code*). What we have is smaller and stricter: **data
describing an arrangement of library meshes, with declared capabilities and
relationships, and no code**.

**Recommendation: `assembly`.** Accurate, unclaimed, and reads correctly in
every position — "an assembly", "assembly editor", "assemblies/ocean-rig.json".
Alternatives considered: `composition` (vague), `fixture` (test connotation),
`construct` (overloaded), `set-piece` (theatrical, hyphenated), `kit` (implies
the parts, not the arrangement).

The rest of this document uses **assembly**.

---

## Part 1 — the assembly format

Plain JSON. **No functions, no code, no engine types.** Everything must survive
a round trip through a file, a fetch, a text editor and a generator. This is
non-negotiable: the format has to be authorable by hand, by the editor, and by a
mission compiler.

```jsonc
{
  "name": "ocean-rig",
  "kind": "rig",                    // free-form; consumers group by it
  "scale": 2.5,                     // multiplies every offset and piece scale
  "values": { "targetValue": 3, "faction": "hostile" },
  "pieces": [ /* … */ ],
  "links":  [ /* … */ ],
  "points": [ /* … */ ],
  "zones":  [ /* … */ ]
}
```

### Pieces

```jsonc
{
  "id": "rig",                      // stable handle; defaults to `${mesh}#${i}`
  "mesh": "Pump Station",           // PUBLIC library name
  "at": [0, 0, 0],                  // assembly-local metres
  "rot": [0, 0, 0],                 // euler degrees, optional
  "scale": 1,                       // multiplies the assembly scale
  "role": "structure",              // preset (see below)
  "features": { /* … */ },          // explicit capabilities; override the preset
  "subsystems": [                   // vulnerable parts INSIDE a composite mesh
    { "match": "Pump$", "hp": 18, "label": "pump" }
  ],
  "points": [], "zones": [], "values": {}
}
```

Positions are **assembly-local**, so the same assembly works at sea level or on
a plateau. `match` is a regex **source string**, compiled at load — not a
`RegExp`, or the format stops being serializable.

### Features — capabilities toggled ON a piece

This is the central idea and the one that took longest to reach. Components are
not separate objects; they are **capabilities of an object**.

```jsonc
"features": {
  "destroyable": { "hp": 12, "armor": 0, "explode": true },
  "turret":      { "range": 260, "fireRate": 1.1, "damage": 4, "smart": false },
  "launcher":    { "range": 600, "reload": 3, "damage": 30 },
  "radar":       { "range": 700, "boostRadius": 90,
                   "boost": { "smart": true, "range": 60, "fireRate": 1.4 } },
  "launchpad":   { "craft": "Light Fighter", "interval": 20, "maxAlive": 4 },
  "blip":        { "faction": "hostile", "profile": 1 },
  "protector":   { "protection": 12 }
}
```

Three things this buys:

1. **One object, many capabilities** — a pump station that shoots back is one
   piece with two features, not two overlapping entities.
2. **Features can interact.** "A radar improves nearby turrets" is a rule *about
   features* and has nowhere to live if every capability is its own object. It
   also gives a defence a soft spot, which is a design affordance.
3. **It stays serializable** — every feature is a flat object of numbers,
   strings and booleans, so the editor can render it from a schema.

### Roles — presets, not categories

`role` expands to a feature set; explicit `features` win. Roles carry **intent**
("this is the power source") where features carry **mechanism**. A designer
means the first; the runtime needs the second.

Shipped roles: `structure` · `target` · `power` · `generator` · `shield` ·
`critical`. **Consumers must be able to define their own** — see Part 3.

### Links, points, zones, values

```jsonc
"links":  [{ "from": "reactor", "to": "projector", "delay": 0.4, "beam": true }],
"points": [{ "id": "pad", "at": [0,6,8], "kind": "spawn", "facing": [0,180,0],
             "meta": { "craft": "Light Fighter" } }],
"zones":  [{ "id": "cap", "at": [0,40,0], "radius": 70, "kind": "escort",
             "capacity": 3 }]
```

- **Links** are directed on-destruction relationships (chain reactions). `beam`
  renders the same relationship as a visible conduit — one declaration, two
  consequences, nothing to keep in sync.
- **Points** are named places with no geometry: spawns, waypoints, docks,
  entrances, join points for tile-sets. They exist so a mission can say "launch
  from the rig's pad" without restating world coordinates.
- **Zones** are volumes that AI reads. An escort zone plus "idle craft seek
  escort zones" produces **formations as an emergent consequence** rather than
  formation code — and it degrades correctly, because killing the carrier
  removes the zone.
- **Values** are abstract data (`targetValue`, `faction`, open map) for a rules
  layer to key on. Deliberately open: a closed enum needs revising every time
  the fiction grows.

### Validation

`validate(assembly, knownMeshes?) → Problem[]` — returns problems, never throws
(a builder shows them; a generator rejects without dying).

**Return severity, not strings.** The two consumers want different things from
the same call: an editor shows everything and keeps working, a generator must
decide whether to emit. A bare `string[]` forces the generator to either reject
on cosmetic warnings or parse prose to tell them apart — and it will parse prose.
`{ severity: 'error' | 'warning', code, message, path }` costs nothing now and is
painful to retrofit once anyone matches on the text. `path` is what lets the
editor put the message on the field rather than in a list.

Must include:

- unknown mesh names (only when the library is loaded — a validation error that
  is really a loading race is worse than none, because it accuses good content)
- duplicate piece/point/zone ids
- links referencing unknown pieces
- **a shield with no incoming link** — an unsolvable objective, which looks
  entirely normal until a player spends five minutes failing to kill something

---

## Part 2 — the editor component

Ships as a configurable component, not an application:

```javascript
assemblyEditor({
  libraries: [{ url: '/enemies.glb', type: 'enemies' }],
  schema: MANTA_SCHEMA,        // see Part 3
  scenarios: MANTA_SCENARIOS,  // see Part 4
  onSave: async (assembly) => { /* consumer owns persistence */ },
  load: async (name) => { /* consumer owns loading */ },
})
```

### Required affordances

| | |
|---|---|
| **Library palette** | every mesh the loaded libraries expose, by public name |
| **Select** | click in viewport *or* list; picking walks UP to the owning piece, so clicking a turret barrel selects the turret |
| **Manipulate** | move / rotate / scale gizmos, writing back to the JSON **on drag release** (not per frame) in assembly-local coordinates |
| **Bounding box + wireframe** | toggles; wireframe is how you read a fortress's interior |
| **Placement** | `land` (ground at 0) and `aquatic` (water at 0, seabed at a variable depth). Both planes **pinned to the origin** — a bench looks at one thing from many angles, so the world holds still and the camera moves |
| **Camera** | fit-to-bounds (re-fitting as async models load), named angles, and **orthographic as a toggle independent of angle** — ortho for judging alignment, perspective for judging how it reads |
| **Animation** | play / pause / scrub / speed. Library animation groups arrive **stopped**; an editor that does not start them hides what it exists to show |
| **Shadows** | the ground receives; assembly pieces cast. Runtime-added meshes must be registered as casters continuously, not once |
| **Validation** | live, non-blocking, visible |
| **Persistence** | load, save, import file, export file. The component owns none of it — it calls the consumer's handlers |

### Explicitly out of scope for v1

Undo/redo, multi-select, snapping/alignment guides, terrain painting, nested
assemblies. All defensible later; none required to be useful.

---

## Part 3 — the schema system (the part that makes it reusable)

This is what stops the editor being Manta-shaped. The editor must not know what
`destroyable` means; it must know how to **render an editor for it from a
description**.

### Schemas are JSON Schema, via tosijs-schema

Owner: *"We should leverage tosijs-schema to define the schemas as json-schema
extending to tjs predicates when the time comes."*

`tosijs-schema`'s premise is exactly the one this needs — **JSON Schema →
types + validation, single source of truth** (as opposed to Zod's
TypeScript-first direction). Three consequences, all of which this project
wants:

1. **One artifact does four jobs.** The same schema types the format, validates
   a loaded file, drives the editor's property panel, and describes the format
   to an LLM writing a mission generator. Hand-written field descriptors would
   have to be kept in sync with hand-written types and hand-written validation —
   three chances to drift.
2. **The format is describable to tools that are not ours.** An assembly is
   content, and content gets generated. JSON Schema is what a generator, a
   linter or a language server already speaks.
3. **`tjs` predicates extend it later without a rewrite.** Constraints that JSON
   Schema cannot express — "a `shield` piece must have an incoming link", "a
   `ref` must point at a piece that exists in THIS assembly" — become predicates
   layered on the same schema, rather than a second validation system. The
   shield-reachability check in Part 1 is precisely this shape and is currently
   hand-rolled.

So the editor's field descriptors are not a bespoke DSL: they are JSON Schema
with a small **UI annotation vocabulary** for the things JSON Schema has no
opinion about — which widget, which library to draw a pick list from, which
roles a reference may target.

```jsonc
{
  "$id": "manta/features/turret",
  "type": "object",
  "title": "Turret",
  "properties": {
    "range":    { "type": "number", "minimum": 20, "maximum": 2000,
                  "default": 260, "x-unit": "m" },
    "fireRate": { "type": "number", "minimum": 0.1, "maximum": 20,
                  "default": 1.1, "x-unit": "/s" },
    "smart":    { "type": "boolean", "default": false,
                  "description": "leads its target instead of firing where you are" }
  }
}
```

```jsonc
// the annotations that make it an EDITOR rather than a form
{ "type": "string", "x-widget": "mesh",  "x-library": "enemies" }
{ "type": "string", "x-widget": "ref",   "x-roles": ["power", "generator"] }
{ "type": "string", "x-widget": "point", "x-kinds": ["spawn"] }
```

`x-` prefixed keys are JSON Schema's own extension convention, so a plain
validator ignores them and the editor reads them. The field-type table below is
therefore a table of **widgets**, not of types.

```javascript
const MANTA_SCHEMA = {
  features: {
    destroyable: {
      label: 'Destroyable',
      fields: {
        hp:      { type: 'number', min: 1, max: 9999, default: 12 },
        armor:   { type: 'number', min: 0, max: 100000, default: 0 },
        explode: { type: 'boolean', default: true },
      },
    },
    turret: {
      label: 'Turret',
      fields: {
        range:    { type: 'number', min: 20, max: 2000, default: 260, unit: 'm' },
        fireRate: { type: 'number', min: 0.1, max: 20, default: 1.1, unit: '/s' },
        damage:   { type: 'number', min: 1, max: 200, default: 4 },
        smart:    { type: 'boolean', default: false,
                    help: 'leads its target instead of firing where you are' },
      },
    },
    launchpad: {
      label: 'Launch pad',
      fields: {
        craft:    { type: 'mesh', library: 'enemies' },   // pick list from library
        interval: { type: 'number', min: 1, max: 300, unit: 's' },
      },
    },
    protector: {
      label: 'Shield field',
      fields: {
        protection: { type: 'number', min: 0, max: 200, default: 12 },
        source:     { type: 'ref', roles: ['power', 'generator'] },  // ref to a PIECE
      },
    },
  },

  roles: {
    power: { label: 'Power source', features: { destroyable: { hp: 16 }, blip: {} } },
    // …consumer-defined
  },

  zones:  { escort: { label: 'Escort zone', fields: { capacity: { type: 'number' } } } },
  points: { spawn:  { label: 'Spawn', fields: { craft: { type: 'mesh' } } } },
}
```

### Field types the editor must support

| `x-widget` | renders as | notes |
|---|---|---|
| `number` | numeric field / slider | `min`, `max`, `step`, `unit` |
| `boolean` | toggle | |
| `string` | text field | |
| `enum` | pick list | `options: [{value,label}]` |
| `mesh` | pick list of library meshes | scoped by `library` |
| `ref` | pick list of **pieces in this assembly** | filtered by `roles` or `features` |
| `point` / `zone` | pick list of this assembly's points/zones | for "launch from here" |
| `vec3` | three numeric fields | positions, rotations |
| `color` | colour input | |

`ref`, `point` and `zone` are the ones that make this more than a property grid:
they are how an assembly expresses **internal relationships** — this shield is
fed by that reactor, this launchpad emits at that point — without the author
typing ids.

### The feature registry — open for extension

Owner: *"it's going to depend on tosijs-3d no matter what and a consumer should
be able to bind properties to locally defined behaviors."*

This corrects an earlier draft that said the binding "is not a consumer
concern." It plainly is. Manta already has features tosijs-3d will never know
about: escort **zones** that AI reads, spline **energy conduits** that also mean
"this powers that", **charred wrecks** that char and burn instead of vanishing.
A closed feature set would mean those either get pushed upstream where they do
not belong, or the editor cannot author them.

So a feature is a **registration**, not a case in a switch:

```javascript
registerFeature({
  name: 'turret',
  schema: turretSchema,               // JSON Schema (+ x- UI annotations)
  bind(piece, cfg, ctx) {             // JSON -> live behaviour
    const t = b3dTurret({ ...cfg, x: piece.at.x, y: piece.at.y, z: piece.at.z })
    ctx.scene.appendChild(t)
    ctx.onDispose(() => t.remove())
    return { /* optional handle for other features / scenarios */ }
  },
})
```

**tosijs-3d ships registrations** for the components it already has —
`destroyable`, `turret`, `launcher`, `radar`, `launchpad`, `blip`, `protector` —
because those are the common cases and every consumer would otherwise write the
same glue. **A consumer registers its own** alongside them, with no distinction
in the format, the editor, or the file.

Since the editor depends on tosijs-3d regardless, the coupling this creates is
not a cost worth engineering around. The thing worth engineering is that a
locally-defined feature is a **first-class citizen**: it appears in the palette,
gets a schema-driven property panel, participates in `ref` pick lists, and is
saved and loaded like any other.

#### What the registry must give a feature

| | |
|---|---|
| `name` | the key in `features` |
| `schema` | JSON Schema; drives both validation and the property panel |
| `bind(piece, cfg, ctx)` | attach behaviour; return an optional handle |
| `ctx.scene` | the scene element, for appending components |
| `ctx.onDispose` | teardown, so rebuilding an assembly in the editor leaks nothing |
| `ctx.piecesByRole()` / `ctx.handle(id)` | reach other pieces — how `radar` boosts nearby `turret`s, and how a `protector` finds its power source |
| `ctx.simTime` | the time source, so effects honour pause and time scale |

`ctx.handle(id)` is the important one: it is what lets features **interact**
without knowing about each other's implementations, which is the property that
made "a radar improves nearby turrets" expressible at all.

> ⚠️ **`bind` must be TWO PHASES, or `ctx.handle(id)` is a race against array
> order.** A `protector` that resolves its power source during `bind` works only
> if the reactor happened to bind first — so the same assembly behaves
> differently depending on the order pieces appear in the file, and reordering in
> the editor silently changes behaviour. That is a nasty class of bug: it looks
> like an intermittent content problem, not a lifecycle one.
>
> Split it: **`bind`** creates and returns a handle, touching nothing else;
> **`link(handle, ctx)`** runs after every piece has bound, and is the only place
> `ctx.handle`, `ctx.piecesByRole` and zone lookups are legal. Same shape as the
> scene-listener contract in tosijs-3d, and for the same reason — a thing that
> reaches for its neighbours cannot run while the neighbours are still arriving.

> **Rebuilding must be idempotent.** The editor rebuilds an assembly on every
> edit, so `bind`/`link`/`onDispose` runs hundreds of times per session where a
> game runs it once. `onDispose` is necessary and not sufficient: the test worth
> writing is *build → dispose → build*, asserting the scene's mesh, observer and
> material counts return to where they started. A leak that a game never notices
> will eat an editing session.

#### Consequences for the editor

- The editor's palette of features is **whatever is registered**, not a hardcoded
  list. Manta's `zone`-reading escort behaviour shows up beside `turret`.
- **One implementation, two hosts.** The editor and the game bind through the
  same registry, so the preview behaves as the shipped level behaves. That is
  what makes "what you author is what you get" true by construction — and it now
  holds for consumer features too, which the earlier draft's design would have
  broken.
- A feature registered only in the editor (a visualiser, say) is legitimate, but
  should be marked so, or an author can build something the game cannot load.

## Part 4 — test scenarios

The editor must be able to **run situations**, not just render arrangements. An
assembly is a puzzle; a static render tells you nothing about whether it is
solvable or fair.

Consumer-supplied:

```javascript
const MANTA_SCENARIOS = {
  'escort — 3 idle fighters': (ctx) => ctx.spawn('Light Fighter', 3, { radius: 320 }),
  'kill the reactor':          (ctx) => ctx.damageRole('power', 9999),
  'player pass at 200m':       (ctx) => ctx.flyby({ speed: 25, offset: 200 }),
}
```

The context object needs, at minimum: `spawn`, `damage`/`damageRole`,
`pieces()`, `zones()`, `log()`, and a time control.

**Time control caveat, and it is load-bearing:** effect timing can be scaled by
a consumer-side sim clock, but craft motion cannot — velocity comes from
`b3d-aircraft` integrating against the engine delta. Until a shared clock exists,
a speed control should be labelled for what it actually scales, and this project
is the **second** consumer asking for one.

> **Update (2026-08-21): the seam now exists, and the ask is smaller than this
> paragraph assumes.** tosijs-3d#30 (which this cited) was "pause doesn't pause",
> and fixing it introduced exactly the missing plumbing: `<tosi-b3d>` publishes a
> frame delta on the scene and **everything that simulates reads it through
> `sceneDelta`** — a paused scene publishes zero and the world genuinely stops.
> `B3dControllable` halts separately, because it runs its own `Date.now` clock.
>
> So a time SCALE is now "publish `delta * scale`" plus the same explicit halt in
> the controllable, not a new subsystem. Worth re-scoping the upstream ask before
> filing it: **ask for `timeScale`, not for `simTime`.** And check the current
> state rather than trusting this document — the pause fix landed in 0.7.0 and
> the shape may have moved again.

---

## Part 5 — what Manta contributes back

Working code to lift, and lessons that cost real time:

- format + validation (`src/prefab.ts`), runtime (`src/prefab-runtime.ts`),
  gizmo binding (`src/bench-gizmo.ts`), view/placement (`src/bench-view.ts`),
  zone registry (`src/zones.ts`)
- **`b3dDestroyable()` only makes an element** — nothing happens until it is
  appended; the declarative `b3d(...)` form does that implicitly
- **attributes captured at attach are not live**: `protection`, `chain`,
  `chaseDistance`, `meshOnDeath`. Write to the combat record or use `setChain()`
- **`library` + `explode` crashed** the exploder until beta.6 (TransformNode
  root has no vertex data)
- **library materials are shared** — clone before modifying, or every instance
  changes
- **the water mesh is `water_nocast`**, not `water`; libraries expose *public*
  names (`Drone`, not `Drone_collideBox.model`) — **list what is there rather
  than guessing names**
- **an editor must render content at the game's scale**, or it teaches you the
  wrong thing about your own data

## Open questions — with recommendations

Answered rather than left hanging, since each affects the format and the format
is what goes upstream first.

### 1. Nested assemblies — **not in v1, but do not foreclose them**

A fortress made of rigs is obviously desirable and is a large jump: transform
composition, id namespacing, cyclic-reference detection, and an editing story
for "edit this instance vs. edit the definition" that Unity has never made
comfortable.

**Recommendation:** ship flat, but reserve the shape. Allow a piece to carry
`"assembly": "ocean-rig"` instead of `"mesh"`, and have v1 loaders **flatten it
at load time** — splice the child's pieces in with prefixed ids and composed
transforms. That gets composition for authoring and generation with none of the
runtime complexity, and leaves room to make instances live later. Ids must be
namespaced from the start (`rig-a/pump`) or nothing later can reference into a
nested assembly.

### 2. Terrain, bridges, tunnels — **a different thing; give them join points**

An assembly sits *on* a world. A bridge *is* the world — you fly through it, it
occludes, it defines a route. Making terrain an assembly would drag streaming,
LOD and collision meshes into a format whose whole virtue is being small JSON.

**Recommendation:** keep them separate, and let them meet at **points**. The
format already has typed reference points; `kind: "entrance"` and a `join` kind
are enough for a tile-set to declare "this end mates with that end". The
tile-set decomposition MANTA-PLAN wants is then a *sibling* format that
references assemblies for its furniture, rather than a special case inside this
one.

### 3. Multiplayer / authority — **out of scope, but the format is already safe**

Nothing here needs to change. Plain JSON with **stable, author-assigned ids** is
exactly what a networked authority needs to refer to "that pump on that rig"
without transmitting geometry. The risk to avoid is *derived* ids — if a piece's
identity depends on its array index, every insertion renumbers the world.

**Recommendation:** make `id` mandatory in v1 rather than defaulting to
`${mesh}#${index}` as the prototype does. The default is convenient and is the
one decision here that would be genuinely expensive to reverse.

### 4. Missions consume assemblies — **via an encounter, not directly**

This is the one I feel most strongly about. A mission should not say "place
`ocean-rig` at (140, 2, 520)". It should say "there is a rig here, it is
hostile, it is worth 3, and its pump is the objective".

**Recommendation:** an **encounter** layer that references an assembly by name
and overlays situation-specific data — position, faction, `values`, difficulty
scaling, which pieces are objectives, which zones are active. Three reasons:

- **Assemblies stay reusable.** The same rig appears in six missions at six
  difficulties without six near-identical files.
- **The generator gets a small surface.** An LLM composing missions picks
  assemblies and sets values; it does not author geometry, which is the part it
  would get subtly wrong.
- **It is where Ariosto binds.** Mission facts ("the refinery was destroyed
  before the treaty") attach to the encounter, not to the assembly — the
  assembly is a *kind of place*, the encounter is *this place, in this story*.

Concretely: `assembly` = what a thing IS, `encounter` = what it is DOING HERE.
That line also settles Part 1's `values`: `targetValue` and `faction` are
encounter-level, and their presence on an assembly is a **default**, overridable
per encounter.

### 5. Which UI stack — **the decision this document was making implicitly**

Owner, mid-review: *"It could make sense as a tosijs-3d project if it leveraged
our svg ui work (which would allow scene editing in VR...)"*

PLAN.md currently says "use tosijs-ui widgets", which is a reasonable default and
also a **silent commitment to flat-only, browser-only editing**. It deserves to
be an argued decision, because the two options lead to different projects.

| | **A — tosijs-ui DOM widgets** | **B — tosijs-3d SVG UI** |
|---|---|---|
| where it can live | its own project (as planned) | plausibly **inside tosijs-3d** |
| where it runs | a browser page | a browser page **and a headset** |
| forms | mature: `tosiForm`, `data-table`, `code-editor` | `widgets3d` + `box`/`surface`/`table`; no code editor |
| text entry | the OS keyboard | `keyboard.ts` (built for exactly this) |
| file I/O | native dialogs | **unsolved in a session** |
| gizmos | Babylon `GizmoManager` (mouse-shaped) | **does not exist yet, either flat or in XR** |

**The case for B is stronger than "VR would be nice", and it is worth stating
plainly: editing a 3D arrangement is a spatial task performed at arm's length.**
Judging whether a fortress reads, whether a turret covers the approach, whether a
gap is flyable — those are the questions an assembly editor exists to answer, and
they are exactly the questions a flat viewport answers badly. A tool for
arranging things in space that cannot be used *in* that space is conceding its
best affordance.

The reason B is now practical rather than aspirational is that tosijs-3d's SVG UI
is **one UI with two presentations** already — the same widget list renders as a
DOM overlay and as an in-scene texture. So B does not mean "VR instead of flat";
it means **both, from one implementation**. And the pieces an editor chrome needs
mostly exist: `surface` (menus + draggable panels), `table` (virtualised lists —
a piece list), `keyboard` (typing without an OS), `popup-surface` (tear-off
panels, modals), `gamepad-focus` (traversal without a pointer), `xr-frames` +
`frame-panel` (pinning a panel where your hand is).

#### What B costs, honestly

- **No gizmo exists.** `b3d-panel`'s coloured axes are a debug READOUT, not a
  manipulator — a real trap, because they look exactly like Babylon's position
  gizmo. Babylon ships `GizmoManager`, but it is mouse-shaped; an XR manipulator
  is a genuine build, and it is the editor's single most important interaction.
  **This is the item that decides the schedule**, and it is an upstream ask
  either way (tosijs-3d has it on its TODO).
- **No code editor and no file dialogs.** Both are real gaps in a headset.
- **Forms are the SVG UI's weakest area**, and a schema-driven property panel is
  a form generator. `widgets3d` has label/slider/toggle/select/button/list; it
  does not have a form layer, and building one is a chunk of work that tosijs-ui
  already did.

#### Recommendation

**Build the editor's chrome on the SVG UI (B), and keep the project separate
anyway.**

Splitting the two questions is the point. "Which widgets" and "which repo" got
bundled together, and only the first one has a strong answer:

- **Widgets: B.** It buys the headset, it buys flat for free, and a tool that
  looks foreign to the thing it authors for is the failure PLAN.md already names.
- **Repo: still separate.** tosijs-3d is a *framework*; an editor is an
  application-shaped thing with file I/O, schema machinery and its own release
  cadence. Putting it inside would make every consumer's dependency tree carry an
  authoring tool, which is precisely the "a shipped game must not pay for
  authoring" argument this document already makes for the format/editor split.
  The SVG UI is exported; depending on it is enough.

If that is right, two consequences ripple back through PLAN.md: milestone 0's
scaffold targets the SVG UI rather than DOM widgets, and **a manipulator becomes
a milestone-2 upstream dependency rather than a milestone-3 lift** — because
`bench-gizmo.ts` binds `GizmoManager`, which will not survive the move.

The falsifiable version: **build the piece list and one property panel in the SVG
UI first, and try them in a headset before building anything else.** If forms in
`widgets3d` turn out to be the wrong shape, that is cheap to discover there and
expensive to discover in milestone 3.

## Suggested sequence

1. **`b3d-assembly` upstream** — format types (JSON Schema via tosijs-schema),
   `validate()`, `buildAssembly()`. Manta switches to it and deletes its copies;
   that migration is the proof the API is right.
2. **Editor project** — depends on tosijs-3d + tosijs-ui. Lift the prototype's
   gizmo, placement, framing and scenario harness.
3. **Manta deletes its bench** and depends on the editor.
4. **Encounter layer**, once there are enough assemblies for the distinction to
   bite.
