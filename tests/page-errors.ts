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
      MESSAGE FIRST, STACK APPENDED — not `e.stack ?? String(e)`.

      A `pageerror` can carry an EMPTY stack rather than a missing one, and
      `??` only falls through on nullish, so that spelling recorded `""` and
      the name-based filter below stopped matching anything. Measured: the
      dev-server's own failed import came through as a blank entry and failed
      a test it had always been filtered out of.
    */
    const stack = e.stack && !e.stack.includes(String(e)) ? `\n${e.stack}` : "";
    errors.push(`${String(e)}${stack}`);
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
