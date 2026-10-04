import { describe, expect, it } from "bun:test";
import { effectiveConfig } from "./registry.js";

/*
  EVERY DEFAULT IN A FEATURE'S SCHEMA APPLIES.

  The editor inserts a primitive with an empty config and the panel shows each
  unset field at its schema default. Until `effectiveConfig`, nothing applied
  those defaults, so the element ran on its own: a new ground showed
  400 x 400 m and rendered 4 x 4. These pin the rule, the precedence, and that
  the allow-list still holds with defaults underneath it.
*/
const reg = {
  schema: {
    "x-accepts": ["width", "texture", "url"],
    properties: {
      width: { type: "number", default: 400 },
      texture: { type: "string", default: "checker" },
      url: { type: "string", format: "uri-reference" },
    },
  },
};

describe("effectiveConfig", () => {
  it("an empty config gets every schema default", () => {
    expect(effectiveConfig(reg, {})).toEqual({
      width: 400,
      texture: "checker",
    });
  });

  it("the document wins over a default", () => {
    expect(effectiveConfig(reg, { width: 12 })).toEqual({
      width: 12,
      texture: "checker",
    });
  });

  it("a key removed from the document goes back to its default", () => {
    // What the editor's live update now sends after a key is deleted.
    const before = effectiveConfig(reg, { width: 12 });
    const after = effectiveConfig(reg, {});
    expect([before.width, after.width]).toEqual([12, 400]);
  });

  it("still narrows: undeclared keys and refused urls are dropped", () => {
    const out = effectiveConfig(reg, {
      innerHTML: "<img onerror=x>",
      url: "javascript:alert(1)",
    });
    expect(out).toEqual({ width: 400, texture: "checker" });
  });

  it("a schema without defaults passes the config through", () => {
    const bare = { schema: { properties: { a: { type: "number" } } } };
    const cfg = { a: 1 };
    expect(effectiveConfig(bare, cfg)).toBe(cfg);
  });
});
