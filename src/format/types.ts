/*#
# The ensemble format

An **ensemble** is a reusable, JSON-described arrangement of library meshes with
declared capabilities and relationships — a rig, a dome facility, a fortress of
shields, platforms, turrets and generators.

Plain JSON. **No functions, no code, no engine types.** Everything here has to
survive a round trip through a file, a fetch, a text editor and a generator,
because the format is authored three ways: by hand, by the editor, and by a
mission compiler.

```jsonc
{
  "name": "ocean-rig",
  "kind": "rig",                    // free-form; consumers group by it
  "scale": 2.5,                     // multiplies every offset and piece scale
  "values": { "targetValue": 3, "faction": "hostile" },   // open map; the format has no opinion
  "pieces": [
    {
      "id": "pump",                 // MANDATORY and stable — see below
      "mesh": "Pump Station",       // PUBLIC library name
      "at": [0, 0, 0],              // ensemble-local metres
      "rot": [0, 0, 0],             // euler DEGREES
      "role": "power",
      "features": { "turret": { "range": 260 } }
    }
  ],
  "links": [{ "from": "pump", "to": "projector", "kind": "power", "values": { "delay": 0.4 } }]
}
```

## Four rules that are cheap now and painful later

- **`id` is mandatory**, never derived from array position. A derived id
  renumbers the world on every insertion, so a link authored yesterday points
  somewhere else today.
- **`rot` is euler DEGREES**, matching tosijs-3d's `rx`/`ry`/`rz`. Babylon is
  radians; a bare number is valid in either unit, so the wrong one gives you a
  different orientation rather than an error.
- **`mesh` is the PUBLIC library name.** `getNames()` strips `.model`,
  behaviour suffixes and the glTF loader's `_primitiveN`, so
  `building_collideCylinder_primitive0` is `building`. Never store what the
  loader happened to call a node.
- **`match` is a regex SOURCE STRING**, compiled at load. A `RegExp` does not
  survive `JSON.stringify`, and the format stops being a format.

Positions are **ensemble-local**, so the same ensemble works at sea level or on
a plateau.
*/
/*{"parent":"Format","order":1}*/

/**
 * A library of meshes the ensemble draws from.
 *
 * **An ensemble declares its own content.** Without this a file names meshes
 * like `building` and `tree` and says nothing about where they come from, so it
 * only loads somewhere that already knows — which is not "describe an
 * arrangement and consume it anywhere", it is an arrangement plus a spoken
 * instruction.
 */
export interface LibraryRef {
  /** How pieces refer to it, and the `type` of the mounted library element. */
  name: string;
  /** Where to fetch the `.glb`. */
  url: string;
}

/** Ensemble-local offset in metres: `[x, y, z]`. */
export type Vec3 = [number, number, number];

/** Euler rotation in DEGREES: `[rx, ry, rz]`. Not radians. */
export type Euler = [number, number, number];

/**
 * Roles are PRESETS, not categories — each expands to a feature set that
 * explicit `features` override.
 *
 * They exist because a role carries INTENT ("this is the power source") where a
 * feature carries MECHANISM ("destroyable, 16 hp"). A designer means the first;
 * the runtime needs the second. Consumers may register their own.
 */
export type Role = string;

/**
 * A named part INSIDE a composite mesh, matched by sub-mesh name.
 *
 * A part carries **features**, exactly as a piece does — it does not carry hit
 * points. `hp` was a field here, inherited from a fortification brief, and it
 * made the core format assume a combat game: a museum's composite model has
 * openable doors and lit cabinets, not vulnerable subsystems.
 */
export interface Subsystem {
  /** Regex **source string** (anchored is safer), compiled at load. */
  match: string;
  label: string;
  /** Capabilities of this part. `{ destroyable: { hp: 18 } }` in a combat game. */
  features?: Features;
  values?: Values;
}

/**
 * Capabilities toggled ON a piece — the central idea of the format.
 *
 * Components are not separate objects; they are capabilities of an object. A
 * pump station that shoots back is ONE piece with two features, not two
 * overlapping entities. That is also what lets features interact: "a radar
 * improves nearby turrets" is a rule *about features* and has nowhere to live
 * if every capability is its own object.
 *
 * The value type is deliberately open — a feature is whatever its registration
 * says it is (see `registerFeature`), and a consumer's feature must be
 * indistinguishable from a built-in one.
 */
export type Features = Record<string, Record<string, unknown>>;

/** A named place with no geometry: a spawn, a waypoint, a dock, a join point. */
export interface Point {
  id: string;
  /** Local to the ensemble, or to its piece when declared inside one. */
  at: Vec3;
  /** Euler DEGREES — a spawn usually cares which way it faces. */
  facing?: Euler;
  /**
   * What this place IS, as a free string.
   *
   * `spawn`, `waypoint`, `dock`, `entrance` and `join` are the conventions, not
   * the constraints. It was a closed union including `muzzle`, which both baked
   * a gun into the core format and meant a consumer's own kind was a type error
   * — the same mistake as shipping roles.
   */
  kind?: string;
  meta?: Record<string, string | number | boolean>;
}

