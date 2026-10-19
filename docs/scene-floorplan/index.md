# Scene floorplan — visual regression without pixels

A **structural snapshot of what a scene actually draws**: one record per mesh
the camera can see, at its true world position and size. Comparing two of these
answers "did the picture change, and where" without ever rasterising anything.

```js
import { sceneFloorplan, floorplanDiff } from 'tosijs-3d-ensemble'

const before = sceneFloorplan(scene)
// …rebuild, edit, load a different file…
const moved = floorplanDiff(before, sceneFloorplan(scene))
if (moved.length) console.warn(moved)
```

## Why not a screenshot

Because a screenshot compares the wrong thing. Antialiasing, font hinting, GPU
driver and a shader that compiled differently all move pixels without moving
anything an author cares about, so an image diff reports 3.2% of pixels changed
and leaves you to work out whether that is a regression or a Tuesday. The
signal is real but it arrives wrapped in noise you cannot turn off.

A structural diff has the opposite properties. **A rectangle in the same place,
or very nearly, versus absent — that is non-flaky signal.** Tolerance is a
number you set rather than a rendering artefact you fight, and a failure names
the thing:

    ground: moved (0, 0, 0) → (0, -12, 0)
    watchtower: GONE

rather than a percentage and a heat map.

This is Tonio's observation about `tosijs-floorplan` applied to a renderer:
floorplan turns a DOM page into `{caption, bounds}` records and compares
those instead of images, and a scene graph already IS that data — Babylon keeps
an authoritative draw list because it has to. The two are the same idea over
different substrates, which is the argument in tosijs-ui#142.

## What it deliberately does NOT capture

Colour, material, lighting, shadow. This says a thing is *there, at that size,
in that place* — the layout claim, not the appearance one. Appearance still
wants a human, or a vision model looking at a picture; the point is that
LAYOUT no longer has to borrow the picture's flakiness to get checked.

`activeOnly` (the default) reads the post-frustum-culling draw list, so an
object behind the camera is legitimately absent. That is usually what you want
— "what does this look like" — but it makes the snapshot camera-dependent, so
compare snapshots taken from the same viewpoint or pass `activeOnly: false`.
