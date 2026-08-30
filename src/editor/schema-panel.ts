/*#
# Schema-driven panels

The editor must not know what `destroyable` *means* — only how to render an
editor for it from a description. Same for a tool's options. So there is **one**
renderer, JSON Schema in, SVG UI widgets out, and it serves both.

```typescript
const panel = schemaPanel({
  schema: turretSchema,
  values: piece.features.turret,
  onChange: (key, value) => edit(`turret ${key}`, () => { ... }),
})
```

Two hand-rolled panels would drift apart inside a week — the tool panel would
grow a nicer number field, the property panel would grow a better label, and
neither would get the other. Building it once is also what makes a consumer's
feature a first-class citizen: it renders because it has a schema, not because
someone added a case for it.

## Widget mapping

| schema | widget |
|---|---|
| `number` with `minimum`/`maximum` | `slider3d` |
| `boolean` | `toggle3d` |
| `string` with `enum` | `select3d` |
| `string` | `inputField` (an SVG keyboard, so it works in a headset) |

`x-unit` is appended to the label, because a number without its unit is how a
range of 260 metres gets typed into a field that wanted kilometres.

Anything unrecognised renders as a **disabled label showing the value**, not
nothing: a field an author cannot see is a field they will assume is unset.
*/
/*{"parent":"Internals","order":7}*/
import { label3d, panel3d, select3d, slider3d, toggle3d, ui } from 'tosijs-3d'
import type { FeatureSchema } from '../format/registry'

interface PropertySpec {
  type?: string
  title?: string
  description?: string
  enum?: Array<string | number>
  minimum?: number
  maximum?: number
  default?: unknown
  'x-unit'?: string
  'x-widget'?: string
  /**
   * Show this property only while the other options match.
   *
   * `{'x-requires': {mode: 'turn'}}` hides a field unless `mode` is `turn`; an
   * ARRAY means one of, so `{mode: ['turn', 'move + turn']}` covers both.
   *
   * Without it a panel contradicts itself. The select tool showed "Move: on"
   * beside "Mode: select", so an author switched a control that could not act,
   * saw the camera orbit instead, and reasonably concluded transforms were
   * broken. A control that cannot act should not be on screen claiming to be
   * on — and an angle snap has nothing to say to a tool that is not turning
   * anything.
   */
  'x-requires'?: Record<string, unknown>
}

export interface SchemaPanelOptions {
  schema: FeatureSchema | undefined
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  /** Panel heading. Omitted for an embedded group. */
  title?: string
  width?: number
  height?: number
}

/**
 * A number you can READ and TYPE.
 *
 * Coordinates were sliders, and a slider is the wrong control for a position on
 * three counts: it is bounded, so you cannot place anything past its range; it
 * has no precision; and ours showed no value at all, so you could not even see
 * where a piece was. Direct manipulation belongs on the handles in the
 * viewport — the panel's job is exact numbers.
 *
 * Commits on Enter and on blur, not per keystroke: committing as you type means
 * `1`, `12`, `120` all land as edits while you are still typing `1200`.
 */
export function numberField(config: {
  label: string
  value: number
  onCommit: (value: number) => void
  onFocus?: (field: NumberField) => void
}): NumberField {
  const format = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/0+$/, ''))
  const field = ui.inputField({
    value: format(config.value),
    height: 30,
    onEnter: (text: string) => {
      const parsed = Number(text)
      // Reject gibberish by restoring the last good value rather than writing
      // NaN into the ensemble, which would render the piece nowhere.
      if (Number.isFinite(parsed)) config.onCommit(parsed)
      else field.setValue(format(config.value))
    },
    // The host needs to know WHICH field the keyboard belongs to; the widget
    // cannot know, because it does not listen to the keyboard itself.
    onFocus: () => config.onFocus?.(field),
  }) as NumberField
  field.label = config.label
  return field
}

export interface NumberField {
  label?: string
  value: string
  insert: (text: string) => void
  action: (a: unknown) => void
  setValue: (v: string) => void
  setActive: (active: boolean) => void
}

/** Widgets for one schema's properties, in declaration order. */
export function schemaWidgets(options: SchemaPanelOptions): unknown[] {
  const { schema, values, onChange } = options
  const properties = (schema?.properties ?? {}) as Record<string, PropertySpec>
  const widgets: unknown[] = []

  for (const [key, spec] of Object.entries(properties)) {
    const requires = spec['x-requires']
    const satisfied = (k: string, v: unknown) =>
      Array.isArray(v) ? v.includes(values[k]) : values[k] === v
    if (requires && !Object.entries(requires).every(([k, v]) => satisfied(k, v))) continue
    const unit = spec['x-unit'] ? ` (${spec['x-unit']})` : ''
    const label = `${spec.title ?? key}${unit}`
    const value = values[key] ?? spec.default

    if (spec.type === 'boolean') {
      widgets.push(
        toggle3d({
          label,
          value: value === true,
          onChange: (v: boolean) => onChange(key, v),
        })
      )
      continue
    }

    if (Array.isArray(spec.enum) && spec.enum.length) {
      widgets.push(
        select3d({
          label,
          value: (value as string | number) ?? spec.enum[0]!,
          options: spec.enum,
          onChange: (v: string | number) => onChange(key, v),
        })
      )
      continue
    }

    if (spec.type === 'number' || spec.type === 'integer') {
      // A slider needs bounds. Without them in the schema, derive a range around
      // the current value rather than refusing to render — an unbounded number
      // is common in hand-written schemas and the field still has to be editable.
      const min = spec.minimum ?? Math.min(0, Number(value) || 0)
      const max = spec.maximum ?? Math.max(1, (Number(value) || 0) * 4 || 1)
      widgets.push(
        slider3d({
          label,
          value: Number(value) || 0,
          min,
          max,
          step: spec.type === 'integer' ? 1 : undefined,
          onChange: (v: number) => onChange(key, v),
        })
      )
      continue
    }

    // Strings and anything unrecognised: show the value rather than hide the
    // field. Text entry wants the SVG keyboard and lands with the property
    // panel — until then an author can at least SEE what is set.
    widgets.push(label3d({ text: `${label}: ${value ?? '—'}`, muted: true }))
  }

  return widgets
}

/** A standalone panel for one schema. */
export function schemaPanel(options: SchemaPanelOptions): SVGSVGElement {
  const widgets = schemaWidgets(options)
  const heading = options.title ? [label3d({ text: options.title, bold: true })] : []
  return panel3d(
    {
      width: options.width ?? 260,
      height: options.height ?? Math.min(420, 48 + widgets.length * 34 + heading.length * 26),
      padding: 10,
      gap: 6,
    },
    ...(heading as never[]),
    ...(widgets as never[])
  )
}
