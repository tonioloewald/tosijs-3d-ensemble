// Site configuration for the tosijs-3d-ensemble doc site.
// Consumed by bin/site.ts (build + dev). See tosijs-ui/site for the option set.

import { defineSiteConfig } from 'tosijs-ui/site'

const PROJECT = 'tosijs-3d-ensemble'

export default defineSiteConfig({
  name: PROJECT,
  description:
    'The tosijs-3d ensemble format, its instantiator, and a graphical editor for authoring ensembles.',

  projectLinks: {
    tosijs: 'https://tosijs.net',
    github: `https://github.com/tonioloewald/${PROJECT}`,
  },
  navbarLinks: [
    { href: '/editor.html', label: 'editor', icon: 'edit' },
    { href: 'https://3d.tosijs.net', label: 'tosijs-3d', icon: 'tosiXr' },
    { href: `https://github.com/tonioloewald/${PROJECT}`, label: 'github', icon: 'github' },
  ],

  theme: {
    accent: '#2f9e8f',
    background: '#fafafa',
    text: '#222222',
  },

  // Docs are extracted from `/*# … */` blocks in the source, plus the root
  // markdown. SPEC.md and PLAN.md are the decision record and belong on the
  // site: this format is meant to be generated FOR, and a format nobody can
  // read is a format nobody else will target.
  docPaths: ['src', 'README.md', 'SPEC.md', 'PLAN.md', 'UPSTREAM.md'],
  bundleEntry: './demo/site.ts',
  staticDirs: ['static'],
  port: 8032,
  // `staticDirs` is copied into the output at BUILD time, so without this the
  // dev server serves a stale copy: editing a sample ensemble does nothing and
  // reports nothing, which reads as "my change had no effect" rather than
  // "nobody rebuilt".
  watchPaths: ['static'],

  // Live examples in the doc comments import THIS package by name, so the
  // build-time checker needs the same context demo/site.ts seeds at runtime.
  // (Disabling the checker instead is how a page ships teaching its own core
  // contract with a SyntaxError in the example — tosijs-ui#71.)
  checkExamples: { contextKeys: ['tosijs', 'tosijs-ui', 'tosijs-3d', PROJECT, `${PROJECT}/presets/combat`] },

  // The library build: per-file `.js` + `.d.ts` with comments kept, so the
  // published package ships browseable source with the doc blocks intact.
  emitLibrary: true,
  libraryTsconfig: 'tsconfig.build.json',

  // Agent eyes/hands on the running dev page (localhost-gated, never bundled).
  haltijaDev: true,
})
