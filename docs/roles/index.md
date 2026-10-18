# Roles

A role is a **preset**, not a category: it expands to a set of features that an
explicit `features` block overrides key by key.

Roles are worth keeping alongside features because they carry INTENT. "This is
the power source" is a thing a level designer means; "destroyable with 16 hp" is
a thing a level designer types. The editor offers the first and writes the
second.

**The format ships no roles at all.** A role is a domain's vocabulary, and the
format has no domain — so a consumer registers the set its world needs. The
fortification vocabulary that used to be built in (`power`, `shield`,
`critical`, …) is one import away in `presets/combat`.

```js
import { registerRole, featuresOf } from 'tosijs-3d-ensemble'

registerRole('reactor', {
  destroyable: { hp: 40, explode: true },
  blip: { faction: 'hostile', profile: 2 },
})

featuresOf({ id: 'r1', at: [0, 0, 0], role: 'reactor', features: { destroyable: { hp: 80 } } })
// → { destroyable: { hp: 80, explode: true }, blip: { faction: 'hostile', profile: 2 } }
```
