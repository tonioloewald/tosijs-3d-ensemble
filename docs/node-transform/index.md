# Writing a transform to a node

Rotation and scale, written onto the Babylon node itself, in the RUNTIME layer
because both the instantiator and the editor need them and the dependency may
only point one way: the editor may import the runtime, never the reverse.
Putting these in `transform-write.ts` — where they belong by subject — would
drag the whole editor into a game's bundle, which `tree-shaking.test.ts` exists
to prevent.

## Rotation is the element's; scale is the element's when it can be

For years a library-backed piece could be neither turned nor scaled through its
element: `b3d-destroyable` forwarded only position to `library.instantiate`,
and `size` is the placeholder cube's edge. We wrote both onto the node. tosijs-3d
0.8.1 fixed both (#47, #48), so:

- **rotation** is the element's `rx`/`ry`/`rz` (DEGREES), full stop. It
  forwards them, and re-renders once its node exists.
- **a uniform scale** is the element's `scale`.
- **a non-uniform scale** (the format's `Vec3`) is the element's `stretch`,
  per axis, times `scale` (tosijs-3d 0.10.12, #105). Before that we wrote it
  to the node, and the element reset the node on every render, so a stretch
  was wiped by the next move or turn, and one set at build time was lost when
  the instance arrived; a render wrapper re-applied it. Both are measured in
  `tests/library-transform.pw.ts` on rendered footprints (a built [2, 1, 3]
  is 18.108 wide), now with no wrapper.

A plain node (no element) has nothing managing it, so `applyScale` writes it
directly; the editor's node path rotates it directly too.
