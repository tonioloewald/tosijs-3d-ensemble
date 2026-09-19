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

## `waterbump.png` — GONE, and why the note stays

There was a copy of tosijs-3d's water normal map here, because `b3dWater`
defaulted `normalMap` to `/waterbump.png` and the package did not ship the file.
The sea rendered as Babylon's fallback checkerboard, which reads as a style
rather than a fault.

**tosijs-3d 0.7.4 generates the map procedurally** (tosijs-3d#46, our report), so
there is no file to serve and no path to get wrong — and an explicit `normalMap`
that fails to load now logs an error instead of silently becoming a checker
pattern. Nothing here sets `normalMap`, so the default applies and the copy is
deleted.

The note stays as the record of how it failed: a decoder that substitutes on
error turns a missing asset into a design decision, and this site's dev server
answered the missing path with the SPA shell at status 200 (tosijs-ui#116), so
neither end reported anything wrong.
