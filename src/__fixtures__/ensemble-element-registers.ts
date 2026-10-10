import { describe, expect, it } from "bun:test";
import { featureRegistration } from "../format/registry.js";
import { TosiEnsemble } from "../runtime/ensemble-element.js";

/*
  PURE MARKUP NEEDS NO SETUP CALL (0.5.1).

  The element registers the scene features the first time one connects. The
  doc page could not prove it (something else on that page registers them
  first; falsified 2026-10-10: the page passed with the call removed), so it
  is checked here, where nothing else runs: unregistered before, registered
  after connecting a bare element.

  ⚠️ RUN IN ITS OWN PROCESS, by `src/runtime/ensemble-element.test.ts`. In the
  shared suite another file registers the scene features first, so "not
  registered before" cannot hold. Not a `*.test.ts`, so the default run skips
  it; under `__fixtures__`, so it never ships.
*/
describe("<tosi-ensemble> brings the scene vocabulary", () => {
  it("registers the scene features when it connects", () => {
    expect(TosiEnsemble).toBeDefined();
    const before = featureRegistration("sun");
    const el = document.createElement("tosi-ensemble");
    document.body.append(el);
    const after = featureRegistration("sun");
    el.remove();
    expect([before === undefined, after !== undefined]).toEqual([true, true]);
  });

  it("does not register the opt-in presets", () => {
    const el = document.createElement("tosi-ensemble");
    document.body.append(el);
    el.remove();
    expect(featureRegistration("destroyable")).toBeUndefined();
    expect(featureRegistration("turret")).toBeUndefined();
  });
});
