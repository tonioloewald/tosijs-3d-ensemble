/*#
# Rounding what lands in the document

A slider reports the position of a pointer, and a pointer lands wherever the
hand let it. Dragging `timeOfDay` wrote **20.651162790697676** into the file —
a number with seventeen significant figures describing a time of day to within
a nanosecond, produced by a finger.

Left alone the whole document fills with these. It is not a rendering problem —
nothing looks wrong — it is a DOCUMENT problem, and documents are the product
here: a file an author reads, a generator emits, a diff shows, and a person
hand-edits. `"timeOfDay": 20.651` is all of those; the other one is noise with a
decimal point in it.

## Where it goes, and why not in the slider

At the boundary where a value enters the ensemble — `update` and
`updateFeature` — not in the widget that raised it.

Both of those are reached by more than sliders (a typed field, a drag release, a
composite widget handing back a whole light), and a rule applied per widget is a
rule with holes in it. Position needed it too: `gridSnap: 0` is a legal setting,
and with snapping off a drag writes exactly what the ray hit.

## Three decimals, and one exception that matters

Three is a millimetre on a metre, which is finer than anything anyone is
arranging by hand, and it reads.

⚠️ **But a fixed decimal count silently destroys small quantities.** Terrain's
`biomeLapseRate` lives in `0 .. 0.05`, and `0.0004.toFixed(3)` is `"0.000"` — a
control that becomes a no-op at the bottom of its own range, which is this
project's most-repeated bug wearing yet another costume. So a non-zero value
never rounds TO zero: it falls back to three significant figures, which keeps
`0.0004` and still drops the noise.

`x-precision` on a property overrides the default where a field genuinely needs
more.
*/
/*{"parent":"Format","order":8}*/

/** Decimal places, unless a property says otherwise with `x-precision`. */
export const DEFAULT_PRECISION = 3;

/**
 * Round one number for storage.
 *
 * Returns non-finite values (`NaN`, `Infinity`) untouched rather than
 * normalising them — they are a bug somewhere upstream, and quietly turning
 * them into a number hides it.
 */
export function roundNumber(value: number, dp = DEFAULT_PRECISION): number {
  if (!Number.isFinite(value)) return value;
  const rounded = Number(value.toFixed(dp));
  // Never let a real quantity become nothing. See the note above.
  if (rounded === 0 && value !== 0) return Number(value.toPrecision(3));
  return rounded;
}

/**
 * Round every number inside a value, however deeply nested.
 *
 * Deep because a composite widget hands back a whole object — a light's
 * settings carry an intensity, a hue and a four-curve program, and every one of
 * those is a number a drag produced.
 *
 * Arrays and plain objects are rebuilt; anything else (a string, a boolean,
 * null, a class instance) is returned as it came. Rebuilding rather than
 * mutating because the caller's value may be shared with the widget that is
 * still holding it.
 */
export function roundDeep<T>(value: T, dp = DEFAULT_PRECISION): T {
  if (typeof value === "number") return roundNumber(value, dp) as T;
  if (Array.isArray(value)) {
    return value.map((item) => roundDeep(item, dp)) as T;
  }
  /*
    PLAIN OBJECTS ONLY. A `Date`, a `RegExp` or a class instance would be
    flattened into a bare object by a blind walk, and the format's rule is that
    a regex lives as a source STRING precisely so nothing has to guess here.
  */
  if (value && typeof value === "object" && isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = roundDeep(item, dp);
    }
    return out as T;
  }
  return value;
}

function isPlainObject(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
