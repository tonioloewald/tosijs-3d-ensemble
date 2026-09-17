# TODO

Open work, in one place. Created 2026-09-17 because the 0.3.0 pre-release
reviews found real follow-ups and there was nowhere to put them — they lived
in `reviews/` and in nothing that gets read before starting work.

⚠️ **A deferred finding that evaporates is indistinguishable from one nobody
found.** Everything here was either verified and judged not worth blocking a
release, or verified and too large for one. Both reviews are filed under
`reviews/` with STATUS blocks; this is the part of them that is still open.

## Verification gaps — the ones that make other claims unsafe

- [ ] **No CI.** `.github/workflows` does not exist. `bun test`, `test:scene`,
      both typechecks and the live-example checker are all hand-run. 0.3.0's
      headline investment is a verification lane with nothing to run it on a
      push, a PR or a tag — and that is precisely how the doc-corpus gate went
      from passing to skipped without anyone noticing.
- [ ] **The doc-corpus gate is off** (`tests/doc-tests.pw.ts`, `test.fixme`),
      so every ` ```test ` fence in the package is inert: the standard-scene
      renderer assertions in `runtime/ensemble-element.ts` and all four in
      `runtime/features-scene.ts`. Blocked on **tosijs-ui#158** — the
      documented `import 'tosijs-ui/doc-browser'` is a no-op the bundler
      removes. Highest-leverage open upstream item for this repo.
      ⚠️ While it is off, CLAUDE.md's claim that the scene lane covers
      "sun, fill, skybox, camera, ground extent and fog mode/density" is
      unverified. Either restore the runner or downgrade the wording — a claim
      of coverage is worse than a gap when the gate is dark.
- [ ] **No test drives a physical keystroke through the property panel.**
      `tests/property-panel.pw.ts` drives the component API, so it covers the
      WRITE path and not the ROUTING path — and routing is the half that
      silently committed `x: 1123` on a piece's position when you typed into a
      colour field. Needs a pointer tap on the field's SVG to make it the
      group's active field, then a real `keydown`.
- [ ] **The 480-line editor change is verified by "it mounts."** The adopted
      filtered table, row menu and shelf spinner, the `ComponentAttrs`
      retyping, and the curve panels have no browser assertion. Both of the
      0.3.0 review's editor findings were in this unwatched surface.
- [ ] **The re-parent regression test CLAUDE.md prescribes has never been
      written** — SPA-navigate back and forth ~20 times and count outcomes,
      explicitly NOT reload. tosijs-3d#58 stays 🟡 FIXED UPSTREAM, UNVERIFIED
      HERE until it is.
- [ ] **No bundle-size signal.** `bun run build` prints the doc site's sizes,
      never the library entry a consumer ships and never a delta.
      `tree-shaking.test.ts` is the natural home, but its game-import fixture
      is a pure re-export barrel that Bun shakes to a 101-byte stub — so a
      ceiling added today would assert against 101 bytes. Change the fixture to
      one that CONSUMES the exports first.

## Correctness and safety

- [ ] **Library URLs get no scheme check.** `validate` requires only
      non-empty, so a shared ensemble decides which host the viewer's browser
      calls on open. No code execution — `javascript:` in a fetch does nothing
      — which is why it did not block 0.3.0. It needs a scheme _policy_ before
      a fix: is `data:` legitimate? `blob:`, which the editor may create for a
      local file? That decision belongs with the trust-boundary question in
      tosijs#43 rather than squeezed into a release.
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

- [ ] **Remove the `.prettierrc` markdown override** once tosijs-ui#141's fix
      is confirmed in 1.14.x. It forces single quotes because the live-example
      parser rejects double-quoted specifiers.
- [ ] **Adopt `x-useful` / `x-wavelength`** for slider soft bounds. tosijs-3d
      0.8.1 ships them; `schema-panel` does not read them.
