# tosijs-3d-editor — project plan

**A graphical editor for tosijs-3d assemblies.**

An *assembly* is a reusable, JSON-described arrangement of library meshes with
declared capabilities and relationships — a rig, a dome facility, a floating
fortress of shields, platforms, lift units, turrets and generators. No code, no
engine types: plain data a game loads, a tool authors, and a generator can emit.

**`SPEC.md` is the specification.** It is the primary document: format, editor
affordances, schema system, test scenarios, and four design questions answered
with recommendations. This file is the *plan* — what to build, in what order,
with what, and what "done" means at each step.

---

## Where this sits in the ecosystem

Three concerns, deliberately split (SPEC.md §"Where each piece lives"):

| | lives in | audience |
|---|---|---|
| assembly **format** (types, defaults, validation) | **tosijs-3d** (`b3d-assembly`) | every consumer shipping levels |
| assembly **instantiator** (JSON → scene) | **tosijs-3d** | every consumer shipping levels |
| the **editor** | **this project** | authors only |

The line, from the owner: *"The 'prefab' structure and the tool for instantiating
it belong in tosijs-3d, the editor is simply a tool for creating those
graphically."*

A shipped game carries the format and the loader and **no editor at all** — the
common case, and it must not pay for authoring. This project depends on
tosijs-3d for both, which means **the editor and the game call the same
instantiator**: "what you author is what you get" holds by construction rather
than by discipline.

### Dependencies

| | for |
|---|---|
| `tosijs-3d` | the scene; the assembly format + instantiator |
| `tosijs-ui` | widgets, layout, **and the build/doc system** |
| `tosijs-schema` | schemas as JSON Schema → types + validation; tjs predicates later |
| `tosijs` | state |

---

## Build it the ecosystem's way

This is a first-class tosijs project, not a side tool. Before substantive work,
read `../tosijs-coding-practices/README.md` (the index) and the practice doc for
the task at hand. `CLAUDE.md` records the non-negotiables; the ones that shape
this project most:

- **Use the tosijs-ui build and doc system.** Do not hand-roll a bundler, a dev
  server, or a docs page. The prototype's bench was raw HTML with a bespoke
  stylesheet and that was a mistake the owner caught: *"I'm a bit puzzled why you
  don't leverage the tosijs-ui build system and the actual tosijs-ui widget
  library instead of rolling everything by hand."* One UI surface across the
  ecosystem is a stated goal, and an authoring tool that looks foreign to the
  thing it authors for is a failure of that goal.
- **Which widget set is an OPEN DECISION — see SPEC.md open question 5.** This
  bullet used to say "use tosijs-ui widgets" flatly, which quietly committed the
  project to flat-only, browser-only editing. The alternative is tosijs-3d's SVG
  UI (`widgets3d`/`box`/`surface`/`table`/`keyboard`/`popup-surface`), which is
  one implementation that renders BOTH as a DOM overlay and as an in-scene
  texture — so it buys the headset without giving up the browser. Editing a 3D
  arrangement is a spatial task, and a tool for arranging things in space that
  cannot be used *in* that space is conceding its best affordance.
  Recommendation there: **SVG UI for the chrome, separate repo regardless.**
  Either way: if a widget is missing, that is an issue for its owner, not a
  licence to write one here.
- **Observant model, not reactive.** Read `practices/observant-model.md` first.
  DOM is static by default with pin-point updates; guessing React semantics here
  costs time.
- **tosijs for state**, not ad-hoc module globals. The prototype used plain
  mutable objects because it was a bench; a product should not.
- **Stay in your repo.** Gaps in tosijs-3d or tosijs-ui get **issues filed
  there**, not worked around here (`practices/cross-project.md`). The prototype
  accumulated eight upstream workarounds before that became visible as a
  pattern; the same instinct applies from day one.
- **Docs are a deliverable**, via the tosijs-ui doc system — an editor whose
  format is undocumented is a format nobody else can generate for.
- **Testing:** `practices/testing.md`. The format and validation are pure and
  should be unit-tested properly; the editor UI wants the browser-test lane.
- **Releasing:** `practices/releasing.md`, including "Bypassing the publish
  loop" — unpublished dependency tarballs live in `../local-packages/` with a
  `PROVENANCE.md` and a sha256, never in a session scratchpad.

---

## Milestones

### 0a — settle the UI question first (a day, not a milestone)

Before the scaffold hardens around a widget set, build the **piece list and one
property panel** in tosijs-3d's SVG UI and **try them in a headset**. That is the
cheapest possible test of open question 5, and it probes the SVG UI's weakest
area: it has label/slider/toggle/select/button/list, but no FORM layer, and a
schema-driven property panel is a form generator.

**Done when:** you can select a piece from a list and change one number, in VR.
If that feels wrong, question 5 answers itself and the scaffold goes to
tosijs-ui with nothing lost. Discovering it in milestone 3 costs the panel twice.

### 0 — scaffold

- `bun init`, tosijs-ui build/dev/doc system wired, TypeScript strict.
- Depend on `tosijs-3d`, `tosijs-ui`, `tosijs-schema`, `tosijs`.
- A page that mounts a `<tosi-b3d>` scene with a library loaded and an orbit
  camera. Nothing else.
- **Done when:** `bun start` serves it, `bun run build` produces a bundle, and
  the doc system builds a page.

### 1 — the format + registry, upstream

The format is tosijs-3d's, so this milestone is mostly a **proposal plus a
migration**. Coordinate with tosijs-3d rather than forking.

- JSON Schema for `assembly`, `piece`, `feature`, `link`, `point`, `zone` via
  tosijs-schema — types and validation from one source (SPEC.md §Part 3).
