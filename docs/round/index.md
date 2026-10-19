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

## A LOG-SCALED field is rounded to significant FIGURES, not decimals

⚠️ Decimal places are a linear idea, and they are wrong for a quantity whose
useful values span decades. Fog density runs `0 .. 1` with everything anyone
wants below `0.01`, so three decimals turns the author's `0.0015` into `0.002`
— a 33% change, applied on OPEN, before an edit. Terrain's `grossScale` runs
`0.005 .. 0.3` and sits one decimal from the same fate.

`x-scale: 'log' | 'log2'` already says "this quantity is multiplicative", so it
is also the answer to how to round it: three significant figures keeps `0.0015`
and `0.09` and `1200` all equally readable, which is exactly the property a log
scale claims about the field.

Found by the scene lane. Loading `standard-scene.json` put `0.002` in the
document where the file said `0.0015`, and the fog reaching the renderer was
the rounded value — so the file, the document and the picture disagreed and
nothing said so.
