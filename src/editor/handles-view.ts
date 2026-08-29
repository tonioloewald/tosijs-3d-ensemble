/*#
# Manipulator handles

The visible part: a **universal widget**, in the sense Cheetah 3D means it.
Every enabled affordance is on screen at once and the part you grab is what says
what the drag means — drag a shaft to move along an axis, a pad to move in a
plane, a ring to turn, a cube to scale. tosijs-3d has no manipulator
(UPSTREAM.md #3) and Babylon's `GizmoManager` is mouse-shaped, so this is built
here — and built so a **hand** can grab it, not only a ray.

## Why one widget instead of a mode

A mode switch makes you say what you want twice: once to the toolbar and again
to the handle. It also costs a round trip for the commonest edit there is —
nudge it over, then turn it a bit. The cost is crowding, and the answer to that
is the transform set: turn off what you are not using and its grips are simply
not built. That is the same dial that makes this usable on a touchscreen, where
thirteen grips genuinely is too many.

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
import { axisIndex, noTransforms, otherAxes } from './handles'
import type { Axis, Grip, GripKind, TransformSet } from './handles'
import type { Vec3 } from '../format/types'

/** Marks a mesh as ours, so picking can tell a handle from the scene. */
export const HANDLE_TAG = 'ensemble-editor-handle'

