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

**Sim speed is the scene's, not ours.** Since tosijs-3d 0.11.5 (#128)
`<tosi-b3d>`'s `timeScale` slows Babylon's animation groups itself
(`scene.animationTimeScale`), so a group's `speedRatio` is the transport's
speed alone. Up to 0.11.4 this multiplied in `timeScale` by hand; kept with
0.11.5 that would slow a rig twice. Pause needs nothing: a paused scene
disables animations.
