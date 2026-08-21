/*#
# Roles

A role is a **preset**, not a category: it expands to a set of features that an
explicit `features` block overrides key by key.

Roles are worth keeping alongside features because they carry INTENT. "This is
the power source" is a thing a level designer means; "destroyable with 16 hp" is
a thing a level designer types. The editor offers the first and writes the
second.

Consumers register their own roles the same way they register features — a
role defined by a game is indistinguishable from a shipped one.

```js
import { registerRole, featuresOf } from 'tosijs-3d-ensemble'

registerRole('reactor', {
  destroyable: { hp: 40, explode: true },
  blip: { faction: 'hostile', profile: 2 },
})

featuresOf({ id: 'r1', at: [0, 0, 0], role: 'reactor', features: { destroyable: { hp: 80 } } })
// → { destroyable: { hp: 80, explode: true }, blip: { faction: 'hostile', profile: 2 } }
```
*/
import type { Features, Piece, Role } from './types'

/**
 * The roles shipped with the format.
 *
 * These are the vocabulary a fortification puzzle is built from: something
 * feeds something, something projects a field, and something is the objective.
 */
const BUILT_IN: Record<string, Features> = {
  /** Armoured scenery you cannot kill. */
  structure: {},
  /** An ordinary destroyable. */
  target: {
    destroyable: { hp: 12, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  },
  /** Kill this to drop a shield. */
  power: {
    destroyable: { hp: 16, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  },
  /** A shield projector; dies with its power. */
  generator: {
    destroyable: { hp: 14, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  },
  /** The field itself: shooting it directly is possible and a bad plan. */
  shield: {
    destroyable: { hp: 120, armor: 25 },
    protector: { protection: 12 },
  },
  /** The objective, protected while its power stands. */
  critical: {
    destroyable: { hp: 20, explode: true },
    blip: { faction: 'hostile', profile: 1 },
  },
}

const roles = new Map<string, Features>(Object.entries(BUILT_IN))

/** Register a consumer-defined role. Overwrites a role of the same name. */
export function registerRole(name: string, features: Features): void {
  roles.set(name, features)
}

/** Every registered role name — what the editor offers in a role picker. */
export function roleNames(): string[] {
  return [...roles.keys()]
}

/** The feature preset for a role, or `undefined` if it is not registered. */
export function roleFeatures(name: Role): Features | undefined {
  const f = roles.get(name)
  return f && structuredClone(f)
}

/**
 * The effective features of a piece: its role's preset, then its own
 * `features` merged over the top **per feature**.
 *
 * The merge is one level deep on purpose. `features: { destroyable: { hp: 80 } }`
 * over a preset of `{ destroyable: { hp: 16, explode: true } }` keeps
 * `explode` — an author overriding one number should not silently drop the
 * rest of the feature they did not mention.
 */
export function featuresOf(piece: Piece): Features {
  const base = piece.role ? roleFeatures(piece.role) ?? {} : {}
  const out: Features = { ...base }
  for (const [name, cfg] of Object.entries(piece.features ?? {})) {
    out[name] = { ...(base[name] ?? {}), ...cfg }
  }
  return out
}
