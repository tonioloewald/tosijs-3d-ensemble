/*#
# The XR pointer

A WebXR controller adapted to [[Editor pointers]]. Like the flat pointer this is
an **adapter**: it knows about controllers so that no tool has to.

Written now, not later, and not stubbed. A stub would compile and let a tool
quietly assume a mouse — which is exactly the "we'll add VR after" failure this
project decided to avoid. It is **wired but unverified in a headset**; say so
rather than implying otherwise.

## Where each part comes from

| | |
|---|---|
| ray | the controller's `pointer` node — its aim, not its grip |
| grip | the controller's `grip` node, which is where the HAND is |
| trigger | `xr-standard-trigger` on the motion controller |
| squeeze | `xr-standard-squeeze` — the modifier |

The ray comes from `pointer` and the near-grab position from `grip` because they
are genuinely different poses: aim runs from the knuckles forward, while the
hand is a few centimetres back and lower. Using one for both is why some apps
feel like you are grabbing with a stick.
*/
/*{"parent":"Internals","order":3}*/
import type { EditorPointer, EditorRay, PointerId } from './pointer'
import type { Vec3 } from '../../format/types'

/** The shape we need from a `WebXRInputSource`, structurally typed. */
export interface XrControllerLike {
  inputSource?: { handedness?: string }
  pointer?: TransformLike
  grip?: TransformLike
  motionController?: {
    getComponent?: (id: string) => { value?: number; pressed?: boolean } | undefined
  }
}

interface TransformLike {
  getWorldMatrix?: () => { getTranslation?: () => { x: number; y: number; z: number } }
  absolutePosition?: { x: number; y: number; z: number }
  forward?: { x: number; y: number; z: number }
}

const TRIGGER = 'xr-standard-trigger'
const SQUEEZE = 'xr-standard-squeeze'
/** Below this a trigger is noise, not an intention. */
const PRESS_THRESHOLD = 0.5

const positionOf = (node: TransformLike | undefined): Vec3 | null => {
  const p = node?.absolutePosition
  return p ? [p.x, p.y, p.z] : null
}

export class XrPointer implements EditorPointer {
  readonly kind = 'xr' as const

  constructor(
    readonly id: Exclude<PointerId, 'primary'>,
    private readonly controller: XrControllerLike
  ) {}

  private component(id: string): number {
    const c = this.controller.motionController?.getComponent?.(id)
    if (!c) return 0
    return c.pressed ? 1 : (c.value ?? 0)
  }

  get active(): boolean {
    return this.component(TRIGGER) >= PRESS_THRESHOLD
  }

  get secondary(): boolean {
    return this.component(SQUEEZE) >= PRESS_THRESHOLD
  }

  ray(): EditorRay | null {
    const node = this.controller.pointer
    const origin = positionOf(node)
    const forward = node?.forward
    if (!origin || !forward) return null
    return { origin, direction: [forward.x, forward.y, forward.z] }
  }

  /** Where the hand is — the near-grab test position. */
  grip(): Vec3 | null {
    return positionOf(this.controller.grip ?? this.controller.pointer)
  }
}

/**
 * Build pointers for whatever controllers a session has.
 *
 * Returns an empty array outside XR, which is the honest answer: there are no
 * hands. The editor adds these to its `PointerHub` when a session starts and
 * drops them when it ends, so tools see hands appear and disappear rather than
 * needing to ask whether XR is running.
 */
export function xrPointers(controllers: XrControllerLike[]): XrPointer[] {
  return controllers
    .map((controller) => {
      const hand = controller.inputSource?.handedness
      if (hand !== 'left' && hand !== 'right') return null
      return new XrPointer(hand, controller)
    })
    .filter((p): p is XrPointer => p !== null)
}
