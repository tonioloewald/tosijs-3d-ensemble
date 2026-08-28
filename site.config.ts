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

  /*
    Remote access — `bun run tunnel` publishes THIS dev server, not a static
    copy, so the live editor, its live examples and "save local" all work from
    a phone or a hotel.

    The `.edit.` label is signage that MEANS something: `<project>.dev` is a
    shareable read-only snapshot, `<project>.edit.dev` is a writable mirror of
    an uncommitted tree, and this is the latter. `requireToken` stays at its
    default of true — the hostname is not a secret, since Let's Encrypt
    publishes every certificate to public CT logs.

    `remotePort` MUST be unique per project on the box: sshd's `GatewayPorts no`
    binds it to loopback, so two projects sharing a port means whichever ssh
    connected first wins while the other silently forwards nothing. tosijs-ui
    holds 9787 and tosijs-3d 9788, so this takes 9789.

    The HOST comes from the environment, never the repo — a committed `user@ip`
    means any fork running `bun run tunnel` opens outbound SSH to a stranger's
    box.
  */
  preview: {
    host: process.env.PREVIEW_HOST ?? '',
    tunnel: { remotePort: 9789, url: 'https://ensemble.edit.dev.tosijs.net' },
  },
})
