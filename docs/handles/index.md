# Manipulator geometry

The maths a manipulator needs, as **pure functions**. No scene, no engine, no
pointer — so the part most likely to be subtly wrong is the part that can be
tested without a browser.

Each grip answers one question: *given where the pointer is aiming now, what
value should this handle have?*

- **translate** — the point on the axis closest to the pointer's ray
- **planar** — where the ray crosses the plane the grip lies in, as a point
- **rotate** — the angle around the axis where the ray crosses its plane
- **scale** — the same projection as translate, read as a ratio
- **uniform** — the ray's distance from the widget centre, read as a ratio

## A grip, not a mode

The widget shows every enabled affordance AT ONCE and lets the grip you grab say
what the drag means — the shape Cheetah 3D's universal manipulator made its
reputation on. A mode switch asks the author to declare their intent twice: once
to the toolbar, and again to the handle. Here `Grip` is the whole vocabulary,
and it is what a pick returns.

## Snapping quantises the VALUE, not the movement

A drag that snaps by stepping the delta accumulates error: sixty frames of
`round(delta)` is not `round(sixty deltas)`, and a piece walks off the grid over
a long drag. Quantising the resulting absolute value instead means a snapped
piece is always exactly on the grid, however it got there.
