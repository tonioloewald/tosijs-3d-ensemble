/*
  A DOM for tests that need one.

  Most of this project's tests are pure — the format, the drag maths, the door
  state machine — and deliberately need no browser. But anything that goes
  through the real feature registry imports tosijs, which touches `HTMLElement`
  at module load, so those tests need globals to exist before the import runs.

  Preloaded via bunfig.toml so it applies to every test file without each one
  remembering. It does NOT make these browser tests: there is no renderer and no
  layout, so a test that needs a scene still belongs in the browser.
*/
import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (typeof globalThis.HTMLElement === "undefined") {
  GlobalRegistrator.register();
}
