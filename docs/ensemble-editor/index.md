# <tosi-ensemble-editor>

The editor is a **component**, not an application. Drop it on a page, give it a
library and an ensemble, and it edits — the doc site's `/editor/` is one
such page and has no privileged access to anything.

```html
<tosi-ensemble-editor
  library-url="https://cdn.tosijs.net/enemies.glb"
  library="enemies"
  src="/ensembles/ocean-rig.json"
  backdrop="aquatic"
></tosi-ensemble-editor>
```

```typescript
import { ensembleEditor, registerSceneFeatures } from 'tosijs-3d-ensemble'

registerSceneFeatures()
document.body.append(
  ensembleEditor({
    library: 'enemies',
    libraryUrl: '/enemies.glb',
    backdrop: 'aquatic',
    handleSave: async (data) => localStorage.setItem('draft', JSON.stringify(data)),
  })
)
```

## The chrome is tosijs-3d's system panels

Every panel (the pieces, a piece's properties, the tools, the Ensemble
file panel) is a tosijs-3d **system panel**: a button on the scene's system
bar opens it, and its title bar moves it and closes it (×). They are drawn
IN the scene, flat on a screen as in a headset, by one SVG UI implementation,
so the same editor runs in a browser and in a headset. Editing a 3D
arrangement is a spatial task performed at arm's length: judging whether a
fortress reads, whether a turret covers the approach, whether a gap is
flyable are exactly the questions a flat viewport answers badly.

Panels stay open together and keep where you dragged them across edits.
`hide-chrome` (`hideChrome: true`) takes them and their bar buttons away,
for a host that shows the scene without the tool.

## Time

The **Time** panel runs the world slower or faster and plays the pieces'
animations, for watching a scenario in slow motion and judging the moving
parts a rig exists to show. Library animation groups arrive stopped; the
editor starts them. Nothing here is written to the document. It starts
closed: its clock button on the system bar opens it.

- **Sim speed** is the scene's `timeScale` (1 real time, 0 stopped), the
  same value its own Slow motion button sets.
- **Animate**, **Speed** and **Scrub** drive every animation group the pieces
  carry, except a destroyed piece's (`__wreckStopped`). Scrubbing pauses
  them that far through each clip. A clip's speed is Speed times the sim
  speed (see [the transport](/transport/)).

From script: `setTimeScale(n)`, `playAnimations(on?)`,
`setAnimationSpeed(n)`, `scrubAnimations(t)`, and `editor.time` for what the
panel shows.

## Opening and saving

The component owns no persistence; its host does, one of two ways:

- **A store** (`editor.store`, see [the store page](/store/)): the Ensemble
  panel offers Open, Save, Save as and History, and `editor.dirty` says
  whether the document differs from what was last opened or saved (or,
  for one the store has never seen, from how it arrived). A
  failure dispatches `error`.
- **No store**: the editor keeps a local draft, and the panel's New,
  Download and Open file… (there either way) are the whole of it. A host
  that wants the document calls `editor.save()`, which hands it to
  `handleSave(ensemble)`.

`src` loads a document by url; `loaded` (`{ src, storeId }`) fires when it
lands and `error` (`{ error, src }`) when it fails, leaving the current
document alone.

## Host actions

A host's own buttons go in the Ensemble panel: "Play" for a game that wants
to run the level being edited. Each gets a COPY of the current document,
saved or not:

```js:static
editor.hostActions = [
  { label: "Play", handleAction: (level) => openGame(level) },
]
```

## The backdrop is not part of the ensemble

`backdrop` mounts a sample world — ground or sea, sky, and the ambient
conditions — for the ensemble to be judged **against**. It is authoring
context: it is never saved, and dragging the ensemble over it is the point.
An ensemble that carries its OWN landform does so as a piece with a `terrain`
feature, which is a different thing and does get saved.

Both planes are pinned to the origin. A bench looks at one thing from many
angles, so the world holds still and the camera moves.

## Moving pieces

The **select** tool carries the editor's own transform grips: move, turn and
scale, chosen as cells in its options panel, with grid and angle snapping
(`tools/transform.ts`). A drag writes back to the document as one undo step.
The numbers in the property panel edit the same fields.

tosijs-3d has since shipped `<tosi-b3d-manipulator>`; whether it should replace
these grips is an open comparison (board #2794).
