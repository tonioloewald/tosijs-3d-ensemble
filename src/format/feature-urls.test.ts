import { afterAll, describe, expect, it } from "bun:test";
import { validate } from "./validate.js";
import { registerFeature, unregisterFeature } from "./registry.js";
import { registerSceneFeatures } from "../runtime/features-scene.js";
import type { Ensemble } from "./types.js";

/*
  A FEATURE'S URLS ARE HELD TO THE LIBRARY RULE.

  A skybox's `starfieldData` or a ground's `texture` is fetched by the reader's
  browser the moment a shared document opens — the threat the library https
  rule exists for. There was no way to find those fields without a hand-kept
  list until tosijs-3d 0.8.4 marked them `format: 'uri-reference'` (#91, ours).
*/
registerSceneFeatures();

const withFeature = (name: string, cfg: Record<string, unknown>): Ensemble => ({
  name: "urls",
  pieces: [{ id: "p", at: [0, 0, 0], features: { [name]: cfg } }],
});
const codes = (doc: Ensemble) =>
  validate(doc)
    .filter((p) => p.severity === "error")
    .map((p) => `${p.code} ${p.path}`);

describe("fetched feature urls", () => {
  it("an http galaxy is an error, and says where", () => {
    expect(
      codes(withFeature("skybox", { starfieldData: "http://cdn.example/sky" }))
    ).toEqual(["insecure-feature-url /pieces/0/features/skybox/starfieldData"]);
  });

  it("https, relative, localhost and empty are all fine", () => {
    for (const url of [
      "https://3d.tosijs.net/sky/0.8.4/stars",
      "/sky/stars",
      "./sky/stars",
      "http://localhost:8032/sky/stars",
      "",
    ])
      expect([
        url,
        codes(withFeature("skybox", { starfieldData: url })),
      ]).toEqual([url, []]);
  });

  it("a script scheme is refused outright", () => {
    expect(
      codes(withFeature("ground", { texture: "javascript:alert(1)" }))
    ).toEqual(["unsupported-feature-url /pieces/0/features/ground/texture"]);
  });

  it("a KEYWORD is not a url", () => {
    // `ground.texture` takes `checker` and `noise` as well as a url, and
    // upstream lists them in `x-keywords` for exactly this.
    expect(codes(withFeature("ground", { texture: "checker" }))).toEqual([]);
  });

  it("reaches a field the PANEL does not offer", () => {
    /*
      `nebulaTexture` is fetched but not in our curated sky panel. Checking
      only offered fields would leave exactly the ones an author cannot see
      unexamined — which is why the list is stamped from upstream's FULL
      schema rather than taken from `properties`.
    */
    expect(
      codes(withFeature("skybox", { nebulaTexture: "http://x.example/n.png" }))
    ).toEqual(["insecure-feature-url /pieces/0/features/skybox/nebulaTexture"]);
  });

  it("a consumer's own feature opts in with plain JSON Schema", () => {
    registerFeature({
      name: "billboard-test",
      schema: {
        type: "object",
        properties: { image: { type: "string", format: "uri-reference" } },
      },
    });
    expect(
      codes(withFeature("billboard-test", { image: "http://x.example/a.png" }))
    ).toEqual(["insecure-feature-url /pieces/0/features/billboard-test/image"]);
  });

  it("a plain string that is not fetched is left alone", () => {
    // Guards the guard: a rule that fired on every string would pass every
    // test above and make the format unusable.
    expect(
      codes(withFeature("skybox", { starfieldTilt: "http://not-a-url-field" }))
    ).toEqual([]);
  });
});

afterAll(() => unregisterFeature("billboard-test"));
