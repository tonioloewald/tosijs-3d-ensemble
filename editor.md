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

  `top: 0` and `height: 100%` against the SIDENAV'S CONTENT AREA, which becomes
  the positioned parent once the page hydrates — so this box already starts
  below the header and needs no offset for it.

  I had `top: var(--header-height)` here briefly, on the strength of measuring
  the element covering the navbar. That measurement was taken before hydration
  settled, when the containing block was still the viewport; against the real
  parent the same rule double-counts the header and leaves a white band of
  exactly that height across the top. Measure this one AFTER the layout
  settles — it changes shape underneath you.

-->

<!--
  `libraries` is the author's KIT SHELF — what this editor offers to insert
  FROM, which is not the same as what the ensemble needs to RENDER. The file
  declares `pirate` and loads fine anywhere without the rest; the three city
  kits are here so the library picker has something to pick between, and so
  the palette is not a demo of one kit.
-->

<tosi-ensemble-editor src="/ensembles/pirate-cove.json" libraries="[{&quot;name&quot;:&quot;pirate&quot;,&quot;url&quot;:&quot;https://cdn.tosijs.net/kenney/libraries/pirate-kit.glb&quot;},{&quot;name&quot;:&quot;roads&quot;,&quot;url&quot;:&quot;https://cdn.tosijs.net/kenney/libraries/city-kit-roads.glb&quot;},{&quot;name&quot;:&quot;commercial&quot;,&quot;url&quot;:&quot;https://cdn.tosijs.net/kenney/libraries/city-kit-commercial.glb&quot;},{&quot;name&quot;:&quot;suburban&quot;,&quot;url&quot;:&quot;https://cdn.tosijs.net/kenney/libraries/city-kit-suburban.glb&quot;}]" style="display:block;position:absolute;top:0;left:0;right:0;height:100%;min-height:30rem"></tosi-ensemble-editor>
