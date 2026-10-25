/*#
# The feature registry

A feature is a **registration**, not a case in a switch. That is what makes the
format open: a consumer's feature is indistinguishable from a shipped one in the
file, in the editor's palette, in `ref` pick lists, and in save/load.

```typescript
import { registerFeature } from 'tosijs-3d-ensemble'

registerFeature({
  name: 'turret',
  schema: {
    type: 'object',
    title: 'Turret',
    properties: {
      range: { type: 'number', minimum: 20, maximum: 2000, default: 260, 'x-unit': 'm' },
      smart: { type: 'boolean', default: false, description: 'leads its target' },
    },
  },
  bind(piece, cfg, ctx) {
    const el = b3dTurret({ ...cfg, x: ctx.at[0], y: ctx.at[1], z: ctx.at[2] })
    ctx.scene.appendChild(el)
    ctx.onDispose(() => el.remove())
    return el
  },
})
```

## A field your feature FETCHES must say so

Mark it `format: 'uri-reference'` — standard JSON Schema — and list any
non-url values it also accepts in `x-keywords`:

```typescript
properties: {
  image: { type: 'string', format: 'uri-reference', 'x-keywords': ['none'] },
}
```

Then `validate` holds it to the https rule (`insecure-feature-url` /
`unsupported-feature-url`) and `declaredConfig` refuses it before `bind`, so
your element never receives a url the rule refused — or anything that is not a
string. An UNMARKED field is not checked: the rule cannot know a string is
fetched unless the schema says it is. That is how `sound.url`, a built-in,
went unchecked until 0.4.0's review.

Structured data a feature accepts but the panel has no form for (an effect's
`recipe`) is declared in `x-data: { key: schema }`, and the urls inside it
are found by walking that schema (`deepFetchedProblems`): mark them the same
way, `format: 'uri-reference'`, wherever they sit.

## What your feature ACCEPTS is what it declares

A document's config reaches your `bind` narrowed to the keys your schema
declares: `x-accepts` when present (a full property list, as the scene
features take from upstream), otherwise `properties`. A schema that declares
neither accepts nothing; `validate` reports each key it drops. To take every
key, say so: `'x-accepts': '*'`. (It used to pass everything by default,
`innerHTML` included.)

## A field that holds a PIECE ID must say so

Mark it `'x-piece-ref': true` (or `'x-widget': 'ref'`, which also gives it
the panel's piece picker):

```typescript
properties: {
  target: { type: 'string', 'x-piece-ref': true },
}
```

Then renaming the piece it names re-points it, and nesting its ensemble
inside another prefixes it (`rig-a/leader`), so it never resolves against a
same-named piece in the parent. An unmarked id is left as written in both
cases: the format does not guess which strings are ids. `pieceRefKeys`
answers which fields are.

## A slider can name its stops

`'x-stops': [{ value: 0.5, label: 'semi-active' }, …]` on a number draws a
tick and a name at each, and the handle catches on them.

## A default is applied, unless it says not to be

A property's `default` is what `bind` (and every live update) receives when
the document leaves it unset, so a panel never shows a number nothing
produced, and removing a key puts its default back. A field something ELSE
fills in when unset (a planet's `world` preset writes its own `ocean`) marks
its default `'x-apply-default': false`: the panel shows it, and the bind
never writes it over the preset. Clearing such a field rebinds the feature,
so the preset's value comes back.

## `bind` and `link` are two phases, and that is not a style preference

A `protector` that resolves its power source during `bind` works only if the
reactor happened to bind first — so the same ensemble behaves differently
depending on the order pieces appear in the file, and reordering them in the
editor silently changes behaviour. That is a nasty bug class: it looks like an
intermittent content problem, not a lifecycle one.

So **`bind` creates and returns a handle, touching nothing else**, and
**`link` runs after every piece has bound** and is the only place `ctx.handle`,
`ctx.piecesByRole` and zone lookups are legal. Same shape as tosijs-3d's
scene-listener contract, for the same reason: a thing that reaches for its
neighbours cannot run while the neighbours are still arriving.

## Rebuilding must be idempotent

The editor rebuilds an ensemble on **every edit** — hundreds of times a session
where a game does it once. `onDispose` is necessary and not sufficient; the test
worth writing is *build → dispose → build*, asserting the scene's mesh, observer
and material counts return to where they started. A leak a game never notices
will eat an editing session.

## Guard your per-frame work

A throw inside a Babylon render observer kills the render loop **permanently** —
`notifyObservers` has no isolation and the loop does not re-queue, so the page
goes black with no error where anyone would look. A `bind`/`link` that registers
per-frame work must guard itself.
*/
/*{"parent":"Format","order":3}*/
import type { Ensemble, Link, Piece, Vec3 } from "./types.js";
import { deepFetchedProblems, fetchedValueProblem } from "./url-policy.js";

