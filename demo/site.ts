// Hydration bundle entry — loaded by every generated page AND by the
// full-screen editor route at /editor.html.
//
// Importing the package here is what registers `<tosi-ensemble-editor>`: the
// editor is a component, so the route is a plain page that uses it, with no
// privileged access to anything.

import 'tosijs-ui' // registers <tosi-doc-system> and the tosi-* element family
import * as tosijs from 'tosijs'
import * as tosijsui from 'tosijs-ui'
import * as tosijs3d from 'tosijs-3d'
import * as ensemble from '../src/index'
import * as combat from '../src/presets/combat'
const { registerCombatPreset } = combat

ensemble.registerSceneFeatures()
// The doc site demonstrates both, so it registers the domain preset too. A
// consumer that only wants scenes never imports this.
registerCombatPreset()

// Live examples import by package name; seed the doc system's context so an
// inline `import { validate } from 'tosijs-3d-ensemble'` resolves.
for (const el of document.querySelectorAll('tosi-doc-system')) {
  ;(el as unknown as { context: Record<string, unknown> }).context = {
    tosijs,
    'tosijs-ui': tosijsui,
    'tosijs-3d': tosijs3d,
    'tosijs-3d-ensemble': ensemble,
    // The subpath is a real entry point (package.json `exports` has `./*`), so
    // examples that show the opt-in preset import must resolve too.
    'tosijs-3d-ensemble/presets/combat': combat,
  }
}