- `validate()` returning problems, never throwing.
- `buildAssembly(data, origin)` / `loadAssembly(url, origin)`.
- **`registerFeature({ name, schema, bind })`** — open for extension, with
  tosijs-3d shipping registrations for its own components. A consumer's feature
  must be indistinguishable from a built-in in the format, the editor and the
  file.
- **`id` is mandatory** — not defaulted from array index (SPEC.md open question
  3; derived ids mean every insertion renumbers the world).
- **Done when:** `../manta-recon` deletes `src/prefab.ts` and
  `src/prefab-runtime.ts` and loads its four assemblies through the upstream API
  with no behavioural change. That migration is the proof the API is right, and
  it should happen before the editor is built on top of it.

### 2 — inspect

Read-only, and useful on its own — this is the testbed the ecosystem has been
missing (cf. tosijs-3d#20, which asked for exactly this kind of reference
scene).

- Library palette from `getNames()`; load an assembly and render it.
- Placement: **land** (ground at 0) and **aquatic** (water at 0, seabed at a
  variable depth). Both planes **pinned to the origin** — a bench looks at one
  thing from many angles, so the world holds still and the camera moves.
- Camera: fit-to-bounds, **re-fitting as async models load**; named angles;
  **orthographic as a toggle independent of angle** (ortho for judging
  alignment, perspective for judging how it reads).
- Animations: play / pause / scrub / speed. Library groups arrive **stopped**.
- Shadows: ground receives, pieces cast, registered **continuously** because
  runtime-added meshes never join a one-time list.
- Live, non-blocking validation display.
- **Done when:** every assembly in manta-recon renders identically to the game,
  at the same scale. Different scale = the tool teaches you the wrong thing.

### 3 — edit

- Select: viewport click **or** list; picking walks **up** to the owning piece
  (clicking a turret barrel selects the turret).
- Gizmos: move / rotate / scale, writing back to the JSON **on drag release**,
  in assembly-local coordinates.
  > ⚠️ **This is the schedule risk, and it is upstream.** tosijs-3d has NO
  > manipulator — `b3d-panel`'s coloured axes are a debug readout that looks
  > exactly like one, which has already fooled a reader. Babylon's
  > `GizmoManager` exists and is mouse-shaped, so `bench-gizmo.ts` lifts cleanly
  > ONLY if the editor stays flat. If open question 5 lands on the SVG UI, an XR
  > manipulator is a real build and the editor's single most important
  > interaction. Settle question 5 before scheduling this, and file the upstream
  > ask early: it is on tosijs-3d's TODO but nobody owns it.
- Bounding box and wireframe toggles.
- Add / delete / duplicate pieces from the palette.
- **Schema-driven property panel** — the editor must not know what
  `destroyable` *means*, only how to render an editor from a description
  (SPEC.md §Part 3). Widgets: `number`, `boolean`, `string`, `enum`, `mesh`,
  `ref`, `point`, `zone`, `vec3`, `color`.
- **Features come from the registry, not a hardcoded list.** A host registers
  `{ name, schema, bind }` and its feature becomes first-class: palette entry,
  property panel, `ref` participation, save/load. tosijs-3d ships registrations
  for its own components; Manta registers escort zones, energy conduits and
  charred wrecks the same way (SPEC.md §"The feature registry").
- Points and zones as first-class editable objects.
- Persistence: load / save / import / export, with the **host** owning
  storage — the component calls handlers, it does not choose a backend.
- **Done when:** an assembly can be authored from scratch, saved, reloaded, and
  is byte-comparable to a hand-written equivalent.

### 4 — test

An assembly is a puzzle; a static render says nothing about whether it is
solvable or fair.

- Host-supplied scenarios with a context offering `spawn`, `damage`/`damageRole`,
  `pieces()`, `zones()`, `log()`, time control.
- Ship generic ones (spawn N hostiles, destroy by role, flyby) and let a host
  add its own.
- **Time control caveat:** effect timing can be scaled by a consumer-side sim
  clock, but **craft motion cannot** — velocity comes from `b3d-aircraft`
  integrating against the engine delta. Label a speed control for what it
  actually scales. Real slow-motion needs `owner.simTime`/`simDt` upstream
  (tosijs-3d#30) and this project is the **second** consumer to want it.
- **Done when:** you can watch idle fighters find an escort zone, and watch a
  reactor kill cascade to a shield, without leaving the page.

### 5 — ship it as a component

- `assemblyEditor({ libraries, schema, scenarios, onSave, load })` — configurable,
  embeddable, not an application.
- Doc site with a live example.
- **Done when:** `../manta-recon` deletes its bench and depends on this.

---

## Deliberate non-goals for v1

Named so they are decisions rather than omissions: undo/redo, multi-select,
snapping and alignment guides, terrain painting, **nested assemblies** (reserve
the shape — allow `"assembly": "name"` on a piece and flatten at load — but do
not build live instances), and the **encounter layer** (SPEC.md open question 4:
`assembly` = what a thing IS, `encounter` = what it is DOING HERE; build it once
there are enough assemblies for the distinction to bite).

---

## Prior art

A working prototype lives in `../manta-recon` — the editor grew inside a game
and was extracted for the reasons above. Lift from it; do not start clean out of
tidiness:

`src/prefab.ts` (format + validation) · `src/prefab-runtime.ts` (instantiator) ·
`src/bench-gizmo.ts` (GizmoManager binding) · `src/bench-view.ts` (placement,
framing, ortho, shadow casters) · `src/zones.ts` (zone registry) ·
`src/prefab-editor.ts` + `static/prefab.html` (the bench)

SPEC.md §"What Manta contributes back" lists the traps these encode. They are
not trivia — each cost real time, and the two most expensive were **assuming a
name instead of listing what is there** and **verifying a mechanism instead of
an outcome**.