/** The scene element (`<tosi-b3d>`), structurally typed so the format layer
 *  does not import the framework. */
export type SceneElement = HTMLElement & Record<string, unknown>;

/** JSON Schema (plus `x-` UI annotations the editor reads). */
export type FeatureSchema = Record<string, unknown>;

export interface FeatureContext {
  /** The `<tosi-b3d>` element to append components to. */
  scene: SceneElement;
  /**
   * The ELEMENT carrying this piece's body, when its body is an element.
   *
   * `null` for the two common cases that are not: a piece with no mesh (an
   * environment primitive, where the feature IS the body), and a plain piece
   * instantiated straight off the library as a node — see `node`.
   */
  element: SceneElement | null;
  /**
   * The Babylon NODE carrying this piece's body, when there is no element.
   *
   * A plain piece is not an element, because it does not need to be: nothing
   * manages its transform and nothing can shoot it. Typed loosely so the format
   * layer stays free of the engine.
   */
  node: unknown;
  /** The ensemble being built, as authored. */
  ensemble: Ensemble;
  /** The piece this feature is bound to. */
  piece: Piece;
  /** WORLD position of the piece: origin + `at` × scale. */
  at: Vec3;
  /** Effective scale for this piece: ensemble scale × piece scale. */
  scale: number;
  /** Library the ensemble instantiates meshes from; `''` when there is none. */
  library: string;
  /** Register teardown. Runs on dispose, in reverse order of registration. */
  onDispose(fn: () => void): void;
  /**
   * The handle another piece's `bind` returned. **`link` phase only** — during
   * `bind` the neighbours are still arriving.
   */
  handle(pieceId: string): unknown;
  /** Pieces carrying a role. **`link` phase only.** */
  piecesByRole(role: string): Piece[];
  /**
   * Another feature's handle on **this same piece**.
   *
   * Features compose: a `door` consults `interactive` to know when it was
   * used, and `interactive` consults `lockable` to know whether it may open.
   * Without this each of them would have to reimplement the others, or the
   * format would need one god-feature that knew about all of them.
   *
   * **`link` phase only** — during `bind` a piece's own siblings are still
   * arriving, which is the same reason reaching for another PIECE is illegal
   * then. Returns `undefined` when the feature is not on this piece, which is
   * the normal case: a door without a lock is just a door.
   */
  feature(name: string): unknown;
  /**
   * The time source, so effects honour pause and time scale.
   *
   * ⚠️ This scales EFFECT timing only. Craft motion cannot be scaled from here —
   * velocity comes from `b3d-aircraft` integrating against the engine delta.
   * Real slow-motion needs `owner.simTime`/`simDt` upstream (tosijs-3d#30).
   */
  simTime(): number;
}

