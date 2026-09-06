# Changelog

All notable changes to this project are documented here, in
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

## [Unreleased]

A **minor** when it ships: the peer floor moved, which is a decision about who
gets broken (`src/peer-range.test.ts`).

### ⚠️ Breaking — the peer floor moved

- **`tosijs-3d` is now `^0.8.0`** (was `^0.7.8`) and **`tosijs` is `^1.10.0`**
  (was `^1.7.8`). Both are floors we develop against, not versions we merely
  tolerate, so an adopter must move with us.

  Taken deliberately rather than deferred: 0.8.0 carries `scene.whenDisposed`,
  which we had already written the editor against, and the `handleX` rename,
  whose old spelling is removed in 0.9. Sitting on the old floor only makes the
  same migration bigger later.

### Fixed

- **An attribute that had no type, for as long as it has existed.** tosijs
  1.10.0 removed `Component`'s `[key: string]: any` index signature
  (tosijs#36), which propagated to every subclass and made any misspelling on
  `this` compile. One thing fell out of it here: `seabed` is in the editor's
  `initAttributes` and never got a matching `declare` line, so `this.seabed`
  typed as `any`.

  Nothing was broken at runtime — but the same omission on a name that did NOT
  exist would have compiled just as quietly, which is the worst shape a type
  error can have: the tool that exists to catch it reports success.

  Both components now type their attributes FROM the values, so there is no
  second declaration to drift:

  ```ts
  export interface EnsembleEditor
    extends ComponentAttrs<typeof EnsembleEditor.initAttributes> {}
  ```

  ⚠️ Not `withAttributes()`, which is what tosijs's own migration note
  recommends. Its return type is not nameable from `'tosijs'`, so declaration
  emit fails with TS2742 and `bun run build` refuses — filed as tosijs#38,
  already fixed upstream and unpublished. `bun run build` running the SECOND
  typecheck is the only reason we know; `bun run typecheck` passes either way.

- **The peer-floor test guarded one peer of three.** It has said since 0.1.0
  that we develop against the FLOOR of the range we advertise — because that is
  how 0.1.0 shipped a symbol its own range did not guarantee — and it only ever
  checked `tosijs-3d`. Meanwhile the `tosijs` floor was raised by hand twice in
  one day with nothing checking it, and `tosijs` is precisely the dependency
  whose types we compile against.

  It now loops over every peer, with an exemption list that must carry a
  reason. It failed on its first run: the `tosijs` devDependency was a caret,
  free to float above the floor on any install, exactly as the comment in that
  file warns.

### Added

- **`sceneFloorplan` / `floorplanDiff` — visual regression without pixels.** A
  structural snapshot of what the camera can see, at world geometry, and a
  named diff between two of them.

  Tonio's observation about `tosijs-floorplan`, applied to a renderer: floorplan
  compares a DOM page as `{caption, bounds}` records rather than as an image,
  and **a scene graph already is that data** — Babylon keeps an authoritative
  post-culling draw list because it has to. An image diff reports "3.2% of
  pixels changed" and leaves you to decide whether antialiasing moved or the
  ground did; this reports `ground: moved (0,0,0) → (0,-12,0)`. Tolerance is a
  number you set rather than a rendering artefact you fight.

  It deliberately does not capture colour, material or lighting — it makes the
  LAYOUT claim, not the appearance one. What it buys is that layout no longer
  has to borrow the picture's flakiness in order to get checked.

  The split is the tier argument in one module: taking the snapshot needs a
  real renderer and lives in a fence; deciding what changed is pure data and
  runs in `bun test` in a millisecond. The fence uses it for the assertion an
  editor most needs and could least make — **a rebuild must not move the
  picture** — since it rebuilds on every edit.

- **Feature tests as ` ```test ` fences, next to the features they test.**
  tosijs-ui's doc browser runs every page-with-tests in hidden iframes and
  resolves `window.__docTestResults`, so one navigation gates the corpus —
  `tests/doc-tests.pw.ts` is now the whole browser lane, and Playwright's job is
  reduced to driving a browser and reading one promise. The assertions live in
  the docs, run in a plain browser, and are visible to a human who refreshes the
  page: the same signal, automated rather than replaced.

  `runtime/features-scene.ts` tests the scene primitives in ISOLATION and in
  COMBINATION, which immediately mattered — `sun.intensity` stops being the
  light's intensity once a `skybox` is in the same ensemble, because the skybox
  takes ownership of the day/night cycle and treats the authored number as a
  multiplier. A per-feature unit test cannot see that; it is a property of the
  pair.

  It also carries the cheap stand-in for "does it look right":
  `scene.getActiveMeshes()` is the post-culling draw list, so a non-empty one
  means the camera is pointed at geometry being rendered this frame. That
  catches "it built fine and the page is black" — an empty scene, a camera
  facing the wrong way, a floor below the eye — none of which a mesh count or a
  problems array can see, and without the flakiness of comparing screenshots.

- **Two defects in the README's most-read example**, found by the corpus's free
  "example loads without error" test within a minute of switching it on: it had
  never run, and it named `registerBuiltInFeatures` — a function this package
  has never exported. The cause was quoting, of all things (tosijs-ui#141), and
  `.prettierrc` now pins single quotes in markdown so `bun format` stops
  re-breaking it.

- **A scene lane — real Chromium, real WebGL, asserting the renderer.**
  `tests/*.pw.ts`, run with `bun run test:scene`. Everything else here runs
  under happy-dom, which has no WebGL, no layout and no render loop, so
  CLAUDE.md has said all along that what the features actually DO was unchecked.

  The cost of not having it is measured rather than theoretical: in one week, a
  `smart` turret that never led its target, an `underwaterFog` toggle writing a
  boolean to a number, an ambient `preset` naming something the element falls
  back from, a fog `mode` that rendered its opposite, and a `placePiece` that
  placed nothing while reporting 20 of 20 built. Every one was found by
  adopting a schema or by a consumer. None by a test, because no test could see
  a scene.

  WebGL2 headless was verified BEFORE anything was built on it, since the lane
  is worthless without it: SwiftShader, 49 content meshes, three lights, zero
  page errors. It covers the standard scene's sun, fill, skybox, camera, ground
  extent and fog mode/density, each read from the FILE rather than hard-coded so
  editing the sample cannot leave the test asserting history.

### Fixed

- **A load was overtaken by the page's own `src`.** The mount defers, sets
  `_loadedSrc` and starts fetching — a guard about STARTING a load, not about
  it landing. So an editor on a page with `src` accepted an explicit `load()`
  and then silently replaced the result when the older fetch resolved:

  ```
  t=102ms   ensemble.name  "standard-scene"   ← the explicit load
  t=870ms   ensemble.name  "pirate-cove"      ← the mount's, landing
  ```

  This is 0.1.2's data loss through the other door — that fix stopped a second
  load from STARTING, and nothing stopped the first from FINISHING. `load()`
  carries a generation now and discards a superseded result, checked twice
  because `mountLibraries` awaits as well. The newest REQUEST wins, not the
  fastest response. Found by the scene lane on its first run.

- **A log-scaled value was rounded to death when a file was opened.** Rounding
  is three decimals, which is a LINEAR idea, and fog density runs `0 .. 1` with
  everything anyone wants below `0.01`. So `standard-scene.json`'s authored
  `0.0015` became `0.002` in the document — a 33% change, applied on OPEN,
  before any edit — and the renderer got the rounded value, so the file, the
  document and the picture disagreed with nothing to say so. Terrain's
  `grossScale` sits one decimal from the same fate.

  `x-scale: 'log'` already says a quantity is multiplicative, so it now also
  says how to round it: `roundSignificant` keeps three significant FIGURES.
  `0.0015` stays `0.0015`, `20.651162790697676` still becomes `20.7`.

- **`buildEnsemble` reported "20 of 20 built, zero problems" and put no
  geometry in the scene** (manta-recon#3). `pieces` counted every piece it
  REACHED, not every piece it gave a body to, so a caller could not tell
  "built" from "recorded" — which is the one thing that number is for. 0.2.0's
  link phase produced a second witness for the same fault: every `LinkEnd`
  arrived with `element` and `node` both empty, for pieces the map counted as
  built.

  The cause was one word. `placePiece` was destructured with **no default**
  while its own doc comment said it defaulted to `placeMesh`, and it is invoked
  as `placePiece?.(…)` — so for any caller who did not pass one, every piece
  was recorded and none was placed. Nothing here could notice: all three call
  sites in this repo pass it explicitly and every test stubbed it. Two of our
  own tests were, it turns out, asserting that silence.

  ⚠️ **It still does not default, and now says so.** `placeMesh` imports
  tosijs-3d, which needs a DOM at module load, while `dist/runtime/build.js`
  imports cleanly under plain Node — measured — which is what lets a generator
  validate and build headlessly. The DOM dependency is the caller's to declare.

  What changed is that omitting it is no longer silent, and the check is on the
  OUTPUT rather than the option: a piece that names a mesh and ends with no
  body is reported as **`no-placer`** (nothing was supplied — one problem, with
  the fix in it) or **`no-body`** (the placer declined this piece, usually a
  mesh that is in no mounted library). A piece with no mesh is not reported —
  an environment primitive IS its feature — and neither is a disabled one.

  `MIGRATING.md` now shows the whole call.

- **A pass and an absence were the same report.** `validate` skips unknown-mesh
  checking when it has no `meshes` set — deliberately and documented, because
  "a validation error that is really a loading race is worse than none". That
  is right, and it left the caller unable to tell _checked and clean_ from _not
  checked_: an ensemble full of typo'd mesh names passed silently, and a gate
  reading `problems.length === 0` was told everything was fine. Named by
  manta-recon in #3 alongside the placement fault.

  **`validate` now emits a `meshes-unchecked` warning** when pieces name meshes
  and nothing could verify them, naming the libraries the caller asked for. A
  warning rather than an error, because skipping really is correct during a
  load race — the defect was saying nothing, not the skipping.

  ⚠️ In `validate`, not only in `buildEnsemble`, which is where the first pass
  put it. manta-recon measured the silence in a DIRECT call — `validate(bogus)`
  → `[]` with a deliberately misspelled mesh — and that is the caller who most
  needs telling: a generator has no scene, so no mounted libraries, so nothing
  to derive a set from. `buildEnsemble` still derives one when it can and
  passes it through, so a build warns only when it genuinely could not look.

- **An EMPTY mesh set accused every mesh of being unknown.** A library that
  answered with no names, or a `meshesByLibrary` that found nothing mounted,
  produced `unknown-mesh` for every piece in the document — the exact
  false-accusation case the skip exists to prevent, arriving through the door
  marked "checked". An empty set now means _cannot check_, and routes to the
  warning. Found by writing the test for the warning above.

- **The scene schemas were hand-copied, and every kind of drift was silent.**
  Ranges, units, enums and log scales for the ten scene primitives now come
  from `tosijs-3d`'s own `sceneSchemas` (tosijs-3d#63, our ask). Adopting them
  turned up four more controls that could not do what they said:

  | ours                             | the element                             |
  | -------------------------------- | --------------------------------------- |
  | `water.underwaterFog: boolean`   | a NUMBER 0..1 — the toggle wrote `true` |
  | `ambient.preset` default `birds` | unknown preset → falls back to `motes`  |
  | `ambient.where` default `air`    | not in `always \| underwater \| above`  |
  | `fog.mode` offered `none`        | unknown mode → falls back to LINEAR     |

  So the fog setting an author picks _in order to see the horizon_ rendered
  linear fog, and the ambient default named a preset that does not exist. None
  of it was reported by anything.

  `migrate()` rewrites all four in a file already written, because a migration
  exists to make a document say what it already does. `"none"` becomes
  `"linear"` and the note says to delete the piece if no fog was the intent —
  that call is the author's.

  Two things stay ours and are documented as decisions rather than copies:
  **which** properties an author sees (`terrainSchema()` has 30, of which five
  are engine tuning) and a handful of authoring defaults. A test pins both:
  every key we name must still exist upstream, and we may not restate a range,
  unit, enum or scale — with exactly four listed exceptions.

  The sky panel went from 6 properties to 11. Nobody had decided to drop the
  other five; they were simply never copied.

- **A property the document had not set displayed as the BOTTOM of its range.**
  The sky panel read `latitude -90` and `luminance 0` while the element sat at
  40 and 1. `box(key)` answers for any addressable key, set or not, and a box
  over an absent path has no value — so `?? spec.default` never ran, because a
  box is an object and `??` only falls through on nullish.

  That is a control that LIES rather than one that does nothing, which is
  worse: it invites trust in a reading nothing produced. Visible now because
  adopting the upstream schemas took the sky to eleven properties of which an
  untouched file sets two.

- **…and unbinding those fields stopped them writing at all.** The fix above
  left the write path still asking `this._box(key)` directly, which answers for
  any addressable key — so every unset field read correctly and silently
  refused to be edited. One rule in two expressions that agreed by inspection
  until one of them changed; they are one function now. Caught in a browser by
  dragging a field the document did not set, which no test here would have
  done, because both halves were individually right.

- **A `smart` turret never led its target, and under tosijs 1.9 it aimed at
  `NaN` instead.** `presets/combat` wrote `smart: "on" | "off"` to
  `<tosi-b3d-turret>`, whose `smart` is a NUMBER — a 0..1 skill curve, where
  lead ramps to full by 0.5 and gravity-drop compensation by 1.

  tosijs used to discard a wrong-typed write to an `initAttributes` prop
  **silently**, so `smart: true` in an ensemble had always been a no-op and
  nothing anywhere said so. tosijs 1.9 warns and **applies** the value instead,
  which turned the dead write into `Math.max(0, Math.min(1, "off"))` → `NaN`
  through the aim maths — for both spellings.

  The boolean stays in our schema and maps to the curve's endpoints. Found by
  the upgrade: the new warning names the element, the prop and the value, which
  is the whole argument for the change upstream.

  ⚠️ **This is the project's own rule again** — _verify the OUTPUT, not the
  mechanism_. The attribute was set, the element accepted it, the tests passed,
  and the turret aimed exactly where it would have with no `smart` at all.

### Added

- **The piece list is a filtered table with per-row actions.** One field
  narrows hundreds of rows; a row's ⋯ offers Enable/Disable, Duplicate and
  Delete.

  The filter reaches the LIVE tables through `setFilter` rather than
  re-rendering the panel, which is the whole reason the feature had to be
  upstream (tosijs-3d#67, ours): re-rendering would discard the scroll
  position, the selection and the focus index the table owns — and the field
  itself, mid-word. Measured: filtering out the selected `flagship` left it
  selected, and it came back when the filter cleared. Hiding is a view state.

  Delete and Duplicate run the REGISTERED commands rather than reimplementing
  them, so a consumer that replaces `delete` replaces it here too and the undo
  entry reads the same however it was invoked.

  ⚠️ **`kind: 'icon'` is deliberately NOT used**, though that is what we asked
  #64 for. An icon column reads its value as an `iconGlyph` NAME, and our
  feature icons are EMOJI — `registerFeature({ icon: '☀️' })` is the registry's
  contract, and it is what lets a consumer's own feature appear in this list
  with a glyph the editor never knew about. Names would make every consumer
  register an SVG icon too, to gain nothing an author can see.

- **The kit shelf says it is loading.** The insert palette opens listing
  whatever is already mounted — usually the ensemble's own one library — and a
  few seconds later silently became four. Nothing marked the gap, so the honest
  reading of the first frame was "this kit is all there is" (tosijs-3d#60,
  ours). Measured with cache-busted kit URLs: "loading 4 kits…" up from 1.0s to
  2.0s, then gone. It clears on failure too — a spinner that never stops is a
  lie about work still being done.

- **The schema dispatch is pinned by test.** `x-widget: 'curve'` and
  `'light-program'` have never run in this repo — the lamp hands its whole
  `settings` field to `lightEditor3d`, so the nested curves never reach the
  dispatch. They are not dead code: they are the receiving end of a contract,
  and the first schema to use one will come from OUTSIDE (a consumer's feature,
  or tosijs-3d's `provinceClimateSchema()`, whose three channels are curves
  today). That is exactly the arrangement where a broken branch is found by
  somebody else, months later, as "the panel shows a label where a curve should
  be".

- **Strings are editable, including colours.** This branch rendered a muted
  label — "show the value rather than hide the field", pending the SVG
  keyboard. The keyboard has been available since 0.7.4 and the label stayed,
  so every string property in every scene feature was read-only:
  `ground.texture`, `water.normalMap`, `clouds.model`, and — once we adopted
  tosijs-3d's own scene schemas — seven colour fields, four on the sky alone.

  ⚠️ A colour deserves better than a hex field and there is nothing to give it:
  tosijs-3d has no colour control at all, and its own `skyboxSchema()` declares
  four `format: 'color'` properties its widget set cannot edit. Filed as
  tosijs-3d#72 rather than hand-rolled — a widget belongs to its owner.
  `x-widget: "color"` is preserved so a picker drops in without touching a
  schema.

### Changed

- **The sky's `realtimeScale` is a log slider with a zero stop, not a cycler.**
  The named-decade enum (`Off / realtime / 10× / 1 min/s …`) stood in for a
  control that could span 0..3600 and still reach zero, and 0.8.0's `slider3d`
  has one (tosijs-3d#62, ours) — which is how upstream's own `skyboxSchema()`
  already spells it. `schema-panel` reads `x-zero-stop`. A still sky is still
  the default, because an ensemble is a static description and has to be
  reproducible.

- **Callbacks passed to tosijs-3d widgets are `handleX`.** `handleChange`,
  `handleSelect`, `handleClick`, `handleCommit` — at every call site in
  `ensemble-editor.ts` and `schema-panel.ts`, and on `SchemaPanelOptions`
  itself, which is ours.

  Both spellings work through tosijs-3d 0.8.x and `onX` is removed in 0.9, so
  this is not urgent — but a _half_-migrated codebase is what caused three of
  the bugs 0.8.0 fixed upstream, where one widget took `handleChange` and its
  neighbour took `onChange` and neither complained about the other. Renaming
  ours too means there is no longer a spelling question to get wrong.

- **`scene.whenDisposed` is no longer optional-chained.** It was written before
  the method existed (tosijs-3d#22), and `?.()` meant a missing method left the
  editor silently never observing scene disposal — precisely the failure the
  callback exists to prevent, arriving as nothing at all. The peer floor now
  guarantees it.

- **`src/editor/tosi-store.test.ts` asserts the FIXED behaviour of a held
  proxy.** tosijs 1.9.2 fixed tosijs#35 (ours): `.value`, `valueOf()` and
  `toJSON()` follow the path now instead of returning the object the proxy was
  created over. The test pinned the bug, so the upgrade is what failed it —
  which is what a test like that is for. `_store` stays a getter.

## [0.2.0] — 2026-09-04

### Added

- **The link phase the instantiator documented and never had.** `buildEnsemble`'s
  header has promised since the beginning that it "wires the ensemble's `links`
  (chain reactions)". Nothing read `ensemble.links` — the string appeared only in
  that comment — so an ensemble with links built cleanly, reported no problems,
  and silently did nothing. Reported by the first consumer that had any (#2).

  **Links are a registry, keyed by payload key**, exactly as a piece's features
  are keyed by name:

  ```js
  registerLink({
    name: 'delay',
    bind: (cfg, { from, to, onDispose }) => { … },
  })
  ```

  So `{ from: 'reactor', to: 'field', delay: 0.4, beam: true }` invokes whatever
  is registered for `delay` and for `beam`, and a consumer's own link kind is
  indistinguishable from a built-in.

  ⚠️ **The instantiator implements neither.** A chain reaction is a combat rule
  and a beam is a visual one; this package also has to load a botanical garden.
  The mechanism is here, the meaning is the domain's — the same split that keeps
  `destroyable` in `presets/combat` and `radar` in the consumer that needs it.

  A link handler gets BOTH ends resolved, which a feature `link` hook could not:
  a chain is a property of the LINK, so whichever endpoint wired it would have
  to reach across, and two endpoints both trying leaves teardown ambiguous.

  The payload is read from the top level AND from `values` — the type documents
  `values`, files in the wild use the top level, so both work and `values` wins a
  collision. A dangling end resolves to `undefined` rather than throwing, since
  `validate` already reports it and an exception would cost an author the rest of
  a scene they are mid-edit on.

## [0.1.3] — 2026-09-04

### Fixed

- **The published package could not be imported by Node at all.** Every relative
  import in `dist` was extensionless — `from "./format/roles"` — and Node's ESM
  resolver requires the extension:

  ```
  Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/dist/format/roles'
  ```

  Bundlers resolve it, which is why nothing caught it: this project's own loop
  is Bun and a bundler, and so is the doc site, and so was the first consumer.
  **0.1.0, 0.1.1 and 0.1.2 are all affected.** It falsified the claim that
  `validate` and `buildEnsemble` work headlessly — which a generator emitting
  ensembles depends on.

  204 imports across 56 files now carry `.js`, and a test asserts it of the
  SOURCE, so it fails at authoring time rather than after a publish.

  ⚠️ **The barrel still cannot be imported by Node**, because `tosijs-3d` has
  the identical problem one level down. Filed upstream. The headless route works
  today through subpaths, verified against the published tarball in a clean
  install:

  ```js
  import { validate } from 'tosijs-3d-ensemble/format/validate';
  import { migrate } from 'tosijs-3d-ensemble/format/migrate';
  ```

## [0.1.2] — 2026-09-04

⚠️ **Correction:** this entry originally said 0.1.1 never reached npm. It did —
the registry showed only `0.1.0` when checked, and `0.1.1` appeared afterwards,
so the publish landed late or the read lagged it. 0.1.2 was cut rather than
publishing the 0.1.1 tarball because `main` had moved eight commits past that
tag, and it carries 0.1.1's fix as well.

### Fixed

- **A re-parent reloaded `src` over the author's work.** The doc system
  re-parents this element, a re-parent is a disconnect plus a connect, and
  `connectedCallback` re-fetched `src` — replacing whatever was loaded or
  edited, with no error and no undo entry, since a document swap clears the
  history by design. Loaded once per `src` now, not once per connect.
- **`terrain` produced no ground at all.** The element preallocates a tile pool
  and fills it only on `regenerate()`, which nothing called. Its first outing in
  a live scene, and it had never worked.
- **The camera framed a terrain from inside it.** Framing used authored
  positions, and a terrain sits at the origin contributing nothing to the span.
  It now reads extent from the ensemble — `reach`, or `tileSize × 2^lodLevels`.
- **Every terrain slider value was invented, and wrong.** `grossScale` is a
  FREQUENCY (0.005–0.3, default 0.015); it was declared as metres, 1–1,000,000,
  defaulting to 4000. The whole set now comes from tosijs-3d's own terrain demo.
  `horizScale` was missing entirely, so two of three interacting quantities were
  adjustable and the third invisible.
- **`reach` could hang the tab.** Finest tiles go as `(2·reach / tileSize)²` and
  they are separate controls, so the product bites. `tileSize` now has a floor,
  which is the term driving the square.
- **Toggling `biome` did nothing visible.** It wrote and regenerated, but the
  fields it gates could not appear, because the code path that stops a slider
  being destroyed mid-drag also suppressed the re-render.
- **Sliders behaved as sliders.** The panel is no longer re-rendered on a value
  change, so a drag keeps the widget it started on. One drag is one undo step.

### Added

- **A `utilities` library in the insert palette** — sun, sky, terrain, water,
  lamp, camera, sound and the rest. The format always allowed a piece whose
  features are its body; nothing could create one, because the palette lists
  meshes. `registerFeature({ primitive: true })` marks a feature that can stand
  alone, so a consumer's own appears there too.
- **`insertAt`** — where an inserted primitive goes: the clicked point, the
  clicked height only (a terrain has no x/z), or a fixed position (a skybox has
  no position; `sun`'s `at` is a direction).
- **A `New` button**, which starts a scene with the things that shape it — sun,
  light and sky enabled, terrain and water present but disabled. An empty
  document had nothing to change the light with. It is an edit, so it undoes.
- **Piece renaming**, from the property panel, re-pointing `links` and any
  feature field declared `"x-widget": "ref"`.
- **`preview.pieces`** — scenery for the author that no consumer ever builds,
  drawn faded and unpickable.
- **`Piece.enabled`** — `false` skips a piece at build without deleting it.
- **Three decimal places** on values entering the document, so a pointer drag
  stops writing `20.651162790697676`.

## [0.1.1] — 2026-09-03

### Fixed

- **0.1.0 could not be imported at all.** It imports `DEFAULT_LIGHT` from
  `tosijs-3d`, a symbol published only in **0.7.8**, while the peer range said
  `^0.7.0`. An adopter on 0.7.4 — inside the advertised range — got
  `SyntaxError: Export named 'DEFAULT_LIGHT' not found`, and because
  `features-scene` is re-exported from the barrel it took `validate`,
  `buildEnsemble` and `registerFeature` down with it. The first import line in
  `MIGRATING.md` was the one that could not work. Reported as #1 by the first
  consumer to install it.

  **0.7.4, 0.7.5, 0.7.6 and 0.7.7 are all affected** — the range promised four
  published versions that every one of them failed. If you installed 0.1.0, you
  need both this release and `tosijs-3d@^0.7.8`.

  The peer range is now `^0.7.8`, which is the version the code was actually
  written against.

### Added

- **A test that the peer range is a promise we keep.** No test of the CODE could
  have caught this — the code is correct against the version on disk; what was
  wrong was the promise. So `src/peer-range.test.ts` asserts we develop against
  the **floor** of the range we advertise, and that the dev dependency is pinned
  to that floor rather than a caret that drifts upward silently. With that
  invariant, anything importable exists in the floor by construction.

## [0.1.0] — 2026-09-03

First release. The **ensemble** format, its instantiator, and a graphical editor
for authoring them: a reusable, JSON-described arrangement of library meshes with
declared capabilities and relationships. No code, no engine types — plain data a
game loads, a tool authors, and a generator can emit.

### Added

- **The format** — `pieces` with `id`, `mesh`, `at`, `rot`, `scale` and
  `features`; `links`, `points`, `zones`, `libraries`, and a `preview` block of
  scenery for the author that no consumer ever builds.
- **`validate()`** — returns `{severity, code, message, path}[]` and never
  throws, so an editor can show everything and keep working while a generator
  decides whether to emit.
- **`buildEnsemble()`** — the instantiator, with two-phase `bind`/`link` so a
  feature reaching sideways cannot race array order.
- **Registries, open to consumers** — `registerFeature`, `registerRole`,
  `registerCheck`. A consumer's feature is indistinguishable from a built-in in
  the format, the editor and the file.
- **Scene features** — `sun`, `light`, `lamp`, `ambient`, `skybox`, `clouds`,
  `fog`, `reflections`, `ground`, `terrain`, `water`, `camera`, `sound`. The
  standard demo scene is an ensemble, and loading it is one line.
- **Presets** — `presets/world` (doors, locks, animation, spin, triggers) and
  `presets/combat` (the fortification vocabulary and its unreachable-shield
  rule), both tree-shaken out of a scene-only import.
- **`ensembleEditor`** — a working editor component: piece list, schema-driven
  property panels, a fused transform widget, insert, duplicate, delete, undo,
  and load/save. Tree-shakes away entirely for a consumer that only builds.
- **`migrate()` and `bin/migrate.ts`** — bring a legacy prefab up to the format:
  ids from mesh names (never from array indices), and `hp` lifted into
  `features.destroyable`. Idempotent and non-mutating; dry by default.

### Known limitations

Stated plainly because the alternative is somebody discovering them:

- **The built-in features are thin bindings that have not been exercised in a
  scene.** Validation, role merging, bind/link ordering, idempotent rebuilds and
  tree-shaking are all covered by tests; turrets firing, chains, protection and
  terrain shape are not. Treat them as unverified.
- **The editor has never run in a headset**, which is the reason its chrome is
  built on tosijs-3d's SVG UI rather than DOM widgets.
- **No manipulator upstream** — the transform widget is this project's own.
- **`radar` and other consumer features are the consumer's to register.**
  `validate` warns about an unregistered feature rather than failing, so a file
  can be authored against a vocabulary the validator has never seen.

### Requires

`tosijs-3d ^0.7.0` — never a prerelease range; `0.7.0-rc.1` was published before
the betas and semver sorts beta below rc, so `^0.7.0-beta.6` resolves backwards.

[0.2.0]: https://github.com/tonioloewald/tosijs-3d-ensemble/releases/tag/v0.2.0
[0.1.3]: https://github.com/tonioloewald/tosijs-3d-ensemble/releases/tag/v0.1.3
[0.1.2]: https://github.com/tonioloewald/tosijs-3d-ensemble/releases/tag/v0.1.2
[0.1.1]: https://github.com/tonioloewald/tosijs-3d-ensemble/releases/tag/v0.1.1
[0.1.0]: https://github.com/tonioloewald/tosijs-3d-ensemble/releases/tag/v0.1.0
