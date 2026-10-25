import { describe, expect, it } from "bun:test";

/*
  <tosi-ensemble> registers the scene features itself (0.5.1). The check needs
  a module registry nothing else has touched, so it runs in a FRESH process:
  see src/__fixtures__/ensemble-element-registers.ts.
*/
describe("<tosi-ensemble> in a fresh process", () => {
  it("registers the scene features on connect, keeps a consumer's own, and not the presets", () => {
    const run = Bun.spawnSync(
      ["bun", "test", "./src/__fixtures__/ensemble-element-registers.ts"],
      { cwd: new URL("../..", import.meta.url).pathname }
    );
    const out = run.stdout.toString() + run.stderr.toString();
    expect(out).toContain("2 pass");
    expect(run.exitCode).toBe(0);
  });
});

/*
  NEVER REUSE A FLATTENING ACROSS ASSIGNMENTS (#3441, tested by #3495). The
  build reuses the last flattening when it came `from` the same object, so a
  document changed IN PLACE and assigned again was built from the old
  flattening: the edit never showed.
*/
describe("<tosi-ensemble> assignment", () => {
  it("drops the last flattening, even when the same object is assigned again", async () => {
    const { TosiEnsemble } = await import("./ensemble-element.js");
    const el = new TosiEnsemble() as unknown as {
      ensemble: unknown;
      _flattened: unknown;
    };
    const data = { name: "same", pieces: [] };
    el.ensemble = data;
    // As the async mount leaves it once it has flattened `data`.
    el._flattened = { ensemble: data, from: data };
    data.name = "changed in place";
    el.ensemble = data;
    expect(el._flattened).toBeNull();
  });
});

/*
  THE ELEMENT'S NESTED CACHE (board #3429, from the 0.8.0 review): which
  assignments keep the nested ensembles it has loaded, and which url their
  relative refs resolve against. Tested before only by tests/nested.pw.ts.
*/
describe("<tosi-ensemble>'s nested cache", () => {
  type El = {
    ensemble: unknown;
    load(url: string): Promise<void>;
    _nested: Map<string, unknown>;
    _base: string | undefined;
  };
  const doc = { name: "outer", pieces: [] };
  const make = async () => {
    const { TosiEnsemble } = await import("./ensemble-element.js");
    return new TosiEnsemble() as unknown as El;
  };
  const respond = (body: unknown, ok = true) =>
    (async () =>
      ({
        ok,
        status: ok ? 200 : 404,
        statusText: ok ? "OK" : "Not Found",
        json: async () => body,
      } as Response)) as unknown as typeof fetch;

  it("a load re-reads its nested ensembles and resolves against its url", async () => {
    const el = await make();
    const stale = new Map([["/old/child.json", {}]]);
    el._nested = stale;
    const real = globalThis.fetch;
    globalThis.fetch = respond(doc);
    try {
      await el.load("/ensembles/outer.json");
    } finally {
      globalThis.fetch = real;
    }
    expect(el._base).toBe("/ensembles/outer.json");
    expect(el._nested).not.toBe(stale);
    expect(el._nested.size).toBe(0);
  });

  it("an assigned document drops the cache and the url: its refs are the page's", async () => {
    const el = await make();
    el._base = "/ensembles/outer.json";
    el._nested = new Map([["/ensembles/child.json", {}]]);
    el.ensemble = doc;
    expect(el._base).toBeUndefined();
    expect(el._nested.size).toBe(0);
  });

  it("a failed load keeps the cache and the url it had", async () => {
    const el = await make();
    const kept = new Map([["/ensembles/child.json", {}]]);
    el._base = "/ensembles/outer.json";
    el._nested = kept;
    const real = globalThis.fetch;
    globalThis.fetch = respond(null, false);
    try {
      await el.load("/ensembles/missing.json");
    } finally {
      globalThis.fetch = real;
    }
    expect(el._base).toBe("/ensembles/outer.json");
    expect(el._nested).toBe(kept);
  });
});
