# Ensemble Editor — specification

<!--{"pin":"bottom","parent":"Project","order":1}-->

**Status:** proposal. Written after building a working prototype inside
manta-recon (`src/prefab*.ts`, `src/bench-*.ts`, `static/prefab.html`) and
discovering it does not belong there.

**Two concerns, one package:** an `ensemble` format + instantiator, and a
graphical **editor** for authoring them. They ship together from
`tosijs-3d-ensemble`, and a game carries only the first two because the editor
tree-shakes away.

## Where each piece lives

Three concerns, and they do **not** all have the same audience.

|                                                       |                                                          | audience                         |
| ----------------------------------------------------- | -------------------------------------------------------- | -------------------------------- |
| **The ensemble FORMAT** (types, defaults, validation) | `tosijs-3d-ensemble`                                     | every consumer that ships levels |
| **The INSTANTIATOR** (JSON → live scene objects)      | `tosijs-3d-ensemble`                                     | every consumer that ships levels |
| **The EDITOR**                                        | `tosijs-3d-ensemble`, tree-shaken out of a game's bundle | authors only                     |

> **This decision moved three times; this is where it landed.** An early draft
> put everything in the editor project. A correction moved the format and the
> instantiator **into tosijs-3d**. A second correction split them into two
> published packages from one repo. The owner settled it: _"I don't think two
> packages is right, just the editor should be thoroughly tree-shakeable if you
> just want to consume ensembles."_
>
> That is the better answer for the reason the two-package version was reaching
> for anyway. What a game must not pay for is the EDITOR — and the mechanism
> that guarantees that is a bundler, not a package boundary. Two packages would
> have bought the same property at the cost of a workspace, a second release, a
> version-skew surface between format and tool, and no ecosystem precedent
> (every other tosijs repo is a single package).
>
> **What it costs:** the guarantee is now invisible unless something checks it.
> So `src/tree-shaking.test.ts` bundles exactly what a game imports and fails if
> any editor module survives — with a companion assertion that the markers it
> looks for DO appear when the editor entry is bundled, so the check cannot pass
> vacuously.
>
> Hosting the format in tosijs-3d remains the right end state if it proves
> universal. The reason it is not there yet is **velocity**: the format is still
> learning what it is, and enriching it should not cost a tosijs-3d minor
> version each time.

Owner: _"The 'prefab' structure and the tool for instantiating it belong in
tosijs-3d, the editor is simply a tool for creating those graphically."_ —
later refined to: _"it could be a lightweight and separable import from the
editor library. Maybe the latter makes more sense."_

What survives every revision is the SPLIT OF CONCERNS, not its address:

- A **shipped game** carries the format and the loader and no editor at all.
  That is the common case, and it must not pay for authoring.
- An **author** additionally wants the editor, which depends on tosijs-3d (for
  the scene and the SVG UI) and on the format.

**The editor writes exactly what the runtime reads, because it is the same
code** — the property that makes "what you author is what you get" true by
construction rather than by discipline. One package is the cheapest way to keep
that true: there is no version at which the tool and the runtime can disagree.

What stays consumer-supplied is the SCHEMA for anything custom, roles,
scenarios, **and the runtime binding for a consumer's own features**. An
earlier draft of this section claimed the binding "is not a consumer concern
after all", on the grounds that `destroyable`, `turret`, `radar` and
`launchpad` map onto components tosijs-3d already ships. That is true of those
features and false in general — see Part 3's feature registry, which corrects
it.

### Not in Manta

Manta keeps: its ensembles (`static/ensembles/*.json`), its roles, its
scenarios, and any Manta-specific features. It deletes the format, the
instantiator and the bench.

## Naming

"Prefab" carries Unity baggage (a prefab there is a serialized _scene object
with components and code_). What we have is smaller and stricter: **data
describing an arrangement of library meshes, with declared capabilities and
relationships, and no code**.

**Decision: `ensemble`.** Reads correctly in every position — "an ensemble",
"ensemble editor", "ensembles/ocean-rig.json", `buildEnsemble()`,
`tosijs-3d-ensemble` — and it says something true that the alternatives do not.

Owner: _"ensemble is great for a bunch of reasons. It suggests a theater troupe
or similar and it's really an assembly targeting a performance."_

That is the argument. A rig is not inert scenery: its turrets fire, its
launchpads spawn, its zones steer AI, and its reactor takes down a shield when it
dies. The thing is **staged to be encountered** — so a word carrying "a group
that performs together" is describing the format accurately rather than
decorating it. It also anticipates the `encounter` layer (open question 4): an
ensemble is a troupe, an encounter is a performance of it.

### Why not `assembly`

It was the working name through most of this document's life, and it is accurate
— but on **npm, "assembly" primes WebAssembly**, not "assembled from parts".
`assemblyscript` is _"a TypeScript-like language for WebAssembly"_, and a
package called `tosijs-3d-assembly` sitting in a JavaScript registry invites
exactly that misread. The `tosijs-3d-` prefix mitigates it; it does not remove
it. ".NET assembly" (a compiled binary) is a second, weaker collision in the same
direction: both make the word mean _build output_ rather than _arrangement_.

### Alternatives considered

