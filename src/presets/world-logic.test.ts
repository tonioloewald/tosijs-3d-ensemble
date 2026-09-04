import { describe, expect, it } from "bun:test";
import {
  canUse,
  closedDoor,
  doorAmount,
  ease,
  flicker,
  selectClip,
  spinAngle,
  stepDoor,
  unlocks,
} from "./world-logic.js";
import type { DoorState } from "./world-logic.js";

const run = (
  state: DoorState,
  steps: number,
  dt: number,
  wants: boolean,
  seconds = 1
) => {
  let s = state;
  for (let i = 0; i < steps; i++) s = stepDoor(s, dt, { seconds }, wants);
  return s;
};

describe("doors", () => {
  it("opens when something wants it open, and stays open", () => {
    const s = run(closedDoor(), 12, 0.1, true);
    expect(s.phase).toBe("open");
    expect(s.progress).toBe(1);
  });

  it("turns around mid-swing when the opener walks away", () => {
    // Checked every step, not only on transitions: a door whose opener leaves
    // should reverse rather than complete a journey nobody wants.
    const half = run(closedDoor(), 5, 0.1, true);
    expect(half.phase).toBe("opening");
    const reversing = stepDoor(half, 0.1, { seconds: 1 }, false);
    expect(reversing.phase).toBe("closing");
    // It moves on the reversing frame too — changing direction must not cost a
    // frame of travel, or a door runs slower wherever frames are larger.
    expect(reversing.progress).toBeLessThan(half.progress);
  });

  it("reopens from a partial close without jumping", () => {
    const closing = stepDoor(
      run(closedDoor(), 8, 0.1, true),
      0.2,
      { seconds: 1 },
      false
    );
    const reopening = stepDoor(closing, 0.1, { seconds: 1 }, true);
    expect(reopening.phase).toBe("opening");
    expect(reopening.progress).toBeGreaterThan(closing.progress);
    // and it resumes from where it was, rather than snapping shut or open
    expect(reopening.progress).toBeLessThan(1);
  });

  it("holds open for autoClose seconds, then closes itself", () => {
    let s = run(closedDoor(), 12, 0.1, true);
    s = stepDoor(s, 1, { seconds: 1, autoClose: 3 }, false);
    expect(s.phase).toBe("open");
    s = stepDoor(s, 2.5, { seconds: 1, autoClose: 3 }, false);
    expect(s.phase).toBe("closing");
  });

  it("stays open indefinitely when autoClose is 0 and something still wants it", () => {
    let s = run(closedDoor(), 12, 0.1, true);
    for (let i = 0; i < 50; i++)
      s = stepDoor(s, 1, { seconds: 1, autoClose: 0 }, true);
    expect(s.phase).toBe("open");
  });

  it("takes the same time however the frames fall", () => {
    // One long frame and many short ones must land in the same place, or a
    // door runs at a different speed on a slower machine.
    const many = run(closedDoor(), 100, 0.01, true);
    const few = run(closedDoor(), 2, 0.5, true);
    expect(many.phase).toBe(few.phase);
    expect(many.progress).toBe(few.progress);
  });

  it("eases rather than travelling linearly", () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.5)).toBe(0.5);
    expect(ease(0.25)).toBeLessThan(0.25); // slow to start
    expect(doorAmount({ phase: "opening", progress: 1, elapsed: 0 }, 90)).toBe(
      90
    );
  });
});

describe("locks", () => {
  it("opens for the right key", () => {
    expect(unlocks({ locked: true, key: "brass" }, "brass")).toBe(true);
  });

  it("refuses the wrong key", () => {
    expect(unlocks({ locked: true, key: "brass" }, "iron")).toBe(false);
  });

  it("does NOT open a keyless lock for an empty-handed caller", () => {
    // `undefined === undefined` would make every keyless lock an open door for
    // anyone carrying nothing. That comparison is why this function exists.
    expect(unlocks({ locked: true }, undefined)).toBe(false);
    expect(unlocks({ locked: true }, "brass")).toBe(false);
  });

  it("is open when it is not locked, key or no key", () => {
    expect(unlocks({ locked: false }, undefined)).toBe(true);
  });
});

describe("reach", () => {
  it("needs you close enough", () => {
    expect(canUse({ reach: 2, enabled: true }, 1.9)).toBe(true);
    expect(canUse({ reach: 2, enabled: true }, 2.1)).toBe(false);
  });

  it("treats reach 0 as unlimited", () => {
    expect(canUse({ reach: 0, enabled: true }, 1000)).toBe(true);
  });

  it("refuses when disabled, however close you are", () => {
    expect(canUse({ reach: 5, enabled: false }, 0)).toBe(false);
  });
});

describe("flicker", () => {
  it("is perfectly steady at amount 0", () => {
    expect(flicker(2, 0, 123.4)).toBe(2);
  });

  it("is deterministic, so two clients see the same flame", () => {
    // Math.random() here would desync every viewer and make this untestable.
    expect(flicker(1, 0.5, 3.2, 7)).toBe(flicker(1, 0.5, 3.2, 7));
  });

  it("varies over time and never goes negative", () => {
    const samples = [0, 0.1, 0.2, 0.3, 0.4].map((t) => flicker(1, 0.9, t));
    expect(new Set(samples).size).toBeGreaterThan(1);
    for (const s of samples) expect(s).toBeGreaterThanOrEqual(0);
  });

  it("differs between seeds, so two lamps do not pulse in unison", () => {
    expect(flicker(1, 0.5, 2, 1)).not.toBe(flicker(1, 0.5, 2, 2));
  });
});

describe("spin", () => {
  it("turns at a rate, wrapped to one revolution", () => {
    expect(spinAngle(90, 2)).toBe(180);
    expect(spinAngle(90, 5)).toBe(90);
  });

  it("wraps negative rates too", () => {
    expect(spinAngle(-90, 1)).toBe(270);
  });
});

describe("selectClip", () => {
  const clips = ["Idle", "Open", "Close"];

  it("matches exactly", () => {
    expect(selectClip(clips, "Open")).toBe("Open");
  });

  it("falls back to case-insensitive", () => {
    expect(selectClip(clips, "open")).toBe("Open");
  });

  it("returns null for a clip that is not there — it never guesses", () => {
    // Falling back to "the first clip" would make a door play its IDLE when
    // asked to open, which reads as a physics bug rather than a typo.
    expect(selectClip(clips, "Opne")).toBeNull();
  });

  it("takes the first clip when none is requested", () => {
    expect(selectClip(clips)).toBe("Idle");
  });

  it("has nothing to choose from an unanimated model", () => {
    expect(selectClip([], "Open")).toBeNull();
  });
});
