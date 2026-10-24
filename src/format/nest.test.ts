import { describe, expect, it } from "bun:test";
import { Matrix, Quaternion, Vector3 } from "@babylonjs/core";
import {
  eulerMatrix,
  flattenEnsemble,
  matrixEuler,
  MAX_NESTING_DEPTH,
  nestedUrl,
} from "./nest.js";
import { registerSceneFeatures } from "../runtime/features-scene.js";
import type { Ensemble, Euler, Piece, Vec3 } from "./types.js";
import { scaleVector } from "./scale.js";

registerSceneFeatures();
const RAD = Math.PI / 180;

/** Babylon's own world matrix for a piece: how tosijs-3d places it. */
const babylon = (at: Vec3, rot: Euler = [0, 0, 0], scale: Vec3 = [1, 1, 1]) =>
  Matrix.Compose(
    new Vector3(...scale),
    Quaternion.RotationYawPitchRoll(rot[1] * RAD, rot[0] * RAD, rot[2] * RAD),
    new Vector3(...at)
  );
const decompose = (m: Matrix) => {
  const s = new Vector3(),
    q = new Quaternion(),
    t = new Vector3();
  m.decompose(s, q, t);
  return { s, q, t };
};
const close = (a: number, b: number, eps = 1e-6) =>
  expect(Math.abs(a - b)).toBeLessThan(eps);
/** Two rotations are the same when q ≈ ±q'. */
const sameRotation = (a: Quaternion, b: Quaternion) =>
  close(Math.abs(Quaternion.Dot(a, b)), 1, 1e-6);

describe("rotation follows tosijs-3d (Babylon yaw-pitch-roll)", () => {
  it("eulerMatrix turns a vector as Babylon's quaternion does", () => {
    for (const rot of [
      [30, 0, 0],
      [0, 45, 0],
      [0, 0, -60],
      [20, 35, -15],
      [-80, 170, 33],
    ] as Euler[]) {
      const m = eulerMatrix(rot);
      const v: Vec3 = [1, 2, 3];
      const mine = [0, 1, 2].map(
        (i) => m[i]![0]! * v[0] + m[i]![1]! * v[1] + m[i]![2]! * v[2]
      );
      const theirs = Vector3.TransformCoordinates(
        new Vector3(...v),
        babylon([0, 0, 0], rot)
      );
      close(mine[0]!, theirs.x);
      close(mine[1]!, theirs.y);
      close(mine[2]!, theirs.z);
    }
  });
  it("matrixEuler inverts eulerMatrix (away from gimbal lock)", () => {
    for (const rot of [
      [20, 35, -15],
      [-80, 170, 33],
      [0, -90, 0],
    ] as Euler[]) {
      const back = matrixEuler(eulerMatrix(rot));
      const a = babylon([0, 0, 0], rot);
      const b = babylon([0, 0, 0], back);
      sameRotation(decompose(a).q, decompose(b).q);
    }
  });
});

const child = (pieces: Piece[], extra: Partial<Ensemble> = {}): Ensemble => ({
  name: "child",
  pieces,
  ...extra,
});

