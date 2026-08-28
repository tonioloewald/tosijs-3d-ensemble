/*#
# Manipulator handles

The visible part: three axis handles a pointer can grab, in whichever mode the
tool is in. tosijs-3d has no manipulator (UPSTREAM.md #3) and Babylon's
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
/*{"parent":"Internals","order":5}*/
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
    visibility: number
    scaling: { x: number; y: number; z: number }
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

/**
 * How much fatter the INVISIBLE pick target is than the handle you see.
 *
 * A translate handle is a 7.5 cm stick. That is the right thing to LOOK at —
 * a fat arrow hides the model you are positioning — and hopeless to HIT with a
 * fingertip, which covers roughly a centimetre of screen wherever it lands.
 * Reported from a phone as "I couldn't move a selection", which is exactly what
 * a handle you cannot touch feels like.
 *
 * So every handle carries a second, invisible mesh that is only there to be
 * picked. Mouse users benefit too: aiming at a 3 px cylinder was never good,
 * it was merely possible.
 */
const PICK_FATNESS = 5

export interface HandlesView {
  setMode(mode: TransformMode): void
  moveTo(position: Vec3): void
  /**
   * Resize the handles so they stay a constant size ON SCREEN.
   *
   * Called every frame with the distance from the camera. Without it the
   * handles are world-sized: correct at one camera distance and unusable at
   * every other. Framed on a 24 m ensemble, the fat pick target measured about
   * ELEVEN PIXELS across — which the owner reported, accurately, as "touching
   * the manipulator is very hit and mostly miss". A manipulator you cannot
   * reliably hit is not a manipulator.
   */
  setScale(scale: number): void
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
              { diameter: 1.6, thickness: 0.09, tessellation: 48 },
              s
            )
          : mode === 'scale'
            ? MeshBuilder.CreateBox(`${HANDLE_TAG}-${axis}`, { size: 0.22 }, s)
            : MeshBuilder.CreateCylinder(
                `${HANDLE_TAG}-${axis}`,
                { height: 1.1, diameter: 0.075, tessellation: 12 },
                s
              )
      ) as unknown as HandleMesh['mesh']
      mesh.material = material(axis)
      mesh.renderingGroupId = 1
      // The visible handle is NOT the pick target — the fat one below is.
      mesh.isPickable = false
      mesh.metadata = { [HANDLE_TAG]: axis }
      handles.push({ axis, mesh })

      const target = (
        mode === 'rotate'
          ? MeshBuilder.CreateTorus(
              `${HANDLE_TAG}-${axis}-pick`,
              {
                diameter: 1.6,
                thickness: 0.09 * PICK_FATNESS,
                tessellation: 24,
              },
              s
            )
          : mode === 'scale'
            ? MeshBuilder.CreateBox(
                `${HANDLE_TAG}-${axis}-pick`,
                { size: 0.22 * 2.2 },
                s
              )
            : MeshBuilder.CreateCylinder(
                `${HANDLE_TAG}-${axis}-pick`,
                {
                  height: 1.1,
                  diameter: 0.075 * PICK_FATNESS,
                  tessellation: 8,
                },
                s
              )
      ) as unknown as HandleMesh['mesh']
      /*
        `visibility = 0`, not `isVisible = false`: Babylon's picking skips
        meshes that are not visible, so hiding it the obvious way would make the
        pick target unpickable — which is the only thing it exists for.
      */
      target.visibility = 0
      target.isPickable = true
      target.metadata = { [HANDLE_TAG]: axis }
      handles.push({ axis, mesh: target })
    }
    place()
  }

  const place = () => {
    /*
      Scale is applied HERE, per frame, rather than baked into the geometry —
      rebuilding three meshes and their pick targets every frame to track the
      camera would be absurd, and `setMode` is the only thing that should ever
      rebuild.
    */
    const offset = mode === 'rotate' ? 0 : 0.75 * scale
    for (const { axis, mesh } of handles) {
      mesh.scaling.x = scale
      mesh.scaling.y = scale
      mesh.scaling.z = scale
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
    setScale(next) {
      // Same guard as `setMode`: this runs per frame, and re-placing six meshes
      // (each forcing a world matrix) for a scale that has not moved is pure
      // waste on the one loop that must never stutter.
      if (Math.abs(next - scale) < 1e-3) return
      scale = next
      place()
    },
    setVisible(visible) {
      // Pick targets stay at visibility 0 either way; only the drawn ones toggle.
      for (const { mesh } of handles) {
        if (mesh.visibility !== 0) mesh.isVisible = visible
      }
    },
    nearestAxis(grip) {
      let best: Axis | null = null
      /*
        A hand is a fixed size; the handles are not, since they now track the
        camera to stay constant on screen. So reach is the LARGER of what a hand
        needs and what the handle actually occupies — scaling the hand radius
        with the handle would shrink the grab volume to a centimetre exactly
        when you are close enough to reach for it.
      */
      let bestDistance = Math.max(NEAR_RADIUS, 0.5 * scale)
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
