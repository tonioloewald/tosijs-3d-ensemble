# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**A graphical editor for tosijs-3d "assemblies"** — reusable, JSON-described
arrangements of library meshes with declared capabilities and relationships
(fortifications, rigs, dome facilities, formations of turrets and generators).

Status: **greenfield.** `PLAN.md` is the specification and the only substantive
content so far. Read it fully before writing code — it records decisions already
made with the owner, and several of them were reached by correcting a wrong
first answer.

## Read the shared practices FIRST

This project is part of the **tosijs ecosystem** and inherits its practices from
**`../tosijs-coding-practices`**. Read its `README.md` (the index) before
substantive work, then the practice doc relevant to your task.

Precedence: **this file wins** over the practices repo; the practices repo wins
over generic model priors.

Non-negotiables from that repo:

- **Assumed stack:** Bun, TypeScript, tosijs (state), tosijs-ui (widgets +
  build), tosijs-schema (JSON Schema → types + validation).
- **Stay in your repo.** If a fix belongs in `../tosijs-3d` or another sibling,
  **file an issue there, don't fix it** (`practices/cross-project.md`). The
  practices repo itself is the exception — writing lessons back into it needs no
  signoff.
- **Observant model, not reactive** — read `practices/observant-model.md` before
  building any UI. tosijs is not React and guessing costs time.
- **`practices/model-priors.md`** — what you will get wrong about
  web components, bundlers and this stack specifically.
- **`practices/releasing.md`** — including "Bypassing the publish loop": if a
  dependency is tagged but unpublished, tarballs go in **`../local-packages/`**
  with a `PROVENANCE.md`, never in a session scratchpad.

## Dependencies

| | |
|---|---|
| `tosijs-3d` | the scene, and (once it lands) the assembly **format + instantiator** — see PLAN.md §"Where each piece lives" |
| `tosijs-ui` | widgets, layout, and the **build/doc system**. Do not hand-roll UI |
| `tosijs-schema` | schemas as JSON Schema; tjs predicates later |
| `tosijs` | state |

⚠️ **The format and the instantiator are NOT this project's to own.** They belong
upstream in tosijs-3d (`b3d-assembly`). This project is the graphical tool for
creating assemblies. If that upstream work has not landed yet, prototype against
a local copy but keep the boundary clean and expect to delete it.

## Prior art to lift, not reinvent

A working prototype exists in **`../manta-recon`** (a game; the editor grew
inside it and was extracted for exactly the reasons in PLAN.md):

| file | what it is |
|---|---|
| `src/prefab.ts` | format types + `validatePrefab` |
| `src/prefab-runtime.ts` | the instantiator (features → components) |
| `src/bench-gizmo.ts` | Babylon `GizmoManager` binding; writes back to JSON on drag release |
| `src/bench-view.ts` | placement modes, camera fit, ortho toggle, shadow casters |
| `src/zones.ts` | live zone registry (escort volumes AI reads) |
| `src/prefab-editor.ts` | the bench itself |
| `static/prefab.html` | its page |
| `EDITOR-SPEC.md` | the same document as PLAN.md here |

Read these for the traps they encode, listed in PLAN.md §"What Manta contributes
back". Several cost hours: attributes captured at attach are not live, library
materials are shared, the water mesh is `water_nocast`, and an editor that
renders at a different scale than the game teaches you the wrong thing about
your own data.

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

## Traps this project will hit, from the tosijs-3d side (2026-08-21)

Found while building 0.7.0. Each cost real time there and would cost it again
here, because none of them fails loudly.

- **`rx`/`ry`/`rz` are DEGREES on tosijs-3d elements**, and Babylon is radians.
  A bare number is valid in either unit, so getting it wrong produces a
  different orientation rather than an error. The assembly format's `rot` is
  euler degrees — match it, and say so where a reader will look.
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
  value produced the GLB's baked rotation. If Manta's assemblies were authored
  against that behaviour, their `rot` values were never doing anything, and
  fixing it will MOVE things. Check before assuming a regression.