export interface FeatureRegistration<Handle = unknown> {
  /** The key in a piece's `features` map. */
  name: string;
  /** JSON Schema; drives validation AND the editor's property panel. */
  schema: FeatureSchema;
  /** Create the behaviour and return a handle. Touch nothing else. */
  bind?(
    piece: Piece,
    cfg: Record<string, unknown>,
    ctx: FeatureContext
  ): Handle;
  /**
   * Apply a CHANGED config to the handle this feature already returned.
   *
   * Return true if it was applied. Return false, or omit this, and the caller
   * rebuilds the whole ensemble instead — which is correct but expensive, and
   * in an editor it is visible: a rebuild disposes and re-instantiates every
   * piece, so rebuilding once per frame means no library piece ever finishes
   * loading. (When rotation was applied on a retry, dragging a sky slider
   * straightened every ship in the scene until the drag ended.) Return false
   * on purpose when an edit needs the link phase again: a field naming
   * another piece cannot be resolved by an attribute write.
   *
   * Most features are a thin mapping onto an element's attributes, and for
   * those this is one line — see `updateAttrs`.
   */
  update?(handle: Handle, cfg: Record<string, unknown>, piece: Piece): boolean;
  /** Reach for neighbours. Runs after every piece has bound. */
  link?(handle: Handle, ctx: FeatureContext): void;
  /**
   * This feature CREATES the piece's body, instead of decorating one.
   *
   * Body features bind first, and their element becomes the piece's element for
   * everything that follows.
   *
   * **No built-in uses this any more.** `destroyable` did, because
   * `b3d-destroyable` was the only way to place a library mesh and could not
   * opt out of combat — so destruction had to CREATE the body rather than
   * decorate one. tosijs-3d 0.7.2's `destroyable="off"` ended that, and
   * placement is now uniform.
   *
   * It stays in the contract for the case it was always right for: a feature
   * whose body is genuinely its own — a procedural mesh, a particle system, a
   * consumer's own geometry — rather than a decoration on a placed one.
   */
  body?: boolean;
  /**
   * What this feature LOOKS LIKE in a list, one glyph wide.
   *
   * On the registration and not in a `switch` in the editor, because the whole
   * property of a registry is that a consumer's feature is indistinguishable
   * from a built-in — and a switch breaks that at exactly the point a consumer
   * would notice: theirs is the only row with a blank icon.
   *
   * ⚠️ AN EMOJI TODAY, AN ICON NAME LATER. tosijs-3d's `iconData` holds 61
   * icons and every one is UI chrome — arrows, corners, play, trash, keyboard.
   * There is no sun, no light, no water, no mesh, no marker. Asked for in
   * tosijs-3d#64 along with an icon COLUMN type for `table`, since a cell
   * currently renders `String(v)` and has no route to a glyph.
   *
   * Emoji were verified in the browser rather than assumed: they render in
   * colour and `getComputedTextLength` measures them correctly (26.1 → 50.3px
   * for a two-character prefix), so the SVG UI lays a row out properly. That
   * was checked on the DOM overlay path ONLY — the in-scene texture path
   * rasterises the same SVG, and coloured glyphs and font fallback are exactly
   * where the two could diverge. Flagged in the issue; nobody has looked.
   */
  icon?: string;
  /**
   * This feature puts a real thing at `at`, and that thing cannot be seen.
   *
   * A lamp is a light: it has a location, it can be moved, and there is no
   * geometry anywhere to click. An editor supplies a beacon for it — see
   * `beacon-view.ts` — and this is how it knows to.
   *
   * Declared rather than inferred, because "has no geometry" is not the same
   * question. `skybox` is everywhere, `fog` and `ambient` are settings, and
   * `sun`'s `at` is a DIRECTION — a dot at `[-0.5, 1, 0.4]` would be a
   * confident lie about where the sun is. Inferring from "this piece has no
   * body" puts three junk dots near the origin.
   */
  marker?: boolean;
  /**
   * This feature can BE a piece — it is not a decoration on a placed mesh.
   *
   * The format has always allowed it: a piece with no `mesh` whose features are
   * its body is an "environment primitive", which is how `sun`, `skybox`,
   * `water` and `terrain` exist. What was missing was any way to CREATE one:
   * the insert palette lists library meshes, and every environment primitive
   * has no mesh, so an author could edit the ones a file already had and never
   * add another. "I can't add a terrain to a new scene."
   *
   * So the palette offers these under **utilities**, and a consumer's own
   * standalone feature appears there for free — the same registry property that
   * gives it an icon, a panel and a beacon.
   *
   * False for a decorator: `destroyable`, `spin`, `door` and `collidable`
   * modify a piece that already has a body, and offering them as things to
   * insert would produce pieces that are nothing at all.
   */
  primitive?: boolean;
  /**
   * Where an inserted piece of this kind goes.
   *
   * - `"point"` (the default) — where the author clicked. Right for anything
   *   that is somewhere: a lamp, a sound, a camera.
   * - `"height"` — `[0, y, 0]`, the clicked HEIGHT only. A terrain, a ground
   *   plane and a sea are unbounded in x/z, so those coordinates mean nothing
   *   and carrying them from the click writes noise into the document.
   * - a `Vec3` — a fixed position. Covers "position is meaningless" as
   *   `[0,0,0]` (a skybox, fog, ambient life) and the one case that is neither:
   *   `sun`, whose `at` is a DIRECTION, so a clicked point would aim it
   *   somewhere arbitrary and `[0,0,0]` would be degenerate.
   *
   * Owner: "some things might make sense to insert at 0,0,0 rather than
   * where-ever you click".
   */
  insertAt?: "point" | "height" | Vec3;
  /**
   * The config a NEWLY INSERTED piece of this kind starts with, written into
   * the document as the author's starting point (it is visible and
   * editable, not a hidden default). A terrain starts `center: true`, so its
   * land straddles the insert height and a sea at 0 floods the valleys
   * (owner, 2026-10-17: "sea level lining up with 0"). An earlier rule put
   * its highest possible point at the insert height, and since noise seldom
   * reaches its maximum, a new terrain sat almost entirely underwater ("WAY
   * below sea level").
   */
  insertConfig?: Record<string, unknown>;
  /**
   * ONE PER SCENE: a sky, a sun, fog, a wind. A primitive that says so is a
   * FIXED ROW in the editor's environment list, there whether or not the
   * document has it, with a state (not included, disabled, enabled) picked
   * from its circle. One that does not (a terrain, a weather cell, a sound)
   * is a SUBGROUP of the pieces that have it, ending in an inline "add".
   * Owner: "every environment component could just be in the list by default
   * rather than needing to be inserted".
   */
  single?: boolean;
  /**
   * Which category of the editor's piece list a primitive sits in.
   * `"environment"` (the default) or `"lights"`; pieces with a mesh are
   * always "objects".
   */
  group?: "environment" | "lights";
  /**
   * A visualiser the editor shows but the runtime has no binding for.
   *
   * Legitimate, but mark it — otherwise an author can build something the game
   * cannot load, and find out at ship time.
   */
  editorOnly?: boolean;
}

