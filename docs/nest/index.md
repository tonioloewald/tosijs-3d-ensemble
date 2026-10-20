# Nested ensembles

A piece can be a whole ensemble: `"ensemble": "/assemblies/ocean-rig.json"`
in place of `mesh`. A level made of rigs, a fortress made of towers, a plaza
with lamp posts that are themselves arrangements.

```json
{ "id": "rig-a", "ensemble": "/assemblies/ocean-rig.json", "at": [120, 0, -40], "rot": [0, 30, 0] }
```

## Flattened when it loads

A nested ensemble is spliced into its parent when the parent is built: the
child's pieces become the parent's, with ids that are PATHS (`rig-a/pump`),
placed by the nesting piece's `at`, `rot` and `scale`. Every load re-reads
the child, so fixing the rig fixes every level that uses it. What this does
not give you yet is a per-instance override ("this level's rig, with the
pump moved"); that is a later step.

What happens to the child, in order:

- **Ids** become `<nesting id>/<child id>`, and so does everything in the
  child that names a piece: its links (`from`, `to`), and any feature field
  that holds a piece id (marked `x-piece-ref` or `x-widget: "ref"` in its
  schema, such as a planet's `terrain`; see `pieceRefKeys`). A child's link from `reactor` to `projector` becomes
  `rig-a/reactor` → `rig-a/projector`, and can never resolve against a
  same-named piece in the parent.
- **Transforms** compose: the child's whole arrangement (its own `scale`
  included) is placed under the nesting piece, so a child piece's world
  position is `at + rot · (scale ⊙ child position)`, its rotation the two
  rotations composed, and its scale the two multiplied. A parent stretched
  unevenly holding a child piece that is turned would need a shear, which
  no piece can hold; the scale along the child's own axes is kept and a
  `nested-shear` warning says so.
- **Its own points and zones** move into the parent, placed the same way,
  with path ids. **Its libraries** join the parent's; one whose name the
  parent already uses for a different file is renamed `<nesting id>/<name>`
  for the child's pieces.
- **Ignored:** the child's `preview` (scenery for its author), its
  `placement` (the parent places it), its `recommends` (the outer scene's).
- A nesting piece that is **disabled** contributes nothing.

## Loading it

`loadEnsemble(url, …)` and `<tosi-ensemble src>` fetch every nested
ensemble before they build; there is nothing to do. A host that builds a
document itself fetches them first and passes them in, with the url the
document came from (its relative refs are relative to it):

```js
import { buildEnsemble, collectNested, placeMesh } from 'tosijs-3d-ensemble'

const nested = await collectNested(doc, { base: url })
buildEnsemble(doc, { scene, placePiece: placeMesh, nested, base: url })
```

Without `nested`, each nested piece is reported `nested-missing` and builds
nothing. A document assigned in code (`element.ensemble = doc`) has no url,
so its relative refs resolve against the page.

`collectNested` fetches each url once (a child used by many pieces, at many
levels, is one request), follows at most `MAX_NESTING_DEPTH` levels and
`MAX_NESTED_DOCUMENTS` documents, and never fetches a url the https rule
refuses. A flattened document past `MAX_FLAT_PIECES` (5000) is cut off and
reported `nested-too-large`: a few small documents nesting each other many
times over multiply, and a shared document must not be able to hand a
reader a million pieces.

## In the editor

From outside, a nested ensemble is one piece (SPEC: "a black box inside a
scene"): a click anywhere inside it selects it, and it moves, turns and
scales as a whole. **Open inside** (in its Properties) makes the child the
document, with its own history and its own file; **Back** returns to the
parent, rebuilt with the child as you left it.

## What it refuses

A chain that comes back to itself (A nests B nests A) is reported as
`nested-cycle`, naming the loop, and not followed. Deeper than
`MAX_NESTING_DEPTH` (8) is `nested-too-deep`. A child that could not be
loaded is `nested-missing`, and its piece contributes nothing.

## Names and urls

`ensemble` is a url (`/assemblies/ocean-rig.json`, `./tower.json`), relative
to the document that names it, or a bare name (`ocean-rig`), which means
`ocean-rig.json` beside that document. A nested url is FETCHED, so it meets
the same https rule as a library.
