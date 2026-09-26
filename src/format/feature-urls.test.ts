import { afterAll, describe, expect, it } from "bun:test";
import { validate } from "./validate.js";
import {
  declaredConfig,
  featureRegistration,
  registerFeature,
  unregisterFeature,
} from "./registry.js";
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

  it("https (including https://localhost), relative and empty are all fine", () => {
    for (const url of [
      "https://3d.tosijs.net/sky/0.8.4/stars",
      "/sky/stars",
      "./sky/stars",
      "https://localhost:8032/sky/stars",
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

/*
  THE BYPASSES THE 0.4.0 REVIEW FOUND — every one of these validated CLEAN.

  The first `urlProblem` tested the raw string for a scheme; the parser the
  browser uses strips leading spaces/control characters and deletes tabs and
  newlines anywhere, so each of these LOOKED relative and resolves to an
  http or script url. Now classified the way the browser parses them.
*/
const BYPASSES: Array<[string, string]> = [
  [" http://evil.example/x.glb", "insecure"],
  ["\thttp://evil.example/x.glb", "insecure"],
  ["\nhttp://evil.example/x.glb", "insecure"],
  ["ht\ttp://evil.example/x.glb", "insecure"],
  ["java\nscript:alert(1)", "unsupported"],
  ["java\tscript:alert(1)", "unsupported"],
  [" data:model/gltf-binary;base64,AA", "unsupported"],
  // Another host with the scheme left to the page: plain http on an http page.
  ["//evil.example/x.glb", "unsupported"],
  ["\\\\evil.example/x.glb", "unsupported"],
];

/*
  NOT A STRING AT ALL — the 0.4.0 re-review's blocker.

  Every check was keyed on "is it a string", so `["http://evil…"]` skipped
  validate and declaredConfig alike — and the skybox does
  `String(attrs.starfieldData)`, which turns the array straight back into the
  url and fetches it. A fetched field now FAILS CLOSED on anything that is not
  a string: refused, never guessed at.
*/
const NOT_STRINGS: unknown[] = [
  ["http://evil.example/x"],
  { toString: () => "http://evil.example/x" },
  {},
  42,
  true,
];

describe("a fetched field that is not a string is refused", () => {
  for (const value of NOT_STRINGS) {
    const label = JSON.stringify(value) ?? String(value);
    it(`validate reports ${label}`, () => {
      expect(codes(withFeature("skybox", { starfieldData: value }))).toEqual([
        "unsupported-feature-url /pieces/0/features/skybox/starfieldData",
      ]);
    });
    it(`declaredConfig drops ${label}`, () => {
      expect(
        declaredConfig(featureRegistration("skybox"), {
          starfieldData: value,
          timeOfDay: 9,
        })
      ).toEqual({ timeOfDay: 9 });
    });
  }
  it("a library url that is not a string is refused", () => {
    const doc = {
      name: "urls",
      libraries: [{ name: "kit", url: ["http://evil.example/x.glb"] }],
      pieces: [{ id: "p", at: [0, 0, 0] }],
    } as unknown as Ensemble;
    expect(
      validate(doc)
        .filter((p) => p.code.endsWith("-library-url"))
        .map((p) => p.code)
    ).toEqual(["unsupported-library-url"]);
  });
});

describe("the rule cannot be dodged by how the url is spelled", () => {
  for (const [url, kind] of BYPASSES) {
    it(`feature url ${JSON.stringify(url)} is ${kind}`, () => {
      expect(codes(withFeature("skybox", { starfieldData: url }))).toEqual([
        `${kind}-feature-url /pieces/0/features/skybox/starfieldData`,
      ]);
    });
    it(`library url ${JSON.stringify(url)} is ${kind}`, () => {
      const doc: Ensemble = {
        name: "urls",
        libraries: [{ name: "kit", url }],
        // Not empty: `validate` stops at `no-pieces` before reading libraries.
        pieces: [{ id: "p", at: [0, 0, 0] }],
      };
      expect(
        validate(doc)
          .filter((p) => p.code.endsWith("-library-url"))
          .map((p) => p.code)
      ).toEqual([`${kind}-library-url`]);
    });
  }

  it("a genuinely relative url is still relative", () => {
    for (const url of ["/kits/x.glb", "./x.glb", "x.glb", "../sky/stars"])
      expect([
        url,
        codes(withFeature("skybox", { starfieldData: url })),
      ]).toEqual([url, []]);
  });
});

/*
  AND A FEATURE NEVER RECEIVES ONE — the 0.4.0 review's M2, for fetched keys.

  `declaredConfig` is what every bind and update is handed, so dropping a
  refused url there is what stops the element from fetching it. `validate`
  still reports it; this is the half that used to be missing.
*/
describe("declaredConfig drops a refused fetched url", () => {
  const sky = () => featureRegistration("skybox");

  it("an http galaxy never reaches the element", () => {
    const out = declaredConfig(sky(), {
      starfieldData: "http://evil.example/sky",
      timeOfDay: 12,
    });
    expect(out).toEqual({ timeOfDay: 12 });
  });

  it("an https galaxy and a keyword pass untouched", () => {
    expect(
      declaredConfig(sky(), {
        starfieldData: "https://3d.tosijs.net/sky/0.8.4/stars",
      })
    ).toEqual({ starfieldData: "https://3d.tosijs.net/sky/0.8.4/stars" });
    expect(
      declaredConfig(featureRegistration("ground"), { texture: "checker" })
    ).toEqual({ texture: "checker" });
  });
});

/*
  EVERY BUILT-IN STRING FIELD IS FETCHED, CONSTRAINED, OR SAYS WHY IT IS NEITHER.

  The https rule finds fetched fields by their marker, so an UNMARKED fetched
  field is not checked at all — `sound.url` was exactly that until the 0.4.0
  re-review. The first completeness test here guessed by NAME (a regex of
  url-ish words, top level only), and the next review pointed out what that
  misses: `path`, `source`, `asset`, `hdr`, `icon` and anything nested. So it is
  DEFAULT-DENY now: every `type: 'string'` property in every built-in feature's
  schema, recursing into object properties and array items, must be marked
  fetched, carry an `enum`, be a colour — or be named below with the reason it
  is none of those. A new free-text field fails this test until somebody
  decides what it is.

  Fields that exist only upstream (in `x-accepts`, not in our `properties`) are
  covered by tosijs-3d's own test, which rejects a plain string that is not a
  colour, enum, url or deliberately listed (tosijs-3d#91).
*/
const FREE_TEXT: Record<string, string> = {
  "skybox.starfieldTilt": "three degrees, 'rx,ry,rz' — a vector as text",
  "blip.faction": "a faction name",
  "protector.source": "a piece id in this document",
  "launchpad.craft": "a craft kind the game resolves",
  "interactive.part": "a mesh part name",
  "interactive.prompt": "text shown to the player",
  "lockable.key": "a key id the game resolves",
  "animation.clip": "an animation clip name on the mesh",
};

type Spec = {
  type?: string;
  enum?: unknown[];
  format?: string;
  "x-widget"?: string;
  properties?: Record<string, Spec>;
  items?: Spec;
};

describe("no built-in fetched field is unmarked", () => {
  it("every string property is fetched, constrained, or explained", async () => {
    const { registerCombatPreset } = await import("../presets/combat.js");
    const { registerWorldPreset } = await import("../presets/world.js");
    const undoCombat = registerCombatPreset();
    registerWorldPreset();
    const { registeredFeatures } = await import("./registry.js");
    const unaccounted: string[] = [];
    const walk = (spec: Spec | undefined, path: string) => {
      if (!spec || typeof spec !== "object") return;
      const free =
        spec.type === "string" &&
        !spec.enum &&
        spec.format !== "uri-reference" &&
        spec.format !== "color" &&
        spec["x-widget"] !== "color";
      if (free && !(path in FREE_TEXT)) unaccounted.push(path);
      for (const [k, v] of Object.entries(spec.properties ?? {}))
        walk(v, `${path}.${k}`);
      if (spec.items) walk(spec.items, `${path}[]`);
    };
    for (const f of registeredFeatures()) walk(f.schema as Spec, f.name);
    undoCombat();
    expect(unaccounted).toEqual([]);
  });

  it("sound.url is checked like any other fetched field", () => {
    expect(
      codes(withFeature("sound", { url: "http://evil.example/a.mp3" }))
    ).toEqual(["insecure-feature-url /pieces/0/features/sound/url"]);
  });
});