|                        | why not                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefab`               | Unity baggage — there, a serialized scene object **with code**. And **tosijs-3d already exports `prefab`** for something else entirely: a registered `(ctx) => Element[]` factory for wrecks, debris and spawns (`definePrefab`/`spawnPrefab`). Our root term is `ensemble`; `prefab` is Unity's word for the neighbouring idea, and upstream's is a third thing again |
| `assembly`             | primes WebAssembly on npm; ".NET assembly" pulls the same way                                                                                                                                                                                                                                                                                                          |
| `schematic`            | closest conceptual fit (components + connections, and Minecraft made it legible) but **tosijs-3d already uses "schematic"** in `MinSimApi` — an in-ecosystem collision is worse than an external one                                                                                                                                                                   |
| `blueprint`            | collides with tosijs's own blueprint concept                                                                                                                                                                                                                                                                                                                           |
| `site` / `emplacement` | both imply PLACEMENT, which is precisely what open question 4 says the format must not — an ensemble is what a thing IS, an encounter is where it is                                                                                                                                                                                                                   |
| `rig`                  | "rigging" already means a skeleton in 3D, and `rig` is one of our own `kind` values                                                                                                                                                                                                                                                                                    |
| `composition`          | vague                                                                                                                                                                                                                                                                                                                                                                  |
| `fixture`              | test connotation                                                                                                                                                                                                                                                                                                                                                       |
| `construct`            | overloaded                                                                                                                                                                                                                                                                                                                                                             |
| `set-piece`            | theatrical (right idea) but hyphenated and awkward in code                                                                                                                                                                                                                                                                                                             |
| `kit`                  | implies the parts, not the arrangement                                                                                                                                                                                                                                                                                                                                 |
| `assemblage`           | precise, and fussy to type and to say                                                                                                                                                                                                                                                                                                                                  |

The rest of this document uses **ensemble**.

---

## An ensemble is not for anything in particular

**The format has no domain, and must not acquire one.** This document was
written from a fortification brief, so an early implementation shipped the
fortification vocabulary as built-ins: `power`/`shield`/`critical` roles, a
`destroyable` feature, and a shield-reachability rule inside `validate` itself.
That quietly turned a scene format into a combat format.

Owner: _"This thing shouldn't be assuming combat use. Just being able to
describe an ensemble and consume it anywhere is a huge win. E.g. the standard
demo scene in tosijs-3d could easily be an ensemble (sun, shadow system, ground
plane, camera setup, etc.) and it can be embedded with a single line of code."_

And the goal that follows: _"almost any tosijs-3d setup would be very easy to
understand because it would just be loading some ensembles and then maybe wiring
in special case stuff unique to that scene, versus tediously building out
boilerplate for everything and making it hard to see what makes this setup
special."_

So the split is:

|                      |                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **the format**       | ids, references, positions, features, links — no domain                                               |
| **scene features**   | sun, sky, ground, terrain, water, clouds, ambient, fog                                                |
| **`presets/combat`** | destroyable, turret, launcher, protector, blip, the roles, and the one rule about unreachable shields |

Three consequences worth stating, because each was a mistake first:

1. **`destroyable` is a DECORATOR, not how things exist.** Most of an ensemble
   can never be shot. The first instantiator placed every piece through
   `b3d-destroyable` with `armor: 100_000` to mean "scenery", which buys
   "cannot be killed" by making everything a combatant — and terrain that
   accumulates damage and vanishes at 100 000 is a genuinely bad outcome, not a
   harmless default. A plain piece is now instantiated straight off the library
   as a node: no element, no combat record, nothing to damage.
2. **Destroyable routes through collision, defaulting to on.** If you cannot hit
   a thing you cannot destroy it, so "destroyable but not collidable" is almost
   always an authoring mistake. `collidable: false` opts out for the case that
   wants it — a field you shoot through that still dies with its generator.
3. **Roles ship empty and validation ships domainless.** A role is a domain's
   vocabulary; a rule like "a field with no incoming link is unsolvable" is a
   domain's rule. Both are registered — `registerRole`, `registerCheck` — so a
   botanical garden never sees `shield` in a role picker.

The tree-shaking test enforces the boundary in both directions: a scene-only
import carries no combat vocabulary, and the combat preset demonstrably does.

---

## Part 1 — the ensemble format

Plain JSON. **No functions, no code, no engine types.** Everything must survive
a round trip through a file, a fetch, a text editor and a generator. This is
non-negotiable: the format has to be authorable by hand, by the editor, and by a
mission compiler.

```jsonc
{
  "name": "ocean-rig",
  "kind": "rig", // free-form; consumers group by it
  "scale": 2.5, // multiplies every offset and piece scale
  "values": { "targetValue": 3, "faction": "hostile" },
  "pieces": [
    /* … */
  ],
  "links": [
    /* … */
  ],
  "points": [
    /* … */
  ],
  "zones": [
    /* … */
  ]
}
```

### Pieces

```jsonc
{
  "id": "rig", // stable handle; defaults to `${mesh}#${i}`
  "mesh": "Pump Station", // PUBLIC library name
  "at": [0, 0, 0], // ensemble-local metres
  "rot": [0, 0, 0], // euler degrees, optional
  "scale": 1, // multiplies the ensemble scale
  "role": "structure", // preset (see below)
  "features": {
    /* … */
  }, // explicit capabilities; override the preset
  "subsystems": [
    // named parts INSIDE a composite mesh
    {
      "match": "Pump$",
      "label": "pump",
      "features": { "destroyable": { "hp": 18 } }
    }
  ],
  "points": [],
  "zones": [],
  "values": {}
}
```

Positions are **ensemble-local**, so the same ensemble works at sea level or on
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
2. **Features can interact.** "A radar improves nearby turrets" is a rule _about
   features_ and has nowhere to live if every capability is its own object. It
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
"links":  [{ "from": "reactor", "to": "projector", "kind": "power",
             "values": { "delay": 0.4, "beam": true } }],
"points": [{ "id": "pad", "at": [0,6,8], "kind": "spawn", "facing": [0,180,0],
             "meta": { "craft": "Light Fighter" } }],
"zones":  [{ "id": "cap", "at": [0,40,0], "radius": 70, "kind": "escort",
             "values": { "capacity": 3 } }]
```

> **Everything domain-specific rides in `kind` and `values`.** An earlier version
> of this format named those fields directly — `hp` on a subsystem, `amount` and
> `beam` on a link, `targetValue` and `faction` in values — and closed the point
> and zone `kind`s into unions that included `muzzle` and `escort`. That is a
> fortification brief wearing the costume of a data structure, and it made a
> consumer's own vocabulary a TYPE ERROR.
>
> The core now says only that a relationship exists, that a volume is here with
> this radius, and what each is called. `src/format/domain-free.test.ts` pins it
> with a botanic garden: benches, irrigation, a quiet area and a wifi zone, and
> not one combat field anywhere.

