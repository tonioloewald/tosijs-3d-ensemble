import { describe, expect, it } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/*
  EVERY RELATIVE IMPORT MUST CARRY ITS `.js` EXTENSION.

  Node's ESM resolver requires it. Bundlers do not — and everything in this
  project's own loop is a bundler or Bun, so `dist` shipped for three releases
  with extensionless imports and nothing here noticed:

      Error [ERR_MODULE_NOT_FOUND]: Cannot find module
        '…/dist/format/roles' imported from '…/dist/index.js'

  `tsc` emits the specifier verbatim, so the fix belongs in the SOURCE. This is
  `practices/releasing.md`'s "test the environment adopters have, not the clean
  room" — except the clean room was ours and the adopter was `node`.

  It matters beyond tidiness: this package claims `validate` and `buildEnsemble`
  work headlessly, because a generator emitting ensembles has no browser. That
  claim was false for anyone not running a bundler.

  Scanning SOURCE rather than `dist` deliberately: `dist` is gitignored and only
  exists after a build, so a test that needed it would be skipped exactly when
  someone is iterating — which is when the mistake gets made.
*/
const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sources(path);
    return path.endsWith(".ts") ? [path] : [];
  });

/** The two import forms `tsc` passes through verbatim. */
const RELATIVE = /(?:from|import\()\s*"(\.[^"]*)"/g;

/**
 * Comments out, before matching.
 *
 * Correct in general — a commented-out import is not an import — and required
 * in particular, because this file's own explanation contains examples of the
 * exact shape it hunts for, and the first run failed on itself.
 */
const code = (text: string): string =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("relative imports are Node-resolvable", () => {
  const files = sources("src");

  it("found the source tree", () => {
    // Guards the guard: an empty file list passes the assertion below.
    expect(files.length).toBeGreaterThan(20);
  });

  it("every relative import ends in .js", () => {
    const bare: string[] = [];
    for (const file of files) {
      const text = code(readFileSync(file, "utf8"));
      for (const match of text.matchAll(RELATIVE)) {
        const spec = match[1]!;
        if (!spec.endsWith(".js") && !spec.endsWith(".json")) {
          bare.push(`${file} → ${spec}`);
        }
      }
    }
    expect(bare).toEqual([]);
  });
});