const features = new Map<string, FeatureRegistration<never>>();

/** Register a feature. Overwrites a registration of the same name. */
export function registerFeature<Handle>(
  reg: FeatureRegistration<Handle>
): void {
  /*
    A misspelled group (`"light"`) matched no category of the piece list, so
    the feature was hidden from the editor with nothing said (#3394). It is
    listed under "environment", and the registration is told once.
  */
  const group = (reg as { group?: unknown }).group;
  if (group !== undefined && group !== "environment" && group !== "lights")
    console.warn(
      `registerFeature("${reg.name}"): group ${JSON.stringify(
        group
      )} is not "environment" or "lights"; listing it under "environment"`
    );
  if (acceptsProblem(reg.schema))
    console.warn(
      `registerFeature("${reg.name}"): accepts no keys; see x-accepts`
    );
  features.set(reg.name, reg as FeatureRegistration<never>);
}

/**
 * The piece-list category a feature is LISTED under: its `group` when that
 * is one the editor has, else "environment", so a misspelled group is shown
 * rather than hidden (#3394).
 */
export function listedGroup(reg: {
  group?: unknown;
}): "environment" | "lights" {
  return reg.group === "lights" ? "lights" : "environment";
}

/**
 * Whether a schema fails to say what it accepts. Since
 * #3357 a schema with neither `properties` nor `x-accepts` accepts NOTHING,
 * so a consumer's feature written before that silently got empty configs;
 * and `['*']` reads like pass-through and is an allow-list of one odd key
 * (#3495, from the 0.9.0 review).
 */
