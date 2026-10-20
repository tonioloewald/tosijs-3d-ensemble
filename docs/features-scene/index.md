# Scene features

The primitives a tosijs-3d scene is made of, registered as ensemble features so
that a whole scene — sun, sky, shadows, ground, weather — is **data you load**
rather than boilerplate you retype.

```typescript
import { registerSceneFeatures, loadEnsemble } from 'tosijs-3d-ensemble'

registerSceneFeatures()
await loadEnsemble('/ensembles/standard-scene.json', { scene })
```

## Each feature, in isolation and in combination

The example below builds ONE scene and the fences under it assert what each
feature put in the renderer. Isolation and combination in the same place is the
point: a feature that works alone and breaks beside another is the failure mode
a per-feature unit test cannot see, and `fog` + `skybox` are wired together on
purpose (`syncSkybox`).

```js
import { b3d } from 'tosijs-3d'
import { buildEnsemble, placeMesh, registerSceneFeatures } from 'tosijs-3d-ensemble'

registerSceneFeatures()

const scene = b3d({})
preview.append(scene)

// One document naming six primitives, built the way a game builds one.
globalThis.__featureDemo = {
  scene,
  ensemble: {
    name: 'feature-demo',
    pieces: [
      { id: 'view', at: [0, 1, 0], features: { camera: { distance: 14 } } },
      { id: 'fill', at: [0, 1, 0], features: { light: { intensity: 0.6 } } },
      { id: 'sun', at: [-0.4, 1, 0.3], features: { sun: { intensity: 1.2 } } },
      { id: 'sky', at: [0, 0, 0], features: { skybox: { timeOfDay: 9 } } },
      { id: 'floor', at: [0, 0, 0], features: { ground: { width: 60, height: 60 } } },
      { id: 'haze', at: [0, 0, 0], features: { fog: { mode: 'exp2', density: 0.0015 } } },
    ],
  },
  build: () =>
    buildEnsemble(globalThis.__featureDemo.ensemble, {
      scene,
      placePiece: placeMesh,
    }),
}
```

