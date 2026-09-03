# Migrating manta-recon onto `tosijs-3d-ensemble`

`manta-recon` is where this format came from — `src/prefab.ts` and
`src/prefab-runtime.ts` are its ancestors, extracted for the reasons in
`SPEC.md`. This is the guide for putting it back, and it is short because the
formats barely diverged.

> Written here rather than filed as an issue on `manta-recon` because that
> checkout has **no git remote**, so it has no tracker to file against. The
> cross-project rule still holds: nothing in this document changes a file in
> that repo — it says what its owner should do.

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