function acceptsProblem(schema: FeatureSchema | undefined): boolean {
  const accepts = schema?.["x-accepts"];
  // As `acceptedKeys` reads it: anything but "*" or a key list falls back
  // to `properties`.
  return accepts === "*"
    ? false
    : Array.isArray(accepts) && accepts.length
    ? accepts.includes("*")
    : !schema?.properties;
}

/** Look up one feature registration. */
/**
 * A feature's config, narrowed to the keys its SCHEMA declares.
 *
 * ⚠️ **This is a trust boundary, and it was open.** Ten of the thirteen scene
 * features hand their config to an element as `{...cfg}` or through
 * `updateAttrs`, and a tosijs element creator applies unknown keys as
 * PROPERTIES. So a key an author never wrote — and a schema never declared —
 * reached the DOM verbatim:
 *
 * ```text
 * b3dLight({ intensity: 0.9, innerHTML: '<img src=x onerror=…>' })
 *   -> <tosi-b3d-light><img src="x" onerror="…"></tosi-b3d-light>
 * ```
 *
 * Confirmed executing in real Chromium. Nothing gated it on the way in:
 * `parseEnsemble` is `JSON.parse` plus an `Array.isArray` check, `validate`
 * checks only that the feature NAME is registered, and no schema sets
 * `additionalProperties`. Opening a shared ensemble file ran script in the
 * page's origin — which holds every `ensemble:*` draft, and the host app's
 * session wherever `<tosi-ensemble>` is embedded.
 *
 * An allow-list rather than a denylist, because the set of dangerous property
 * names is not enumerable — `innerHTML`, `outerHTML`, `srcdoc`, every `on*`,
 * and whatever a future element adds. The schema is already the exact list of
 * what a feature accepts: it drives validation and the property panel, so a
 * key outside it is one no author could have set through the editor either.
 *
 * A registration that declares neither `x-accepts` nor `properties` accepts
 * NOTHING (board #3357, 0.9.0): it gets an empty config, and `validate`
 * reports each key it dropped (`unknown-feature-key`). Pass-through is
 * something a schema has to say, with `"x-accepts": "*"`.
 */
export function acceptedKeys(
  registration: { schema?: FeatureSchema } | undefined
): Set<string> | null {
  const schema = registration?.schema as
    | (FeatureSchema & { "x-accepts"?: string[] | "*" })
    | undefined;
  /*
    `x-accepts` WINS, and the distinction cost a regression to learn.

    A scene feature's `properties` is EDITORIAL — which fields an author sees
    in a panel, 17 of terrain's 30 — so using it as the allow-list stripped
    `majorRadius` and `minorRadius` from a torus a document legitimately
    described. `x-accepts` carries the element's FULL property list, taken
    from upstream, which is what "a key this feature accepts" actually means.

    Without either, it accepts NOTHING (board #3357). It used to return
    null, "no list", and pass every key through, `innerHTML` included, to a
    feature that never said it wanted any. Pass-through is now something a
    schema says: `"x-accepts": "*"` is the only way to get null here.
  */
  const accepts = schema?.["x-accepts"];
  if (accepts === "*") return null;
  if (Array.isArray(accepts) && accepts.length) return new Set(accepts);
  const declared = schema?.properties;
  return new Set(declared ? Object.keys(declared) : []);
}

/**
 * The keys of a feature whose string values are FETCHED, each with the
 * keywords it also accepts (`ground.texture: 'checker'` is not a URL).
 *
 * Two sources, unioned: `x-fetched`, which a scene feature stamps from
 * upstream's FULL schema (so a field the panel does not offer is still
 * checked), and any declared property marked `format: 'uri-reference'`, which
 * is how a consumer's own feature says the same thing in plain JSON Schema.
 * tosijs-3d#91 is what made this possible without a hand-kept list.
 */
