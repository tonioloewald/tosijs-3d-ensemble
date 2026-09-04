import { describe, expect, it } from "bun:test";
import { roundDeep, roundNumber } from "./round.js";

describe("roundNumber", () => {
  it("cuts a pointer's noise down to a readable number", () => {
    // The measured case: one drag of `timeOfDay`.
    expect(roundNumber(20.651162790697676)).toBe(20.651);
  });

  it("leaves a number that is already clean alone", () => {
    expect(roundNumber(0.25)).toBe(0.25);
    expect(roundNumber(12)).toBe(12);
    expect(roundNumber(-3)).toBe(-3);
  });

  it("never turns a real quantity into zero", () => {
    /*
      `terrain.biomeLapseRate` spans 0..0.05, so three decimals would round the
      bottom of its range to nothing — a control that stops working where it
      matters most, silently. Three significant figures instead.
    */
    expect(roundNumber(0.0004)).toBe(0.0004);
    expect(roundNumber(0.00012345)).toBe(0.000123);
    expect(roundNumber(-0.0004)).toBe(-0.0004);
  });

  it("keeps a genuine zero", () => {
    expect(roundNumber(0)).toBe(0);
    expect(Object.is(roundNumber(0), 0)).toBe(true);
  });

  it("honours a coarser or finer precision", () => {
    expect(roundNumber(1.23456, 1)).toBe(1.2);
    expect(roundNumber(1.23456, 5)).toBe(1.23456);
  });

  it("passes non-finite values through rather than inventing a number", () => {
    // These are a bug upstream; normalising them would hide it.
    expect(Number.isNaN(roundNumber(NaN))).toBe(true);
    expect(roundNumber(Infinity)).toBe(Infinity);
  });
});

describe("roundDeep", () => {
  it("rounds a position triple", () => {
    expect(roundDeep([1.00000001, 2.5, -3.987654])).toEqual([1, 2.5, -3.988]);
  });

  it("reaches numbers nested inside a composite widget's value", () => {
    // A light hands back settings carrying a program carrying curve points.
    const settings = {
      kind: "point",
      intensity: 1.20000004,
      program: {
        brightness: {
          points: [
            [0, 0.3333333333],
            [1, 1],
          ],
        },
      },
    };
    expect(roundDeep(settings)).toEqual({
      kind: "point",
      intensity: 1.2,
      program: {
        brightness: {
          points: [
            [0, 0.333],
            [1, 1],
          ],
        },
      },
    });
  });

  it("leaves everything that is not a number as it was", () => {
    const value = { name: "sea", on: true, missing: null, tags: ["a", "b"] };
    expect(roundDeep(value)).toEqual(value);
  });

  it("does not flatten a value it does not understand", () => {
    /*
      A blind walk would turn a class instance into a bare object. The format
      stores a regex as a source STRING for the same reason — so nothing here
      has to guess.
    */
    const re = /a.b/g;
    expect(roundDeep({ pattern: re }).pattern).toBe(re);
  });

  it("returns a new structure rather than mutating the caller's", () => {
    // The widget that raised the change may still be holding this object.
    const original = { at: [1.23456, 0, 0] };
    const rounded = roundDeep(original);
    expect(original.at[0]).toBe(1.23456);
    expect(rounded.at[0]).toBe(1.235);
  });
});