describe("flattenEnsemble places a child under its nesting piece", () => {
  /*
    THE TRIPLE: a rotation, an offset AND a scale, at both levels, plus the
    child's own document scale. Each pair passes under several wrong orders;
    only all of them together tells the right composition from those.
  */
  it("matches Babylon's parenting for rotation + offset + scale together", () => {
    const parent = {
      at: [10, 2, -3] as Vec3,
      rot: [20, 35, -15] as Euler,
      scale: 2,
    };
    const inner = {
      at: [1, 2, 3] as Vec3,
      rot: [10, -40, 25] as Euler,
      scale: [1, 2, 0.5] as Vec3,
    };
    const docScale = 1.5;
    const children = new Map([
      [
        "rig.json",
        child([{ id: "pump", mesh: "box", ...inner }], { scale: docScale }),
      ],
    ]);
    const { ensemble, problems } = flattenEnsemble(
      {
        name: "level",
        pieces: [{ id: "rig-a", ensemble: "rig.json", ...parent }],
      },
      children
    );
    expect(problems).toEqual([]);
    const pump = ensemble.pieces.find((p) => p.id === "rig-a/pump")!;
    expect(pump).toBeTruthy();

    // Babylon: child local · child document scale · parent world.
    const world = babylon(inner.at, inner.rot, inner.scale)
      .multiply(Matrix.Scaling(docScale, docScale, docScale))
      .multiply(babylon(parent.at, parent.rot, scaleVector(parent.scale)));
    const want = decompose(world);
    const got = decompose(babylon(pump.at, pump.rot, scaleVector(pump.scale)));
    close(got.t.x, want.t.x);
    close(got.t.y, want.t.y);
    close(got.t.z, want.t.z);
    sameRotation(got.q, want.q);
    close(got.s.x, want.s.x);
    close(got.s.y, want.s.y);
    close(got.s.z, want.s.z);
  });

  it("two levels deep composes the same way", () => {
    const children = new Map([
      [
        "tower.json",
        child([
          {
            id: "rig",
            ensemble: "rig.json",
            at: [5, 0, 0],
            rot: [0, 90, 0],
            scale: 0.5,
          },
        ]),
      ],
      ["rig.json", child([{ id: "pump", mesh: "box", at: [2, 1, 0] }])],
    ]);
    const { ensemble, problems } = flattenEnsemble(
      {
        name: "level",
        pieces: [
          {
            id: "t1",
            ensemble: "tower.json",
            at: [100, 0, 0],
            rot: [0, 45, 0],
            scale: 2,
          },
        ],
      },
      children
    );
    expect(problems).toEqual([]);
    const pump = ensemble.pieces.find((p) => p.id === "t1/rig/pump")!;
    const world = babylon([2, 1, 0])
      .multiply(babylon([5, 0, 0], [0, 90, 0], [0.5, 0.5, 0.5]))
      .multiply(babylon([100, 0, 0], [0, 45, 0], [2, 2, 2]));
    const want = decompose(world);
    // Babylon's matrices are float32: good to ~1e-6 relative at this size.
    close(pump.at[0], want.t.x, 1e-4);
    close(pump.at[1], want.t.y, 1e-4);
    close(pump.at[2], want.t.z, 1e-4);
    sameRotation(
      decompose(babylon(pump.at, pump.rot, scaleVector(pump.scale))).q,
      want.q
    );
    expect(scaleVector(pump.scale)[0]).toBeCloseTo(1, 9);
  });

  it("an unevenly stretched parent is exact for an unturned child, and warns for a turned one", () => {
    const children = new Map([
      [
        "c.json",
        child([
          { id: "flat", mesh: "box", at: [1, 1, 1] },
          { id: "turned", mesh: "box", at: [0, 0, 0], rot: [0, 30, 0] },
        ]),
      ],
    ]);
    const { ensemble, problems } = flattenEnsemble(
      {
        name: "p",
        pieces: [
          { id: "c", ensemble: "c.json", at: [0, 0, 0], scale: [2, 1, 1] },
        ],
      },
      children
    );
    const flat = ensemble.pieces.find((p) => p.id === "c/flat")!;
    expect(flat.at).toEqual([2, 1, 1]);
    expect(flat.scale).toEqual([2, 1, 1]);
    expect(problems.map((p) => p.code)).toEqual(["nested-shear"]);
    expect(problems[0]!.path).toBe("/pieces/0/ensemble/pieces/1/scale");
  });
});

