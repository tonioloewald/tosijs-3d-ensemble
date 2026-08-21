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

ensemble.registerBuiltInFeatures()

// Live examples import by package name; seed the doc system's context so an
// inline `import { validate } from 'tosijs-3d-ensemble'` resolves.
for (const el of document.querySelectorAll('tosi-doc-system')) {
  ;(el as unknown as { context: Record<string, unknown> }).context = {
    tosijs,
    'tosijs-ui': tosijsui,
    'tosijs-3d': tosijs3d,
    'tosijs-3d-ensemble': ensemble,
  }
}
