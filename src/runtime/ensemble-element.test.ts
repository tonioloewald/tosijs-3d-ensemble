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
