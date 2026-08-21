/*#
# Validation

`validate(ensemble, { meshes })` returns problems and **never throws**. The two
consumers want different things from the same call: an editor shows everything
and keeps working, while a generator must decide whether to emit.

A bare `string[]` forces the generator to either reject on cosmetic warnings or
parse prose to tell them apart — and it will parse prose. So a problem is
structured:

```typescript
import { validate } from 'tosijs-3d-ensemble'

const problems = validate(ensemble, { meshes: new Set(library.getNames()) })
const fatal = problems.filter((p) => p.severity === 'error')
```

`path` is a JSON Pointer into the ensemble, which is what lets the editor put a
message **on the field** rather than in a list at the bottom of the screen.

## Two checks worth more than the rest

- **An unreachable shield.** A piece with a `protector` feature and no incoming
  link is an unsolvable objective — and it looks entirely normal until a player
  spends five minutes failing to kill something. The check is keyed on the
  FEATURE rather than the `shield` role, so a consumer's own role gets it too.
- **Unknown meshes, only when the library is loaded.** A validation error that
  is really a loading race is worse than none, because it accuses good content.
  Pass `meshes` when you have it and omit it when you don't.
*/
import { featuresOf, roleFeatures } from './roles'
import { featureRegistration } from './registry'
import type { Ensemble, Piece, Point, Vec3, Zone } from './types'

export type Severity = 'error' | 'warning'

export interface Problem {
  severity: Severity
  /** Stable machine-readable kind. Match on this, never on `message`. */
  code: string
  message: string
  /** JSON Pointer into the ensemble, e.g. `/pieces/2/mesh`. */
  path: string
}

type Check = (ensemble: Ensemble) => Problem[]

const checks = new Set<Check>()

/**
 * Register a DOMAIN rule.
 *
 * The format validates structure — ids, references, positions, whether a link
 * points at a piece that exists. It knows nothing about what an ensemble MEANS,
 * and it must not: "a field with no incoming link is unsolvable" is a rule about
 * a combat puzzle, and an architectural walkthrough would be baffled by it.
 *
 * So domain rules are registered, the same way features are. `presets/combat`
 * registers the shield-reachability rule that used to live in this file.
 *
 * ```typescript
 * registerCheck((ensemble) =>
 *   ensemble.pieces.filter((p) => p.features?.door && !p.points?.length).map((p) => ({
 *     severity: 'warning',
 *     code: 'door-without-hinge-point',
 *     message: `"${p.id}" is a door with nowhere to hinge`,
 *     path: `/pieces/${ensemble.pieces.indexOf(p)}`,
 *   }))
 * )
 * ```
 */
export function registerCheck(check: Check): () => void {
  checks.add(check)
  return () => checks.delete(check)
}

export interface ValidateOptions {
  /**
   * Public library mesh names, when a library is loaded. Omit while it is
   * still loading — see the note above about accusing good content.
   */
  meshes?: Set<string>
  /**
   * Also check roles and features against the live registries. Default true.
   * These are warnings, not errors: a host may register its own after load.
   */
  checkRegistry?: boolean
}

const isVec3 = (v: unknown): v is Vec3 =>
  Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number' && Number.isFinite(n))

