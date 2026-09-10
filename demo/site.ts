// Hydration bundle entry — loaded by every generated page, the editor page
// among them.
//
// Importing the package here is what registers `<tosi-ensemble-editor>`. The
// editor is a component, so `/editor/` is an ORDINARY doc page that happens to
// use it — `layout: full-screen` in `editor.md` is the whole of its special
// treatment. It had a hand-written `static/editor.html` until tosijs-ui 1.12
// made a doc page able to go full-screen and keep the global nav; a bespoke
// page bypassed that nav and quietly drifted from the rest of the site.

import "tosijs-ui"; // registers <tosi-doc-system> and the tosi-* element family
/*
  ⚠️ `<tosi-example>` IS A SEPARATE IMPORT, and without it every executable
  fence renders as plain text — including the ` ```test ` blocks, which means
  the doc-test corpus stops existing and `window.__docTestResults` is never
  set. No console error, no 404: the pages just quietly become prose.

  `bundleEntry` REPLACES the default bundle rather than extending it
  (tosijs-ui#145), and 1.14.1 added a build warning that says exactly this.
  Our scene lane caught it as a 30s timeout; the warning is what said why.
*/
import "tosijs-ui/live-example";
/*
  …and the doc BROWSER, which tosijs-ui 1.14's adoption page lists as REQUIRED.

  ⚠️ It does not currently do what that page says, and measuring it is the only
  reason we know. `dist/doc-browser.js` has no top-level side effect — its only
  `elementCreator` is inside a doc comment and the real content is an exported
  `createDocBrowser` factory — so this bare import is a no-op that the bundler
  removes. Measured on a clean build: `tosi-tests-done`, `pagesWithTests` and
  `createDocBrowser` are all absent from `docs/hydrate.js`, while
  `live-example`'s own strings are present.

  The site itself is fine — chrome, nav and live examples all work. What is
  gone is the background test RUNNER, so `window.__docTestResults` never
  appears and the doc-test corpus silently stops existing. Filed as
  tosijs-ui#158. The import stays because the adoption page says so and it
  costs nothing; the comment stays because it is currently untrue.
*/
import "tosijs-ui/doc-browser";
import * as tosijs from "tosijs";
import * as tosijsui from "tosijs-ui";
import * as tosijs3d from "tosijs-3d";
import * as ensemble from "../src/index";
import * as combat from "../src/presets/combat";
const { registerCombatPreset } = combat;

ensemble.registerSceneFeatures();
// The doc site demonstrates both, so it registers the domain preset too. A
// consumer that only wants scenes never imports this.
registerCombatPreset();

// Live examples import by package name; seed the doc system's context so an
// inline `import { validate } from 'tosijs-3d-ensemble'` resolves.
for (const el of document.querySelectorAll("tosi-doc-system")) {
  (el as unknown as { context: Record<string, unknown> }).context = {
    tosijs,
    "tosijs-ui": tosijsui,
    "tosijs-3d": tosijs3d,
    "tosijs-3d-ensemble": ensemble,
    // The subpath is a real entry point (package.json `exports` has `./*`), so
    // examples that show the opt-in preset import must resolve too.
    "tosijs-3d-ensemble/presets/combat": combat,
  };
}
