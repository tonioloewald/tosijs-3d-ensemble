# After-action reports

Newest first. Facts, not analysis — the whys are asked in the quarterly
pattern review (practices/releasing.md step 10).

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
