import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { registerFeature, unregisterFeature } from "./registry.js";

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
