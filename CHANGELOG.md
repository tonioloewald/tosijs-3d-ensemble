# Changelog

All notable changes to this project are documented here, in
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [0.1.1] — 2026-09-03

### Fixed

- **0.1.0 could not be imported at all.** It imports `DEFAULT_LIGHT` from
  `tosijs-3d`, a symbol published only in **0.7.8**, while the peer range said
  `^0.7.0`. An adopter on 0.7.4 — inside the advertised range — got
  `SyntaxError: Export named 'DEFAULT_LIGHT' not found`, and because
  `features-scene` is re-exported from the barrel it took `validate`,
  `buildEnsemble` and `registerFeature` down with it. The first import line in
  `MIGRATING.md` was the one that could not work. Reported as #1 by the first
  consumer to install it.

  **0.7.4, 0.7.5, 0.7.6 and 0.7.7 are all affected** — the range promised four
  published versions that every one of them failed. If you installed 0.1.0, you
  need both this release and `tosijs-3d@^0.7.8`.

  The peer range is now `^0.7.8`, which is the version the code was actually
  written against.

### Added

- **A test that the peer range is a promise we keep.** No test of the CODE could
  have caught this — the code is correct against the version on disk; what was
  wrong was the promise. So `src/peer-range.test.ts` asserts we develop against
  the **floor** of the range we advertise, and that the dev dependency is pinned
  to that floor rather than a caret that drifts upward silently. With that
  invariant, anything importable exists in the floor by construction.

## [0.1.0] — 2026-09-03

First release. The **ensemble** format, its instantiator, and a graphical editor
for authoring them: a reusable, JSON-described arrangement of library meshes with
declared capabilities and relationships. No code, no engine types — plain data a
game loads, a tool authors, and a generator can emit.

### Added

- **The format** — `pieces` with `id`, `mesh`, `at`, `rot`, `scale` and
  `features`; `links`, `points`, `zones`, `libraries`, and a `preview` block of
  scenery for the author that no consumer ever builds.
- **`validate()`** — returns `{severity, code, message, path}[]` and never
  throws, so an editor can show everything and keep working while a generator
  decides whether to emit.
- **`buildEnsemble()`** — the instantiator, with two-phase `bind`/`link` so a
  feature reaching sideways cannot race array order.
- **Registries, open to consumers** — `registerFeature`, `registerRole`,
  `registerCheck`. A consumer's feature is indistinguishable from a built-in in
  the format, the editor and the file.
- **Scene features** — `sun`, `light`, `lamp`, `ambient`, `skybox`, `clouds`,
  `fog`, `reflections`, `ground`, `terrain`, `water`, `camera`, `sound`. The
  standard demo scene is an ensemble, and loading it is one line.
- **Presets** — `presets/world` (doors, locks, animation, spin, triggers) and
  `presets/combat` (the fortification vocabulary and its unreachable-shield
  rule), both tree-shaken out of a scene-only import.
- **`ensembleEditor`** — a working editor component: piece list, schema-driven
  property panels, a fused transform widget, insert, duplicate, delete, undo,
  and load/save. Tree-shakes away entirely for a consumer that only builds.
- **`migrate()` and `bin/migrate.ts`** — bring a legacy prefab up to the format:
  ids from mesh names (never from array indices), and `hp` lifted into
  `features.destroyable`. Idempotent and non-mutating; dry by default.

### Known limitations

Stated plainly because the alternative is somebody discovering them:

- **The built-in features are thin bindings that have not been exercised in a
  scene.** Validation, role merging, bind/link ordering, idempotent rebuilds and
  tree-shaking are all covered by tests; turrets firing, chains, protection and
  terrain shape are not. Treat them as unverified.
- **The editor has never run in a headset**, which is the reason its chrome is
  built on tosijs-3d's SVG UI rather than DOM widgets.
- **No manipulator upstream** — the transform widget is this project's own.
- **`radar` and other consumer features are the consumer's to register.**
  `validate` warns about an unregistered feature rather than failing, so a file
  can be authored against a vocabulary the validator has never seen.

### Requires

`tosijs-3d ^0.7.0` — never a prerelease range; `0.7.0-rc.1` was published before
the betas and semver sorts beta below rc, so `^0.7.0-beta.6` resolves backwards.

[0.1.1]: https://github.com/tonioloewald/tosijs-3d-ensemble/releases/tag/v0.1.1
[0.1.0]: https://github.com/tonioloewald/tosijs-3d-ensemble/releases/tag/v0.1.0
