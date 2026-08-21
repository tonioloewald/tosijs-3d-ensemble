# AGENTS.md

> **Shared engineering practices** live at
> **https://github.com/tonioloewald/tosijs-coding-practices** — and, when checked out
> beside this repo, at [`../tosijs-coding-practices`](../tosijs-coding-practices/README.md).
> Read that index first for the cross-project defaults (development, testing, code
> quality, performance, review, releasing, deployment, and the **observant** tosijs/tjs
> stack). This file records only what is **specific to or divergent from** those
> defaults — when they conflict, this file wins.
>
> Those docs are **living, not graven in stone.** Don't rewrite them unprompted, but do
> speak up: voice concerns, flag inconsistencies, and suggest improvements as you work.
> Continuous improvement is the goal — see the repo's `CONTRIBUTING.md`.

Project-specific guidance lives in [`CLAUDE.md`](CLAUDE.md) — commands, architecture,
the decisions that reversed, and the traps this project will hit. The specification is
[`SPEC.md`](SPEC.md); the build order is [`PLAN.md`](PLAN.md); gaps this project needs
closed upstream are in [`UPSTREAM.md`](UPSTREAM.md).

## Divergences from the assumed stack

- **UI: tosijs-3d's SVG UI, not tosijs-ui's DOM widgets**, for the editor's chrome.
  One implementation renders as a DOM overlay AND as an in-scene texture, so the tool
  runs in a headset. tosijs-ui is still the build/doc system and the widget library
  everywhere else. The argument, and what it costs, is `SPEC.md` open question 5.
- **`tosijs-3d` is consumed as a `file:` tarball** from `../local-packages/` until
  0.7.0 reaches npm (`practices/releasing.md`, "Bypassing the publish loop"). Delete
  the `file:` dep the moment it publishes — a stopgap that outlives its reason is a
  fork nobody declared.
