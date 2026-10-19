# Writing a transform

An ensemble's pieces have **two kinds of body** and they are written to
differently. Getting this wrong does not error — it silently does nothing, which
is the worst failure mode a manipulator can have.

| body | write to | why |
|---|---|---|
| an ELEMENT (`b3d-destroyable`) | `el.x/y/z`, `el.rx/ry/rz`, `el.scale` | the element OWNS its transform: `render()` writes the node from those attributes, so a write straight to the node is undone the next time anything re-renders |
| a NODE (a plain library instance) | `node.position` / `rotation` / `scaling` | nothing manages it, so the node IS the truth |

## Scale: the element's, unless it is a stretch

`b3d-destroyable`'s `size` is the *placeholder cube edge length*, ignored once
`library` is set (measured: 5.273 wide at `scale` 1, 2 and 4). tosijs-3d 0.8.1
(#47) added a UNIFORM `scale`, and 0.10.12 (#105) a per-axis `stretch`, times
`scale`, which it keeps through renders. `scaleElement` writes those two. (A
per-axis scale written to the node had been reset by the next move or turn,
`[2, 1, 3]` → `[1, 1, 1]` measured, which is why the attribute exists.)

`rx`/`ry`/`rz` are **degrees** on an element (`yaw`/`pitch`/`roll` are aliases
for `ry`/`rx`/`rz`), matching the format. Babylon nodes are **radians**, so the
node path converts.

## The quaternion trap, on our side of the fence

A `TransformNode` **ignores `.rotation` while it has a `rotationQuaternion`** —
and the glTF loader always sets one. That is exactly the bug that made
`library.instantiate()`'s rotation silently inert until tosijs-3d 0.7.0: it
wrote `.rotation`, the quaternion won, and every value produced the model's
baked orientation. `position` worked, which is what made it look wired up.

So rotating a plain node here **clears the quaternion first**. Skip that and a
rotation drag moves nothing, with no error anywhere.
