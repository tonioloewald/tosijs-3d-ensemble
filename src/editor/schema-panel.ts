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
  curve3d,
  curveProgram3d,
  lightEditor3d,
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
  /** Which domain a `curve` field is in: `profile`, `falloff` or `radial`. */
  "x-curve-kind"?: string;
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
  /**
   * Decimal places to store, overriding the default three.
   *
   * Read by the editor when the value lands in the document, not here — the
   * widget shows whatever the pointer is doing, and only what is KEPT needs
   * rounding. See `format/round.ts`.
   */
  "x-precision"?: number;
  /**
   * Slider scale — `"log"` or `"log2"` where a field spans decades.
   *
   * A linear track is the wrong instrument for a quantity whose useful values
   * cover orders of magnitude: terrain's `grossScale` ran 1..1,000,000 with its
   * default at 0.4% of the travel, so every value anybody wanted lived in the
   * first few pixels. Owner: "a lot of the slider ranges for the terrain are
   * pathological. A whole bunch of the values do all their useful work between
   * 0 and 1" — of the track, which is exactly what this fixes.
   *
   * ⚠️ Needs `minimum > 0`. `slider3d` falls back to linear for a range that
   * includes zero, silently — so a field whose zero MEANS something (`reach: 0`
   * is "auto", an amplitude of 0 is flat) gets a tightened linear range rather
   * than a log one that would quietly not apply. tosijs-3d#62 asks for a log
   * scale with a zero stop; until then this is the honest split.
   */
  "x-scale"?: "linear" | "log" | "log2";
}

export interface SchemaPanelOptions {
  schema: FeatureSchema | undefined;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  /**
   * A BOX for a property — a tosijs leaf with `.value` and `.observe()`.
   *
   * Hand one over and the widget binds to it: `boundValue` in widgets3d reads
   * and writes THROUGH the store and updates the widget in place when the value
   * changes elsewhere. Nothing here re-renders, because nothing needs to.
   *
   * This is the whole point, and it is what tosijs is for. The model is
   * observant, not reactive — a write queues an rAF update that touches the one
   * bound node that changed, it checks whether the value is actually new before
   * bothering anybody, and it is heavily tested. Measured: 50 writes to one path
   * produce 1 notification. Re-rendering a panel to show a number is doing that
   * work again, worse.
   *
   * Return `undefined` for a key with no stable address and the widget falls
   * back to a plain value plus `onChange`, which is what tool options do — they
   * are not part of the document, so they have no path to bind to.
   */
  box?: (key: string) => unknown;
  /**
   * A GESTURE finished — write it to the document, one undo step.
   *
   * Widgets with a drag report twice: `onChange` continuously so the scene can
   * follow the hand, and this once at the end. Without the split, one drag of a
   * curve point would be fifty entries in the history; without the live half,
   * the 3D preview would only catch up when you let go. Falls back to
   * `onChange` for widgets that have no gesture to end.
   */
  onCommit?: (key: string, value: unknown, describe?: string) => void;
  /** Panel heading. Omitted for an embedded group. */
  title?: string;
  width?: number;
  /** Upper bound before the panel scrolls. Height itself is the content's. */
  maxHeight?: number;
}

/** Widgets for one schema's properties, in declaration order. */
export function schemaWidgets(options: SchemaPanelOptions): unknown[] {
  const { schema, values, onChange, onCommit, box } = options;
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

    /*
      WIDGETS THAT OWN A COMPOSITE, handed the whole field.

      `light` is a lamp — power, colour, intensity and its four-curve program;
      `light-program` is that program alone; `curve` is one curve. They nest,
      and each is marked on the FIELD it edits rather than being assembled here
      from parts, which is what lets the widget hold invariants our document
      cannot express — a light program's attack and sustain splits are shared
      across all four channels, and six sibling fields could not keep them so.

      Commit-only to the document: these all report live as well, but a live
      write here would rebuild the scene on every pointer-move.
    */
    const commit = onCommit ?? ((k, v) => onChange(k, v));
    if (spec["x-widget"] === "light") {
      widgets.push(
        lightEditor3d({
          value: value as never,
          handleCommit: (settings, describe) => commit(key, settings, describe),
        })
      );
      continue;
    }
    if (spec["x-widget"] === "light-program") {
      widgets.push(
        curveProgram3d({
          value: value as never,
          handleCommit: (program: unknown, describe?: string) =>
            commit(key, program, describe),
        } as never)
      );
      continue;
    }
    if (spec["x-widget"] === "curve") {
      widgets.push(
        curve3d({
          value: value as never,
          // The domain travels in its own key, so a falloff and a height
          // profile can share one widget and still clamp differently.
          kind: spec["x-curve-kind"] as never,
          handleCommit: (points: unknown, describe?: string) =>
            commit(key, points, describe),
        } as never)
      );
      continue;
    }

    if (spec.type === "boolean") {
      widgets.push(
        toggle3d({
          label,
          /*
            The BOX if there is one, else the plain value. `boundValue` decides:
            anything with `.observe()` is driven through the store, anything else
            is held locally. So one call site serves a bound document field and
            an unbound tool option without either knowing about the other.
          */
          value: (box?.(key) as boolean | undefined) ?? value === true,
          onChange: (v: boolean) => onChange(key, v),
        })
      );
      continue;
    }

    if (Array.isArray(spec.enum) && spec.enum.length) {
      widgets.push(
        select3d({
          label,
          value:
            (box?.(key) as string | number | undefined) ??
            (value as string | number) ??
            spec.enum[0]!,
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
          value: (box?.(key) as number | undefined) ?? (Number(value) || 0),
          min,
          max,
          step: spec.type === "integer" ? 1 : undefined,
          ...(spec["x-scale"] && spec["x-scale"] !== "linear"
            ? { scale: spec["x-scale"] }
            : {}),
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
