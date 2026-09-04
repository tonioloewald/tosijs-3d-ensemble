import { describe, expect, it } from "bun:test";
import { iconData } from "tosijs-3d";
import { registerEditorTools } from "./tools/built-in.js";
import { registeredCommands, registeredTools } from "./tools/tool-registry.js";

/*
  AN ICON NAME IS A STRING, AND A WRONG ONE FAILS QUIETLY.

  `iconGlyph` draws a fallback BOX for a name it cannot resolve. That is how
  `cornerUpLeft` shipped as an empty square where Undo should be, with the
  console filling up behind it, reported twice before it was traced.

  The rule this pins CHANGED in tosijs-3d 0.7.6, so the test changed with it.
  Before: only names stored as literal markup resolved, because every mirrored
  name (`cornerUpLeft` is stored as the string `cornerUpRight0f`) failed to
  parse on the texture path. Now the icon language works, and a name is good if
  `icon-data` knows it — whether it holds markup or redirects to a variant.

  Upstream exports `iconExists()` for exactly this question, which would be
  better than reading `iconData` ourselves, but it is not re-exported from the
  package barrel and the `exports` map does not expose the subpath. Asked for;
  until then this is the reachable equivalent for plain (unsuffixed) names.
*/

const KNOWN = iconData as unknown as Record<string, string>;

registerEditorTools();

const iconsInUse = (): Array<{ owner: string; icon: string }> => [
  ...registeredTools().map((t) => ({
    owner: `tool:${t.name}`,
    icon: t.icon ?? "",
  })),
  ...registeredCommands().map((c) => ({
    owner: `command:${c.name}`,
    icon: c.icon ?? "",
  })),
];

describe("icon names", () => {
  it("has a real icon table to check against", () => {
    // Guards the guard: if the upstream shape changes, every assertion below
    // could pass vacuously against an empty object.
    expect(Object.keys(KNOWN).length).toBeGreaterThan(50);
    expect("cornerUpRight" in KNOWN).toBe(true);
  });

  it("uses only names icon-data knows", () => {
    const unknown = iconsInUse()
      .filter(({ icon }) => icon !== "")
      .filter(({ icon }) => !(icon in KNOWN));
    expect(unknown).toEqual([]);
  });

  it("can reach a mirrored name, which 0.7.6 fixed", () => {
    // Undo depends on this one. If it ever regresses, Undo silently becomes a
    // box again — which is precisely how this started.
    expect("cornerUpLeft" in KNOWN).toBe(true);
  });

  it("mirrors undo horizontally from redo", () => {
    // `cornerUpLeft` is `cornerUpRight` mirrored — equivalently a 180° turn of
    // `cornerDownRight`. Undo is the mirrored name, so if the icon language
    // regresses upstream this is the assertion that catches it.
    const by = (name: string) =>
      iconsInUse().find((i) => i.owner === `command:${name}`)?.icon;
    expect([by("undo"), by("redo")]).toEqual(["cornerUpLeft", "cornerUpRight"]);
  });
});
