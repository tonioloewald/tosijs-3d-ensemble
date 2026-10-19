# Editing

The editor as a **component**, not an application — drop it on a page, give it a
library and an ensemble, and it edits. Its chrome is built on tosijs-3d's SVG
UI rather than DOM widgets, so it runs in a headset as well as flat: arranging
things in space is a spatial task, and a tool for it that cannot be used _in_
that space concedes its best affordance.

[Open the editor](/editor/) to see it working. That page is nothing but the
element and a `src` — the ensemble names the libraries it needs, so the page
knows nothing about the content it is showing. Point `src` at
`/ensembles/city-block.json` for a scene drawn from four libraries at once.

<!-- toc -->
- [<tosi-ensemble-editor>](/ensemble-editor/)
- [Tools and commands](/tool-registry/)
- [The built-in tools](/built-in/)
- [The select-and-transform tool](/transform/)
- [Undo](/history/)
<!-- /toc -->
