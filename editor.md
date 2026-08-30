---
title: Editor
layout: full-screen
order: 2
---

<!--
  The whole page is the element. `title` above is what names it in the nav and
  the tab, so there is no `# Editor` heading eating a band of the viewport.

  `position: absolute` is the workaround for the `<p>` markdown wraps a lone
  block-level tag in: out of flow, the paragraph's auto height stops mattering
  and `inset: 0` fills the containing block instead of collapsing to
  `min-height`. It beats the `calc(100dvh - 4rem)` it replaces, which
  hard-coded the navbar's height and would have been wrong the moment the
  navbar changed.

  It resolves against the VIEWPORT, deliberately. There is no positioned
  ancestor and `.doc-content` must not become one: on this page the whole
  chrome is fixed-position and `html` measures sixteen pixels, so an `inset: 0`
  aimed at `.doc-content` gives a sixteen-pixel box. Aimed at the viewport it
  gives the window.

  `top` and the height both come from `--header-height`, the doc system's own
  variable, rather than a number measured off a screenshot — `top: 0` filled
  the window but covered the global navigation, which is the thing this page
  moved here to get. The height is stated rather than left to `bottom: 0`,
  which the element's own styling wins against: it overhung the viewport by
  exactly the header.

  Filed as tosijs-ui#115; when raw `.html` doc pages land, none of this is
  needed.
-->
<tosi-ensemble-editor src="/ensembles/pirate-cove.json" style="display:block;position:absolute;top:var(--header-height,3.5rem);left:0;right:0;height:calc(100dvh - var(--header-height,3.5rem));min-height:30rem"></tosi-ensemble-editor>
