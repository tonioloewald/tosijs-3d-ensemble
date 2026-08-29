/*#
# The selection marker

A wireframe box around the selected piece and three thin axis lines through it.
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

## Deliberately quiet

Thin lines, no fill, drawn on top. This marks the selection; it is not a
control, and anything that LOOKS grabbable but is not is worse than nothing —
the same rule that keeps the manipulator's shafts thin now that the arrowheads
are what you reach for.
*/
/*{"parent":"Internals","order":6}*/
import { Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core'
import type { Vec3 } from '../format/types'

/** Marks a mesh as ours, so picking can tell a marker from the scene. */
export const MARKER_TAG = 'ensemble-editor-selection'

const AXIS_COLOR: Record<'x' | 'y' | 'z', [number, number, number]> = {
  x: [0.9, 0.25, 0.3],
  y: [0.35, 0.85, 0.4],
  z: [0.3, 0.5, 0.95],
}

const BOX_COLOR: [number, number, number] = [0.18, 0.62, 0.56]

/** How far the axis lines reach past the box, as a fraction of its half-size. */
const AXIS_OVERSHOOT = 0.35

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
  color?: Color3
  dispose: () => void
  computeWorldMatrix: (force: boolean) => void
}

export function createSelectionView(scene: unknown): SelectionView {
  const s = scene as never
  const parts: Marker[] = []

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
  parts.push(box)

  /*
    Axis lines are built along the axis at UNIT length and scaled to the piece,
    so there is one mesh per axis for the life of the view rather than a rebuild
    every time the selection changes size.
  */
  const axes: Record<'x' | 'y' | 'z', Marker> = {
    x: line('x'),
    y: line('y'),
    z: line('z'),
  }

  function line(axis: 'x' | 'y' | 'z'): Marker {
    const unit: Vec3 = axis === 'x' ? [1, 0, 0] : axis === 'y' ? [0, 1, 0] : [0, 0, 1]
    const mesh = MeshBuilder.CreateLines(
      `${MARKER_TAG}-axis-${axis}`,
      {
        points: [
          { x: -unit[0], y: -unit[1], z: -unit[2] },
          { x: unit[0], y: unit[1], z: unit[2] },
        ] as never,
      },
      s
    ) as unknown as Marker
    // A LinesMesh carries its colour directly; it has no lit material to fight.
    mesh.color = new Color3(...AXIS_COLOR[axis])
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

      const reach = 1 + AXIS_OVERSHOOT
      for (const axis of ['x', 'y', 'z'] as const) {
        const mesh = axes[axis]
        mesh.position.x = centre[0]
        mesh.position.y = centre[1]
        mesh.position.z = centre[2]
        mesh.scaling.x = size[0] * reach
        mesh.scaling.y = size[1] * reach
        mesh.scaling.z = size[2] * reach
        mesh.isVisible = true
        mesh.computeWorldMatrix(true)
      }
    },
    hide() {
      for (const part of parts) part.isVisible = false
    },
    dispose() {
      for (const part of parts) part.dispose()
      outline.dispose()
      parts.length = 0
    },
  }
}
