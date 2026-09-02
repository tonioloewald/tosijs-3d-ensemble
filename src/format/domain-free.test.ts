import { describe, expect, it } from "bun:test";
import { validate } from "./validate";
import { featuresOf, registerRole } from "./roles";
import { registerFeature, unregisterFeature } from "./registry";
import type { Ensemble } from "./types";

/*
  THE CORE FORMAT HAS NO DOMAIN, AND THIS IS WHERE THAT IS PINNED.

  It was written from a fortification brief and kept the brief's vocabulary long
  after the decision to be domain-free: `hp` on a subsystem, `amount` and `beam`
  on a link, `targetValue` and `faction` in values, and CLOSED unions of zone and
  point kinds that a consumer could not extend without a type error.

  So the test is an ensemble with no combat in it at all. If someone reintroduces
  a required combat field, a closed kind union, or a validation rule that assumes
  a game, this is what fails.
*/
const garden: Ensemble = {
  name: "botanic-garden",
  kind: "exhibit",
  values: { curator: "K. Ito", opened: 1974, accessible: true },
  pieces: [
    {
      id: "glasshouse",
      mesh: "building",
      at: [0, 0, 0],
      values: { built: 1898 },
    },
    {
      id: "oak",
      mesh: "tree",
      at: [12, 0, 4],
      subsystems: [
        { match: "Branch$", label: "limb", features: { pruneable: {} } },
      ],
    },
    {
      id: "pump",
      mesh: "pillar",
      at: [-6, 0, 2],
      features: { irrigation: { litresPerHour: 400 } },
    },
  ],
  links: [
    { from: "pump", to: "oak", kind: "irrigates", values: { delay: 0.4 } },
  ],
  points: [{ id: "gate", at: [0, 0, 20], kind: "entrance" }],
  zones: [
    {
      id: "quiet",
      at: [0, 0, 0],
      radius: 30,
      kind: "quiet-area",
      values: { decibels: 45 },
    },
    {
      id: "wifi",
      at: [4, 2, 0],
      radius: 25,
      kind: "wifi",
      values: { ssid: "GARDEN" },
    },
  ],
};

describe("the format has no domain", () => {
  it("validates an ensemble with no combat vocabulary anywhere", () => {
    registerFeature({ name: "pruneable", schema: {} });
    registerFeature({ name: "irrigation", schema: {} });
    expect(validate(garden)).toEqual([]);
    unregisterFeature("pruneable");
    unregisterFeature("irrigation");
  });

  it("accepts any zone or point kind, because kinds are conventions", () => {
    // These were closed unions. A consumer's own kind was a type error, and
    // `muzzle` was in the core format of a thing that also describes gardens.
    const problems = validate(
      {
        ...garden,
        zones: [{ id: "z", at: [0, 0, 0], radius: 1, kind: "anything-at-all" }],
      },
      { checkRegistry: false }
    );
    expect(problems).toEqual([]);
  });

  it("carries arbitrary values on the ensemble, pieces, links and zones", () => {
    // `targetValue` and `faction` were NAMED fields. Whatever a domain needs
    // rides in an open map instead.
    expect(garden.values?.curator).toBe("K. Ito");
    expect(garden.links?.[0]?.values?.delay).toBe(0.4);
    expect(garden.zones?.[1]?.values?.ssid).toBe("GARDEN");
  });

  it("lets a part of a composite mesh carry FEATURES, not hit points", () => {
    // `hp` was a required field on every subsystem, which made a museum's
    // openable door a vulnerable subsystem with health.
    expect(garden.pieces[1]?.subsystems?.[0]?.features).toEqual({
      pruneable: {},
    });
  });

  it("expands a role a consumer defined for its own world", () => {
    registerRole("specimen", { labelled: { latin: true } });
    expect(featuresOf({ id: "x", at: [0, 0, 0], role: "specimen" })).toEqual({
      labelled: { latin: true },
    });
  });
});
