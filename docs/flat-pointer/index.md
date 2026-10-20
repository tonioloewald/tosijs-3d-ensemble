# The flat pointer

Mouse, trackpad, pen and touch, adapted to [[pointer|Editor pointers]]. **This file is an
ADAPTER** — it is allowed to know about DOM events precisely so that nothing
above it has to.

It has no `grip()`, because a flat pointer has no position in the world: there
is nothing to reach out and hold with. Everything it does is far interaction,
which is why the ray/near split had to exist before the first tool was written.
