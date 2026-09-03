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
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

/** The lowest version a caret range admits — `^0.7.8` → `0.7.8`. */
const floorOf = (range: string): string => range.replace(/^[\^~>=\s]+/, "");

describe("the peer range is a promise we keep", () => {
  it("declares tosijs-3d as a peer", () => {
    expect(pkg.peerDependencies?.["tosijs-3d"]).toBeString();
  });

  it("develops against the FLOOR of the range it advertises", () => {
    const advertised = floorOf(pkg.peerDependencies["tosijs-3d"]);
    const installed = JSON.parse(
      readFileSync("node_modules/tosijs-3d/package.json", "utf8")
    ).version;
    /*
      Equal, not "satisfies". Installing anything ABOVE the floor is exactly how
      0.1.0 shipped a symbol its own range did not guarantee — and it is
      invisible, because everything passes.
    */
    expect(`${installed} (installed) vs ${advertised} (range floor)`).toBe(
      `${advertised} (installed) vs ${advertised} (range floor)`
    );
  });

  it("keeps the dev dependency pinned to that same floor", () => {
    // Pinned, not caret: a caret devDependency drifts upward on any install and
    // takes the floor invariant with it, silently.
    expect(pkg.devDependencies?.["tosijs-3d"]).toBe(
      floorOf(pkg.peerDependencies["tosijs-3d"])
    );
  });
});
