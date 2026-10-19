# Building an ensemble

`buildEnsemble` turns authored JSON into live scene objects. **The editor and
the game call this same function** — which is what makes "what you author is
what you get" true by construction rather than by discipline.

```typescript
import { buildEnsemble, loadEnsemble } from 'tosijs-3d-ensemble'

const built = buildEnsemble(ensemble, {
  scene: document.querySelector('tosi-b3d'),
  origin: [0, 0, 1200],
  library: 'enemies',
})

built.problems       // validation, non-fatal
built.pieces.get('reactor')?.element
built.dispose()      // and the scene is as it was
```

## Two phases, then teardown

1. **bind** — every piece gets its element, then each of its features creates
   its behaviour and returns a handle. Nothing may reach for a neighbour here.
2. **link** — every feature's `link` runs, and the instantiator wires the
   ensemble's `links` (chain reactions). Neighbours are all present by now.
3. **dispose** — teardown in reverse registration order.

Step 3 is not an afterthought. The editor rebuilds on every edit, so this path
runs hundreds of times a session where a game runs it once, and a leak a game
never notices will eat an editing session.

## Creating an element is not adding it

`b3dDestroyable()` only MAKES an element — nothing happens until it is appended.
The declarative `b3d({...}, ...children)` form does that implicitly, which is
why loading at runtime is where it bites: no error, no pieces, nothing in the
console. Every element this module creates is appended explicitly.
