import { describe, expect, it } from "bun:test";

/*
  THE SPLIT IS ASSERTED HERE, NOT BY PACKAGING.

  A game imports the format and the instantiator and must not carry the editor:
  no SVG UI chrome, no property panel. There is ONE package precisely so the
  editor and the runtime share an implementation — which means the only thing
  keeping a game's bundle honest is that this test fails when a stray import
  ties the two together.

  It bundles through `src/index.ts`, the real entry point, because that is what
  a consumer imports. Testing a hand-written entry that skips the barrel would
  prove nothing about what a consumer actually gets — the barrel is where an
  editor import would leak in.

  Engine and framework are external on purpose: what is under test is whether
  OUR editor modules survive, not how big Babylon is.
*/
const bundle = async (entry: string) => {
  const result = await Bun.build({
    entrypoints: [entry],
    external: ["tosijs", "tosijs-3d", "tosijs-schema", "@babylonjs/*"],
    minify: true,
    target: "browser",
  });
  expect(result.success).toBe(true);
  return result.outputs[0]!.text();
};

/** Markers unique to the editor. Any survivor means a game ships the tool. */
const EDITOR_MARKERS = [
  "ensemble-editor-chrome",
  "tosi-ensemble-editor",
  "panel3d",
];

/**
 * Markers unique to the combat preset.
 *
 * The format is not a combat format, so a scene that never asks for hit points
 * must not carry them — no `b3d-destroyable` binding, no `shield` role, no
 * unreachable-shield rule. This is the same discipline as the editor split, one
 * layer down.
 */
const COMBAT_MARKERS = ["unreachable-shield", "b3dTurret", "launchpad"];

describe("tree-shaking", () => {
  it("a game importing the format does not get the editor", async () => {
    const code = await bundle("./src/__fixtures__/game-import.ts");
    for (const marker of EDITOR_MARKERS) expect(code).not.toContain(marker);
  });

  it("a scene-only import does not get the combat preset", async () => {
    const code = await bundle("./src/__fixtures__/game-import.ts");
    for (const marker of COMBAT_MARKERS) expect(code).not.toContain(marker);
  });

  it("the combat preset DOES carry its vocabulary (the check can fail)", async () => {
    const code = await bundle("./src/presets/combat.ts");
    expect(code).toContain("unreachable-shield");
  });

  it("the editor entry DOES include the chrome (the check can fail)", async () => {
    // Guards the test above: if the markers stopped appearing for an unrelated
    // reason (renamed, minified away), the first test would pass vacuously.
    const code = await bundle("./src/editor/ensemble-editor.ts");
    expect(code).toContain("tosi-ensemble-editor");
  });

  it("the format layer alone pulls in no engine binding", async () => {
    const code = await bundle("./src/format/validate.ts");
    expect(code).not.toContain("b3dDestroyable");
    expect(code).not.toContain("b3dTerrain");
  });
});
