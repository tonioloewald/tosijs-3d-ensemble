import { expect, it } from "bun:test";
import { readFileSync } from "node:fs";

/*
  THE BUN YOU BUILD WITH IS THE BUN CI BUILDS WITH.

  `docs/` is committed and CI asserts a rebuild reproduces it, and Bun 1.4.0
  and 1.4.2 bundle the same lockfile differently. So a local Bun upgrade,
  which nobody decides and nobody notices, turns every push red: CI failed on
  939 files for three consecutive pushes before anyone looked, because the
  failure only happened THERE. This makes it fail HERE, on the first
  `bun test`. `.bun-version` is also what CI and `publish.yml` install.
*/
it("local Bun matches .bun-version", () => {
  const pinned = readFileSync(
    new URL("../.bun-version", import.meta.url),
    "utf8"
  ).trim();
  expect(Bun.version).toBe(pinned);
});
