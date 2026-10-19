# The ensemble format

An **ensemble** is a reusable, JSON-described arrangement of library meshes with
declared capabilities and relationships — a rig, a dome facility, a fortress of
shields, platforms, turrets and generators.

Plain JSON. **No functions, no code, no engine types.** Everything here has to
survive a round trip through a file, a fetch, a text editor and a generator,
because the format is authored three ways: by hand, by the editor, and by a
mission compiler.

```jsonc
{
  "name": "ocean-rig",
  "kind": "rig",                    // free-form; consumers group by it
  "scale": 2.5,                     // multiplies every offset and piece scale
  "values": { "targetValue": 3, "faction": "hostile" },   // open map; the format has no opinion
  "pieces": [
    {
      "id": "pump",                 // MANDATORY and stable — see below
      "mesh": "Pump Station",       // PUBLIC library name
      "at": [0, 0, 0],              // ensemble-local metres
      "rot": [0, 0, 0],             // euler DEGREES
      "role": "power",
      "features": { "turret": { "range": 260 } }
    }
  ],
  "links": [{ "from": "pump", "to": "projector", "kind": "power", "values": { "delay": 0.4 } }]
}
```

## Four rules that are cheap now and painful later

- **`id` is mandatory**, never derived from array position. A derived id
  renumbers the world on every insertion, so a link authored yesterday points
  somewhere else today.
- **`rot` is euler DEGREES**, matching tosijs-3d's `rx`/`ry`/`rz`. Babylon is
  radians; a bare number is valid in either unit, so the wrong one gives you a
  different orientation rather than an error.
- **`mesh` is the PUBLIC library name.** `getNames()` strips `.model`,
  behaviour suffixes and the glTF loader's `_primitiveN`, so
  `building_collideCylinder_primitive0` is `building`. Never store what the
  loader happened to call a node.
- **`match` is a regex SOURCE STRING**, compiled at load. A `RegExp` does not
  survive `JSON.stringify`, and the format stops being a format.

Positions are **ensemble-local**, so the same ensemble works at sea level or on
a plateau.
