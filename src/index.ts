/*#
# tosijs-3d-ensemble

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
*/

// ── The format: pure, no engine, no UI ──────────────────────────────────────
export type {
  Ensemble,
  LibraryRef,
  Piece,
  Link,
  Point,
  Zone,
  Subsystem,
  Features,
  Values,
  Role,
  Vec3,
  Euler,
} from './format/types'
export { featuresOf, registerRole, roleFeatures, roleNames } from './format/roles'
export {
  registerFeature,
  featureRegistration,
  registeredFeatures,
  unregisterFeature,
} from './format/registry'
export type {
  FeatureContext,
  FeatureRegistration,
  FeatureSchema,
  SceneElement,
} from './format/registry'
export { validate, registerCheck } from './format/validate'
export type { Problem, Severity, ValidateOptions } from './format/validate'

// ── The instantiator: needs tosijs-3d, needs no UI ──────────────────────────
export { buildEnsemble, loadEnsemble } from './runtime/build'
export type {
  BuildOptions,
  BuiltEnsemble,
  BuiltPiece,
  PlaceContext,
  Placement,
} from './runtime/build'
export { placeMesh, attachBlip } from './runtime/place-mesh'
export { mountLibraries, libraryNames, resolveLibrary, meshesByLibrary } from './runtime/libraries'
export { registerSceneFeatures } from './runtime/features-scene'
// The one-line embed. A RUNTIME affordance, not an editor one: a game that
// loads a scene as data wants this and nothing else in this file's last section.
export { TosiEnsemble, ensemble } from './runtime/ensemble-element'

// The fortification vocabulary is NOT re-exported here. It is a domain, and the
// format has none — `import { registerCombatPreset } from
// 'tosijs-3d-ensemble/presets/combat'` when a consumer wants it.

// ── The editor: an author's tool ────────────────────────────────────────────
export { EnsembleEditor, ensembleEditor } from './editor/ensemble-editor'
export type { Backdrop } from './editor/ensemble-editor'
