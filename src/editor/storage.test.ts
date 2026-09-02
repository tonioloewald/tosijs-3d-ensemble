import { describe, expect, it } from "bun:test";
import {
  SAVE_PREFIX,
  fileNameFor,
  parseEnsemble,
  readSaved,
  removeSaved,
  savedNames,
  serialise,
  writeSaved,
  type KeyStore,
} from "./storage";
import type { Ensemble } from "../format/types";

/** A `localStorage` that is a Map, so none of this needs a browser. */
const store = (seed: Record<string, string> = {}): KeyStore => {
  const map = new Map(Object.entries(seed));
  return {
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
};

const ensemble = (name: string): Ensemble => ({
  name,
  pieces: [{ id: "a", mesh: "barrel", at: [0, 0, 0] }],
});

describe("saved slots", () => {
  it("lists only its own keys, sorted", () => {
    const s = store({
      [`${SAVE_PREFIX}zebra`]: "{}",
      [`${SAVE_PREFIX}apple`]: "{}",
      // Another script on the same origin. `localStorage` is one flat map.
      "doc-system:theme": "dark",
    });
    expect(savedNames(s)).toEqual(["apple", "zebra"]);
  });

  it("round-trips an ensemble", () => {
    const s = store();
    writeSaved(s, "cove", ensemble("cove"));
    expect(readSaved(s, "cove")?.pieces).toHaveLength(1);
  });

  it("returns null for a missing slot", () => {
    expect(readSaved(store(), "nope")).toBeNull();
  });

  /*
    The store is editable by hand and by other tabs, so a bad entry is a thing
    that happens rather than a bug. Losing one slot beats throwing.
  */
  it("returns null for malformed JSON rather than throwing", () => {
    expect(
      readSaved(store({ [`${SAVE_PREFIX}bad`]: "{oh no" }), "bad")
    ).toBeNull();
  });

  it("returns null for JSON that is not an ensemble", () => {
    const s = store({ [`${SAVE_PREFIX}odd`]: '{"hello":"world"}' });
    expect(readSaved(s, "odd")).toBeNull();
  });

  it("removes a slot", () => {
    const s = store({ [`${SAVE_PREFIX}gone`]: "{}" });
    removeSaved(s, "gone");
    expect(savedNames(s)).toEqual([]);
  });
});

describe("serialise", () => {
  it("writes JSON a human would have written", () => {
    const text = serialise(ensemble("cove"));
    // Indented and newline-terminated: this is a file you commit and diff.
    expect(text).toContain('\n  "name": "cove"');
    expect(text.endsWith("\n")).toBe(true);
  });

  it("round-trips through parseEnsemble", () => {
    expect(parseEnsemble(serialise(ensemble("cove")))?.name).toBe("cove");
  });

  it("refuses text that is not an ensemble", () => {
    expect(parseEnsemble("[1,2,3]")).toBeNull();
    expect(parseEnsemble("not json")).toBeNull();
  });
});

describe("fileNameFor", () => {
  it("is [name].ensemble.json", () => {
    expect(fileNameFor("cove")).toBe("cove.ensemble.json");
  });

  it("replaces what a filesystem would object to", () => {
    expect(fileNameFor("pirate cove / v2")).toBe(
      "pirate-cove-v2.ensemble.json"
    );
  });

  it("never produces a nameless file", () => {
    expect(fileNameFor("   ")).toBe("untitled.ensemble.json");
    expect(fileNameFor("///")).toBe("untitled.ensemble.json");
  });
});
