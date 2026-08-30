/*#
# The selection marker

A box around the selected piece and three thin axis rods through its origin.
Shown whenever something is selected — **including when no transform is
enabled**, which is the whole reason it exists.

## Why an outline was not enough

There is a `HighlightLayer` too, and for a long time there was only that. It had
never worked: both kinds of body hand you a `TransformNode` at the top, the
layer takes meshes, and the call that fed it one was wrapped in a `catch`. So
"the piece you are about to move" was communicated by a property panel and
nothing else, twice reported and once wrongly believed fixed.

Even working, an outline is the wrong primary signal here. It says *which mesh*
and nothing about *where the origin is* or *how big the thing is* — and in an
arrangement editor those are the two questions. The box answers the second, the
axes answer the first, and both read at a glance against a busy scene.

## Quiet, but not invisible

The first version used `CreateLines` for the axes and a `wireframe` material for
the box. Both render — measured: four meshes, visible, enabled, in the active
list — and both are effectively **one pixel wide**, because WebGL has no line
width. On a phone that is nothing at all: "I don't see selection feedback so I
need to turn on transformation to get any selection feedback."

So the axes are thin CYLINDERS, which have real width and scale with the piece,
and the box adds `enableEdgesRendering`, which draws its edges as camera-facing
quads at a width in pixels rather than as hairlines. Still no fill, still
nothing that tints the model — just wide enough to see.

It marks the selection; it is not a control, and anything that LOOKS grabbable
but is not is worse than nothing.
*/
/*{"parent":"Internals","order":6}*/
import { Color3, Color4, MeshBuilder, StandardMaterial } from '@babylonjs/core'
import type { Vec3 } from '../format/types'

/** Marks a mesh as ours, so picking can tell a marker from the scene. */
export const MARKER_TAG = 'ensemble-editor-selection'

const AXIS_COLOR: Record<'x' | 'y' | 'z', [number, number, number]> = {
  x: [0.9, 0.25, 0.3],
  y: [0.35, 0.85, 0.4],
  z: [0.3, 0.5, 0.95],
}

const BOX_COLOR: [number, number, number] = [0.18, 0.62, 0.56]

/** How far the axis rods reach past the box, as a fraction of its half-size. */
const AXIS_OVERSHOOT = 0.35

/**
 * Edge width in PIXELS, which is the point of using edge rendering at all.
 *
 * A wireframe material draws one-pixel lines whatever the screen; edges are
 * quads and hold their width. Four is legible on a phone without reading as a
 * control you could grab.
 */
const EDGE_WIDTH = 4

/** Axis rod thickness, as a fraction of the piece's smallest half-extent. */
const ROD_THICKNESS = 0.06
/** Never thinner than this in metres, or a flat piece gets invisible rods. */
const ROD_MIN = 0.02

export interface Bounds {
  centre: Vec3
  /** HALF-extents, so a 2 m cube is `[1, 1, 1]`. */
  extents: Vec3
}

export interface SelectionView {
  show(bounds: Bounds): void
  hide(): void
  dispose(): void
}

interface Marker {
  position: { x: number; y: number; z: number }
  scaling: { x: number; y: number; z: number }
  isVisible: boolean
  isPickable: boolean
  renderingGroupId: number
  material?: unknown
  rotation: { x: number; y: number; z: number }
  enableEdgesRendering?: () => void
  edgesWidth?: number
  edgesColor?: Color4
  dispose: () => void
  computeWorldMatrix: (force: boolean) => void
}

