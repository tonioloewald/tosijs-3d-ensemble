import { describe, expect, it, beforeAll } from "bun:test";
import { registerCombatPreset } from "../presets/combat.js";
import { featureRegistration } from "../format/registry.js";

/*
  RENAMING A PIECE IS A GRAPH EDIT.

  `id` is the only thing anything else can hold onto, so a rename that touched
  only the piece would leave dangling references the author never asked for.
  The editor's `renamePiece` re-points two DECLARED reference sites; this pins
  the rule it follows, without needing a browser to do it.
*/

/** The rule `EnsembleEditor.renamePiece` applies, in isolation. */
const refFields = (
  features: Record<string, unknown>
): Array<[string, string]> => {
  const out: Array<[string, string]> = [];
  for (const feature of Object.keys(features)) {
    const props = (
      featureRegistration(feature)?.schema as
        | { properties?: Record<string, { "x-widget"?: string }> }
        | undefined
    )?.properties;
    for (const [key, spec] of Object.entries(props ?? {})) {
      if (spec?.["x-widget"] === "ref") out.push([feature, key]);
    }
  }
  return out;
};

beforeAll(() => registerCombatPreset());

describe("which fields hold a piece id", () => {
  it("finds a reference field by its declared widget", () => {
    // `protector.source` is the built-in case, and the reason the rule is
    // declarative: nothing about the NAME `source` says it is an id.
    expect(refFields({ protector: {} })).toEqual([["protector", "source"]]);
  });

  it("does not treat ordinary strings as references", () => {
    /*
      The alternative rule — re-point any string equal to the old id — would
      rewrite a mesh name or a caption that merely coincided, silently. The
      format says which strings are references; this follows it.
    */
    expect(refFields({ turret: {} })).toEqual([]);
  });

  it("says nothing about a feature nobody registered", () => {
    expect(refFields({ "not-a-feature": {} })).toEqual([]);
  });
});
