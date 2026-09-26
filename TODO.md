# TODO

Open work, in one place. Created 2026-09-17 because the 0.3.0 pre-release
reviews found real follow-ups and there was nowhere to put them — they lived
in `reviews/` and in nothing that gets read before starting work.

⚠️ **A deferred finding that evaporates is indistinguishable from one nobody
found.** Everything here was either verified and judged not worth blocking a
release, or verified and too large for one. Both reviews are filed under
`reviews/` with STATUS blocks; this is the part of them that is still open.

## Verification gaps — the ones that make other claims unsafe

- [x] ~~**No CI.**~~ Two jobs now — `unit` (test, typecheck, build, format,
      tree-clean) and `scene` (real Chromium + WebGL). It found three test
      files corrupting the shared registry on its first runs, one of which had
      forged a passing test by deleting the feature it was asserting against.

      ⚠️ `bun-version` is PINNED in both jobs, because `docs/` is committed and
      the tree-clean gate asserts a rebuild reproduces it. A bun upgrade means
      rebuilding `docs/` in the same change.

- [x] ~~**The doc-corpus gate is off.**~~ Fixed, and the original diagnosis
      was one layer off. 1.14 removed the doc SYSTEM from the barrel too
      (tosijs-ui#133), and `<tosi-doc-system>` is what the doc browser runs
      inside — so importing `tosijs-ui/doc-system/doc-system.js` explicitly
      restored the corpus (6 passed / 0 failed), every live example on the
      site, and syntax highlighting, all at once. `doc-tests.pw.ts` is no
      longer `fixme`.

- [x] ~~**No test drives a physical keystroke through the property panel.**~~
      Done — `tests/property-keystroke.pw.ts` clicks the field and types
      through the window, then asserts the document changed AND the piece did
      not move. Confirmed to fail with either 0.3.0 fix reverted: the write
      path (guard back to `boxFor`) and the routing path (fields out of the
      `fieldGroup`).

      ⚠️ It needs a 1400x1100 viewport. At Playwright's default 1280x720 the
      property panel renders below the fold, `elementFromPoint` at the field
      is `null`, and the click silently hits nothing — which reads exactly
      like a field that refuses input. That cost the first three runs.

- [ ] **The 480-line editor change is verified by "it mounts."** The adopted
      filtered table, row menu and shelf spinner, the `ComponentAttrs`
      retyping, and the curve panels have no browser assertion. Both of the
      0.3.0 review's editor findings were in this unwatched surface.
- [x] ~~**The re-parent regression test cannot be trusted yet.**~~ It can:
      tosijs-3d 0.8.4 fixed the context churn (#79) and the test runs TWENTY
      trips, un-`fixme`'d — one canvas throughout, 74 meshes every time, no GL
      error, no lost context. Two rig fixes on the way, both measured: the
      duplicate history entry (tosijs-ui#174) made Playwright's `goBack` time
      out on 1.15.4, so it steps with in-page `history.back()`; and three
      trips of twenty ran out of a 15 s settle window under SwiftShader (each
      300 ms sleep took ~3 s) — traced as slow, not broken, and widened to
      40 s. tosijs-3d#58 can lose its 🟡.

- [x] ~~**No bundle-size signal.**~~ `tree-shaking.test.ts` now asserts the
      GZIPPED size of a game's entry, between 4 kB and 14 kB (8.5 kB today).
      Loose on purpose — a smoke alarm, not a budget, because a test that
      fails on 2% drift gets its number bumped without being read.

      The prerequisite was real: the fixture was a bare re-export that Bun
      shook to a 101-byte stub, so a ceiling would have asserted against 101
      bytes while the entry grew without limit. It consumes its imports now.
      Confirmed non-vacuous: adding `ensembleEditor` takes it to 26 kB.

## Correctness and safety

- [x] ~~**The piece-id rename field does not accept keystrokes.**~~ Found and
      fixed: `fieldGroup` iterates its `fields` ONCE at construction to wrap
      each field's focus callback, and `_renderProperties` built the group
      BEFORE the panel that creates the id field. Traced —
      `COLLECT 0, COLLECT 1, GROUPBUILD 11, COLLECT 2` — the id field arriving
      one step after the group closed. The group is built after the panel now.

      ⚠️ **It said "and `tests/piece-list.pw.ts` covers it" for four days, and
      that was false.** The test was still `test.fixme`, so it asserted
      nothing — a fixed bug behind a `fixme` reads exactly like a broken one.
      Un-skipped now, and un-skipping found a second defect in the test itself:
      the character lands at the CARET, so typing `X` into `flagship` gives
      `flagXship`, and the assertion demanded an id that still
      `includes('flagship')` — unsatisfiable by any successful rename. It would
      have gone red on the day the fix landed, for the opposite reason. **A fix
      is not covered until the test that covers it has run green once.**

- [ ] **Remove the `onBeforeViewRenderObservable` filter** from
      `tests/page-errors.ts` when **tosijs-ui#191** lands. ⚠️ It was filed as
      tosijs-3d#78, "Linux only, non-fatal", and was neither: it fires on every
      load on every machine, and Babylon fails to compile the `layer` and
      `line` shaders beside it. Cause: the doc site evaluates its ESM entry
      twice (`hydrate.js?v=<hash>` from the page, bare `../hydrate.js` from
      the chunks). Found only because an upgrade broke the re-parent test and
      the page got looked at again — the filter had hidden it since the day it
      was written. Corrected on #78.

- [x] ~~**Library URLs get no scheme check.**~~ Done, at the owner's call:
      https required, relative allowed, `http://localhost` allowed, everything
      else an ERROR (`insecure-library-url` / `unsupported-library-url`). In
      `[Unreleased]` as breaking, since a document that validated clean under
      0.3.0 can fail now.

- [x] ~~**The scene-schema drift guard only checks the peer FLOOR.**~~ CI has a
      `drift` job now: it installs the newest tosijs-3d and runs the two drift
      guards against it. Separate job, because the rest of the suite fails on
      purpose once the floor pin is broken — and blocking, because a failure
      means either the drift is real and we adopt it, or the exception list
      needs a new entry with a reason.

      Latest is 0.8.1 today, the same as our floor, so the job currently
      re-checks the floor and says so in its log rather than implying it
      tested a ceiling that does not exist yet.

- [x] ~~**A feature's URLs get no scheme check.**~~ Done: tosijs-3d 0.8.4
      marks fetched fields `format: 'uri-reference'` (our #91), scene features
      stamp them as `x-fetched` from the FULL upstream schema, and `validate`
      holds each to the library rule — `insecure-feature-url` /
      `unsupported-feature-url`, errors. Keywords such as `checker` pass. A consumer's own feature opts in with plain `format: 'uri-reference'`.

- [ ] **Removing a key from a singleton's config does not reset it.**
      `addSingleton` assigns what the config HAS, so deleting `starfieldData`
      from a document leaves the galaxy up until reload. Pre-existing for every
      scene-wide feature; more visible now the sky has twenty fields.

- [ ] **The sky panel is long** — thirty fields in one column since 0.8.4's
      air, tint and star-look fields. Wants grouping (air / night / space),
      which `schema-panel` has no vocabulary for.

- [ ] **A moon with no sky only warns.** Moons are drawn by the skybox, so a
      `moon` piece in a document with no sky renders nothing; `link` says so
      in the console, but `validate` cannot, because `FeatureContext` has no
      problem channel and a registered check would be a scene rule in the
      global check set. Worth a `requires: ['skybox']` on registrations.

- [ ] **`moon` has a hand-written schema** until tosijs-3d#93
      (`moonSchema()`), the way `cloudDeck` did until #87.

- [ ] **`<tosi-b3d-decorator>`** (0.8.4) scatters rocks and trees by budget and
      climate over a terrain — an obvious `decorator` feature beside
      `terrain`. Not adopted: no schema upstream yet, and it deserves its own
      look at cost (`measureCost()` exists for exactly that).

- [ ] **tosijs-ui 1.16 turns `<tosi-md sanitize>` on by default.** We render
      no `<tosi-md>` ourselves, but our pages carry raw HTML (the editor
      element in `editor.md`). Check the doc site on the 1.16 upgrade before
      trusting it.

## Format and runtime work the design is waiting on

- [ ] **`Piece.ensemble` flattening.** Reserved, documented, unimplemented —
      and a dependency for the tile plan's milestones 1b and 1c.
- [ ] **An insertion transform.** `BuildOptions` offers `origin` and nothing
      else, and the placer contract has no slot for an orientation to arrive
      in. Recommended shape and the one measurement to take first are in
      SPEC.md, "Inserting an ensemble needs a full transform".
- [ ] **Placement resolution** (`ground` / `surface` / `solid` + reference
      height + offset). #7 — and manta has a working implementation with
      fifteen tests, so this is adoption rather than invention.
- [ ] **Tile maps.** TILES.md is a plan agreed in principle across nine rounds
      and implemented in nothing. Milestone 0 is a tileset schema plus a
      generated draft for `city-kit-roads`.

## Design threads with a stake elsewhere

- [ ] **Panel placement has no device-neutral vocabulary** — tosijs-3d#81
      is answered upstream in 0.8.4: `<tosi-b3d-panel presence="both">` and
      `XrFrames.flat(scene, camera)` give the eye/body/neck/face frames on a
      monitor. So `_stackTop` and the `style.top` arithmetic now have a
      replacement to be ported onto; not started. The piece LIST is still the
      one panel of five that may want to stay DOM (crispness, native text
      input).

## Housekeeping

- [x] ~~**Delete the three `bound() as …` casts**~~ Done (tosijs-3d#76,
      `Bindable<T>` in 0.8.4). `BoxLike` types the box, the one remaining cast
      sits at the store boundary where it is true, and a `@ts-expect-error`
      pins that `inputField` still cannot take a box — falsified by removing
      the directive.

- [ ] **Un-ignore `editor.md`** when tosijs-ui#165 lands. The build rewrites
      its `<!-- toc -->` block in a shape Prettier undoes, so format and build
      cannot both be green — and ignoring it makes the repo's one hand-written
      doc page the only file the formatter does not check.

- [x] ~~**Remove the `.prettierrc` markdown override**~~ Done. tosijs-ui#141
      landed in 1.14.0 and we are on 1.14.1, so `.prettierrc` is now `{}` and
      every fence is Prettier-default double-quoted.

      Verified as a BEFORE/AFTER, not assumed: the build's live-example checker
      reported exactly one unrunnable block with the override on and the same
      one with it off — MIGRATING.md's `./prefab`, which is manta's pre-migration
      code and cannot resolve by design — and `doc-tests.pw.ts` stayed green.
      That pairing is the evidence; a single green run after the change would
      not have distinguished "double quotes work now" from "no example ran".

- [x] ~~**Adopt `x-wavelength`**~~ Done. A unit-bearing slider puts the unit on
      the VALUE, and a frequency also shows the wavelength:
      `terrain.grossScale` reads `0.015 1/m ≈66.7 m`. Pinned twice, because
      neither test alone is enough — `numberReadout` in `schema-panel.test.ts`
      for the arithmetic (it cannot see whether `format` is wired to anything),
      and `tests/schema-readout.pw.ts` hovering a real slider for the output
      (it cannot cover the arithmetic). Both confirmed to fail with the one
      `format:` line removed.

- [x] ~~**`x-useful` is not rendered**~~ Done (tosijs-3d#83, `useful` in
      0.8.4): a shaded band on the track, asserted on screen and narrower than
      the track, failing without the one line.

- [x] ~~**Hover the slider TRACK, not its caption**~~ Fixed upstream in
      0.8.3/0.8.4 (#84, now documented). The test still hovers the track,
      which is harmless; `peek` now shows the value beside the caption.