- **Links** are directed relationships: A → B, of some `kind`. What the kind
  MEANS belongs to the consuming domain — a combat game reads `power` as
  "destroying A destroys B" and renders it as a conduit; a building reads
  `feeds` as plumbing. One declaration, two consequences, nothing to keep in
  sync — but the consequences are the domain's, not the format's.
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

`validate(ensemble, knownMeshes?) → Problem[]` — returns problems, never throws
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
ensembleEditor({
  libraries: [{ url: "/enemies.glb", type: "enemies" }],
  schema: MANTA_SCHEMA, // see Part 3
  scenarios: MANTA_SCENARIOS, // see Part 4
  onSave: async (ensemble) => {
    /* consumer owns persistence */
  },
  load: async (name) => {
    /* consumer owns loading */
  },
});
```

### Required affordances

|                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Library palette**          | every mesh the loaded libraries expose, by public name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Select**                   | click in viewport _or_ list; picking walks UP to the owning piece, so clicking a turret barrel selects the turret                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Manipulate**               | **fused with Select** — one tool, and which transforms it offers is a setting rather than a mode. A universal widget in Cheetah 3D's sense: shafts for one axis, pads for two, rings to turn, cubes to scale (the secondary button scaling the _other_ two axes), all on screen together, with the grip you grab saying what the drag means. Writes back to the JSON **on drag release** (not per frame) in ensemble-local coordinates. All three transforms default OFF, so the default tool is a plain selector with nothing drawn over what you are pointing at |
| **Bounding box + wireframe** | toggles; wireframe is how you read a fortress's interior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Placement**                | `land` (ground at 0) and `aquatic` (water at 0, seabed at a variable depth). Both planes **pinned to the origin** — a bench looks at one thing from many angles, so the world holds still and the camera moves                                                                                                                                                                                                                                                                                                                                                     |
| **Camera**                   | fit-to-bounds (re-fitting as async models load), named angles, and **orthographic as a toggle independent of angle** — ortho for judging alignment, perspective for judging how it reads                                                                                                                                                                                                                                                                                                                                                                           |
| **Animation**                | play / pause / scrub / speed. Library animation groups arrive **stopped**; an editor that does not start them hides what it exists to show                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Shadows**                  | the ground receives; ensemble pieces cast. Runtime-added meshes must be registered as casters continuously, not once                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Validation**               | live, non-blocking, visible                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Persistence**              | load, save, import file, export file. The component owns none of it — it calls the consumer's handlers                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### Explicitly out of scope for v1

Undo/redo, multi-select, snapping/alignment guides, terrain painting, nested
ensembles. All defensible later; none required to be useful.

---

## Part 3 — the schema system (the part that makes it reusable)

This is what stops the editor being Manta-shaped. The editor must not know what
`destroyable` means; it must know how to **render an editor for it from a
description**.

### Schemas are JSON Schema, via tosijs-schema

Owner: _"We should leverage tosijs-schema to define the schemas as json-schema
extending to tjs predicates when the time comes."_

`tosijs-schema`'s premise is exactly the one this needs — **JSON Schema →
types + validation, single source of truth** (as opposed to Zod's
TypeScript-first direction). Three consequences, all of which this project
wants:

1. **One artifact does four jobs.** The same schema types the format, validates
   a loaded file, drives the editor's property panel, and describes the format
   to an LLM writing a mission generator. Hand-written field descriptors would
   have to be kept in sync with hand-written types and hand-written validation —
   three chances to drift.
2. **The format is describable to tools that are not ours.** An ensemble is
   content, and content gets generated. JSON Schema is what a generator, a
   linter or a language server already speaks.
3. **`tjs` predicates extend it later without a rewrite.** Constraints that JSON
   Schema cannot express — "a `shield` piece must have an incoming link", "a
   `ref` must point at a piece that exists in THIS ensemble" — become predicates
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
    "range": {
      "type": "number",
      "minimum": 20,
      "maximum": 2000,
      "default": 260,
      "x-unit": "m"
    },
    "fireRate": {
      "type": "number",
      "minimum": 0.1,
      "maximum": 20,
      "default": 1.1,
      "x-unit": "/s"
    },
    "smart": {
      "type": "boolean",
      "default": false,
      "description": "leads its target instead of firing where you are"
    }
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
      label: "Destroyable",
      fields: {
        hp: { type: "number", min: 1, max: 9999, default: 12 },
        armor: { type: "number", min: 0, max: 100000, default: 0 },
        explode: { type: "boolean", default: true },
      },
    },
    turret: {
      label: "Turret",
      fields: {
        range: { type: "number", min: 20, max: 2000, default: 260, unit: "m" },
        fireRate: {
          type: "number",
          min: 0.1,
          max: 20,
          default: 1.1,
          unit: "/s",
        },
        damage: { type: "number", min: 1, max: 200, default: 4 },
        smart: {
          type: "boolean",
          default: false,
          help: "leads its target instead of firing where you are",
        },
      },
    },
    launchpad: {
      label: "Launch pad",
      fields: {
        craft: { type: "mesh", library: "enemies" }, // pick list from library
        interval: { type: "number", min: 1, max: 300, unit: "s" },
      },
    },
    protector: {
      label: "Shield field",
      fields: {
        protection: { type: "number", min: 0, max: 200, default: 12 },
        source: { type: "ref", roles: ["power", "generator"] }, // ref to a PIECE
      },
    },
  },

  roles: {
    power: {
      label: "Power source",
      features: { destroyable: { hp: 16 }, blip: {} },
    },
    // …consumer-defined
  },

  zones: {
    escort: { label: "Escort zone", fields: { capacity: { type: "number" } } },
  },
  points: { spawn: { label: "Spawn", fields: { craft: { type: "mesh" } } } },
};
```

### Field types the editor must support

| `x-widget`       | renders as                                | notes                             |
| ---------------- | ----------------------------------------- | --------------------------------- |
| `number`         | numeric field / slider                    | `min`, `max`, `step`, `unit`      |
| `boolean`        | toggle                                    |                                   |
| `string`         | text field                                |                                   |
| `enum`           | pick list                                 | `options: [{value,label}]`        |
| `mesh`           | pick list of library meshes               | scoped by `library`               |
| `ref`            | pick list of **pieces in this ensemble**  | filtered by `roles` or `features` |
| `point` / `zone` | pick list of this ensemble's points/zones | for "launch from here"            |
| `vec3`           | three numeric fields                      | positions, rotations              |
| `color`          | colour input                              |                                   |