export function createSelectionView(scene: unknown): SelectionView {
  const s = scene as never
  const parts: Marker[] = []
  const materials: Array<{ dispose: () => void }> = []

  const box = MeshBuilder.CreateBox(`${MARKER_TAG}-box`, { size: 1 }, s) as unknown as Marker
  const outline = new StandardMaterial(`${MARKER_TAG}-box-mat`, s) as unknown as {
    emissiveColor: Color3
    disableLighting: boolean
    wireframe: boolean
    alpha: number
    dispose: () => void
  }
  outline.emissiveColor = new Color3(...BOX_COLOR)
  outline.disableLighting = true
  // Wireframe rather than a transparent solid: a tinted box over the piece
  // changes the colour of the thing you are judging, which is the one thing an
  // arrangement editor must not do.
  outline.wireframe = true
  outline.alpha = 0.9
  box.material = outline
  /*
    The edges are what you actually SEE. `wireframe` draws one-pixel lines; edge
    rendering draws quads at a width in pixels, so the box survives a phone
    screen. Both are on: the wireframe costs nothing and fills in the diagonals
    of the triangulation that edges deliberately skip.
  */
  box.enableEdgesRendering?.()
  box.edgesWidth = EDGE_WIDTH
  box.edgesColor = new Color4(...BOX_COLOR, 1)
  parts.push(box)

  /*
    Axis rods are built along the axis at UNIT length and scaled to the piece,
    so there is one mesh per axis for the life of the view rather than a rebuild
    every time the selection changes size.
  */
  const HALF = Math.PI / 2
  const axes: Record<'x' | 'y' | 'z', Marker> = { x: rod('x'), y: rod('y'), z: rod('z') }

  function rod(axis: 'x' | 'y' | 'z'): Marker {
    // A cylinder, not a line: WebGL lines are one pixel wide at every distance
    // and on every screen, which is why the first version could not be seen.
    const mesh = MeshBuilder.CreateCylinder(
      `${MARKER_TAG}-axis-${axis}`,
      { height: 2, diameter: 1, tessellation: 6 },
      s
    ) as unknown as Marker
    // Built along Y; turn it onto its own axis.
    mesh.rotation.x = axis === 'z' ? HALF : 0
    mesh.rotation.z = axis === 'x' ? HALF : 0
    const material = new StandardMaterial(`${MARKER_TAG}-axis-${axis}-mat`, s) as unknown as {
      emissiveColor: Color3
      disableLighting: boolean
      dispose: () => void
    }
    material.emissiveColor = new Color3(...AXIS_COLOR[axis])
    material.disableLighting = true
    mesh.material = material
    materials.push(material)
    parts.push(mesh)
    return mesh
  }

  for (const part of parts) {
    part.isPickable = false
    // Draw on top, with the manipulator. A marker hidden inside the mesh it
    // marks tells you nothing, and interior geometry is the common case.
    part.renderingGroupId = 1
    part.isVisible = false
  }

  return {
    show({ centre, extents }) {
      // A zero extent (a piece whose mesh has not loaded) would collapse the
      // box into an invisible plane; a floor keeps the marker findable.
      const size: Vec3 = [
        Math.max(extents[0], 0.05),
        Math.max(extents[1], 0.05),
        Math.max(extents[2], 0.05),
      ]
      box.position.x = centre[0]
      box.position.y = centre[1]
      box.position.z = centre[2]
      box.scaling.x = size[0] * 2
      box.scaling.y = size[1] * 2
      box.scaling.z = size[2] * 2
      box.isVisible = true
      box.computeWorldMatrix(true)

      /*
        A rod is a unit-height cylinder along its axis, so ONE component of its
        scaling is its length and the other two are its thickness. Thickness is
        taken from the SMALLEST half-extent so a long thin piece gets thin rods
        rather than rods as fat as the piece is short.
      */
      const reach = 1 + AXIS_OVERSHOOT
      const thickness = Math.max(Math.min(size[0], size[1], size[2]) * ROD_THICKNESS, ROD_MIN)
      for (const axis of ['x', 'y', 'z'] as const) {
        const mesh = axes[axis]
        const i = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
        mesh.position.x = centre[0]
        mesh.position.y = centre[1]
        mesh.position.z = centre[2]
        // The cylinder's own length runs along ITS local Y whatever axis it has
        // been turned onto, so length is always the y component of scaling.
        mesh.scaling.x = thickness
        mesh.scaling.y = size[i]! * reach
        mesh.scaling.z = thickness
        mesh.isVisible = true
        mesh.computeWorldMatrix(true)
      }
    },
    hide() {
      for (const part of parts) part.isVisible = false
    },
    dispose() {
      for (const part of parts) part.dispose()
      for (const m of materials) m.dispose()
      outline.dispose()
      parts.length = 0
      materials.length = 0
    },
  }
}
