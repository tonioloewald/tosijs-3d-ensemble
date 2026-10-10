/*#
# `<tosi-ensemble>`

Load an ensemble into a scene **in one line**, declaratively, as a child of
`<tosi-b3d>`:

```html
<tosi-b3d>
  <tosi-ensemble src="/ensembles/standard-scene.json"></tosi-ensemble>
</tosi-b3d>
```

```js
import { b3d, b3dBox } from 'tosijs-3d'
// No setup call: the element registers the scene features itself.
import { ensemble } from 'tosijs-3d-ensemble'

preview.append(
  b3d(
    {},
    // The whole standard setup — sun, shadows, sky, ground, fog — as data.
    ensemble({ src: '/ensembles/standard-scene.json' }),
    // …and the one line that makes THIS scene different from the last one.
    b3dBox({ size: 1.5, y: 0.75, color: '#2f9e8f' }),
  ),
)
```

```css
tosi-b3d { width: 100%; height: 320px; }
```

```test
// The example above is the CLAIM — "the whole standard setup, as data" — and
// this is that claim checked, in the browser that just rendered it, against
// the renderer rather than against the attributes we wrote.
//
// ⚠️ LINE COMMENTS ONLY inside a fence. A block comment here would end the
// enclosing doc comment at its first close token, because block comments do
// not nest — which is how tosijs-3d shipped a doc page truncated at half its
// length, and how the first draft of THIS comment broke its own file by
// spelling the token out.
const el = await waitFor('tosi-b3d', 5000)
const built = await waitFor('tosi-ensemble', 5000)

test('the standard scene reaches the renderer', async () => {
  // Wait for the SCENE, not a duration: the engine mounts on a task and the
  // ensemble fetches its own file. A sleep here measures whatever happened to
  // be true when it expired, which is how a fog assertion once reported a
  // number belonging to a different document entirely.
  for (let i = 0; i < 200 && !el.scene?.lights?.length; i++) await waitMs(50)
  const scene = el.scene
  expect(Boolean(scene)).toBe(true)

  const kinds = scene.lights.map((l) => l.getClassName()).sort()
  // `sun` is a directional light and `light` is a hemispheric FILL — a
  // distinction the format holds deliberately, and one an attribute cannot
  // confirm.
  expect(kinds.includes('DirectionalLight')).toBe(true)
  expect(kinds.includes('HemisphericLight')).toBe(true)

  // `fog` — the one that was silently dead upstream (tosijs-3d#32) and offered
  // a "none" here that rendered LINEAR. Ask the SCENE what mode it is in.
  expect(scene.fogMode).toBe(2) // Scene.FOGMODE_EXP2

  // The `ground` piece, as a bounding box in world units: the assertion that
  // catches a size attribute the renderer never applied.
  const ground = scene.meshes.find((m) => m.name.startsWith('ground'))
  expect(Boolean(ground)).toBe(true)
  const halfWidth = ground.getBoundingInfo().boundingBox.extendSizeWorld.x
  expect(Math.round(halfWidth)).toBe(200) // width 400 in the file

  // And the piece the example adds on top of the ensemble is really on top of
  // it — the whole "standard setup PLUS my one thing" claim.
  expect(built.built.pieces.size).toBe(6)
  expect(scene.meshes.some((m) => m.name.includes('box'))).toBe(true)
})
```

That is the point of the whole format. A tosijs-3d scene is normally a stack of
boilerplate — a sun, a shadow rig, a sky, a ground plane, fog, a camera setup —
retyped per demo, in which the two lines that make THIS scene different are
buried. Loading that stack as data means a scene reads as *"the standard setup,
plus the thing I am actually showing you"*.

Ensembles compose, so a scene can name several: a lighting rig, a terrain, and
the arrangement standing on it.

## It is not a combat format

Nothing here knows what an ensemble is FOR. `registerSceneFeatures()` gives you
sun, sky, ground, terrain, water, clouds, ambient and fog; a game that wants hit
points registers `presets/combat` as well. A scene that never does pays nothing
and — more to the point — never sees `shield` in a property panel.

## Attributes

| | |
|---|---|
| `src` | URL of the ensemble JSON |
| `library` | library `type` to instantiate meshes from; omit for none |
| `at` | where to put its local origin, `"x y z"`, default `"0 0 0"` |

## Declarative, all the way

- **No setup call.** The element registers the scene features (sun, sky,
  ground, terrain, water, weather…) itself the first time one connects, so a
  page that is only HTML works. The combat and world presets stay opt-in: a
  consumer that wants them still calls `registerCombatPreset()` /
  `registerWorldPreset()`.
- **Live attributes.** Change `src` and the new document loads (a slow earlier
  response cannot overwrite it); change `at` and it rebuilds at the new origin.
- **Survives a move.** Re-parenting disconnects and reconnects the element; it
  rebuilds from the document it already holds, whether that came from `src` or
  was assigned to `.ensemble`.

## Events

| event | `detail` | when |
|---|---|---|
| `built` | `{ built, problems }` | after every build, with `validate`'s problems |
| `error` | `{ error, src }` | a fetch or parse failed (no unhandled rejection) |

```js
// Runs on this page: listens to the example's element above.
const el = document.querySelector('tosi-ensemble')
el?.addEventListener('built', (e) => console.log(e.detail.problems))
```
*/
/*{"parent":"Runtime","order":2}*/
import { Component } from "tosijs";
import type { ComponentAttrs } from "tosijs";
import { buildEnsemble } from "./build.js";
import { placeMesh } from "./place-mesh.js";
import { mountLibraries } from "./libraries.js";
import { registerSceneFeatures } from "./features-scene.js";
import type { BuiltEnsemble } from "./build.js";
import type { Ensemble as EnsembleData, Vec3 } from "../format/types.js";
import type { SceneElement } from "../format/registry.js";

