# What a consumer imports

The **ensemble format**, its **instantiator**, and the **editor** that authors
them — one package, so that the editor writes exactly what the runtime reads
because it is the same code.

**It is not a combat format.** It describes an arrangement — a fortification, a
botanical garden, or tosijs-3d's own standard scene (sun, sky, shadows, ground)
— and a consumer loads it in one line:

```typescript
import { registerSceneFeatures, loadEnsemble } from 'tosijs-3d-ensemble'

registerSceneFeatures()
await loadEnsemble('/ensembles/standard-scene.json', { scene })
```

Hit points, turrets and shields live in an opt-in preset, because most things
in most scenes can never be shot:

```typescript
import { registerCombatPreset } from 'tosijs-3d-ensemble/presets/combat'
```

An author imports the tool as well:

```typescript
import { ensembleEditor } from 'tosijs-3d-ensemble'
```

The split is enforced by a test rather than by packaging (`src/tree-shaking.test.ts`),
which is the only way it stays true: a stray import from the format layer into
the editor is exactly how this rots, and nothing else would notice.