/** Validate an ensemble. Returns problems; never throws. */
export function validate(ensemble: Ensemble, opts: ValidateOptions = {}): Problem[] {
  const { meshes, checkRegistry = true } = opts
  const problems: Problem[] = []
  const add = (severity: Severity, code: string, message: string, path: string) =>
    problems.push({ severity, code, message, path })

  if (!ensemble || typeof ensemble !== 'object') {
    add('error', 'not-an-object', 'ensemble is not an object', '')
    return problems
  }
  if (!ensemble.name) add('error', 'no-name', 'ensemble has no name', '/name')
  if (!Array.isArray(ensemble.pieces) || ensemble.pieces.length === 0) {
    add('error', 'no-pieces', 'ensemble has no pieces', '/pieces')
    return problems
  }

  const ids = new Set<string>()
  ensemble.pieces.forEach((p: Piece, i: number) => {
    const at = `/pieces/${i}`

    if (!p.id) {
      // Not defaulted from the index on purpose: a derived id renumbers the
      // world on every insertion, and yesterday's link points somewhere else.
      add('error', 'no-piece-id', `piece ${i} has no id`, `${at}/id`)
    } else if (ids.has(p.id)) {
      add('error', 'duplicate-piece-id', `duplicate piece id "${p.id}"`, `${at}/id`)
    } else {
      ids.add(p.id)
    }

    if (p.ensemble) {
      add(
        'error',
        'nested-not-supported',
        `piece "${p.id}" nests ensemble "${p.ensemble}" — the loader does not flatten yet`,
        `${at}/ensemble`
      )
    } else if (!p.mesh) {
      // A piece with no mesh is legitimate when a feature IS its body — an
      // environment primitive (terrain, water, clouds, a medium layer) stands
      // for itself. A piece with neither a mesh nor a feature is nothing.
      if (!Object.keys(p.features ?? {}).length && !p.role) {
        add('error', 'empty-piece', `piece "${p.id}" has no mesh and no features`, at)
      }
    } else if (meshes && !meshes.has(p.mesh)) {
      add('error', 'unknown-mesh', `"${p.mesh}" is not in the library`, `${at}/mesh`)
    }
    if (p.mesh && p.ensemble) {
      add('error', 'mesh-and-ensemble', `piece "${p.id}" has both mesh and ensemble`, `${at}/mesh`)
    }

    if (!isVec3(p.at)) add('error', 'bad-position', `piece "${p.id}" has no valid position`, `${at}/at`)
    if (p.rot !== undefined && !isVec3(p.rot)) {
      add('error', 'bad-rotation', `piece "${p.id}" has an invalid rotation`, `${at}/rot`)
    }

    if (checkRegistry && p.role && !roleFeatures(p.role)) {
      add('warning', 'unknown-role', `role "${p.role}" is not registered`, `${at}/role`)
    }
    if (checkRegistry) {
      for (const name of Object.keys(p.features ?? {})) {
        if (!featureRegistration(name)) {
          add('warning', 'unknown-feature', `feature "${name}" is not registered`, `${at}/features/${name}`)
        }
      }
    }

    p.subsystems?.forEach((ss, j) => {
      try {
        new RegExp(ss.match)
      } catch {
        add('error', 'bad-subsystem-match', `"${ss.match}" is not a valid regex`, `${at}/subsystems/${j}/match`)
      }
    })

    checkPlaces(p.points, p.zones, at, add)
  })

  checkPlaces(ensemble.points, ensemble.zones, '', add)

  ;(ensemble.links ?? []).forEach((l, i) => {
    if (!ids.has(l.from)) {
      add('error', 'unknown-link-source', `link from unknown piece "${l.from}"`, `/links/${i}/from`)
    }
    if (!ids.has(l.to)) {
      add('error', 'unknown-link-target', `link to unknown piece "${l.to}"`, `/links/${i}/to`)
    }
  })

  // Domain rules registered by a consumer (or by a preset). The format itself
  // knows nothing about shields, occupancy or fire lanes — see `registerCheck`.
  for (const check of checks) {
    try {
      problems.push(...check(ensemble))
    } catch {
      /* a broken rule must not take the whole report with it */
    }
  }

  return problems
}

function checkPlaces(
  points: Point[] | undefined,
  zones: Zone[] | undefined,
  base: string,
  add: (s: Severity, c: string, m: string, p: string) => void
): void {
  const pointIds = new Set<string>()
  points?.forEach((pt, i) => {
    const at = `${base}/points/${i}`
    if (!pt.id) add('error', 'no-point-id', `point ${i} has no id`, `${at}/id`)
    else if (pointIds.has(pt.id)) add('error', 'duplicate-point-id', `duplicate point id "${pt.id}"`, `${at}/id`)
    else pointIds.add(pt.id)
    if (!isVec3(pt.at)) add('error', 'bad-position', `point "${pt.id}" has no valid position`, `${at}/at`)
  })

  const zoneIds = new Set<string>()
  zones?.forEach((z, i) => {
    const at = `${base}/zones/${i}`
    if (!z.id) add('error', 'no-zone-id', `zone ${i} has no id`, `${at}/id`)
    else if (zoneIds.has(z.id)) add('error', 'duplicate-zone-id', `duplicate zone id "${z.id}"`, `${at}/id`)
    else zoneIds.add(z.id)
    if (!isVec3(z.at)) add('error', 'bad-position', `zone "${z.id}" has no valid position`, `${at}/at`)
    if (!(typeof z.radius === 'number' && z.radius > 0)) {
      add('error', 'bad-radius', `zone "${z.id}" needs a positive radius`, `${at}/radius`)
    }
  })
}
