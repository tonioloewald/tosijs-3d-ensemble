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
import { Component, tosi } from "tosijs";
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
  row3d,
  select3d,
  euler3d,
  iconGrid3d,
  slider3d,
  toggle3d,
  ui,
  vector3d,
} from "tosijs-3d";
import { Quaternion, Ray, Vector3 } from "@babylonjs/core";
import { buildEnsemble } from "../runtime/build";
import { reapUnclaimedSingletons } from "../runtime/features-scene";
import {
  libraryCatalogue,
  libraryNames,
  meshesByLibrary,
  mountLibraries,
} from "../runtime/libraries";
import { FlatPointer } from "./input/flat-pointer";
import { PointerHub } from "./input/pointer";
import { bodyIndex, pickPiece } from "./selection";
import {
  defaultOptions,
  getTool,
  registeredCommands,
  registeredTools,
} from "./tools/tool-registry";
import { registerEditorTools } from "./tools/built-in";
import { registerTransformTool, transformsOf } from "./tools/transform";
import { createHandles } from "./handles-view";
import { createHistory } from "./history";
import { createSelectionView } from "./selection-view";
import type { SelectionView } from "./selection-view";
import type { HandlesView } from "./handles-view";
import { axisVector, noTransforms, normaliseDegrees } from "./handles";
import type { Grip } from "./handles";
import { schemaWidgets } from "./schema-panel";
import { DEFAULT_PRECISION, roundDeep } from "../format/round";
import { createBeaconView, type Beacon, type BeaconView } from "./beacon-view";
import { featureRegistration, registeredFeatures } from "../format/registry";
import type { EditorRay } from "./input/pointer";
import type { CatalogEntry, ToolContext } from "./tools/tool-registry";
import { placeMesh } from "../runtime/place-mesh";
import { registerSceneFeatures } from "../runtime/features-scene";
import { validate } from "../format/validate";
import type { BuiltEnsemble } from "../runtime/build";
import type { Ensemble, Euler, Piece, Vec3, LibraryRef } from "../format/types";
import { narrowScale, scaleVector } from "../format/scale";
import {
  fileNameFor,
  parseEnsemble,
  readSaved,
  savedNames,
  serialise,
  writeSaved,
} from "./storage";
import type { SceneElement } from "../format/registry";

/**
 * A tosijs store holding one ensemble.
 *
 * Typed loosely on purpose: the proxy's shape is a path-addressed view of the
 * document, not the document, and pretending otherwise in the types invites
 * exactly the mistake the note on `_store` records.
 */
interface TosiStore {
  value: Ensemble;
  /*
    THROUGH `.tosi`, NOT THE BARE PROPERTIES. The accessor is the collision-free
    API: a document with its own `value` or `observe` key would shadow the
    direct forms, and `observe` in particular is typed differently on the two —
    the bare one is a path notifier, this one takes the callback.
  */
  tosi: {
    value: Ensemble;
    touch: () => void;
    observe: (callback: (path: string) => void) => () => void;
  };
}

/** Distinguishes each editor's store path — see `_store`. */
let documents = 0;

/** The piece, feature and field a document path points at. */
interface FeatureField {
  id: string;
  feature: string;
  key: string;
}

/**
 * Read `pieces[id=sky].features.skybox.timeOfDay` back into its three parts.
 *
 * Returns null for anything else — a structural change, a rename, a position —
 * so the observer can tell a bound field write from everything else without
 * the writer having to announce itself.
 */
function parseFeaturePath(path: string): FeatureField | null {
  /*
    ⚠️ NOT anchored at the start. An observed path is prefixed with the STORE
    KEY — `ensemble-editor-1.pieces[id=sky].features.skybox.timeOfDay` — and a
    `^pieces` anchor silently matched nothing.

    The failure was not silent for long but it was well disguised: with no
    field parsed, the write skipped rounding AND fell through to `chrome:
    true`, which re-rendered the panel and destroyed the slider under the
    pointer on the first frame of a drag. So the one bug looked like the
    original "sliders don't work as sliders", after the fix for that had
    landed.
  */
  const match = /pieces\[id=([^\]]+)\]\.features\.([^.]+)\.([^.]+)$/.exec(path);
  return match ? { id: match[1]!, feature: match[2]!, key: match[3]! } : null;
}

/** A sample world to author against. Never saved with the ensemble. */
export type Backdrop = "none" | "land" | "aquatic";

interface SceneWithCamera {
  activeCamera?: {
    detachControl?: () => void;
    attachControl?: (
      element: HTMLCanvasElement,
      preventDefault?: boolean
    ) => void;
  };
  getEngine?: () => { getRenderingCanvas?: () => HTMLCanvasElement | null };
}

/** Trim trailing zeros so a coordinate reads as a number, not a measurement. */
const format = (n: number): string =>
  Number.isInteger(n) ? String(n) : String(Number(n.toFixed(3)));

const EMPTY: Ensemble = { name: "untitled", pieces: [] };

/**
 * How many steps back an author can go.
 *
 * Generous, because the whole document is small and the drags are coarse — a
 * long editing session is hundreds of edits, not millions. Bounded anyway, so
 * a session left open overnight cannot grow without limit.
 */
const HISTORY_LIMIT = 200;

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
const GRID_TEXTURE = "/grid-10.svg";
/** Metres per tile. Keep this and the scene ensembles agreeing, or a cell
 *  means one thing in the editor and another in the scene it authors. */
const GRID_METRES = 10;

/**
 * One width for the whole left column.
 *
 * The palette, the file panel and the scene graph / library are a COLUMN, and a
 * column of three different widths reads as three unrelated things that happen
 * to be stacked. They were 184, 150 and 200 because each was sized to its own
 * content as it was written.
 *
 * The right-hand panels take it too, so the two edges of the viewport match.
 * They were 240, which fitted their content only in the sense that it did not
 * overflow: `shadowDarkness` and `activeDistance` collided with their own
 * sliders, and a vector row put three fields and three keyboard buttons in the
 * space of two. A property panel is where the numbers are READ, so it is the
 * last place to be economical about width.
 */
const PANEL_WIDTH = 320;

/*
  THE MENU STRINGS, so the picker and the handler cannot disagree about them.
*/
/**
 * Hand the browser a file to save.
 *
 * A blob URL and a synthetic click is the whole of it, and the revoke matters:
 * the URL pins the blob in memory until it is released, and an editor that
 * saves often would otherwise accumulate every version it ever wrote.
 */
function download(fileName: string, text: string): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Ask for a file, without leaving one behind.
 *
 * The input is never added to the document — `click()` works on a detached
 * element, and an `<input type="file">` parked in the DOM is a stray control
 * that can be tabbed to.
 */
function pickFile(onText: (text: string) => void): void {
  if (typeof document === "undefined") return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    void file.text().then(onText);
  });
  input.click();
}

export class EnsembleEditor extends Component {
  static override preferredTagName = "tosi-ensemble-editor";

  static override initAttributes = {
    /**
     * Library `type` to instantiate meshes from. Empty means "no library":
     * pieces render as placeholder cubes, which is the useful failure — the
     * arrangement is most of what an author is judging.
     */
    library: "",
    /** URL of a `.glb` library to load. Optional if the page loads its own. */
    libraryUrl: "",
    /**
     * Libraries an AUTHOR may insert from, as JSON: `[{"name","url"}]`.
     *
     * Distinct from the ensemble's own `libraries`, which are what the file
     * NEEDS to render. These are what the editor OFFERS — a kit shelf. An
     * ensemble that uses none of them still loads unchanged, and one that uses
     * a mesh from one gains the declaration when the piece is inserted.
     */
    libraries: "",
    /** Ensemble JSON to load on connect. */
    src: "",
    /*
      SNAP IS THE EDITOR'S, NOT EACH TOOL'S.

      Insert and the transform tool both used to carry their own `gridSnap`, so
      the same idea had two values that drifted the moment either was touched:
      set 0.25 while nudging, switch to Insert, and pieces landed on a 1m grid.
      A control that quietly disagrees with the one beside it is worse than no
      control. Tool MODES stay per-tool and sticky — that is genuinely per-tool
      — but a snap distance is a property of the workspace.
    */
    // 0.25m, not 1m: a metre is coarser than the things being arranged, so the
    // default fought the author instead of helping.
    gridSnap: 0.25,
    angleSnap: 5,
    /** Sample world to author against — authoring context, never saved. */
    backdrop: "land" as Backdrop,
    /**
     * Metres between the water surface and the backdrop's grid plane.
     *
     * The grid plane used to be SUPPRESSED whenever anything supplied water,
     * because two surfaces at the same level z-fight. But suppressing it threw
     * away the one thing that makes a sea authorable — a floor with a scale on
     * it — so a cove looked like ships floating in a void. Below rather than
     * absent: no coincident surfaces, and the seabed reads as a seabed.
     *
     * Customisable because the right depth is a judgement about the scene: too
     * shallow and the grid shows through the water it is meant to sit under;
     * too deep and it is invisible haze. Zero puts them back in the same plane
     * and brings back the flicker, so the floor is a centimetre.
     */
    seabed: 12,
    /**
     * Hide the piece list and property panel.
     *
     * Inverted on purpose: an HTML boolean attribute is false-by-default
     * (presence = true), so a `chrome: true` default cannot reflect and tosijs
     * refuses it outright rather than letting it silently become false.
     */
    hideChrome: false,
  };

  declare library: string;
  declare libraryUrl: string;
  declare libraries: string;
  declare gridSnap: number;
  declare angleSnap: number;
  declare src: string;
  declare backdrop: Backdrop;
  declare hideChrome: boolean;

  /** The ensemble being edited. Assign to load one from memory. */
  get ensemble(): Ensemble {
    return this._ensemble;
  }
  set ensemble(value: Ensemble) {
    this._ensemble = value;
    this._selected = value.pieces[0]?.id ?? null;
    // A NEW arrangement earns a new view. An edit to the current one does not —
    // see the note in `rebuild`.
    this._needsFraming = true;
    // History does not cross documents: an undo that reached back into the
    // previous ensemble would restore pieces this one has never heard of.
    this._history.clear();
    this.rebuild();
  }
  /*
    THE DOCUMENT LIVES IN A TOSIJS STORE, AND THAT IS NOT BOOKKEEPING.

    tosijs is OBSERVANT, not reactive: the DOM is its own source of truth, there
    is no virtual DOM, and a write queues an rAF update that touches the one
    bound node that changed. Measured here rather than taken on faith — **50
    writes to one path produce 1 notification.** Every mechanism I had written
    by hand (coalescing an undo run by `describe`, deciding when to re-render
    the chrome, deciding what counts as a structural change) is a worse
    reimplementation of something the store does for free and tests heavily.

    ⚠️ A tosijs proxy is NOT transparent to ordinary reads, and assuming it is
    would break everything downstream. Measured: `pieces.find(p => p.id === 'a')`
    returns `{}` because `p.id` is a BOX rather than a string, `p.id === 'a'` is
    false, and `structuredClone` throws `DataCloneError`.

    **This is not a gap somebody forgot to close — it is not closeable in
    JavaScript.** An object wrapper is always truthy, so `new Boolean(false)` is
    truthy, and no proxy can make a boxed `false` behave like `false` in a
    condition. Owner: *"There's no workaround within typescript or javascript
    for ridiculous shit like new Boolean(false) is truthy."* Fixing it means
    fixing the language, which is what `tjs-lang` is for — in a `.tjs` file
    native `==` is a footgun-free `===` that UNWRAPS BOXED PRIMITIVES, so
    `box == "a"` is simply true. We are in `.ts`, so we do not get that.

    The consequence to hold onto here: **never put a box in a condition and
    never compare one with `===`.** `if (box)` is true for a box holding
    `false`, and `piece.enabled === false` — a test this file depends on —
    silently stops being true. So the proxy is used for exactly one thing,
    binding and observing, and `.value` unwraps the plain document that
    `buildEnsemble`, `validate`, `serialise` and the history have always been
    handed.

    Each editor gets its own store key, because `tosi` registers a global path
    namespace and two editors on one page would otherwise share a document.
  */
  /**
   * The tosijs BOX for one feature field, or undefined if there is no piece.
   *
   * Addressed by piece ID, never by array index — `pieces[id=sky].features…`.
   * That is this format's own invariant ("derived ids mean every insertion
   * renumbers the world") and xin's path syntax happens to agree, so a binding
   * keeps pointing at its piece when something is inserted above it. Measured
   * in `tosi-store.test.ts`, not assumed.
   */
  private _box(id: string, feature: string, key: string): unknown {
    if (!this._ensemble.pieces.some((piece) => piece.id === id)) {
      return undefined;
    }
    return (this._store as unknown as Record<string, unknown>)[
      `pieces[id=${id}].features.${feature}.${key}`
    ];
  }

  /**
   * The document as of the last history entry, and its serialisation.
   *
   * The serialisation is the cheap test for "did anything actually change",
   * which is what lets ONE observer serve both mutation paths without
   * double-recording. `edit()` records its own step and calls `_markRecorded`,
   * so by the time its notification arrives the snapshot already matches and
   * the observer does nothing. A write straight through a bound widget leaves
   * the snapshot stale, and the observer picks it up.
   *
   * Stringifying a small JSON document once per frame is nothing next to the
   * scene rebuild it precedes — the same argument that lets `pick` rebuild its
   * index per pick.
   */
  private _snapshot: Ensemble = EMPTY;

  private _snapshotJson = "";

  /** Coalescing key for the run in progress — the PATH being written. */
  private _lastWritePath: string | null = null;

  /** This document is now the baseline; nothing pending for the observer. */
  private _markRecorded(): void {
    this._snapshot = structuredClone(this._ensemble);
    this._snapshotJson = JSON.stringify(this._ensemble);
    this._lastWritePath = null;
  }

  /**
   * A bound widget wrote to the document. Do what `updateFeature` used to.
   *
   * Undo coalesces on the PATH, which is the observant model's actual point:
   * every write carries a stable global address, so "is this the same edit
   * continuing?" is a string comparison rather than a `describe` string I
   * invented and had to keep unique. One drag of one slider is one step.
   *
   * The scene rebuild rides tosijs's batching — notifications arrive on an rAF,
   * so fifty pointer-moves rebuild the scene once per frame instead of fifty
   * times. That is the other half of "applying change too aggressively", and it
   * came free with the store rather than needing a debounce of my own.
   */
  private _onDocumentWrite(path: string): void {
    /*
      ROUND FIRST, and by MUTATING THE RAW DOCUMENT rather than writing a box.

      Writing a box here would notify again, and that second notification looks
      like a fresh edit — a new undo step for a change the author did not make.
      Mutating the plain object under the store sidesteps the cycle entirely,
      and costs nothing that matters: the widget is the one displaying the
      value, it already shows what the pointer is doing, and the document is
      what the rounding is FOR.
    */
    this._roundDocument();

    const json = JSON.stringify(this._ensemble);
    // Nothing new — including every notification raised by `edit()` itself,
    // which has already recorded its own step.
    if (json === this._snapshotJson) return;

    /*
      Coalesce on the PATH, which is the observant model's actual point: every
      write carries a stable global address, so "is this the same edit
      continuing?" is a string comparison rather than a `describe` string I
      invented and had to keep unique. One drag of one slider is one step.
    */
    if (path !== this._lastWritePath) {
      this._history.record(path, this._snapshot);
      this._lastWritePath = path;
    }
    /*
      APPLY, DON'T REBUILD, when the feature knows how.

      A rebuild disposes and re-instantiates every piece, and `place-mesh`
      applies rotation on a RETRY over several frames — so rebuilding once per
      frame means no piece's rotation ever settles. Dragging a sky slider
      straightened every ship in the cove until the drag ended. (Not new: the
      old `updateFeature` rebuilt too. It only became visible once the slider
      survived long enough to produce a sustained drag.)

      The snapshot is still the pre-change document at this point, so it is what
      says WHICH configs moved.
    */
    const applied = this._applyFeatureUpdates(this._snapshot);

    this._snapshot = structuredClone(this._ensemble);
    this._snapshotJson = json;

    /*
      NEVER the chrome. A bound widget is already showing its own value, and
      re-rendering would destroy the one the pointer is holding — which is the
      bug this whole change exists to fix. Panel SHAPE changes do not come
      through here at all: a field other fields are gated on is deliberately
      left unbound, so it travels the explicit `updateFeature` path instead.
    */
    if (!applied) this.rebuild({ chrome: false });
  }

