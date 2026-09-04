/*#
# Editor pointers

A tool is written **once** and driven by a mouse or by a hand. That is the whole
point of this file: nothing downstream of it may name a mouse, a click, a screen
coordinate or a DOM event.

VR is not the initial focus, but starting flat-only is the trap — a flat-only
contract bakes mouse assumptions into every tool, and each one has to be found
and removed later. So the contract is XR-shaped from the start and the flat
pointer is simply its first implementation.

## What a pointer is

```typescript
interface EditorPointer {
  ray(): EditorRay | null   // far interaction: point at a thing
  grip(): Vec3 | null       // near interaction: reach out and hold it
  active: boolean           // trigger / primary button
  secondary: boolean        // squeeze / secondary button
}
```

Two ways to grab, because both are real: a hand inside a handle grabs it
directly, and anything out of reach is grabbed by pointing. An ensemble is
routinely larger than arm's reach, so near-grab alone would mean flying the
world around to edit it; ray alone throws away the thing a headset is for.

## Hands are symmetric until they aren't

There is no fixed "right hand is the tool". Whichever pointer starts a gesture
is its PRIMARY, and whatever else is present becomes the helper **for that
gesture**. That is what makes two-handed actions expressible later — dragging an
object along a path with one hand while the other drops keyframes — without a
left/right special case in every tool.
*/
/*{"parent":"Internals","order":1}*/
import type { Vec3 } from "../../format/types.js";

/** A world-space ray. Plain numbers: the engine does not belong in this contract. */
export interface EditorRay {
  origin: Vec3;
  direction: Vec3;
}

/**
 * Which pointer this is.
 *
 * `primary` is the flat pointer — deliberately not called "mouse", because a
 * trackpad, a pen and a touch all arrive through it.
 */
export type PointerId = "primary" | "left" | "right";

export interface EditorPointer {
  readonly id: PointerId;
  readonly kind: "flat" | "xr";
  /** World ray for FAR interaction, or null when this source has no aim yet. */
  ray(): EditorRay | null;
  /** World position of the hand for NEAR interaction. Null when there is no hand. */
  grip(): Vec3 | null;
  /** Primary action held (trigger, main button). */
  readonly active: boolean;
  /** Secondary action held (squeeze, alt button) — the modifier. */
  readonly secondary: boolean;
  /**
   * Called by the hub once per poll, AFTER it has read this pointer.
   *
   * A polled input can miss a press entirely: press and release both landing
   * between two frames leaves `active` false at every sample, and the click
   * never happened as far as the editor is concerned. A source that can be
   * faster than the frame rate latches its press and clears it here — which it
   * can only do safely once it knows the hub has seen it.
   */
  endPoll?(): void;
}

/**
 * One press-drag-release, bound to the pointer that started it.
 *
 * `helper` is whatever other pointer existed when this began. It is captured at
 * the start rather than looked up during, so a tool cannot accidentally follow
 * the wrong hand halfway through a drag.
 */
export interface Gesture {
  readonly primary: EditorPointer;
  readonly helper: EditorPointer | null;
  /** Where the primary's ray was when this started. */
  readonly startRay: EditorRay | null;
  /** Where the primary's hand was when this started, if it had one. */
  readonly startGrip: Vec3 | null;
}

export interface GestureHandlers {
  onStart?(gesture: Gesture): void;
  onMove?(gesture: Gesture): void;
  onEnd?(gesture: Gesture): void;
}

/**
 * Watches a set of pointers and turns "active went true/false" into gestures.
 *
 * Polled per frame rather than event-driven, because that is the only shape
 * BOTH sources can honestly take: a flat pointer has events, an XR trigger is a
 * float you read. Unifying at the lower common denominator means the tool layer
 * never learns which one it is talking to.
 */
export class PointerHub {
  private readonly pointers: EditorPointer[] = [];
  private active: Gesture | null = null;
  private handlers: GestureHandlers = {};

  add(pointer: EditorPointer): () => void {
    this.pointers.push(pointer);
    return () => {
      const i = this.pointers.indexOf(pointer);
      if (i >= 0) this.pointers.splice(i, 1);
    };
  }

  /** Route gestures to a tool. Replacing handlers ends any gesture in flight —
   *  switching tools mid-drag must not leave the old one half-way through. */
  setHandlers(handlers: GestureHandlers): void {
    this.endGesture();
    this.handlers = handlers;
  }

  get current(): Gesture | null {
    return this.active;
  }

  /** Call once per frame. */
  update(): void {
    if (this.active) {
      if (this.active.primary.active) this.handlers.onMove?.(this.active);
      else this.endGesture();
      this.endPoll();
      return;
    }
    // First pointer to go active owns the gesture; everyone else is its helper.
    const starter = this.pointers.find((p) => p.active);
    if (!starter) {
      this.endPoll();
      return;
    }
    const helper = this.pointers.find((p) => p !== starter) ?? null;
    this.active = {
      primary: starter,
      helper,
      startRay: starter.ray(),
      startGrip: starter.grip(),
    };
    this.handlers.onStart?.(this.active);
    this.endPoll();
  }

  private endPoll(): void {
    for (const pointer of this.pointers) pointer.endPoll?.();
  }

  /** End any gesture in flight. Safe to call when there is none. */
  endGesture(): void {
    if (!this.active) return;
    const gesture = this.active;
    this.active = null;
    this.handlers.onEnd?.(gesture);
  }
}

/** Distance between two points. Used for the near-grab test. */
export function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/**
 * The point on a ray closest to a given point, as a distance ALONG the ray.
 *
 * The building block for every drag: translate projects onto an axis, rotate
 * intersects a plane, and both start here.
 */
export function closestPointOnRay(ray: EditorRay, point: Vec3): number {
  const [ox, oy, oz] = ray.origin;
  const [dx, dy, dz] = ray.direction;
  const lengthSquared = dx * dx + dy * dy + dz * dz;
  if (lengthSquared === 0) return 0;
  return (
    ((point[0] - ox) * dx + (point[1] - oy) * dy + (point[2] - oz) * dz) /
    lengthSquared
  );
}

/** Point at `t` along a ray. */
export function pointOnRay(ray: EditorRay, t: number): Vec3 {
  return [
    ray.origin[0] + ray.direction[0] * t,
    ray.origin[1] + ray.direction[1] * t,
    ray.origin[2] + ray.direction[2] * t,
  ];
}
