# Landforms

A **landform** is a shaped place on a terrain: a volcano, an impact crater, a
flat construction pad, a gulley, a raised cover for a tunnel. Each is a piece,
placed like a lamp is, and it shapes the ground under it. A volcano also
carries its own **province** (the glow of its caldera and flanks) and its own
**vent**: an `effect` the terrain places on the crater, as busy as the
volcano's `activity` says. Move the volcano and the cone, the glow and the
smoke move together.

```json
{
  "id": "fuji",
  "at": [400, 0, -900],
  "features": { "volcano": { "radius": 420, "height": 260, "activity": 0.5 } }
}
```

The piece's `x` and `z` are the landform's centre; its height is not used
(a landform is a change to the ground, which has its own height). The rest is
tosijs-3d's own schema for the factory (`landformSchemas`, tosijs-3d#119,
ours). A field such as a volcano's `craterRadius` that upstream works out from
another (`radius × 0.22`) is left out of the document until an author sets
it, so it keeps following its source; the panel shows the number it works out
to.

A landform applies to every terrain in the ensemble, or only to the one whose
piece id its `terrain` names. The terrain composes all of them (in document
order, each seeing the ground the previous one left), merges their provinces
by max, gathers their vents, and regenerates.
