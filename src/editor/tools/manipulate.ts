/*#
# The manipulate tool

Translate, rotate and scale the selected piece — by pointing at a handle and
pulling the trigger, or by putting a hand inside one and squeezing. Both,
because an ensemble is routinely larger than arm's reach and either alone
concedes half the editor.

The mode, the snap steps and duplicate-on-drag are **options**, so they render
into the tool panel from this schema rather than being buttons someone drew.

## The drag writes twice, to two different places

- **during** the drag, to the live body, so the piece follows the hand. Which
  body — element or node — is [[Writing a transform to a live body]]'s fork, and
  the wrong branch fails silently rather than erroring.
- **on release**, to the ensemble JSON, snapped. The JSON is the truth; the
  scene is a view of it.

The release goes through `ctx.edit`, which **does** rebuild. That was not the
original plan — the idea was to skip the rebuild since the body already holds
the value — but measuring it settled the question the other way: the snap
happens on release, so the body would sit at 3.4 while the JSON said 3, and the
scene would disagree with the data by up to half a grid step after every drag.
Rebuilding costs a dispose-and-build per drag and buys exact agreement.

It is safe here because the rebuild happens AFTER the gesture ended. Rebuilding
*during* a drag would dispose the very node under the author's hand, which is
why copy-on-drag also defers to release.

## Duplicate-on-drag copies on RELEASE

Cloning at the start would mean rebuilding mid-gesture to bring the copy into
the scene, which disposes the node being dragged. Copying on release leaves the
original where it was and puts the copy at the dragged transform — the same
outcome, without pulling the floor out from under the drag.
*/
import {
  angleOnPlane,
  axisClosestApproach,
  axisVector,
  scaleFactor,
  snap,
  snapVec3,
  wrapDegrees,
} from '../handles'
import { writeTransform } from '../transform-write'
import type { WritableBody } from '../transform-write'
import { registerTool } from './tool-registry'
import { uniqueId } from './built-in'
import type { Axis, TransformMode } from '../handles'
import type { Gesture } from '../input/pointer'
import type { ToolContext } from './tool-registry'
import type { Euler, Piece, Vec3 } from '../../format/types'

/** What a drag needs to remember between its start and its end. */
interface Drag {
  axis: Axis
  mode: TransformMode
  pieceId: string
  /** The piece's authored transform when the drag began. */
  startAt: Vec3
  startRot: Euler
  startScale: number
  /** Where along the axis (or around it) the pointer started. */
  startValue: number
  /** The transform as it currently stands, in ensemble-local terms. */
  at: Vec3
  rot: Euler
  scale: number
}

let drag: Drag | null = null

/** Exposed so the editor can show handles only while something is selected. */
export function currentDrag(): Readonly<Drag> | null {
  return drag
}

export const MANIPULATE_SCHEMA = {
  type: 'object',
  title: 'Manipulate',
  properties: {
    mode: {
      type: 'string',
      title: 'Mode',
      enum: ['translate', 'rotate', 'scale'],
      default: 'translate',
    },
    gridSnap: {
      type: 'number',
      title: 'Grid snap',
      minimum: 0,
      maximum: 10,
      default: 1,
      'x-unit': 'm',
      description: '0 to move freely',
    },
    angleSnap: {
      type: 'number',
      title: 'Angle snap',
      minimum: 0,
      maximum: 90,
      default: 15,
      'x-unit': '°',
    },
    duplicate: {
      type: 'boolean',
      title: 'Copy on drag',
      default: false,
    },
  },
}

/**
 * Which handle a gesture grabbed.
 *
 * NEAR FIRST: if a hand is inside a handle, that is unambiguous and beats
 * whatever the same controller's ray happens to be crossing further away.
 */
export function resolveGrab(
  gesture: Gesture,
  near: (grip: Vec3) => Axis | null,
  far: (ray: { origin: Vec3; direction: Vec3 }) => Axis | null
): Axis | null {
  const grip = gesture.primary.grip()
  if (grip) {
    const axis = near(grip)
    if (axis) return axis
  }
  const ray = gesture.primary.ray()
  return ray ? far(ray) : null
}

export interface ManipulateHooks {
  /** Axis whose handle is within reach of a hand. */
  nearAxis(grip: Vec3): Axis | null
  /** Axis of the handle a ray hits. */
  farAxis(ray: { origin: Vec3; direction: Vec3 }): Axis | null
  /** The live body of a piece, for the during-drag write. */
  bodyOf(pieceId: string): WritableBody | null
  /** Where the piece sits in WORLD space (its local `at` plus the origin). */
  worldOrigin(): Vec3
}