interface HandleMesh {
  grip: Grip
  mesh: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scaling: { x: number; y: number; z: number }
    isVisible: boolean
    visibility: number
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

const NEUTRAL: [number, number, number] = [0.85, 0.85, 0.88]

/** How close a HAND has to be, in metres, to grab a handle directly. */
export const NEAR_RADIUS = 0.18

/**
 * How much fatter the INVISIBLE pick target is than the handle you see.
 *
 * A translate handle is a thin stick. That is the right thing to LOOK at — a
 * fat arrow hides the model you are positioning — and hopeless to HIT with a
 * fingertip, which covers roughly a centimetre of screen wherever it lands.
 * Reported from a phone as "I couldn't move a selection", which is exactly what
 * a handle you cannot touch feels like.
 *
 * So every handle carries a second, invisible mesh that is only there to be
 * picked. Mouse users benefit too: aiming at a 3 px cylinder was never good,
 * it was merely possible.
 */
const PICK_FATNESS = 5

/**
 * Where each grip sits, at unit scale. One table, so the layout can be read.
 *
 * Ordered outward from the centre — pads, shafts, rings, then scale cubes —
 * which is Cheetah 3D's arrangement and the reason its widget stays readable
 * with everything switched on. The rings go OUTSIDE the shafts they share a
 * widget with; nesting them the other way puts the largest target on top of
 * the smallest, and the smallest is the one you were aiming at.
 *
 * This matters for CROWDING, not for correctness. Every grip is picked by its
 * own fat invisible twin, so a bad layout does not break a drag — it just makes
 * you fight for the one you wanted.
 */
const SHAFT_LENGTH = 1.1
const SHAFT_OFFSET = 0.75
const PAD_OFFSET = 0.34
const PAD_SIZE = 0.32
const RING_DIAMETER = 2.4
const RING_THICKNESS = 0.09
const CUBE_SIZE = 0.17
const CUBE_OFFSET = 1.6
const CENTRE_SIZE = 0.2

/**
 * The rings get a THINNER pick tube than everything else.
 *
 * `PICK_FATNESS` is a multiplier on a radius, and a ring's radius sweeps a
 * whole torus: at 5× the pick tube spans nearly the full width of the widget
 * and swallows the scale cubes and shaft ends sitting outside it. A ring is
 * also the easiest thing here to hit — it is the biggest target on screen —
 * so it can afford to be the least inflated.
 */
const RING_PICK_FATNESS = 3

export interface HandlesView {
  /** Rebuild for a new transform set. Cheap no-op when nothing changed. */
  setTransforms(transforms: TransformSet): void
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
  /** The grip within `NEAR_RADIUS` of a hand, if any. */
  nearestGrip(hand: Vec3): Grip | null
  /** The grip a handle mesh belongs to, for resolving a ray pick. */
  gripOf(mesh: unknown): Grip | null
  dispose(): void
}

/**
 * Build handles into a scene.
 *
 * Geometry is built at UNIT size and scaled per frame by `setScale` — three
 * meshes and their pick targets rebuilt every frame to track the camera would
 * be absurd, and `setTransforms` is the only thing that should ever rebuild.
 */
export function createHandles(scene: unknown, scale = 1): HandlesView {
  const s = scene as never
  const handles: HandleMesh[] = []
  const materials: Array<{ dispose: () => void }> = []
  let position: Vec3 = [0, 0, 0]
  let transforms: TransformSet = { translate: true, rotate: false, scale: false }

  const material = (key: string, colour: [number, number, number], alpha = 1) => {
    const m = new StandardMaterial(`${HANDLE_TAG}-${key}`, s) as unknown as {
      emissiveColor: Color3
      disableLighting: boolean
      alpha: number
      backFaceCulling: boolean
      dispose: () => void
    }
    const [r, g, b] = colour
    // Emissive and unlit: a handle must read the same against a bright sky and
    // a dark hull, and it is UI rather than part of the scene.
    m.emissiveColor = new Color3(r, g, b)
    m.disableLighting = true
    m.alpha = alpha
    // A plane pad is a flat quad and gets looked at from both sides; without
    // this it vanishes from half the orbit, which reads as a missing handle.
    m.backFaceCulling = false
    materials.push(m)
    return m
  }

  /** The drawn mesh and its fat invisible twin, both tagged with the grip. */
  const add = (
    grip: Grip,
    make: (name: string, fatness: number) => unknown,
    colour: [number, number, number],
    alpha = 1
  ) => {
    const key = `${grip.kind}-${grip.axis ?? 'all'}`
    const mesh = make(`${HANDLE_TAG}-${key}`, 1) as HandleMesh['mesh']
    mesh.material = material(key, colour, alpha)
    mesh.renderingGroupId = 1
    // The visible handle is NOT the pick target — the fat one below is.
    mesh.isPickable = false
    mesh.metadata = { [HANDLE_TAG]: grip }
    handles.push({ grip, mesh })

    const target = make(`${HANDLE_TAG}-${key}-pick`, PICK_FATNESS) as HandleMesh['mesh']
    /*
      `visibility = 0`, not `isVisible = false`: Babylon's picking skips meshes
      that are not visible, so hiding it the obvious way would make the pick
      target unpickable — which is the only thing it exists for.
    */
    target.visibility = 0
    target.isPickable = true
    target.metadata = { [HANDLE_TAG]: grip }
    handles.push({ grip, mesh: target })
  }

  const build = () => {
    for (const h of handles) h.mesh.dispose()
    for (const m of materials) m.dispose()
    handles.length = 0
    materials.length = 0

    for (const axis of ['x', 'y', 'z'] as Axis[]) {
      const colour = AXIS_COLOR[axis]

      if (transforms.translate) {
        add(
          { kind: 'translate', axis },
          (name, fat) =>
            MeshBuilder.CreateCylinder(
              name,
              { height: SHAFT_LENGTH, diameter: 0.075 * fat, tessellation: fat > 1 ? 8 : 12 },
              s
            ),
          colour
        )
        // The plane pad's axis is the plane's NORMAL, so this one reads as
        // "the pad you slide across while that axis stays put".
        add(
          { kind: 'planar', axis },
          (name, fat) =>
            MeshBuilder.CreatePlane(name, { size: PAD_SIZE * (fat > 1 ? 1.6 : 1) }, s),
          colour,
          0.35
        )
      }

      if (transforms.rotate) {
        add(
          { kind: 'rotate', axis },
          (name, fat) =>
            MeshBuilder.CreateTorus(
              name,
              {
                diameter: RING_DIAMETER,
                thickness: RING_THICKNESS * (fat > 1 ? RING_PICK_FATNESS : 1),
                tessellation: fat > 1 ? 24 : 48,
              },
              s
            ),
          colour
        )
      }

      if (transforms.scale) {
        add(
          { kind: 'scale', axis },
          (name, fat) => MeshBuilder.CreateBox(name, { size: CUBE_SIZE * (fat > 1 ? 2.2 : 1) }, s),
          colour
        )
      }
    }

    if (transforms.scale) {
      add(
        { kind: 'uniform' },
        (name, fat) => MeshBuilder.CreateBox(name, { size: CENTRE_SIZE * (fat > 1 ? 2 : 1) }, s),
        NEUTRAL
      )
    }

    place()
  }

  const place = () => {
    const half = Math.PI / 2
    for (const { grip, mesh } of handles) {
      mesh.scaling.x = scale
      mesh.scaling.y = scale
      mesh.scaling.z = scale
      mesh.rotation.x = 0
      mesh.rotation.y = 0
      mesh.rotation.z = 0

      const offset: Vec3 = [0, 0, 0]
      if (grip.axis) {
        const i = axisIndex(grip.axis)
        if (grip.kind === 'translate') offset[i] = SHAFT_OFFSET
        if (grip.kind === 'scale') offset[i] = CUBE_OFFSET
        if (grip.kind === 'planar') {
          // Out along BOTH in-plane axes, so the pad sits in the quadrant
          // between the two shafts it moves you along.
          const [u, v] = otherAxes(grip.axis)
          offset[axisIndex(u)] = PAD_OFFSET
          offset[axisIndex(v)] = PAD_OFFSET
        }
      }
      mesh.position.x = position[0] + offset[0] * scale
      mesh.position.y = position[1] + offset[1] * scale
      mesh.position.z = position[2] + offset[2] * scale

      /*
        A cylinder is built along Y, a torus lies in XZ, a plane faces +Z. All
        three need turning onto their axis and the three need DIFFERENT turns,
        which is why this is a per-kind table rather than one clever expression.
      */
      if (grip.kind === 'translate' || grip.kind === 'scale') {
        if (grip.axis === 'x') mesh.rotation.z = half
        if (grip.axis === 'z') mesh.rotation.x = half
      } else if (grip.kind === 'rotate') {
        if (grip.axis === 'x') mesh.rotation.z = half
        if (grip.axis === 'z') mesh.rotation.x = half
      } else if (grip.kind === 'planar') {
        // A plane faces +Z, so the pad whose NORMAL is z needs no turn at all.
        if (grip.axis === 'x') mesh.rotation.y = half
        if (grip.axis === 'y') mesh.rotation.x = half
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
    setTransforms(next) {
      if (
        next.translate === transforms.translate &&
        next.rotate === transforms.rotate &&
        next.scale === transforms.scale
      ) {
        return
      }
      transforms = { ...next }
      build()
    },
    moveTo(next) {
      position = next
      place()
    },
    setScale(next) {
      // Same guard as `setTransforms`: this runs per frame, and re-placing every
      // mesh (each forcing a world matrix) for a scale that has not moved is
      // pure waste on the one loop that must never stutter.
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
    nearestGrip(hand) {
      let best: Grip | null = null
      /*
        A hand is a fixed size; the handles are not, since they track the camera
        to stay constant on screen. So reach is the LARGER of what a hand needs
        and what the handle actually occupies — scaling the hand radius with the
        handle would shrink the grab volume to a centimetre exactly when you are
        close enough to reach for it.
      */
      let bestDistance = Math.max(NEAR_RADIUS, 0.5 * scale)
      for (const { grip, mesh } of handles) {
        const d = Math.hypot(
          mesh.position.x - hand[0],
          mesh.position.y - hand[1],
          mesh.position.z - hand[2]
        )
        if (d <= bestDistance) {
          bestDistance = d
          best = grip
        }
      }
      return best
    },
    gripOf(mesh) {
      const meta = (mesh as { metadata?: Record<string, Grip> } | null)?.metadata
      return meta?.[HANDLE_TAG] ?? null
    },
    dispose() {
      for (const { mesh } of handles) mesh.dispose()
      for (const m of materials) m.dispose()
      handles.length = 0
      materials.length = 0
    },
  }
}

/** Whether a transform set would draw anything at all. */
export const drawsNothing = noTransforms

/** Every grip kind the widget can build, for tests and for a palette. */
export const GRIP_KINDS: GripKind[] = ['translate', 'planar', 'rotate', 'scale', 'uniform']
