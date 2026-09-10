import { test, expect } from "@playwright/test";

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
    ⚠️ `fixme`, NOT `skip`, and not deleted — tosijs-ui#158.

    tosijs-ui 1.14 removed `doc-browser` from the barrel for bundle size and
    documents `import 'tosijs-ui/doc-browser'` as the fix. That module has no
    top-level side effect, so the import is a no-op the bundler removes:
    measured on a clean build, `tosi-tests-done`, `pagesWithTests` and
    `createDocBrowser` are all absent from the emitted bundle while
    `live-example`'s strings are present. The site renders perfectly and
    `window.__docTestResults` never appears.

    `fixme` because Playwright reports it distinctly from a pass. A green suite
    with a silently disabled gate is the exact failure this gate exists to
    catch — "we didn't look" and "we looked and it's fine" must not produce the
    same output. Remove this line when #147 lands; the assertions below are
    unchanged and were passing before the upgrade.
  */
  test.fixme("every in-page test passes", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

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
    expect(errors).toEqual([]);
  });
});