`ref`, `point` and `zone` are the ones that make this more than a property grid:
they are how an ensemble expresses **internal relationships** — this shield is
fed by that reactor, this launchpad emits at that point — without the author
typing ids.

### The feature registry — open for extension

Owner: _"it's going to depend on tosijs-3d no matter what and a consumer should
be able to bind properties to locally defined behaviors."_

This corrects an earlier draft that said the binding "is not a consumer
concern." It plainly is. Manta already has features tosijs-3d will never know
about: escort **zones** that AI reads, spline **energy conduits** that also mean
"this powers that", **charred wrecks** that char and burn instead of vanishing.
A closed feature set would mean those either get pushed upstream where they do
not belong, or the editor cannot author them.

So a feature is a **registration**, not a case in a switch:

```javascript
registerFeature({
  name: "turret",
  schema: turretSchema, // JSON Schema (+ x- UI annotations)
  bind(piece, cfg, ctx) {
    // JSON -> live behaviour
    const t = b3dTurret({
      ...cfg,
      x: piece.at.x,
      y: piece.at.y,
      z: piece.at.z,
    });
    ctx.scene.appendChild(t);
    ctx.onDispose(() => t.remove());
    return {
      /* optional handle for other features / scenarios */
    };
  },
});
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

|                                         |                                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `name`                                  | the key in `features`                                                                                  |
| `schema`                                | JSON Schema; drives both validation and the property panel                                             |
| `bind(piece, cfg, ctx)`                 | attach behaviour; return an optional handle                                                            |
| `ctx.scene`                             | the scene element, for appending components                                                            |
| `ctx.onDispose`                         | teardown, so rebuilding an ensemble in the editor leaks nothing                                        |
| `ctx.piecesByRole()` / `ctx.handle(id)` | reach other pieces — how `radar` boosts nearby `turret`s, and how a `protector` finds its power source |
| `ctx.simTime`                           | the time source, so effects honour pause and time scale                                                |

`ctx.handle(id)` is the important one: it is what lets features **interact**
without knowing about each other's implementations, which is the property that
made "a radar improves nearby turrets" expressible at all.

> ⚠️ **`bind` must be TWO PHASES, or `ctx.handle(id)` is a race against array
> order.** A `protector` that resolves its power source during `bind` works only
> if the reactor happened to bind first — so the same ensemble behaves
> differently depending on the order pieces appear in the file, and reordering in
> the editor silently changes behaviour. That is a nasty class of bug: it looks
> like an intermittent content problem, not a lifecycle one.
>
> Split it: **`bind`** creates and returns a handle, touching nothing else;
> **`link(handle, ctx)`** runs after every piece has bound, and is the only place
> `ctx.handle`, `ctx.piecesByRole` and zone lookups are legal. Same shape as the
> scene-listener contract in tosijs-3d, and for the same reason — a thing that
> reaches for its neighbours cannot run while the neighbours are still arriving.

> **Rebuilding must be idempotent.** The editor rebuilds an ensemble on every
> edit, so `bind`/`link`/`onDispose` runs hundreds of times per session where a
> game runs it once. `onDispose` is necessary and not sufficient: the test worth
> writing is _build → dispose → build_, asserting the scene's mesh, observer and
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
ensemble is a puzzle; a static render tells you nothing about whether it is
solvable or fair.

Consumer-supplied:

```javascript
const MANTA_SCENARIOS = {
  "escort — 3 idle fighters": (ctx) =>
    ctx.spawn("Light Fighter", 3, { radius: 320 }),
  "kill the reactor": (ctx) => ctx.damageRole("power", 9999),
  "player pass at 200m": (ctx) => ctx.flyby({ speed: 25, offset: 200 }),
};
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
- **the water mesh is `water_nocast`**, not `water`; libraries expose _public_
  names (`Drone`, not `Drone_collideBox.model`) — **list what is there rather
  than guessing names**
- **an editor must render content at the game's scale**, or it teaches you the
  wrong thing about your own data

## Part 6 — authoring beyond one-piece-at-a-time

Sketched with the owner while the SVG UI backlog lands upstream. Nothing here is
built. It is here so the format decisions each one implies get made once, and
early, rather than four times under deadline — and because three of the four
turn out to need the SAME two things.

**What they share.** Every item below is a _rule that produces pieces_ rather
than a piece: a rectangle that becomes tiles, a light that carries geometry, a
station whose position is relative to a formation, a base that reshapes ground
before it sits on it. Two consequences, and they are the whole design:

1. **Generators are pieces that expand.** An ensemble stays flat JSON a game
   loads; a generator is a piece the LOADER expands into pieces, the way nested
   ensembles flatten. That keeps the runtime unchanged and the output
   inspectable — you can always ask what a generator produced, and hand-edit it.