```test
// LINE COMMENTS ONLY in a fence: a block comment would end the enclosing doc
// comment at its first close token, because block comments do not nest.
// The fence has its OWN import scope — the example's imports are not in it —
// and specifiers must be SINGLE-quoted, which is the parser's rule rather than
// JavaScript's (filed as tosijs-ui#141).
import { buildEnsemble, placeMesh, sceneFloorplan, floorplanDiff } from 'tosijs-3d-ensemble'

const el = await waitFor('tosi-b3d', 5000)
const demo = globalThis.__featureDemo

// Wait for the SCENE rather than a duration — the engine mounts on a task.
for (let i = 0; i < 200 && !el.scene; i++) await waitMs(50)
const scene = el.scene
const built = demo.build()

test('every feature reported no problem AND put something in the renderer', async () => {
  // `problems` is the format's own report. It has been wrong in the direction
  // that matters — 20 of 20 "built" with an empty scene — so it is checked
  // ALONGSIDE the renderer, never instead of it.
  expect(built.problems.filter((p) => p.severity === 'error')).toEqual([])
  expect(built.pieces.size).toBe(6)

  await waitMs(400)
  const kinds = scene.lights.map((l) => l.getClassName())
  expect(kinds.includes('DirectionalLight')).toBe(true)   // sun
  expect(kinds.includes('HemisphericLight')).toBe(true)   // light
  expect(scene.meshes.some((m) => m.name.startsWith('skybox'))).toBe(true)
  expect(scene.meshes.some((m) => m.name.startsWith('ground'))).toBe(true)
  expect(Boolean(scene.activeCamera)).toBe(true)
})

test('the camera can actually SEE it — the cheap version of "looks right"', async () => {
  // The programmatic stand-in for a human refreshing the page and glancing at
  // it. Not a screenshot: a screenshot comparison is flaky, and this project
  // has already had `readPixels` report [1,1,1] for a frame that was visibly
  // red, so pixels are not a trustworthy witness either.
  //
  // `getActiveMeshes()` is: it is the post-frustum-culling draw list, so a
  // non-empty one means the camera is pointed at geometry that is being
  // rendered THIS frame. That catches the whole family of "it built fine and
  // the page is black" — an empty scene, a camera looking the wrong way, a
  // ground plane a thousand units below the eye — none of which a mesh count
  // or a problems array can see.
  await waitMs(600)
  expect(Boolean(scene.activeCamera)).toBe(true)
  const drawn = scene.getActiveMeshes().length
  expect(drawn > 0).toBe(true)

  // And the loop is turning. A frozen render loop is the other way a correct
  // scene shows nothing — a throw inside a render observer kills it silently,
  // and Babylon does not re-queue.
  expect(el.engine.getFps() > 0).toBe(true)
})

test('an authored value survives the trip to the renderer', async () => {
  await waitMs(400)

  // ⚠️ `sun.intensity` is NOT the light's intensity once a `skybox` is in the
  // same ensemble. b3d-shadows says so — "overridden by skybox when present" —
  // and a b3dSkybox sets a flag after which the sun stops writing
  // `light.intensity` at all, driving it from time-of-day and treating the
  // authored number as a multiplier.
  //
  // Worth an assertion rather than a note, because it is an authoring trap:
  // set 1.2, read something else, and nothing is wrong. This is also the case
  // for testing features in COMBINATION — alone, the sun owns its light.
  const sun = scene.lights.find((l) => l.getClassName() === 'DirectionalLight')
  expect(Boolean(sun)).toBe(true)
  expect(sun.intensity > 0).toBe(true)

  const ground = scene.meshes.find((m) => m.name.startsWith('ground'))
  const half = ground.getBoundingInfo().boundingBox.extendSizeWorld.x
  expect(Math.round(half)).toBe(30) // width 60

  // Fog reaches the SCENE, which is where it was once silently dead: an
  // authored `linear` ran EXP2 upstream, and a `none` we offered ran LINEAR.
  expect(scene.fogMode).toBe(2)
  expect(Math.round(scene.fogDensity * 1e6) / 1e6).toBe(0.0015)
})

test('a rebuild does not move the picture — structural, not pixels', async () => {
  // The visual-regression assertion, with no image in it. `sceneFloorplan`
  // snapshots what the camera can SEE, at world geometry; `floorplanDiff`
  // compares two snapshots with a tolerance you set rather than one the GPU
  // sets for you. A rectangle in the same place, or very nearly, versus
  // absent — that is signal. 3.2% of pixels differing is not.
  //
  // This is the assertion an editor most needs and could least make: it
  // rebuilds on every edit, so 'the rebuild moved something' is the whole
  // risk, and nothing short of looking could previously say.
  await waitMs(400)
  const before = sceneFloorplan(scene, { ignore: /^ensemble-editor-/ })
  expect(before.length > 0).toBe(true)

  const again = buildEnsemble(demo.ensemble, { scene, placePiece: placeMesh })
  await waitMs(500)
  const changes = floorplanDiff(before, sceneFloorplan(scene, { ignore: /^ensemble-editor-/ }))
  // A failure NAMES the thing — 'ground: moved (0,0,0) → (0,-12,0)' — instead
  // of handing you a heat map to interpret.
  expect(changes.map((c) => c.name + ':' + c.kind)).toEqual([])
  again.dispose()
})

test('a second build REUSES the singletons rather than stacking them', async () => {
  // A game builds once; the editor rebuilds on every edit, so this is the
  // difference between a session that stays put and one that degrades.
  //
  // The scene primitives are singletons on purpose — one sun, one sky, one
  // fog — so a second build must not add a second of each. My first version of
  // this test asserted the opposite and failed, which is the harness earning
  // its place: the assumption was wrong, not the code.
  await waitMs(300)
  const before = scene.lights.length
  const extra = buildEnsemble(demo.ensemble, { scene, placePiece: placeMesh })
  await waitMs(400)
  expect(scene.lights.length).toBe(before)
  extra.dispose()
})
```

That is the point of the format, and it is not a combat format: `describe an
arrangement, consume it anywhere`. A fortification is one kind of ensemble; so
is the standard demo scene, a botanical garden, or an architectural site.

## A scene feature is a feature with no mesh

`features` was always an open map bound by registrations, so a piece whose body
IS its feature needs no special case — it simply has no `mesh`:

```jsonc
{ "id": "sun",    "at": [0, 1, 0], "features": { "sun": { "intensity": 1 } } },
{ "id": "sky",    "at": [0, 0, 0], "features": { "skybox": { "timeOfDay": 11 } } },
{ "id": "ground", "at": [0, 0, 0], "features": { "ground": { "width": 400, "texture": "checker" } } }
```

