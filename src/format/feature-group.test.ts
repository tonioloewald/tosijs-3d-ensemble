import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { listedGroup, registerFeature, unregisterFeature } from "./registry.js";

/*
  A MISSPELLED GROUP WAS A HIDDEN FEATURE (#3394, from the 0.7.0 review).
  The piece list files a primitive under its `group`; `"light"` matched no
  category, so the feature never appeared and nothing said why.
*/
describe("a feature's group", () => {
  afterEach(() => unregisterFeature("probe"));
  const schema = { type: "object" as const, properties: {} };

  it("warns when it is not one the editor lists", () => {
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    try {
      registerFeature({
        name: "probe",
        schema,
        group: "light" as never,
        bind: () => ({}),
      });
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0]![0])).toContain('"light"');
      // And it is LISTED, not only warned about (#3495): the editor's piece
      // list files it by `listedGroup`.
      expect(listedGroup({ group: "light" })).toBe("environment");
      expect(listedGroup({ group: "lights" })).toBe("lights");
    } finally {
      warn.mockRestore();
    }
  });

  it("is quiet for the groups that exist, and for none", () => {
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    try {
      for (const group of ["lights", "environment", undefined] as const)
        registerFeature({ name: "probe", schema, group, bind: () => ({}) });
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});

/*
  A SCHEMA THAT SAYS NOTHING ACCEPTS NOTHING (#3357), so the registration is
  told (#3495, from the 0.9.0 review): a consumer's feature written before
  0.9.0 otherwise gets empty configs with nothing said where they register.
*/
describe("what a feature's schema accepts", () => {
  afterEach(() => unregisterFeature("probe"));
  const warnings = (schema: object | undefined): number => {
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    try {
      registerFeature({ name: "probe", schema, bind: () => ({}) } as never);
      return warn.mock.calls.length;
    } finally {
      warn.mockRestore();
    }
  };

  it("warns when it declares neither properties nor x-accepts, or a malformed x-accepts", () => {
    expect(warnings(undefined)).toBe(1);
    expect(warnings({ type: "object" })).toBe(1);
    expect(warnings({ type: "object", "x-accepts": "all" })).toBe(1);
    expect(warnings({ type: "object", "x-accepts": ["*"] })).toBe(1);
    expect(warnings({ type: "object", "x-accepts": [] })).toBe(1);
  });

  it("is quiet for properties, a key list, or pass-through", () => {
    expect(warnings({ type: "object", properties: {} })).toBe(0);
    expect(warnings({ type: "object", "x-accepts": ["a", "b"] })).toBe(0);
    expect(warnings({ type: "object", "x-accepts": "*" })).toBe(0);
  });
});
