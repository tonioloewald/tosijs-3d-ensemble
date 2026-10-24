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
