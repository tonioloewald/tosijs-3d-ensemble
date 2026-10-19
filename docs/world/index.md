# The world preset

Doors, locks, spinners and triggers — the vocabulary a **place** needs,
as opposed to a battle. Opt in the way you opt into combat:

```typescript
import { registerWorldPreset } from 'tosijs-3d-ensemble/presets/world'

registerWorldPreset()
```

## Why these are here and not upstream, yet

tosijs-3d has `b3d-trigger` (a proximity sphere) and `b3d-sound`, and nothing
else on this list. There is no way for a player to **touch** a mesh at all:
`b3d-button` is a floating Babylon GUI widget, not world geometry you can reach
out to. So doors, knobs, switches and locks have no substrate to stand on.

These are prototyped here because this project is the consumer that needs them,
and they are **candidates for promotion** — see `UPSTREAM.md`. Building them
here first means they get designed against real content instead of in the
abstract, which is the same argument that put the ensemble format here rather
than in the framework.

## `interactive` is the substrate

Everything you can operate composes on one feature. A door is not special-cased
input; it is a thing with `interactive` that happens to swing.

```jsonc
{
  "id": "front-door",
  "mesh": "door",
  "features": {
    "interactive": { "part": "Knob$", "reach": 2, "prompt": "Open" },
    "lockable": { "locked": true, "key": "brass" },
    "door": { "motion": "swing", "openDegrees": 95, "seconds": 0.7, "openOn": "use" }
  }
}
```

`part` is the trap worth knowing: on a door with a knob you must touch **the
knob**, and a knob is a sub-mesh of the door model rather than a piece of its
own. It is a regex source string, like `subsystems`, for the same reason —
a `RegExp` does not survive `JSON.stringify`.
