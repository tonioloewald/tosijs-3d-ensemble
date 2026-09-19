# Internals

Mechanics, kept here so the pages above stay about the thing rather than its
plumbing. Most of it is **pure** — drag maths, a door state machine, snapping,
reach — which is deliberate: the parts most likely to be subtly wrong are the
parts you can test without a browser.

Read these when changing behaviour. Skip them to use the format.

<!-- toc -->
- [Editor pointers](/pointer/)
- [The flat pointer](/flat-pointer/)
- [The XR pointer](/xr-pointer/)
- [Manipulator geometry](/handles/)
- [Manipulator handles](/handles-view/)
- [Selecting a piece](/selection/)
- [The selection marker](/selection-view/)
- [Beacons — a collision cube for anything abstract that has a position](/beacon-view/)
- [Schema-driven panels](/schema-panel/)
- [Writing a transform](/transform-write/)
- [Placing a piece's body](/place-mesh/)
- [Mounting libraries](/libraries/)
- [World behaviour rules](/world-logic/)
<!-- /toc -->
