import { describe, expect, it } from "bun:test";
import { validate } from "./validate.js";
import { registerFeature, unregisterFeature } from "./registry.js";
import { registerCheck } from "./validate.js";
import type { Ensemble } from "./types.js";

const minimal = (over: Partial<Ensemble> = {}): Ensemble => ({
  name: "test",
  pieces: [{ id: "a", mesh: "Pump Station", at: [0, 0, 0] }],
  ...over,
});

/*
  THE FIXTURES' MESH NAMES, supplied by default.

  Without a `meshes` set, `validate` now warns `meshes-unchecked` — it cannot
  tell a caller that a document passed when nothing looked at its mesh names.
  These tests are about the OTHER rules, so they say "yes, I have a library"
  rather than asserting the extra warning in every expectation, which would
  bury the code each test is actually about.

  Tests that ARE about mesh checking pass their own set, or omit it on purpose.
*/
const KNOWN = new Set(["Pump Station", "X", "Y", "bench", "car"]);

const codes = (e: Ensemble, opts = {}) =>
  validate(e, { meshes: KNOWN, ...opts }).map((p) => p.code);

describe("validate", () => {
  it("accepts a minimal ensemble", () => {
    expect(
      validate(minimal(), { checkRegistry: false, meshes: KNOWN })
    ).toEqual([]);
  });

  it("reports a missing name and missing pieces", () => {
    expect(codes({ name: "", pieces: [] })).toEqual(["no-name", "no-pieces"]);
  });

  it("requires an id rather than deriving one from the index", () => {
    const e = minimal({ pieces: [{ mesh: "X", at: [0, 0, 0] } as never] });
    expect(codes(e, { checkRegistry: false })).toContain("no-piece-id");
  });

  it("catches duplicate ids", () => {
    const e = minimal({
      pieces: [
        { id: "a", mesh: "X", at: [0, 0, 0] },
        { id: "a", mesh: "Y", at: [1, 0, 0] },
      ],
    });
    expect(codes(e, { checkRegistry: false })).toContain("duplicate-piece-id");
  });

  it("checks mesh names only when a library is loaded", () => {
    const e = minimal();
    expect(codes(e, { checkRegistry: false })).toEqual([]);
    expect(
      codes(e, { checkRegistry: false, meshes: new Set(["Other"]) })
    ).toEqual(["unknown-mesh"]);
    expect(
      codes(e, { checkRegistry: false, meshes: new Set(["Pump Station"]) })
    ).toEqual([]);
  });

  it("checks a piece against the library it NAMES, not just any", () => {
    const e: Ensemble = {
      name: "t",
      libraries: [
        { name: "props", url: "/props.glb" },
        { name: "vehicles", url: "/vehicles.glb" },
      ],
      pieces: [{ id: "a", mesh: "car", library: "props", at: [0, 0, 0] }],
    };
    const meshes = new Map([
      ["props", new Set(["bench"])],
      ["vehicles", new Set(["car"])],
    ]);
    // `car` exists — in the other library. Checking against "any mounted
    // library" would pass this and then render the wrong thing.
    expect(codes(e, { checkRegistry: false, meshes })).toEqual([
      "unknown-mesh",
    ]);
  });

  it("rejects a piece naming a library the ensemble never declared", () => {
    const e: Ensemble = {
      name: "t",
      libraries: [{ name: "props", url: "/props.glb" }],
      pieces: [{ id: "a", mesh: "bench", library: "ghost", at: [0, 0, 0] }],
    };
    expect(codes(e, { checkRegistry: false })).toContain("undeclared-library");
  });

  it("rejects duplicate library names, which make a qualifier meaningless", () => {
    const e: Ensemble = {
      name: "t",
      libraries: [
        { name: "props", url: "/a.glb" },
        { name: "props", url: "/b.glb" },
      ],
      pieces: [{ id: "a", mesh: "bench", at: [0, 0, 0] }],
    };
    expect(codes(e, { checkRegistry: false })).toContain("duplicate-library");
  });

  it("requires a url for every declared library", () => {
    const e: Ensemble = {
      name: "t",
      libraries: [{ name: "props", url: "" }],
      pieces: [{ id: "a", mesh: "bench", at: [0, 0, 0] }],
    };
    expect(codes(e, { checkRegistry: false })).toContain("no-library-url");
  });

  it("reports links to pieces that do not exist", () => {
    const e = minimal({ links: [{ from: "a", to: "ghost" }] });
    expect(codes(e, { checkRegistry: false })).toEqual(["unknown-link-target"]);
  });

  it("does NOT know about shields — that rule belongs to a domain", () => {
    // A piece that projects a field with no incoming link is an unsolvable
    // objective, and the format has no opinion about that. `presets/combat`
    // registers the rule; an architectural walkthrough would be baffled by it.
    const e = minimal({
      pieces: [
        { id: "reactor", mesh: "X", at: [0, 0, 0] },
        {
          id: "field",
          mesh: "Y",
          at: [0, 4, 0],
          features: { protector: { protection: 12 } },
        },
      ],
    });
    expect(codes(e, { checkRegistry: false })).toEqual([]);
  });

  it("runs registered domain checks and survives one that throws", () => {
    const stop = registerCheck(() => [
      {
        severity: "warning" as const,
        code: "too-square",
        message: "very square",
        path: "/pieces/0",
      },
    ]);
    const stopBroken = registerCheck(() => {
      throw new Error("bad rule");
    });
    expect(codes(minimal(), { checkRegistry: false })).toEqual(["too-square"]);
    stop();
    stopBroken();
    expect(codes(minimal(), { checkRegistry: false })).toEqual([]);
  });

  it("puts a JSON Pointer on the problem so the editor can place it", () => {
    const e = minimal({
      pieces: [
        { id: "a", mesh: "X", at: [0, 0, 0] },
        { id: "b", at: [0, 0, 0] },
      ],
    });
    const problem = validate(e, { checkRegistry: false, meshes: KNOWN }).find(
      (p) => p.code === "empty-piece"
    );
    expect(problem?.path).toBe("/pieces/1");
  });

  it("allows a mesh-less piece when a feature is its body", () => {
    registerFeature({ name: "terrain", schema: { type: "object" } });
    const e = minimal({
      pieces: [
        { id: "landform", at: [0, 0, 0], features: { terrain: { seed: 1 } } },
      ],
    });
    expect(validate(e, { meshes: KNOWN })).toEqual([]);
    unregisterFeature("terrain");
  });

  it("rejects an invalid subsystem regex rather than throwing at load", () => {
    const e = minimal({
      pieces: [
        {
          id: "a",
          mesh: "X",
          at: [0, 0, 0],
          subsystems: [{ match: "([", label: "pump" }],
        },
      ],
    });
    expect(codes(e, { checkRegistry: false })).toEqual(["bad-subsystem-match"]);
  });

  it("reports a nested ensemble instead of silently ignoring it", () => {
    const e = minimal({
      pieces: [{ id: "a", ensemble: "ocean-rig", at: [0, 0, 0] }],
    });
    expect(codes(e, { checkRegistry: false })).toContain(
      "nested-not-supported"
    );
  });

  it("warns rather than errors on unregistered features, so a host can register late", () => {
    const e = minimal({
      pieces: [{ id: "a", mesh: "X", at: [0, 0, 0], features: { wat: {} } }],
    });
    const problems = validate(e, { meshes: KNOWN });
    expect(problems.map((p) => p.code)).toEqual(["unknown-feature"]);
    expect(problems[0]!.severity).toBe("warning");
  });
});