An unset field is its SCHEMA default, the value the editor's panel shows, not
the element's own: `{ "ground": {} }` is the 400 m checker plane the panel
describes. See `effectiveConfig`.

## Weather

A storm is two pieces: a `weatherCell` where the storm is (the piece's position
is the cell's centre, and there can be many), and one `lightning` anywhere,
which strikes under every stormy cell. `lightShafts` adds sunbeams through a
broken `cloudDeck`. A freshly inserted cell is a storm (cover 1.7, storminess
1, rain 0.9), because the element's own defaults are all calm.

```jsonc
{ "id": "deck",      "at": [0, 0, 0],     "features": { "cloudDeck": { "coverage": 0.85 } } },
{ "id": "squall",    "at": [700, 0, 400], "features": { "weatherCell": { "radius": 600 } } },
{ "id": "lightning", "at": [0, 0, 0],     "features": { "lightning": { "rate": 2 } } },
{ "id": "shafts",    "at": [0, 0, 0],     "features": { "lightShafts": {} } }
```

The whole scene is `/ensembles/storm.json`, and `tests/storm.pw.ts` watches it
strike inside the cell.

`wind` sets the SCENE's wind (`<tosi-b3d>`'s own `windSpeed`,
`windBearingDeg`, `windGust`): a cell with `drift: "wind"` travels on it, and
clouds, water and ambient particles feel it where their own wind is unset.
It is the one thing a document may set on the host. Render quality, such as
ambient occlusion, stays the viewer's (see `recommends`).

```jsonc
{ "id": "wind",   "at": [0, 0, 0],     "features": { "wind": { "windSpeed": 12, "windBearingDeg": 90 } } },
{ "id": "squall", "at": [700, 0, 400], "features": { "weatherCell": { "drift": "wind" } } }
```

## Planets

A `planet` piece is a globe in the scene: its own world from its own seed, or
drawn from a sphere `terrain` piece it names, so its coasts are that ground's.
Or the other way round: a sphere terrain's `planet` names a planet piece and
the ground takes the globe's sea, coasts and mountain ranges. Either can be the
source. A sphere terrain is pinned to a place on its planet with `lat` / `lon`
(the latitude and longitude of the terrain's origin).

```jsonc
{ "id": "land",  "at": [0, 0, 0],       "features": { "terrain": { "surfaceType": "sphere", "radius": 4000, "center": true, "biome": true, "lat": 30, "lon": 40 } } },
{ "id": "globe", "at": [0, 440, 220],   "features": { "planet":  { "terrain": "land", "radius": 40, "relief": 2, "flatSea": true, "biome": true } } }
```

The whole scene is `/ensembles/planet.json`; `tests/planet.pw.ts` checks the
pin and both directions of the link on the elements. The schemas, the pin and
the links are tosijs-3d's; what is ours is that a link names a PIECE id, which
the link phase turns into the selector the element reads.

## Effects

An `effect` piece plays one of tosijs-3d's effects where it stands:
particles, a light and a sound on one clock (`volcano`, `geyser`, `bubbles`,
`black smoker`, `splash`, `explosion`, `fireball`, `sparks`). `activity`
names its stops (`dormant` 0.15, `semi-active` 0.5, `erupting` 1; -1 is the
recipe's own), `scale` grows it from a vent to a crater, and `ground` sits
it on the terrain below.

```jsonc
{ "id": "vent", "at": [12, 0, -4], "features": { "effect": { "preset": "geyser", "activity": 0.5 } } }
```

Your own effect goes in `recipe`, as tosijs-3d's effect tool saves it, and
plays instead of the preset. In the editor, **Edit effect ✨** opens that tool
on the piece and writes the recipe for you. A recipe can load its own images
and sounds; each url in it is held to the same https rule as every other url
in a document (found by walking upstream's schema), and a recipe with a
refused url is refused whole. Inline SVG markup loads nothing and is fine.

A **volcano** landform (see [[features-landform|Landforms]]) brings its own vent
effect, so a volcano piece needs no separate effect piece.

## Combat is somewhere else, on purpose

`destroyable`, `turret`, `launcher`, `protector`, `blip` and `launchpad` are NOT
here — they are a domain vocabulary in [[combat|presets/combat]], registered by a
consumer that wants them. An earlier version shipped them as built-ins next to
`terrain` and `water`, which quietly made every consumer's scene format a combat
format.
