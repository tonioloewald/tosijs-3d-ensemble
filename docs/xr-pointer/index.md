# The XR pointer

A WebXR controller adapted to [[Editor pointers]]. Like the flat pointer this is
an **adapter**: it knows about controllers so that no tool has to.

Written now, not later, and not stubbed. A stub would compile and let a tool
quietly assume a mouse — which is exactly the "we'll add VR after" failure this
project decided to avoid. It is **wired but unverified in a headset**; say so
rather than implying otherwise.

## Where each part comes from

| | |
|---|---|
| ray | the controller's `pointer` node — its aim, not its grip |
| grip | the controller's `grip` node, which is where the HAND is |
| trigger | `xr-standard-trigger` on the motion controller |
| squeeze | `xr-standard-squeeze` — the modifier |

The ray comes from `pointer` and the near-grab position from `grip` because they
are genuinely different poses: aim runs from the knuckles forward, while the
hand is a few centimetres back and lower. Using one for both is why some apps
feel like you are grabbing with a stick.