/**
 * A volume that AI reads.
 *
 * An escort zone plus "idle craft seek escort zones" produces **formations as
 * an emergent consequence** rather than formation code — and it degrades
 * correctly, because killing the carrier removes the zone.
 */
export interface Zone {
  id: string;
  at: Vec3;
  /** Sphere for now; box/cylinder can follow when something needs them. */
  radius: number;
  /**
   * What the volume MEANS, as a free string — `escort`, `patrol`, `no-fly`,
   * `quiet`, `wifi`. Conventions, not a closed union.
   */
  kind?: string;
  /**
   * Whatever the consuming rules layer needs: `faction`, `capacity`, `dwell`.
   *
   * These were named fields, which is how "who may enter" ended up meaning
   * FACTION in a format that also has to describe a garden.
   */
  values?: Values;
  meta?: Record<string, string | number | boolean>;
}

/**
 * Abstract data with no physical presence, for a rules layer to key on.
 *
 * Deliberately open: a closed enum needs revising every time the fiction grows,
 * and the consumer that cares is a rules layer, not the renderer.
 */
export interface Values {
  [key: string]: string | number | boolean | undefined;
}

export interface Piece {
  /** Stable handle. MANDATORY — never derived from array position. */
  id: string;
  /**
   * Which declared library this piece's `mesh` comes from.
   *
   * Optional: with one library, or with unambiguous names, it is noise. It
   * earns its place the moment two libraries both export `cube` — and a piece
   * that cannot say which one it meant is a piece that renders differently
   * depending on load order.
   */
  library?: string;
  /**
   * PUBLIC library mesh name. Mutually exclusive with `ensemble`.
   *
   * Optional, and legitimately absent for an **environment primitive** — a
   * piece whose `features` ARE its body (terrain, water, clouds, ambient life,
   * a medium layer). Those stand at `at` and instantiate no library mesh.
   */
  mesh?: string;
  /**
   * Nested ensemble by name, INSTEAD of `mesh`.
   *
   * The shape is reserved so that ids, links and the encounter layer are built
   * for it from day one; **the loader does not flatten yet** and `validate`
   * reports it. See PLAN.md's non-goals — recursion is the intended end state,
   * flattening at load is how it arrives without live instances.
   */
  ensemble?: string;
  at: Vec3;
  /** Euler DEGREES, optional. */
  rot?: Euler;
  /**
   * Multiplies the ensemble scale for this piece alone.
   *
   * A number is uniform; `[x, y, z]` stretches per axis. Both spellings are
   * canonical — a number is not sugar the loader rewrites, it is what a file
   * says when the scale IS uniform, and writing `[2, 2, 2]` everywhere would
   * make the common case the noisy one.
   */
  scale?: number | Vec3;
  /** Preset that expands to features; explicit `features` win. */
  role?: Role;
  features?: Features;
  subsystems?: Subsystem[];
  /** Points attached to THIS piece, in piece-local space. */
  points?: Point[];
  /** Zones attached to THIS piece; they move and die with it. */
  zones?: Zone[];
  values?: Values;
}

/**
 * A directed relationship between two pieces: A → B, of some kind.
 *
 * The core says only that the relationship EXISTS and what it is called. What
 * it does is the consuming domain's business — a combat game reads `power` as
 * "destroying A destroys B", a building reads `feeds` as plumbing, and neither
 * needs the other's vocabulary in the format.
 *
 * It used to be defined as an "on-destruction chain reaction" with `amount`
 * (damage) and `beam` (a rendering flag). That is a game rule and a view
 * concern, both wearing the costume of a data structure.
 */
export interface Link {
  from: string;
  to: string;
  /** What kind of relationship — `power`, `feeds`, `controls`. Free string. */
  kind?: string;
  /** Whatever the domain needs: `delay`, `amount`, `beam`. */
  values?: Values;
}

export interface Ensemble {
  name: string;
  /** Libraries this ensemble's meshes come from. */
  libraries?: LibraryRef[];
  /** Free-form, for consumers to group by: `rig`, `dome-facility`, `fortress`. */
  kind?: string;
  /**
   * Multiplies every offset and piece scale.
   *
   * Scalar, unlike a piece's, and deliberately: a non-uniform scale applied to
   * an arrangement shears every piece that carries a rotation, so a "stretched"
   * ensemble would silently deform its own contents. Stretch the pieces.
   */
  scale?: number;
  pieces: Piece[];
  links?: Link[];
  points?: Point[];
  zones?: Zone[];
  values?: Values;
}
