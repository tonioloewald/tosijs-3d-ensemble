# Static assets, and where they came from

## `waterbump.png`

The normal map `b3dWater` expects. **tosijs-3d defaults `normalMap` to
`/waterbump.png` but does not ship the file** — it lives in that repo's own
`static/`, so every consumer has to supply it at that exact root-absolute path
or get water with no ripples.

Copied from `tosijs-3d/static/waterbump.png`. Filed upstream as tosijs-3d#46.

It failed silently and interestingly: this site's dev server answers an unknown
path with the SPA shell — **HTML, at status 200** — so Babylon fetched a page,
failed to decode it as an image, and substituted its fallback checkerboard. The
sea rendered as a tiled grid that looked deliberate enough to be complimented
before it was diagnosed. A 404 would have named the problem instantly; see
tosijs-ui#116.
