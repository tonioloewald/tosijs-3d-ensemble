import { test, expect } from "@playwright/test";

/*
  PAGE ERRORS, WITH THEIR STACKS.

  `String(e)` on a `pageerror` gives the message and throws the stack away —
  which is fine until a failure happens only on the runner. CI's first green
  run reported `TypeError: Cannot redefine property: onBeforeViewRenderObservable`
  and the message alone said nothing about who called it. (It was later
  found on every machine, not just the runner — see KNOWN below.)
*/
export const collectPageErrors = (page: {
  on: (event: "pageerror", cb: (e: Error) => void) => void;
}): string[] => {
  const errors: string[] = [];
  page.on("pageerror", (e) => {
    /*
      THE STACK IF THERE IS ONE, THE MESSAGE IF THERE IS NOT.

      Two wrong spellings on the way here, both worth naming because they fail
      in opposite directions:

      - `e.stack ?? String(e)` records `""` when a pageerror carries an EMPTY
        stack rather than a missing one — `??` only falls through on nullish.
        The dev server's own failed import then came through blank and failed
        a test it had always been filtered out of.
      - appending the stack only when it does NOT already contain the message
        throws the stack away for every ORDINARY error, because `Error.stack`
        conventionally begins with the message. That is how a CI failure came
        back a second time with no more information than the first.

      A non-empty stack already contains the message, so prefer it whole.
    */
    const stack = e.stack?.trim();
    errors.push(stack ? e.stack! : String(e));
  });
  return errors;
};

/*
  KNOWN, FILED, AND STILL GATED FOR EVERYTHING ELSE.

  Two errors are filtered BY NAME rather than by dropping the check, because a
  page error nobody asserted on is still a broken page:

  - **`dev.js`** — the dev server's live-reload client, served on its own port
    and absent under `bun bin/site.ts`. An artifact of the harness.
  - **`Cannot redefine property: onBeforeViewRenderObservable`** —
    tosijs-ui#191. ⚠️ THIS ENTRY'S FIRST EXPLANATION WAS WRONG, TWICE. It was
    filed as tosijs-3d#78, "Linux/SwiftShader only, non-fatal". It is neither:
    it reproduces on every load on macOS too — we never looked again, because
    this filter hid it from the day it was written — and Babylon logs
    `Unable to compile effect` for the `layer` and `line` shaders beside it.
    The cause is our doc site loading its ESM entry TWICE: the page as
    `hydrate.js?v=<hash>`, the code-split chunks as bare `../hydrate.js`, so
    Babylon's once-only prototype patch runs twice. Measured by rewriting the
    page to the bare URL: 10 errors and 2 shader failures → 0 and 0,
    alternating runs. A filter is a place a bug goes to be forgotten; this
    one needed a failing upgrade to be looked at again.

  Each entry comes out when its issue lands. A filter with no issue behind it
  is how a lane stops being evidence.
*/
const KNOWN: ReadonlyArray<{ match: string; why: string }> = [
  { match: "/dev.js", why: "dev-server live-reload client, absent in a build" },
  {
    match: "Cannot redefine property: onBeforeViewRenderObservable",
    why: "tosijs-ui#191 — the ESM entry is evaluated twice (stamped + bare URL)",
  },
];

export const realErrors = (errors: string[]): string[] =>
  errors.filter((e) => !KNOWN.some((k) => e.includes(k.match)));
