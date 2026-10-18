# The combat preset

The fortification vocabulary — `destroyable`, `turret`, `launcher`, `radar`,
`protector`, `blip`, `launchpad`, and the roles that compose them — as an
**opt-in import**.

```js
import { registerCombatPreset } from 'tosijs-3d-ensemble/presets/combat'

registerCombatPreset()
```

## Why this is not in the core

The format describes an arrangement; it has no domain. A scene that is a
botanical garden, an architectural walkthrough or tosijs-3d's own standard demo
has no use for hit points, and should not have to ignore them — nor should its
author see `shield` in a role picker.

An earlier version shipped these as built-ins beside `terrain` and `water`, and
put a shield-reachability rule inside `validate` itself. That quietly made a
general scene format into a combat format. Everything here is the same code,
moved behind a call the consumer makes.

## What it registers

- **Features** — the capabilities above, bound to tosijs-3d's combat components.
- **Roles** — `structure`, `target`, `power`, `generator`, `shield`, `critical`,
  as feature presets an author picks by INTENT.
- **A validation rule** — a piece that projects a field with no incoming link is
  an unsolvable objective, which looks entirely normal until a player spends
  five minutes failing to kill something. That rule is meaningful only here.
