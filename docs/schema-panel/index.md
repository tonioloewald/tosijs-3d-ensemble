# Schema-driven panels

The editor must not know what `destroyable` *means* — only how to render an
editor for it from a description. Same for a tool's options. So there is **one**
renderer, JSON Schema in, SVG UI widgets out, and it serves both.

```typescript
const panel = schemaPanel({
  schema: turretSchema,
  values: piece.features.turret,
  handleChange: (key, value) => edit(`turret ${key}`, () => { ... }),
})
```

Two hand-rolled panels would drift apart inside a week — the tool panel would
grow a nicer number field, the property panel would grow a better label, and
neither would get the other. Building it once is also what makes a consumer's
feature a first-class citizen: it renders because it has a schema, not because
someone added a case for it.

## Disposing a panel

A bound row subscribes to its box, so a panel holds subscriptions until it
is let go: call `panel.dispose()` when you drop it. Folding a section is
handled inside (the panel rebuilds, releasing the rows it drops), and the
`dispose` of the panel you hold releases whichever panel is current.

## Widget mapping

| schema | widget |
|---|---|
| `number` with `minimum`/`maximum` | `slider3d` |
| `boolean` | `toggle3d` |
| `string` with `enum` | `select3d` |
| `string` | `inputField` (an SVG keyboard, so it works in a headset) |

`x-unit` joins the VALUE for a picker and the label otherwise, because a number
without its unit is how a
range of 260 metres gets typed into a field that wanted kilometres.

A slider ALSO carries it into the readout, along with the wavelength where the
schema says the number is a frequency (`x-wavelength`) — so `terrain.grossScale`
reads `0.015 1/m ≈66.7 m` rather than `0.015`. That one is tosijs-3d's own
annotation on its own most misleading field: a thing called a scale that gets
smaller as the hills get bigger.

⚠️ The readout only appears while a pointer is on the control
(`slider3d`'s default `showValue: 'peek'`), so it is invisible to a text scrape
at rest. `tests/schema-readout.pw.ts` hovers a real one.

Anything unrecognised renders as a **disabled label showing the value**, not
nothing: a field an author cannot see is a field they will assume is unset.
A property marked `readOnly: true` (JSON Schema's own keyword) renders the
same way, deliberately.

## Sections

A schema may group its properties: `x-sections: [{ title, icon?, keys }]`,
tosijs-3d's own spelling (0.8.9, tosijs-3d#98, ours) — so its sky, water and
cloud deck arrive sectioned, and a consumer's feature uses the same shape.
Each section gets a collapsible header and the host folds the rows with
tosijs-3d's `foldSections` (0.8.8, our #99). Properties in no section come
first and always show. The first section starts open, the rest folded; what
you open is remembered. The sky is the reason: 30 fields in one column before.
