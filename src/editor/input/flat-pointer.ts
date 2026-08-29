/*#
# The flat pointer

Mouse, trackpad, pen and touch, adapted to [[Editor pointers]]. **This file is an
ADAPTER** — it is allowed to know about DOM events precisely so that nothing
above it has to.

It has no `grip()`, because a flat pointer has no position in the world: there
is nothing to reach out and hold with. Everything it does is far interaction,
which is why the ray/near split had to exist before the first tool was written.
*/
/*{"parent":"Internals","order":2}*/
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
  /**
   * Every pointer currently down, by id.
   *
   * A count, not a boolean, because "how many fingers" is the whole question:
   * one is a tool gesture, two is the camera's.
   */
  private readonly contacts = new Set<number>()
  /**
   * A multi-touch gesture is in progress and this pointer has stood down.
   *
   * Stays true until EVERY finger lifts. Clearing it when the count drops back
   * to one would restart a drag halfway through a pan, from wherever the
   * remaining finger happened to be.
   */
  private yielded = false
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
      this.contacts.add(e.pointerId)
      /*
        TWO FINGERS ARE THE CAMERA'S, NOT A TOOL'S.

        A second contact means pan or pinch, and the camera already implements
        both — but only if it SEES them. The first finger arrives as an ordinary
        press, so by the time the second lands a tool may already have grabbed a
        handle and detached the camera, and the pan goes nowhere.

        So the second contact stands this pointer down. The gesture in flight
        ends on the next poll, which hands the camera back, and nothing new
        starts until every finger has lifted.
      */
      if (this.contacts.size > 1) {
        this.yielded = true
        this.down = false
        this.alt = false
        return
      }
      if (this.yielded) return
      // Button 0 only. A right-drag is the camera's, and stealing it makes the
      // scene un-navigable the moment a tool is active.
      if (e.button !== 0) return
      /*
        Ctrl/⌘ + left-drag is the camera's PAN gesture — the mouse spelling of
        the same two-finger intent. Claiming it too meant a pan both moved the
        view and dragged whatever was under the pointer: two things happening
        for one gesture, with no way to ask for either.
      */
      if (e.ctrlKey || e.metaKey) return
      this.down = true
      this.latched = true
      this.alt = e.shiftKey || e.altKey
    }
    const up = (e: PointerEvent) => {
      this.contacts.delete(e.pointerId)
      if (this.contacts.size === 0) this.yielded = false
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
    const cancel = (e: PointerEvent) => {
      this.contacts.delete(e.pointerId)
      if (this.contacts.size === 0) this.yielded = false
      this.down = false
      this.alt = false
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerdown', down)
    // `down` on the canvas but the rest on the window: a second finger that
    // lands OUTSIDE the canvas still ends the gesture, and a release anywhere
    // still clears the contact. Tracking contacts only on the canvas leaves the
    // set permanently non-empty, which welds the pointer into `yielded`.
    // `up` goes on the window: releasing outside the canvas still ends the drag,
    // otherwise the tool keeps dragging with the button already released.
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    /*
      A second finger landing off-canvas still has to be counted, or the pointer
      never yields and the camera never pans. `down` is canvas-only on purpose —
      a press that starts on a panel belongs to the panel — so this listener
      counts contacts WITHOUT starting anything.
    */
    const contact = (e: PointerEvent) => {
      if (this.contacts.has(e.pointerId)) return
      this.contacts.add(e.pointerId)
      if (this.contacts.size > 1) {
        this.yielded = true
        this.down = false
        this.alt = false
      }
    }
    window.addEventListener('pointerdown', contact)
    // Without this the browser claims touch gestures for panning and zooming
    // the PAGE, and the canvas never sees a coherent drag at all.
    canvas.style.touchAction = 'none'
    this.detach = () => {
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointerdown', contact)
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
