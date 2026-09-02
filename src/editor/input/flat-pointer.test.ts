import { describe, expect, it } from "bun:test";
import { FlatPointer } from "./flat-pointer";

/*
  This file tests an ADAPTER, so it is allowed to know about DOM events —
  see the exemption list in `xr-shape.test.ts`. The behaviour under test is
  precisely the translation from events into a device-independent pointer, and
  there is nowhere else it can be checked.
*/

const scene = {
  activeCamera: {},
  createPickingRay: () => ({
    origin: { x: 0, y: 0, z: 0 },
    direction: { x: 0, y: 0, z: 1 },
  }),
};

const setup = () => {
  const canvas = document.createElement("canvas");
  canvas.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 100, height: 100 } as DOMRect);
  document.body.append(canvas);
  const pointer = new FlatPointer(
    canvas as unknown as HTMLCanvasElement,
    scene as never
  );
  return {
    canvas,
    pointer,
    cleanup: () => {
      pointer.dispose();
      canvas.remove();
    },
  };
};

const press = (id: number, extra: Record<string, unknown> = {}) =>
  new PointerEvent("pointerdown", {
    bubbles: true,
    pointerId: id,
    button: 0,
    pointerType: "touch",
    isPrimary: id === 1,
    ...extra,
  });
const mouse = (type: string, extra: Record<string, unknown> = {}) =>
  new PointerEvent(type, {
    bubbles: true,
    pointerId: 1,
    button: 0,
    pointerType: "mouse",
    isPrimary: true,
    ...extra,
  });
const release = (id: number) =>
  new PointerEvent("pointerup", { bubbles: true, pointerId: id, button: 0 });

describe("FlatPointer: one finger is a tool gesture", () => {
  it("goes active on a press and inactive on release", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    expect(pointer.active).toBe(true);
    window.dispatchEvent(release(1));
    pointer.endPoll();
    expect(pointer.active).toBe(false);
    cleanup();
  });
});

describe("FlatPointer: two fingers are the CAMERA’s", () => {
  it("stands down when a second finger lands, so pan and pinch reach the camera", () => {
    // The first finger arrives as an ordinary press, so a tool may already have
    // grabbed a handle and detached the camera by the time the second lands.
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    expect(pointer.active).toBe(true);
    canvas.dispatchEvent(press(2));
    pointer.endPoll();
    expect(pointer.active).toBe(false);
    cleanup();
  });

  it("stays stood down when one of the two lifts", () => {
    // Otherwise a drag restarts halfway through a pan, from wherever the
    // remaining finger happens to be.
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    canvas.dispatchEvent(press(2));
    pointer.endPoll();
    window.dispatchEvent(release(2));
    pointer.endPoll();
    expect(pointer.active).toBe(false);
    cleanup();
  });

  it("accepts a fresh gesture once every finger has lifted", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    canvas.dispatchEvent(press(2));
    window.dispatchEvent(release(1));
    window.dispatchEvent(release(2));
    pointer.endPoll();
    canvas.dispatchEvent(press(3));
    expect(pointer.active).toBe(true);
    cleanup();
  });

  it("counts a second finger that lands OFF the canvas", () => {
    // `pointerdown` is canvas-only on purpose — a press on a panel is the
    // panel's — but a contact anywhere still has to be counted, or the pointer
    // never yields and the camera never pans.
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    window.dispatchEvent(press(2));
    pointer.endPoll();
    expect(pointer.active).toBe(false);
    cleanup();
  });

  it("does not weld itself shut when contacts end outside the canvas", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    window.dispatchEvent(press(2));
    window.dispatchEvent(release(1));
    window.dispatchEvent(release(2));
    pointer.endPoll();
    canvas.dispatchEvent(press(4));
    expect(pointer.active).toBe(true);
    cleanup();
  });

  it("clears the contact on pointercancel, which touch fires instead of up", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    canvas.dispatchEvent(press(2));
    window.dispatchEvent(
      new PointerEvent("pointercancel", { bubbles: true, pointerId: 1 })
    );
    window.dispatchEvent(
      new PointerEvent("pointercancel", { bubbles: true, pointerId: 2 })
    );
    pointer.endPoll();
    canvas.dispatchEvent(press(5));
    expect(pointer.active).toBe(true);
    cleanup();
  });
});

describe("FlatPointer: an exclusive gesture survives a stray contact", () => {
  it("keeps a manipulation alive when a second finger lands", () => {
    /*
      A tool marks the gesture exclusive once it has grabbed a handle. Before
      this, ANY second contact killed the drag the instant it arrived and the
      piece snapped back — reported as "transform isn't working now… it just
      flashes". Mid-manipulation, a second contact is far more likely to be a
      palm or a resting thumb than a request to pan.
    */
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    pointer.exclusive = true;
    canvas.dispatchEvent(press(2));
    pointer.endPoll();
    expect(pointer.active).toBe(true);
    cleanup();
  });

  it("yields again once the tool releases the gesture", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    pointer.exclusive = true;
    window.dispatchEvent(release(1));
    pointer.exclusive = false;
    pointer.endPoll();
    canvas.dispatchEvent(press(2));
    canvas.dispatchEvent(press(3));
    pointer.endPoll();
    expect(pointer.active).toBe(false);
    cleanup();
  });
});

describe("FlatPointer: a mouse is never a second finger", () => {
  it("is not stood down by another press somewhere on the page", () => {
    /*
      Counting every pointer, not just touches, meant an id that never got its
      `pointerup` — a press whose target stopped propagation, a drag released
      over another window — stranded the set non-empty, and every later click
      read as a second finger and did nothing at all. From a laptop: "trouble
      selecting things… clicking the manipulators usually doesn't register".
    */
    const { canvas, pointer, cleanup } = setup();
    window.dispatchEvent(mouse("pointerdown"));
    canvas.dispatchEvent(mouse("pointerdown"));
    expect(pointer.active).toBe(true);
    cleanup();
  });

  it("recovers even after a touch id is stranded without its release", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1));
    canvas.dispatchEvent(press(2)); // second finger: stands down, as it should
    pointer.endPoll();
    expect(pointer.active).toBe(false);
    // Neither release ever arrives. The next primary touch must still work.
    canvas.dispatchEvent(press(1));
    expect(pointer.active).toBe(true);
    cleanup();
  });
});

describe("FlatPointer: the camera keeps its own gestures", () => {
  it("ignores ⌃drag, the mouse spelling of the same pan intent", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(press(1, { ctrlKey: true }));
    expect(pointer.active).toBe(false);
    cleanup();
  });

  it("ignores a right-drag", () => {
    const { canvas, pointer, cleanup } = setup();
    canvas.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        pointerId: 1,
        button: 2,
      })
    );
    expect(pointer.active).toBe(false);
    cleanup();
  });
});
