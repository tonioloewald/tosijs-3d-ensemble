# The select-and-transform tool

**One tool.** Press a piece to select it, press empty space to deselect, and
drag a handle to move, turn or stretch what is selected. Selecting and
transforming were two tools until it became obvious they are one gesture with
two outcomes, decided by *what you grabbed* rather than by what you clicked in a
palette first.

Which transforms are offered is a **setting**, not a mode: `translate`, `rotate`
and `scale` are independent toggles, all **off** by default. Off is a pure
selection tool with no widget in the way; on, every enabled affordance is drawn
at once and the grip you take says what the drag means. See
[[handles-view|Manipulator handles]] for why that beats a mode switch, and what it costs.

| grip | drag |
|---|---|
| shaft | move along one axis |
| pad | move in a plane, the third axis untouched |
| ring | turn around one axis |
| cube | scale along one axis — **with the secondary button, the other two** |
| centre cube | scale uniformly |

The secondary-button inversion is the one non-obvious binding, and it is worth
it: "make this taller" and "make this thinner without making it shorter" are the
same reach, one modifier apart.

## The drag writes twice, to two different places

- **during** the drag, to the live body, so the piece follows the hand. Which
  body — element or node — is [[transform-write|Writing a transform]]'s fork, and the wrong
  branch fails silently rather than erroring.
- **on release**, to the ensemble JSON, snapped. The JSON is the truth; the
  scene is a view of it.

The release goes through `ctx.edit`, which **does** rebuild. That was not the
original plan — the idea was to skip the rebuild since the body already holds
the value — but measuring it settled the question the other way: the snap
happens on release, so the body would sit at 3.4 while the JSON said 3, and the
scene would disagree with the data by up to half a grid step after every drag.
Rebuilding costs a dispose-and-build per drag and buys exact agreement.

It is safe here because the rebuild happens AFTER the gesture ended. Rebuilding
*during* a drag would dispose the very node under the author's hand, which is
why copy-on-drag also defers to release.

## Duplicate-on-drag copies on RELEASE

Cloning at the start would mean rebuilding mid-gesture to bring the copy into
the scene, which disposes the node being dragged. Copying on release leaves the
original where it was and puts the copy at the dragged transform — the same
outcome, without pulling the floor out from under the drag.
