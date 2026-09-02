# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**The tosijs-3d "ensemble" format, its instantiator, and a graphical editor for
authoring them.** An ensemble is a reusable, JSON-described arrangement of
library meshes with declared capabilities and relationships — a rig, a dome
facility, a fortress of shields, platforms, turrets and generators. No code, no
engine types: plain data a game loads, a tool authors, and a generator can emit.

Status: **scaffolded, building, and verified in a browser.** The format, roles, validation, the feature
registry and the instantiator are written and tested; the editor is a working
component on the doc site with a piece list and a position panel — no
manipulator, because tosijs-3d has none (see `UPSTREAM.md`).

The markdown files carry decisions reached by argument, several of them by
correcting a wrong first answer. Read them before writing code:

|               |                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SPEC.md`     | **the specification** — format, editor affordances, schema system, scenarios, and five design questions answered with recommendations. The primary document |
| `PLAN.md`     | the plan — what to build, in what order, and what "done" means per milestone                                                                                |
| `README.md`   | the elevator pitch and the package story                                                                                                                    |
| `UPSTREAM.md` | gaps in tosijs-3d found while building. **File, don't fix**                                                                                                 |
| `AGENTS.md`   | the practices pointer, and this project's divergences                                                                                                       |

When SPEC.md and PLAN.md disagree, SPEC.md's later sections usually win —
"Open questions" reopened and reversed decisions made in its own Part 1. Check
the git log before treating any statement as settled.

## Read the shared practices FIRST

This project is part of the **tosijs ecosystem** and inherits its practices from
**`../tosijs-coding-practices`**. Read its `README.md` (the index) before
substantive work, then the practice doc relevant to your task.

Precedence: **this file wins** over the practices repo; the practices repo wins
over generic model priors.

Non-negotiables from that repo:

- **Assumed stack:** Bun, TypeScript strict, tosijs (state), tosijs-ui (build +
  doc system), tosijs-schema (JSON Schema → types + validation).
- **Stay in your repo.** If a fix belongs in `../tosijs-3d` or another sibling,
  **file an issue there, don't fix it** (`practices/cross-project.md`). The
  practices repo itself is the exception — writing lessons back into it needs no
  signoff.
- **Observant model, not reactive** — read `practices/observant-model.md` before
  building any UI. tosijs is not React and guessing costs time.
- **`practices/model-priors.md`** — what you will get wrong about web
  components, bundlers and this stack specifically.
- **`practices/releasing.md`** — including "Bypassing the publish loop": an
  unpublished dependency's tarball goes in **`../local-packages/`** with a
  `PROVENANCE.md`, never in a session scratchpad. This project used that route
  for tosijs-3d and **no longer does** — 0.7.0 is on npm and the `file:` dep is
  gone, which is the required end of a stopgap rather than an optional tidy-up.

  ⚠️ **Never pin a tosijs-3d PRERELEASE range.** `0.7.0-rc.1` was published
  before the betas, and semver sorts beta below rc — so `^0.7.0-beta.6`
  resolved _backwards_ to rc.1, silently, with `bun update` reporting the
  downgrade as an upgrade. `^0.7.0` is above every prerelease and is what to use.

## One package, tree-shakeable — the decision that reversed twice

The format, the instantiator AND the editor ship from here as **one package**,
`tosijs-3d-ensemble`. A game imports the first two and the editor tree-shakes
away.

```js
import { buildEnsemble, validate } from "tosijs-3d-ensemble"; // a game
import { ensembleEditor } from "tosijs-3d-ensemble"; // an author
```

⚠️ **Two earlier answers are still readable in the git history and partly in
SPEC.md's older paragraphs.** The format was going to live upstream in
tosijs-3d (`b3d-ensemble`); then it was going to be two packages from one repo.
Both are superseded. Owner: _"I don't think two packages is right, just the
editor should be thoroughly tree-shakeable if you just want to consume
ensembles."_

The property that matters — the editor writes exactly what the runtime reads,
because it is the same code — is strongest this way: there is no version at
which the tool and the runtime can disagree. Hosting the format in tosijs-3d
stays the right end state if it proves universal; the reason it is not there
yet is **velocity**, not layering.

**The guarantee is now invisible, so something has to check it.**
`src/tree-shaking.test.ts` bundles exactly what a game imports and fails if any
editor module survives — plus a companion assertion that those markers DO appear
when the editor entry is bundled, so the check cannot pass vacuously. If you add
an import from the format layer to the editor layer, that test is the only thing
that will notice.

### Dependencies

|                 |                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `tosijs-3d`     | the scene, **and the SVG UI the editor's chrome is built on**                                        |
| `tosijs-ui`     | the **build/doc system** (`tosijs-ui/site`). Its DOM widgets are not the editor's chrome — see below |
| `tosijs-schema` | schemas as JSON Schema; tjs predicates later                                                         |
| `tosijs`        | state, not ad-hoc module globals                                                                     |

## The UI stack: tosijs-3d's SVG UI, not DOM widgets

SPEC.md open question 5 is answered: **build the chrome on tosijs-3d's SVG UI**
(`widgets3d` / `box` / `surface` / `table` / `keyboard` / `popup-surface`),
which is one implementation rendering both as a DOM overlay and as an in-scene
texture — so it buys the headset without giving up the browser. Editing a 3D
arrangement is a spatial task; a tool for arranging things in space that cannot
be used _in_ that space concedes its best affordance. The repo stays separate
regardless.

Two consequences that change the schedule:

- **Milestone 0a is a falsifiable test, and it comes first.** Build the piece
  list and ONE property panel in the SVG UI and try them in a headset before the
  scaffold hardens. Forms are the SVG UI's weakest area (no form layer; a
  schema-driven property panel _is_ a form generator) and that is cheap to
  discover now, expensive in milestone 3.
- **No manipulator exists — flat or XR.** `b3d-panel`'s coloured axes are a
  debug READOUT that looks exactly like Babylon's position gizmo, and has
  already fooled a reader. Babylon's `GizmoManager` is mouse-shaped, so
  Manta's `bench-gizmo.ts` lifts cleanly ONLY if the editor stays flat. This is
  the single largest schedule risk and it is upstream; file the ask early.

Do not hand-roll a bundler, a dev server, a docs page, or a widget. If a widget
is missing, that is an issue for its owner.

## The format has NO domain — this is the easiest thing to break

An ensemble describes an arrangement. It is **not** a combat format, even though
`SPEC.md` was written from a fortification brief and reads that way in places.
tosijs-3d's standard demo scene — sun, shadow rig, sky, ground, fog — is an
ensemble, and loading it in one line is the point of the project.

The boundary, and the mistakes that produced it:

- **`destroyable` is a decorator, not how things exist.** A plain piece is
  instantiated straight off the library as a Babylon NODE: no element, no combat
  record. The first version placed everything through `b3d-destroyable` with
  `armor: 100_000` to mean "scenery" — which makes terrain a combatant that
  vanishes at 100 000 damage. Don't reintroduce it.
- **Destroyable routes through collision**, defaulting to on: if you cannot hit
  it you cannot destroy it. `collidable: false` opts out.
- **Roles ship EMPTY** (`registerRole`), and `validate` knows no domain rules
  (`registerCheck`). `presets/combat` registers the fortification vocabulary and
  the unreachable-shield rule.
- **`src/tree-shaking.test.ts` enforces both boundaries** — the editor out of a
  game's bundle, and the combat preset out of a scene-only import — each with a
  companion assertion that the markers DO appear when the relevant entry is
  bundled, so neither can pass vacuously. If you add an import across a layer,
  that test is the only thing that will notice.

## Design invariants the format depends on

Cheap now, painful to retrofit:

- **`id` is mandatory**, never derived from array index — derived ids mean every
  insertion renumbers the world. And **namespace ids for nesting from day one**
  (`rig-a/pump`): the encounter layer inherits whatever identity scheme ships.
- **`validate()` returns `{severity, code, message, path}[]`, never throws.** An
  editor shows everything and keeps working; a generator must decide whether to
  emit. A bare `string[]` forces the generator to parse prose — and it will.
- **`bind` must be two phases.** `bind(piece, cfg, ctx)` creates and returns a
  handle touching nothing else; `link(handle, ctx)` runs after every piece has
  bound and is the ONLY place `ctx.handle` / `ctx.piecesByRole` are legal.
  Otherwise a `protector` resolving its power source races array order, and
  reordering pieces in the editor silently changes behaviour.
- **Rebuilding must be idempotent.** The editor rebuilds on every edit —
  hundreds of times a session where a game runs it once. The test worth writing
  is _build → dispose → build_, asserting scene mesh, observer and material
  counts return to where they started.
- **Features are a registry**, not a switch. `registerFeature({name, schema,
bind})`; a consumer's feature must be indistinguishable from a built-in in the
  format, the editor and the file.
- **Regex lives as a source string**, compiled at load — a `RegExp` makes the
  format unserializable.
- **`rot` is euler DEGREES**, matching tosijs-3d elements. Say so where a reader
  will look.
- **`scale` is `number | Vec3`, and both spellings are canonical.** A number is
  not sugar the loader rewrites — it is what a file says when the scale IS
  uniform. `src/format/scale.ts` holds the two functions that let everything
  else stop caring which it got, and a drag writes back the NARROW spelling so
  a uniform scale round-trips as the number the author typed.
- **`FeatureContext.scale` stays a single number**, defined as the _enclosing_
  component (the max) — a feature uses it to size a radius, and a mean would put
  that radius inside the geometry it is meant to cover. `BuiltPiece.scale3` is
  the honest triple.

### Rotation and scale did nothing at all, and nothing said so

**Only POSITION survives the trip through `b3d-destroyable`.** The element
rewrites `mesh.position` from `x`/`y`/`z` every frame, which is why moving a
piece has always worked. Nothing else gets through:

| written                    | result                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `piece.scale` 1 → 2 → 4    | rendered width 5.273 every time (`size` is the placeholder cube's edge, ignored once `library` is set) |
| `element.ry = 90`          | node rotation `0,0,0`, quaternion null, unchanged                                                      |
| authored `rot: [0, 45, 0]` | footprint 3.63 × 3.63, identical to no rotation — `instantiate` is called with position only           |

So `piece.scale` and `piece.rot` were documented format fields that moved
nothing. The editor shipped controls against both, and a test asserted
`element.size === 3` and passed the whole time.

The fix writes the library instance's root `TransformNode` — `element.mesh` —
which the element does not rewrite the way it rewrites position:
`src/runtime/node-transform.ts`. Filed as tosijs-3d#47 (scale) and #48
(rotation). **The instance does not exist when the element is appended**
(destroyable instantiates inside `lib.ready.then(...)`), so `place-mesh.ts`'s
`whenMeshed` retries on a render observer with a frame budget; applying once,
immediately, is the same silent nothing one layer down.

This is the project's own "verify the OUTPUT, not the mechanism" rule catching
its own code three times over: the attribute was set, the element accepted it,
the test passed, and the mesh never moved. **Before trusting any transform
attribute on a tosijs-3d element, measure the rendered result.**

## Prior art to lift, not reinvent

A working prototype exists in **`../manta-recon`** (a game; the editor grew
inside it and was extracted for exactly the reasons in SPEC.md):

| file                    | what it is                                                          |
| ----------------------- | ------------------------------------------------------------------- |
| `src/prefab.ts`         | format types + `validatePrefab`                                     |
| `src/prefab-runtime.ts` | the instantiator (features → components)                            |
| `src/bench-gizmo.ts`    | Babylon `GizmoManager` binding; writes back to JSON on drag release |
| `src/bench-view.ts`     | placement modes, camera fit, ortho toggle, shadow casters           |
| `src/zones.ts`          | live zone registry (escort volumes AI reads)                        |
| `src/prefab-editor.ts`  | the bench itself                                                    |
| `static/prefab.html`    | its page                                                            |
| `EDITOR-SPEC.md`        | the ancestor of `SPEC.md` here                                      |

Read these for the traps they encode, listed in SPEC.md §"What Manta contributes
back". Several cost hours: attributes captured at attach are not live, library
materials are shared, the water mesh is `water_nocast`, and an editor that
renders at a different scale than the game teaches you the wrong thing about
your own data.

**Milestone 1 is done when manta-recon deletes `prefab.ts` and
`prefab-runtime.ts`** and loads its four ensembles through this package with no
behavioural change. That migration is the proof the API is right, and it should
happen before the editor is built on top of it.

## What "verified" means here, and what it does not

The project's own rule is _verify the OUTPUT, not the mechanism_, so be precise
about which claims have been checked:

- **Checked in a browser:** the editor mounts, the backdrop renders, all placed
  pieces appear in their authored arrangement, the camera frames them, both SVG
  panels draw, and selecting a piece through the component API swaps the
  property panel.
- **Checked by test:** validation, role merging, two-phase bind/link ordering,
  build → dispose → build leaving nothing behind, world-space scaling, and the
  editor tree-shaking out of a game's bundle.
- **NOT checked:** anything the built-in features actually do in a scene —
  turrets firing, chains, protection, terrain shape. `src/runtime/features.ts`
  is thin bindings written against the element attributes, and a scene test is
  the next thing it needs. Do not describe those as working.
- **NOT checked:** the headset. The whole reason the chrome is the SVG UI is
  that it should run in one, and nobody has put it in one yet.

## Working style that this project's history argues for

The prototype's bugs were almost all **verification failures, not logic
failures**. Recorded here because they will recur:

- **Verify the OUTPUT, not the mechanism.** Health decrementing is not a kill.
  An attribute being set is not a camera that moved. A strategy name being
  assigned is not a strategy that ran.
- **A test rig that removes the motion removes the bug.** Pinning a craft to
  hold it still made a flicker unreproducible three separate times.
- **Sample THROUGH an interval, not across it.** Two readings either side of a
  pause showed motion that was not there.
- **A control that does nothing is worse than no control** — it invites trust in
  a reading it never produced. A slider shipped dead for days.
- **List what is actually there rather than guessing names.** Two separate
  hours went to `getMeshByName('water')` and `Drone` vs
  `Drone_collideBox.model`.

## A DOM MOVE rebuilds the whole scene — the worst bug this project has had (2026-09-02)

**Four faces, one cause.** Dark sky, meshes rendering white, empty scene,
half-loaded scene. `tosi-b3d`'s `connectedCallback` constructs `new Engine` and
`new Scene` unconditionally, so ANY reconnect rebuilds everything — and a
reconnect needs no mutation in our shadow root at all: when the doc system
re-parents our HOST in the light DOM, every element inside the shadow root is
disconnected and reconnected.

Measured on one load, instrumented from module load:

```
scenesSeen    id 1 @ 1483ms,  id 2 @ 1526ms
skyTimeline   SkyMaterial 6 @ 1483,  23 @ 1526
deleteProgram @ 1531
b3dDomEvents  []            <- the element was never added or removed
```

The disposed scene takes a shared shader program with it, and the survivor
renders black while every uniform reads correct and `isReady()` returns true —
`gl.isProgram()` false, `gl.getError()` 1282, and nothing in the console.

Filed as tosijs-3d#58. **The fix is the opposite of what I asked for, and it is
better**: rather than reusing the engine and scene across a reconnect, tosijs-3d
GUARANTEES a full teardown on disconnect and a rebuild on connect. Reuse would
hold an engine and a WEBGL CONTEXT open across a disconnect that may never come
back, and contexts are hard-capped per page. It also fixes the real fault more
directly — the corruption came from the ORDER (scene 1 disposed after scene 2
existed), and dispose-fully-then-build makes that interleave impossible.

⚠️ **That puts a requirement on THIS code.** The `<tosi-b3d>` we re-adopt after
a re-parent has a brand new scene, so everything cached from the old one is
rubbish and must be dropped on disconnect. We had `_sceneReady` cleared only in
the deferred disposal — a path that is skipped exactly when we reconnect — so a
rebuild could run against a scene that no longer existed. Now cleared on
disconnect, unconditionally.

**Two things here are MITIGATIONS, not the fix**, and should be re-examined
when #58 lands rather than trusted: the deferred mount below, and the lazy kit
shelf. Both narrow the window; neither closes it.

**How to TEST it: navigate back and forth, not reload.** Re-parenting is the
trigger, so SPA navigation exercises it directly where a page load only does so
incidentally — and it is faster, so you get a real sample instead of four
anecdotes, and it shuffles the race order rather than repeating one. Owner:
_"it's faster and changes likely race orders"_. Count outcomes over ~20 trips;
anything less cannot tell "fixed" from "rarer".

**How to catch this class at all: poll from MODULE LOAD.** The window is 43ms
at t≈1.5s. Every probe fired from a tool round-trip lands ten seconds later and
finds a perfectly healthy scene, which is how it survived three wrong diagnoses.
A query-gated spy that starts polling as its module evaluates is the only thing
that saw it.

### The deferred mount (a mitigation, kept on its own merits)

The doc system creates this element from inside a `requestAnimationFrame`
render pass:

```
connectedCallback   ensemble-editor.ts
render              doc-system.js:489
requestAnimationFrame
queueRender
```

so building a Babylon engine in `connectedCallback` happens DURING another
component's frame, and materials and shader programs come out bound to the
wrong thing. About 70% of page loads. `connectedCallback` defers the whole
mount with `setTimeout(…, 0)`; `disconnectedCallback` cancels it.

⚠️ I called this fixed on four consecutive clean loads. It was not: the real
cause is above, and four loads cannot distinguish "fixed" from "rarer" when the
failure rate is unknown. Building into somebody else's render frame is still
wrong and the deferral still belongs here — but it is a mitigation.

**How it was finally found, after a day of wrong answers:** put a WORKING
reference beside the broken one, in the same page, at the same moment.
`<tosi-ensemble>` in a plain `<tosi-b3d>` rendered perfectly while the editor
beside it was dark — which cleared the format, the instantiator, the ensemble
data and tosijs-3d in one step. Then an editor mounted by hand into a panel was
also perfect, which left only WHEN it was mounted.

**The failure mode to avoid repeating** is mine, and it happened three times in
one day: on an INTERMITTENT bug, one confirming observation is not a result. A
bug that fails 70% of the time hands you a clean pass 30% of the time. Two of
today's confident conclusions — "a shared SkyMaterial program deleted by
material churn" and "the chrome breaks the scene" — were single samples, and
both were wrong, and one of them was filed upstream on somebody else's tracker
before being retracted. Take n≥4 before believing a fix, and prefer a
side-by-side control over a before/after.

Related, all cheap to get wrong the same way:

- `gl.isProgram()` and `gl.readPixels()` both gave FALSE readings during this
  hunt — readPixels reported `[1,1,1]` on a frame the screenshot showed as red.
  A screenshot is the ground truth for anything visual.
- The owner's `realtimeScale` default of 10 means an unattended sky cycles
  day→night every 40 minutes. "Is it night time?" was literal, not a symptom.

## Traps this project will hit, from the tosijs-3d side (2026-08-21)

Found while building 0.7.0. Each cost real time there and would cost it again
here, because none of them fails loudly.

- **`rx`/`ry`/`rz` are DEGREES on tosijs-3d elements**, and Babylon is radians.
  A bare number is valid in either unit, so getting it wrong produces a
  different orientation rather than an error.
- **An element that manages a node OWNS its transform.** `AbstractMesh` rewrites
  `mesh.position` from the element's `x`/`y`/`z` every frame, so writing the mesh
  directly is silently undone. Gizmos hit this hard: a drag behaviour moves the
  MESH, and the element overwrites it next frame unless you sync back. Whatever
  the gizmo ends up being, its writes must land on the element.
- **A mesh positioned but never RENDERED has no world matrix**, so a ray cast in
  the same frame finds it at the ORIGIN and answers confidently and wrongly. It
  bit picking in tosijs-3d's own tests. Anything that places a piece and then
  picks against it in the same tick needs `computeWorldMatrix(true)` — `el.make.*`
  does this for you.
- **A throw inside a render observer kills the render loop permanently.**
  Babylon's `notifyObservers` has no isolation, and the loop does not re-queue —
  so the page goes black with no error where anyone would look. A feature's
  `bind`/`link` running per-frame work should guard itself; the editor
  re-instantiating constantly makes this much more likely to be hit than a game
  does.
- **`getNames()` returns PUBLIC names.** `.model`, behaviour suffixes AND the
  glTF loader's `_primitiveN` all come off, so `building_collideCylinder_primitive0`
  lists as `building`. The format stores public names; never store what the
  loader happened to call a node.
- **Library rotation was inert before 0.7.0** — `instantiate()` wrote euler onto
  a node whose `rotationQuaternion` the glTF loader had already set, so every
  value produced the GLB's baked rotation. If Manta's ensembles were authored
  against that behaviour, their `rot` values were never doing anything, and
  fixing it will MOVE things. Check before assuming a regression.

## Commands

```bash
bun start           # doc site + dev server on :8032; the editor is /editor/
bun run build       # doc site + library build (tsc -p tsconfig.build.json)
bun test            # everything
bun test src/format # one directory; `bun test -t "two phases"` for one test
bun run typecheck   # root tsconfig, noEmit
```

`bun run build` runs BOTH typechecks and the live-example checker, and fails the
build on either. It is the gate that catches an example teaching a broken
contract, and it has already caught real errors here — do not route around it.

The doc site is `tosijs-ui/site` driven by `site.config.ts`; `bin/site.ts` is a
six-line dispatcher. Do not hand-roll a bundler, a dev server or a docs page.
Docs are extracted from `/*# … */` blocks in the source plus the root markdown,
so a doc comment IS the doc page.
