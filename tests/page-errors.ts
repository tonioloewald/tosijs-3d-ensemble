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

  One error is filtered BY NAME rather than by dropping the check, because a
  page error nobody asserted on is still a broken page:

  - **`dev.js`** — the dev server's live-reload client, served on its own port
    and absent under `bun bin/site.ts`. An artifact of the harness.

  Collected, 2026-10: **`Cannot redefine property:
  onBeforeViewRenderObservable`**, filtered for weeks as tosijs-3d#78 ("Linux
  only, non-fatal" — it was neither). It was our doc site loading its ESM entry
  twice, `hydrate.js?v=<hash>` from the page and `../hydrate.js` from the
  chunks, so Babylon's once-only prototype patch ran twice and broke shaders.
  tosijs-ui 1.16.0 fixed it (#191) by naming the entry `hydrate-<hash>.js`.
  Measured on removal: 10 errors and 2 shader-compile failures per load
  before, 0 and 0 after, one entry URL. A filter is a place a bug goes to be
  forgotten; this one came out the day its issue landed.

  Each entry comes out when its issue lands. A filter with no issue behind it
  is how a lane stops being evidence.
*/
const KNOWN: ReadonlyArray<{ match: string; why: string }> = [
  { match: "/dev.js", why: "dev-server live-reload client, absent in a build" },
];

export const realErrors = (errors: string[]): string[] =>
  errors.filter((e) => !KNOWN.some((k) => e.includes(k.match)));
