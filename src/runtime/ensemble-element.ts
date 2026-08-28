/*#
# <tosi-ensemble>

Load an ensemble into a scene **in one line**, declaratively, as a child of
`<tosi-b3d>`:

```html
<tosi-b3d>
  <tosi-ensemble src="/ensembles/standard-scene.json"></tosi-ensemble>
</tosi-b3d>
```

```js
import { b3d, b3dBox } from 'tosijs-3d'
import { ensemble, registerSceneFeatures } from 'tosijs-3d-ensemble'

registerSceneFeatures()

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
*/
/*{"parent":"Runtime","order":2}*/
import { Component } from 'tosijs'
import { buildEnsemble } from './build'
import { placeMesh } from './place-mesh'
import { mountLibraries } from './libraries'
import type { BuiltEnsemble } from './build'
import type { Ensemble as EnsembleData, Vec3 } from '../format/types'
import type { SceneElement } from '../format/registry'

export class TosiEnsemble extends Component {
  static override preferredTagName = 'tosi-ensemble'

  static override initAttributes = {
    src: '',
    library: '',
    /** Where the ensemble's local origin sits in the world: `"x y z"`. */
    at: '0 0 0',
  }

  declare src: string
  declare library: string
  declare at: string

  override content = null

  /** Assign to build from memory instead of fetching. */
  get ensemble(): EnsembleData | null {
    return this._data
  }
  set ensemble(value: EnsembleData | null) {
    this._data = value
    this._rebuild()
  }
  private _data: EnsembleData | null = null

  /** The live build — pieces, handles and validation problems. */
  get built(): BuiltEnsemble | null {
    return this._built
  }
  private _built: BuiltEnsemble | null = null

  override connectedCallback(): void {
    super.connectedCallback()
    if (this.src) void this.load(this.src)
  }

  override disconnectedCallback(): void {
    this._built?.dispose()
    this._built = null
    super.disconnectedCallback?.()
  }

  async load(url: string): Promise<void> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`ensemble "${url}": ${response.status}`)
    const data = (await response.json()) as EnsembleData
    // Mount what the FILE declares before building, so a page needs to know
    // nothing about the content it is showing beyond its address.
    const scene = this.closest('tosi-b3d') as SceneElement | null
    if (scene) await mountLibraries(data, scene)
    this.ensemble = data
  }

  private _rebuild(): void {
    this._built?.dispose()
    this._built = null
    if (!this._data) return

    /*
      The scene is this element's PARENT, not a document-wide query. Several
      ensembles in one page, or an editor previewing one beside another, must
      not fight over `document.querySelector('tosi-b3d')`.
    */
    const scene = this.closest('tosi-b3d') as SceneElement | null
    if (!scene) return

    const [x = 0, y = 0, z = 0] = this.at.split(/[\s,]+/).map(Number)
    this._built = buildEnsemble(this._data, {
      scene,
      origin: [x, y, z] as Vec3,
      library: this.library,
      placePiece: placeMesh,
    })
  }
}

export const ensemble = TosiEnsemble.elementCreator() as (
  ...args: unknown[]
) => TosiEnsemble
