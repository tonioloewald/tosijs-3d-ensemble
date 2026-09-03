import { describe, expect, it } from "bun:test";
import { registeredFeatures } from "./registry";
import { registerSceneFeatures } from "../runtime/features-scene";
import { registerWorldPreset } from "../presets/world";
import { registerCombatPreset } from "../presets/combat";

/*
  EVERY BUILT-IN FEATURE MUST SAY WHAT IT LOOKS LIKE.

  The piece list reads `icon` off the registration rather than switching on
  the feature name, which is what keeps a consumer's feature indistinguishable
  from a built-in. The cost of that is that a NEW feature which forgets the
  field ships a blank row — silently, since a missing glyph is just a slightly
  narrower label. This is the only thing that would notice.

  Emoji are the stopgap: tosijs-3d's icon set is 61 pieces of UI chrome with no
  sun, light, water or mesh in it. Asked for in tosijs-3d#64, together with an
  icon COLUMN type for `table`, whose cells render `String(v)` today.
*/
registerSceneFeatures();
registerWorldPreset();
registerCombatPreset();

describe("feature icons", () => {
  it("registered enough features to be checking anything", () => {
    // Guards the guard: an empty registry passes every assertion below.
    expect(registeredFeatures().length).toBeGreaterThan(15);
  });

  it("gives every built-in feature an icon", () => {
    const blank = registeredFeatures()
      .filter((f) => !f.icon)
      .map((f) => f.name);
    expect(blank).toEqual([]);
  });

  it("keeps them one glyph wide", () => {
    /*
      A row is `{icon} {id}`, so a two-character icon shifts that row's name
      out of line with every other one. Emoji are multi-CODE-UNIT — ☀️ is a
      sun plus a variation selector — so this counts GRAPHEMES, which is the
      thing that actually occupies a column.
    */
    const split = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    const wide = registeredFeatures()
      .filter((f) => f.icon && [...split.segment(f.icon)].length !== 1)
      .map((f) => `${f.name}: ${f.icon}`);
    expect(wide).toEqual([]);
  });

  it("registers each built-in name exactly once", () => {
    /*
      `registerFeature` OVERWRITES by design — that is how a consumer replaces
      a built-in — so two built-ins claiming one name is silent, and the winner
      is whichever preset was imported last.

      This found a real one. `world`'s hand-rolled `lamp` (colour, brightness,
      flicker) shadowed the scene layer's, which is built on tosijs-3d's
      `lightSettingsSchema` and is what `pirate-cove.json`'s lantern is
      actually written against — so any app loading both presets would have
      bound the lantern with a feature that does not understand its config, and
      nothing would have said so. The older one had no users and is gone.
    */
    const names = registeredFeatures().map((f) => f.name);
    expect(names.length).toBe(new Set(names).size);
  });

  it("does not give two features the same icon", () => {
    // The icon is the only thing distinguishing two rows at a glance, so a
    // duplicate makes the column decorative rather than informative.
    const byIcon = new Map<string, string[]>();
    for (const f of registeredFeatures()) {
      if (f.icon) byIcon.set(f.icon, [...(byIcon.get(f.icon) ?? []), f.name]);
    }
    const clashes = [...byIcon.entries()]
      .filter(([, names]) => names.length > 1)
      .map(([icon, names]) => `${icon} ${names.join(" + ")}`);
    expect(clashes).toEqual([]);
  });
});
