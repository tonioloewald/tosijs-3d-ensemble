# Manipulator handles

The visible part: a **universal widget**, in the sense Cheetah 3D means it.
Every enabled affordance is on screen at once and the part you grab is what says
what the drag means — drag a shaft to move along an axis, a pad to move in a
plane, a ring to turn, a cube to scale. tosijs-3d has no manipulator
(UPSTREAM.md #3) and Babylon's `GizmoManager` is mouse-shaped, so this is built
here — and built so a **hand** can grab it, not only a ray.

## Why one widget instead of a mode

A mode switch makes you say what you want twice: once to the toolbar and again
to the handle. It also costs a round trip for the commonest edit there is —
nudge it over, then turn it a bit. The cost is crowding, and the answer to that
is the transform set: turn off what you are not using and its grips are simply
not built. That is the same dial that makes this usable on a touchscreen, where
thirteen grips genuinely is too many.

## Sized for hands, not only for pixels

Handles carry a `nearRadius` and are picked two ways: a hand inside that radius
grabs directly, anything further grabs by pointing. A gizmo designed for a mouse
gets this wrong by being visually thin — fine for a pixel-accurate cursor,
impossible to grab with a controller you are holding at arm's length.

They also draw **on top** (`renderingGroupId`), because a handle buried inside
the mesh it manipulates cannot be clicked at all — and the piece an author most
wants to move is usually the one embedded in something else.