  /**
   * Push changed feature configs into the live scene. True if ALL of them went.
   *
   * False means something changed that no feature could apply — a piece added
   * or removed, a mesh swapped, a feature without an `update` — and the caller
   * falls back to a rebuild. All-or-nothing on purpose: a partial application
   * would leave the scene disagreeing with the document in a way nothing would
   * report.
   */
  private _applyFeatureUpdates(before: Ensemble): boolean {
    const built = this._built;
    if (!built) return false;

    const previous = new Map(
      before.pieces.map((piece) => [piece.id, piece] as const)
    );
    if (previous.size !== this._ensemble.pieces.length) return false;

    for (const piece of this._ensemble.pieces) {
      const was = previous.get(piece.id);
      // A new, renamed or removed piece is structural.
      if (!was) return false;
      // Anything outside `features` — position, mesh, enabled — is not ours.
      if (
        JSON.stringify({ ...piece, features: null }) !==
        JSON.stringify({ ...was, features: null })
      ) {
        return false;
      }
      const names = new Set([
        ...Object.keys(piece.features ?? {}),
        ...Object.keys(was.features ?? {}),
      ]);
      for (const name of names) {
        const now = piece.features?.[name];
        const then = was.features?.[name];
        if (JSON.stringify(now) === JSON.stringify(then)) continue;
        // A feature gained or lost is structural, not a value change.
        if (!now || !then) return false;
        const registration = featureRegistration(name);
        const handle = built.pieces.get(piece.id)?.handles.get(name);
        if (!registration?.update || handle === undefined) return false;
        if (
          !registration.update(
            handle as never,
            now as Record<string, unknown>,
            piece
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Round every feature value in the document, in place.
   *
   * Whole-document rather than "the field the path names", because an observed
   * path is not always a field: tosijs may report the store ROOT for a change
   * underneath it, and a rounder that depended on parsing the path quietly did
   * nothing in exactly that case. Walking a small JSON document is nothing next
   * to the scene rebuild it precedes.
   *
   * Per-field precision survives the change, since the walk knows which feature
   * and key it is on and can ask the schema.
   */
  private _roundDocument(): void {
    for (const piece of this._ensemble.pieces) {
      for (const [feature, config] of Object.entries(piece.features ?? {})) {
        const values = config as Record<string, unknown>;
        if (!values || typeof values !== "object") continue;
        for (const key of Object.keys(values)) {
          const rounded = roundDeep(
            values[key],
            this._precisionFor(feature, key)
          );
          // Assign only on a real change: `roundDeep` rebuilds objects, so an
          // unconditional write would replace equal structures every frame.
          if (JSON.stringify(rounded) !== JSON.stringify(values[key])) {
            values[key] = rounded;
          }
        }
      }
    }
  }

  /** This editor's key in the global tosijs namespace. Declared FIRST. */
  private _storeKey = `ensemble-editor-${++documents}`;

  private _stores = tosi({
    // CLONED. `EMPTY` is a module constant, and handing the same object to two
    // stores would alias two editors' documents together.
    [this._storeKey]: structuredClone(EMPTY),
  }) as unknown as Record<string, TosiStore>;

  private get _store(): TosiStore {
    return this._stores[this._storeKey]!;
  }

  /** The plain document. Boxes are for binding; everything else reads this. */
  private get _ensemble(): Ensemble {
    return this._store.tosi.value;
  }

  /*
    ⚠️ NEVER HOLD A BOXED PROXY. A HELD ONE DISAGREES WITH ITSELF.

    A box carries a PATH and resolves live, so traversing a captured box is
    correct. `.value` is the exception: it returns the target the box was built
    over, permanently, however many times the path is reassigned. One object,
    two answers — and the wrong one is the cheap read everything reaches for.

    Held in a field, `_ensemble` returned an empty document while the bound
    widgets, which traverse, had the real one. Loading looked like a silent
    no-op and the afternoon went to the writer. tosijs#35.

    So `_store` is a GETTER over `_stores[_storeKey]`: every access mints a
    fresh proxy — `store.q === store.q` is false — and nothing is ever held.
    Pinned in `tosi-store.test.ts`.
  */
  private set _ensemble(value: Ensemble) {
    (this._stores as unknown as Record<string, Ensemble>)[this._storeKey] =
      value;
  }

  /**
   * Host owns persistence — the component calls this, it picks no backend.
   *
   * Named `handleSave`, not `onSave`: the elements factory treats `on<Event>`
   * property names as event-handler sugar, so `ensembleEditor({ onSave })`
   * would attach a "save" LISTENER instead of assigning the property, and the
   * component could never read it.
   */
  handleSave: ((ensemble: Ensemble) => void | Promise<void>) | null = null;

  private _built: BuiltEnsemble | null = null;
  private _hub = new PointerHub();
  private _pointer: FlatPointer | null = null;
  /** Node → piece id, rebuilt with the ensemble. A stale one selects nothing. */
  private _index = new Map<unknown, string>();
  private _tool = "select";
  private _toolOptions: Record<string, unknown> = {};
  /** Detaches the document observer. Called on disconnect. */
  private _unobserve: (() => void) | null = null;

  private _stopFrames: (() => void) | null = null;
  private _handles: HandlesView | null = null;
  private _selected: string | null = null;
  private _scene: SceneElement | null = null;
  private _panels: SVGSVGElement[] = [];

  // No declarative content: the scene and the chrome are built imperatively in
  // `connectedCallback`, into whichever root this component actually got.
  override content = null;

  static override shadowStyleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%",
    },
    "tosi-b3d": { display: "block", width: "100%", height: "100%" },
    "svg.ensemble-editor-chrome": {
      position: "absolute",
      pointerEvents: "auto",
    },
  };

  /*
    The component is given a SHADOW ROOT, so `this.querySelector` sees nothing
    and anything appended to `this` never renders. An earlier version mounted
    the scene by looking up a `content` div that way: no error, no scene, a
    white page — the exact silent-failure shape this project's notes warn about.
    Resolve the root once and hold it.
  */
  private get _root(): ParentNode & { append: (...nodes: Node[]) => void } {
    return (this.shadowRoot ?? this) as ParentNode & {
      append: (...nodes: Node[]) => void;
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Scene primitives only. The editor does not assume a domain — a host that
    // wants hit points registers the combat preset itself.
    registerSceneFeatures();
    registerEditorTools();
    this._registerTransformTool();
    /*
      MOUNT OUT OF SOMEBODY ELSE'S RENDER FRAME.

      The doc system creates this element from inside a `requestAnimationFrame`
      render pass:

          connectedCallback  ensemble-editor.ts
          render             doc-system.js:489
          requestAnimationFrame
          queueRender

      so building a Babylon engine here happens *during* another component's
      frame. That is the one difference that has survived every test: an editor
      mounted after the page settles renders correctly every time, while the one
      the doc system mounts during initial load fails most of the time — dark
      sky, white meshes, or no content, all three being materials and programs
      resolving against the wrong thing.

      A macrotask puts the whole mount after that frame completes. It is not a
      delay for its own sake: it is the difference between the two populations
      measured.
    */
    this._deferredMount = setTimeout(() => {
      this._deferredMount = null;
      if (!this.isConnected) return;
      this._mountScene();
      this.setTool(this._tool);
      // Draw the chrome even with nothing loaded. `rebuild` is otherwise the
      // only caller, so an empty editor came up with no panel at all — which
      // reads as a broken tool rather than an empty one.
      this.rebuild();
      if (this.src) void this.load(this.src);
    }, 0);
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
          | {
              pickWithRay: (
                r: unknown,
                p?: (m: unknown) => boolean
              ) => { pickedMesh?: unknown } | null;
            }
          | undefined;
        if (!scene || !this._handles) return null;
        const babylonRay = new Ray(
          new Vector3(ray.origin[0], ray.origin[1], ray.origin[2]),
          new Vector3(ray.direction[0], ray.direction[1], ray.direction[2])
        );
        /*
          TWO PASSES: what you AIMED at, then what you were REACHING for.

          Pass one considers only the handles you can see. A hit there is
          unambiguous — it is the geometry under the pointer. Pass two falls
          back to the fat invisible targets, which exist so a grip can be caught
          without pixel accuracy.

          One pass over both was the bug: the fat targets overlap by design, so
          the nearest SURFACE was regularly a ring's tube passing in front of
          the arrowhead squarely under the cursor.
        */
        const drawn = scene.pickWithRay(
          babylonRay,
          (mesh) => this._handles?.isDrawn(mesh) === true
        );
        const aimed = this._handles.gripOf(drawn?.pickedMesh) as Grip | null;
        if (aimed) return aimed;
        const hit = scene.pickWithRay(
          babylonRay,
          (mesh) => this._handles?.gripOf(mesh) !== null
        );
        return (this._handles.gripOf(hit?.pickedMesh) as Grip | null) ?? null;
      },
      bodyOf: (id) => {
        const built = this._built?.pieces.get(id);
        if (!built) return null;
        return { element: built.element as never, node: built.node };
      },
      /*
        WHERE THE BODY IS, NOT WHERE THE LAST BUILD PUT IT.

        This read `built.at`, which a drag release no longer refreshes: since
        committing a transform stopped rebuilding the scene (to kill the flash),
        `built.at` holds the position from the last STRUCTURAL build. Move a
        piece, then start a rotate: the drag takes the stale origin, and because
        `worldAt` writes `origin + (at - startAt)` every frame — zero for a
        rotate — it puts the piece back where it used to be and turns it there.
        Reported as "the rowboat snaps back to its previous position and rotates
        on that spot".

        `_liveOrigin` reads the body itself and already backs the marker and the
        handles, which is why THEY followed the piece while the drag maths did
        not. One source of truth for "where is it", and this was the last
        caller not using it.
      */
      worldOrigin: () => {
        const built = this.selection
          ? this._built?.pieces.get(this.selection.id)
          : null;
        return built ? this._liveOrigin(built) : [0, 0, 0];
      },
      axisDirection: (axis) => this._pieceAxes()?.[axis] ?? axisVector(axis),
      composeRotation: (start, axis, degrees) =>
        composeLocalRotation(start, axis, degrees),
    });
  }

  /** The active tool's name. */
  get tool(): string {
    return this._tool;
  }

  /**
   * Switch tools.
   *
   * Options are re-derived from the incoming tool's SCHEMA rather than carried
   * over, so a stale `snap` from the last tool cannot quietly apply to this one.
   */
  setTool(name: string): void {
    const previous = getTool(this._tool);
    previous?.deactivate?.(this._toolContext());
    // Remember where this tool was left before moving off it.
    this._toolSettings.set(this._tool, { ...this._toolOptions });
    this._tool = name;
    const tool = getTool(name);
    /*
      TOOLS REMEMBER THEIR SETTINGS.

      Options used to be re-derived from the schema on every switch, so a trip
      to Insert and back reset the transform mode, both snap steps and
      copy-on-drag. That is a tool forgetting what it was doing while you did
      something else, and it makes reaching for another tool feel expensive.

      Defaults still fill any gap, so a tool whose schema GAINS a property picks
      it up rather than being stuck with an old shape.
    */
    const remembered = this._toolSettings.get(name);
    this._toolOptions = {
      ...defaultOptions(tool?.optionsSchema),
      ...(remembered ?? {}),
    };
    tool?.activate?.(this._toolContext());
    this._syncHandles();
    this._hub.setHandlers({
      onStart: (g) => tool?.onGesture?.start?.(g, this._toolContext()),
      onMove: (g) => tool?.onGesture?.move?.(g, this._toolContext()),
      onEnd: (g) => tool?.onGesture?.end?.(g, this._toolContext()),
    });
    this._renderChrome();
  }

  private readonly _toolSettings = new Map<string, Record<string, unknown>>();

  /** Set one option on the current tool. */
  /**
   * What the current tool's options ARE — its own, with the workspace's snaps
   * laid over the top.
   *
   * One accessor because there are two readers and they must agree: the tools,
   * and the panel that draws the controls. The panel was reading
   * `_toolOptions` alone, so once the snaps moved to the element the controls
   * showed a schema default and never reflected a change — "I can't change them
   * any more". The value was being written; nothing was reading it back.
   */
  private _optionValues(): Record<string, unknown> {
    return {
      ...this._toolOptions,
      gridSnap: this.gridSnap,
      angleSnap: this.angleSnap,
    };
  }

  setToolOption(key: string, value: unknown): void {
    // The snaps belong to the workspace; everything else to the current tool.
    if (key === "gridSnap" || key === "angleSnap") {
      this[key] = Number(value);
      this._syncHandles();
      this._renderChrome();
      return;
    }
    this._toolOptions = { ...this._toolOptions, [key]: value };
    this._toolSettings.set(this._tool, { ...this._toolOptions });
    // The mode option changes which handles exist, so they are rebuilt here
    // rather than only when the selection changes.
    this._syncHandles();
    this._renderChrome();
  }

  /**
   * Ray-pick a piece. Exposed so a tool can ask "what is under this hand?"
   * without knowing the engine or how bodies are indexed.
   */
  pick(ray: EditorRay): string | null {
    const scene = (this._scene as unknown as { scene?: unknown }).scene;
    if (!scene) return null;
    /*
      Index at PICK time, not at build time.

      An element's Babylon mesh is created when the element joins the scene, not
      when `buildEnsemble` returns — so an index taken straight after a build is
      empty for every element-backed piece, and picking silently finds nothing.
      Rebuilding per pick is a walk over the pieces; that is cheap next to the
      raycast it precedes.
    */
    this._index = bodyIndex(this._built);
    /*
      Beacons are pickable BODIES for picking purposes, not chrome to skip.
      `pickPiece`'s predicate only accepts meshes that are in this index, so
      adding them here is the whole of making a lamp clickable — and nothing
      else in the editor has to learn what a beacon is.
    */
    for (const [mesh, id] of this._beacons?.index() ?? []) {
      this._index.set(mesh, id);
    }
    return pickPiece(
      scene as never,
      this._index,
      ray,
      (r) =>
        new Ray(
          new Vector3(r.origin[0], r.origin[1], r.origin[2]),
          new Vector3(r.direction[0], r.direction[1], r.direction[2])
        )
    );
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
          ) => {
            hit?: boolean;
            pickedPoint?: { x: number; y: number; z: number } | null;
          } | null;
        }
      | undefined;
    if (!scene) return null;
    const hit = scene.pickWithRay(
      new Ray(
        new Vector3(ray.origin[0], ray.origin[1], ray.origin[2]),
        new Vector3(ray.direction[0], ray.direction[1], ray.direction[2])
      ),
      (mesh) => this._handles?.gripOf(mesh) == null
    );
    const point = hit?.pickedPoint;
    return point ? [point.x, point.y, point.z] : null;
  }

  /*
    THE CAMERA'S TOUCH GESTURES ARE NOT OURS TO TUNE.

    There was a `_configureTouchCamera` here setting Babylon's
    `multiTouchPanAndZoom`, `multiTouchPanning` and `pinchToPanMaxDistance`,
    trying to make two fingers pan and a pinch zoom. It did not work — reported
    from a real device as "two fingered drag (vertical) still scales, nothing
    pans, pinch to zoom is broken" — and the second half of that is the
    important part: it made pinch WORSE.

    Removed rather than tuned further. The camera belongs to tosijs-3d, the
    gesture map in Babylon 9 goes through `camera.movement.input`, and I was
    setting legacy flags on a device I cannot test. Guessing at input mapping
    from a machine with no touchscreen is how you ship a regression that only
    the owner can see. Filed as tosijs-3d#51.
  */

  /**
   * Detach or reattach the camera's own input.
   *
   * Reattaching uses the canvas the scene is actually rendering into rather
   * than a remembered one — the editor can be moved in the DOM, and a camera
   * reattached to a stale canvas stops responding entirely.
   */
  /**
   * Move the view by a world vector, without turning it.
   *
   * An `ArcRotateCamera` orbits a target, so panning IS moving the target —
   * position follows from radius, alpha and beta. Writing `position` instead
   * would be undone on the next frame, which is the same trap as writing a
   * managed mesh's transform.
   */
  panCamera(delta: Vec3): void {
    const scene = (this._scene as unknown as { scene?: SceneWithCamera }).scene;
    const camera = scene?.activeCamera as unknown as {
      target?: { x: number; y: number; z: number };
    } | null;
    if (!camera?.target) return;
    camera.target.x += delta[0];
    camera.target.y += delta[1];
    camera.target.z += delta[2];
  }

  captureCamera(capture: boolean): void {
    /*
      Capturing the camera is also what marks the gesture EXCLUSIVE: a tool only
      captures once it has actually grabbed a handle, which is exactly when a
      stray second contact must not be allowed to cancel the drag.
    */
    if (this._pointer) this._pointer.exclusive = capture;
    const scene = (this._scene as unknown as { scene?: SceneWithCamera }).scene;
    const camera = scene?.activeCamera;
    if (!camera) return;
    if (capture) {
      camera.detachControl?.();
      return;
    }
    const canvas = scene?.getEngine?.()?.getRenderingCanvas?.();
    if (canvas) camera.attachControl?.(canvas, false);
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
        inputs?: {
          attached?: { pointers?: { _pointA?: unknown; _pointB?: unknown } };
        };
      }
    ).inputs?.attached?.pointers;
    if (pointers) {
      pointers._pointA = null;
      pointers._pointB = null;
    }
  }

  private _toolContext(): ToolContext {
    return {
      ensemble: this._ensemble,
      selection: this.selection,
      select: (id) => this.select(id),
      scene: this._scene as SceneElement,
      edit: (describe, mutate, options) => this.edit(describe, mutate, options),
      /*
        The tool's own options, with the workspace's snaps laid over the top.
        Tools keep reading `ctx.options.gridSnap`, so none of them had to learn
        where the value now lives.
      */
      options: this._optionValues(),
      pick: (ray) => this.pick(ray),
      pickPoint: (ray) => this.pickPoint(ray),
      captureCamera: (capture) => this.captureCamera(capture),
      panCamera: (delta) => this.panCamera(delta),
      undo: () => this.undo(),
      redo: () => this.redo(),
      canUndo: () => this.canUndo(),
      canRedo: () => this.canRedo(),
      meshNames: () => [...(this._meshNames() ?? [])],
      meshCatalog: () => this.meshCatalog(),
    } as ToolContext;
  }

  /**
   * THE mutation path. Every edit goes through here.
   *
   * Undo is still a v1 non-goal, but one path is what makes adding it a single
   * change rather than an archaeology exercise across the editor.
   */
  edit(
    describe: string,
    mutate: (ensemble: Ensemble) => void,
    options?: { rebuild?: boolean; chrome?: boolean; coalesce?: boolean }
  ): void {
    /*
      SNAPSHOT BEFORE, not a diff.

      An ensemble is a small JSON document and an edit is coarse — one drag
      release, one typed field, one insert. Cloning the whole thing costs less
      than the rebuild that follows it, and it cannot get out of step with a
      mutation it did not model. Undo was a v1 non-goal on the strength of
      "everything goes through one path, so adding it later is cheap"; this is
      that promise being cashed, and it was one function.
    */
    this._history.record(describe, this._ensemble, options?.coalesce);
    mutate(this._ensemble);
    /*
      MUTATED THE RAW DOCUMENT, so tell the store — bound widgets are watching
      paths, and a mutation they never hear about leaves the panel showing the
      old number. `touch` is the notification; `_markRecorded` is what stops
      that notification being mistaken for a fresh edit by the observer, since
      this function has already recorded its own step.
    */
    this._markRecorded();
    this._store.tosi.touch();

    /*
      A DRAG RELEASE HAS NOTHING TO REBUILD.

      Rebuilding disposes every piece element and instantiates it again, and for
      a transform commit that work is not merely wasted — you can SEE it. The
      piece the drag just placed blinks out and back as its library instance is
      destroyed and re-adopted: "there's a slight flash on release which is a
      bit ugly".

      Nothing structural changed, and the body is ALREADY showing the committed
      value because the drag wrote it there live. So the JSON is updated, the
      chrome and the selection views are refreshed, and the scene is left alone.
      This is what PLAN.md asked for originally — "write the ensemble JSON
      without a full rebuild, since the body already holds the value. Rebuild
      stays for structural changes" — and it went in as an unconditional rebuild
      because one path was simpler than two.

      Structural edits — insert, delete, a feature change — still rebuild, and
      say so by omitting the option.
    */
    if (options?.rebuild === false) {
      this._syncSelection();
      this._syncHandles();
      if (options.chrome !== false) this._renderChrome();
      return;
    }
    this.rebuild({ chrome: options?.chrome });
  }

  private readonly _history = createHistory<Ensemble>(
    (e) => structuredClone(e),
    HISTORY_LIMIT
  );

  canUndo(): boolean {
    return this._history.canUndo();
  }

  canRedo(): boolean {
    return this._history.canRedo();
  }

  /** Step back one edit. */
  undo(): void {
    const step = this._history.undo(this._ensemble);
    if (step) this._restore(step.state);
  }

  /** Step forward again. */
  redo(): void {
    const step = this._history.redo(this._ensemble);
    if (step) this._restore(step.state);
  }

  /**
   * Put a remembered ensemble back.
   *
   * NOT through the `ensemble` setter: that one re-frames the camera and resets
   * the selection, which is right for loading a different arrangement and wrong
   * for stepping back one edit — an author undoing a nudge expects to be
   * looking at the same thing from the same place.
   */
  private _restore(ensemble: Ensemble): void {
    this._ensemble = ensemble;
    // An undo is not an edit. Rebase the baseline so the observer does not
    // record the restoration as a new step you would then have to undo.
    this._markRecorded();
    if (
      this._selected &&
      !ensemble.pieces.some((p) => p.id === this._selected)
    ) {
      // The piece the selection pointed at may not exist in this version.
      this._selected = null;
    }
    this.rebuild();
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
    /*
      WAIT FOR THE ANSWER, NOT FOR A PROMISE.

      This used to grab each library element's `ready` ONCE and rebuild when it
      resolved. Two ways that leaves an editor full of placeholder cubes:

      - `ready` is REPLACED when a library reloads. Measured on a dead load:
        `loadGeneration: 3` — so the promise we awaited belonged to a load two
        generations stale, and the rebuild it triggered ran against a library
        that was empty again.
      - `ready` resolving is not the same as the scene being able to ANSWER.
        `placeMesh` asks `scene.getLibrary(name)`, which stays null until the
        library registers itself; resolve-then-register is a window, and a
        rebuild inside it makes every piece a box.

      Both end identically and silently: 19 `tosi-b3d-box` elements where 19
      `tosi-b3d-destroyable` should be, a library sitting there with all 72
      names loaded, and nothing in the console.

      So poll for the OUTCOME — can the scene name the meshes yet — and rebuild
      once it can. On a TIMER, because a backgrounded tab stops rAF and this has
      to converge whether or not anyone is looking at the page; that is the same
      reason the transform waits in `place-mesh.ts` are timer-driven.
    */
    const scene = this._scene;
    if (!scene) return;
    const wanted = libraryNames(this._ensemble, this.library || undefined);
    if (!wanted.length) return;

    const host = scene as unknown as {
      getLibrary?: (name: string) => { getNames?: () => string[] } | null;
    };
    const answered = () =>
      wanted.every(
        (name) => (host.getLibrary?.(name)?.getNames?.() ?? []).length > 0
      );

    // ~6s: long enough for a cold CDN fetch, short enough that a library which
    // will never load still gets its honest box-shaped failure.
    for (let tick = 0; tick < 40; tick++) {
      if (!this.isConnected) return;
      if (answered()) break;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    if (!this.isConnected) return;
    this.rebuild();
  }

  private _attachPointers(): void {
    const scene = (
      this._scene as unknown as {
        scene?: {
          getEngine?: () => {
            getRenderingCanvas?: () => HTMLCanvasElement | null;
          };
        };
      }
    ).scene;
    const canvas = scene?.getEngine?.()?.getRenderingCanvas?.();
    if (!scene || !canvas) return;
    this._pointer = new FlatPointer(canvas, scene as never);
    this._hub.add(this._pointer);
    this._attachShortcuts();

    /*
      ONE OBSERVER FOR THE WHOLE DOCUMENT, rather than a callback per widget.
      tosijs batches on an rAF and skips writes that change nothing, so this
      fires once per frame during a drag and not at all when a widget rewrites
      the value it already had.
    */
    this._unobserve?.();
    this._unobserve = this._store.tosi.observe((path) =>
      this._onDocumentWrite(String(path))
    );

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
    let running = true;
    const tick = () => {
      if (!running) return;
      this._syncHandleScale();
      this._syncHandlePosition();
      this._syncMarker();
      this._syncBeacons();
      this._hub.update();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    this._stopFrames = () => {
      running = false;
    };
  }

  override disconnectedCallback(): void {
    if (this._deferredMount !== null) {
      clearTimeout(this._deferredMount);
      this._deferredMount = null;
    }
    /*
      A MOVE IS NOT A REMOVAL, AND WE STOPPED PRETENDING IT WAS.

      This used to tear down everything scene-shaped here — the build, the
      handles, the marker, `_sceneReady` — and then dispose the `<tosi-b3d>`
      itself on a deferred task if we were still gone. All of that was standing
      in for a signal we did not have.

      tosijs-3d 0.7.7 gives us the signal. A move now REUSES the engine (its
      teardown is deferred and a reconnect cancels it), so a re-parent costs
      nothing and everything we hold stays valid — tearing it down here would
      throw away a live scene and rebuild it for no reason. A genuine removal
      disposes the engine, and `whenDisposed` tells us so.

      What is left here is what is genuinely OURS and DOM-shaped: the pending
      mount, the pointer, the keyboard shortcuts, the frame loop. Scene-derived
      state is dropped in `_onSceneDisposed`, wired once in `_onSceneReady`.
    */
    this._stopFrames?.();
    this._stopFrames = null;
    // The store outlives a disconnect — it is keyed to this element, not to
    // the DOM — so the observer has to come off or a re-parented editor ends up
    // with two of them rebuilding the scene on every write.
    this._unobserve?.();
    this._unobserve = null;
    this._pointer?.dispose();
    this._pointer = null;
    this._detachShortcuts?.();
    this._detachShortcuts = null;
    super.disconnectedCallback?.();
  }

  /** Fetch and edit an ensemble. */
  async load(url: string): Promise<void> {
    const data = (await (await fetch(url)).json()) as Ensemble;
    // The ensemble declares its own libraries; mount them before building so
    // pieces resolve to real meshes on the first pass rather than boxes.
    if (this._scene) await mountLibraries(data, this._scene);
    this.ensemble = data;
    // Belt and braces: `mountLibraries` waits, but a library mounted by some
    // other path — or one that resolves after this build — still has to land.
    void this._rebuildWhenLibraryReady();
  }

  /** Hand the current ensemble to the host's `onSave`. */
  async save(): Promise<void> {
    await this.handleSave?.(this._ensemble);
  }

  /** Problems with the ensemble as it currently stands. */
  get problems() {
    return validate(
      this._ensemble,
      this._meshNames() ? { meshes: this._meshNames()! } : {}
    );
  }

  /**
   * Every mesh across every mounted library, tagged with its library and family.
   *
   * A palette of 561 undifferentiated names is not a palette, it is a haystack —
   * which is what two Kenney collections turn the flat list into. The category
   * is the leading word of the name, which in these sets is a real taxonomy
   * (`commercial_*`, `car_debris-*`) rather than a hopeful guess.
   */
  /**
   * The author's kit shelf, parsed from the `libraries` attribute.
   *
   * Bad JSON returns nothing rather than throwing: an attribute is typed by
   * hand, and a malformed one should cost you the palette, not the editor.
   */
  private _shelf(): LibraryRef[] {
    if (!this.libraries.trim()) return [];
    try {
      const parsed = JSON.parse(this.libraries) as LibraryRef[];
      return Array.isArray(parsed)
        ? parsed.filter((l) => l && l.name && l.url)
        : [];
    } catch {
      return [];
    }
  }

  /** Every library the palette can offer: the ensemble's, plus the shelf. */
  private _availableLibraries(): string[] {
    const names = libraryNames(this._ensemble, this.library || undefined);
    for (const ref of this._shelf())
      if (!names.includes(ref.name)) names.push(ref.name);
    return names;
  }

  meshCatalog(): CatalogEntry[] {
    if (!this._scene) return [];
    const libraries = this._availableLibraries();
    const out: CatalogEntry[] = [];
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
      const declared = libraryCatalogue(this._scene, library);
      if (declared.length) {
        for (const item of declared) {
          out.push({
            library,
            mesh: item.name,
            category: item.category ?? item.name,
            ...(item.tags ? { tags: item.tags } : {}),
            ...(item.clips ? { clips: item.clips } : {}),
          });
        }
        continue;
      }
      const names = meshesByLibrary(this._scene, [library]).get(library);
      for (const mesh of names ?? []) {
        out.push({ library, mesh, category: mesh.split(/[_-]/)[0] || mesh });
      }
    }
    return out;
  }

  /** Every mesh name reachable, across the ensemble's libraries and any the
   *  page forced via the `library` attribute. */
  private _meshNames(): Set<string> | null {
    if (!this._scene) return null;
    const byLibrary = meshesByLibrary(
      this._scene,
      libraryNames(this._ensemble, this.library || undefined)
    );
    const all = new Set<string>();
    for (const names of byLibrary.values())
      for (const name of names) all.add(name);
    return all.size ? all : null;
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
    const existing = this._root.querySelector?.(
      "tosi-b3d"
    ) as SceneElement | null;
    if (existing) {
      this._scene = existing;
      this._attachPointers();
      this._onSceneReady(existing);
      return;
    }
    const scene = b3d({
      /*
        LOOK UP FROM UNDERNEATH. `<tosi-b3d>` defaults to 5°-70° above the
        horizon, which is right for a game — a player who orbits below the
        ground plane sees the world from inside the floor. An author is not a
        player: checking that a hull sits ON the water rather than through it,
        or that a piece's underside clears the terrain, is a view from slightly
        below, and 5° above cannot give it. Going far under is still useless,
        so this opens a lip rather than the whole hemisphere.
      */
      minElevation: -20,
      /*
        Pointers attach HERE, not in `connectedCallback`.

        `<tosi-b3d>` builds its Babylon scene asynchronously, so at connect
        time there is no scene, no engine and no canvas — an earlier version
        attached there, found nothing, returned quietly, and left the viewport
        unclickable with no error anywhere. "Created" is not "ready".
      */
      sceneCreated: () => {
        this._attachPointers();
        void this._rebuildWhenLibraryReady();
      },
    }) as unknown as SceneElement;
    this._scene = scene;
    this._root.append(scene);
    /*
      THE BACKDROP WAITS FOR A SCENE. "APPENDED" IS NOT "READY".

      This called `_syncBackdrop()` on the very next line, so the sky, ground
      and water elements were built while `<tosi-b3d>` was still constructing
      its scene asynchronously — the same "created is not ready" trap the
      `sceneCreated` note above describes, one line below the note.

      It is not harmless. `b3d-skybox` builds its `SkyMaterial` in `sceneReady`,
      and the one that comes out of this path is always the earliest material in
      the scene — `uniqueId` 11 and 26 on two measured loads, where every
      healthy material is in the hundreds. On the loads that render a dark sky
      it is that early material whose GL program has been deleted:
      `gl.isProgram(program) === false` with `glError` 1282, while every uniform
      on it is correct.

      `whenReady` is tosijs-3d's own answer — "now if it already is, else on
      scene-ready" — so the backdrop is built against a scene that exists.
    */
    this._onSceneReady(scene);
  }

  /**
   * Drop everything that points INTO the scene, because the scene is gone.
   *
   * Not a move — `whenDisposed` fires only on a genuine disposal. Anything held
   * here would otherwise point at a dead scene, and Babylon's failure mode for
   * that is a material that renders black while still reporting `isReady()`:
   * silent, not loud. That is the bug that cost this project a day.
   */
  private _onSceneDisposed(): void {
    this._sceneReady = false;
    this._built?.dispose();
    this._built = null;
    this._preview?.dispose();
    this._preview = null;
    this._beacons?.dispose();
    this._beacons = null;
    this._handles?.dispose();
    this._handles = null;
    this._marker?.dispose();
    this._marker = null;
    this._backdrop.clear();
  }

  private _stopWatchingDisposal: (() => void) | null = null;

  /**
   * Everything that touches the scene, held until there IS one.
   *
   * `whenReady` runs its callback immediately when the scene is already up, so
   * this costs an adopted scene nothing.
   */
  private _onSceneReady(scene: SceneElement): void {
    const host = scene as unknown as { whenReady?: (cb: () => void) => void };
    const go = () => {
      if (!this.isConnected) return;
      this._sceneReady = true;
      /*
        Register ONCE, and keep the unsubscribe. `whenDisposed` is durable
        across rebuilds by design — "subscriptions are durable, scene state is
        not" — so re-registering on every ready would stack duplicates.
      */
      if (!this._stopWatchingDisposal) {
        const watchable = scene as unknown as {
          whenDisposed?: (cb: () => void) => () => void;
        };
        this._stopWatchingDisposal =
          watchable.whenDisposed?.(() => this._onSceneDisposed()) ?? null;
      }
      this._syncBackdrop();
      if (this._rebuildPending) {
        this._rebuildPending = false;
        this.rebuild();
      }
      void this._rebuildWhenLibraryReady();
    };
    if (typeof host.whenReady === "function") host.whenReady(go);
    else go();
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
    if (!this._scene) return;
    /*
      A DISABLED PIECE PROVIDES NOTHING, so it must not suppress the backdrop
      part it would have provided. Switching the sea off left `water` in this
      set, so the ground — which yields to any surface at the same level —
      stayed suppressed too, and the grid did not come back: "when I disabled
      water I didn't see the grid". The doc above already says deleting the
      skybox piece should return the backdrop's sky; disabling it is the same
      claim withdrawn, and the set is where that has to be read.
    */
    const used = new Set(
      this._ensemble.pieces
        .filter((piece) => piece.enabled !== false)
        .flatMap((piece) => Object.keys(piece.features ?? {}))
    );
    const aquatic = this.backdrop === "aquatic";
    const on = this.backdrop !== "none";

    this._backdropPart(
      "light",
      on && !used.has("light") && !used.has("sun"),
      () => b3dLight({ y: 1, intensity: 0.9 })
    );
    this._backdropPart(
      "skybox",
      on && !used.has("skybox"),
      // Still, like the format default: an authoring backdrop that drifts into
      // night while you work is a light meter that will not hold still.
      () => b3dSkybox({ timeOfDay: 11, realtimeScale: 0 }),
      used.has("skybox")
    );
    this._backdropPart("water", on && aquatic && !used.has("water"), () =>
      b3dWater({ waterSize: 4000 })
    );
    /*
      WATER COUNTS AS GROUND. The backdrop's ground is scenery of last resort,
      so it must yield to ANY surface the ensemble lays at the same level — not
      just one called `ground`. A cove that supplies its own sea got the grid
      plane as well, both at y=0, which is the coincident-surface flicker all
      over again in a costume.
    */
    /*
      WATER PUSHES THE FLOOR DOWN; IT NO LONGER REMOVES IT. Ground and terrain
      still suppress it outright — those ARE floors, and a second one under a
      terrain is invisible at best and z-fighting at worst.
    */
    const wet = used.has("water") || (on && aquatic);
    const floor = wet ? this._waterLevel() - Math.max(this.seabed, 0.01) : 0;
    this._backdropPart(
      "ground",
      on && !used.has("ground") && !used.has("terrain"),
      () =>
        b3dGround({
          width: 4000,
          height: 4000,
          y: floor,
          // A neutral grid, not a checker: a checker reads as "missing
          // texture", where a metric grid gives the eye a scale reference
          // while judging an arrangement.
          texture: GRID_TEXTURE,
          textureTiles: 4000 / GRID_METRES,
        }),
      false,
      (element) => {
        (element as unknown as { y: number }).y = floor;
      }
    );
  }

  /**
   * The height the sea sits at — the ensemble's own water piece, or zero.
   *
   * A water FEATURE has no level of its own; the piece carrying it does, and
   * an author who drops the sea to y=-3 to sink a wreck should take the seabed
   * down with it rather than have the grid surface through the water.
   */
  private _waterLevel(): number {
    const piece = this._ensemble.pieces.find(
      (p) => p.enabled !== false && p.features?.water
    );
    return piece?.at?.[1] ?? 0;
  }

  /** Add or remove one backdrop element, idempotently. */
  private _backdropPart(
    name: string,
    wanted: boolean,
    make: () => unknown,
    /*
      Only pass this for a part an ensemble FEATURE adopts through
      `addSingleton` — today that is the skybox alone. Ceding a part nothing
      adopts simply leaks it: ceding `ground` left the grid plane under a cove
      that supplies its own sea, which is the coincident-surface bug the
      `wanted` test exists to prevent, reintroduced from the other side.
    */
    cededToEnsemble = false,
    /** Applied on every sync to a part that already exists. */
    update?: (element: SceneElement) => void
  ): void {
    const existing = this._backdrop.get(name);
    if (wanted && !existing) {
      const element = make() as SceneElement;
      this._scene?.appendChild(element);
      this._backdrop.set(name, element);
      return;
    }
    /*
      AN EXISTING PART STILL HAS TO TRACK ITS INPUTS. `make` runs once, so
      everything it computes freezes at first sight — the seabed depth was
      right on the rebuild that created the ground and never moved again, so
      sinking the sea left the grid surfacing through it. Reconciling means
      reconciling the values too, not just the presence.
    */
    if (wanted && existing) update?.(existing);
    if (!wanted && existing) {
      /*
        HAND IT OVER, DO NOT DESTROY IT.

        There is only one sky, and by the time this runs the ensemble's own
        `skybox` feature has already ADOPTED this very element — `addSingleton`
        discovers it with `querySelector`, so the backdrop's sky and the
        ensemble's sky are the same element by design.

        Removing it here therefore destroyed the element the build had just
        claimed, and the next rebuild made a fresh one. That is the residue that
        survived the first fix: ONE sky element but TWO SkyMaterials, the older
        orphaned, still holding the shared GL program both depended on.
        Measured across the two fixes — five materials, then two, then one.

        So when the ensemble supplies this part, the backdrop stops OWNING it
        rather than deleting it. `reapUnclaimedSingletons` removes it if the
        ensemble later drops the feature; that runs after a build rather than
        during one, so it can tell "nobody wants this" from "this is mid-rebuild".
      */
      if (!cededToEnsemble) existing.remove();
      this._backdrop.delete(name);
    }
  }

  private _backdrop = new Map<string, SceneElement>();

  /**
   * Rebuild the scene from the ensemble.
   *
   * Dispose-then-build, every time, deliberately: the runtime path an author
   * exercises here is the SAME one a game runs at load, so a leak or an
   * ordering bug shows up in the tool before it ships in a level.
   */
  rebuild(options?: { chrome?: boolean }): void {
    if (!this._scene) return;
    if (!this._sceneReady) {
      // Not dropped — deferred. `_onSceneReady` replays it.
      this._rebuildPending = true;
      return;
    }
    // Read the pose BEFORE anything is disposed: comparing it with the pose
    // afterwards is how the rebuild finds out whether the ensemble moved the
    // camera itself.
    const before = this._cameraPose();
    this._built?.dispose();
    this._built = buildEnsemble(this._ensemble, {
      scene: this._scene,
      library: this.library,
      placePiece: placeMesh,
      ...(this._meshNames() ? { meshes: this._meshNames()! } : {}),
    });
    this._buildPreview();
    /*
      Reap AFTER the build, never between dispose and build.

      Dispose releases every singleton's claim; the build immediately re-claims
      what the ensemble still wants. Reaping here removes only what nothing
      asked for — so deleting the `sky` piece removes the sky, while an ordinary
      edit leaves the same sky element standing and simply updates it. Reaping
      before the build would destroy and recreate it, which is the churn that
      deleted the skybox's shader program in the first place.
    */
    reapUnclaimedSingletons(this._scene);
    this._syncBackdrop();
    this._syncSelection();
    this._syncHandles();
    /*
      A TYPED FIELD MUST NOT REDRAW THE PANEL IT IS BEING TYPED INTO.

      `_renderChrome` rebuilds the panels, which destroys the focused input and
      hands focus back to nobody. Through `update` that happens on every
      keystroke: "typing into a field works BUT the field instantly loses
      focus". The panel is already showing the typed value — it is where the
      value came from — so redrawing it is destructive and pointless at once.
    */
    if (options?.chrome !== false) this._renderChrome();

    /*
      THE AUTHOR'S VIEWPOINT SURVIVES AN EDIT. THE FILE'S WINS ON LOAD.

      Every edit rebuilds — that is the design — and a rebuild re-runs every
      feature, including a `camera` one. So an ensemble that declares a view
      snapped the camera back to it at the end of EVERY drag, every typed
      coordinate, every insert. Reported as "still having the zoom jump after I
      finish a touch transform", and it is a different bug from the orbit swing
      fixed before it: that was the camera's stale press point, this is the
      ensemble's own data reasserting itself at the worst possible moment.

      Three cases, and the pose before the build tells them apart:

      - a NEW ensemble that declares a camera → let it win, it is the shot the
        author of that file chose
      - a NEW ensemble that declares none → fit one, or you start off in space
      - an EDIT → put the view back. An author frames the shot they want to work
        in, and the file has no business overruling that while they work.
    */
    if (this._needsFraming) {
      this._needsFraming = false;
      /*
        Ask the DATA, not the camera, whether a view was declared.

        Comparing the pose before and after the build looked like the neat way
        to detect it, and it is wrong: a rebuild can hand back a different
        camera object at its defaults, which reads as a moved camera and
        suppressed the framing. Measured — loading an ensemble with its camera
        piece removed left the view at Babylon's default radius 8 inside a 24 m
        arrangement, which is the "you start off in space" case this branch is
        here to prevent. The feature list cannot be fooled that way.
      */
      if (!this._declares("camera")) this.frame();
    } else if (before && !samePose(before, this._cameraPose())) {
      this._setCameraPose(before);
    }
  }

  /** Whether any piece carries this feature. Same test the backdrop uses. */
  private _declares(feature: string): boolean {
    return this._ensemble.pieces.some(
      (piece) => feature in (piece.features ?? {})
    );
  }

  /*
    "APPENDED" IS NOT "READY", AND BUILDING EARLY LEAVES A DEAD SKY.

    `<tosi-b3d>` constructs its Babylon scene asynchronously. Building into it
    before then does not fail loudly — it produces a scene whose earliest
    objects are subtly wrong. The measurable one: `b3d-skybox` makes its
    `SkyMaterial` in `sceneReady`, and the sky built by an early rebuild is
    always the first material in the scene (`uniqueId` 11 and 26 across loads,
    where healthy materials are in the hundreds). On a dark-sky load it is that
    material whose GL program has been DELETED — `gl.isProgram(program)` false,
    `glError` 1282 — while every uniform on it reads correctly.

    So `rebuild` refuses to run until the scene says it is ready, and remembers
    that it was asked. tosijs-3d's `whenReady` is the signal, and it fires
    immediately if the scene is already up, so an adopted scene is not delayed.
  */
  private _sceneReady = false;
  private _rebuildPending = false;
  /** Pending mount, so a disconnect before it fires does not build into nothing. */
  private _deferredMount: ReturnType<typeof setTimeout> | null = null;

  /** Set when a whole ensemble arrives, cleared by the rebuild that resolves it. */
  private _needsFraming = true;

  private _camera(): ArcCamera | undefined {
    return (this._scene as unknown as { scene?: { activeCamera?: ArcCamera } })
      .scene?.activeCamera;
  }

  private _cameraPose(): CameraPose | null {
    const c = this._camera();
    if (!c || typeof c.alpha !== "number" || !c.target) return null;
    return {
      alpha: c.alpha,
      beta: c.beta,
      radius: c.radius,
      target: [c.target.x, c.target.y, c.target.z],
    };
  }

  private _setCameraPose(pose: CameraPose): void {
    const c = this._camera();
    if (!c?.target) return;
    c.alpha = pose.alpha;
    c.beta = pose.beta;
    c.radius = pose.radius;
    c.target.x = pose.target[0];
    c.target.y = pose.target[1];
    c.target.z = pose.target[2];
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
      | {
          target?: { x: number; y: number; z: number };
          radius?: number;
          beta?: number;
        }
      | undefined;
    if (!camera?.target || !this._built) return;

    const placed = [...this._built.pieces.values()].filter(
      (p) => p.element || p.node
    );
    if (!placed.length) return;

    const axes = [0, 1, 2].map((i) => {
      const values = placed.map((p) => p.at[i] as number);
      return { min: Math.min(...values), max: Math.max(...values) };
    });
    const span = Math.max(...axes.map((a) => a.max - a.min), 1);

    camera.target.x = (axes[0]!.min + axes[0]!.max) / 2;
    camera.target.y = (axes[1]!.min + axes[1]!.max) / 2;
    camera.target.z = (axes[2]!.min + axes[2]!.max) / 2;
    camera.radius = Math.max(span * 2.2, 24);

    /*
      TERRAIN HAS NO POSITION AND ENORMOUS EXTENT, so framing on authored
      positions alone puts the camera INSIDE the ground.

      A terrain piece sits at `[0,0,0]` and contributes nothing to the span, so
      an ensemble that is a landscape plus two props frames as if it were two
      props: radius 24, target at y=0, and the surface — 40m of relief over a
      400m wavelength — closes over the camera. It rendered perfectly and looked
      like a grey void. Owner, on seeing it: "terrains tend to be large by
      default".

      Read from the ENSEMBLE rather than sampled from the mesh: the numbers that
      say how big it is are in the document, the terrain streams tiles around
      the camera so it has no bounds to measure anyway, and a height sample
      would need the element ready — which framing does not wait for.
    */
    const terrain = this._ensemble.pieces.find(
      (piece) => piece.enabled !== false && piece.features?.terrain
    );
    if (terrain) {
      const cfg = terrain.features!.terrain as Record<string, number>;
      /*
        EXTENT IS DECLARED, not guessed from the relief.

        The first version framed off `grossAmplitude` and `grossScale`, which
        describe the SHAPE of the noise, not the size of the world — a gentle
        landscape and a dramatic one of identical extent framed differently, and
        neither on purpose.

        A terrain is a grid: `tileSize` is the finest, `lodLevels` doubles it,
        so the coarsest tile is `tileSize × 2^lodLevels`. `reach` is the radius
        and 0 means "auto from the coarsest tile" — which is upstream's own
        concept, so this reads the number rather than inventing a parallel one.
      */
      const tileSize = Number(cfg.tileSize ?? 10);
      const lodLevels = Number(cfg.lodLevels ?? 5);
      const coarsest = tileSize * 2 ** lodLevels;
      const radius = Number(cfg.reach) || coarsest;
      // Above the ridges, not level with them: `at[1]` is the base height and
      // the relief goes UP from it.
      camera.target.y =
        (terrain.at?.[1] ?? 0) + Number(cfg.grossAmplitude ?? 0);
      // 1.6× the radius puts the whole disc inside a 60° field of view with a
      // margin, rather than cropping its edges.
      camera.radius = Math.max(camera.radius, radius * 1.6);
    }

    camera.beta = 1.15;
  }

  /** The selected piece, if any. */
  get selection(): Piece | null {
    return this._ensemble.pieces.find((p) => p.id === this._selected) ?? null;
  }

  /**
   * Select a piece, or `null` to select nothing.
   *
   * ONE path, including the null case. There used to be a separate
   * `_clearSelection` that set the id and re-rendered the chrome without
   * syncing anything, so clicking empty space left the widget standing: the
   * marker vanished (the per-frame sync hides it), the handles did not, and
   * because the editor still owned them they were visible and inert. Selecting
   * nothing IS selecting; it does not get its own half-implemented path.
   */
  select(id: string | null): void {
    this._selected = id;
    this._syncSelection();
    this._syncHandles();
    this._renderChrome();
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
  /*
    ONE SELECTION SIGNAL, NOT TWO.

    There was a `HighlightLayer` here as well, glowing the selected meshes. It
    is gone, for two reasons that point the same way. It never worked — it was
    handed a `TransformNode`, which the layer rejects, inside a `catch` — and
    when it was finally fixed the glow turned out to be actively unhelpful:
    "kind of off putting and makes it hard to see what's going on". A glow
    recolours the thing you are judging, which is the one thing an arrangement
    editor must not do.

    The box and axes say more (where the origin is, how big the piece is) and
    say it without touching a single pixel of the model.
  */
  private _syncSelection(): void {
    const scene = (this._scene as unknown as { scene?: unknown }).scene;
    if (!scene) return;
    /*
      RECREATE WHEN DEAD, not only when absent.

      A view holds Babylon meshes, and a scene can be torn down and rebuilt
      under it — a library reload, an element reconnecting. The object survives
      and goes on writing to disposed meshes, so selection feedback disappears
      for the rest of the session with nothing in the console. Measured exactly
      that way: marker present, zero of its meshes in the scene.
    */
    if (this._marker && !this._marker.alive()) {
      this._marker.dispose();
      this._marker = null;
    }
    if (!this._marker) this._marker = createSelectionView(scene);
    this._syncMarker();
  }

  /**
   * Put the box and axes on the selection's real bounds.
   *
   * Per frame as well as per rebuild, because a drag moves the BODY without
   * rebuilding — a marker that only followed rebuilds would sit where the piece
   * used to be for the whole gesture, which is worse than not drawing it.
   */
  private _syncMarker(): void {
    const built = this.selection
      ? this._built?.pieces.get(this.selection.id)
      : null;
    if (!this._marker) return;
    if (!built) {
      this._marker.hide();
      return;
    }
    const root = ((built.element as { mesh?: unknown } | null)?.mesh ??
      built.node) as {
      getHierarchyBoundingVectors?: () => { min: XYZ; max: XYZ };
      getAbsolutePosition?: () => XYZ;
      computeWorldMatrix?: (force: boolean) => void;
    } | null;
    root?.computeWorldMatrix?.(true);
    const bounds = root?.getHierarchyBoundingVectors?.();
    const here = this._liveOrigin(built);
    if (!bounds) {
      /*
        No mesh yet — an environment primitive, or a library still loading.
        Mark the authored POINT rather than nothing: an author who selected a
        sun or a fog layer should still see where it claims to be.
      */
      this._marker.show({ centre: here, extents: [0.4, 0.4, 0.4] });
      return;
    }
    const { min, max } = bounds;
    /*
      SIZE from the mesh, POSITION from the live body.

      The bounds are in world space and therefore a frame behind during a drag:
      an element writes `mesh.position` from its own `x`/`y`/`z` on its update
      pass, so the node trails the value a tool has already written. Taking the
      centre straight from the bounds made the box lag the piece it marks.

      So the model's offset from its own origin is measured (a tower's bounds
      are centred above its base, not on it) and re-applied at where the body
      says it is NOW.
    */
    const node = root?.getAbsolutePosition?.();
    const offset: Vec3 = node
      ? [
          (min.x + max.x) / 2 - node.x,
          (min.y + max.y) / 2 - node.y,
          (min.z + max.z) / 2 - node.z,
        ]
      : [0, 0, 0];
    this._marker.show({
      centre: [here[0] + offset[0], here[1] + offset[1], here[2] + offset[2]],
      extents: [(max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2],
    });
  }

  private _marker: SelectionView | null = null;

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
   * `0.105` of the camera distance puts the widget at roughly a fifth of the
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
    if (!this._handles) return;
    const camera = (this._scene as unknown as { scene?: SceneWithCamera }).scene
      ?.activeCamera as
      | { position?: { x: number; y: number; z: number } }
      | undefined;
    const eye = camera?.position;
    const built = this.selection
      ? this._built?.pieces.get(this.selection.id)
      : null;
    if (!eye || !built) return;
    const here = this._liveOrigin(built);
    const distance = Math.hypot(
      eye.x - here[0],
      eye.y - here[1],
      eye.z - here[2]
    );
    // 0.105, down from 0.12: the widget reaches further along each axis now
    // that the rings sit outside the arrows, and this keeps its screen size the
    // same rather than letting the layout change quietly enlarge it.
    this._handles.setScale(Math.max(distance * 0.105, 0.05));
  }

  /**
   * Where the selected piece's body actually IS, right now.
   *
   * `built.at` is where the last BUILD put it, which is a frame behind during a
   * drag — the body is written live and the JSON only catches up on release. A
   * widget reading `built.at` therefore sits still while the piece slides out
   * from under it, reported as "the widget doesn't move with the object".
   */
  private _liveOrigin(built: {
    element?: unknown;
    node?: unknown;
    at: Vec3;
  }): Vec3 {
    const element = built.element as {
      x?: number;
      y?: number;
      z?: number;
    } | null;
    if (
      element &&
      typeof element.x === "number" &&
      typeof element.y === "number" &&
      typeof element.z === "number"
    ) {
      return [element.x, element.y, element.z];
    }
    const node = built.node as { position?: XYZ } | null;
    const at = node?.position;
    return at ? [at.x, at.y, at.z] : built.at;
  }

  /** Keep the widget on the piece while it is being dragged. */
  private _syncHandlePosition(): void {
    if (!this._handles) return;
    const built = this.selection
      ? this._built?.pieces.get(this.selection.id)
      : null;
    if (!built) return;
    this._handles.moveTo(this._liveOrigin(built));
    this._handles.setOrientation(this.selection?.rot ?? null);
  }

  /**
   * The world directions of the selected piece's own axes.
   *
   * Read off the node's world matrix rather than derived from `piece.rot`,
   * because that is the frame `node.scaling` actually acts in — deriving it
   * would mean re-implementing Babylon's euler order and being subtly wrong
   * about it. Null when the piece has no node, in which case world axes are
   * correct anyway.
   */
  private _pieceAxes(): { x: Vec3; y: Vec3; z: Vec3 } | null {
    const built = this.selection
      ? this._built?.pieces.get(this.selection.id)
      : null;
    const node = ((built?.element as { mesh?: unknown } | null)?.mesh ??
      built?.node) as {
      computeWorldMatrix?: (force: boolean) => void;
      getDirection?: (local: Vector3) => { x: number; y: number; z: number };
    } | null;
    if (!node?.getDirection) return null;
    node.computeWorldMatrix?.(true);
    const of = (v: Vector3): Vec3 => {
      const d = node.getDirection!(v);
      const length = Math.hypot(d.x, d.y, d.z) || 1;
      return [d.x / length, d.y / length, d.z / length];
    };
    return {
      x: of(new Vector3(1, 0, 0)),
      y: of(new Vector3(0, 1, 0)),
      z: of(new Vector3(0, 0, 1)),
    };
  }

  private _syncHandles(): void {
    const scene = (this._scene as unknown as { scene?: unknown }).scene;
    if (!scene) return;
    const built = this.selection
      ? this._built?.pieces.get(this.selection.id)
      : null;
    /*
      The widget appears when a piece is selected AND the tool offers at least
      one transform. With all three off — the default — the fused tool is a
      pure selection tool and nothing is drawn over the thing you are pointing
      at, which is the point of defaulting them off.
    */
    const transforms = transformsOf(this._toolOptions);
    const wanted =
      this._tool === "select" && built && !noTransforms(transforms);
    if (!wanted) {
      this._handles?.dispose();
      this._handles = null;
      return;
    }
    // Same guard as the marker: a handle set outlives the scene it was built in.
    if (this._handles && !this._handles.alive()) {
      this._handles.dispose();
      this._handles = null;
    }
    if (!this._handles) this._handles = createHandles(scene);
    this._handles.setTransforms(transforms);
    // Live, for the same reason as `worldOrigin` — a no-rebuild commit
    // leaves `built.at` a move behind.
    this._handles.moveTo(this._liveOrigin(built));
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
    /*
      THROUGH `edit`, not around it.

      This mutated the piece directly and called `rebuild` itself, which was
      invisible until undo existed: typing a coordinate changed the ensemble
      without recording a step, so the property panel was the one edit an author
      could not take back. "Every edit goes through one path" is only true if
      the paths that predate the rule are moved onto it.
    */
    this.edit(
      `update ${id}`,
      (ensemble) => {
        const piece = ensemble.pieces.find((p) => p.id === id);
        if (!piece) return;
        /*
          ROUNDED ON THE WAY IN. A drag with `gridSnap: 0` — a legal setting —
          writes exactly what the ray hit, and the document is the product
          here: something an author reads, a generator emits and a diff shows.
        */
        Object.assign(piece, roundDeep(patch));
      },
      // The scene DOES need rebuilding — a typed coordinate moves the piece —
      // but the panel does not, and redrawing it is what steals the focus.
      { chrome: false }
    );
  }

  /** Saved slot names, for the Load picker. */
  /**
   * Rename a piece, re-pointing everything that referred to it.
   *
   * An id is not a label — it is the only thing anything else can hold onto,
   * so renaming is a graph edit and a rename that only touched the piece would
   * leave dangling references behind that `validate` reports and the author
   * did not ask for.
   *
   * Two reference sites, and BOTH are declared rather than guessed:
   *
   * - `links[].from` / `links[].to`, which the format defines outright
   * - any feature field whose schema says `"x-widget": "ref"`, which is how
   *   `protector.source` says "this string is a piece id". A consumer's
   *   feature gets this for free by marking its own field, which is the same
   *   registry property that gives it an icon and a panel.
   *
   * Deliberately NOT touched: a string that merely happens to equal the old id.
   * Re-pointing by value would rewrite a mesh name or a caption that coincided,
   * and silently — the format says which strings are references and this
   * follows it rather than pattern-matching.
   *
   * Refuses a duplicate rather than merging two pieces into one, and refuses
   * an empty id: `id` is mandatory and every reference in the file depends on
   * it being unique.
   */
  renamePiece(id: string, next: string): boolean {
    const name = next.trim();
    if (!name || name === id) return false;
    if (this._ensemble.pieces.some((p) => p.id === name)) return false;

    const refFields = (piece: Piece): Array<[string, string]> => {
      const out: Array<[string, string]> = [];
      for (const [feature, cfg] of Object.entries(piece.features ?? {})) {
        const props = (
          featureRegistration(feature)?.schema as
            | { properties?: Record<string, { "x-widget"?: string }> }
            | undefined
        )?.properties;
        for (const [key, spec] of Object.entries(props ?? {})) {
          if (spec?.["x-widget"] === "ref") out.push([feature, key]);
        }
      }
      return out;
    };

    /*
      MOVE THE SELECTION FIRST. `edit` re-renders the chrome, and it does that
      while the selection still holds the OLD id — which now matches no piece,
      so the property panel disappears at the exact moment you finish typing
      into it. The selection follows the piece, not the string it was called.
    */
    this._selected = name;
    this.edit(`rename ${id} to ${name}`, (ensemble) => {
      const piece = ensemble.pieces.find((p) => p.id === id);
      if (piece) piece.id = name;
      for (const link of ensemble.links ?? []) {
        if (link.from === id) link.from = name;
        if (link.to === id) link.to = name;
      }
      for (const other of ensemble.pieces) {
        for (const [feature, key] of refFields(other)) {
          const cfg = other.features?.[feature] as Record<string, unknown>;
          if (cfg?.[key] === id) cfg[key] = name;
        }
      }
    });
    this._syncSelection();
    return true;
  }

  /**
   * What a NEW ensemble starts with — the things that shape the world.
   *
   * Not an empty document. An empty one has no sky to change the light with, no
   * sun to move, and no terrain to stand on, so the first thing an author must
   * do is add four pieces before they can look at anything. Owner: *"a minimal
   * new scene should have the stuff that can shape ambient stuff (including
   * terrain) in it. That can always be disabled or deleted"*.
   *
   * ⚠️ Terrain and water arrive DISABLED, and that distinction is the point.
   * Light and sky are how you see; a landscape and a sea are decisions. A new
   * document that imposed a terrain would be a template pretending to be a
   * blank page — and `enabled: false` means the settings are there to turn on
   * with one toggle, having cost nothing in the meantime.
   *
   * It also matters on ADOPTION: a piece carrying `skybox` settings imposes
   * them on whatever scene loads the ensemble, so "present but off" is exactly
   * how you ship an arrangement that has an opinion about the sky without
   * forcing it.
   *
   * Empty configs throughout: every default lives in each feature's schema, and
   * writing them here would put them in the document as though the author had
   * chosen them.
   */
  private static starterPieces(): Piece[] {
    /*
      IDS MATCH THEIR FEATURE NAMES, and that is not cosmetic. The starter used
      to call them `land` and `sea` while Insert names a piece after its feature
      — so a scene could hold `land` (disabled) and `terrain` (just inserted)
      and nothing said they were the same kind of thing. Owner, reasonably:
      "what's the difference between land and terrain?" None: one was a piece
      id I invented, the other is the feature. Now there is one word for it.
    */
    return [
      { id: "sun", at: [-0.5, 1, 0.4], features: { sun: {} } },
      { id: "light", at: [0, 1, 0], features: { light: {} } },
      { id: "skybox", at: [0, 0, 0], features: { skybox: {} } },
      {
        id: "terrain",
        at: [0, 0, 0],
        enabled: false,
        features: { terrain: {} },
      },
      { id: "water", at: [0, 0, 0], enabled: false, features: { water: {} } },
    ];
  }

  /**
   * Start a new ensemble, keeping the libraries.
   *
   * ⚠️ An EDIT, not a document swap. Assigning `ensemble` clears the history —
   * deliberately, since an undo that reached back into a previous document
   * would restore pieces this one never had — so a "New" built that way would
   * throw an afternoon away with no way back. Routed through `edit` it is one
   * undo step like anything else.
   *
   * Libraries survive on purpose: clearing the scene means "start again with
   * this kit", and dropping them would make placing a single box a matter of
   * re-adding a library first. `name` resets, because Download names the file.
   */
  newEnsemble(): void {
    this.edit("new ensemble", (ensemble) => {
      ensemble.name = "untitled";
      ensemble.pieces.length = 0;
      ensemble.pieces.push(...EnsembleEditor.starterPieces());
      delete ensemble.links;
      delete ensemble.points;
      delete ensemble.zones;
      delete ensemble.preview;
    });
    this._selected = null;
    this._syncSelection();
  }

  savedEnsembles(): string[] {
    return typeof localStorage === "undefined" ? [] : savedNames(localStorage);
  }

  /**
   * Rename the ensemble — which is also renaming its save slot and its file.
   *
   * Through `edit` so it is one undo step like everything else, and with
   * `chrome: false` because the field being typed into is IN the chrome:
   * redrawing it would take the focus away mid-word.
   */
  rename(name: string): void {
    if (name === (this._ensemble.name ?? "")) return;
    this.edit(
      `rename ${name}`,
      (ensemble) => {
        ensemble.name = name;
      },
      { rebuild: false, chrome: false }
    );
  }

  /** The name a save uses, for both destinations. */
  private _saveName(): string {
    return this._ensemble.name?.trim() || "untitled";
  }

  /** Keep it in this browser: survives a reload, and nothing else. */
  saveLocal(): void {
    if (typeof localStorage === "undefined") return;
    writeSaved(localStorage, this._saveName(), this._ensemble);
    // The Load picker only exists once there is something to load.
    this._renderChrome();
  }

  /** Keep it properly: `[name].ensemble.json`, which outlives the browser. */
  saveFile(): void {
    download(fileNameFor(this._saveName()), serialise(this._ensemble));
  }

  /** Replace the ensemble from a file the author picks. */
  openFile(): void {
    pickFile((text) => {
      const parsed = parseEnsemble(text);
      if (parsed) this.ensemble = parsed;
    });
  }

  /** Replace the ensemble from a saved browser slot. */
  openSaved(name: string): void {
    if (typeof localStorage === "undefined") return;
    const saved = readSaved(localStorage, name);
    if (saved) this.ensemble = saved;
  }

  /**
   * Write one key of one feature's config, as a single undo step.
   *
   * `describe` comes from the widget when it has one — tosijs-3d passes
   * "move attack split" and the like — and we attach the piece id, which it
   * cannot know and we always can. That is the shape of every other entry in
   * this history: verb, then subject.
   */
  /**
   * Does changing this field change the SHAPE of the panel, not just a value?
   *
   * True only when some other property is gated on it by `x-requires` — the
   * `biome` toggle revealing `biomeSeaLevel` and `biomeLapseRate` is the case
   * that exists. Everything else is a value landing in a widget that is already
   * displaying it.
   */
  private _changesPanelShape(feature: string, key: string): boolean {
    const properties = (
      featureRegistration(feature)?.schema as
        | {
            properties?: Record<
              string,
              { "x-requires"?: Record<string, unknown> }
            >;
          }
        | undefined
    )?.properties;
    return Object.values(properties ?? {}).some(
      (spec) => spec?.["x-requires"] && key in spec["x-requires"]
    );
  }

  updateFeature(
    id: string,
    feature: string,
    key: string,
    value: unknown,
    describe?: string,
    coalesce = false
  ): void {
    /*
      DO NOT RE-RENDER THE PANEL YOU ARE BEING DRAGGED IN.

      Every feature edit used to re-render the whole chrome, which destroys and
      rebuilds the very `slider3d` the pointer is holding — so the drag lost its
      widget on the first pointer-move and "sliders don't work as sliders".

      The deeper point, and the one worth keeping: **re-rendering is not the
      tosijs way.** The model is observant, not reactive — the DOM is terrain
      you lay down once and bind, and a value change touches the bound node
      rather than re-describing the UI. Reaching for a re-render to reflect a
      value is the imported React habit that `practices/observant-model.md`
      names as the single most common mistake in this ecosystem, and it is
      exactly what this was.

      ⚠️ We cannot yet do the RIGHT thing here, only stop doing the wrong one.
      A bound panel needs a way to push a value INTO a live widget, and
      `Widget3d` has none — `slider3d` takes `value` at construction and reports
      out through `onChange`, and only composites like `LightEditorField` expose
      `setValue`. So the panel cannot be bound; it can only be rebuilt. Filed
      upstream. Until then the honest position is: never rebuild it for a value,
      because the widget that raised the change is already showing that value —
      it IS the source during the gesture.

      Structure is the one exception, and `render()` doing structural touch-ups
      is what the practice doc permits. A field revealed by `x-requires` has to
      appear from somewhere, so that ONE case re-renders and continuous drags
      never do.
    */
    /*
      THROUGH THE BOX WHEN THERE IS ONE, so a composite widget gets everything a
      bound one gets: rounding, undo coalesced on the path, and a feature
      `update` instead of a rebuild.

      The lamp is why. Its whole config is one `settings` field edited by
      `lightEditor3d`, which commits on every pointer-move rather than once per
      gesture — so dragging intensity ran a full rebuild per frame, and "the
      rotations of things reset while the drag is active". The composite cannot
      bind (it does not use `boundValue`), but its VALUE still has an address,
      and writing that address puts it on the same path as everything else.
    */
    /*
      ⚠️ NOT for a field the panel's SHAPE depends on.

      The box path is deliberately chrome-free — that is what stops a slider
      being destroyed under the pointer. But `terrain.biome` gates
      `biomeSeaLevel` and `biomeLapseRate` behind `x-requires`, and those have
      to APPEAR, which is a re-render. Taking the shortcut here meant flipping
      the toggle wrote the value, regenerated the terrain, and changed nothing
      an author could see: "clicking biome doesn't seem to do anything."

      So a gating field falls through to `edit`, which re-renders. It is one
      toggle, not a drag, so there is no widget to destroy.
    */
    const box = this._changesPanelShape(feature, key)
      ? undefined
      : (this._box(id, feature, key) as { value: unknown } | undefined);
    if (box) {
      box.value = value;
      return;
    }

    this.edit(
      `${describe ?? `edit ${feature}.${key}`} ${id}`,
      (ensemble) => {
        const piece = ensemble.pieces.find((p) => p.id === id);
        if (!piece?.features) return;
        const config = (piece.features[feature] ?? {}) as Record<
          string,
          unknown
        >;
        /*
          DEEP, because a composite widget hands back a whole object: a light's
          settings carry an intensity, a hue and a four-curve program, and
          every number in there came from a drag too.
        */
        piece.features[feature] = {
          ...config,
          [key]: roundDeep(value, this._precisionFor(feature, key)),
        };
      },
      { coalesce, chrome: this._changesPanelShape(feature, key) }
    );
  }

  /**
   * Decimal places for one field — `x-precision`, or three.
   *
   * Per FIELD rather than per feature, because the fields differ: a time of day
   * wants millimetre-equivalent precision and a lapse rate spanning `0..0.05`
   * would be destroyed by it. `roundNumber` protects the small case on its own,
   * but a field that genuinely needs five decimals should be able to say so
   * rather than rely on the fallback.
   */
  private _precisionFor(feature: string, key: string): number {
    const spec = (
      featureRegistration(feature)?.schema as
        | { properties?: Record<string, { "x-precision"?: number }> }
        | undefined
    )?.properties?.[key];
    return typeof spec?.["x-precision"] === "number"
      ? spec["x-precision"]
      : DEFAULT_PRECISION;
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
    for (const panel of this._panels) panel.remove();
    this._panels = [];
    this._stackTop = { left: 8, right: 8 };
    if (this.hideChrome) return;

    this._renderPalette();
    this._renderToolOptions();
    /*
      THE SCENE GRAPH AND THE LIBRARY ARE THE SAME SLOT.

      Both are long scrolling lists on the left, and only one of them is ever
      the thing you are reaching for: selecting works on what is in the scene,
      inserting works on what is not. Showing both halved each one's height and
      made the panel a scroll hunt.

      So the tool decides. Insert shows the library; everything else shows the
      scene graph.
    */
    this._renderFilePanel();
    if (this._tool === "insert") this._renderLibraryPalette();
    else this._renderPieceList();
    this._renderProperties();
  }

  private _renderPalette(): void {
    const tools = registeredTools();
    const commands = registeredCommands();
    const ctx = this._toolContext();
    /*
      TWO GRIDS, because they are two kinds of thing.

      A tool is MODAL — picking it changes what a gesture means, and exactly one
      is current, which is `radio`. A command runs once and returns you to what
      you were doing, which is `buttons`: it fires and nothing stays lit. They
      were one stack of identical buttons before, so nothing on screen said
      which of them would still be true a second later.

      Icons rather than words: four cells fit where four labelled rows did not,
      and a palette is the one place where recognition beats reading.
    */
    const current = Math.max(
      0,
      tools.findIndex((tool) => tool.name === this._tool)
    );
    this._addPanel(
      "left",
      panel3d(
        { width: PANEL_WIDTH, padding: 8, gap: 6 },
        label3d({ text: "Tools", bold: true }),
        iconGrid3d({
          mode: "radio",
          selected: current,
          // TWO columns, not four. A caption forces a narrow column, and at
          // four "Delete" and "Duplicate" ran into each other — a label that
          // collides with its neighbour is worse than no label, because it
          // reads as a different word.
          columns: 2,
          items: tools.map((tool) => ({
            icon: tool.icon ?? "square",
            label: tool.label,
          })),
          handleSelect: ([index]) => {
            const picked = tools[index ?? 0];
            if (picked) this.setTool(picked.name);
          },
        }) as never,
        iconGrid3d({
          mode: "buttons",
          columns: 2,
          items: commands.map((command) => ({
            icon: command.icon ?? "square",
            label: command.label,
            // A command that cannot run says so by being greyed, rather than by
            // running and doing nothing.
            disabled: command.enabled?.(ctx) === false,
          })),
          handleActivate: (index) => {
            const command = commands[index];
            if (!command || command.enabled?.(this._toolContext()) === false)
              return;
            command.run(this._toolContext());
          },
        }) as never
      )
    );
  }

  private _renderToolOptions(): void {
    const tool = getTool(this._tool);
    if (!tool?.optionsSchema) return;
    const widgets = schemaWidgets({
      schema: tool.optionsSchema,
      values: this._optionValues(),
      onChange: (key, value) => this.setToolOption(key, value),
      /*
        A tool option is not a document edit, so there is nothing to record —
        but the split still matters: a widget with a drag reports live AND on
        release, and without an `onCommit` here it would write the option fifty
        times per gesture, re-rendering the chrome each time.
      */
      onCommit: (key, value) => this.setToolOption(key, value),
    });
    this._addPanel(
      "right",
      panel3d(
        { width: PANEL_WIDTH, padding: 10, gap: 6 },
        label3d({ text: tool.label, bold: true }),
        ...(widgets as never[])
      )
    );
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
  /**
   * Load the author's shelf, once, the first time it is actually wanted.
   *
   * It used to mount at scene-ready, alongside the ensemble's own build — which
   * is megabytes of kits nobody asked for on a page someone may only be
   * looking at, AND new contention in exactly the window that produces a night
   * sky or blank materials. The shelf is only reachable through the Insert
   * palette, so that is when it loads.
   */
  private _mountShelf(): void {
    if (this._shelfMounted || !this._scene) return;
    const shelf = this._shelf();
    if (!shelf.length) return;
    this._shelfMounted = true;
    void mountLibraries({ ...this._ensemble, libraries: shelf }, this._scene)
      .then(() => {
        if (this.isConnected) this._renderChrome();
      })
      .catch(() => undefined);
  }

  private _shelfMounted = false;

  /** The name of the pseudo-library holding environment primitives. */
  private static readonly UTILITIES = "utilities";

  /**
   * The features an author can INSERT — sun, sky, terrain, water, a lamp.
   *
   * Read off the registry (`primitive: true`), so a consumer's own standalone
   * feature appears here without the editor knowing it exists. That is the same
   * property that gives it an icon and a panel, and it is the whole reason the
   * palette does not hold a list of names.
   */
  private _utilities(): Array<{ name: string; icon: string }> {
    return registeredFeatures()
      .filter((feature) => feature.primitive)
      .map((feature) => ({ name: feature.name, icon: feature.icon ?? "▪️" }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _renderLibraryPalette(): void {
    this._mountShelf();
    const catalog = this.meshCatalog();
    const utilities = this._utilities();
    // The utilities are always there, so the palette is worth drawing even
    // before a single kit has loaded — which is also the state a NEW ensemble
    // starts in, and the state in which "add a terrain" was impossible.
    if (!catalog.length && !utilities.length) return;

    /*
      TWO PICKERS, NOT ONE COMPOUND ONE.

      The family list used to read `library · category`, which meant choosing a
      library and choosing a category were the same control — so a shelf of
      several kits turned into one long list where the kit was a prefix you had
      to read. Library first, then family within it, is how a kit is actually
      navigated.
    */
    const libraries = [
      ...new Set(catalog.map((entry) => entry.library)),
    ].sort();
    /*
      UTILITIES FIRST, and as a library rather than a fourth panel. An author
      choosing what to place is doing one thing, and splitting it by whether the
      thing happens to have a mesh is our implementation showing through.
    */
    if (utilities.length) libraries.unshift(EnsembleEditor.UTILITIES);
    /*
      DEFAULT TO THE ENSEMBLE'S OWN KIT, not to whichever sorts first.

      With a shelf mounted, `libraries[0]` was "commercial" — alphabetical, and
      nothing to do with the file being edited. The kit an ensemble DECLARES is
      where its pieces come from and the one an author reaches for first.
    */
    const own = (this._ensemble.libraries ?? [])[0]?.name;
    const currentLibrary =
      (this._toolOptions.library as string) ??
      (own && libraries.includes(own) ? own : libraries[0]!);
    if (currentLibrary === EnsembleEditor.UTILITIES) {
      this._addPanel(
        "left",
        panel3d(
          { width: PANEL_WIDTH, maxHeight: 320, padding: 8, gap: 4 },
          label3d({ text: `Library (${utilities.length})`, bold: true }),
          label3d({ text: "library", muted: true, compact: true }),
          select3d({
            label: "",
            value: currentLibrary,
            options: libraries,
            onChange: (value: string | number) => {
              this.setToolOption("library", String(value));
              this.setToolOption("family", undefined);
            },
          }),
          list3d<{ label: string; name: string }>({
            items: utilities.map((utility) => ({
              label: `${utility.icon} ${utility.name}`,
              name: utility.name,
            })),
            onSelect: (item) => {
              if (this._tool !== "insert") this.setTool("insert");
              /*
                Whichever of the two is set is what gets placed, so choosing a
                utility must CLEAR the mesh — otherwise the last mesh you looked
                at is still armed and the click places that instead.
              */
              this.setToolOption("mesh", undefined);
              this.setToolOption("feature", item.name);
            },
          })
        )
      );
      return;
    }

    const inLibrary = catalog.filter(
      (entry) => entry.library === currentLibrary
    );
    const families = [
      ...new Set(inLibrary.map((entry) => entry.category)),
    ].sort();
    const current = (this._toolOptions.family as string) ?? families[0]!;
    const items = inLibrary.filter((entry) => entry.category === current);
    const chosen =
      this._tool === "insert" ? (this._toolOptions.mesh as string) : null;

    this._addPanel(
      "left",
      panel3d(
        // A LIST is the one case for a bound: it is arbitrarily long, and
        // `maxHeight` scrolls past it instead of growing off the screen.
        { width: PANEL_WIDTH, maxHeight: 320, padding: 8, gap: 4 },
        label3d({ text: `Library (${inLibrary.length})`, bold: true }),
        // Only when there IS a choice: one library and this is a control that
        // can only tell you what you already know.
        ...(libraries.length > 1
          ? [
              /*
                CAPTIONED, because two bare steppers stacked do not say which is
                which. The owner had this picker on screen and asked for the
                ability to pick a library — which is what an unlabelled control
                costs you: it may as well not be there.
              */
              label3d({ text: "library", muted: true, compact: true }),
              select3d({
                label: "",
                value: currentLibrary,
                options: libraries,
                onChange: (value: string | number) => {
                  this.setToolOption("library", String(value));
                  // The old family belongs to the old library.
                  this.setToolOption("family", undefined);
                },
              }),
            ]
          : []),
        label3d({ text: "family", muted: true, compact: true }),
        select3d({
          label: "",
          value: current,
          options: families,
          onChange: (value: string | number) => {
            this.setToolOption("family", String(value));
          },
        }),
        label3d({
          text: `${items.length} in family`,
          muted: true,
          compact: true,
        }),
        list3d<{ label: string; entry: CatalogEntry }>({
          items: items.map((entry) => ({
            // Drop the family prefix: every row in the list repeats it, which
            // costs the width that would otherwise show what differs.
            label:
              (entry.mesh.slice(entry.category.length).replace(/^[_-]/, "") ||
                entry.mesh) ===
              chosen?.slice(entry.category.length).replace(/^[_-]/, "")
                ? `▸ ${entry.mesh}`
                : entry.mesh
                    .slice(entry.category.length)
                    .replace(/^[_-]/, "") || entry.mesh,
            entry,
          })),
          onSelect: (item) => {
            if (this._tool !== "insert") this.setTool("insert");
            this.setToolOption("feature", undefined);
            this.setToolOption("mesh", item.entry.mesh);
            this.setToolOption("library", item.entry.library);
          },
        })
      )
    );
  }

  /*
    THE FILE PANEL IS SEPARATE FROM THE SCENE GRAPH.

    These lived in the piece-list panel and ate it: the list is bounded by
    `maxHeight`, so four controls above it left one row of pieces visible on a
    24-piece ensemble. They are also a different KIND of thing — the ensemble as
    a document, rather than what is in it — and the name belongs with them
    because it is the save slot and the filename, not a caption for the list.
  */
  private _renderFilePanel(): void {
    this._addPanel(
      "left",
      panel3d(
        { width: PANEL_WIDTH, padding: 8, gap: 4 },
        ui.inputField({
          value: this._ensemble.name ?? "",
          placeholder: "untitled",
          onChange: (value: string) => this.rename(value),
        }) as never,
        /*
          TWO BUTTONS, UNTIL THERE ARE MENUS.

          Saving to a browser slot and opening one both work — `saveLocal`,
          `openSaved` and `savedEnsembles` are here and tested — but each needs
          a LIST, and the only list control available is `select3d`, which is a
          stepper first and a menu second: "the save button only saves to file
          AFAICT, it doesn't show more than one option". Four half-working
          controls are worse than two that do exactly what they say.

          When an icon grid can open a menu (tosijs-3d#59) these become two
          icons with a menu apiece, and the slots come back.
        */
        button3d({ label: "New", onClick: () => this.newEnsemble() }),
        button3d({ label: "Download", onClick: () => this.saveFile() }),
        button3d({ label: "Open file…", onClick: () => this.openFile() })
      )
    );
  }

  private _renderPieceList(): void {
    const problems = this.problems;
    const errors = problems.filter((p) => p.severity === "error").length;
    this._addPanel(
      "left",
      panel3d(
        { width: PANEL_WIDTH, maxHeight: 340, padding: 8, gap: 4 },
        /*
          ENVIRONMENT AND CONTENT ARE DIFFERENT KINDS OF THING.

          The format already draws this line — a piece with no `mesh` is an
          "environment primitive", one whose FEATURES are its body: the sky, the
          sea, the sun, the view. They configure the world rather than adding to
          it, and several of them exist mainly so the thing being authored has
          somewhere to be.

          Mixed into one list they read as peers of a barrel, so `sea` and
          `flagship` looked like the same sort of entry. Two groups, and each
          says which it is.

          A disabled piece is struck through rather than hidden: it is still in
          the document and still selectable, which is the whole point of
          disabling instead of deleting.
        */
        ...(this._pieceGroups() as never[])
      )
    );
  }

  /**
   * Build the author's scenery — `ensemble.preview` — faded and unpickable.
   *
   * A SECOND `buildEnsemble` over a different piece list, not a flag threaded
   * through the first, which is what keeps the safety property: the runtime
   * call only ever sees `pieces`, so nothing here can reach a consumer.
   */
  private _buildPreview(): void {
    this._preview?.dispose();
    this._preview = null;
    const pieces = this._ensemble.preview?.pieces ?? [];
    if (!pieces.length || !this._scene) return;
    this._preview = buildEnsemble(
      { ...this._ensemble, pieces, preview: undefined },
      {
        scene: this._scene,
        library: this.library,
        placePiece: placeMesh,
        ...(this._meshNames() ? { meshes: this._meshNames()! } : {}),
      }
    );
    this._fadePreview();
  }

  /**
   * Make the scenery read as scenery: faded, and never in the way.
   *
   * ⚠️ `mesh.visibility`, NOT `material.alpha`. Library materials are SHARED
   * between instances, so tinting one would fade the real pieces that happen to
   * use the same mesh — the context terrain and the terrain you are authoring
   * would dim together, which is the opposite of the point.
   *
   * Unpickable too: scenery you can click is scenery you select by accident
   * while reaching for the thing behind it. It stays reachable from the piece
   * list, which is where you go when you mean it.
   *
   * Deferred, because a library instance does not exist when its element is
   * appended — the same reason `place-mesh` waits before writing a transform.
   */
  private _fadePreview(): void {
    const apply = () => {
      for (const built of this._preview?.pieces.values() ?? []) {
        const root = ((built.element as { mesh?: unknown } | null)?.mesh ??
          built.node) as {
          getChildMeshes?: (d?: boolean) => Array<Record<string, unknown>>;
        } | null;
        if (!root?.getChildMeshes) continue;
        for (const mesh of [
          root as unknown as Record<string, unknown>,
          ...root.getChildMeshes(false),
        ]) {
          if (typeof mesh.visibility === "number") mesh.visibility = 0.3;
          mesh.isPickable = false;
        }
      }
    };
    apply();
    // Instances arrive late; a single pass would fade only what was ready.
    for (const delay of [120, 400, 1200]) setTimeout(apply, delay);
  }

  private _preview: BuiltEnsemble | null = null;

  private _beacons: BeaconView | null = null;

  /**
   * A collision cube for every piece whose body cannot be clicked.
   *
   * Which pieces those are is DECLARED — `marker: true` on the feature
   * registration — not inferred from "this piece has no geometry". See
   * `FeatureRegistration.marker`: inferring it puts a dot at the sun's
   * direction vector and two more at the origin.
   *
   * Positions come from `_liveOrigin`, so a beacon tracks a drag rather than
   * waiting for the rebuild that a transform deliberately skips.
   */
  private _syncBeacons(): void {
    const scene = (this._scene as unknown as { scene?: unknown })?.scene;
    if (!scene) return;
    const wanted: Beacon[] = [];
    for (const piece of this._ensemble.pieces) {
      if (piece.enabled === false) continue;
      const marked = Object.keys(piece.features ?? {}).some(
        (name) => featureRegistration(name)?.marker
      );
      if (!marked) continue;
      const built = this._built?.pieces.get(piece.id);
      wanted.push({
        id: piece.id,
        at: built ? this._liveOrigin(built) : piece.at ?? [0, 0, 0],
      });
    }
    if (!wanted.length && !this._beacons) return;
    // A scene can be disposed out from under a view; rebuild rather than write
    // to dead meshes forever after. Same hazard as `SelectionView.alive`.
    if (this._beacons && !this._beacons.alive()) {
      this._beacons.dispose();
      this._beacons = null;
    }
    this._beacons ??= createBeaconView(scene);
    this._beacons.sync(wanted);
  }

  /** The piece list, split into environment primitives and placed content. */
  /**
   * The glyph for a row: what KIND of thing this piece is.
   *
   * Read off the feature REGISTRATION, never a switch here — the property that
   * makes features a registry is that a consumer's feature is indistinguishable
   * from a built-in, and a switch in the editor breaks it exactly where a
   * consumer would notice. It also keeps the combat preset's icons out of a
   * scene-only bundle for free: this reads a map, it does not import anything.
   *
   * A mesh wins over any feature, because a piece with a mesh IS that mesh and
   * its features decorate it. Otherwise the first feature with an icon, with
   * `body` features asked first — a lamp that is also destroyable is a lamp,
   * not an explosion.
   */
  private _kindIcon(piece: Piece): string {
    if (piece.mesh) return "📦";
    const names = Object.keys(piece.features ?? {});
    const registrations = names
      .map((name) => featureRegistration(name))
      .filter((r): r is NonNullable<typeof r> => !!r);
    const chosen =
      registrations.find((r) => r.body && r.icon) ??
      registrations.find((r) => r.icon);
    // A piece whose features are all unregistered still gets a row, and a
    // row with no glyph would sit half a character left of every other one.
    return chosen?.icon ?? "▪️";
  }

  private _pieceGroups(): unknown[] {
    /*
      KIND AND STATE ARE DIFFERENT THINGS, so they do not share a glyph. A
      disabled lamp is still a lamp: the icon says which, and the state is a
      word after the name. The first version replaced the whole label with
      `◌ id`, which threw the kind away to say something about the state.

      When the icon column lands (tosijs-3d#64) these become two columns and
      the string-building here goes away.
    */
    const label = (p: Piece) =>
      `${this._kindIcon(p)} ${p.id}${p.enabled === false ? " · off" : ""}`;
    const environment = this._ensemble.pieces.filter((p) => !p.mesh);
    const content = this._ensemble.pieces.filter((p) => p.mesh);
    const out: unknown[] = [];
    for (const [title, group] of [
      ["environment", environment],
      ["pieces", content],
    ] as Array<[string, Piece[]]>) {
      if (!group.length) continue;
      out.push(label3d({ text: title, muted: true, compact: true }));
      out.push(
        list3d<{ label: string; id: string }>({
          items: group.map((p) => ({ label: label(p), id: p.id })),
          onSelect: (item) => this.select(item.id),
        })
      );
    }
    return out;
  }

  private _renderProperties(): void {
    const selected = this.selection;
    if (!selected) return;
    /*
      ONE ROW PER VECTOR, not three stacked fields.

      This was a hand-rolled `numberField` stacked three deep with a label above
      each, because the SVG UI had no vector control and no numeric field you
      could type into. It worked and it was three times taller than it needed to
      be, which is most of why a property panel ran out of room.

      `vector3d`/`euler3d` shipped in tosijs-3d 0.7.4 and replace the lot:
      drag to scrub, click to type, three tab stops on one row. `euler3d` is not
      a styling variant — it WRAPS where `vector3d` clamps, which is right for
      an angle and wrong for a coordinate, and getting that from the widget
      rather than from our own arithmetic is the point of adopting it.

      Rotation is still normalised to 0..360 on write; the widget's own
      (-180, 180] is its scrubbing range, not what lands in the file.
    */
    const inputs: Array<{ fields: unknown[] }> = [];
    const position = vector3d({
      value: {
        x: selected.at[0] ?? 0,
        y: selected.at[1] ?? 0,
        z: selected.at[2] ?? 0,
      },
      step: 0.25,
      scrub: 0.02,
      onChange: (v) => this.update(selected.id, { at: [v.x, v.y, v.z] }),
    });
    inputs.push(position as unknown as { fields: unknown[] });
    const fields: unknown[] = [
      /*
        Off, not gone. Deleting says "this was a mistake"; disabling says "not
        right now" — drop the sea to look at the seabed, mute a lamp to judge
        the sky. It is authored state and lives in the file, because that
        survives a reload and belongs to the document.
      */
      toggle3d({
        label: "enabled",
        value: selected.enabled !== false,
        onChange: (on: boolean) =>
          this.update(selected.id, { enabled: on ? undefined : false }),
      }) as never,
      label3d({ text: "position", muted: true, compact: true }),
      position,
    ];
    if (selected.mesh) {
      const rot = selected.rot ?? [0, 0, 0];
      const rotation = euler3d({
        value: { x: rot[0], y: rot[1], z: rot[2] },
        step: 5,
        scrub: 0.5,
        onChange: (v) =>
          this.update(selected.id, {
            rot: [v.x, v.y, v.z].map(normaliseDegrees) as Euler,
          }),
      });
      inputs.push(rotation as unknown as { fields: unknown[] });
      fields.push(
        label3d({ text: "rotation", muted: true, compact: true }),
        rotation
      );

      /*
        SCALE, SHOWN AS THREE, WRITTEN AS WHAT THE AUTHOR MEANT.

        `scale` is `number | Vec3` and BOTH spellings are canonical — a number
        is not sugar the loader rewrites, it is what a file says when the scale
        genuinely IS uniform. So the panel reads through `scaleVector` (three
        numbers, whichever way it was written) and writes through
        `narrowScale`, which puts a uniform scale back as the single number the
        author typed rather than silently converting their file to `[2, 2, 2]`.

        A `vector3d` rather than one field, because non-uniform scale is a
        thing you can author here; the narrowing is what keeps the common case
        from looking like a triple.
      */
      const s3 = scaleVector(selected.scale);
      const scale = vector3d({
        value: { x: s3[0], y: s3[1], z: s3[2] },
        step: 0.25,
        scrub: 0.01,
        // A scale of zero collapses the mesh and cannot be scrubbed back out
        // of, since every later factor multiplies it.
        min: 0.01,
        onChange: (v) =>
          this.update(selected.id, {
            scale: narrowScale([v.x, v.y, v.z]),
          }),
      });
      inputs.push(scale as unknown as { fields: unknown[] });
      fields.push(
        label3d({ text: "scale", muted: true, compact: true }),
        scale
      );
    }
    /*
      A PANEL PER FEATURE, which the editor has never had.

      A piece's features were editable only by hand in the JSON: the property
      panel showed position, rotation and scale and nothing else, so a `turret`
      or a `lamp` was invisible in the tool that exists to author them.

      Each feature already declares a JSON Schema — that is what `registerFeature`
      takes — so the generated panel needs no per-feature code. It is also what
      makes tosijs-3d's lamp editor arrive for free: `lightSettingsSchema()`
      marks one field, and `schemaWidgets` hands the whole lamp to it.

      Commits, not live changes: a feature edit rebuilds the scene, so writing on
      every pointer-move of a curve would rebuild it fifty times per drag.
    */
    for (const [name, config] of Object.entries(selected.features ?? {})) {
      const registration = featureRegistration(name);
      if (!registration?.schema) continue;
      const widgets = schemaWidgets({
        schema: registration.schema,
        values: (config ?? {}) as Record<string, unknown>,
        /*
          BOUND, so the widget reads and writes the document itself and tosijs
          keeps it current. Nothing here re-renders to show a number.
        */
        box: (key) =>
          /*
            A field OTHER FIELDS ARE GATED ON stays unbound on purpose.

            Flipping `terrain.biome` has to make `biomeSeaLevel` and
            `biomeLapseRate` appear, and appearing is a structural change — the
            one thing the practice doc says a render pass is for. Leaving that
            one field on the explicit `updateFeature` path keeps the re-render
            where it belongs and keeps it out of the observer, which must never
            touch the panel because a bound widget may be mid-drag.

            Everything else binds, which is everything you can drag.
          */
          this._changesPanelShape(name, key)
            ? undefined
            : this._box(selected.id, name, key),
        /*
          BOTH channels write, and they differ only in undo granularity.

          An ordinary control — a slider, a toggle — has no gesture end to wait
          for: `slider3d` exposes `onChange` alone. Leaving this a no-op is why
          the skybox panel appeared and did nothing. So it writes, and coalesces
          into one undo step for as long as the same field keeps reporting.

          A composite widget DOES know when its gesture ended and says so
          through `onCommit`, which takes its own step.
        */
        /*
          ONLY FOR WHAT IS NOT BOUND. A bound widget has ALREADY written the
          value through its box by the time this fires — writing it again would
          be a second, redundant trip through `edit`, recording a history step
          for a change the observer is about to record properly.

          What is left: the icon-grid cell selector, which has no single field
          to address, and anything a schema describes that the bound branches do
          not cover.
        */
        onChange: (key, value) => {
          const bound =
            !this._changesPanelShape(name, key) &&
            this._box(selected.id, name, key);
          if (bound) return;
          this.updateFeature(selected.id, name, key, value, undefined, true);
        },
        /*
          Composite widgets — the light editor, a curve — hand back a WHOLE
          object at the end of a gesture and do not use `boundValue`, so they
          still commit through here.
        */
        onCommit: (key, value, describe) =>
          this.updateFeature(selected.id, name, key, value, describe),
      });
      if (!widgets.length) continue;
      fields.push(
        label3d({ text: name, muted: true, compact: true }),
        ...(widgets as never[])
      );
    }

    /*
      ONE GROUP OWNS THE KEYBOARD.

      `fieldGroup` does the three chores that always travel together and that
      this file used to do by hand: exclusivity (two lit fields both claiming
      the keyboard is worse than none), commit-on-leave (so a half-typed `1.`
      never survives as a value), and routing real key events. `attach()` is
      opt-in and returns its own detacher, which is why the old panel-level
      `keydown` listener and `_activeField` tracking are gone.
    */
    this._detachFields?.();
    // `ui.fieldGroup`, not a bare export — the keyboard helpers live on the
    // `ui` namespace rather than the package root.
    const group = ui.fieldGroup({
      fields: inputs.flatMap((i) => i.fields) as never[],
    });
    this._detachFields = group.attach();
    this._addPanel(
      "right",
      panel3d(
        /*
          Height is sized by its content UP TO the room left below the panels
          above it. The arithmetic that used to live here — 24 per caption, 54
          per vector row — was measured in a browser and was still wrong the
          moment a row was added, so the panel measures itself; the cap only
          stops it running off the screen. Width is shared with every other
          panel, which is a layout decision rather than a fit.
        */
        {
          width: PANEL_WIDTH,
          maxHeight: this._spaceBelow("right"),
          padding: 10,
          gap: 4,
        },
        /*
          ONE HEADING ROW: what KIND of thing this is, and its NAME, editable.

          It was two lines and they said the same thing twice — `lantern`, then
          `lamp`, then `lamp` again as the feature group's own heading right
          below. For an environment primitive with a single feature the middle
          line is pure repetition, and for anything else the kind is better
          said by a glyph than by a word.

          The name is a FIELD now rather than a label, so a piece can be
          renamed where you read it. `renamePiece` re-points the references.
        */
        row3d(
          { gap: 6, weights: [1, 8], align: "middle" },
          label3d({ text: this._kindIcon(selected) }),
          ui.inputField({
            value: selected.id,
            placeholder: "id",
            onChange: (value: string) => {
              this.renamePiece(selected.id, value);
            },
          }) as never
        ),
        /*
          The mesh, when there is one, is information rather than a repeat: a
          piece called `flagship` does not otherwise say it is a `ship-large`.
          A bodiless piece's features are already the group headings below.
        */
        ...(selected.mesh
          ? [
              label3d({
                text: selected.library
                  ? `${selected.library} · ${selected.mesh}`
                  : selected.mesh,
                muted: true,
                compact: true,
              }),
            ]
          : []),
        ...(fields as never[])
      )
    );
  }

  /** Detaches the property panel's key routing. Re-made on every render. */
  private _detachFields: (() => void) | null = null;

  /**
   * Undo and redo on the keyboard, because a button alone is not undo.
   *
   * On the WINDOW, not a panel: undo has to work while you are looking at the
   * viewport, which is where an author spends the whole session and where none
   * of the SVG panels has focus. It steps aside for a text field, so typing a
   * coordinate that contains a `z` is not an undo.
   */
  private _attachShortcuts(): void {
    this._detachShortcuts?.();
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z")
        return;
      const target = event.target as {
        tagName?: string;
        isContentEditable?: boolean;
      } | null;
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }
      // ⇧⌘Z redoes, the convention everywhere except an editor nobody enjoys.
      if (event.shiftKey) this.redo();
      else this.undo();
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    this._detachShortcuts = () => window.removeEventListener("keydown", onKey);
  }

  private _detachShortcuts: (() => void) | null = null;

  private _addPanel(side: "left" | "right", panel: SVGSVGElement): void {
    panel.classList.add("ensemble-editor-chrome");
    /*
      GIVE THE PANEL SOMEWHERE TO PUT A POPUP.

      A menu or an on-screen keyboard is bigger than the panel that raised it,
      and `showPopup` alone caps to the panel's own viewBox — so a keyboard on a
      short panel came out squeezed flat over the field it types into.
      `useDomLayer` mounts flat popups as positioned siblings OUTSIDE the
      panel's `<svg>`, which is the presentation-specific half; in a headset
      `panelScene` mounts the same popup as its own plane.

      This is what makes a summonable keyboard work at all, and it is why the
      container must be the panel's parent rather than the panel.
    */
    /*
      THE POPUP LAYER GOES IN THE DOCUMENT. Three containers, two of them wrong:

      - the SHADOW ROOT throws. `useDomLayer` calls `getComputedStyle`, and a
        `ShadowRoot` is not an Element — it took the whole chrome down.
      - the HOST element does not throw and does not work. The layer becomes a
        LIGHT-DOM child of an element whose shadow root has no `<slot>`, so it
        is never rendered: measured, the keyboard was present the whole time at
        `360×209`, connected, `getBoundingClientRect()` all zeros. That is what
        "the keyboard doesn't open" actually was.
      - `document.body` renders, and is where the layer's document-level
        stylesheet applies.

      Saying NOTHING does not work either, though 0.7.6 installs the layer
      itself "when the panel is on the page": ours are not on the page, they are
      in this element's shadow root. Measured with no call — no keypad anywhere
      in the document and no light-DOM children on the host. So the explicit
      call stays; only its argument was ever wrong.
    */
    const withLayer = panel as SVGSVGElement & {
      useDomLayer?: (container: Element) => void;
    };
    withLayer.useDomLayer?.(document.body);
    panel.style.top = `${this._stackTop[side]}px`;
    panel.style[side] = "8px";
    /*
      Read the height the panel SETTLED on, not one we told it.

      With `height: 'fit'` the attribute is written during layout, so the stack
      offset has to come from the panel afterwards. Falling back to 0 would pile
      every panel at the same top — which looks like only one panel exists.
    */
    const height =
      Number(panel.getAttribute("height") ?? 0) ||
      panel.getBoundingClientRect().height;
    this._stackTop[side] += height + 10;
    this._root.append(panel);
    this._panels.push(panel);
  }

  private _stackTop: { left: number; right: number } = { left: 8, right: 8 };

  /**
   * How much room is left on this side, below whatever is already stacked.
   *
   * A property panel is as tall as the feature it shows, and one feature makes
   * that unbounded: the lamp's light settings carry a power section, a type
   * picker, hue and intensity, and a four-curve program with shared
   * attack/sustain splits. Unconstrained it ran off the bottom of the window
   * with no way to reach the end — "the object panel is unconstrained in size
   * so the lamp is a disaster".
   *
   * Measured rather than guessed at, and it can be: `_stackTop` already holds
   * the bottom edge of every panel added to this side before this one, because
   * the stack is built in order. A constant would be wrong on the next window
   * size, and wrong again the moment the tool options panel grows a row.
   */
  private _spaceBelow(side: "left" | "right"): number {
    const total = this.getBoundingClientRect().height;
    // A floor, so a panel is never so short it cannot be scrolled meaningfully
    // — and so a zero height during layout does not collapse it to nothing.
    return Math.max(220, total - this._stackTop[side] - 16);
  }
}

export const ensembleEditor = EnsembleEditor.elementCreator() as (
  ...args: unknown[]
) => EnsembleEditor;

/** An ArcRotateCamera, as much of one as the editor needs to read and restore. */
interface ArcCamera {
  alpha: number;
  beta: number;
  radius: number;
  target?: { x: number; y: number; z: number };
}

/** Where the camera is looking, as plain numbers. */
interface CameraPose {
  alpha: number;
  beta: number;
  radius: number;
  target: Vec3;
}

/**
 * Whether two poses are the same view.
 *
 * The tolerance is what makes this usable as a signal: a rebuild that does not
 * touch the camera still leaves floating-point noise in `radius` from the
 * camera's own inertia, and an exact compare would read that as "the ensemble
 * claimed the view" on every single edit.
 */
function samePose(a: CameraPose | null, b: CameraPose | null): boolean {
  if (!a || !b) return a === b;
  const near = (x: number, y: number) => Math.abs(x - y) < 1e-4;
  return (
    near(a.alpha, b.alpha) &&
    near(a.beta, b.beta) &&
    near(a.radius, b.radius) &&
    a.target.every((v, i) => near(v, b.target[i]!))
  );
}

/** A Babylon vector, as much of one as reading bounds needs. */
interface XYZ {
  x: number;
  y: number;
  z: number;
}

const DEG = Math.PI / 180;

const WORLD_AXIS: Record<"x" | "y" | "z", Vector3> = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
};

/**
 * Turn a rotation by `degrees` about one of the piece's OWN axes.
 *
 * Babylon does the arithmetic on purpose. Composing quaternions is easy;
 * getting back to the euler triple the format stores means matching Babylon's
 * own order exactly, and a hand-rolled conversion that is subtly wrong produces
 * a rotation that looks plausible and is not — the failure mode this project
 * has already paid for three times. `RotationYawPitchRoll` and `toEulerAngles`
 * are inverses of each other, so the round trip is theirs.
 *
 * The multiply ORDER is what makes it local rather than global, and it is not
 * guessable from the docs. Verified by output: under a turn about the piece's
 * own Y, that axis must come out pointing exactly where it did, while the other
 * two sweep. The opposite order leaves WORLD y fixed instead, which is the
 * global rotation we are not doing.
 */
function composeLocalRotation(
  start: Euler,
  axis: "x" | "y" | "z",
  degrees: number
): Euler {
  const current = Quaternion.RotationYawPitchRoll(
    start[1] * DEG,
    start[0] * DEG,
    start[2] * DEG
  );
  const spin = Quaternion.RotationAxis(WORLD_AXIS[axis], degrees * DEG);
  const turned = current.multiply(spin);
  const e = turned.toEulerAngles();
  return [e.x / DEG, e.y / DEG, e.z / DEG];
}
