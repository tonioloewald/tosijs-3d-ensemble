import { test, expect } from "@playwright/test";

/*
  PAGE ERRORS, WITH THEIR STACKS.

  `String(e)` on a `pageerror` gives the message and throws the stack away —
  which is fine until a failure happens only on the runner. CI's first green
  run reported `TypeError: Cannot redefine property: onBeforeViewRenderObservable`
  from a Linux/SwiftShader Chromium, reproducible on no machine here, and the
  message alone says nothing about who called it.
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
  `dev.js` is the dev server's live-reload client, served on its own port and
  absent under `bun bin/site.ts`. Its failed dynamic import is an artifact of
  the harness, not of the page — filtered by NAME rather than by dropping the
  check, because a page error nobody asserted on is still a broken page.
*/
export const realErrors = (errors: string[]): string[] =>
  errors.filter((e) => !e.includes("/dev.js"));