2. **Their inputs are annotations on LIBRARIES, not code.** A kit author knows
   which meshes are road-straight, road-corner and road-tee; the editor cannot
   guess it and should not try. That is `extras` in the glb (tosijs-3d#45), read
   as a catalogue.

### Procedural tile sets — roads, rooms, plateaus, water

> **Owner:** _"the ability to define procedural tile sets such as roads, terrain
> plateaus, and rooms… drag out a rectangle on a grid and have it turn into
> tiled water or rooms or terrain."_

The affordance is a rectangle drag. The content behind it is a **tile set**: a
named group of meshes with the roles a tiler needs — for a road, `straight`,
`corner`, `tee`, `cross`, `end`; for a room, `floor`, `wall`, `corner`,
`door`; for water, one tile and a rule about edges.

Three things this needs, in order of how expensive they are to get wrong:

- **A vocabulary of tile ROLES per set type**, declared by the kit author in the
  library's `extras`. Kenney's kits already group and name consistently enough
  to annotate; nothing else has to change.
- **Neighbour rules**, because a tiler picks a mesh from what is adjacent. The
  cheap version is a 4-bit mask (which sides connect) and a lookup; the
  expensive one is wave-function collapse. Ship the mask.
- **A generator piece**: `{kind: 'tiles', set: 'city/road', area: [...], grid: 4}`,
  expanded at load. The area is authored; the tiles are derived and never
  hand-edited, which is what makes re-running it safe.

The trap to avoid: **do not invent a tile taxonomy in this repo**. It belongs to
whoever packs the kit, and a taxonomy invented here would be wrong for the first
kit that did not fit it.

### Placeable lights, and primitives that carry geometry

> **Owner:** _"primitives we want to have from tosijs-3d such as placeable lights
> with default geometry (that can have meshes attached)."_

A light is a piece with no mesh today: the `light` feature IS its body. What is
missing is that a light in an editor needs to be **visible and grabbable when it
is not selected** — you cannot arrange what you cannot see — and in a game it
often wants a fixture: a lamp housing, a bulb, a sconce.

So the shape is: a primitive whose default body is editor-only geometry, and
which accepts a `mesh` that replaces it. That is a small extension of what
`place-mesh` already does, and it generalises past lights to cameras, spawns and
speakers — every primitive an author has to place and cannot otherwise see.

**Upstream, not here:** the default geometry belongs in tosijs-3d beside the
elements it represents, or every consumer draws its own lamp.

### Points and zones with consumer-defined types

> **Owner:** _"labeled points and zones with types and names… you might want to
> create a Carrier group formation and place locations where picket ships and
> combat air patrols should hang out relative to the formation."_

**The format is already right for this**, which is worth saying because it was
not obvious when `kind` was made a free string rather than a union:

```json
{
  "id": "picket-north",
  "at": [0, 0, 900],
  "kind": "station",
  "meta": { "label": "Picket N", "role": "picket" }
}
```

`Point.kind`, `Zone.kind`, `meta` and `Zone.values` are all open. A carrier
group is an ensemble whose pieces are ships and whose POINTS are stations —
and because a point declared inside a piece is local to that piece, a station
follows the ship it hangs off without any extra machinery.

What is missing is entirely editor-side, and it is two things:

- **A UI**: place a point, name it, pick a type, see it. Points and zones are
  currently invisible in the editor — the one part of the format with no
  affordance at all.
- **A consumer-supplied vocabulary.** The editor must offer the HOST's types
  (`station`, `cap`, `picket`) without knowing them, which is the same
  registry pattern as features and roles: `registerPointKind`, or a list on the
  component. It must stay a suggestion, never a constraint — the moment the
  editor rejects an unknown kind, the format's openness is gone.

### Provinces: authoring onto terrain, and reshaping it

> **Owner:** _"author things that get placed on terrain such as provinces with
> associated carve outs… a base that can be dropped onto terrain, sculpts the
> terrain locally to suit its purposes and then places meshes on it."_

The hardest of the four and the most valuable, because it is the one that makes
an ensemble a thing you drop onto a world rather than a thing that owns its
world.

A province is: an **area**, a **terrain modification** inside it, and **pieces
placed relative to the result**. A base flattens its footprint, cuts a ramp, and
puts its buildings on the flattened ground — so the buildings' heights are
derived, not authored.

Three decisions to make before any of it is built:

1. **What a carve-out is, as data.** A height response curve over the area is
   the general answer, and the owner is adding a **curves editor upstream** so
   the curve is authorable rather than typed as numbers.

   > **Owner: _"an authorable curve turns four features into lemmas of one
   > killer feature."_** — and that decides the data. Flatten, plateau, ramp and
   > crater are **not four carve types**; they are one curve with four shapes.
   >
   > So the format stores the CURVE, and the preset names live in the editor as
   > a palette — never as a `carve: 'flatten' | 'plateau' | ...` enum. This is
   > the same call already made for `Point.kind`, `Zone.kind` and roles, and for
   > the same reason: the first province that wants a shape not on the list
   > would otherwise be a type error rather than a curve someone drew. A closed
   > list of four is a closed list.
   >
   > It also means the editor's terrain work is ONE tool with a curve widget,
   > not four tools, which is the difference between a week and a quarter.

   > **SHIPPED UPSTREAM in tosijs-3d 0.7.4** as `curve3d` + `footprint3d`, and
   > the model grew a third part in the process. A province is a **footprint**
   > plus **one curve per layer**:
   >
   > | part                    | maps                    | the natural setting                               |
   > | ----------------------- | ----------------------- | ------------------------------------------------- |
   > | **footprint**           | direction → extent      | a polygon; `ngon(6)`, a 16-gon for a circle       |
   > | **shape** (map/profile) | height sample → height  | a line going **up** — identity, terrain unchanged |
   > | **falloff**             | 0 at centre → 1 at edge | a slope **down** from 1 to 0                      |
   >
   > Three constraints upstream chose, each of which is a bug it declines to
   > have:
   >
   > - **The range is closed.** A curve maps `[0,1]` to `[0,1]` and a drag
   >   clamps rather than stretching the range, because a profile returning 1.4
   >   silently changes the height a province occupies — it fails as _geometry_
   >   while reporting nothing. Amplitude belongs to the block, shape to the
   >   curve.
   > - **A falloff is pinned to 0 at its edge; a profile is not.** A province
   >   still carrying weight at its boundary does not blend. Pinned at the edge,
   >   free in the middle — a crater rim and a volcano cone are non-monotonic.
   > - **A footprint is a polygon, not a sampled curve.** `polygonExtent` casts
   >   a real ray at the straight edge; interpolating radius against angle bows
   >   every edge inward. Vertices cannot pass their neighbours or reach the
   >   centre, which keeps it star-shaped — the property that makes "extent in
   >   this direction" have an answer at all.
   >
   > `blendSample` composes provinces convexly, so a tile's bounds are known
   > before anything is evaluated however many overlap — which is what makes
   > dropping two bases near each other safe.
   >
   > **Still to come upstream:** carving and terrain-shader biasing under the
   > same province, so a volcano profile can drive up vulcanism in the middle.
   > That is the part that makes a province more than a height edit — it becomes
   > the place where "what this ground IS" is authored, not just its shape.
   >
   > For this repo the consequence is unchanged and now cheap: a province piece
   > carries a footprint and two curves as DATA, and the editor's job is to hand
   > them to widgets that already exist rather than to invent a carve vocabulary.

2. **When it is applied.** At load, into the terrain the ensemble is dropped on
   — which means an ensemble can no longer assume it owns the terrain, and needs
   a way to say "modify what is here" rather than "create this".
3. **What pieces resolve against.** A piece at `y: 0` in a province means "on
   the ground", and the ground is only known after the carve. That is a third
   phase after bind and link, and it is the reason to decide this early: the
   two-phase build is load-bearing and a third phase changes its contract.

## Open questions — with recommendations

Answered rather than left hanging, since each affects the format and the format
is what goes upstream first.

### 1. Nested ensembles — **not in v1, but do not foreclose them**

A fortress made of rigs is obviously desirable and is a large jump: transform
composition, id namespacing, cyclic-reference detection, and an editing story
for "edit this instance vs. edit the definition" that Unity has never made
comfortable.

**Recommendation:** ship flat, but reserve the shape. Allow a piece to carry
`"ensemble": "ocean-rig"` instead of `"mesh"`, and have v1 loaders **flatten it
at load time** — splice the child's pieces in with prefixed ids and composed
transforms. That gets composition for authoring and generation with none of the
runtime complexity, and leaves room to make instances live later. Ids must be
namespaced from the start (`rig-a/pump`) or nothing later can reference into a
nested ensemble.

> **Owner: _"I assume ensembles are recursive — so you can assemble an ensemble
> out of ensembles etc."_** Yes, and the name makes it read correctly: a troupe
> of troupes. Recursion is the intended end state; **flattening at load is how
> v1 delivers it without live instances**, not a substitute for it.
>
> What flattening does and does not buy, stated plainly so nobody is surprised:
>
> - **Edits to a child DO propagate.** Flattening happens at LOAD, not at author
>   time, so every load re-reads `ocean-rig.json`. Fix the rig and every fortress
>   containing one is fixed. This is the property people expect from nesting and
>   assume they are giving up.
> - **What you give up is per-instance override and live identity** — "this
>   fortress's rig, but with the pump moved" and "highlight instance 3". Both are
>   real, both are v2, and neither is needed to make composition useful.
>
> Five things the loader must get right, all of which are cheap now and
> expensive later:
>
> 1. **Namespace the child's ids on splice** (`rig-a/pump`), and **rewrite the
>    child's OWN internal refs and links to match**. This is the trap: a child's
>    `link` from `reactor` to `projector` must become `rig-a/reactor` →
>    `rig-a/projector`. Miss it and the link either dangles or — far worse —
>    resolves against a same-named piece in the PARENT, wiring one troupe's
>    reactor to another's shield. That is a bug that looks like a design mistake.
> 2. **Detect cycles.** A contains B contains A is a hang at load, in a tool
>    where authors will absolutely try it. Track the chain and report it as a
>    validation error naming the loop, not a stack overflow.
> 3. **Cap depth**, for the same reason, and because a deep tree flattens into a
>    surprising number of pieces.
> 4. **Compose transforms in the documented order** — child `at`/`rot`/`scale`
>    under the parent piece's, with the parent's `scale` multiplying through.
>    Write a test with a non-trivial rotation AND offset AND scale together;
>    each pair works under several wrong orders and only the triple discriminates.
> 5. **Resolve `ref`s after the whole tree is flat**, for the same reason `bind`
>    must be two-phase: a ref that resolves mid-splice sees half a world.
>
> And it lands on the `encounter` layer (open question 4): once ensembles nest,
> "which piece is the objective" is necessarily a PATH (`rig-a/pump`), not a
> bare id. That is another reason to namespace from day one — the encounter
> format inherits whatever identity scheme this one ships with.

#### Nesting is a BLACK BOX, and that decides the coordinate systems

> **Owner: _"The ensemble however can be a 'black box' inside a scene, and to do
> stuff internal to it you would switch context (drill into it) and then pop back
> out."_** — and, following from it, _"you're always scaling in the object's
> coordinate system and rotating and translating in global space."_

A nested ensemble is opaque from outside. You move, turn and scale it as one
piece; to touch what is inside you **drill in**, and everything is then relative
to that ensemble's frame until you **pop out**. You never see two levels at
once.

That collapses a question the editor was about to grow a control for. Three
coordinate systems are conventional — global, parent, local — and **parent is
identical to global here**, because the only parent you can ever be looking at
is the ensemble you have drilled into. So there is nothing to choose between,
and the frames are fixed by what each operation can actually express:

|           | frame                | why it is not a preference                                                                  |
| --------- | -------------------- | ------------------------------------------------------------------------------------------- |
| translate | global               | `at` is a position in the current ensemble's space                                          |
| rotate    | global               | `rot` is euler in the same space                                                            |
| scale     | **the object's own** | `node.scaling` is local; non-uniform world scale needs shear, which a transform cannot hold |

So the editor ships **no orientation picker**. It also explains why `scale` is
its own mode rather than a toggle alongside the other two: it is permanently in
a different frame, and a widget cannot honestly draw both at once.

**What this costs today:** rotation was doing neither. `rot[i] += delta` is an
edit in EULER space, which coincides with a global rotation only while the piece
has no prior rotation — so turning an already-turned piece went somewhere
nobody asked for. Global rotation is a composition, not an addition.

**What drill-in needs when nesting lands:** a context stack (which ensemble am I
editing, and how do I get back), and ids that are already paths — which is why
namespacing from day one is in the list above.

**A picker stays cheap to add later, and one detail is why.** Rotation ended up
in the object's own frame after all (see the git log — the table above records
the earlier answer), so the widget already draws two frames at once: arrows
world-aligned, arcs riding the piece. That only reads because the arrow is
BROKEN between 0.6 and 0.8 and the arc occupies exactly that band, so the two
cannot collide whatever their relative orientation.

