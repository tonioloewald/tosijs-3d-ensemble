/*#
# &lt;tosi-ensemble-editor&gt;

The editor is a **component**, not an application. Drop it on a page, give it a
library and an ensemble, and it edits — the doc site's `/editor.html` is one
such page and has no privileged access to anything.

```html
<tosi-ensemble-editor
  library-url="https://cdn.tosijs.net/enemies.glb"
  library="enemies"
  src="/ensembles/ocean-rig.json"
  backdrop="aquatic"
></tosi-ensemble-editor>
```

```typescript
import { ensembleEditor, registerSceneFeatures } from 'tosijs-3d-ensemble'

registerSceneFeatures()
document.body.append(
  ensembleEditor({
    library: 'enemies',
    libraryUrl: '/enemies.glb',
    backdrop: 'aquatic',
    handleSave: async (data) => localStorage.setItem('draft', JSON.stringify(data)),
  })
)
```

## The chrome is tosijs-3d's SVG UI, not DOM widgets

One implementation renders as a DOM overlay **and** as an in-scene texture, so
the same editor runs in a browser and in a headset. Editing a 3D arrangement is
a spatial task performed at arm's length: judging whether a fortress reads,
whether a turret covers the approach, whether a gap is flyable are exactly the
questions a flat viewport answers badly.

## The backdrop is not part of the ensemble

`backdrop` mounts a sample world — ground or sea, sky, and the ambient
conditions — for the ensemble to be judged **against**. It is authoring
context: it is never saved, and dragging the ensemble over it is the point.
An ensemble that carries its OWN landform does so as a piece with a `terrain`
feature, which is a different thing and does get saved.

Both planes are pinned to the origin. A bench looks at one thing from many
angles, so the world holds still and the camera moves.

## What is not here yet

No manipulator. tosijs-3d has no gizmo — `b3d-panel`'s coloured axes are a
debug READOUT that looks exactly like one — so pieces are currently placed by
editing numbers. That is the editor's single most important interaction and it
is an upstream build; see UPSTREAM.md.
*/
import { Component } from 'tosijs'
import {
  b3d,
  b3dGround,
  b3dLibrary,
  b3dLight,
  b3dSkybox,
  b3dWater,
  label3d,
  list3d,
  panel3d,
  slider3d,
} from 'tosijs-3d'
import { buildEnsemble } from '../runtime/build'
import { placeMesh } from '../runtime/place-mesh'
import { registerSceneFeatures } from '../runtime/features-scene'
import { validate } from '../format/validate'
import type { BuiltEnsemble } from '../runtime/build'
import type { Ensemble, Piece } from '../format/types'
import type { SceneElement } from '../format/registry'

/** A sample world to author against. Never saved with the ensemble. */
export type Backdrop = 'none' | 'land' | 'aquatic'

const EMPTY: Ensemble = { name: 'untitled', pieces: [] }

/** Backdrop grid: 4 cells per tile, with a heavier line on the tile boundary. */
const GRID_TEXTURE = '/grid-4.svg'

export class EnsembleEditor extends Component {
  static override preferredTagName = 'tosi-ensemble-editor'

  static override initAttributes = {
    /**
     * Library `type` to instantiate meshes from. Empty means "no library":
     * pieces render as placeholder cubes, which is the useful failure — the
     * arrangement is most of what an author is judging.
     */
    library: '',
    /** URL of a `.glb` library to load. Optional if the page loads its own. */
    libraryUrl: '',
    /** Ensemble JSON to load on connect. */
    src: '',
    /** Sample world to author against — authoring context, never saved. */
    backdrop: 'land' as Backdrop,
    /**
     * Hide the piece list and property panel.
     *
     * Inverted on purpose: an HTML boolean attribute is false-by-default
     * (presence = true), so a `chrome: true` default cannot reflect and tosijs
     * refuses it outright rather than letting it silently become false.
     */
    hideChrome: false,
  }

  declare library: string
  declare libraryUrl: string
  declare src: string
  declare backdrop: Backdrop
  declare hideChrome: boolean

  /** The ensemble being edited. Assign to load one from memory. */
  get ensemble(): Ensemble {
    return this._ensemble
  }
  set ensemble(value: Ensemble) {
    this._ensemble = value
    this._selected = value.pieces[0]?.id ?? null
    this.rebuild()
  }
  private _ensemble: Ensemble = EMPTY

