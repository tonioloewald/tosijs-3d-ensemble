---
title: Editor
layout: full-screen
order: 2
---

<!--
  The whole page is the element. `title` above is what names it in the nav and
  the tab, so there is no `# Editor` heading eating a band of the viewport.

  `dvh`, not `height: 100%`, though full-screen's `.doc-content` sets a definite
  height and the doc says 100% should work: markdown wraps a lone block-level
  tag in a `<p>`, and that paragraph is auto-height, so 100% resolves against it
  and collapses to `min-height`. `html` and `body` are auto here too. Filed as
  tosijs-ui#115; when that lands this becomes `height: 100%`.
-->
<tosi-ensemble-editor src="/ensembles/pirate-cove.json" style="display:block;height:calc(100dvh - 4rem);min-height:30rem"></tosi-ensemble-editor>