That separation is frame-agnostic rather than a fix for the current pairing. If
a picker lands and puts translation in the piece's frame too, the axes still
work and the widget needs no geometry changes — owner: _"later we can maybe
force local coordinate system if the user wants and the axes will still work"_.
The cost of keeping the option open is one gap in a shaft, which is why
`handles-view.ts` marks it load-bearing.

### 2. Terrain and environment — **revised: primitives you can author with**

The original answer here was "a different thing; give them join points": an
ensemble sits _on_ a world, a bridge _is_ the world, and making terrain an
ensemble would drag streaming, LOD and collision meshes into a format whose
whole virtue is being small JSON.

**The owner reversed it, and the reversal is right:**

> _"being able to author using terrain meshes and medium layers / water /
> clouds / ambient etc as primitives is hugely useful. E.g. just being able to
> edit a province using a sample terrain and being able to drag it around to see
> how it interacts would be amazing. This would allow you ultimately to do
> things like build a province that changes a landform and sticks a procedural
> city or other tilemap into a location on an arbitrary underlying terrain."_

Two distinct things are named there, and keeping them apart is what makes this
cheap rather than the LOD-and-streaming swamp the original answer feared.

**1. The backdrop — authoring CONTEXT, never saved.** A sample terrain, a sea,
a sky, the ambient conditions. It exists so the thing being authored can be
judged against something, and so the ensemble can be dragged over it to see how
the two interact. It is an editor affordance (`backdrop` on
`<tosi-ensemble-editor>`), it generalizes the land/aquatic placement modes the
plan already had, and it never reaches the file.

