import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";

/*
  THE PUBLISHED ENTRY, IMPORTED THE WAY A CONSUMER RESOLVES IT.

  v0.1.3 was "the published package could not be imported by Node at all", and
  every deep-import test was green at the time. The 0.3.0 review found the same
  shape again: `node -e "import('./dist/index.js')"` throws
  `ReferenceError: HTMLElement is not defined`, while the docs had started
  saying a generator can import and build headlessly.

  Both halves of the truth are pinned here, because each is load-bearing and
  neither is obvious:

  - `runtime/build` and `format/validate` DO import under plain Node. That is
    what `placePiece` not defaulting to `placeMesh` buys, and it is the only
    reason a generator can validate and emit without a browser.
  - The BARREL does not, and cannot: it exports `ensembleEditor`, a custom
    element, so evaluating it needs `HTMLElement`. Tree-shaking saves a
    bundler; a plain `import()` evaluates the whole module graph. Asserting
    this rather than wishing it away is what stops the next reader "fixing" the
    barrel and quietly moving the editor into a game's runtime.

  ⚠️ Reads `dist/`, so it needs `bun run build` first and skips without it.
  A skip is NOT a pass — `bun run build` is part of the release gate, and
  `release-doctor` runs both.
*/
const built = existsSync("dist/index.js") && existsSync("dist/runtime/build.js");

const importsUnderNode = async (specifier: string) => {
  const proc = Bun.spawn(
    ["node", "-e", `import('${specifier}').then(()=>process.exit(0),()=>process.exit(1))`],
    { stdout: "ignore", stderr: "pipe" }
  );
  return (await proc.exited) === 0;
};

describe.skipIf(!built)("what a generator can import under plain Node", () => {
  it("runtime/build imports — the whole point of placePiece not defaulting", async () => {
    expect(await importsUnderNode("./dist/runtime/build.js")).toBe(true);
  });

  it("format/validate imports — a generator validates before it emits", async () => {
    expect(await importsUnderNode("./dist/format/validate.js")).toBe(true);
  });

  it("the BARREL does not, because it exports a custom element", async () => {
    /*
      Not a defect to fix — a fact to document. `index.js` re-exports
      `ensembleEditor`, and defining a custom element needs `HTMLElement`. If
      this ever starts passing, either the editor left the barrel (good, say so
      in the changelog) or something made the barrel lazy (check what, because
      the tree-shaking guarantee lives in the same place).

      What must NOT happen is the docs claiming the barrel works headlessly
      while it throws — that is the v0.1.3 shape, and it recurred in 0.3.0.
    */
    expect(await importsUnderNode("./dist/index.js")).toBe(false);
  });
});
