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
