# Static assets, and where they came from

## `favicon.svg`

The project icon, drawn by the owner in AMDN. A capital **E** built out of
mismatched pieces — ribbed spine, riveted plate and bellows, a wheeled link with
a spanner, a shaft-and-collar assembly — inside a red group frame with handles
at its corners.

**The frame is the subject, not scaffolding.** An ensemble is a group of unlike
parts selected and treated as one thing, which is the whole project in one
glyph; it is also the same affordance the editor draws around a selection. It
was stripped on the way in, read as registration marks left over from drawing,
and put back when the owner said what the icon actually was.

Two changes from the file as supplied: `width`/`height` of 64px removed so it
scales to whatever asks for it, and a `<title>` added for screen readers. The
geometry is untouched — 64 paths, `viewBox` 0 0 64 64.

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
