# Upstream — what we're waiting on

<!--{"pin":"bottom","parent":"Project","order":3}-->

**An index, not a record.** The issues on the owning repo are the record: the
context, the workaround and the suggestion live there, self-contained for
someone who has never seen this repo. Keeping a second copy here would drift —
the issue gets refined in discussion while the local copy quietly ages into a
description of a problem that has moved (`practices/cross-project.md`).

So each row is a link and one line. Mark `✅ RESOLVED (fixed in pkg@version)`
when it lands, and close the issue.

## tosijs-3d

| | Finding | Issue |
|---|---|---|
| 1 | No way to touch a mesh. **Accepted and BUILT on main** as `<tosi-b3d-interactive>`, shipping in 0.7.3 — adopt it and port our world rules onto it | [#36](https://github.com/tonioloewald/tosijs-3d/issues/36) |
| 2 | The SVG UI needs a form layer. **Accepted**, queued behind #36 and #38. Extended with what 561 models taught us: hierarchical + filterable select, provider-backed dynamic options, list virtualisation | [#37](https://github.com/tonioloewald/tosijs-3d/issues/37) |
| 3 | No manipulator, and `b3d-panel`'s coloured axes look exactly like one | [#38](https://github.com/tonioloewald/tosijs-3d/issues/38) |
| 4 | ✅ **RESOLVED** (tosijs-3d@0.7.2) — `destroyable="off"` landed, credited to this project | [#39](https://github.com/tonioloewald/tosijs-3d/issues/39) |
| 5 | `b3d-turret`/`b3d-launcher` take no `library`, so a turret cannot have its own mesh | [#34](https://github.com/tonioloewald/tosijs-3d/issues/34) |
| 6 | `b3d-spawner` is player-relative — no way to spawn at an authored place | [#40](https://github.com/tonioloewald/tosijs-3d/issues/40) |
| 7 | A scene-owned clock: effect timing can be scaled, craft motion cannot | [#41](https://github.com/tonioloewald/tosijs-3d/issues/41) |
| 9 | `b3d-library` ignores a glb's own catalogue: `getNames()` over-reports sub-parts (80 vs 72 declared), and per-item `extras` — category, tags, **clips** — are unreachable | [#45](https://github.com/tonioloewald/tosijs-3d/issues/45) |
| 10 | `b3dWater` defaults `normalMap` to `/waterbump.png` but the package does not ship it — the sea renders as Babylon's fallback CHECKERBOARD, which reads as a style, not a fault | [#46](https://github.com/tonioloewald/tosijs-3d/issues/46) |
| 11 | `b3d-destroyable` cannot scale a library-backed piece at all — `size` is the placeholder cube's edge and is ignored once `library` is set. Measured: width identical at scale 1, 2 and 4 | [#47](https://github.com/tonioloewald/tosijs-3d/issues/47) |
| 12 | `b3d-destroyable` drops `rx`/`ry`/`rz` — `instantiate` is called with position only, so a library-backed piece cannot be rotated at all. Measured: authored `rot: [0,45,0]` left the footprint identical | [#48](https://github.com/tonioloewald/tosijs-3d/issues/48) |
| 13 | `b3d-destroyable` removed before its `lib.ready.then` instantiate resolves ORPHANS the node — nothing disposes it, ever. Measured: 4 rapid edits left 4 copies and 210 meshes where there were 81, and it never recovered | [#49](https://github.com/tonioloewald/tosijs-3d/issues/49) |
| 14 | `slider3d` has no `step` and there is no numeric field you can type into — setting a grid snap to a useful value is guesswork. Asks for both, plus a log2 mode for scale | [#50](https://github.com/tonioloewald/tosijs-3d/issues/50) |
| 8 | ✅ **RESOLVED in part** (tosijs-3d@0.7.2) — `exports` is a map now, but it names `./demo-utils` explicitly rather than a `./*` pattern, so an arbitrary subpath is still unreachable. Closed upstream; we are not reopening, because the case that motivated it (a published, importable subpath) works | [#42](https://github.com/tonioloewald/tosijs-3d/issues/42) |

### Stopgaps we own, and what retires them

Each of these is local complexity we carry **because** of a row above. When the
issue lands, the workaround goes — a stopgap that outlives its reason is a fork
nobody declared. One has already been collected: see the struck-through row.

| Ours | Retired by |
|---|---|
| ~~`destroyable` registers `body: true`~~ — **gone in 0.7.2.** Placement is uniform and destruction decorates a body it no longer has to create | ✅ #39 |
| `launchpad` is registered `editorOnly` — authorable, and honestly marked as something the runtime will not build | #40 |
| `numberField` + DOM key routing into `inputField`, and our own active-field tracking | #37 |
| `handles-view.ts`, and the drag maths in `handles.ts` | #38 |
| `ctx.simTime()` defaulting to wall-clock | #41 |
| `presets/world`'s own `interactive` (reach, activation, refusal) | 🔜 #36 in 0.7.3 |
| The family-cycler + separate list standing in for a hierarchical palette | #37 |
| Deriving palette categories from NAME PREFIXES, when the library now declares real ones | #45 |
| Our own copy of `waterbump.png` in `static/` (see `static/ASSETS.md`) | tosijs-3d #46 |
| `runtime/node-transform.ts` — writing rotation AND scale past the element onto the instance root, plus `whenMeshed`'s retry, because the instance does not exist when the element is appended | tosijs-3d #47, #48 |
| `place-mesh.ts`'s `reapOrphan` — watching for an instance that arrives after its element was removed, and disposing it | tosijs-3d #49 |
| Snap settings spelled as `enum`s so they render as cyclers — the right VALUES through the wrong control | tosijs-3d #50 |
| `editor.md`'s `calc(100dvh - 4rem)`, a hand-tuned navbar offset | tosijs-ui #115 |
| Nulling the camera input's private `_pointA`/`_pointB` on re-attach | Babylon (third-party; no upstream row) |

## haltija

| | Finding | Issue |
|---|---|---|
| D | An agent driving a BACKGROUND tab cannot verify rendered output — `rAF` is throttled, a self-pausing scene stops, and hand-driving the frame loop changed the semantics enough to produce two false diagnoses in one session. Asks for a leased, reusable foreground instance | [#41](https://github.com/tonioloewald/haltija/issues/41) |

## tosijs-ui

| | Finding | Issue |
|---|---|---|
| A | Dev-server auth sessions live in `new Map()`, so every restart invalidates every issued edit link while the 30-day cookie stays valid — it presents as Safari eating cookies | [#114](https://github.com/tonioloewald/tosijs-ui/issues/114) |
| B | A full-screen page that is ONE element: markdown wraps it in a `<p>` and nothing in the chain has a definite height, so `height: 100%` collapses. Suggested fix is raw `.html` doc pages | [#115](https://github.com/tonioloewald/tosijs-ui/issues/115) |
| C | The dev server answers a missing asset with the SPA shell — HTML at 200 — so a 404 presents as a silently wrong render | [#116](https://github.com/tonioloewald/tosijs-ui/issues/116) |
| D | `describeHolder()` with no holder returns a rendered "pid undefined" warning rather than saying there is none — the reader added by #118 tells a caller the opposite of the truth | [#123](https://github.com/tonioloewald/tosijs-ui/issues/123) |

### Not filed, deliberately

**`prefab` means three things.** tosijs-3d exports `prefab` for a registered
`(ctx) => Element[]` factory (wrecks, debris, spawns); Unity means a serialized
scene object with code; Manta's `prefab.ts` meant our format's ancestor. Not a
request — nobody should rename anything over it — but a reader coming from Unity
meets a second meaning in the same dependency graph, and it is worth knowing
that is why this project's word is **ensemble**.