describe("flattenEnsemble keeps the child's references inside the child", () => {
  it("prefixes ids, links, points, zones and x-piece-ref fields", () => {
    const children = new Map([
      [
        "rig.json",
        child(
          [
            { id: "reactor", mesh: "box", at: [0, 0, 0] },
            { id: "projector", mesh: "box", at: [1, 0, 0] },
            {
              id: "world",
              at: [0, 0, 0],
              features: { planet: { terrain: "ground" } },
            },
            { id: "ground", at: [0, 0, 0], features: { terrain: {} } },
          ],
          {
            links: [{ from: "reactor", to: "projector", kind: "power" }],
            points: [{ id: "spawn", at: [0, 0, 5], facing: [0, 90, 0] }],
            zones: [{ id: "deck", at: [0, 0, 0], radius: 4 }],
          }
        ),
      ],
    ]);
    const { ensemble } = flattenEnsemble(
      {
        name: "level",
        pieces: [
          // A parent piece with the SAME local name: the child's link must
          // never resolve against it.
          { id: "projector", mesh: "box", at: [50, 0, 0] },
          { id: "rig-a", ensemble: "rig.json", at: [0, 0, 10], scale: 2 },
        ],
        links: [{ from: "projector", to: "rig-a/reactor" }],
      },
      children
    );
    expect(ensemble.pieces.map((p) => p.id)).toEqual([
      "projector",
      "rig-a/reactor",
      "rig-a/projector",
      "rig-a/world",
      "rig-a/ground",
    ]);
    expect(ensemble.links).toEqual([
      { from: "projector", to: "rig-a/reactor" },
      { from: "rig-a/reactor", to: "rig-a/projector", kind: "power" },
    ]);
    expect(
      (
        ensemble.pieces.find((p) => p.id === "rig-a/world")!.features!
          .planet as { terrain: string }
      ).terrain
    ).toBe("rig-a/ground");
    expect(ensemble.points).toEqual([
      { id: "rig-a/spawn", at: [0, 0, 20], facing: [0, 90, 0] },
    ]);
    expect(ensemble.zones).toEqual([
      { id: "rig-a/deck", at: [0, 0, 10], radius: 8 },
    ]);
  });

  it("merges libraries, renaming a child's that clashes", () => {
    const children = new Map([
      [
        "rig.json",
        child(
          [
            { id: "a", library: "kit", mesh: "box", at: [0, 0, 0] },
            { id: "b", library: "shared", mesh: "box", at: [0, 0, 0] },
          ],
          {
            libraries: [
              { name: "kit", url: "/rig-kit.glb" },
              { name: "shared", url: "/shared.glb" },
            ],
          }
        ),
      ],
    ]);
    const { ensemble } = flattenEnsemble(
      {
        name: "level",
        libraries: [
          { name: "kit", url: "/level-kit.glb" },
          { name: "shared", url: "/shared.glb" },
        ],
        pieces: [{ id: "r", ensemble: "rig.json", at: [0, 0, 0] }],
      },
      children
    );
    expect(ensemble.libraries).toEqual([
      { name: "kit", url: "/level-kit.glb" },
      { name: "shared", url: "/shared.glb" },
      { name: "r/kit", url: "/rig-kit.glb" },
    ]);
    expect(ensemble.pieces.map((p) => p.library)).toEqual(["r/kit", "shared"]);
  });
});

describe("flattenEnsemble refuses what it cannot follow", () => {
  it("reports a cycle, naming the loop, and does not hang", () => {
    const children = new Map([
      ["a.json", child([{ id: "b", ensemble: "b.json", at: [0, 0, 0] }])],
      ["b.json", child([{ id: "a", ensemble: "a.json", at: [0, 0, 0] }])],
    ]);
    const { problems } = flattenEnsemble(
      {
        name: "root",
        pieces: [{ id: "x", ensemble: "a.json", at: [0, 0, 0] }],
      },
      children
    );
    expect(problems.map((p) => p.code)).toEqual(["nested-cycle"]);
    expect(problems[0]!.message).toContain("a.json → b.json → a.json");
  });

  it("stops past the depth limit", () => {
    const children = new Map<string, Ensemble>();
    for (let i = 0; i < MAX_NESTING_DEPTH + 3; i++)
      children.set(
        `d${i}.json`,
        child([{ id: `n${i}`, ensemble: `d${i + 1}.json`, at: [0, 0, 0] }])
      );
    const { problems } = flattenEnsemble(
      {
        name: "root",
        pieces: [{ id: "x", ensemble: "d0.json", at: [0, 0, 0] }],
      },
      children
    );
    expect(problems.map((p) => p.code)).toContain("nested-too-deep");
  });

  it("a missing child is a warning and contributes nothing; a disabled one is silent", () => {
    const { ensemble, problems } = flattenEnsemble(
      {
        name: "root",
        pieces: [
          { id: "gone", ensemble: "gone.json", at: [0, 0, 0] },
          { id: "off", ensemble: "off.json", at: [0, 0, 0], enabled: false },
          { id: "box", mesh: "box", at: [0, 0, 0] },
        ],
      },
      new Map()
    );
    expect(ensemble.pieces.map((p) => p.id)).toEqual(["box"]);
    expect(problems.map((p) => `${p.severity} ${p.code}`)).toEqual([
      "warning nested-missing",
    ]);
    // It says how to fix it, not only that a file is missing (0.8.0 review).
    expect(problems[0]!.message).toContain("collectNested");
  });

  it("a document with nothing nested is returned as it is", () => {
    const doc: Ensemble = {
      name: "flat",
      pieces: [{ id: "a", mesh: "box", at: [0, 0, 0] }],
    };
    expect(flattenEnsemble(doc, new Map()).ensemble).toBe(doc);
  });
});

