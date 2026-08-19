# tosijs-3d-editor

**A graphical editor for tosijs-3d assemblies.**

An *assembly* is a reusable, JSON-described arrangement of library meshes with
declared capabilities and relationships — a rig, a dome facility, a floating
fortress of shields, platforms, turrets and generators. No code, no engine
types: plain data a game loads, a tool authors, and a generator can emit.

**Status: greenfield.** Nothing is built yet.

- **`PLAN.md`** — what to build, in what order, and what "done" means.
- **`SPEC.md`** — the specification: format, editor affordances, schema system,
  test scenarios, and four design questions answered.
- **`CLAUDE.md`** — agent guidance; read the ecosystem practices first.

## The split

The assembly **format** and **instantiator** belong upstream in `tosijs-3d`
(`b3d-assembly`); this project is the graphical tool for creating them. A shipped
game carries the format and the loader and no editor at all.

That means the editor and the game call the *same* instantiator — so "what you
author is what you get" holds by construction rather than by discipline.

## Prior art

A working prototype lives in `../manta-recon`, where this grew inside a game
before being extracted. `PLAN.md` §"Prior art" lists what to lift.
