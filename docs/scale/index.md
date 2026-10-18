# Scale, uniform or per axis

A piece's `scale` is `number | [x, y, z]`. Both spellings are canonical: a
number is what a file says when the scale IS uniform, not sugar for a triple.
These are the two functions that let everything else stop caring which it got.

## Why per-axis at all

Because the manipulator offers per-axis scale grips, and a control that quietly
collapses to uniform is the [[The built-in tools]] version of a slider that does
nothing. Once the widget can stretch one axis, the format has to be able to hold
the result or the drag is a lie that survives until you reload.

## The uniform reading is the LARGEST component

`FeatureContext.scale` is a single number, and features use it to size things —
a blast radius, a detection range. Given `[3, 1, 1]` the honest scalar is the
one that ENCLOSES the piece, so `3`. The mean would put the radius inside the
geometry it is meant to cover, and the minimum is worse. Say which you mean at
the call site if it matters; most callers want the enclosing extent.
