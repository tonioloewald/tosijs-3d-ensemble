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
- [ ] **The re-parent regression test is written but cannot be trusted yet.**
      `tests/reparent.pw.ts` exists and reproduces the subject — SPA-navigate
      away and back, assert the scene comes back healthy, count outcomes. It
      is `test.fixme`: four trips passed on one run and failed on the next,
      alone and in a fresh browser, because several engines are constructed
      per re-parent and Chrome caps live WebGL contexts (tosijs-3d#79). The
      prescribed twenty trips stalls the page outright.

      So tosijs-3d#58 keeps its 🟡, and for a better reason than before: not
      "nobody looked" but "looking is currently unreliable, and here is why".
      Raise `REPARENT_TRIPS` toward 20 and drop the `fixme` when #79 lands.

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
      `tests/page-errors.ts` when tosijs-3d#78 lands. A one-time prototype
      augmentation double-fires on Linux/SwiftShader; non-fatal, but a filtered
      error is only honest while an issue is behind it.

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

- [ ] **A feature's URLs get no scheme check.** 0.3.x's https rule covers
      library urls only, and a skybox now carries two more (`starfieldData`,
      `starfieldCube`) beside the existing `ground.texture`,
      `water.normalMap` and `nebulaTexture`. Same threat — a shared document
      choosing its reader's network — and the same answer, but it needs a way
      to know which string fields are URLs — asked upstream as tosijs-3d#91.

- [ ] **Removing a key from a singleton's config does not reset it.**
      `addSingleton` assigns what the config HAS, so deleting `starfieldData`
      from a document leaves the galaxy up until reload. Pre-existing for every
      scene-wide feature; more visible now the sky has twenty fields.

- [ ] **The sky panel is long** — twenty-two fields in one column. Wants
      grouping (atmosphere / night / space), which `schema-panel` has no
      vocabulary for.

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

- [ ] **Panel placement has no device-neutral vocabulary** — tosijs-3d#81. Our
      chrome is a DOM overlay (`style.top` + a CSS side + `useDomLayer`), which
      is a fourth model the issue's matrix does not list and the one with no VR
      story at all. `xr-shape.test.ts` enforces device-neutral INPUT and
      exempts `ensemble-editor.ts` because "it owns the DOM: it mounts the
      scene and the panels" — so placement is the one thing we deliberately
      did not make portable, and it is the thing that would have to be rewritten
      for a headset.

      What would let us delete `_stackTop` and the `style.top` arithmetic: the
      `eye`/`face`/`body` frames available flat, plus a vocabulary that also
      covers the stacked-column case. Plus a per-panel opt-out to DOM for the
      piece LIST, which is the one panel of five where crispness and native
      text input actually bite.

## Housekeeping

- [ ] **Delete the three `bound() as …` casts in `schema-panel.ts`** when
      tosijs-3d#76 lands. `slider3d`/`toggle3d`/`select3d` declare plain
      `value: number | boolean | string`, so passing the box they are designed
      to bind fails the typecheck — and the cast erases which widgets can bind
      and which cannot. That erasure is why the 0.3.0 blocker survived: a
      fourth branch uses `ui.inputField`, whose `value?: string` cannot bind at
      all, and all four branches looked identical at the type level.

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

- [ ] **`x-useful` is declared and deliberately NOT rendered** — tosijs-3d#83.
      `slider3d` takes a `min` and a `max` and has nowhere to put a soft band;
      narrowing the track to it makes a documented range unreachable and a
      glyph in the readout invents a vocabulary. The `FieldSpec` comment is the
      record. Urgency is low and measured: both annotated fields are also
      `x-scale: log`, where their useful bands already occupy 32% and 25% of
      the travel, so the pathology is fixed and only the _showing_ is missing.

- [ ] **Hover the slider TRACK, not its caption** — tosijs-3d#84. The caption
      `<text>` paints over the full-row hit rect and becomes the event target,
      so the left half of every slider is dead to pointer input and says
      otherwise. `tests/schema-readout.pw.ts` finds the track by geometry to
      work around it; that goes when #84 lands. ⚠️ On 0.8.3 hovering the
      caption DOES peek (measured), so this is probably fixed upstream;
      drag not re-checked.