**2. Environment primitives — CONTENT, and they are already expressible.** A
province that _changes_ a landform carries that landform. This needs **no format
change at all**, which is the argument for it: `features` was always an open map
bound by registrations, so an environment primitive is simply a piece whose
feature IS its body, with no library mesh to instantiate.

```jsonc
{ "id": "seabed", "at": [0, -140, 0], "features": { "terrain": { "biome": "ocean", "seed": 4 } } },
{ "id": "sea",    "at": [0, 0, 0],    "features": { "water": { "waterSize": 4000 } } },
{ "id": "haze",   "at": [0, 0, 0],    "features": { "fog": { "density": 0.002 } } }
```

`terrain`, `water`, `clouds`, `ambient` and `fog` ship as built-in
registrations wrapping the tosijs-3d elements of the same name. The only rule
this added to the format: a piece with no `mesh` is legal when it has features,
and `validate` reports a piece with neither as `empty-piece`.

**What stays out of scope for v1**, and now for a sharper reason than "terrain
is different": a **generator** primitive — "stick a procedural city or tilemap
at this location" — is a piece whose feature EMITS other pieces. That is
nested ensembles with a computed child, so it wants the same machinery open
question 1 defers (id namespacing, cycle detection, transform composition) and
should land on top of it rather than beside it. Bridges and tunnels still meet
the world at **points** (`kind: "entrance"`), which the original answer got
right.

### 3. Multiplayer / authority — **out of scope, but the format is already safe**

Nothing here needs to change. Plain JSON with **stable, author-assigned ids** is
exactly what a networked authority needs to refer to "that pump on that rig"
without transmitting geometry. The risk to avoid is _derived_ ids — if a piece's
identity depends on its array index, every insertion renumbers the world.

**Recommendation:** make `id` mandatory in v1 rather than defaulting to
`${mesh}#${index}` as the prototype does. The default is convenient and is the
one decision here that would be genuinely expensive to reverse.

### 4. Missions consume ensembles — **via an encounter, not directly**

This is the one I feel most strongly about. A mission should not say "place
`ocean-rig` at (140, 2, 520)". It should say "there is a rig here, it is
hostile, it is worth 3, and its pump is the objective".

**Recommendation:** an **encounter** layer that references an ensemble by name
and overlays situation-specific data — position, faction, `values`, difficulty
scaling, which pieces are objectives, which zones are active. Three reasons:

- **Ensembles stay reusable.** The same rig appears in six missions at six
  difficulties without six near-identical files.
- **The generator gets a small surface.** An LLM composing missions picks
  ensembles and sets values; it does not author geometry, which is the part it
  would get subtly wrong.
