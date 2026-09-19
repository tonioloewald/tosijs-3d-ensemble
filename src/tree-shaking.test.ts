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

  /*
    THE KERNEL IS ENGINE-FREE AND DOM-FREE, AND THAT IS NOW A TEST.

    Asked directly by tosijs-3d#9: if a UI format were to share this format
    kernel, would an adopter need Babylon to validate a menu? The answer has
    been "no, in practice" — `build.js` imports under plain Node, which is why
    `placePiece` deliberately does not default to `placeMesh`. But "in practice"
    is a property nothing was checking, and the layering question above wants
    to build on it.

    The test above cannot answer it: `bundle` marks the engine EXTERNAL, so a
    format module importing tosijs-3d would leave an untouched `import` and
    still pass its marker checks. Here the import SPECIFIER is what is asserted,
    which is exactly what external leaves behind.

    Measured when written: 13.7 KB, six modules, and it validates a document
    under plain Node 22 with no globals beyond the language.
  */
  const ENGINE_IMPORTS = ["tosijs-3d", "@babylonjs"];
  const DOM_GLOBALS = ["customElements", "HTMLElement", "document."];

  it("the format kernel imports no engine and touches no DOM", async () => {
    const code = await bundle("./src/format/validate.ts");
    for (const spec of ENGINE_IMPORTS) expect(code).not.toContain(spec);
    for (const g of DOM_GLOBALS) expect(code).not.toContain(g);
  });

  /*
    A SIZE CEILING, because nothing was watching the number at all.

    `bun run build` prints the DOC SITE's sizes — never the library entry a
    consumer ships, and never a delta. The thing that would actually hurt an
    adopter is a step change: the editor leaking into a game's bundle takes it
    from 8 kB to 74 kB, and the marker assertions above catch exactly that one
    cause. This catches the others — a heavy dependency pulled in by a feature,
    a preset that stops being opt-in — without anybody having to think of them
    in advance.

    GZIPPED, because that is what crosses the wire, and it is far less noisy
    than raw bytes under a minifier's whims.

    The ceiling is deliberately loose. This is a smoke alarm, not a budget: a
    test that fails on a 2% drift gets its number bumped without being read,
    and then it is furniture. Measured at 8.5 kB when written.
  */
  it("a game's bundle stays about the size a game's bundle should be", async () => {
    const code = await bundle("./src/__fixtures__/game-import.ts");
    const gzipped = Bun.gzipSync(Buffer.from(code)).byteLength;
    /*
      ⚠️ The fixture CONSUMES its imports, and that is load-bearing for this
      assertion. It used to be a bare re-export, which Bun shook down to a
      101-byte stub — so a ceiling here would have been asserting against 101
      bytes while the real entry grew without limit.
    */
    expect(gzipped).toBeGreaterThan(4_000);
    expect(gzipped).toBeLessThan(14_000);
  });

  it("a runtime placer DOES import the engine (the check can fail)", async () => {
    // Without this, the assertion above would pass just as happily if the
    // specifier had been renamed or the bundle had come out empty.
    const code = await bundle("./src/runtime/place-mesh.ts");
    expect(code).toContain("tosijs-3d");
  });
});
