/*#
# <tosi-ensemble-editor>

The editor is a **component**, not an application. Drop it on a page, give it a
library and an ensemble, and it edits — the doc site's `/editor/` is one
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
/*{"parent":"Editing","order":1}*/
import { Component } from 'tosijs'
import {
  b3d,
  b3dGround,
  b3dLibrary,
  b3dLight,
  b3dSkybox,
  b3dWater,
  button3d,
  label3d,
  list3d,
  panel3d,
  select3d,
  slider3d,
  textBlock3d,
} from 'tosijs-3d'
import { Color3, HighlightLayer, Ray, Vector3 } from '@babylonjs/core'
import { buildEnsemble } from '../runtime/build'
import {
  libraryCatalogue,
  libraryNames,
  meshesByLibrary,
  mountLibraries,
} from '../runtime/libraries'
import { FlatPointer } from './input/flat-pointer'
import { PointerHub } from './input/pointer'
import { bodyIndex, pickPiece } from './selection'
import {
  defaultOptions,
  getTool,
  registeredCommands,
  registeredTools,
} from './tools/tool-registry'
import { registerEditorTools } from './tools/built-in'
import { registerTransformTool, transformsOf } from './tools/transform'
import { createHandles } from './handles-view'
import type { HandlesView } from './handles-view'
import { noTransforms } from './handles'
import type { Grip } from './handles'
import type { NumberField } from './schema-panel'
import { numberField, schemaWidgets } from './schema-panel'
import type { EditorRay } from './input/pointer'
import type { CatalogEntry, ToolContext } from './tools/tool-registry'
import { placeMesh } from '../runtime/place-mesh'
import { registerSceneFeatures } from '../runtime/features-scene'
import { validate } from '../format/validate'
import type { BuiltEnsemble } from '../runtime/build'
import type { Ensemble, Piece, Vec3 } from '../format/types'
import type { SceneElement } from '../format/registry'

/** A sample world to author against. Never saved with the ensemble. */
export type Backdrop = 'none' | 'land' | 'aquatic'

interface SceneWithCamera {
  activeCamera?: {
    detachControl?: () => void
    attachControl?: (element: HTMLCanvasElement, preventDefault?: boolean) => void
  }
  getEngine?: () => { getRenderingCanvas?: () => HTMLCanvasElement | null }
}

/** Trim trailing zeros so a coordinate reads as a number, not a measurement. */
const format = (n: number): string =>
  Number.isInteger(n) ? String(n) : String(Number(n.toFixed(3)))

/** Outline colour for the selected piece. */
const SELECTION_COLOR = new Color3(0.18, 0.62, 0.56)

/**
 * The meshes that make up a piece's body.
 *
 * An element body exposes one `mesh`; a library instance is a NODE whose meshes
 * are its children — a highlight layer takes meshes, not transform nodes, so a
 * piece made of five parts has to contribute all five or it outlines nothing.
 */
function selectableMeshes(built: { element?: unknown; node?: unknown }): unknown[] {
  const element = built.element as { mesh?: unknown } | null
  if (element?.mesh) return [element.mesh]
  const node = built.node as { getChildMeshes?: (direct?: boolean) => unknown[] } | null
  if (!node) return []
  const children = node.getChildMeshes?.(false) ?? []
  return children.length ? children : [node]
}

const EMPTY: Ensemble = { name: 'untitled', pieces: [] }

/*
  Backdrop grid, tiled so ONE TILE IS TEN METRES. That makes it metric rather
  than decorative — 1 m cells with emphasis at 5 m and the tile boundary at
  10 m — so an author judging whether a gap is flyable can count it.

  Two assets, and the difference is which numbers are round:

  - `/grid-10.svg` — 10 cells, 5th heavier, boundary heaviest. Decimal, so it
    suits a metric world and is the default here.
  - `/grid-4.svg` — 16 faint subdivisions, every 4th normal, 8th heavier,
    boundary heaviest. Binary; at a SIXTEEN-metre tile it also lands on 1 m
    cells, with emphasis at 4 m, 8 m and 16 m.

  Both put their lines on exact values and straddle the tile boundary, so the
  heaviest line is where it claims to be — worth keeping if either is redrawn,
  because that line is the one an author aligns against.
*/
const GRID_TEXTURE = '/grid-10.svg'
/** Metres per tile. Keep this and the scene ensembles agreeing, or a cell
 *  means one thing in the editor and another in the scene it authors. */
