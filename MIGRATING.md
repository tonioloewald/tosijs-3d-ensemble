# Migrating manta-recon onto `tosijs-3d-ensemble`

`manta-recon` is where this format came from — `src/prefab.ts` and
`src/prefab-runtime.ts` are its ancestors, extracted for the reasons in
`SPEC.md`. This is the guide for putting it back, and it is short because the
formats barely diverged.

> Tracked as
> [manta-recon#1](https://github.com/tonioloewald/manta-recon/issues/1). The
> cross-project rule holds: nothing in this document changes a file in that repo
> — it says what its owner should do, and this copy ships with the package so it
> is reachable by anyone who only installed it.

> **Requires `tosijs-3d@^0.7.8`.** 0.1.0 advertised `^0.7.0` and imported a
> symbol only 0.7.8 exports, so it could not be imported on 0.7.4–0.7.7 — see
> the changelog. Use 0.1.1 or later.

## Where it stands, measured

Run against `static/prefabs/*.json` as they are today:

| prefab                 | validates   | builds       | needs                  |
| ---------------------- | ----------- | ------------ | ---------------------- |
| `shielded-target.json` | clean       | all 4 pieces | **nothing**            |
| `ocean-rig.json`       | one warning | all 3 pieces | a `radar` registration |
| `dome-facility.json`   | 7 errors    | all 7 pieces | `migrate`              |
| `pyramid-base.json`    | 6 errors    | all 6 pieces | `migrate`              |

All four **build every piece** already. The errors are one cause: 13 pieces
with no `id`.

And nothing of Manta's is lost — `subsystems`, piece-level `values`, `zones`,
`points` and top-level `values` all survive a load/save round trip. That was the
risk worth checking first, because a format that quietly drops a consumer's data
cannot be adopted and would not have shown up as an error.

The gate lives at `src/manta-mvp.test.ts` in this repo and re-runs the whole
table; it skips when the sibling checkout is absent.

## Four steps

### 1. Migrate the files

```bash
cd ../tosijs-3d-ensemble
bun bin/migrate.ts ../manta-recon/static/prefabs/*.json          # report
bun bin/migrate.ts --write ../manta-recon/static/prefabs/*.json  # apply
```

Dry by default. It is idempotent, so re-running it is safe and the dry run
cannot differ from the write.

It gives each id-less piece an id **from its mesh name** — `"Dome Mystery"` →
`dome-mystery` — and moves `hp` from the piece into `features.destroyable.hp`.
Ids are not derived from the array index on purpose: that is the fault this
format exists to refuse, and baking it into a file people hand-edit would make
it permanent.

`docs/prefabs/*.json` appear to be copies; migrate them too or delete them.

### 2. Register `radar`

`ocean-rig` uses a `radar` feature nobody has registered, so `validate` warns and
the feature does nothing at build. **This should not come from us.** Features are
a registry open to consumers, and a consumer's feature is meant to be
indistinguishable from a built-in — Manta registering its own is that property
being exercised, not a gap being filled:

```ts
import { registerFeature } from "tosijs-3d-ensemble";

registerFeature({
  name: "radar",
  icon: "📡",
  schema: {
    type: "object",
    title: "Radar",
    properties: {
      /* … */
    },
  },
  bind: (piece, cfg, ctx) => {
    /* whatever prefab-runtime did */
  },
});
```

### 3. Swap the imports

```ts
// was
import { validatePrefab, type Prefab } from "./prefab";
import { buildPrefab } from "./prefab-runtime";

// now
import {
  validate,
  buildEnsemble,
  registerSceneFeatures,
  type Ensemble,
} from "tosijs-3d-ensemble";
import { registerCombatPreset } from "tosijs-3d-ensemble/presets/combat";

registerSceneFeatures(); // sun, sky, ground, terrain, water, lamp…
registerCombatPreset(); // destroyable, turret, launcher, protector, blip,
// launchpad, and the roles Manta's files already use
```

The combat preset registers exactly the roles those prefabs use — `structure`,
`target`, `power`, `generator`, `shield`, `critical` — which is unsurprising,
since it was written from them.

### Building one

```js
import { buildEnsemble, placeMesh } from "tosijs-3d-ensemble";

const built = buildEnsemble(ensemble, {
  scene, // <tosi-b3d>
  origin, // where the ensemble's local origin sits
  library: "enemies", // fallback for pieces that name no library of their own
  placePiece: placeMesh, // ⚠️ REQUIRED for any ensemble with meshes
});
```

⚠️ **`placePiece` does not default.** It looks like it should, and this
package's own doc comment claimed it did until manta-recon#3 — with it omitted,
every piece is _recorded_ and none is _placed_, which reported "20 of 20 built,
zero problems" and put no geometry in the scene.

It cannot default: `placeMesh` imports tosijs-3d, which needs a DOM at module
load, while `buildEnsemble` imports cleanly under plain Node — which is what
lets a generator validate and build headlessly. So the DOM dependency is yours
to declare. Omitting it now reports `no-placer`, and a piece the placer
declines reports `no-body`.

⚠️ **Headless means the DEEP import.** A generator with no browser writes:

```typescript
import { buildEnsemble } from "tosijs-3d-ensemble/runtime/build";
import { validate } from "tosijs-3d-ensemble/format/validate";
```

The package's main entry also exports `ensembleEditor`, a custom element, so
evaluating the barrel needs `HTMLElement` and throws under Node. Tree-shaking
saves a bundler; a plain `import()` evaluates the whole module graph. In a
browser or through a bundler, import from `'tosijs-3d-ensemble'` as usual.

⚠️ **Three problem codes are new, and two are errors.** `no-placer` and
`no-body` report at severity `error`, and `meshes-unchecked` as a warning — so a
document that validated clean under 0.2.0 can report problems under 0.3.0
without having changed. Each of them is a silence being broken rather than a
new rule: the old behaviour is what let a build report "20 of 20 built, zero
problems" with nothing in the scene. If your gate is
`problems.some((p) => p.severity === 'error')`, expect it to fire on a build
that never passed `placePiece`.

Two differences worth knowing:

- **`validate` returns `{severity, code, message, path}[]` and never throws.** An
  editor shows everything and keeps working; a generator decides whether to
  emit. Filter on `severity === 'error'` where `validatePrefab` used to throw.
- **`registerCombatPreset()` returns a teardown**, so the vocabulary can be
  swapped rather than only added.

### 4. Delete `prefab.ts` and `prefab-runtime.ts`

754 lines. `src/main.ts` and `src/prefab-editor.ts` are the only importers.

`prefab-editor.ts`, `bench-gizmo.ts` and `bench-view.ts` are a separate question
— this package has its own editor (`ensembleEditor`) but it is not yet a
drop-in replacement for the bench, so keep them until it is.

## What "done" means

`bun test` in this repo, with the sibling checked out, reports all four prefabs
validating clean and building every piece. That is milestone 1, and it is the
proof the API is right — which is why it comes before building anything else on
top of it.

## Upgrading from 0.3 to 0.4

Three things change underneath an existing document. None of them needs an edit
to a well-formed file, but each can change what renders.

- **`tosijs-3d` is now `^0.8.4`.** The sun runs a northern-hemisphere arc and
  `starfieldTilt` no longer moves it (0.8.3), and every `PRNG`-seeded output
  re-rolls (0.8.4). A seeded cloud field or galaxy looks different with the
  same document. Scenes tuned by eye should be looked at again.
- **Fetched urls must be https** (or relative — and that now includes
  localhost: `http://localhost` is refused, use `https://localhost`), for
  libraries AND for fetched feature fields (`starfieldData`, `starfieldCube`,
  `nebulaTexture`, `ground.texture`, `water.normalMap`, `clouds.model`,
  `sound.url`). A refused url is reported by `validate` AND not fetched: the
  library is not mounted, the field never reaches its element. So a document
  that pointed at an `http://` host renders WITHOUT that library or field,
  where it used to render with it. Run `validate` over your files before
  upgrading; `insecure-library-url` / `insecure-feature-url` name each one.
- **A fetched field must hold a string.** Anything else is refused rather than
  stringified.

For manta-recon specifically, measured on 2026-09-26: its eight assemblies
(`static/assemblies/*.json`) declare no libraries and no fetched feature
fields, and 0.4's `validate` reports no url problem in any of them, so the url
rule does not touch them. What was NOT measured is the peer-floor change: the
moved sun and the re-rolled seeds are visual, and need eyes on a Manta scene.

## Upgrading from 0.4 to 0.5 (unreleased)

Two things change underneath an existing document:

- **An unset field now renders at its SCHEMA default**, the value the editor's
  panel shows, where it used to render at the ELEMENT's default. For a field a
  document sets, nothing changes. For one it leaves out, these move:

  | feature | field: was (element) → now (schema) |
  | --- | --- |
  | `ground` | `width`/`height` 4 → 400 m, `texture` none → `checker`, `textureTiles` 8 → 20 |
  | `sun` | `activeDistance` 30 → 400, `numCascades` 0 → 2, `shadowTextureSize` 0 → 1024, `shadowDarkness` 0.1 → 0.4 |
  | `skybox` | `timeOfDay` 6.5 → 11 (`realtimeScale` was already 0) |
  | `light` | `intensity` 1 → 0.9 |
  | `fog` | `mode` linear → exp2, `density` 0.01 → 0.002, `start`/`end` 60/120 → 100/4000, `color` #bfd9f2 → #8fa6b2, `syncSkybox` off → on |
  | `water` | `waterSize` 128 → 2000, `waveHeight` 0 → 0.3, `windForce` −5 → 6, `waterColor` #0066cc → #0a3d5c |
  | `terrain` | `seed`, `surfaceType` (cylinder → plane), `radius`, `horizScale`, both amplitudes, `tileSize`, `lodLevels` |
  | `clouds` | `count`, `altitude`, `thickness`, `spread`, `opacity` |
  | `sound` | `loop`/`autoplay`/`spatialSound` off → on, `maxDistance` 100 → 60 |
  | `reflections` | `probeSize` 0 (off) → 128, `maxDistance` 100 → 200 |

  To keep a scene exactly as it rendered, write the old value into the
  document. A key you REMOVE now resets to its default, rather than the
  element keeping the last value it had.
- **`tosijs-3d` is now `^0.9.0`**, and `moon` and `sound` take their schemas
  from it. Their accepted ranges widen (a moon's `size` to 0.05°; a sound's
  `volume` to 2 and its distances tenfold), so nothing that validated before
  stops validating.
- **`terrain.biomeTemperature` changed meaning in tosijs-3d 0.9.0.** It is a
  real temperature now: `0` is 0 °C, `1` is 50 °C, `-1` is -50 °C (no longer
  "default"). It used to be the biome chart's `0…1` axis. Convert a value a
  document sets with `(old - 0.36) / 0.8`. A `-1` (the old "default") is read
  as the default and `migrate()` removes it, so it needs nothing. A value left
  unset needs nothing either.
