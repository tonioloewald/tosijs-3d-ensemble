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

`validate(assembly, knownMeshes?) → string[]` — returns problems, never throws
(a builder shows them; a generator rejects without dying). Must include:

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

### Runtime binding — belongs to tosijs-3d, not the consumer

The schema describes EDITING. Turning a feature into behaviour is the
instantiator's job, and it lives with the format in tosijs-3d, because the
features map onto components tosijs-3d already ships (`b3d-destroyable`,
`b3d-turret`, `b3d-launcher`, `b3d-radar`, `b3d-spawner`):

```javascript
const MANTA_BINDING = {
  destroyable: (piece, cfg, ctx) => /* attach DestroyableBehavior */,
  turret:      (piece, cfg, ctx) => /* append a b3d-turret */,
  radar:       (piece, cfg, ctx) => /* register, and boost nearby turrets */,
}
```

A consumer supplies a binding only for features tosijs-3d does not know about.

The editor and the game call the **same** instantiator, so the preview and the
shipped level are produced by one implementation. That is what makes "what you
author is what you get" true by construction rather than by discipline — and it
is the strongest argument for putting the format and loader upstream rather than
in the editor.

---

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
`b3d-aircraft` integrating against the engine delta. Real slow-motion needs
`owner.simTime` / `simDt` upstream (tosijs-3d#30). Until then, a speed control
should be labelled for what it actually scales, and this project is now the
**second** consumer asking for that API.

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

## Suggested sequence

1. **`b3d-assembly` upstream** — format types (JSON Schema via tosijs-schema),
   `validate()`, `buildAssembly()`. Manta switches to it and deletes its copies;
   that migration is the proof the API is right.
2. **Editor project** — depends on tosijs-3d + tosijs-ui. Lift the prototype's
   gizmo, placement, framing and scenario harness.
3. **Manta deletes its bench** and depends on the editor.
4. **Encounter layer**, once there are enough assemblies for the distinction to
   bite.