export function fetchedKeys(
  registration: { schema?: FeatureSchema } | undefined
): Map<string, Set<string>> {
  const schema = registration?.schema as
    | (FeatureSchema & { "x-fetched"?: Record<string, string[]> })
    | undefined;
  const out = new Map<string, Set<string>>();
  for (const [key, keywords] of Object.entries(schema?.["x-fetched"] ?? {}))
    out.set(key, new Set(keywords));
  const declared = (schema?.properties ?? {}) as Record<
    string,
    { format?: string; "x-keywords"?: string[] }
  >;
  for (const [key, spec] of Object.entries(declared)) {
    if (spec?.format === "uri-reference" && !out.has(key))
      out.set(key, new Set(spec["x-keywords"] ?? []));
  }
  return out;
}

/**
 * The fields of a feature that hold a PIECE ID: marked `"x-piece-ref": true`
 * or `"x-widget": "ref"` (the older spelling, which also chooses the panel's
 * picker). ONE rule for everything that follows ids: renaming a piece
 * re-points them, and nesting prefixes them (`format/nest.ts`). They were two
 * markers read by two codepaths, so a field marked one way was renamed but
 * not nested, or the reverse (0.8.0 review).
 */
export function pieceRefKeys(feature: string): string[] {
  const props = (
    featureRegistration(feature)?.schema as
      | {
          properties?: Record<
            string,
            { "x-piece-ref"?: boolean; "x-widget"?: string }
          >;
        }
      | undefined
  )?.properties;
  return Object.entries(props ?? {})
    .filter(
      ([, spec]) =>
        spec?.["x-piece-ref"] === true || spec?.["x-widget"] === "ref"
    )
    .map(([key]) => key);
}

/**
 * STRUCTURED DATA a feature accepts and does not show: `x-data: { key: schema }`
 * on its schema, resolved against the schema's own `$defs`. An effect's
 * `recipe` is the first: a document may carry one, the panel has no form for
 * it, and the fetched strings inside it are found by walking this schema
 * (`deepFetchedProblems`), so they meet the same rule as a top-level url.
 */
export function dataProblems(
  registration: { schema?: FeatureSchema } | undefined,
  key: string,
  value: unknown
): ReturnType<typeof deepFetchedProblems> {
  const schema = registration?.schema as
    | (FeatureSchema & { "x-data"?: Record<string, unknown> })
    | undefined;
  const spec = schema?.["x-data"]?.[key];
  return spec ? deepFetchedProblems(spec, value, schema) : [];
}

export function declaredConfig(
  registration: { schema?: FeatureSchema } | undefined,
  cfg: Record<string, unknown>
): Record<string, unknown> {
  const allowed = acceptedKeys(registration);
  /*
    A FETCHED KEY WITH A URL THE POLICY REFUSES IS CLEARED HERE TOO, not only
    reported by `validate`. Every bind and update goes through this function,
    which makes it the one place a skybox's `starfieldData` or a ground's
    `texture` can be stopped before an element fetches it. The 0.4.0 review
    found the rule enforced nowhere at runtime: `validate` reported the
    error and the element fetched the url anyway. The problem is still
    REPORTED — `buildEnsemble` runs `validate` and returns its problems — so
    nothing vanishes silently.
  */
  const fetched = fetchedKeys(registration);
  const refused = (key: string): boolean => {
    const keywords = fetched.get(key);
    return !!keywords && fetchedValueProblem(cfg[key], keywords) !== null;
  };
  const hasData = !!(
    registration?.schema as { "x-data"?: unknown } | undefined
  )?.["x-data"];
  if (!allowed && fetched.size === 0 && !hasData) return cfg;
  let changed = false;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(cfg)) {
    if (allowed && !allowed.has(key)) {
      changed = true;
      continue;
    }
    /*
      A REFUSED URL IS CLEARED, NOT DROPPED. Dropping the key left the
      element holding whatever it had before: refusing a new `http://` sky in
      the editor kept the OLD sky up, a refusal that looked like nothing
      happened (#2625). `""` is "no url": the one value the policy always
      accepts, it fetches nothing, and it clears the old one.
    */
    if (refused(key)) {
      out[key] = "";
      changed = true;
      continue;
    }
    /*
      Structured data with a refused url inside is refused WHOLE: a recipe
      minus one texture is not the recipe the author made, and null is what
      the element reads as "none" (the preset plays). Reported by `validate`.
    */
    if (dataProblems(registration, key, cfg[key]).length) {
      out[key] = null;
      changed = true;
      continue;
    }
    out[key] = cfg[key];
  }
  // Returning the SAME object when nothing changed keeps the identity
  // checks in `update` paths meaningful and costs nothing in the common case.
  return changed ? out : cfg;
}

