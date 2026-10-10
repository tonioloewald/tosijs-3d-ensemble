# After-action reports

Newest first. Facts, not analysis — the whys are asked in the quarterly
pattern review (practices/releasing.md step 10).

## 0.5.1 — 2026-10-10

- Went well: an additive patch through Tier 0 and the always-on fast review
  only; four of its five findings were fixed before the tag, and every new
  browser check was made to fail with its fix removed before it was trusted.
- Didn't: two of the new checks measured nothing at first. The race test
  never raced (tosijs batches two `src` writes in one tick into one load), and
  the library check passed on a placeholder box (which also has a `.mesh`).
  The doc page was claimed as the "pure markup" proof until falsifying showed
  something else on it registers the scene features first.
- Surprised: the review's verified finding (self-registration replacing a
  consumer's same-named feature) applied to the editor too, unnoticed since
  0.3.
- Friction: none in publishing; staged, approved and verified the same hour.
- Cycle: GO with followups; no re-review.

## 0.5.0 — 2026-10-09

- Went well: shipped for Manta (on tosijs-3d 0.9.0, peer-blocked on 0.4.0)
  through the full pre-minor gate; the review's BLOCK was the version level
  only and its confirmed major was fixed in the release commit. Three upstream
  issues we filed shipped in tosijs-3d 0.8.8-0.8.13 and were adopted here.
- Didn't: asked for "a patch"; 25 commits whose CHANGELOG opened with
  Breaking. The question was asked before cutting, and the owner chose the
  minor. The defaults change (M1) broke terrain height and nothing caught it
  until the review.
- Surprised: every library piece had rendered white since at least 0.4.0
  (tosijs-3d#102), read for weeks as the kit's style; the editor's slowdown
  was our own obsolete 12 s poll, not only the upstream leak.
- Friction: two scene tests failed only under release-doctor's load; the AO
  test asserted an implementation detail that 0.8.14 changed.
- Cycle: BLOCK (version level) -> cut as 0.5.0 -> GO; no re-review needed.

## 0.4.0 — 2026-09-26

- Went well: first release through OIDC + staged publishing and a local
  attestation; the dry run was green to staging and the real run verified the
  registry's bytes. tosijs-3d 0.8.4 retired nine of our stopgaps in one upgrade.
- Didn't: the https url rule took four review passes (three majors → fixed →
  BLOCK on the same class → fixed as a class → GO). CI sat red for three pushes
  unread (Bun 1.4.0 vs 1.4.2).
- Surprised: `onBeforeViewRenderObservable`, filtered for weeks as "Linux only,
  non-fatal", was our own doc site loading its entry twice (tosijs-ui#191). The
  "10× CI regression" was a comparison against a run where the test was skipped.
- Friction: a day on CI budgets, skips and a bisect for browser tests, ended by
  moving them out of CI. Attestation failed twice on a flaky re-parent baseline
  under machine load before it passed.
- Cycle: M1–M3 (url rule) → fix → BLOCK (array-wrapped url; unmarked sound.url)
  → class fix → GO with followups.
