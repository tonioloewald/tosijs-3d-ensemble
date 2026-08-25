# Upstream — what we're waiting on

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
| 1 | No way to touch a mesh — doors, knobs, switches and locks have no substrate. Our `presets/world` is offered for promotion | [#36](https://github.com/tonioloewald/tosijs-3d/issues/36) |
| 2 | The SVG UI needs a form layer: number fields, a real popup select, rows, panel measurement | [#37](https://github.com/tonioloewald/tosijs-3d/issues/37) |
| 3 | No manipulator, and `b3d-panel`'s coloured axes look exactly like one | [#38](https://github.com/tonioloewald/tosijs-3d/issues/38) |
| 4 | Placing a library mesh always enrols it in combat — no `destroyable="off"` | [#39](https://github.com/tonioloewald/tosijs-3d/issues/39) |
| 5 | `b3d-turret`/`b3d-launcher` take no `library`, so a turret cannot have its own mesh | [#34](https://github.com/tonioloewald/tosijs-3d/issues/34) |
| 6 | `b3d-spawner` is player-relative — no way to spawn at an authored place | [#40](https://github.com/tonioloewald/tosijs-3d/issues/40) |
| 7 | A scene-owned clock: effect timing can be scaled, craft motion cannot | [#41](https://github.com/tonioloewald/tosijs-3d/issues/41) |
| 8 | `exports` is the string form, so no subpath is reachable | [#42](https://github.com/tonioloewald/tosijs-3d/issues/42) |

### Stopgaps we own, and what retires them

Each of these is local complexity we carry **because** of a row above. When the
issue lands, the workaround goes — a stopgap that outlives its reason is a fork
nobody declared.

| Ours | Retired by |
|---|---|
| `destroyable` registers `body: true`, because `b3d-destroyable` creates the mesh it owns rather than decorating one | #39 |
| `launchpad` is registered `editorOnly` — authorable, and honestly marked as something the runtime will not build | #40 |
| `numberField` + DOM key routing into `inputField`, and our own active-field tracking | #37 |
| `handles-view.ts`, and the drag maths in `handles.ts` | #38 |
| `ctx.simTime()` defaulting to wall-clock | #41 |

### Not filed, deliberately

**`prefab` means three things.** tosijs-3d exports `prefab` for a registered
`(ctx) => Element[]` factory (wrecks, debris, spawns); Unity means a serialized
scene object with code; Manta's `prefab.ts` meant our format's ancestor. Not a
request — nobody should rename anything over it — but a reader coming from Unity
meets a second meaning in the same dependency graph, and it is worth knowing
that is why this project's word is **ensemble**.
