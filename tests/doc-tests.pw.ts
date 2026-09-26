import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  THE WHOLE CORPUS, IN ONE NAVIGATION.

  This is the programmatic version of what a live-example doc site already does
  for a human: open the page, look, and see whether everything is working. The
  doc browser runs every page-with-tests in hidden iframes and resolves
  `window.__docTestResults` with the totals, so one `goto` gates the lot.

  Two kinds of coverage arrive here, and the second is free:

  - **` ```test ` fences** we wrote, asserting the renderer — see
    `runtime/ensemble-element.ts` and `runtime/features-scene.ts`.
  - **"example loads without error"**, generated for every page that has a live
    example. That is the "refresh and see" signal, and it is not decorative: it
    is what finally reported that the README's headline example had never run,
    and therefore that it had been naming `registerBuiltInFeatures` — a
    function this package has never exported — since the repo began.

  Playwright's job here is small on purpose: drive a browser, read one promise.
  The tests themselves are in the docs, next to the thing they test, and they
  run in a plain browser too. That keeps the option of running the same tier
  through haltija, or across engines, without rewriting a single assertion.
*/

interface PageResult {
  passed: boolean;
  totalPassed: number;
  totalFailed: number;
  tests: Array<{ name: string; passed: boolean; error?: string }>;
}
interface DocTestResults {
  passed: number;
  failed: number;
  pages: Record<string, PageResult>;
}

declare global {
  interface Window {
    /** Set by tosijs-ui's doc browser; resolves when the corpus has run. */
    __docTestResults?: Promise<DocTestResults>;
  }
}

test.describe("the doc corpus", () => {
  /*
    ⚠️ IT WAS `fixme` FOR A WEEK, AND THE DIAGNOSIS WAS ONE LAYER OFF.

    tosijs-ui 1.14 removed `doc-browser` from the barrel and documents
    `import 'tosijs-ui/doc-browser'` as the fix. We added that import, the
    corpus still never appeared, and it was filed as tosijs-ui#158 on the
    theory that the import was a no-op the bundler removed.

    The real cause was next door: 1.14 also removed the DOC SYSTEM from the
    barrel (tosijs-ui#133), and `<tosi-doc-system>` is what the doc browser
    runs inside. Measured on the published site,
    `customElements.get('tosi-doc-system')` was FALSE — so no live examples
    anywhere, every fence rendering as inert `<pre>`, and no corpus. Importing
    `tosijs-ui/doc-system/doc-system.js` explicitly restored all of it at once:
    3 examples on the home page, and 6 passed / 0 failed here.

    The lesson is the repo's own: a bare import that LOOKS like the documented
    fix is not evidence the thing it registers exists. Ask the browser whether
    the element is defined.
  */
  test("every in-page test passes", async ({ page }) => {
    /*
      The SHARED collector, not a private `pageerror` list. This file kept its
      own, so it was the one test the named, filed exceptions in
      `page-errors.ts` did not reach — and it went red on tosijs-ui 1.15.4
      only because the doubled-entry error (tosijs-ui#191) started landing
      before the corpus finished rather than after. One filter, every test.
    */
    const errors = collectPageErrors(page);

    await page.goto("/", { waitUntil: "load" });
    await page.waitForFunction(() => !!window.__docTestResults, null, {
      timeout: 60_000,
    });

    const results = (await page.evaluate(
      () => window.__docTestResults as Promise<unknown>
    )) as DocTestResults;

    /*
      GUARD THE GUARD. `failed === 0` is trivially true of a corpus that ran
      nothing — a broken runner, a bundle that lost the doc browser, or a
      config change that stopped harvesting fences would all present as a
      green suite. So the count has to be non-trivial before its zero means
      anything.
    */
    expect(results.passed).toBeGreaterThan(0);

    // Name what failed. A bare count sends you to the browser to find out
    // which page, which is the trip this lane exists to save.
    const failures = Object.entries(results.pages)
      .filter(([, p]) => !p.passed)
      .flatMap(([file, p]) =>
        p.tests
          .filter((t) => !t.passed)
          .map((t) => `${file} › ${t.name}: ${t.error ?? "(no error given)"}`)
      );
    expect(failures).toEqual([]);
    expect(results.failed).toBe(0);

    // A page error nobody asserted on is still a broken page.
    expect(realErrors(errors)).toEqual([]);
  });
});
