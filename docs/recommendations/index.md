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