- **It is where Ariosto binds.** Mission facts ("the refinery was destroyed
  before the treaty") attach to the encounter, not to the ensemble — the
  ensemble is a _kind of place_, the encounter is _this place, in this story_.

Concretely: `ensemble` = what a thing IS, `encounter` = what it is DOING HERE.
That line also settles Part 1's `values`: `targetValue` and `faction` are
encounter-level, and their presence on an ensemble is a **default**, overridable
per encounter.

### 5. Which UI stack — **the decision this document was making implicitly**

Owner, mid-review: _"It could make sense as a tosijs-3d project if it leveraged
our svg ui work (which would allow scene editing in VR...)"_

PLAN.md currently says "use tosijs-ui widgets", which is a reasonable default and
also a **silent commitment to flat-only, browser-only editing**. It deserves to
be an argued decision, because the two options lead to different projects.

|                   | **A — tosijs-ui DOM widgets**                   | **B — tosijs-3d SVG UI**                              |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------- |
| where it can live | its own project (as planned)                    | plausibly **inside tosijs-3d**                        |
| where it runs     | a browser page                                  | a browser page **and a headset**                      |
| forms             | mature: `tosiForm`, `data-table`, `code-editor` | `widgets3d` + `box`/`surface`/`table`; no code editor |
| text entry        | the OS keyboard                                 | `keyboard.ts` (built for exactly this)                |
| file I/O          | native dialogs                                  | **unsolved in a session**                             |
| gizmos            | Babylon `GizmoManager` (mouse-shaped)           | **does not exist yet, either flat or in XR**          |

**The case for B is stronger than "VR would be nice", and it is worth stating
plainly: editing a 3D arrangement is a spatial task performed at arm's length.**
Judging whether a fortress reads, whether a turret covers the approach, whether a
gap is flyable — those are the questions an ensemble editor exists to answer, and
they are exactly the questions a flat viewport answers badly. A tool for
arranging things in space that cannot be used _in_ that space is conceding its
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

#### The editor is the SVG UI's hardest customer, and that is a REASON

Owner: _"As a complex consumer of the SVG 3d ui system it would generate a lot
of battle testing that a game won't."_

This is the argument that settles it, and it runs the opposite way to the usual
one. Normally you ask what a dependency gives the project; here the project
gives something back that nothing else can.

A game's UI is a handful of panels: a HUD, a pause menu, a settings list. It
exercises the SVG UI shallowly and in one shape. **An editor is a dense forms
application** — property panels regenerated from schemas, long virtualised lists,
pick lists that filter on other fields, text entry, modal dialogs, tear-off
inspectors, and all of it rebuilt on every selection change. That is precisely
the load that finds the bugs a game never will: focus traversal across
regenerated widgets, pointer capture during a drag that crosses a panel, layout
under content that changes size, whether a control still works after its parent
has been rebuilt three hundred times.

tosijs-3d 0.7.0 is evidence for the claim. Its worst UI bugs were all found by a
human driving demos, and every one was a COMBINATION rather than a wrong value —
a close button whose hit region drifted from its glyph on portrait panels only, a
drag that died because two observers registered in an order that varied per
popup, a modal that blocked the camera along with the UI. Those took a person
looking. An editor would have hit all three in the first hour, because it uses
those affordances constantly rather than occasionally.

So the dependency is worth taking even where it is currently weaker than
tosijs-ui's DOM widgets: **the weakness is the point.** Forms are the SVG UI's
thinnest area, and the editor is what would justify and shape a form layer —
built once, in the right repo, by the consumer with the strongest opinion about
it.

#### Recommendation

**Build the editor's chrome on the SVG UI (B), and keep the project separate
anyway.**

Splitting the two questions is the point. "Which widgets" and "which repo" got
bundled together, and only the first one has a strong answer:

- **Widgets: B.** It buys the headset, it buys flat for free, and a tool that
  looks foreign to the thing it authors for is the failure PLAN.md already names.
- **Repo: still separate.** tosijs-3d is a _framework_; an editor is an
  application-shaped thing with file I/O, schema machinery and its own release
  cadence. Putting it inside would make every consumer's dependency tree carry an
  authoring tool, which is precisely the "a shipped game must not pay for
  authoring" argument this document already makes for the format/editor split.
  The SVG UI is exported; depending on it is enough.

#### Where the FORMAT lives — reopened, and the answer changed

This document's Part 1 puts the format and instantiator in tosijs-3d. The owner's
refinement: _"The 'ensemble' format could make sense as a core piece of tosijs-3d
OR it could be a lightweight and separable import from the editor library. Maybe
the latter makes more sense."_

The latter does make more sense, and the reason is release cadence rather than
layering. **A format is only finished when something has generated content with
it** — and the thing that will shake it out is the editor, not the framework. Put
it in tosijs-3d and every format revision is a tosijs-3d release, reviewed and
gated against a framework's compatibility promises, while the format is still
learning what it is. Put it in the editor package as a **separable entry point**
and it iterates at the speed of the tool discovering what it needs, then settles.

The property that mattered — _"the editor writes exactly what the runtime reads,
because it is the same code"_ — is preserved either way. It comes from **one
implementation with two importers**, not from which repo hosts it:

```jsonc
// a game: format + instantiator; the editor tree-shakes away
import { buildEnsemble, validate } from 'tosijs-3d-ensemble'

// an author: the whole tool, same package
import { ensembleEditor } from 'tosijs-3d-ensemble'
```

Conditions that make this honest rather than convenient, all of which are things
to check rather than assert:

- **A game's import must not reach the editor.** No SVG UI chrome, no property
  panel — a game importing `buildEnsemble` should get the format and the
  instantiator. Verified by `src/tree-shaking.test.ts`, which bundles exactly
  what a game imports and fails on any surviving editor module. A stray import
  is exactly how this rots, and a bundler will not warn you.
- **`exports` is a map, not the string form**, so subpaths stay available.
  tosijs-3d's is the string form, which is why its own headless surface is
  unreachable — see that repo's UPSTREAM notes. Got right on day one here.
- **The name is `tosijs-3d-ensemble`, one package.** A game depending on
  something called `-editor` to load a level reads as a mistake even when it
  isn't; naming the package for the FORMAT removes that, and the editor rides
  along as an export a bundler drops. Settled before anything published,
  because it is the kind of thing that never gets renamed afterwards.
- **Moving it INTO tosijs-3d later must stay cheap.** If the format proves stable
  and universal, promotion is the right end state. Keeping it dependency-free and
  separately entry-pointed is what keeps that door open.

If that is right, two consequences ripple back through PLAN.md: milestone 0's
scaffold targets the SVG UI rather than DOM widgets, and **a manipulator becomes
a milestone-2 upstream dependency rather than a milestone-3 lift** — because
`bench-gizmo.ts` binds `GizmoManager`, which will not survive the move.

The falsifiable version: **build the piece list and one property panel in the SVG
UI first, and try them in a headset before building anything else.** If forms in
`widgets3d` turn out to be the wrong shape, that is cheap to discover there and
expensive to discover in milestone 3.

## Suggested sequence

1. **`tosijs-3d-ensemble`, here** — format types (JSON Schema via
   tosijs-schema), `validate()`, `buildEnsemble()`, the feature registry. Manta
   switches to it and deletes its copies; that migration is the proof the API is
   right.
2. **`tosijs-3d-editor`** — depends on the above, on tosijs-3d's SVG UI, and on
   tosijs-ui's build/doc system. Lift the prototype's placement, framing and
   scenario harness; the **gizmo does not lift** — `bench-gizmo.ts` binds
   Babylon's mouse-shaped `GizmoManager`, which the SVG UI decision above
   supersedes.
3. **Manta deletes its bench** and depends on the editor.
4. **Encounter layer**, once there are enough ensembles for the distinction to
   bite.
