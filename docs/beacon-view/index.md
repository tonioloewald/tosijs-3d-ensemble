# Beacons — a collision cube for anything abstract that has a position

A lamp is a LIGHT. It has a position, it can be moved, it appears in the piece
list — and there is nothing in the scene to click, because a Babylon light has
no geometry. Selecting the lantern meant finding it in the list every time, and
the report was blunt: "I can't move the lantern (or select it by clicking on
it)."

Two different faults produced that one sentence, and only one of them is here.
The other was that `lamp` never claimed its light as the piece's BODY, so the
editor wrote a new position into the file with nothing in the scene to write it
to — see `body` in `features-scene.ts`.

## Only where a feature says so

A beacon is not given to every bodiless piece. Most environment primitives have
no location for one to mark: a skybox is everywhere, `fog` and `ambient` are
settings, and `sun`'s `at` is a DIRECTION — a dot floating at `[-0.5, 1, 0.4]`
would be a confident lie about where the sun is. Three junk dots near the origin
is what the blanket rule produces.

So the feature declares it, next to its icon and its schema: `marker: true`
means "this puts a real thing at `at`, and it cannot be seen". A consumer's
feature gets a beacon the same way it gets an icon, which is the property that
makes the registry worth having.

A CUBE, not a sphere: it is a stand-in for a thing rather than a thing. Owner:
*"really we should provide a simple collision cube for any abstract thing that
has a position that we might need to select"* — and the generality is the
point. Lamps are the case that surfaced it; positional sound, a placed camera,
and later reference points and zones are the same shape of problem.

## Invisible, and that is not a contradiction

The first version drew an amber cube. It works, and it is clutter: a solid the
author cannot move, delete or edit, sitting in a view whose whole purpose is
judging an arrangement. A COLLISION cube is what was asked for, and collision
geometry is not seen.

⚠️ **This is only pickable because we pass our own predicate.** Babylon's
default picking test is `isEnabled() && isVisible && isPickable`, so an
invisible mesh is normally unpickable — but `pickPiece` supplies a predicate,
and Babylon consults the predicate INSTEAD of that test rather than as well as
it. An invisible collision proxy therefore works here and would silently stop
working for any caller that picks without a predicate. Verified by ray rather
than reasoned about, because "it should still be pickable" is exactly the kind
of claim this project has been wrong about before.

Finding it without seeing it is not the problem it sounds like: a lamp is
already visible as the light it casts, and it is a row in the piece list. What
it needed was somewhere for a ray to land.
