import { describe, expect, it } from "bun:test";
import { sceneSchemas } from "tosijs-3d";
import { applyRecommendations, RECOMMENDED_KEYS } from "./recommendations.js";
import { validate } from "../format/validate.js";

/*
  RECOMMENDATIONS ARE THE AUTHOR'S LOOK, APPLIED ONLY WHEN A VIEWER ASKS.

  Whether AO runs is the viewer's choice; how it should look here is the
  author's. These pin the helper (known keys, sane numbers, nothing else) and
  that `validate` reports what the helper silently skips.
*/
const doc = (recommends: unknown) =>
  ({
    name: "t",
    pieces: [{ id: "a", at: [0, 0, 0] }],
    recommends,
  } as never);

describe("applyRecommendations", () => {
  it("copies known keys onto the host and says what it applied", () => {
    const host: Record<string, unknown> = { ssao: "off" };
    const applied = applyRecommendations(
      { recommends: { ssaoStrength: 1.4, ssaoRadius: 3 } },
      host
    );
    expect(applied).toEqual({ ssaoStrength: 1.4, ssaoRadius: 3 });
    expect(host).toEqual({ ssao: "off", ssaoStrength: 1.4, ssaoRadius: 3 });
  });

  it("never switches AO on: that is the viewer's", () => {
    const host: Record<string, unknown> = {};
    applyRecommendations(
      { recommends: { ssao: "on", ssaoStrength: 2 } as never },
      host
    );
    expect("ssao" in host).toBe(false);
  });

  it("skips bad values and does nothing without recommendations", () => {
    const host: Record<string, unknown> = {};
    applyRecommendations(
      { recommends: { ssaoStrength: -1, ssaoRadius: "3" as never } },
      host
    );
    applyRecommendations({}, host);
    expect(host).toEqual({});
  });
});

describe("validate reports recommendations it cannot use", () => {
  const codes = (r: unknown) =>
    validate(doc(r))
      .filter((p) => p.path.startsWith("/recommends"))
      .map((p) => [p.severity, p.code]);

  it("a typo is a warning, not silence", () => {
    expect(codes({ ssaoStrenght: 1 })).toEqual([
      ["warning", "unknown-recommendation"],
    ]);
  });

  it("a non-number or negative is an error", () => {
    expect(codes({ ssaoStrength: "x", ssaoRadius: -2 })).toEqual([
      ["error", "bad-recommendation"],
      ["error", "bad-recommendation"],
    ]);
    expect(codes([1])).toEqual([["error", "bad-recommends"]]);
  });

  it("good recommendations are fine", () => {
    expect(codes({ ssaoStrength: 1.4, ssaoRadius: 3 })).toEqual([]);
  });
});

/*
  The keys we store must be <tosi-b3d>'s own: the editor's sliders take their
  ranges from `b3dSchema()`, so a rename upstream would otherwise drop a slider
  silently and leave the document recommending a property nothing reads.
*/
describe("recommendations are <tosi-b3d> properties", () => {
  it("every key is in tosijs-3d's b3d schema, as a number", () => {
    const props = (
      sceneSchemas.b3d() as {
        properties: Record<string, { type?: string }>;
      }
    ).properties;
    for (const key of RECOMMENDED_KEYS)
      expect([key, props[key]?.type]).toEqual([key, "number"]);
  });
});
