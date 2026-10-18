# Tools and commands

The editor's palette is **whatever is registered**, not a hardcoded list —
deliberately the same shape as [[The feature registry]], so a consumer can add a
tool to the editor exactly the way it adds a feature to the format.

Two kinds of thing live in the palette, because two kinds of thing belong there:

- a **tool** is modal. Picking it changes what a gesture means, and it owns the
  options panel while it is current.
- a **command** runs once and returns you to what you were doing. Duplicate and
  delete are commands; making them modes would be a lie about how they behave.

```typescript
registerTool({
  name: 'paint',
  label: 'Paint',
  optionsSchema: {
    type: 'object',
    properties: {
      colour: { type: 'string', default: '#8a6a52' },
      radius: { type: 'number', default: 1, 'x-unit': 'm' },
    },
  },
  onGesture(gesture, ctx) { ... },
})
```

The options are **JSON Schema**, so the panel that edits them is generated, not
written — the same renderer the piece property panel uses. A tool with a
bespoke panel would drift from the rest of the editor within a week.
