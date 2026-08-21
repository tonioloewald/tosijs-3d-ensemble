# tosijs-3d-editor

**A graphical editor for tosijs-3d ensembles.**

An *ensemble* is a reusable, JSON-described arrangement of library meshes with
declared capabilities and relationships — a rig, a dome facility, a floating
fortress of shields, platforms, turrets and generators. No code, no engine
types: plain data a game loads, a tool authors, and a generator can emit.

**Status: greenfield.** Nothing is built yet.

- **`PLAN.md`** — what to build, in what order, and what "done" means.
- **`SPEC.md`** — the specification: format, editor affordances, schema system,
  test scenarios, and four design questions answered.
- **`CLAUDE.md`** — agent guidance; read the ecosystem practices first.

## The split

**One implementation, two importers.** The ensemble **format** and
**instantiator** ship from this repo as a separable entry point that pulls in no
UI at all; the editor is the tool for creating them.

```js
import { buildEnsemble, validate } from 'tosijs-3d-ensemble' // a game
import { ensembleEditor } from 'tosijs-3d-editor'            // an author
```

Two packages, one repo. `tosijs-3d-ensemble` is the format and the instantiator
— small, no UI, no schema machinery — and `tosijs-3d-editor` is the tool that
depends on it. A game names the one it actually wants, which a subpath of
something called `-editor` never quite manages.

So a shipped game carries the format and the loader and no editor — and the
editor and the game call the *same* instantiator, which is what makes "what you
author is what you get" true by construction rather than by discipline.

The editor's UI is built on **tosijs-3d's SVG UI**, not DOM widgets, so it runs
in a headset as well as a browser: editing a 3D arrangement is a spatial task.
See `SPEC.md` open question 5 for the argument and its costs.

## Prior art

A working prototype lives in `../manta-recon`, where this grew inside a game
before being extracted. `PLAN.md` §"Prior art" lists what to lift.
