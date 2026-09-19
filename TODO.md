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

- [ ] **Remove the `onBeforeViewRenderObservable` filter** from
      `tests/page-errors.ts` when tosijs-3d#78 lands. A one-time prototype
      augmentation double-fires on Linux/SwiftShader; non-fatal, but a filtered
      error is only honest while an issue is behind it.

- [x] ~~**Library URLs get no scheme check.**~~ Done, at the owner's call:
      https required, relative allowed, `http://localhost` allowed, everything
      else an ERROR (`insecure-library-url` / `unsupported-library-url`). In
      `[Unreleased]` as breaking, since a document that validated clean under
      0.3.0 can fail now.

- [ ] **The scene-schema drift guard only checks the peer FLOOR.**
      `scene-schemas.test.ts` compares `pick()` against the installed
      tosijs-3d, pinned to the floor by `peer-range.test.ts`, while the
      advertised peer is `^0.8.1`. A consumer on 0.8.2+ gets exactly the silent
      panel drift the mechanism exists to prevent, with only a module-load
      `console.warn` as signal.

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

- [ ] **Remove the `.prettierrc` markdown override** once tosijs-ui#141's fix
      is confirmed in 1.14.x. It forces single quotes because the live-example
      parser rejects double-quoted specifiers.
- [ ] **Adopt `x-useful` / `x-wavelength`** for slider soft bounds. tosijs-3d
      0.8.1 ships them; `schema-panel` does not read them.
