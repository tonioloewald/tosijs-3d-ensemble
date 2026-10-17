# After-action reports

Newest first. Facts, not analysis — the whys are asked in the quarterly
pattern review (practices/releasing.md step 10).

## 0.6.0 — 2026-10-17

- Went well: tosijs-3d 0.10.8/0.10.9 retired six stopgaps (planet schema,
  terrain pin, two leak workarounds, the polling planet link, the sky poll);
  each removal was proven by its test still passing, and every new check was
  falsified. The planet <-> terrain link works either way, measured against
  an unlinked control. Pre-minor review: no blockers, three majors, all fixed
  with checks that fail when the fix is reverted.
- Didn't: two regressions reached the owner while they used the editor —
  panel rotation was not live (rebuild per scrub, plus a key-order slip) and
  AO "did nothing" (projected AO at noise level; our test asserted the flag).
  I filed tosijs-3d#108 from a probe that read `node.rotation` while the
  element turns by quaternion, and had to retract it.
- Surprised: the circle the owner was clicking was the table's selection
  radio, not a toggle; terrain's "plane" default had been outside upstream's
  enum for months; two test probes passed vacuously (still-sky clipping the
  ground, the rotate-drag falsification served from a shared build tree).
- Friction: dev servers I started for the owner shared the build tree with
  the test lanes and contended for the build lock: one falsification was
  meaningless and the first attestation timed out. Stop them during lanes.
- Cycle: doctor clean -> pre-minor GO_WITH_FOLLOWUPS (3 majors) -> fixed ->
  attest (failed under load, passed quiet) -> dry run -> tag -> approved ->
  verified.

## 0.5.2 — 2026-10-13

- Went well: tosijs-3d 0.10 admitted by WIDENING the peer range, so 0.9
  consumers (Manta) are not forced; every suite was run against 0.10.0 first.
  Four board bugs fixed with tests that fail under the old behaviour.
- Didn't: my edit scripts had written literal backslash-backticks into ~20 doc comments since
  0.5.0, the editor's published doc page included; the review caught it, and
  the first fix reintroduced three more.
- Surprised: a rapid-edits failure on 0.10 was a test baseline taken against
  the editor's empty start state (3 meshes vs 74), the same class as the
  re-parent baseline before 0.4.0.
- Friction: none in publishing.
- Cycle: GO with followups; no re-review.

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
