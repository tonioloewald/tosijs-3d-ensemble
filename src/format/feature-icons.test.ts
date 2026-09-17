import { afterAll, describe, expect, it } from "bun:test";
import { registeredFeatures } from "./registry.js";
import { registerSceneFeatures } from "../runtime/features-scene.js";
import { registerWorldPreset } from "../presets/world.js";
import { registerCombatPreset } from "../presets/combat.js";

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
/*
  PUT IT BACK — and this file did not, which CI caught on its first ever run.

  Registries are GLOBAL and the suite shares one process, so a file that loads
  a preset and walks away changes the answers in every other file. Two of them
  assert the format ships no domain — `roles.test.ts` ("ships NO roles") and
  `validate.test.ts` ("does NOT know about shields") — and both went red on the
  runner while every local run was green, purely because bun reached the files
  in a different order there.

  That is the worst shape a test failure has: it is not about the file it
  fails in, it is order-dependent, and it is invisible on the machine that
  wrote it. `manta-mvp.test.ts` has carried this rule in a comment since it was
  written; these two registrations predate the comment and never followed it.
*/
registerSceneFeatures();
registerWorldPreset();
const dropCombat = registerCombatPreset();
/*
  ⚠️ Only COMBAT is restored, because only `registerCombatPreset` returns a
  teardown — `registerSceneFeatures` and `registerWorldPreset` return void, so
  a file that loads them cannot put them back. That is fine for what is
  currently asserted (the domain-free tests are about ROLES and about combat's
  shield rule, and neither of the other two registers a role) and it is a
  latent version of the same trap. Worth a teardown upstream of here if a test
  ever needs a registry without them.
*/
afterAll(() => dropCombat());

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