// Attributes typed from their VALUES — see the note on `EnsembleEditor`, which
// also explains why this is not `withAttributes()` yet. The old
// `static initAttributes` + `declare` pair states each attribute twice, and a
// pair that must agree is a pair that eventually does not.
export interface TosiEnsemble
  extends ComponentAttrs<typeof TosiEnsemble.initAttributes> {}
export class TosiEnsemble extends Component {
  static override preferredTagName = "tosi-ensemble";

  static override initAttributes = {
    src: "",
    library: "",
    /** Where the ensemble's local origin sits in the world: `"x y z"`. */
    at: "0 0 0",
  };

  override content = null;

  /** Assign to build from memory instead of fetching. */
  get ensemble(): EnsembleData | null {
    return this._data;
  }
  set ensemble(value: EnsembleData | null) {
    // Assigning a document is a newer request than any fetch in flight, so
    // that fetch must not overwrite it when it lands.
    this._loads++;
    this._setData(value);
  }

  /** Hold a document and build it (libraries first). Used by load too. */
  private _setData(value: EnsembleData | null): void {
    this._data = value;
    this._mountAndBuild();
  }
  private _data: EnsembleData | null = null;

  /** The live build — pieces, handles and validation problems. */
  get built(): BuiltEnsemble | null {
    return this._built;
  }
  private _built: BuiltEnsemble | null = null;

  /** The `src` last asked for, and the `at` the live build was made with. */
  private _requestedSrc = "";
  private _builtAt: string | null = null;
  private _loads = 0;

  override connectedCallback(): void {
    // The scene vocabulary is what this element is FOR, so it brings it: a
    // page that is only HTML must work. Idempotent; presets stay opt-in.
    registerSceneFeatures({ keepExisting: true });
    super.connectedCallback();
    this._sync();
  }

  /*
    Attribute writes re-render a tosijs component, so this is where a changed
    `src` or `at` is noticed. It only DECIDES; loading and building happen in
    `load` and `_rebuild`.
  */
  override render(): void {
    super.render?.();
    if (this.isConnected) this._sync();
  }

  /*
    One place that brings the build in line with the attributes:
    - a NEW `src` loads (the same one again does not refetch);
    - otherwise, a document held but not built (a reconnect after a MOVE, which
      disposed the build) or built at a different `at` is rebuilt.
  */
  private _sync(): void {
    // Only an `src` CHANGE moves this, so a clear then the same src again
    // refetches, and an explicit `load(url)` does not make the next
    // attribute write fetch `src` back over it.
    if (this.src !== this._requestedSrc) {
      this._requestedSrc = this.src;
      if (this.src) {
        void this.load(this.src);
        return;
      }
    }
    if (this._data && (!this._built || this._builtAt !== this.at))
      this._mountAndBuild();
  }

  /*
    MOUNT, THEN BUILD, on every path, not only after a fetch. A reconnect
    (possibly into a DIFFERENT <tosi-b3d>) and a document assigned to
    \`.ensemble\` need the document's libraries in THIS scene too, or every
    library piece builds as a placeholder (0.5.1 review). \`mountLibraries\` is
    idempotent by name and url. A document with no libraries builds
    synchronously, as before; one with libraries builds when they are ready,
    unless something newer was asked for meanwhile.
  */
  private _builds = 0;
  private _mountAndBuild(): void {
    const ticket = ++this._builds;
    const data = this._data;
    const scene = this.closest("tosi-b3d") as SceneElement | null;
    if (!data?.libraries?.length || !scene) {
      this._rebuild();
      return;
    }
    void mountLibraries(data, scene).then(() => {
      if (ticket === this._builds && this._data === data) this._rebuild();
    });
  }

  override disconnectedCallback(): void {
    this._built?.dispose();
    this._built = null;
    this._builtAt = null;
    super.disconnectedCallback?.();
  }

  /**
   * Fetch and build `url`. A failure is reported as an `error` event rather
   * than thrown, and a slower EARLIER load that resolves after a later one is
   * discarded, so the element shows the last `src` it was given.
   */
  async load(url: string): Promise<void> {
    const ticket = ++this._loads;
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`ensemble "${url}": ${response.status}`);
      const data = (await response.json()) as EnsembleData;
      if (ticket !== this._loads) return;
      // Libraries are mounted by \`_mountAndBuild\`, on this path and every
      // other: a page needs to know nothing about the content beyond its
      // address.
      this._setData(data);
    } catch (error) {
      if (ticket !== this._loads) return;
      this.dispatchEvent(
        new CustomEvent("error", { detail: { error, src: url } })
      );
    }
  }

  private _rebuild(): void {
    this._built?.dispose();
    this._built = null;
    this._builtAt = null;
    if (!this._data) return;

    /*
      The scene is this element's PARENT, not a document-wide query. Several
      ensembles in one page, or an editor previewing one beside another, must
      not fight over `document.querySelector('tosi-b3d')`.
    */
    const scene = this.closest("tosi-b3d") as SceneElement | null;
    if (!scene) return;

    const [x = 0, y = 0, z = 0] = this.at.split(/[\s,]+/).map(Number);
    this._built = buildEnsemble(this._data, {
      scene,
      origin: [x, y, z] as Vec3,
      library: this.library,
      placePiece: placeMesh,
    });
    this._builtAt = this.at;
    this.dispatchEvent(
      new CustomEvent("built", {
        detail: { built: this._built, problems: this._built.problems },
      })
    );
  }
}

export const ensemble = TosiEnsemble.elementCreator() as (
  ...args: unknown[]
) => TosiEnsemble;
