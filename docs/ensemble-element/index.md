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
