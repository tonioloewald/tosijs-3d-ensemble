# Upstream asks — tosijs-3d

Gaps found while building this project. Per `practices/cross-project.md` these
are **filed, not fixed**: nothing here is worked around in tosijs-3d's source
from this repo. Where a workaround exists locally it is named, so it can be
deleted when the gap closes.

Status: **recorded here, not yet filed as issues.**

---

## 1. No manipulator (the schedule risk)

There is no gizmo — flat or XR. `b3d-panel`'s coloured axes are a debug
READOUT that looks exactly like Babylon's position gizmo, which has already
fooled a reader; tosijs-3d's own docs say so.

Babylon ships `GizmoManager`, but it is mouse-shaped, so Manta's
`bench-gizmo.ts` lifts cleanly only if the editor stays flat — and the editor's
chrome is the SVG UI precisely so it also runs in a headset. An XR manipulator
is a real build and it is **this editor's single most important interaction**.

Also relevant when it lands: **an element that manages a node OWNS its
transform**, rewriting `mesh.position` from `x`/`y`/`z` every frame. A drag
behaviour that moves the MESH is silently undone next frame — a gizmo's writes
must land on the ELEMENT.

## 2. No way to place a library mesh without making it destroyable

`b3d-destroyable` is currently the only element that instantiates a library mesh
by name (`library` + `meshName`, added in 0.7.0 for exactly this reason).
`b3d-loader` takes a `url` and loses the canonical frame; `b3d-aircraft` gets
the frame right and flies away.

So an ensemble piece that is plain scenery is placed as a destroyable with
`armor: 100_000` — Manta's `structure` role used the same trick.

**Local workaround:** `INDESTRUCTIBLE` in `src/runtime/place-mesh.ts`. Delete it
when a "place a library mesh" element exists.

## 3. `b3d-turret` and `b3d-launcher` take no `library`

Neither has a `library` attribute, so neither can draw a library mesh — only
`meshName`, which without a library has nothing to resolve against.

Worth flagging because **Manta passes `library` to `b3dTurret` and it is
silently ignored** (an unknown attribute is not an error). That is the shape of
bug this ecosystem keeps paying for: not a wrong value, an inert one.

**Consequence here:** the built-in `turret` feature binds and aims, but a
turret's appearance is the piece's own mesh.

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

## 5. `list3d`'s `onSelect` does not fire from a real click (needs isolating)

Observed in the editor's piece list: clicking a row **highlights it** — so the
widget is receiving the pointer event — but `onSelect` never runs. Selecting the
same piece through the component's own API (`editor.select(id)`) works and
re-renders both panels, so the editor side is sound.

tosijs-3d's own test drives this through `panel.handlePointer('down'|'up', x, y)`
rather than real DOM events, so a gap between the two paths would not show up
there. **Not yet isolated** — it may equally be this project holding `panel3d`
wrong (as a DOM overlay, inside a shadow root). Reproduce before filing: the
honest version of this entry is a question, not a bug report.

## 6. `simTime` / `simDt` on the scene (tosijs-3d#30)

Effect timing can be scaled by a consumer-side clock, but **craft motion cannot**
— velocity comes from `b3d-aircraft` integrating against the engine delta. Real
slow-motion needs the scene to own the clock.

**This project is the SECOND consumer to want it** (Manta is the first), which
is the argument for it existing upstream rather than in each consumer.

`FeatureContext.simTime` is the seam on this side: it defaults to wall-clock and
switches to the scene's clock the day there is one.

## 7. `exports` is the string form

`tosijs-3d`'s `package.json` has `"exports": "./dist/index.js"`, so no subpath
is reachable — including its own headless surface. Known in that repo's UPSTREAM
notes; repeated here because this project got the map form right on day one and
the contrast is the argument.

## 8. Naming note — `prefab` upstream

tosijs-3d exports `prefab` for a **registered `(ctx) => Element[]` factory**
(`definePrefab` / `spawnPrefab` / `prefabNames`) used for wrecks, debris and
spawns. Not a request to rename anything — recorded because a reader who knows
Unity, or who knows Manta's `prefab.ts`, will meet three different meanings of
the word in one dependency graph.

Our root term is **ensemble**. `prefab` is Unity's word for the neighbouring
idea, and upstream's is a third thing again.