describe("nestedUrl", () => {
  it("reads a bare name as <name>.json beside the document", () => {
    expect(nestedUrl("ocean-rig", "https://h.example/levels/l1.json")).toBe(
      "https://h.example/levels/ocean-rig.json"
    );
    expect(
      nestedUrl(
        "/assemblies/ocean-rig.json",
        "https://h.example/levels/l1.json"
      )
    ).toBe("https://h.example/assemblies/ocean-rig.json");
    expect(nestedUrl("ocean-rig")).toBe("ocean-rig.json");
  });
});

describe("one rule for piece references (0.8.0 review)", () => {
  it("a consumer field marked only x-widget: ref is prefixed when nested", async () => {
    const { registerFeature, unregisterFeature } = await import(
      "./registry.js"
    );
    registerFeature({
      name: "zz-follows",
      schema: {
        type: "object",
        properties: { target: { type: "string", "x-widget": "ref" } },
      },
      bind: () => null,
    });
    try {
      const { ensemble } = flattenEnsemble(
        { name: "p", pieces: [{ id: "n", ensemble: "c.json", at: [0, 0, 0] }] },
        new Map([
          [
            "c.json",
            child([
              { id: "leader", mesh: "box", at: [0, 0, 0] },
              {
                id: "follower",
                at: [0, 0, 0],
                features: { "zz-follows": { target: "leader" } },
              },
            ]),
          ],
        ])
      );
      expect(
        (
          ensemble.pieces.find((p) => p.id === "n/follower")!.features![
            "zz-follows"
          ] as { target: string }
        ).target
      ).toBe("n/leader");
    } finally {
      unregisterFeature("zz-follows");
    }
  });
});

describe("a child's relative urls are its own (0.8.0 review lead)", () => {
  it("rebases libraries and fetched feature urls onto the child's url", () => {
    const { ensemble } = flattenEnsemble(
      {
        name: "level",
        pieces: [{ id: "r", ensemble: "/assemblies/rig.json", at: [0, 0, 0] }],
      },
      new Map([
        [
          "/assemblies/rig.json",
          child(
            [
              { id: "hull", library: "kit", mesh: "box", at: [0, 0, 0] },
              {
                id: "hum",
                at: [0, 0, 0],
                features: { sound: { url: "sounds/hum.mp3" } },
              },
            ],
            { libraries: [{ name: "kit", url: "./rig.glb" }] }
          ),
        ],
      ]),
      { base: "/levels/one.json" }
    );
    expect(ensemble.libraries).toEqual([
      { name: "kit", url: "/assemblies/rig.glb" },
    ]);
    expect(
      (
        ensemble.pieces.find((p) => p.id === "r/hum")!.features!.sound as {
          url: string;
        }
      ).url
    ).toBe("/assemblies/sounds/hum.mp3");
  });
});

describe("urls INSIDE a nested child's structured data are its own (#3428)", () => {
  it("rebases an effect recipe's texture and sound url; inline SVG is left as it is", () => {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg'/>";
    const { ensemble } = flattenEnsemble(
      {
        name: "level",
        pieces: [{ id: "r", ensemble: "/assemblies/rig.json", at: [0, 0, 0] }],
      },
      new Map([
        [
          "/assemblies/rig.json",
          child([
            {
              id: "fx",
              at: [0, 0, 0],
              features: {
                effect: {
                  recipe: {
                    version: 1,
                    layers: [
                      { kind: "particles", texture: "sprites/spark.png" },
                      { kind: "particles", texture: svg },
                      { kind: "sound", url: "sounds/hiss.ogg" },
                    ],
                  },
                },
              },
            },
          ]),
        ],
      ])
    );
    const layers = (
      ensemble.pieces.find((p) => p.id === "r/fx")!.features!.effect as {
        recipe: { layers: Array<{ texture?: string; url?: string }> };
      }
    ).recipe.layers;
    expect(layers[0]!.texture).toBe("/assemblies/sprites/spark.png");
    expect(layers[1]!.texture).toBe(svg);
    expect(layers[2]!.url).toBe("/assemblies/sounds/hiss.ogg");
  });
});

describe("one walker for fetched strings (#3439)", () => {
  it("a keyword inside x-data is not rebased as if it were a url", async () => {
    const { rewriteFetched } = await import("./url-policy.js");
    const schema = {
      type: "object",
      properties: {
        image: { type: "string", format: "uri-reference", "x-keywords": ["none"] },
      },
    };
    const out = rewriteFetched(schema, { image: "none" }, (u) => `/child/${u}`);
    expect(out).toEqual({ image: "none" });
    expect(rewriteFetched(schema, { image: "a.png" }, (u) => `/child/${u}`)).toEqual({
      image: "/child/a.png",
    });
  });
});
