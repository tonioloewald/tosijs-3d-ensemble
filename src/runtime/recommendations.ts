/*#
# Scene recommendations

A document can say how it RECOMMENDS being drawn, never what a viewer must
switch on. Render quality is the viewer's: whether ambient occlusion runs is
theirs to decide, because what a device can afford is theirs. How AO should
LOOK in this scene is the author's, because they have seen it.

```json
{ "name": "cove", "recommends": { "ssaoStrength": 1.4, "ssaoRadius": 3 }, "pieces": [] }
```

A viewer that turns AO on, and wants the author's look, applies them:

```typescript
import { applyRecommendations } from 'tosijs-3d-ensemble'

scene.ssao = 'on'                       // the viewer's choice
applyRecommendations(ensemble, scene)   // the author's look
```

Nothing applies them for you: `buildEnsemble` and `<tosi-ensemble>` leave the
host alone, so a viewer's own tuning is never overwritten. The editor previews
with them when its AO toggle is on.
*/
/*{"parent":"Runtime","order":12}*/
import type { Ensemble } from "../format/types.js";

/** The recommendations this package knows, each a `<tosi-b3d>` property. */
export const RECOMMENDED_KEYS = ["ssaoStrength", "ssaoRadius"] as const;

/**
 * Copy an ensemble's recommendations onto a `<tosi-b3d>` (or anything with
 * the same properties). Only known keys holding finite non-negative numbers;
 * anything else is `validate`'s to report and is skipped here.
 *
 * Returns what it applied, so a caller can say so.
 */
export function applyRecommendations(
  ensemble: Pick<Ensemble, "recommends">,
  host: object
): Record<string, number> {
  const applied: Record<string, number> = {};
  const rec = ensemble.recommends as Record<string, unknown> | undefined;
  if (!rec || typeof rec !== "object") return applied;
  for (const key of RECOMMENDED_KEYS) {
    const value = rec[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      (host as Record<string, unknown>)[key] = value;
      applied[key] = value;
    }
  }
  return applied;
}