/**
 * The config a feature's element actually gets: every default its schema
 * declares, under whatever the document says, narrowed by `declaredConfig`.
 *
 * ⚠️ WITHOUT THIS THE PANEL LIED. The editor inserts a primitive with an EMPTY
 * config ("every default in its schema applies") and the panel shows each
 * unset field at its schema default — but nothing applied them, so the
 * element ran on ITS OWN defaults. A freshly inserted ground showed 400 x 400 m
 * checker and rendered a 4 x 4 m plain plane; a sun showed 400 m of shadow
 * and cast 30; a storm cell showed storminess 1 and was calm. Measured on
 * 0.8.9: 47 authoring defaults across 13 features differed from their
 * element's, every one of them a control reading a value nothing produced.
 *
 * Applied on bind AND on update, so the two roads cannot disagree — and so a
 * key REMOVED from a document goes back to its default instead of keeping the
 * last value it had.
 *
 * For EVERY registered feature, a consumer's own included, and for TOP-LEVEL
 * properties only: a default nested inside an object property is the
 * feature's own business. A field whose value should come from somewhere else
 * when unset (terrain's `baseHeight`, which is the piece's y) must declare no
 * default, or the default wins.
 */
export function effectiveConfig(
  registration: { schema?: FeatureSchema } | undefined,
  cfg: Record<string, unknown>
): Record<string, unknown> {
  const properties = (registration?.schema?.properties ?? {}) as Record<
    string,
    { default?: unknown; "x-apply-default"?: boolean }
  >;
  const defaults: Record<string, unknown> = {};
  for (const [key, spec] of Object.entries(properties))
    if (
      spec &&
      spec.default !== undefined &&
      // A default the panel SHOWS but the bind must not WRITE: a field a
      // preset fills in (a planet's `world` writes its own sea, air and
      // craters), where writing the default would undo the preset.
      spec["x-apply-default"] !== false
    )
      defaults[key] = spec.default;
  return declaredConfig(
    registration,
    Object.keys(defaults).length ? { ...defaults, ...cfg } : cfg
  );
}

export function featureRegistration(
  name: string
): FeatureRegistration<never> | undefined {
  return features.get(name);
}

/**
 * Every registered feature.
 *
 * The editor's palette is THIS, not a hardcoded list — which is what puts a
 * consumer's escort-zone feature beside `turret` with no special case.
 */
export function registeredFeatures(): FeatureRegistration<never>[] {
  return [...features.values()];
}

/** Drop a registration. Mainly for tests, which must not leak into each other. */
export function unregisterFeature(name: string): boolean {
  return features.delete(name);
}

