# tosijs-3d-ensemble

**The tosijs-3d ensemble format, and a graphical editor for authoring it.**

An *ensemble* is a reusable, JSON-described arrangement with declared
capabilities and relationships. No code, no engine types: plain data a game
loads, a tool authors, and a generator can emit.

**It is not a combat format, and that is the whole win.** An ensemble can be a
floating fortress of shields and turrets — or tosijs-3d's own standard scene:
sun, shadow rig, sky, ground plane, fog. Load that stack as data and a scene
reads as *"the standard setup, plus the thing I am actually showing you"*,
instead of burying the two interesting lines in boilerplate.

```html
<tosi-b3d>
  <tosi-ensemble src="/ensembles/standard-scene.json"></tosi-ensemble>
  <tosi-b3d-box size="1.5" y="0.75" color="#2f9e8f"></tosi-b3d-box>
</tosi-b3d>
```

Hit points, turrets and shields are an **opt-in preset**, because most things in
most scenes can never be shot — and terrain that quietly accumulates damage and
disappears at 100 000 is a worse outcome than terrain that was never a
combatant:

```js
import { registerSceneFeatures } from 'tosijs-3d-ensemble'            // sun, sky, ground, terrain, water…
import { registerCombatPreset } from 'tosijs-3d-ensemble/presets/combat' // …only if you want it
```

**Status:** the format, validation, the registry and the instantiator are built and
tested; the editor is a working scaffold on the doc site. See `PLAN.md` for what
is done and what is next.

- **`PLAN.md`** — what to build, in what order, and what "done" means.
- **`SPEC.md`** — the specification: format, editor affordances, schema system,
  test scenarios, and five design questions answered.
- **`UPSTREAM.md`** — gaps in tosijs-3d this project needs closed.
- **`CLAUDE.md`** / **`AGENTS.md`** — agent guidance; read the ecosystem practices first.

## One package, tree-shakeable

The format, the instantiator and the editor ship as **one package**. A game
imports the first two; the editor is never reached and tree-shakes away.

```js
// a game
import { buildEnsemble, validate, registerBuiltInFeatures } from 'tosijs-3d-ensemble'

// an author
import { ensembleEditor } from 'tosijs-3d-ensemble'
```

One package, because that is what makes the editor and the game call the *same*
instantiator — "what you author is what you get" holds by construction rather
than by discipline. A shipped game still carries no editor, but that is
guaranteed by **a test that bundles the game's imports and fails if any editor
module survives** (`src/tree-shaking.test.ts`), not by npm packaging. A stray
import from the format layer into the editor is exactly how this rots, and
nothing else would notice.

The editor's UI is built on **tosijs-3d's SVG UI**, not DOM widgets, so it runs
in a headset as well as a browser: editing a 3D arrangement is a spatial task.
See `SPEC.md` open question 5 for the argument and its costs.

## Running it

```bash
bun install
bun start        # doc site + the editor at /editor.html, on :8032
bun test
bun run build
```

## Prior art

A working prototype lives in `../manta-recon`, where this grew inside a game
before being extracted. `PLAN.md` §"Prior art" lists what to lift.