export function registerManipulateTool(hooks: ManipulateHooks): void {
  registerTool({
    name: 'manipulate',
    label: 'Move',
    icon: 'move',
    optionsSchema: MANIPULATE_SCHEMA,
    onGesture: {
      start(gesture, ctx) {
        const piece = ctx.selection
        if (!piece) return
        const axis = resolveGrab(gesture, hooks.nearAxis, hooks.farAxis)
        if (!axis) return // grabbed nothing; leave selection alone
        const mode = (ctx.options.mode as TransformMode) ?? 'translate'
        const ray = gesture.primary.ray()
        if (!ray) return
        const origin = hooks.worldOrigin()
        const start = measure(mode, axis, origin, ray)
        if (start === null) return // parallel or behind — not a usable drag
        drag = {
          axis,
          mode,
          pieceId: piece.id,
          startAt: [...piece.at] as Vec3,
          startRot: [...(piece.rot ?? [0, 0, 0])] as Euler,
          startScale: piece.scale ?? 1,
          startValue: start,
          at: [...piece.at] as Vec3,
          rot: [...(piece.rot ?? [0, 0, 0])] as Euler,
          scale: piece.scale ?? 1,
        }
      },

      move(gesture, ctx) {
        if (!drag) return
        const ray = gesture.primary.ray()
        if (!ray) return
        const origin = hooks.worldOrigin()
        const now = measure(drag.mode, drag.axis, origin, ray)
        if (now === null) return
        apply(drag, now, ctx)
        const body = hooks.bodyOf(drag.pieceId)
        if (body) writeTransform(body, { at: worldAt(drag, origin), rot: drag.rot, scale: drag.scale })
      },

      end(_gesture, ctx) {
        const finished = drag
        drag = null
        if (!finished) return
        // Snap the VALUE, not the accumulated delta — see handles.ts.
        const grid = Number(ctx.options.gridSnap ?? 0)
        const angle = Number(ctx.options.angleSnap ?? 0)
        const at = snapVec3(finished.at, grid)
        const rot = finished.rot.map((a) => wrapDegrees(snap(a, angle))) as Euler
        const scale = finished.scale

        if (ctx.options.duplicate === true) {
          const source = ctx.ensemble.pieces.find((p) => p.id === finished.pieceId)
          if (!source) return
          const copy: Piece = { ...structuredClone(source), at, rot, scale }
          copy.id = uniqueId(
            source.id,
            ctx.ensemble.pieces.map((p) => p.id)
          )
          ctx.edit(`copy ${source.id}`, (ensemble) => ensemble.pieces.push(copy))
          ctx.select(copy.id)
          return
        }

        ctx.edit(`move ${finished.pieceId}`, (ensemble) => {
          const piece = ensemble.pieces.find((p) => p.id === finished.pieceId)
          if (!piece) return
          piece.at = at
          if (finished.mode === 'rotate') piece.rot = rot
          if (finished.mode === 'scale') piece.scale = scale
        })
      },
    },
  })
}

/** Where the pointer is, in the units this mode drags in. */
function measure(
  mode: TransformMode,
  axis: Axis,
  origin: Vec3,
  ray: { origin: Vec3; direction: Vec3 }
): number | null {
  return mode === 'rotate'
    ? angleOnPlane(origin, axis, ray)
    : axisClosestApproach(origin, axisVector(axis), ray)
}

/** Fold the pointer's current reading into the drag's running transform. */
function apply(state: Drag, now: number, _ctx: ToolContext): void {
  const index = state.axis === 'x' ? 0 : state.axis === 'y' ? 1 : 2
  if (state.mode === 'translate') {
    const delta = now - state.startValue
    state.at = [...state.startAt] as Vec3
    state.at[index] = state.startAt[index]! + delta
    return
  }
  if (state.mode === 'rotate') {
    const delta = wrapDegrees(now - state.startValue)
    state.rot = [...state.startRot] as Euler
    state.rot[index] = wrapDegrees(state.startRot[index]! + delta)
    return
  }
  state.scale = state.startScale * scaleFactor(state.startValue, now)
}

/** The drag's ensemble-local position expressed in world space. */
function worldAt(state: Drag, origin: Vec3): Vec3 {
  // `origin` is where the piece's body currently sits; the drag tracks the
  // piece's LOCAL `at`, so the world write is the delta applied to that origin.
  return [
    origin[0] + (state.at[0] - state.startAt[0]),
    origin[1] + (state.at[1] - state.startAt[1]),
    origin[2] + (state.at[2] - state.startAt[2]),
  ]
}