describe("scale, uniform or per axis", () => {
  const withScale = (scale: unknown): Ensemble =>
    ({
      name: "e",
      pieces: [{ id: "a", mesh: "X", at: [0, 0, 0], scale }],
    } as unknown as Ensemble);

  it("accepts both canonical spellings", () => {
    expect(codes(withScale(2))).not.toContain("bad-scale");
    expect(codes(withScale([1, 2, 3]))).not.toContain("bad-scale");
  });

  it("rejects a triple that is not three long", () => {
    expect(codes(withScale([1, 2]))).toContain("bad-scale");
  });

  it("rejects a scale that is neither", () => {
    expect(codes(withScale("big"))).toContain("bad-scale");
  });

  it("warns rather than errors on a zero or negative component", () => {
    // A collapsed piece looks like a MISSING piece, so this is worth saying —
    // but a generator emitting it should not fail the whole load.
    const problems = validate(withScale([1, 0, 1]), { meshes: KNOWN });
    expect(problems.map((p) => p.code)).toContain("non-positive-scale");
    expect(
      problems.find((p) => p.code === "non-positive-scale")!.severity
    ).toBe("warning");
  });
});

describe("the preview block", () => {
  const withScenery = (pieces: unknown[]) =>
    validate(
      {
        name: "sited",
        pieces: [{ id: "real", mesh: "X", at: [0, 0, 0] }],
        preview: { pieces: pieces as never },
      } as never,
      // Not about mesh checking — see KNOWN above.
      { meshes: KNOWN }
    );

  it("reports its problems, and never as errors", () => {
    const problems = withScenery([{ id: "island" }]);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.every((p) => p.severity === "warning")).toBe(true);
  });

  it("paths findings into /preview so an editor can point at them", () => {
    expect(withScenery([{ id: "island" }])[0]!.path).toStartWith(
      "/preview/pieces/0"
    );
  });

  it("says nothing at all when the scenery is sound", () => {
    expect(withScenery([{ id: "island", mesh: "X", at: [0, 0, 0] }])).toEqual(
      []
    );
  });

  it("warns when a preview id shadows a real one", () => {
    const problems = withScenery([{ id: "real", mesh: "X", at: [0, 0, 0] }]);
    expect(problems.map((p) => p.code)).toEqual(["preview-shadows-piece"]);
  });

  it("is silent about an ensemble that has none", () => {
    expect(
      validate(
        {
          name: "bare",
          pieces: [{ id: "a", mesh: "X", at: [0, 0, 0] }],
        },
        { meshes: KNOWN }
      )
    ).toEqual([]);
  });
});

