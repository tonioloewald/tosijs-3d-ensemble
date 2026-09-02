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

`x-unit` joins the VALUE for a picker and the label otherwise, because a number
without its unit is how a
range of 260 metres gets typed into a field that wanted kilometres.

Anything unrecognised renders as a **disabled label showing the value**, not
nothing: a field an author cannot see is a field they will assume is unset.
*/
/*{"parent":"Internals","order":7}*/
import {
  iconGrid3d,
  label3d,
  panel3d,
  select3d,
  slider3d,
  toggle3d,
  ui,
} from "tosijs-3d";
import {
  DEFAULT_TOOL_CELLS,
  TOOL_CELLS,
  resolveToolCells,
} from "./tools/transform";
import type { FeatureSchema } from "../format/registry";

interface PropertySpec {
  type?: string;
  title?: string;
  description?: string;
  enum?: Array<string | number>;
  /**
   * Display names for particular enum VALUES, keyed by the value as a string.
   *
   * For the cases where the number is not the word: a snap of `0` means "Off",
   * and showing the digit invites the reader to wonder what zero-metre snapping
   * does. Only the values named here are relabelled; the rest render as
   * themselves, so a table stays readable as a table.
   */
  "x-labels"?: Record<string, string>;
  minimum?: number;
  maximum?: number;
  default?: unknown;
  "x-unit"?: string;
  "x-widget"?: string;
  /**
   * Show this property only while the other options match.
   *
   * `{'x-requires': {cell: 2}}` hides a field unless cell 2 is lit;
   * `{anyCell: [1, 2, 3]}` needs any of them. Plain keys still compare against
   * the option's value, and an ARRAY there means one of.
   *
   * Without it a panel contradicts itself. The select tool showed "Move: on"
   * beside "Mode: select", so an author switched a control that could not act,
   * saw the camera orbit instead, and reasonably concluded transforms were
   * broken. A control that cannot act should not be on screen claiming to be
   * on — and an angle snap has nothing to say to a tool that is not turning
   * anything.
   */
  "x-requires"?: Record<string, unknown>;
}

export interface SchemaPanelOptions {
  schema: FeatureSchema | undefined;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  /** Panel heading. Omitted for an embedded group. */
  title?: string;
  width?: number;
  /** Upper bound before the panel scrolls. Height itself is the content's. */
  maxHeight?: number;
}

/** Widgets for one schema's properties, in declaration order. */
export function schemaWidgets(options: SchemaPanelOptions): unknown[] {
  const { schema, values, onChange } = options;
  const properties = (schema?.properties ?? {}) as Record<string, PropertySpec>;
  const widgets: unknown[] = [];

  for (const [key, spec] of Object.entries(properties)) {
    const requires = spec["x-requires"];
    const lit = Array.isArray(values.cells) ? (values.cells as number[]) : [];
    const satisfied = (k: string, v: unknown) => {
      // `cell` / `anyCell` read the lit tool cells rather than a named option,
      // because the grid's value IS a set and "is this one on" is the question
      // every dependent field actually asks.
      if (k === "cell") return lit.includes(v as number);
      if (k === "anyCell") return (v as number[]).some((c) => lit.includes(c));
      return Array.isArray(v) ? v.includes(values[k]) : values[k] === v;
    };
    if (
      requires &&
      !Object.entries(requires).every(([k, v]) => satisfied(k, v))
    )
      continue;

    if (spec["x-widget"] === "tool-cells") {
      widgets.push(
        iconGrid3d({
          mode: "checkbox",
          items: TOOL_CELLS as unknown as Array<{
            icon: string;
            label?: string;
          }>,
          selected: (values[key] as number[]) ?? DEFAULT_TOOL_CELLS,
          columns: 4,
          // The rule lives in the tool, not here — the grid asks what SHOULD
          // happen and this hands back the answer, or `previous` to veto.
          handleChange: (change: { index: number; selection: number[] }) =>
            resolveToolCells(change),
          handleSelect: (selection: number[]) => onChange(key, selection),
        }) as never
      );
      continue;
    }
    /*
      THE UNIT BELONGS TO THE VALUE, NOT THE CAPTION.

      "Grid snap (m) … 1" makes the reader carry the unit across the row and
      reassemble it; "Grid snap … 1m" is the quantity as anyone would write it.
      So for a picker the unit goes on each option, and only a control that has
      no options keeps it in the label.
    */
    const rawUnit = spec["x-unit"] ?? "";
    const picker = Array.isArray(spec.enum) && spec.enum.length > 0;
    const unit = rawUnit && !picker ? ` (${rawUnit})` : "";
    const label = `${spec.title ?? key}${unit}`;
    const value = values[key] ?? spec.default;

    if (spec.type === "boolean") {
      widgets.push(
        toggle3d({
          label,
          value: value === true,
          onChange: (v: boolean) => onChange(key, v),
        })
      );
      continue;
    }

    if (Array.isArray(spec.enum) && spec.enum.length) {
      widgets.push(
        select3d({
          label,
          value: (value as string | number) ?? spec.enum[0]!,
          options: spec.enum.map((option) => {
            const named = spec["x-labels"]?.[String(option)];
            // A named value is a word, not a quantity — "Off" takes no unit.
            if (named !== undefined) return { label: named, value: option };
            return rawUnit
              ? { label: `${option}${rawUnit}`, value: option }
              : option;
          }),
          onChange: (v: string | number) => onChange(key, v),
        })
      );
      continue;
    }

    if (spec.type === "number" || spec.type === "integer") {
      // A slider needs bounds. Without them in the schema, derive a range around
      // the current value rather than refusing to render — an unbounded number
      // is common in hand-written schemas and the field still has to be editable.
      const min = spec.minimum ?? Math.min(0, Number(value) || 0);
      const max = spec.maximum ?? Math.max(1, (Number(value) || 0) * 4 || 1);
      widgets.push(
        slider3d({
          label,
          value: Number(value) || 0,
          min,
          max,
          step: spec.type === "integer" ? 1 : undefined,
          onChange: (v: number) => onChange(key, v),
        })
      );
      continue;
    }

    // Strings and anything unrecognised: show the value rather than hide the
    // field. Text entry wants the SVG keyboard and lands with the property
    // panel — until then an author can at least SEE what is set.
    widgets.push(label3d({ text: `${label}: ${value ?? "—"}`, muted: true }));
  }

  return widgets;
}

/** A standalone panel for one schema. */
export function schemaPanel(options: SchemaPanelOptions): SVGSVGElement {
  const widgets = schemaWidgets(options);
  const heading = options.title
    ? [label3d({ text: options.title, bold: true })]
    : [];
  return panel3d(
    {
      width: options.width ?? 260,
      // Sized by content (tosijs-3d 0.7.5's default) with a bound to scroll
      // past rather than a guess to clip against.
      maxHeight: options.maxHeight ?? 420,
      padding: 10,
      gap: 6,
    },
    ...(heading as never[]),
    ...(widgets as never[])
  );
}
