/*#
# tosijs-3d-ensemble

The **ensemble format**, its **instantiator**, and the **editor** that authors
them — one package, so that the editor writes exactly what the runtime reads
because it is the same code.

A game imports the format and the instantiator; the editor is never reached and
tree-shakes away:

```js
import { buildEnsemble, validate, registerBuiltInFeatures } from 'tosijs-3d-ensemble'
```

An author imports the tool as well:

```js
import { ensembleEditor } from 'tosijs-3d-ensemble'
```

The split is enforced by a test rather than by packaging (`src/tree-shaking.test.ts`),
which is the only way it stays true: a stray import from the format layer into
the editor is exactly how this rots, and nothing else would notice.
*/

// ── The format: pure, no engine, no UI ──────────────────────────────────────
export type {
  Ensemble,
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
export { validate } from './format/validate'
export type { Problem, Severity, ValidateOptions } from './format/validate'

// ── The instantiator: needs tosijs-3d, needs no UI ──────────────────────────
export { buildEnsemble, loadEnsemble } from './runtime/build'
export type { BuildOptions, BuiltEnsemble, BuiltPiece, PlaceContext } from './runtime/build'
export { placeMesh, attachBlip } from './runtime/place-mesh'
export { registerBuiltInFeatures } from './runtime/features'

// ── The editor: an author's tool ────────────────────────────────────────────
export { EnsembleEditor, ensembleEditor } from './editor/ensemble-editor'
export type { Backdrop } from './editor/ensemble-editor'
