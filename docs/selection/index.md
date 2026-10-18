# Selecting a piece

Clicking a turret's barrel selects **the turret**, not the barrel. A library
model is a tree — a hull with a barrel with a muzzle, or a glTF import split
into `_primitive0`, `_primitive1` — so the mesh under the pointer is almost
never the thing an author means.

So picking walks **up** from whatever was hit until it reaches a node the
ensemble actually placed, and selects that piece. If the walk runs out of
parents without finding one, the pick was scenery: the ground, the sky, the
water. That is a miss, not a selection of something arbitrary.

## Why a map rather than a search

Every pick would otherwise compare the hit against every piece's body. The map
is built once per rebuild, keyed by the node objects themselves, so a pick is a
walk up a short parent chain with a hash lookup at each step — and it stays that
way with a thousand pieces.