/*
  A PASS AND AN ABSENCE ARE DIFFERENT ANSWERS — manta-recon#3.

  Skipping the unknown-mesh check without a `meshes` set is correct and
  documented: a validation error that is really a loading race accuses good
  content. What was wrong is that the caller could not tell CHECKED-AND-CLEAN
  from NOT-CHECKED, so a gate reading `problems.length === 0` was told
  everything was fine about a document nothing had looked at.

  Reported with a measurement rather than a reading of the docs, which is why
  it survived my first pass at the issue: I fixed the same silence in
  `buildEnsemble` and left it in `validate`, where a headless caller — a
  generator with no scene, and therefore no libraries to derive a set from — is
  exactly who most needs telling.
*/
describe("an unchecked mesh set says so", () => {
  const typo = (): Ensemble =>
    ({
      name: "typo",
      pieces: [
        { id: "good", mesh: "Control Tower", at: [0, 0, 0] },
        { id: "bad", mesh: "Contorl Towr", at: [0, 0, 0] },
      ],
    } as Ensemble);

  it("reports the typo when it CAN check", () => {
    expect(codes(typo(), { meshes: new Set(["Control Tower"]) })).toContain(
      "unknown-mesh"
    );
  });

  it("warns instead of going silent when it cannot", () => {
    // Exactly the call manta measured returning `[]`.
    const problems = validate(typo());
    expect(problems.map((p) => p.code)).toEqual(["meshes-unchecked"]);
    // A warning, not an error: omitting the set is legitimate, and in the
    // headless case it is the only option.
    expect(problems[0]!.severity).toBe("warning");
  });

  it("names the libraries the caller asked for, when it was told", () => {
    const problems = validate(typo(), { libraries: ["enemies"] });
    expect(problems[0]!.message).toContain('"enemies"');
  });

  it("treats an EMPTY set as unchecked, because it is", () => {
    // A library that answered with no names checks nothing, and reporting
    // every mesh as unknown would be the false-accusation case the skip
    // exists to avoid.
    expect(codes(typo(), { meshes: new Set() })).toEqual(["meshes-unchecked"]);
  });

  it("says nothing about an ensemble with no meshes to check", () => {
    // An environment primitive IS its feature; there is nothing to look up.
    const sky = {
      name: "sky",
      pieces: [{ id: "sky", at: [0, 0, 0], features: { skybox: {} } }],
    } as unknown as Ensemble;
    expect(codes(sky, { checkRegistry: false, meshes: undefined })).toEqual([]);
  });
});