const GRID_METRES = 10

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
  private _hub = new PointerHub()
  private _pointer: FlatPointer | null = null
  /** Node → piece id, rebuilt with the ensemble. A stale one selects nothing. */
  private _index = new Map<unknown, string>()
  private _tool = 'select'
  private _toolOptions: Record<string, unknown> = {}
  private _stopFrames: (() => void) | null = null
  private _handles: HandlesView | null = null
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
    registerEditorTools()
    this._registerTransformTool()
    this._mountScene()
    this.setTool(this._tool)
    // Draw the chrome even with nothing loaded. `rebuild` is otherwise the only
    // caller, so an empty editor came up with no panel at all — which reads as
    // a broken tool rather than an empty one.
    this.rebuild()
    if (this.src) void this.load(this.src)
  }

  /*
    The manipulator is registered with HOOKS rather than given the editor, so
    the tool never learns what a scene, an element or a Babylon node is. That is
    also what let its drag maths be tested without a browser.
  */
  private _registerTransformTool(): void {
    registerTransformTool({
      nearGrip: (hand) => this._handles?.nearestGrip(hand) ?? null,
      farGrip: (ray) => {
        const scene = (this._scene as unknown as { scene?: unknown }).scene as
          | { pickWithRay: (r: unknown, p?: (m: unknown) => boolean) => { pickedMesh?: unknown } | null }
          | undefined
        if (!scene || !this._handles) return null
        const hit = scene.pickWithRay(
          new Ray(
            new Vector3(ray.origin[0], ray.origin[1], ray.origin[2]),
            new Vector3(ray.direction[0], ray.direction[1], ray.direction[2])
          ),
          (mesh) => this._handles?.gripOf(mesh) !== null
        )
        return (this._handles.gripOf(hit?.pickedMesh) as Grip | null) ?? null
      },
      bodyOf: (id) => {
        const built = this._built?.pieces.get(id)
        if (!built) return null
        return { element: built.element as never, node: built.node }
      },
      worldOrigin: () => {
        const built = this.selection ? this._built?.pieces.get(this.selection.id) : null
        return built?.at ?? [0, 0, 0]
      },
    })
  }

  /** The active tool's name. */
  get tool(): string {
    return this._tool
  }

  /**
   * Switch tools.
   *
   * Options are re-derived from the incoming tool's SCHEMA rather than carried
   * over, so a stale `snap` from the last tool cannot quietly apply to this one.
   */
  setTool(name: string): void {
    const previous = getTool(this._tool)
    previous?.deactivate?.(this._toolContext())
    this._tool = name
    const tool = getTool(name)
    this._toolOptions = defaultOptions(tool?.optionsSchema)
    tool?.activate?.(this._toolContext())
    this._syncHandles()
    this._hub.setHandlers({
      onStart: (g) => tool?.onGesture?.start?.(g, this._toolContext()),
      onMove: (g) => tool?.onGesture?.move?.(g, this._toolContext()),
      onEnd: (g) => tool?.onGesture?.end?.(g, this._toolContext()),
    })
    this._renderChrome()
  }

  /** Set one option on the current tool. */
  setToolOption(key: string, value: unknown): void {
    this._toolOptions = { ...this._toolOptions, [key]: value }
    // The mode option changes which handles exist, so they are rebuilt here
    // rather than only when the selection changes.
    this._syncHandles()
    this._renderChrome()
  }

  /**
   * Ray-pick a piece. Exposed so a tool can ask "what is under this hand?"
   * without knowing the engine or how bodies are indexed.
   */
  pick(ray: EditorRay): string | null {
    const scene = (this._scene as unknown as { scene?: unknown }).scene
    if (!scene) return null
    /*
      Index at PICK time, not at build time.

      An element's Babylon mesh is created when the element joins the scene, not
      when `buildEnsemble` returns — so an index taken straight after a build is
      empty for every element-backed piece, and picking silently finds nothing.
      Rebuilding per pick is a walk over the pieces; that is cheap next to the
      raycast it precedes.
    */
    this._index = bodyIndex(this._built)
    return pickPiece(
      scene as never,
      this._index,
      ray,
      (r) =>
        new Ray(
          new Vector3(r.origin[0], r.origin[1], r.origin[2]),
          new Vector3(r.direction[0], r.direction[1], r.direction[2])
        )
    )
  }

  /**
   * Where a ray meets the scene, in world space.
   *
   * Excludes the manipulator's own handles: they draw on top of everything, so
   * without this an insert would land ON the gizmo rather than the ground under
   * it — and the handles are exactly where the author is most likely aiming.
   */
  pickPoint(ray: EditorRay): Vec3 | null {
    const scene = (this._scene as unknown as { scene?: unknown }).scene as
      | {
          pickWithRay: (
            r: unknown,
            p?: (m: unknown) => boolean
          ) => { hit?: boolean; pickedPoint?: { x: number; y: number; z: number } | null } | null
        }
      | undefined
    if (!scene) return null
    const hit = scene.pickWithRay(
      new Ray(
        new Vector3(ray.origin[0], ray.origin[1], ray.origin[2]),
        new Vector3(ray.direction[0], ray.direction[1], ray.direction[2])
      ),
      (mesh) => this._handles?.gripOf(mesh) == null
    )
    const point = hit?.pickedPoint
    return point ? [point.x, point.y, point.z] : null
  }

  /**
   * Detach or reattach the camera's own input.
   *
   * Reattaching uses the canvas the scene is actually rendering into rather
   * than a remembered one — the editor can be moved in the DOM, and a camera
   * reattached to a stale canvas stops responding entirely.
   */
  captureCamera(capture: boolean): void {
    const scene = (this._scene as unknown as { scene?: SceneWithCamera }).scene
    const camera = scene?.activeCamera
    if (!camera) return
    if (capture) {
      camera.detachControl?.()
      return
    }
    const canvas = scene?.getEngine?.()?.getRenderingCanvas?.()
    if (canvas) camera.attachControl?.(canvas, false)
    /*
      CLEAR THE CAMERA'S CACHED DRAG ORIGIN BEFORE GIVING IT BACK.

      `BaseCameraPointersInput` records `_pointA` on pointerdown and diffs every
      later move against it. `detachControl()` clears the modifier and button
      state but NOT `_pointA` — so the sequence is: press (camera stores the
      press point), we detach, the user drags a handle right across the screen,
      we re-attach on release, and the next mouse move diffs against a point
      from before the drag. The camera swings by the whole drag distance in one
      frame.

      Reported as "the move worked but upon ending the drag the view was changed
      by the stored delta", which is precisely what it is. Nothing errors, and
      it only shows up when something detaches the camera MID-gesture — which is
      exactly what a manipulator does.

      `_pointA`/`_pointB` are private, hence the guarded cast: no public API
      resets this, and the alternative (synthesising a window `blur`, the one
      event whose handler does clear them) reaches further and breaks more.
    */
    const pointers = (
      camera as unknown as {
        inputs?: { attached?: { pointers?: { _pointA?: unknown; _pointB?: unknown } } }
      }
    ).inputs?.attached?.pointers
    if (pointers) {
      pointers._pointA = null
      pointers._pointB = null
    }
  }

  private _toolContext(): ToolContext {
    return {
      ensemble: this._ensemble,
      selection: this.selection,
      select: (id) => (id === null ? this._clearSelection() : this.select(id)),
      scene: this._scene as SceneElement,
      edit: (describe, mutate) => this.edit(describe, mutate),
      options: this._toolOptions,
      pick: (ray) => this.pick(ray),
      pickPoint: (ray) => this.pickPoint(ray),
      captureCamera: (capture) => this.captureCamera(capture),
      meshNames: () => [...(this._meshNames() ?? [])],
      meshCatalog: () => this.meshCatalog(),
    } as ToolContext
  }

  /**
   * THE mutation path. Every edit goes through here.
   *
   * Undo is still a v1 non-goal, but one path is what makes adding it a single
   * change rather than an archaeology exercise across the editor.
   */
  edit(_describe: string, mutate: (ensemble: Ensemble) => void): void {
    mutate(this._ensemble)
    this.rebuild()
  }

  private _clearSelection(): void {
    this._selected = null
    this._renderChrome()
  }

  /*
    Pointers are polled per frame, not driven by DOM events, because that is the
    only shape both sources can honestly take: a flat pointer has events, an XR
    trigger is a float you read. Unify at the lower common denominator and the
    tool layer never learns which one it is talking to.
  */
  /*
    A LIBRARY IS NOT LOADED WHEN IT IS MOUNTED.

    `buildEnsemble` runs as soon as an ensemble is set, which is normally before
    a multi-megabyte `.glb` has arrived — so `library.instantiate()` returns null
    and every piece falls back to a placeholder box. Nothing errors; the scene
    just looks like an ensemble whose meshes are all missing.

    `<tosi-b3d-library>` exposes a `ready` promise, so wait on it and rebuild.
    The first build still happens immediately, which is the point: boxes in the
    right places beat an empty viewport while a library downloads.
  */
  private async _rebuildWhenLibraryReady(): Promise<void> {
    const libraries = [
      ...((this._scene?.querySelectorAll?.('tosi-b3d-library') ?? []) as unknown as Iterable<
        Element & { ready?: Promise<void> }
      >),
    ]
    const pending = libraries.map((l) => l.ready).filter(Boolean) as Array<Promise<void>>
    if (!pending.length) return
    // A library that fails to load leaves its pieces as boxes rather than
    // stranding the ones that DID load.
    await Promise.all(pending.map((p) => p.catch(() => undefined)))
    if (!this.isConnected) return
    this.rebuild()
  }

  private _attachPointers(): void {
    const scene = (
      this._scene as unknown as {
        scene?: { getEngine?: () => { getRenderingCanvas?: () => HTMLCanvasElement | null } }
      }
    ).scene
    const canvas = scene?.getEngine?.()?.getRenderingCanvas?.()
    if (!scene || !canvas) return
    this._pointer = new FlatPointer(canvas, scene as never)
    this._hub.add(this._pointer)

    /*
      THE INPUT LOOP IS NOT THE RENDER LOOP.

      The obvious wiring is `scene.registerBeforeRender`, and it is wrong here:
      `<tosi-b3d>` pauses rendering when the page is hidden, and an editor pauses
      the scene deliberately all the time. Both leave input dead while the UI
      still looks alive — you click, nothing happens, and nothing errors.

      An editor must stay selectable while the world is stopped, so it gets its
      own clock. (Measured, not assumed: with the render loop as the clock, a
      probe on the scene counted ZERO frames while the viewport looked normal.)
    */
    let running = true
    const tick = () => {
      if (!running) return
      this._syncHandleScale()
      this._hub.update()
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    this._stopFrames = () => {
      running = false
    }
  }

  override disconnectedCallback(): void {
    // The editor rebuilds constantly; leaving one build behind per session is
    // how an editing session ends up eating a machine.
    this._built?.dispose()
    this._built = null
    this._stopFrames?.()
    this._stopFrames = null
    this._handles?.dispose()
    this._handles = null
    this._pointer?.dispose()
    this._pointer = null
    super.disconnectedCallback?.()
  }

  /** Fetch and edit an ensemble. */
  async load(url: string): Promise<void> {
    const data = (await (await fetch(url)).json()) as Ensemble
    // The ensemble declares its own libraries; mount them before building so
    // pieces resolve to real meshes on the first pass rather than boxes.
    if (this._scene) await mountLibraries(data, this._scene)
    this.ensemble = data
    // Belt and braces: `mountLibraries` waits, but a library mounted by some
    // other path — or one that resolves after this build — still has to land.
    void this._rebuildWhenLibraryReady()
  }

  /** Hand the current ensemble to the host's `onSave`. */
  async save(): Promise<void> {
    await this.handleSave?.(this._ensemble)
  }

  /** Problems with the ensemble as it currently stands. */
  get problems() {
    return validate(this._ensemble, this._meshNames() ? { meshes: this._meshNames()! } : {})
  }

  /**
   * Every mesh across every mounted library, tagged with its library and family.
   *
   * A palette of 561 undifferentiated names is not a palette, it is a haystack —
   * which is what two Kenney collections turn the flat list into. The category
   * is the leading word of the name, which in these sets is a real taxonomy
   * (`commercial_*`, `car_debris-*`) rather than a hopeful guess.
   */
  meshCatalog(): CatalogEntry[] {
    if (!this._scene) return []
    const libraries = libraryNames(this._ensemble, this.library || undefined)
    const out: CatalogEntry[] = []
    for (const library of libraries) {
      /*
        THE LIBRARY'S OWN TAXONOMY, when it has one.

        A packed kit declares `{ category, tags }` per model, which is a real
        taxonomy — `city-kit-roads` sorts into bridge / construction / light /
        road / sign / tile, and no amount of splitting names on punctuation
        reproduces that. It also tells us which nodes are EXPORTS: `getNames()`
        lists a chest's `lid` and a ship's `sail-a` beside the chest and ship.

        Falling back to the leading word of the name keeps older un-annotated
        libraries working rather than showing them as one undifferentiated heap.
      */
      const declared = libraryCatalogue(this._scene, library)
      if (declared.length) {
        for (const item of declared) {
          out.push({
            library,
            mesh: item.name,
            category: item.category ?? item.name,
            ...(item.tags ? { tags: item.tags } : {}),
            ...(item.clips ? { clips: item.clips } : {}),
          })
        }
        continue
      }
      const names = meshesByLibrary(this._scene, [library]).get(library)
      for (const mesh of names ?? []) {
        out.push({ library, mesh, category: mesh.split(/[_-]/)[0] || mesh })
      }
    }
    return out
  }

  /** Every mesh name reachable, across the ensemble's libraries and any the
   *  page forced via the `library` attribute. */
  private _meshNames(): Set<string> | null {
    if (!this._scene) return null
    const byLibrary = meshesByLibrary(
      this._scene,
      libraryNames(this._ensemble, this.library || undefined)
    )
    const all = new Set<string>()
    for (const names of byLibrary.values()) for (const name of names) all.add(name)
    return all.size ? all : null
  }

  private _mountScene(): void {
    /*
      ADOPT AN EXISTING SCENE RATHER THAN BUILDING A SECOND ONE.

      `connectedCallback` runs again whenever the element is moved or
      re-attached — which a doc-browser SPA does on every navigation. Mounting
      unconditionally left a second `<tosi-b3d>` in the shadow root while
      `_scene` still pointed at the first, so every piece was appended to an
      ORPHANED scene: 19 bodies built, 0 meshes rendered, and no error anywhere.
    */
    const existing = this._root.querySelector?.('tosi-b3d') as SceneElement | null
    if (existing) {
      this._scene = existing
      this._attachPointers()
      return
    }
    const scene = b3d({
      /*
        Pointers attach HERE, not in `connectedCallback`.

        `<tosi-b3d>` builds its Babylon scene asynchronously, so at connect
        time there is no scene, no engine and no canvas — an earlier version
        attached there, found nothing, returned quietly, and left the viewport
        unclickable with no error anywhere. "Created" is not "ready".
      */
      sceneCreated: () => {
        this._attachPointers()
        void this._rebuildWhenLibraryReady()
      },
    }) as unknown as SceneElement
    this._scene = scene
    this._root.append(scene)
    this._syncBackdrop()
  }

  /*
    THE BACKDROP FILLS IN WHAT THE ENSEMBLE LACKS.

    It is authoring context — a sky and a ground so the thing being authored has
    somewhere to be — and the moment an ensemble carries its OWN sky, the two
    are coincident and the whole view z-fights. That is what "everything is
    flickering like crazy" turned out to be: two skyboxes at the same radius,
    each winning half the pixels.

    So every backdrop part is conditional on the ensemble not providing the same
    thing. Reconciled on every rebuild, because which features an ensemble has
    changes as it is edited: delete its `skybox` piece and the backdrop's sky
    should come back rather than leaving the author under a black dome.
  */
  private _syncBackdrop(): void {
    if (!this._scene) return
    const used = new Set(
      this._ensemble.pieces.flatMap((piece) => Object.keys(piece.features ?? {}))
    )
    const aquatic = this.backdrop === 'aquatic'
    const on = this.backdrop !== 'none'

    this._backdropPart('light', on && !used.has('light') && !used.has('sun'), () =>
      b3dLight({ y: 1, intensity: 0.9 })
    )
    this._backdropPart('skybox', on && !used.has('skybox'), () => b3dSkybox({ timeOfDay: 11 }))
    this._backdropPart(
      'water',
      on && aquatic && !used.has('water'),
      () => b3dWater({ waterSize: 4000 })
    )
    /*
      WATER COUNTS AS GROUND. The backdrop's ground is scenery of last resort,
      so it must yield to ANY surface the ensemble lays at the same level — not
      just one called `ground`. A cove that supplies its own sea got the grid
      plane as well, both at y=0, which is the coincident-surface flicker all
      over again in a costume.
    */
    this._backdropPart(
      'ground',
      on && !used.has('ground') && !used.has('terrain') && !used.has('water'),
      () =>
        b3dGround({
          width: 4000,
          height: 4000,
          y: aquatic ? -140 : 0,
          // A neutral grid, not a checker: a checker reads as "missing
          // texture", where a metric grid gives the eye a scale reference
          // while judging an arrangement.
          texture: GRID_TEXTURE,
          textureTiles: 4000 / GRID_METRES,
        })
    )
  }

  /** Add or remove one backdrop element, idempotently. */
  private _backdropPart(name: string, wanted: boolean, make: () => unknown): void {
    const existing = this._backdrop.get(name)
    if (wanted && !existing) {
      const element = make() as SceneElement
      this._scene?.appendChild(element)
      this._backdrop.set(name, element)
      return
    }
    if (!wanted && existing) {
      existing.remove()
      this._backdrop.delete(name)
    }
  }

  private _backdrop = new Map<string, SceneElement>()

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
    this._syncBackdrop()
    this._syncSelection()
    this._syncHandles()
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
    this._syncSelection()
    this._syncHandles()
    this._renderChrome()
  }

  /*
    SELECTION HAS TO BE VISIBLE IN THE VIEWPORT, not only in a panel.

    The manipulator's handles appear only under the Move tool, so with Select
    active there was NO indication in the scene at all — you clicked a building
    and the only thing that changed was a title in a side panel you were not
    looking at.

    An outline rather than a bounding box: a box around a tree is mostly empty
    air and reads as "this region", where an outline reads as "this thing".
  */
  private _syncSelection(): void {
    const scene = (this._scene as unknown as { scene?: unknown }).scene
    if (!scene) return
    if (!this._highlight) {
      this._highlight = new HighlightLayer('ensemble-editor-selection', scene as never)
      // Otherwise the outline is hidden by anything drawn in front of it —
      // including the piece itself, which is the usual case for a mesh with
      // interior geometry.
      this._highlight.innerGlow = false
    }
    this._highlight.removeAllMeshes()
    const built = this.selection ? this._built?.pieces.get(this.selection.id) : null
    if (!built) return
    for (const mesh of selectableMeshes(built)) {
      try {
        this._highlight.addMesh(mesh as never, SELECTION_COLOR)
      } catch {
        /* a mesh the layer cannot outline is not worth losing the selection over */
      }
    }
  }

  private _highlight: HighlightLayer | null = null

  /**
   * Put the handles on the selection, or take them away.
   *
   * Handles exist only while a piece is selected AND the select tool is
   * current — a manipulator floating over nothing is a control that does
   * nothing, which invites trust in a reading it never produced.
   */
  /**
   * Keep the handles a constant size on screen.
   *
   * `0.12` of the camera distance puts the axis stick at roughly a sixth of the
   * viewport height at Babylon's default field of view, which makes the fat
   * pick target about 60 px across on a laptop and 40 on a phone. World-sized
   * handles measured ELEVEN px on the sample ensemble — the difference between
   * a tool that works and one the owner described as "very hit and mostly
   * miss".
   *
   * Per frame, not per selection: the size is wrong the instant the camera
   * moves, and the camera moves constantly.
   */
  private _syncHandleScale(): void {
    if (!this._handles) return
    const camera = (this._scene as unknown as { scene?: SceneWithCamera }).scene?.activeCamera as
      | { position?: { x: number; y: number; z: number } }
      | undefined
    const eye = camera?.position
    const built = this.selection ? this._built?.pieces.get(this.selection.id) : null
    if (!eye || !built) return
    const distance = Math.hypot(eye.x - built.at[0], eye.y - built.at[1], eye.z - built.at[2])
    this._handles.setScale(Math.max(distance * 0.12, 0.05))
  }

  private _syncHandles(): void {
    const scene = (this._scene as unknown as { scene?: unknown }).scene
    if (!scene) return
    const built = this.selection ? this._built?.pieces.get(this.selection.id) : null
    /*
      The widget appears when a piece is selected AND the tool offers at least
      one transform. With all three off — the default — the fused tool is a
      pure selection tool and nothing is drawn over the thing you are pointing
      at, which is the point of defaulting them off.
    */
    const transforms = transformsOf(this._toolOptions)
    const wanted = this._tool === 'select' && built && !noTransforms(transforms)
    if (!wanted) {
      this._handles?.dispose()
      this._handles = null
      return
    }
    if (!this._handles) this._handles = createHandles(scene)
    this._handles.setTransforms(transforms)
    this._handles.moveTo(built.at)
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
  /*
    FOUR PANELS IN TWO COLUMNS, which is how graphics apps have settled:

      left   tool palette      right  tool options
             piece list               piece properties

    In a headset these become wrist-pinned surfaces (`frame: 'left-hand'` /
    `'right-hand'` via frame-panel), which is why they are grouped by HAND
    rather than laid out as one sidebar. Same content, two presentations — the
    SVG UI's whole argument.

    Each is its own `panel3d` because a panel clips at its height: stacking
    everything into one made selecting a piece appear to do nothing, since its
    fields rendered below the fold with no visible scroll affordance.
  */
  private _renderChrome(): void {
    for (const panel of this._panels) panel.remove()
    this._panels = []
    this._stackTop = { left: 8, right: 8 }
    if (this.hideChrome) return

    this._renderPalette()
    this._renderToolOptions()
    this._renderPieceList()
    this._renderLibraryPalette()
    this._renderProperties()
  }

  private _renderPalette(): void {
    const tools = registeredTools()
    const commands = registeredCommands()
    const ctx = this._toolContext()
    this._addPanel(
      'left',
      panel3d(
        /*
          Height is a BUDGET, and a short one silently drops whatever is LAST.
          `Delete` fell off this palette twice while the hint above it was
          being adjusted — so the hint now goes last and the controls come
          first: a clipped hint costs advice, a clipped button costs a feature.
          34 per row (a button3d is taller than its label), plus the hint.
        */
        { width: 150, height: 190 + (tools.length + commands.length) * 34, padding: 8, gap: 4 },
        label3d({ text: 'Tools', bold: true }),
        ...(tools.map((tool) =>
          button3d({
            // The current tool is marked in its label rather than by colour
            // alone — a headset at low resolution loses a subtle tint.
            label: tool.name === this._tool ? `▸ ${tool.label}` : tool.label,
            onClick: () => this.setTool(tool.name),
          })
        ) as never[]),
        ...(commands.map((command) =>
          button3d({
            label: command.enabled?.(ctx) === false ? `${command.label} —` : command.label,
            onClick: () => {
              if (command.enabled?.(ctx) === false) return
              command.run(this._toolContext())
            },
          })
        ) as never[]),
        /*
          Navigation is discoverable nowhere else: the camera's gestures are
          Babylon's defaults, and an editor that does not say so leaves you
          unable to move the view at all.

          `textBlock3d`, not `label3d`: a label is one line and CLIPS at the
          panel edge without a mark, so this shipped for a while reading
          "drag orbit · ⌃dra" — advice truncated mid-word, which is worse than
          no advice. A text block measures and wraps to the panel width.
        */
        textBlock3d({ lines: ['drag orbit · ⌃drag pan · wheel zoom'], muted: true })
      )
    )
  }

  private _renderToolOptions(): void {
    const tool = getTool(this._tool)
    if (!tool?.optionsSchema) return
    const widgets = schemaWidgets({
      schema: tool.optionsSchema,
      values: this._toolOptions,
      onChange: (key, value) => this.setToolOption(key, value),
    })
    this._addPanel(
      'right',
      panel3d(
        { width: 240, height: 60 + widgets.length * 38, padding: 10, gap: 6 },
        label3d({ text: tool.label, bold: true }),
        ...(widgets as never[])
      )
    )
  }

  /**
   * The library palette.
   *
   * Picking a mesh switches to the insert tool AND sets its `mesh` option, so
   * the next press in the world places that model. A palette that only selected
   * a mesh, leaving the author to also find the tool, would be two steps for
   * what reads as one.
   */
  /**
   * The library palette, in two levels: family, then mesh.
   *
   * A flat list stopped being a palette the moment two Kenney collections
   * arrived — 561 entries is a haystack you scroll rather than a set you choose
   * from. The families come from the names themselves (`commercial_*`,
   * `car_debris-*`), so this is the content's own taxonomy rather than one we
   * imposed on it.
   *
   * Picking a mesh records its LIBRARY along with its name. Two libraries can
   * export the same name, and a piece that cannot say which one it meant
   * resolves to whichever loaded first — a bug that reproduces on one machine
   * and not another.
   */
  private _renderLibraryPalette(): void {
    const catalog = this.meshCatalog()
    if (!catalog.length) return

    // `library · category`, because two libraries can name a family the same
    // thing and "commercial" alone would silently merge them.
    const families = [...new Set(catalog.map((entry) => `${entry.library} · ${entry.category}`))].sort()
    const current = (this._toolOptions.family as string) ?? families[0]!
    const items = catalog.filter((entry) => `${entry.library} · ${entry.category}` === current)
    const chosen = this._tool === 'insert' ? (this._toolOptions.mesh as string) : null

    this._addPanel(
      'left',
      panel3d(
        { width: 200, height: 320, padding: 8, gap: 4 },
        label3d({ text: `Library (${catalog.length})`, bold: true }),
        select3d({
          label: '',
          value: current,
          options: families,
          onChange: (value: string | number) => {
            this.setToolOption('family', String(value))
          },
        }),
        label3d({ text: `${items.length} in family`, muted: true, compact: true }),
        list3d<{ label: string; entry: CatalogEntry }>({
          items: items.map((entry) => ({
            // Drop the family prefix: every row in the list repeats it, which
            // costs the width that would otherwise show what differs.
            label: (entry.mesh.slice(entry.category.length).replace(/^[_-]/, '') || entry.mesh) ===
              chosen?.slice(entry.category.length).replace(/^[_-]/, '')
              ? `▸ ${entry.mesh}`
              : entry.mesh.slice(entry.category.length).replace(/^[_-]/, '') || entry.mesh,
            entry,
          })),
          onSelect: (item) => {
            if (this._tool !== 'insert') this.setTool('insert')
            this.setToolOption('mesh', item.entry.mesh)
            this.setToolOption('library', item.entry.library)
          },
        })
      )
    )
  }

  private _renderPieceList(): void {
    const problems = this.problems
    const errors = problems.filter((p) => p.severity === 'error').length
    this._addPanel(
      'left',
      panel3d(
        { width: 150, height: 340, padding: 8, gap: 4 },
        label3d({ text: this._ensemble.name || 'untitled', bold: true }),
        label3d({
          text: `${this._ensemble.pieces.length} · ${errors}✕ · ${problems.length - errors}⚠`,
          muted: true,
        }),
        list3d<{ label: string; id: string }>({
          items: this._ensemble.pieces.map((p) => ({ label: p.id, id: p.id })),
          onSelect: (item) => this.select(item.id),
        })
      )
    )
  }

  private _renderProperties(): void {
    const selected = this.selection
    if (!selected) return
    /*
      TYPED COORDINATES, not sliders. A slider is bounded, imprecise, and ours
      showed no number at all — you could not see where a piece WAS, let alone
      put it somewhere exact. Dragging belongs on the handles in the viewport;
      the panel's job is the number.
    */
    const rows = (['x', 'y', 'z'] as const).flatMap((axis, i) => [
      label3d({ text: `${axis}  ${format(selected.at[i] ?? 0)}`, muted: true }),
      numberField({
        label: axis,
        value: selected.at[i] ?? 0,
        onFocus: (field) => {
          // Exclusive: two lit fields both claiming the keyboard is worse than
          // none, because the caret is somewhere you are not looking.
          this._activeField?.setActive(false)
          this._activeField = field
        },
        onCommit: (value) => {
          const at = [...selected.at] as [number, number, number]
          at[i] = value
          this.update(selected.id, { at })
        },
      }),
    ])
    this._addPanel(
      'right',
      panel3d(
        { width: 240, height: 96 + rows.length * 32, padding: 10, gap: 4 },
        label3d({ text: selected.id, bold: true }),
        label3d({
          text: selected.mesh ?? `${Object.keys(selected.features ?? {}).join(', ') || 'no body'}`,
          muted: true,
        }),
        ...(rows as never[])
      )
    )
  }

  /*
    ROUTE KEYSTROKES INTO THE SVG FIELDS.

    `inputField` is a Widget3d that exposes `insert`/`action` and listens to
    NOTHING — by design, because in a headset the keys come from an SVG
    keyboard rather than from the DOM. Flat, that means the host has to carry
    real key events across, or a field you can click into silently refuses to
    accept a single character.

    This is the form layer SPEC predicted we would have to build: forms are the
    SVG UI's thinnest area, and the editor is the consumer that needs one.
  */
  private _routeKeys(panel: SVGSVGElement): void {
    panel.setAttribute('tabindex', '0')
    const onKey = (event: KeyboardEvent) => {
      const field = this._activeField
      if (!field) return
      if (event.key === 'Enter') {
        ;(field as unknown as { action: (a: string) => void }).action('enter')
      } else if (event.key === 'Backspace') {
        ;(field as unknown as { action: (a: string) => void }).action('backspace')
      } else if (event.key.length === 1) {
        field.insert(event.key)
      } else {
        return
      }
      event.preventDefault()
      event.stopPropagation()
    }
    panel.addEventListener('keydown', onKey)
    // Clicking a field must also give the panel DOM focus, or the keydown
    // never arrives however correctly it is routed.
    panel.addEventListener('pointerdown', () => panel.focus({ preventScroll: true }))
  }

  private _activeField: NumberField | null = null

  private _addPanel(side: 'left' | 'right', panel: SVGSVGElement): void {
    panel.classList.add('ensemble-editor-chrome')
    this._routeKeys(panel)
    panel.style.top = `${this._stackTop[side]}px`
    panel.style[side] = '8px'
    const height = Number(panel.getAttribute('height') ?? 0)
    this._stackTop[side] += height + 10
    this._root.append(panel)
    this._panels.push(panel)
  }

  private _stackTop: { left: number; right: number } = { left: 8, right: 8 }
}

export const ensembleEditor = EnsembleEditor.elementCreator() as (
  ...args: unknown[]
) => EnsembleEditor
