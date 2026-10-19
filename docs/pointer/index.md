# Editor pointers

A tool is written **once** and driven by a mouse or by a hand. That is the whole
point of this file: nothing downstream of it may name a mouse, a click, a screen
coordinate or a DOM event.

VR is not the initial focus, but starting flat-only is the trap — a flat-only
contract bakes mouse assumptions into every tool, and each one has to be found
and removed later. So the contract is XR-shaped from the start and the flat
pointer is simply its first implementation.

## What a pointer is

```typescript
interface EditorPointer {
  ray(): EditorRay | null   // far interaction: point at a thing
  grip(): Vec3 | null       // near interaction: reach out and hold it
  active: boolean           // trigger / primary button
  secondary: boolean        // squeeze / secondary button
}
```

Two ways to grab, because both are real: a hand inside a handle grabs it
directly, and anything out of reach is grabbed by pointing. An ensemble is
routinely larger than arm's reach, so near-grab alone would mean flying the
world around to edit it; ray alone throws away the thing a headset is for.

## Hands are symmetric until they aren't

There is no fixed "right hand is the tool". Whichever pointer starts a gesture
is its PRIMARY, and whatever else is present becomes the helper **for that
gesture**. That is what makes two-handed actions expressible later — dragging an
object along a path with one hand while the other drops keyframes — without a
left/right special case in every tool.
