import { describe, expect, it } from "bun:test";
import { iconData, iconNames } from "tosijs-3d";
import { registerEditorTools } from "./tools/built-in";
import { registeredCommands, registeredTools } from "./tools/tool-registry";

/*
  AN ICON NAME IS A STRING, AND A WRONG ONE FAILS SILENTLY-ISH.

  `iconGlyph` — the path `iconGrid3d` rasterises for in-scene panels — draws a
  fallback BOX for a name it does not know and warns once per render. That is
  how `cornerUpLeft` shipped: Undo appeared as an empty square and the console
  filled with `iconGlyph: unknown icon`, thousands of lines, reported by the
  owner twice before it was traced.

  It is not enough to check the name EXISTS. Every left-facing arrow in the set
  is a MIRROR REFERENCE — `cornerUpLeft` is stored as the string
  `cornerUpRight0f` — and `iconGlyph` resolves neither suffixes nor mirrors,
  though the DOM path (`svgIcons`) does. So the test a typo cannot slip past is:
  the name must resolve to real SVG MARKUP, not to another name.
*/

const REAL = new Set(
  iconNames().filter((name) => {
    const entry = (iconData as unknown as Record<string, string>)[name];
    return typeof entry === "string" && entry.trimStart().startsWith("<svg");
  })
);

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
  it("has a non-empty set of real glyphs to check against", () => {
    // Guards the guard: if the upstream shape changes, REAL could silently
    // empty out and every assertion below would pass vacuously.
    expect(REAL.size).toBeGreaterThan(20);
    expect(REAL.has("cornerUpRight")).toBe(true);
  });

  it("uses only glyphs iconGlyph can actually draw", () => {
    const broken = iconsInUse()
      .filter(({ icon }) => icon !== "")
      .filter(({ icon }) => !REAL.has(icon));
    expect(broken).toEqual([]);
  });

  it("rejects mirror references, which render as a fallback box", () => {
    // The exact mistake that shipped. If this ever passes, iconGlyph learned to
    // resolve mirrors and the workaround in built-in.ts can go.
    expect(REAL.has("cornerUpLeft")).toBe(false);
  });
});
