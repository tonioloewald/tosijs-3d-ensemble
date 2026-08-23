# Upstream asks — tosijs-3d

Gaps found while building this project. Per `practices/cross-project.md` these
are **filed, not fixed**: nothing here is worked around in tosijs-3d's source
from this repo. Where a workaround exists locally it is named, so it can be
deleted when the gap closes.

**Every ask here is stated as THIS project's requirement.** `manta-recon` is
downstream of us — a consumer that lives with what this package and tosijs-3d
give it — so what Manta happens to do is evidence at most, never justification.
Its prefab bench hit some of these walls first; that is a reason to look where
it looked, not a reason to inherit its answers.

Status: **recorded here, not yet filed as issues.**

> **One entry was withdrawn.** A previous #5 claimed `list3d`'s `onSelect` did
> not fire from a click. It does. `panel3d` wires its own pointer listeners and
> exposes `handlePointer`, and driving either path selects correctly — verified
> by dispatching at each row (`110→seabed, 145→platform, 180→reactor`). The
> original observation was a misread screenshot taken after a dev rebuild had
> reset the selection. Withdrawn rather than left standing: a false ask spends
> someone else's afternoon.

---

## 1. No manipulator (the schedule risk)

There is no gizmo — flat or XR. `b3d-panel`'s coloured axes are a debug
READOUT that looks exactly like Babylon's position gizmo, which has already
fooled a reader; tosijs-3d's own docs say so.

Babylon ships `GizmoManager`, but it is mouse-shaped, so it only serves an
editor that stays flat — and this editor's chrome is the SVG UI precisely so it
also runs in a headset. An XR manipulator is a real build and it is **this
editor's single most important interaction**.

Also relevant when it lands: **an element that manages a node OWNS its
transform**, rewriting `mesh.position` from `x`/`y`/`z` every frame. A drag
behaviour that moves the MESH is silently undone next frame — a gizmo's writes
must land on the ELEMENT.

## 2. Placing a library mesh always enrols it in combat

An ensemble is mostly scenery. The format's `structure` role means "you cannot
kill this", and a `terrain` or `water` piece is not a combatant at all — but
`b3d-destroyable` is the only element that instantiates a library mesh by name
(`library` + `meshName`), and it offers no way out: `combatId` is a getter, not
an attribute. `b3d-loader` CAN be placed with `destroyable="off"`, but it takes
a `url`, so it is no help for a library.

So every piece this project places gets a combat record whether or not anything
can shoot it. On the sample rig that is already most of the scene.

**The ask:** either an element that places a library mesh with no combat
behaviour, or `destroyable="off"` on `b3d-destroyable` the way `b3d-loader`
already has it. The second is the same knob in two places and looks cheaper.

**Local workaround, and it is OURS to own:** `INDESTRUCTIBLE` in
`src/runtime/place-mesh.ts` places a non-destroyable piece as a destroyable with
`armor: 100_000`. It is a poor answer — it buys "cannot be killed" by paying for
a combatant — and the day either fix lands it should be deleted rather than
entrenched. Recorded as a stopgap, not a pattern.

## 3. `b3d-turret` and `b3d-launcher` take no `library`

Neither has a `library` attribute, so neither can draw a library mesh — only
`meshName`, which without a library has nothing to resolve against.

**What it costs here:** the built-in `turret` feature binds and aims, but a
turret cannot have its own model. A piece that IS a turret renders as whatever
mesh the piece itself names, and a turret mounted ON something has no way to
look like one.

**The ask:** the same `library` + `meshName` pair `b3d-destroyable` grew in
0.7.0, on the two other elements that also place a mesh.

## 4. `b3d-spawner` cannot spawn at an authored place

`b3d-spawner` spawns encounters relative to the PLAYER
(`minDistance`/`maxDistance`, no `x`/`z`), and takes a `prefab` NAME rather than
a craft mesh. The ensemble format's `launchpad` feature means "craft launch from
THIS pad on this rig", which the element cannot express.

**Consequence here:** `launchpad` is registered `editorOnly` — authorable, and
honestly marked as something the runtime will not build. An author finds out in
the editor rather than at ship time.

**The ask:** a place-anchored spawn mode (`x`/`y`/`z` + `facing`), or a
documented recipe for anchoring a spawner to an element.

## 5. `simTime` / `simDt` on the scene (tosijs-3d#30)

Effect timing can be scaled by a consumer-side clock, but **craft motion cannot**
— velocity comes from `b3d-aircraft` integrating against the engine delta. Real
slow-motion needs the scene to own the clock.

**Two separate consumers now want it**, which is the argument for the scene
owning the clock rather than each consumer building one.

`FeatureContext.simTime` is the seam on this side: it defaults to wall-clock and
switches to the scene's clock the day there is one.

## 6. `exports` is the string form

`tosijs-3d`'s `package.json` has `"exports": "./dist/index.js"`, so no subpath
is reachable — including its own headless surface. Known in that repo's UPSTREAM
notes; repeated here because this project got the map form right on day one and
the contrast is the argument.

## 7. Naming note — `prefab` upstream

tosijs-3d exports `prefab` for a **registered `(ctx) => Element[]` factory**
(`definePrefab` / `spawnPrefab` / `prefabNames`) used for wrecks, debris and
spawns. Not a request to rename anything — recorded because a reader coming
from Unity meets a second meaning of the word in the same dependency graph.

Our root term is **ensemble**. `prefab` is Unity's word for the neighbouring
idea, and upstream's is a third thing again.
