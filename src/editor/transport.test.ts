import { describe, expect, test } from "bun:test";
import {
  AnimationTransport,
  groupsOf,
  type TransportGroup,
} from "./transport.js";

/** A stand-in for a Babylon AnimationGroup, recording what was done to it. */
function group(extra: Partial<TransportGroup> = {}) {
  const calls: string[] = [];
  const g: TransportGroup & { calls: string[]; frame: number } = {
    isPlaying: false,
    speedRatio: 1,
    from: 0,
    to: 100,
    frame: 0,
    calls,
    play() {
      calls.push("play");
      g.isPlaying = true;
    },
    pause() {
      calls.push("pause");
      g.isPlaying = false;
    },
    goToFrame(frame: number) {
      calls.push(`goTo ${frame}`);
      g.frame = frame;
    },
    ...extra,
  };
  return g;
}

describe("animation transport", () => {
  test("starts the groups a library delivers stopped, looping", () => {
    const a = group();
    new AnimationTransport().sync([a]);
    expect(a.isPlaying).toBe(true);
    expect(a.calls).toEqual(["play"]);
  });

  test("leaves a wrecked piece's stopped clip stopped", () => {
    const dead = group({ __wreckStopped: true });
    new AnimationTransport().sync([dead]);
    expect(dead.isPlaying).toBe(false);
    expect(dead.calls).toEqual([]);
  });

  test("speed is the transport's times the scene's timeScale", () => {
    const a = group();
    const t = new AnimationTransport();
    t.speed = 2;
    t.sync([a], 0.25);
    expect(a.speedRatio).toBe(0.5);
    t.sync([a], 1);
    expect(a.speedRatio).toBe(2);
  });

  test("pause stops playing groups; play starts them again", () => {
    const a = group();
    const t = new AnimationTransport();
    t.sync([a]);
    t.setPlaying(false);
    t.sync([a]);
    expect(a.isPlaying).toBe(false);
    t.setPlaying(true);
    t.sync([a]);
    expect(a.calls).toEqual(["play", "pause", "play"]);
  });

  test("a scrub pauses, and seeks each group once per position", () => {
    const a = group({ from: 10, to: 30 });
    const t = new AnimationTransport();
    t.sync([a]);
    t.scrub(0.5);
    t.sync([a]);
    t.sync([a]);
    expect(a.isPlaying).toBe(false);
    expect(a.frame).toBe(20);
    expect(a.calls.filter((c) => c.startsWith("goTo"))).toEqual(["goTo 20"]);
    // A group that arrives while scrubbed is put at the same place.
    const late = group();
    t.sync([a, late]);
    expect(late.frame).toBe(50);
    t.scrub(2);
    t.sync([a]);
    expect(a.frame).toBe(30);
  });

  test("a group seeking throws on is skipped, not fatal", () => {
    const bad = group({
      goToFrame() {
        throw new Error("no targets");
      },
    });
    const t = new AnimationTransport();
    t.scrub(0.5);
    expect(() => t.sync([bad, group()])).not.toThrow();
  });

  test("groupsOf collects each body's groups once", () => {
    const a = group();
    const b = group();
    const bodies = [
      { metadata: { animationGroups: [a, b] } },
      { metadata: { animationGroups: [a] } },
      { metadata: {} },
      null,
    ];
    expect(groupsOf(bodies)).toEqual([a, b]);
  });
});
