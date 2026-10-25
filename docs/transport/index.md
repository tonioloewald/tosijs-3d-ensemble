# Animation transport

The editor's play / pause / speed / scrub for the animation groups its
pieces carry (board #3355). A view setting: it never touches the document.

Library animation groups arrive **stopped** — tosijs-3d clones a model's
groups onto each instance (`instance.metadata.animationGroups`) and starts
none of them. An editor that leaves them stopped shows a frozen rig and hides
the moving parts it exists to judge (Manta's pump and radar), so the
transport starts them, and pause and scrub are how you check a pose.

A group flagged `__wreckStopped` (a destroyed piece's clip) is left alone: a
dead rig stays dead.

**Sim speed scales the transport.** `<tosi-b3d>`'s `timeScale` slows
everything stepping by the scene's sim delta, but Babylon's animation groups
run on their own clock, so slow motion left a rig at full speed
(tosijs-3d#128). Each group's `speedRatio` is the transport's speed times the
scene's `timeScale`, read on every sync, so the scene's own Slow motion
button slows a rig too. Pause needs nothing: a paused scene disables
animations.
