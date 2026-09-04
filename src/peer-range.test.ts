import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

/*
  DEVELOP AGAINST THE FLOOR OF THE RANGE YOU ADVERTISE.

  `tosijs-3d-ensemble@0.1.0` shipped importing `DEFAULT_LIGHT` from `tosijs-3d`,
  a symbol that exists ONLY in 0.7.8 — while the peer range said `^0.7.0`. Every
  gate here was green, because this checkout had 0.7.8 installed. An adopter on
  0.7.4 (inside the advertised range) got:

      SyntaxError: Export named 'DEFAULT_LIGHT' not found

  and it takes the BARREL down, so `validate` and `buildEnsemble` fail with it —
  the first import line in `MIGRATING.md` is the one that cannot work. Reported
  as #1 by the first consumer to install it, which is the worst possible way to
  find out.

  No test of the code could have caught it: the code is correct against the
  version on disk. What was wrong was the PROMISE. So this checks the promise:
  if we develop against the floor of our own range, then anything we can import
  exists in the floor by construction, and the whole class of "works here,
  missing there" cannot survive a release.

  When a new upstream feature is worth adopting, raise the floor deliberately in
  the same commit — which is a decision about who you are breaking, and belongs
  in the changelog.
*/
/** The lowest version a caret range admits — `^0.7.8` → `0.7.8`. */
const floorOf = (range: string): string => range.replace(/^[\^~>=\s]+/, "");

/**
 * Peers we develop against the FLOOR of, with the reason for anything we do
 * not — so adding a peer forces the decision instead of inheriting silence.
 */
const EXEMPT: Record<string, string> = {
  // Babylon is a peer of `tosijs-3d` on the same `^9.0.0` range, so it is the
  // SCENE's dependency reaching through us rather than one we chose. Pinning
  // our dev copy to 9.0.0 would not make an adopter's resolution match ours,
  // and it would hold this repo a year behind the engine it renders with.
  "@babylonjs/core": "tosijs-3d owns this range; we only re-declare it",
};

describe("the peer range is a promise we keep", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const peers = Object.entries(pkg.peerDependencies ?? {}) as Array<
    [string, string]
  >;

  it("has peers to check", () => {
    // Guards the guard: an empty peer list passes every loop below.
    expect(peers.length).toBeGreaterThan(1);
  });

  it("develops against the FLOOR of every range it advertises", () => {
    /*
      ⚠️ This used to name `tosijs-3d` alone, and the gap was invisible for the
      same reason the original bug was: everything passes when the version on
      disk happens to be the one you wrote against. We then raised `tosijs` to
      `^1.9.2` and later to `^1.10.0` by hand, twice, with nothing checking
      either — and `tosijs` is exactly the dependency whose types we compile
      against, so a symbol from a version above our floor is the same
      `SyntaxError: Export named … not found` the comment above describes.
    */
    const drift: string[] = [];
    for (const [name, range] of peers) {
      if (EXEMPT[name]) continue;
      const advertised = floorOf(range);
      const installed = JSON.parse(
        readFileSync(`node_modules/${name}/package.json`, "utf8")
      ).version;
      // Equal, not "satisfies" — installing anything ABOVE the floor is
      // exactly how 0.1.0 shipped a symbol its own range did not guarantee.
      if (installed !== advertised) {
        drift.push(`${name}: ${installed} installed, floor is ${advertised}`);
      }
    }
    expect(drift).toEqual([]);
  });

  it("keeps each dev dependency pinned to that same floor", () => {
    // Pinned, not caret: a caret devDependency drifts upward on any install and
    // takes the floor invariant with it, silently.
    const loose: string[] = [];
    for (const [name, range] of peers) {
      if (EXEMPT[name]) continue;
      const dev = pkg.devDependencies?.[name];
      if (dev !== floorOf(range)) {
        loose.push(
          `${name}: devDependency "${dev}", floor is ${floorOf(range)}`
        );
      }
    }
    expect(loose).toEqual([]);
  });

  it("exempts nothing without a reason", () => {
    for (const [name, why] of Object.entries(EXEMPT)) {
      expect([name, typeof why === "string" && why.length > 20]).toEqual([
        name,
        true,
      ]);
    }
  });
});
