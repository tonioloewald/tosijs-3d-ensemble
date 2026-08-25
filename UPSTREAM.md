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

## 1. Basic world behaviour, prototyped here FOR PROMOTION

This entry is different from the rest: it is not a request, it is a **standing
offer**. tosijs-3d has almost nothing for building a PLACE, as opposed to a
battle, and this project needs those behaviours — so they are being written
here against real content, with the intent that they go upstream before this
ships.

What exists upstream today:

| | |
|---|---|
| `b3d-trigger` | a spherical proximity volume with enter/exit, `once`, `debug` |
| `b3d-sound` | spatial audio: url, loop, volume, distance model, rolloff |
| `b3d-light` | a point light: position, intensity, diffuse, specular |

What does not exist at all — and the gap that matters most is the first:

- **A way to touch a mesh.** `b3d-button` is a floating Babylon GUI widget, not
  world geometry you can reach out to, so there is no substrate for doors,
  knobs, switches, levers or consoles. Everything below stands on this.
- **Doors** — swing, slide, iris; a knob you must touch rather than the door.
- **Locks and keys.**
- **Lamps** as authorable objects: type, colour, switching, flicker, shadow
  cast/receive, and free geometry (a can, a glowing ball, a surface).
- **Mirrors.** `b3d-reflections` is a probe, not a reflective surface.
- **Detection volumes** — a security camera's cone, as opposed to a sphere.
- **Spin in place**, which is trivial and conspicuously missing.

Prototyped in `src/presets/world/`, with the rules as pure functions in
`world/logic.ts` so the behaviour is testable without a scene — which is also
what makes it portable upstream: the maths moves as-is and only the bindings
are rewritten.

**One contract change came out of it and is worth carrying up**: features must
be able to compose on other features ON THE SAME PIECE. A door consults
`interactive` to know it was used; `interactive` consults `lockable` to know
whether it may open. Without that, either every behaviour reimplements the
others or one god-feature knows about all of them. Here it is `ctx.feature()`.

## 2. A form layer for the SVG UI — and this is the predicted bill

`SPEC.md` open question 5 chose the SVG UI over DOM widgets and said plainly
what it would cost: *"Forms are the SVG UI's weakest area, and a schema-driven
property panel is a form generator."* It also argued the editor is the SVG UI's
**hardest customer, and that this is a reason** — a game shows a HUD and a pause
menu; an editor is a dense forms application, so it finds what a game never
will. This entry is that bill arriving, itemised. It is evidence FOR the
decision, not against it.

Everything below was hit building one property panel and one tool-options panel.

- **`inputField` listens to nothing.** By design — in a headset the keys come
  from the SVG keyboard, not the DOM — so a flat host must carry real
  `keydown` across to `insert`/`action` itself. Without that a field you can
  click into silently refuses every character. Every flat consumer will write
  this same routing, and ours is in `ensemble-editor.ts` (`_routeKeys`).
- **There is no number field.** We built one: parse, format, commit on Enter,
  and reject gibberish by restoring the last good value rather than writing
  `NaN` into the document. A number is the single most common thing a property
  panel edits.
- **`slider3d` shows no value.** That is why coordinates in this editor were
  unreadable before we replaced them: an author could see a handle position but
  not the number under it.
- **`select3d` is a CYCLER, not a select.** `‹ value ›` is right for three
  options and unusable for twenty-four — picking a mesh from a library would
  mean tapping twenty-three times. The pieces for a real one exist
  (`surface.openPopup`, `openMenu`) but they need a **`Surface`**, and
  `panel3d` returns a bare `SVGSVGElement` — so a popup is not reachable from
  inside a panel, which is exactly where a property panel needs one.
- **No row layout.** `panel3d` stacks vertically, so a label-and-field pair is
  two rows. A property panel of eight fields is sixteen rows of mostly
  whitespace.
- **No content measurement.** A panel clips at its height and there is no way
  to ask how tall its content is, so every height is a hand-tuned constant.
  Ours were wrong three separate times — a command hidden behind another panel,
  an option cut in half, a list showing five of eight rows — and each time the
  failure was silent, because clipping looks like "that feature isn't there".
- **No focus exclusivity across fields.** Which field owns the keyboard is the
  host's bookkeeping; two lit fields both claiming it is worse than none,
  because the caret is somewhere you are not looking.

**The ask:** a form layer — a text field that can be driven from either input
source, a number field, a real popup select, rows, and either measurement or
self-sizing panels. The owner notes this is already on the roadmap; this entry
is the consumer's evidence for what it needs to include, and what we built
locally is available as a starting point rather than a competing design.

## 3. No manipulator (the schedule risk)

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

## 4. Placing a library mesh always enrols it in combat

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

## 5. `b3d-turret` and `b3d-launcher` take no `library`

Neither has a `library` attribute, so neither can draw a library mesh — only
`meshName`, which without a library has nothing to resolve against.

**What it costs here:** the built-in `turret` feature binds and aims, but a
turret cannot have its own model. A piece that IS a turret renders as whatever
mesh the piece itself names, and a turret mounted ON something has no way to
look like one.

**The ask:** the same `library` + `meshName` pair `b3d-destroyable` grew in
0.7.0, on the two other elements that also place a mesh.

## 6. `b3d-spawner` cannot spawn at an authored place

`b3d-spawner` spawns encounters relative to the PLAYER
(`minDistance`/`maxDistance`, no `x`/`z`), and takes a `prefab` NAME rather than
a craft mesh. The ensemble format's `launchpad` feature means "craft launch from
THIS pad on this rig", which the element cannot express.

**Consequence here:** `launchpad` is registered `editorOnly` — authorable, and
honestly marked as something the runtime will not build. An author finds out in
the editor rather than at ship time.

**The ask:** a place-anchored spawn mode (`x`/`y`/`z` + `facing`), or a
documented recipe for anchoring a spawner to an element.

## 7. `simTime` / `simDt` on the scene (tosijs-3d#30)

Effect timing can be scaled by a consumer-side clock, but **craft motion cannot**
— velocity comes from `b3d-aircraft` integrating against the engine delta. Real
slow-motion needs the scene to own the clock.

**Two separate consumers now want it**, which is the argument for the scene
owning the clock rather than each consumer building one.

`FeatureContext.simTime` is the seam on this side: it defaults to wall-clock and
switches to the scene's clock the day there is one.

## 8. `exports` is the string form

`tosijs-3d`'s `package.json` has `"exports": "./dist/index.js"`, so no subpath
is reachable — including its own headless surface. Known in that repo's UPSTREAM
notes; repeated here because this project got the map form right on day one and
the contrast is the argument.

## 9. Naming note — `prefab` upstream

tosijs-3d exports `prefab` for a **registered `(ctx) => Element[]` factory**
(`definePrefab` / `spawnPrefab` / `prefabNames`) used for wrecks, debris and
spawns. Not a request to rename anything — recorded because a reader coming
from Unity meets a second meaning of the word in the same dependency graph.

Our root term is **ensemble**. `prefab` is Unity's word for the neighbouring
idea, and upstream's is a third thing again.
