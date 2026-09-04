/*#
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
*/
/*{"parent":"Format","order":4}*/
import type { Features, Piece, Role } from "./types.js";

/*
  NO ROLES SHIP WITH THE FORMAT.

  Roles are a DOMAIN's vocabulary, not the format's. `power`, `shield` and
  `critical` describe a fortification puzzle; a botanical garden, an
  architectural walkthrough and tosijs-3d's own standard scene each want a
  different set, and none of them should have to ignore a combat vocabulary
  baked into the core.

  An earlier version shipped the fortification set as built-ins. That quietly
  made the format a combat format — the thing it must not be, because "describe
  an arrangement and consume it anywhere" is the whole win.

  The fortification vocabulary is still one import away: see
  `registerCombatPreset()` in `presets/combat`.
*/
const roles = new Map<string, Features>();

/** Register a consumer-defined role. Overwrites a role of the same name. */
export function registerRole(name: string, features: Features): void {
  roles.set(name, features);
}

/**
 * Remove a role. True if it was there.
 *
 * The counterpart `registerFeature` has had all along, and its absence was a
 * real hole rather than an oversight nobody noticed: a consumer could load a
 * preset and never swap it, and a TEST that registered one silently changed
 * the answers in every other test file — which is how it surfaced. The format
 * asserts it ships no domain, and one `registerCombatPreset()` anywhere made
 * that assertion false everywhere.
 */
export function unregisterRole(name: string): boolean {
  return roles.delete(name);
}

/** Every registered role name — what the editor offers in a role picker. */
export function roleNames(): string[] {
  return [...roles.keys()];
}

/** The feature preset for a role, or `undefined` if it is not registered. */
export function roleFeatures(name: Role): Features | undefined {
  const f = roles.get(name);
  return f && structuredClone(f);
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
  const base = piece.role ? roleFeatures(piece.role) ?? {} : {};
  const out: Features = { ...base };
  for (const [name, cfg] of Object.entries(piece.features ?? {})) {
    out[name] = { ...(base[name] ?? {}), ...cfg };
  }
  return out;
}