  /**
   * Host owns persistence — the component calls this, it picks no backend.
   *
   * Named `handleSave`, not `onSave`: the elements factory treats `on<Event>`
   * property names as event-handler sugar, so `ensembleEditor({ onSave })`
   * would attach a "save" LISTENER instead of assigning the property, and the
   * component could never read it.
   */
  handleSave: ((ensemble: Ensemble) => void | Promise<void>) | null = null

  private _built: BuiltEnsemble | null = null
  private _selected: string | null = null
  private _scene: SceneElement | null = null
  private _panels: SVGSVGElement[] = []

  // No declarative content: the scene and the chrome are built imperatively in
  // `connectedCallback`, into whichever root this component actually got.
  override content = null

  static override shadowStyleSpec = {
    ':host': {
      display: 'block',
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    'tosi-b3d': { display: 'block', width: '100%', height: '100%' },
    'svg.ensemble-editor-chrome': {
      position: 'absolute',
      left: '8px',
      pointerEvents: 'auto',
    },
  }

  /*
    The component is given a SHADOW ROOT, so `this.querySelector` sees nothing
    and anything appended to `this` never renders. An earlier version mounted
    the scene by looking up a `content` div that way: no error, no scene, a
    white page — the exact silent-failure shape this project's notes warn about.
    Resolve the root once and hold it.
  */
  private get _root(): ParentNode & { append: (...nodes: Node[]) => void } {
    return (this.shadowRoot ?? this) as ParentNode & { append: (...nodes: Node[]) => void }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    // Scene primitives only. The editor does not assume a domain — a host that
    // wants hit points registers the combat preset itself.
    registerSceneFeatures()
    this._mountScene()
    // Draw the chrome even with nothing loaded. `rebuild` is otherwise the only
    // caller, so an empty editor came up with no panel at all — which reads as
    // a broken tool rather than an empty one.
    this.rebuild()
    if (this.src) void this.load(this.src)
  }

  override disconnectedCallback(): void {
    // The editor rebuilds constantly; leaving one build behind per session is
    // how an editing session ends up eating a machine.
    this._built?.dispose()
    this._built = null
    super.disconnectedCallback?.()
  }

  /** Fetch and edit an ensemble. */
  async load(url: string): Promise<void> {
    const data = (await (await fetch(url)).json()) as Ensemble
    this.ensemble = data
  }

  /** Hand the current ensemble to the host's `onSave`. */
  async save(): Promise<void> {
    await this.handleSave?.(this._ensemble)
  }

  /** Problems with the ensemble as it currently stands. */
  get problems() {
    return validate(this._ensemble, this._meshNames() ? { meshes: this._meshNames()! } : {})
  }

  private _meshNames(): Set<string> | null {
    const lib = (this._scene as unknown as { getLibrary?: (t: string) => { getNames?: () => string[] } | null })
      ?.getLibrary?.(this.library)
    const names = lib?.getNames?.()
    return names?.length ? new Set(names) : null
  }

  private _mountScene(): void {
    const aquatic = this.backdrop === 'aquatic'
    const scene = b3d(
      {},
      b3dLight({ y: 1, intensity: 0.9 }),
      b3dSkybox({ timeOfDay: 11 }),
      ...(this.libraryUrl ? [b3dLibrary({ url: this.libraryUrl, type: this.library })] : []),
      // The backdrop. Pinned to the origin: the world holds still, the camera moves.
      ...(this.backdrop === 'none'
        ? []
        : aquatic
          ? [b3dWater({ waterSize: 4000 }), b3dGround({ width: 4000, height: 4000, y: -140 })]
          : [
              b3dGround({
                width: 4000,
                height: 4000,
                // A neutral grid, not a checker: a checker reads as "missing
                // texture", and the heavier line every fourth cell gives the eye
                // a scale reference while judging an arrangement.
                texture: GRID_TEXTURE,
                textureTiles: 400,
              }),
            ])
    ) as unknown as SceneElement
    this._root.append(scene)
    this._scene = scene
  }

  /**
   * Rebuild the scene from the ensemble.
   *
   * Dispose-then-build, every time, deliberately: the runtime path an author
   * exercises here is the SAME one a game runs at load, so a leak or an
   * ordering bug shows up in the tool before it ships in a level.
   */
  rebuild(): void {
    if (!this._scene) return
    this._built?.dispose()
    this._built = buildEnsemble(this._ensemble, {
      scene: this._scene,
      library: this.library,
      placePiece: placeMesh,
      ...(this._meshNames() ? { meshes: this._meshNames()! } : {}),
    })
    this._renderChrome()
    this.frame()
  }

  /**
   * Point the camera at the ensemble.
   *
   * Framed on the pieces that PLACED something, not on every piece: an
   * environment primitive has no extent to frame — a seabed authored at
   * y = -140 would drag the camera underground, which is precisely how the
   * first version of this page came up as a uniform grey rectangle with the
   * scene working perfectly behind it.
   *
   * This is a first cut of milestone 2's fit-to-bounds. It frames the AUTHORED
   * positions; it does not yet re-fit as async models load and change the real
   * bounds.
   */
  frame(): void {
    const camera = this._scene?.camera as
      | { target?: { x: number; y: number; z: number }; radius?: number; beta?: number }
      | undefined
    if (!camera?.target || !this._built) return

    const placed = [...this._built.pieces.values()].filter((p) => p.element || p.node)
    if (!placed.length) return

    const axes = [0, 1, 2].map((i) => {
      const values = placed.map((p) => p.at[i] as number)
      return { min: Math.min(...values), max: Math.max(...values) }
    })
    const span = Math.max(...axes.map((a) => a.max - a.min), 1)

    camera.target.x = (axes[0]!.min + axes[0]!.max) / 2
    camera.target.y = (axes[1]!.min + axes[1]!.max) / 2
    camera.target.z = (axes[2]!.min + axes[2]!.max) / 2
    camera.radius = Math.max(span * 2.2, 24)
    camera.beta = 1.15
  }

  /** The selected piece, if any. */
  get selection(): Piece | null {
    return this._ensemble.pieces.find((p) => p.id === this._selected) ?? null
  }

  select(id: string): void {
    this._selected = id
    this._renderChrome()
  }

  /**
   * Write a value into the selected piece and rebuild.
   *
   * Every edit goes through here so that "the JSON is the truth" stays true —
   * a control that mutates a live element instead would be writing to something
   * the next rebuild throws away, which is the same trap as a gizmo that moves
   * the mesh rather than the element.
   */
  update(id: string, patch: Partial<Piece>): void {
    const piece = this._ensemble.pieces.find((p) => p.id === id)
    if (!piece) return
    Object.assign(piece, patch)
    this.rebuild()
  }

  /*
    TWO panels, not one.

    The first version stacked the piece list and the property fields in a single
    `panel3d`, which clips its content at its height — so selecting a piece
    appeared to do nothing, because its fields were rendered below the fold of a
    panel with no visible scroll affordance. A control that does nothing is
    worse than no control: it invites trust in a reading it never produced.
  */
  private _renderChrome(): void {
    for (const panel of this._panels) panel.remove()
    this._panels = []
    if (this.hideChrome) return

    const problems = this.problems
    const errors = problems.filter((p) => p.severity === 'error').length

    this._addPanel(
      8,
      panel3d(
        { width: 260, height: 340, padding: 10, gap: 6 },
        label3d({ text: this._ensemble.name || 'untitled', bold: true }),
        label3d({
          text: `${this._ensemble.pieces.length} pieces · ${errors}✕ · ${
            problems.length - errors
          }⚠`,
          muted: true,
        }),
        list3d<{ label: string; id: string }>({
          items: this._ensemble.pieces.map((p) => ({ label: p.id, id: p.id })),
          onSelect: (item) => this.select(item.id),
        })
      )
    )

    const selected = this.selection
    if (!selected) return
    this._addPanel(
      356,
      panel3d(
        { width: 260, height: 250, padding: 10, gap: 6 },
        label3d({ text: selected.id, bold: true }),
        label3d({
          text: selected.mesh ?? `${Object.keys(selected.features ?? {}).join(', ') || 'no body'}`,
          muted: true,
        }),
        // Position only, for now. The schema-driven property panel that renders
        // any feature from its JSON Schema is milestone 3.
        ...(['x', 'y', 'z'] as const).map((axis, i) =>
          slider3d({
            label: axis,
            value: selected.at[i] ?? 0,
            min: -200,
            max: 200,
            step: 1,
            onChange: (v: number) => {
              const at = [...selected.at] as [number, number, number]
              at[i] = v
              this.update(selected.id, { at })
            },
          })
        )
      )
    )
  }

  private _addPanel(top: number, panel: SVGSVGElement): void {
    panel.classList.add('ensemble-editor-chrome')
    panel.style.top = `${top}px`
    this._root.append(panel)
    this._panels.push(panel)
  }
}

export const ensembleEditor = EnsembleEditor.elementCreator() as (
  ...args: unknown[]
) => EnsembleEditor
