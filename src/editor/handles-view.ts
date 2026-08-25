/*#
# Manipulator handles

The visible part: three axis handles a pointer can grab, in whichever mode the
tool is in. tosijs-3d has no manipulator (UPSTREAM.md #1) and Babylon's
`GizmoManager` is mouse-shaped, so this is built here — and built so a **hand**
can grab it, not only a ray.

## Sized for hands, not only for pixels

Handles carry a `nearRadius` and are picked two ways: a hand inside that radius
grabs directly, anything further grabs by pointing. A gizmo designed for a mouse
gets this wrong by being visually thin — fine for a pixel-accurate cursor,
impossible to grab with a controller you are holding at arm's length.

They also draw **on top** (`renderingGroupId`), because a handle buried inside
the mesh it manipulates cannot be clicked at all — and the piece an author most
wants to move is usually the one embedded in something else.
*/
import { Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core'
import type { Axis, TransformMode } from './handles'
import type { Vec3 } from '../format/types'

/** Marks a mesh as ours, so picking can tell a handle from the scene. */
export const HANDLE_TAG = 'ensemble-editor-handle'

interface HandleMesh {
  axis: Axis
  mesh: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    isVisible: boolean
    metadata: unknown
    dispose: () => void
    computeWorldMatrix: (force: boolean) => void
    renderingGroupId: number
    material: unknown
    isPickable: boolean
  }
}

const AXIS_COLOR: Record<Axis, [number, number, number]> = {
  x: [0.9, 0.25, 0.3],
  y: [0.35, 0.85, 0.4],
  z: [0.3, 0.5, 0.95],
}

/** How close a HAND has to be, in metres, to grab a handle directly. */
export const NEAR_RADIUS = 0.18

export interface HandlesView {
  setMode(mode: TransformMode): void
  moveTo(position: Vec3): void
  setVisible(visible: boolean): void
  /** The axis whose handle is within `NEAR_RADIUS` of a hand, if any. */
  nearestAxis(grip: Vec3): Axis | null
  /** The axis of a handle mesh, for resolving a ray pick. */
  axisOf(mesh: unknown): Axis | null
  dispose(): void
}

/**
 * Build handles into a scene.
 *
 * `scale` should track the distance to the camera in a finished editor so the
 * handles stay a constant size on screen; it is a plain multiplier here, which
 * is honest about what has and has not been built.
 */
export function createHandles(scene: unknown, scale = 1): HandlesView {
  const s = scene as never
  const handles: HandleMesh[] = []
  let position: Vec3 = [0, 0, 0]
  let mode: TransformMode = 'translate'

  const material = (axis: Axis) => {
    const m = new StandardMaterial(`${HANDLE_TAG}-${axis}`, s) as unknown as {
      emissiveColor: Color3
      disableLighting: boolean
    }
    const [r, g, b] = AXIS_COLOR[axis]
    // Emissive and unlit: a handle must read the same against a bright sky and
    // a dark hull, and it is UI rather than part of the scene.
    m.emissiveColor = new Color3(r, g, b)
    m.disableLighting = true
    return m
  }

  const build = () => {
    for (const h of handles) h.mesh.dispose()
    handles.length = 0
    for (const axis of ['x', 'y', 'z'] as Axis[]) {
      const mesh = (
        mode === 'rotate'
          ? MeshBuilder.CreateTorus(
              `${HANDLE_TAG}-${axis}`,
              { diameter: 1.6 * scale, thickness: 0.09 * scale, tessellation: 48 },
              s
            )
          : mode === 'scale'
            ? MeshBuilder.CreateBox(`${HANDLE_TAG}-${axis}`, { size: 0.22 * scale }, s)
            : MeshBuilder.CreateCylinder(
                `${HANDLE_TAG}-${axis}`,
                { height: 1.1 * scale, diameter: 0.075 * scale, tessellation: 12 },
                s
              )
      ) as unknown as HandleMesh['mesh']
      mesh.material = material(axis)
      mesh.renderingGroupId = 1
      mesh.isPickable = true
      mesh.metadata = { [HANDLE_TAG]: axis }
      handles.push({ axis, mesh })
    }
    place()
  }

  const place = () => {
    const offset = mode === 'rotate' ? 0 : 0.75 * scale
    for (const { axis, mesh } of handles) {
      mesh.position.x = position[0] + (axis === 'x' ? offset : 0)
      mesh.position.y = position[1] + (axis === 'y' ? offset : 0)
      mesh.position.z = position[2] + (axis === 'z' ? offset : 0)
      // A cylinder is built along Y; a torus lies in XZ. Both need turning onto
      // their axis, and the two need DIFFERENT turns — which is why this is a
      // per-mode table rather than one clever expression.
      const half = Math.PI / 2
      if (mode === 'rotate') {
        mesh.rotation.x = axis === 'x' ? 0 : axis === 'z' ? half : 0
        mesh.rotation.z = axis === 'x' ? half : 0
      } else {
        mesh.rotation.x = axis === 'z' ? half : 0
        mesh.rotation.z = axis === 'x' ? half : 0
      }
      /*
        FORCE THE WORLD MATRIX. A mesh that has been positioned but not yet
        RENDERED has no world matrix, so a ray cast in the same frame finds it
        at the ORIGIN and answers confidently and wrongly.

        A manipulator is the worst possible case for that: it moves its handles
        and then immediately picks against them, so it can never wait for a
        render — and the editor's input loop deliberately runs even when the
        scene is paused. Measured, not assumed: without this, the handles picked
        as though they were at 0,0,0 while drawing correctly at the selection.
      */
      mesh.computeWorldMatrix(true)
    }
  }

  build()

  return {
    setMode(next) {
      if (next === mode) return
      mode = next
      build()
    },
    moveTo(next) {
      position = next
      place()
    },
    setVisible(visible) {
      for (const { mesh } of handles) mesh.isVisible = visible
    },
    nearestAxis(grip) {
      let best: Axis | null = null
      let bestDistance = NEAR_RADIUS * scale
      for (const { axis, mesh } of handles) {
        const d = Math.hypot(
          mesh.position.x - grip[0],
          mesh.position.y - grip[1],
          mesh.position.z - grip[2]
        )
        if (d <= bestDistance) {
          bestDistance = d
          best = axis
        }
      }
      return best
    },
    axisOf(mesh) {
      const meta = (mesh as { metadata?: Record<string, Axis> } | null)?.metadata
      return meta?.[HANDLE_TAG] ?? null
    },
    dispose() {
      for (const { mesh } of handles) mesh.dispose()
      handles.length = 0
    },
  }
}