/*#
## Links are a registry too

`buildEnsemble` documented a link phase that wires `ensemble.links`, and the
runtime never read them: an ensemble with chain reactions built cleanly,
reported no problems, and did nothing. Found by the first consumer with links,
which is exactly who would find it.

The fix cannot be "implement chain reactions", because **the format has no
domain**. A `delay` that kills one piece after another is a combat rule; a
`beam` that draws a conduit is a visual one. Neither belongs in an instantiator
that also has to load a botanical garden.

So links get the same treatment features already have: a **registry keyed by
the payload key**. A piece's `features` is a map of name → config; a link's
payload is read the same way, so `{ from, to, delay: 0.4, beam: true }` invokes
whatever is registered for `delay` and for `beam`, and a consumer's own link
kind is indistinguishable from a built-in.

⚠️ **The payload is every key except `from`, `to` and `kind`, merged over
`values`.** The type documents `values`, and the files in the wild put `delay`
and `beam` at the top level — so both are read rather than one being declared
wrong after the fact. `values` wins on a collision, being the explicit spelling.

It also settles an ownership question a feature hook could not. A chain is a
property of the LINK, not of either endpoint: whichever end wired it would have
to reach across, and two endpoints both trying leaves it ambiguous who disposes
it. A link handler owns the link, gets both ends, and disposes once.
*/

/**
 * One end of a link, as a handler sees it.
 *
 * Structural rather than the runtime's `BuiltPiece`, because `format` must not
 * import `runtime` — the format is what a generator and a validator use, and
 * neither should drag in an instantiator. `BuiltPiece` satisfies this shape, so
 * the runtime passes its own objects through unchanged.
 */
export interface LinkEnd {
  piece: Piece;
  /** World position: origin + `at` × ensemble scale. */
  at: Vec3;
  /** The element carrying the body, or null — same split as `FeatureContext`. */
  element: SceneElement | null;
  node: unknown;
  /** Whatever each of this piece's features returned from `bind`. */
  handles: Map<string, unknown>;
}

/** What a link handler is given. Both endpoints are resolved for it. */
export interface LinkContext {
  link: Link;
  /**
   * The ends, or `undefined` where an id resolves to nothing.
   *
   * Not an error here: `validate` already reports a dangling link, and a
   * handler that throws on a half-built document would take the rest of the
   * scene down while an author is mid-edit.
   */
  from: LinkEnd | undefined;
  to: LinkEnd | undefined;
  ensemble: Ensemble;
  scene: SceneElement;
  pieces: Map<string, LinkEnd>;
  onDispose(fn: () => void): void;
}

export interface LinkRegistration<Handle = unknown> {
  /** The payload key this handles — `delay`, `beam`, `amount`. */
  name: string;
  /** For an editor to render the link's settings. */
  schema?: FeatureSchema;
  bind(cfg: Record<string, unknown>, ctx: LinkContext): Handle;
}

const links = new Map<string, LinkRegistration<never>>();

/** Register a link kind. Overwrites one of the same name. */
export function registerLink<Handle>(reg: LinkRegistration<Handle>): void {
  links.set(reg.name, reg as unknown as LinkRegistration<never>);
}

export function linkRegistration(
  name: string
): LinkRegistration<never> | undefined {
  return links.get(name);
}

export function registeredLinks(): LinkRegistration<never>[] {
  return [...links.values()];
}

export function unregisterLink(name: string): boolean {
  return links.delete(name);
}

/**
 * A link's payload, whichever way it was written.
 *
 * `from`, `to` and `kind` are the format's own fields; everything else is the
 * domain's. `values` is the documented spelling and wins on a collision.
 */
export function linkPayload(link: Link): Record<string, unknown> {
  const { from, to, kind, values, ...rest } = link as Link &
    Record<string, unknown>;
  void from;
  void to;
  void kind;
  return { ...rest, ...(values ?? {}) };
}

/**
 * Where a new piece of `feature` goes: its `insertAt` rule applied to the
 * clicked point (or the origin, when there is no click). The ONE rule, for
 * the Insert tool and the environment list; `insertConfig` is the other half.
 */
export function insertPosition(feature: string, clicked: Vec3 | null): Vec3 {
  const registration = features.get(feature);
  const rule = registration?.insertAt ?? "point";
  const at = clicked ?? [0, 0, 0];
  const where: Vec3 =
    rule === "point"
      ? [at[0], at[1], at[2]]
      : rule === "height"
      ? [0, at[1], 0]
      : [rule[0], rule[1], rule[2]];
  return where;
}
