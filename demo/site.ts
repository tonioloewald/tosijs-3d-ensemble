// Hydration bundle entry — loaded by every generated page, the editor page
// among them.
//
// Importing the package here is what registers `<tosi-ensemble-editor>`. The
// editor is a component, so `/editor/` is an ORDINARY doc page that happens to
// use it — `layout: full-screen` in `editor.md` is the whole of its special
// treatment. It had a hand-written `static/editor.html` until tosijs-ui 1.12
// made a doc page able to go full-screen and keep the global nav; a bespoke
// page bypassed that nav and quietly drifted from the rest of the site.

import "tosijs-ui"; // the tosi-* element family (NOT the doc system — see below)
/*
  ⚠️ `<tosi-example>` IS A SEPARATE IMPORT, and without it every executable
  fence renders as plain text — including the ` ```test ` blocks, which means
  the doc-test corpus stops existing and `window.__docTestResults` is never
  set. No console error, no 404: the pages just quietly become prose.

  `bundleEntry` REPLACES the default bundle rather than extending it
  (tosijs-ui#145), and 1.14.1 added a build warning that says exactly this.
  Our scene lane caught it as a 30s timeout; the warning is what said why.
*/
/*
  ⚠️ EXPLICIT, because the barrel stopped registering it.

  `import 'tosijs-ui'` used to bring `<tosi-doc-system>` with it — the comment
  above still said so — but 1.14 removed the doc-system cluster from the
  barrel for bundle size (tosijs-ui#133), and nothing here noticed. Measured
  on the published site: `customElements.get('tosi-doc-system')` was FALSE,
  so the pass that turns a ```html or ```js fence into a live `<tosi-example>`
  never ran and every example on every page rendered as inert, unhighlighted
  `<pre>`. Nav and layout still worked, which is why it read as "the site is
  fine" — see tosijs-ui#159.
*/
import "tosijs-ui/doc-system/doc-system.js";
import "tosijs-ui/live-example";
/*
  ⚠️ NOT NEEDED, and measured rather than assumed.

  1.14's adoption note says to import this; we did, filed tosijs-ui#158 when
  the corpus still did not appear, and the real cause was next door — the DOC
  SYSTEM had left the barrel too, and the doc browser runs inside it. With the
  system imported above, removing this changes nothing: `__docTestResults`
  still resolves with the full corpus, 6 passed / 0 failed.

  So it goes. Keeping an import that does nothing is how the next reader
  concludes it must be load-bearing.
*/

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
