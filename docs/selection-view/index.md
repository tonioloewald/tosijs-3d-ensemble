# The selection marker

A box around the selected piece, shown whenever something is selected —
**including when no transform is enabled**, which is the whole reason it
exists.

## Why an outline was not enough

There is a `HighlightLayer` too, and for a long time there was only that. It had
never worked: both kinds of body hand you a `TransformNode` at the top, the
layer takes meshes, and the call that fed it one was wrapped in a `catch`. So
"the piece you are about to move" was communicated by a property panel and
nothing else, twice reported and once wrongly believed fixed.

Even working, a glow is the wrong signal here. It says *which mesh* and nothing
about *how big the thing is*, which in an arrangement editor is most of what you
want to know. A box answers that and recolours nothing.

There were three axis rods through the origin as well, and they are gone: with a
manipulator present they duplicated its shafts, and without one they were more
clutter than information.

## Quiet, but not invisible

The first version used `CreateLines` for the axes and a `wireframe` material for
the box. Both render — measured: four meshes, visible, enabled, in the active
list — and both are effectively **one pixel wide**, because WebGL has no line
width. On a phone that is nothing at all: "I don't see selection feedback so I
need to turn on transformation to get any selection feedback."

So the box is drawn by `enableEdgesRendering`, which emits its twelve edges as
camera-facing quads at a width in PIXELS. A `wireframe` material cannot do this
job twice over: its lines are one pixel wide at every distance, and it draws the
triangulation — a diagonal across every face, which is exactly the "triangles
splitting the faces" that made the box distracting. Edges skip them by design.

The mesh itself is fully transparent. It is still rendered, which is what gives
the edge renderer something to hang off; it simply contributes no pixels of its
own.

It marks the selection; it is not a control, and anything that LOOKS grabbable
but is not is worse than nothing.
