/*#
# The flat pointer

Mouse, trackpad, pen and touch, adapted to [[Editor pointers]]. **This file is an
ADAPTER** — it is allowed to know about DOM events precisely so that nothing
above it has to.

It has no `grip()`, because a flat pointer has no position in the world: there
is nothing to reach out and hold with. Everything it does is far interaction,
which is why the ray/near split had to exist before the first tool was written.
*/
import type { EditorPointer, EditorRay } from './pointer'
import type { Vec3 } from '../../format/types'

interface PickingScene {
  createPickingRay: (
    x: number,
    y: number,
    world: null,
    camera: unknown
  ) => { origin: { x: number; y: number; z: number }; direction: { x: number; y: number; z: number } }
  activeCamera?: unknown
}

/**
 * Adapts a canvas's pointer events into an `EditorPointer`.
 *
 * Listens on the CANVAS, not the window: a press that starts on a panel is the
 * panel's, and a tool that also saw it would act on a click meant for a button.
 */
export class FlatPointer implements EditorPointer {
  readonly id = 'primary' as const
  readonly kind = 'flat' as const

  private x = 0
  private y = 0
  private down = false
  /** A press the hub has not sampled yet. See `endPoll`. */
  private latched = false
  private alt = false
  private detach: () => void = () => {}

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: PickingScene
  ) {
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      this.x = e.clientX - rect.left
      this.y = e.clientY - rect.top
    }
    const down = (e: PointerEvent) => {
      move(e)
      // Button 0 only. A right-drag is the camera's, and stealing it makes the
      // scene un-navigable the moment a tool is active.
      if (e.button !== 0) return
      /*
        Ctrl/⌘ + left-drag is the camera's PAN gesture. Claiming it too meant a
        pan both moved the view and dragged whatever was under the pointer —
        two things happening for one gesture, with no way to ask for either.
      */
      if (e.ctrlKey || e.metaKey) return
      this.down = true
      this.latched = true
      this.alt = e.shiftKey || e.altKey
    }
    const up = (e: PointerEvent) => {
      if (e.button !== 0) return
      this.down = false
      this.alt = false
    }
    /*
      POINTERCANCEL IS NOT OPTIONAL ON TOUCH.

      The browser fires it when it takes a gesture over — a scroll, a pinch, a
      swipe from the edge — and no `pointerup` ever follows. Without this the
      pointer stays stuck DOWN forever, so the next tap continues a drag the
      finger abandoned, and the one after that behaves as though the button is
      welded on. A mouse almost never produces it, which is why this survived
      until someone used a touchscreen.
    */
    const cancel = () => {
      this.down = false
      this.alt = false
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerdown', down)
    // `up` goes on the window: releasing outside the canvas still ends the drag,
    // otherwise the tool keeps dragging with the button already released.
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    // Without this the browser claims touch gestures for panning and zooming
    // the PAGE, and the canvas never sees a coherent drag at all.
    canvas.style.touchAction = 'none'
    this.detach = () => {
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
    }
  }

  get active(): boolean {
    // The latch is what makes a click SHORTER THAN A FRAME survive: press and
    // release between two polls would otherwise read as "never pressed", and
    // the fastest clicks — the confident ones — would be the ones that go
    // missing.
    return this.down || this.latched
  }

  /** The hub has sampled us; a completed press can stop pretending now. */
  endPoll(): void {
    if (!this.down) this.latched = false
  }

  get secondary(): boolean {
    return this.alt
  }

  ray(): EditorRay | null {
    const camera = this.scene.activeCamera
    if (!camera || !this.canvas.isConnected) return null
    const r = this.scene.createPickingRay(this.x, this.y, null, camera)
    return {
      origin: [r.origin.x, r.origin.y, r.origin.z],
      direction: [r.direction.x, r.direction.y, r.direction.z],
    }
  }

  /** A flat pointer is nowhere in the world, so it can never near-grab. */
  grip(): Vec3 | null {
    return null
  }

  dispose(): void {
    this.detach()
  }
}
