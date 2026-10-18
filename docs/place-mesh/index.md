# Placing a piece's body

The instantiator gives a piece its body; features then decorate it. This is the
only module that knows how a mesh reaches a tosijs-3d scene, which is why
`buildEnsemble` takes it as an option — a test swaps it for a stub.

## `destroyable` is a DECORATOR, and now it really is one

Most of what an ensemble describes — a lamp post, a rock, a ground plane, a
whole standard demo scene — can never be shot, and giving it hit points is not a
harmless default: terrain that quietly accumulates damage and vanishes at
100 000 is a worse outcome than terrain that was never a combatant.

For a while that forced an awkward shape. `b3d-destroyable` is the only element
that instantiates a library mesh BY NAME, and it had no way out of the combat
system, so either everything was a combatant or destruction had to CREATE the
body rather than decorate one. We placed plain pieces as raw library nodes to
dodge it, and `destroyable` had to register `body: true`.

**tosijs-3d 0.7.2 added `destroyable="off"`** (tosijs-3d#39, our ask), so that is
over. Every mesh piece is placed the same way and `destroyable` is a genuine
decorator: it contributes hit points to a body that already exists rather than
being the reason the body exists.

## Rotation and scale: the element's, since tosijs-3d 0.8.1

For years they were not. `b3d-destroyable` forwarded only position to
`library.instantiate`, and `size` is the placeholder cube's edge, so an
authored `rot: [0, 45, 0]` left the footprint at 3.63 × 3.63 and `scale` 1, 2
and 4 all rendered 5.273 wide. We wrote both onto the instance's node, after
polling for it to exist. tosijs-3d#47 and #48 fixed that upstream: the element
forwards `rx`/`ry`/`rz`, has a uniform `scale`, and re-renders once its node
exists. So the rotation is simply the element's attributes, and the scale goes
through `scaleElement` (`node-transform.ts`), which writes the element's
`scale` and per-axis `stretch` (tosijs-3d 0.10.12).
No poll is left: the element's own post-load render applies both.

## Nothing to instantiate from? Draw a box.

Without a library — or with a mesh name the library does not have — the piece
becomes a `b3d-box` at the same spot. The ARRANGEMENT is most of what an author
is judging, so cubes in the right places beat an empty scene.
