import { describe, expect, it } from "bun:test";
import { PointerHub, closestPointOnRay, distance, pointOnRay } from "./pointer";
import type { EditorPointer, EditorRay, Gesture } from "./pointer";
import type { Vec3 } from "../../format/types";

class FakePointer implements EditorPointer {
  active = false;
  secondary = false;
  polls = 0;
  constructor(
    readonly id: "primary" | "left" | "right",
    readonly kind: "flat" | "xr" = "xr",
    private readonly at: Vec3 = [0, 0, 0]
  ) {}
  ray(): EditorRay | null {
    return { origin: this.at, direction: [0, 0, 1] };
  }
  grip(): Vec3 | null {
    return this.kind === "xr" ? this.at : null;
  }
  endPoll(): void {
    this.polls++;
  }
}

/** A source whose press can be shorter than one frame — a real fast click. */
class LatchingPointer implements EditorPointer {
  readonly id = "primary" as const;
  readonly kind = "flat" as const;
  private down = false;
  private latched = false;
  press(): void {
    this.down = true;
    this.latched = true;
  }
  release(): void {
    this.down = false;
  }
  get active(): boolean {
    return this.down || this.latched;
  }
  get secondary(): boolean {
    return false;
  }
  ray(): EditorRay | null {
    return { origin: [0, 0, 0], direction: [0, 0, 1] };
  }
  grip(): Vec3 | null {
    return null;
  }
  endPoll(): void {
    if (!this.down) this.latched = false;
  }
}

describe("PointerHub", () => {
  it("binds the pointer that started as PRIMARY, and the other as helper", () => {
    const hub = new PointerHub();
    const left = new FakePointer("left");
    const right = new FakePointer("right");
    hub.add(left);
    hub.add(right);
    const seen: Gesture[] = [];
    hub.setHandlers({ onStart: (g) => seen.push(g) });

    // The RIGHT hand pulls first, so it is primary — not because it is the right.
    right.active = true;
    hub.update();
    expect(seen[0]!.primary).toBe(right);
    expect(seen[0]!.helper).toBe(left);
  });

  it("is symmetric — either hand can be primary", () => {
    const hub = new PointerHub();
    const left = new FakePointer("left");
    const right = new FakePointer("right");
    hub.add(left);
    hub.add(right);
    // Collected rather than assigned: TypeScript narrows a `let` written only
    // inside a callback to its initialiser, so `expect(primary).toBe(left)`
    // fails to compile against `null` even though it passes at runtime.
    const started: EditorPointer[] = [];
    hub.setHandlers({ onStart: (g) => started.push(g.primary) });
    left.active = true;
    hub.update();
    expect(started[0]).toBe(left);
  });

  it("captures the start pose, so a drag cannot follow the wrong hand", () => {
    const hub = new PointerHub();
    const p = new FakePointer("right", "xr", [1, 2, 3]);
    hub.add(p);
    let start: Gesture | null = null;
    hub.setHandlers({ onStart: (g) => (start = g) });
    p.active = true;
    hub.update();
    expect(start!.startGrip).toEqual([1, 2, 3]);
  });

  it("moves while held and ends when released", () => {
    const hub = new PointerHub();
    const p = new FakePointer("primary", "flat");
    hub.add(p);
    const log: string[] = [];
    hub.setHandlers({
      onStart: () => log.push("start"),
      onMove: () => log.push("move"),
      onEnd: () => log.push("end"),
    });
    p.active = true;
    hub.update();
    hub.update();
    p.active = false;
    hub.update();
    expect(log).toEqual(["start", "move", "end"]);
  });

  it("ends the gesture when tools are switched mid-drag", () => {
    // Otherwise the outgoing tool never sees the release and stays mid-drag
    // forever — the next click then continues a drag the author had abandoned.
    const hub = new PointerHub();
    const p = new FakePointer("primary", "flat");
    hub.add(p);
    let ended = 0;
    hub.setHandlers({ onEnd: () => ended++ });
    p.active = true;
    hub.update();
    hub.setHandlers({});
    expect(ended).toBe(1);
    expect(hub.current).toBeNull();
  });

  it("does not miss a click shorter than one frame", () => {
    // Press AND release between two polls. Without a latch this reads as
    // "never pressed" and the fastest clicks are the ones that vanish.
    const hub = new PointerHub();
    const p = new LatchingPointer();
    hub.add(p);
    const log: string[] = [];
    hub.setHandlers({
      onStart: () => log.push("start"),
      onEnd: () => log.push("end"),
    });
    p.press();
    p.release();
    hub.update();
    hub.update();
    expect(log).toEqual(["start", "end"]);
  });

  it("tells pointers when it has finished sampling them", () => {
    const hub = new PointerHub();
    const p = new FakePointer("primary", "flat");
    hub.add(p);
    hub.update();
    hub.update();
    expect(p.polls).toBe(2);
  });

  it("drops a removed pointer", () => {
    const hub = new PointerHub();
    const p = new FakePointer("right");
    const remove = hub.add(p);
    remove();
    p.active = true;
    let started = 0;
    hub.setHandlers({ onStart: () => started++ });
    hub.update();
    expect(started).toBe(0);
  });
});

describe("ray maths", () => {
  const ray: EditorRay = { origin: [0, 0, 0], direction: [0, 0, 1] };

  it("projects a point onto a ray as a distance along it", () => {
    expect(closestPointOnRay(ray, [5, 5, 4])).toBe(4);
  });

  it("handles a degenerate ray rather than dividing by zero", () => {
    expect(
      closestPointOnRay({ origin: [0, 0, 0], direction: [0, 0, 0] }, [1, 1, 1])
    ).toBe(0);
  });

  it("walks along a ray", () => {
    expect(pointOnRay(ray, 3)).toEqual([0, 0, 3]);
  });

  it("measures distance for the near-grab test", () => {
    expect(distance([0, 0, 0], [3, 4, 0])).toBe(5);
  });
});
