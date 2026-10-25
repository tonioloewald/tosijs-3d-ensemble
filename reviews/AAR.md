# After-action reports

Newest first. Facts, not analysis — the whys are asked in the quarterly
pattern review (practices/releasing.md step 10).

## 0.9.0 — 2026-10-25

- Went well: cut for Manta (#3486, its dependency check failing on 0.8.1's
  ^0.10 peer). release-doctor clean on its first run; the scene lane now
  builds into .test-site/ (#3442), so it no longer rewrites docs/. Attest
  47 + 1, dry run, stage, and approval all inside about 40 minutes.
- Didn't: the review found that #3437's own fix (the document's effect
  activity reaching the tool) broke again on a preset change. Fixed before
  the tag, with a failing-first step.
- Surprised: the user skill's pre-release-review.workflow.js was missing
  from ~/.claude/skills/; the Workflow tool also refused the practices
  copy by path until it was copied into the session scratchpad.
- Friction: the docs lens could not regenerate docs because a correctness
  lens's Playwright server held the build lock; lenses that run browser
  tests in parallel share one port.
- Cycle: pre-minor full review -> GO_WITH_FOLLOWUPS (0 blockers, 0 majors,
  3 verified minors: 1 fixed, 1 docs fixed, 1 filed) -> follow-ups #3495 ->
  sizes -> attest -> dry run -> publish -> verified.

## 0.8.1 — 2026-10-20

- Went well: tosijs-3d turned #122 (embeddable tools) and #124 (a 0.10.19
  regression our effect test caught, 3/3) into releases the same day, and the
  effect tool is hosted on an effect piece. Seven of eight 0.8.0 follow-ups
  closed, including nine dead doc links nothing had ever reported.
- Didn't: release-doctor's first run failed because I ran browser tests and
  edited files while it ran: they shared its port-8039 server, and the dev
  server rewrote docs/. Rerun alone it was clean. Never run anything beside
  release-doctor or release:attest.
- Surprised: the hosted effect tool echoes a NORMALISED recipe, so comparing
  it with the document's restarted the effect on every sync; track what the
  document last said instead.
- Friction: approval reached npm in time on this one (I said when it was
  staged, after 0.8.0's timed out).
- Cycle: always-on fast review -> GO_WITH_FOLLOWUPS (1 major fixed, 6 minors
  #3437-#3442) -> release-doctor clean (second run) -> attest (42 + 1) ->
  publish -> verify_only green.

## 0.8.0 — 2026-10-20

- Went well: nested ensembles landed end to end (flatten at load, drill in
  and pop out) on SPEC's design, with transforms checked against Babylon's
  own parenting. tosijs-3d turned five asks into releases within the day
  (#118-#122: effect, landform and recipe schemas, slider stops, embeddable
  tools). The pre-minor review found 7 majors and no blockers; all were fixed
  with tests that fail without them, including a fan-out bomb that made
  335,922 fetches for 7 documents (now 7).
- Didn't: the publish waited 60 minutes for npm approval, then timed out and
  reported SUCCESS with nothing published (an approval sent too early). Read
  the stage log, not the run's colour. I also spent hours on timing and
  machine-load theories for lost clicks that one elementFromPoint call
  settled: the doc site's test widget (tosijs-ui#233).
- Surprised: another project (SFB) running CPU-GL sims pushed load to ~30,
  which made headless WebGL run at ~1 fps; and `bun test` loses 3 tests when
  the dev server rebuilds docs/ during the run (632 with it stopped).
- Friction: stash/checkout under a running dev server deleted parts of docs/
  (restored from git). Stop the dev server before touching the tree.
- Cycle: pre-minor review -> GO_WITH_FOLLOWUPS (7 majors fixed; #3423-#3430
  filed; no re-review, none was a blocker) -> attest (41 + 1) -> dry run ->
  publish (approval timed out once) -> verify_only green.

## 0.7.0 — 2026-10-19

- Went well: the editor chrome moved onto tosijs-3d's in-scene system panels.
  Twelve upstream asks (tosijs-3d #104–#116) were filed and shipped in time to
  adopt; the release needed 0.10.14. The two review majors were fixed with
  tests that fail without them: M1, a nested-object edit dropped earlier
  siblings; M2, Save wrote over the document the user had left.
- Didn't: I claimed there was no colour picker and no dropdown before
  checking; the owner corrected me. I filed and then retracted tosijs-3d#108
  after misreading a quaternion rotation as no rotation. CI went red once
  because UPSTREAM.md changed and docs/ was not rebuilt (that is a memory rule).
- Surprised: two problems I first read as upstream were ours. Panels
  overlapped because of our own layout, not a hit-test bug. The still-sky
  probe measured the ground and passed vacuously.
- Friction: dev servers sharing the build tree contaminated the falsification
  runs. During attestation, the doc corpus reported features-scene.ts "did not
  finish within 45s" under the load of 29 WebGL lanes. It was a timeout with
  no failed test, and it does not reproduce unloaded (#3172 pattern).
- Cycle: pre-minor review -> GO_WITH_FOLLOWUPS (M1, M2 fixed; #3392–#3394
  filed) -> attest -> dry run -> publish -> verify_only green.

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
- Downstream: the review's unchecked manta-recon upgrade was confirmed by the
  owner after publishing ("Manta seems happy"), not by a test run here.

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
