import { describe, expect, it } from "bun:test";
import { collectNested } from "./build.js";
import { flattenEnsemble, MAX_FLAT_PIECES } from "../format/nest.js";
import type { Ensemble } from "../format/types.js";

/*
  0.8.0 review (security + efficiency): a shared child was fetched once per
  PATH, so requests grew as fan-out^depth (measured: 6 documents, 55,986
  fetches, 46,656 flattened pieces). A shared document is a reader-side DoS
  and a request amplifier against any https host. Now each url is fetched
  once, and a flattened document past MAX_FLAT_PIECES is refused.
*/
const counting = (docs: Record<string, Ensemble>) => {
  const calls: string[] = [];
  return {
    calls,
    fetchDocument: async (url: string) => {
      calls.push(url);
      const doc = docs[url];
      if (!doc) throw new Error(`404 ${url}`);
      return doc;
    },
  };
};
const nests = (ref: string, n: number): Ensemble => ({
  name: ref,
  pieces: Array.from({ length: n }, (_, i) => ({
    id: `p${i}`,
    ensemble: ref,
    at: [i, 0, 0] as [number, number, number],
  })),
});

describe("collectNested fetches each url once", () => {
  it("a child shared by many pieces and many parents is one fetch", async () => {
    const docs: Record<string, Ensemble> = {
      "shared.json": {
        name: "s",
        pieces: [{ id: "x", mesh: "box", at: [0, 0, 0] }],
      },
      "mid.json": nests("shared.json", 4),
    };
    const root: Ensemble = nests("mid.json", 10);
    const { calls, fetchDocument } = counting(docs);
    await collectNested(root, { fetchDocument });
    expect(calls.sort()).toEqual(["mid.json", "shared.json"]);
  });

  it("a fan-out bomb is fetched in linear time and refused when flattened", async () => {
    const docs: Record<string, Ensemble> = {};
    const DEPTH = 6;
    for (let d = 0; d < DEPTH; d++)
      docs[`d${d}.json`] = nests(`d${d + 1}.json`, 6);
    docs[`d${DEPTH}.json`] = {
      name: "leaf",
      pieces: [{ id: "x", mesh: "box", at: [0, 0, 0] }],
    };
    const root = nests("d0.json", 6);
    const { calls, fetchDocument } = counting(docs);
    const nested = await collectNested(root, { fetchDocument });
    expect(calls.length).toBe(DEPTH + 1);
    const flat = flattenEnsemble(root, nested);
    expect(flat.problems.map((p) => p.code)).toContain("nested-too-large");
    expect(flat.ensemble.pieces.length).toBeLessThanOrEqual(MAX_FLAT_PIECES);
  });
});

describe("collectNested never fetches what the url rule refuses", () => {
  it("http, scheme-less hosts, disguised schemes and an http grandchild", async () => {
    const docs: Record<string, Ensemble> = {
      "https://ok.example/child.json": {
        name: "child",
        pieces: [
          { id: "g", ensemble: "http://bad.example/g.json", at: [0, 0, 0] },
        ],
      },
    };
    const root: Ensemble = {
      name: "root",
      pieces: [
        "http://bad.example/a.json",
        "//bad.example/a.json",
        " http://bad.example/a.json",
        "java\nscript:alert(1)",
        "https://ok.example/child.json",
      ].map((ref, i) => ({
        id: `n${i}`,
        ensemble: ref,
        at: [0, 0, 0] as [number, number, number],
      })),
    };
    const { calls, fetchDocument } = counting(docs);
    const nested = await collectNested(root, { fetchDocument });
    expect(calls).toEqual(["https://ok.example/child.json"]);
    const codes = flattenEnsemble(root, nested).problems.map((p) => p.code);
    expect(codes.filter((c) => c.endsWith("nested-url")).length).toBe(5);
  });
});
