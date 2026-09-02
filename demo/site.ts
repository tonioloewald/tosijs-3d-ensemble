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
