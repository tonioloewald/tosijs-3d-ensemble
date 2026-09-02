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
import type { EditorPointer, EditorRay } from "./pointer";
import type { Vec3 } from "../../format/types";

interface PickingScene {
  createPickingRay: (
    x: number,
    y: number,
    world: null,
    camera: unknown
  ) => {
    origin: { x: number; y: number; z: number };
    direction: { x: number; y: number; z: number };
  };
  activeCamera?: unknown;
}

/**
 * Adapts a canvas's pointer events into an `EditorPointer`.
 *
 * Listens on the CANVAS, not the window: a press that starts on a panel is the
 * panel's, and a tool that also saw it would act on a click meant for a button.
 */
export class FlatPointer implements EditorPointer {
  readonly id = "primary" as const;
  readonly kind = "flat" as const;

  private x = 0;
  private y = 0;
  private down = false;
  /** A press the hub has not sampled yet. See `endPoll`. */
  private latched = false;
  private alt = false;
  /**
   * Every TOUCH currently down, by id.
   *
   * A count, not a boolean, because "how many fingers" is the whole question:
   * one is a tool gesture, two is the camera's.
   *
   * Touch only, and that matters. Counting every pointer meant a mouse could
   * be stood down by an unrelated press elsewhere on the page, and worse, an
   * id that never got its `pointerup` — a press whose target stopped
   * propagation, a drag that ended over another window — left the set
   * permanently non-empty, so EVERY later click read as a second finger and
   * did nothing. Reported from a laptop as "trouble selecting things" and
   * "clicking the manipulators usually doesn't register". A mouse cannot make
   * a two-finger gesture, so it has no business in this set.
   */
  private readonly contacts = new Set<number>();
  /**
   * A multi-touch gesture is in progress and this pointer has stood down.
   *
   * Stays true until EVERY finger lifts. Clearing it when the count drops back
   * to one would restart a drag halfway through a pan, from wherever the
   * remaining finger happened to be.
   */
  private yielded = false;
  /**
   * A tool has this gesture and must keep it, whatever else touches the screen.
   *
   * Set while the camera is captured — i.e. while a handle is actually being
   * dragged. Without it, ANY stray second contact killed a manipulation in
   * flight: the drag died the instant it started and the piece snapped back,
   * reported as "transform isn't working now… it just flashes". A second finger
   * arriving mid-manipulation is far more likely to be a palm, a thumb resting
   * on the bezel, or a stray touch than a genuine request to pan.
   *
   * A gesture that grabbed NOTHING is not exclusive, so two-finger pan still
   * works everywhere it matters — which is over the scene, not over a handle.
   */
  exclusive = false;
  private detach: () => void = () => {};

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: PickingScene
  ) {
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
    };
    /** Only a finger can be one of several contacts. */
    const isTouch = (e: PointerEvent) => e.pointerType === "touch";

    const down = (e: PointerEvent) => {
      move(e);
      /*
        A PRIMARY touch is the start of a fresh gesture, so the set is reset to
        it. That is the self-heal: any id stranded by a missing `pointerup`
        cannot outlive the next time a finger touches down alone.
      */
      if (isTouch(e)) {
        if (e.isPrimary) {
          this.contacts.clear();
          // The self-heal is only a heal if it clears the STATE too. Leaving
          // `yielded` set means the stranded id is forgotten and the pointer
          // stays stood down anyway, which is the same dead end one step later.
          this.yielded = false;
        }
        this.contacts.add(e.pointerId);
      }
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
        if (!this.exclusive) this.standDown();
        return;
      }
      if (this.yielded) return;
      // Button 0 only. A right-drag is the camera's, and stealing it makes the
      // scene un-navigable the moment a tool is active.
      if (e.button !== 0) return;
      /*
        Ctrl/⌘ + left-drag is the camera's PAN gesture — the mouse spelling of
        the same two-finger intent. Claiming it too meant a pan both moved the
        view and dragged whatever was under the pointer: two things happening
        for one gesture, with no way to ask for either.
      */
      if (e.ctrlKey || e.metaKey) return;
      this.down = true;
      this.latched = true;
      this.alt = e.shiftKey || e.altKey;
    };
    const up = (e: PointerEvent) => {
      this.contacts.delete(e.pointerId);
      if (this.contacts.size === 0) this.yielded = false;
      if (e.button !== 0) return;
      this.down = false;
      this.alt = false;
    };
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
      this.contacts.delete(e.pointerId);
      if (this.contacts.size === 0) this.yielded = false;
      this.down = false;
      this.alt = false;
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", down);
    // `down` on the canvas but the rest on the window: a second finger that
    // lands OUTSIDE the canvas still ends the gesture, and a release anywhere
    // still clears the contact. Tracking contacts only on the canvas leaves the
    // set permanently non-empty, which welds the pointer into `yielded`.
    // `up` goes on the window: releasing outside the canvas still ends the drag,
    // otherwise the tool keeps dragging with the button already released.
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    /*
      A second finger landing off-canvas still has to be counted, or the pointer
      never yields and the camera never pans. `down` is canvas-only on purpose —
      a press that starts on a panel belongs to the panel — so this listener
      counts contacts WITHOUT starting anything.
    */
    const contact = (e: PointerEvent) => {
      if (!isTouch(e) || this.contacts.has(e.pointerId)) return;
      this.contacts.add(e.pointerId);
      if (this.contacts.size > 1 && !this.exclusive) this.standDown();
    };
    window.addEventListener("pointerdown", contact);
    // Without this the browser claims touch gestures for panning and zooming
    // the PAGE, and the canvas never sees a coherent drag at all.
    canvas.style.touchAction = "none";
    this.detach = () => {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerdown", contact);
      window.removeEventListener("pointercancel", cancel);
    };
  }

  /**
   * Hand this gesture to the camera.
   *
   * `latched` goes too. Leaving it set means one more poll reads as active, so
   * the tool gets a final `move` at the second finger's position — a stray nudge
   * to the very piece the user was trying to stop touching.
   */
  private standDown(): void {
    this.yielded = true;
    this.down = false;
    this.latched = false;
    this.alt = false;
  }

  get active(): boolean {
    // The latch is what makes a click SHORTER THAN A FRAME survive: press and
    // release between two polls would otherwise read as "never pressed", and
    // the fastest clicks — the confident ones — would be the ones that go
    // missing.
    return this.down || this.latched;
  }

  /** The hub has sampled us; a completed press can stop pretending now. */
  endPoll(): void {
    if (!this.down) this.latched = false;
  }

  get secondary(): boolean {
    return this.alt;
  }

  ray(): EditorRay | null {
    const camera = this.scene.activeCamera;
    if (!camera || !this.canvas.isConnected) return null;
    const r = this.scene.createPickingRay(this.x, this.y, null, camera);
    return {
      origin: [r.origin.x, r.origin.y, r.origin.z],
      direction: [r.direction.x, r.direction.y, r.direction.z],
    };
  }

  /** A flat pointer is nowhere in the world, so it can never near-grab. */
  grip(): Vec3 | null {
    return null;
  }

  dispose(): void {
    this.detach();
  }
}
