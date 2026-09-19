/*
  What a GAME imports: the format and the instantiator, through the package's
  own entry point. Used by `tree-shaking.test.ts` — bundling this must not drag
  the editor in. Not part of the published surface.

  ⚠️ IT CONSUMES WHAT IT IMPORTS, and it has to.

  This was a bare `export { … } from '../index.js'` — a pure re-export with
  nothing referencing the bindings, which Bun shakes down to a **101-byte
  stub**. The marker assertions still worked (nothing is a fine place to look
  for `panel3d`), but a size ceiling added on top of it would have been
  asserting against 101 bytes forever: a game entry that grew from 8 kB to
  80 kB would not have moved the number by one byte.

  So the exported function actually calls the things, which makes them roots
  the bundler must keep, and the measurement describes what a consumer ships.
*/
import {
  buildEnsemble,
  loadEnsemble,
  validate,
  registerSceneFeatures,
  ensemble,
  placeMesh,
} from "../index.js";
import type { SceneElement } from "../format/registry.js";
import type { Ensemble } from "../format/types.js";

/** A plausible smallest game: register, validate, build, embed. */
export function play(scene: SceneElement, doc: Ensemble): number {
  registerSceneFeatures();
  const problems = validate(doc);
  const built = buildEnsemble(doc, { scene, placePiece: placeMesh });
  // Referenced so the bundler keeps them; a game reaches for both.
  const reach = [loadEnsemble, ensemble].length;
  return problems.length + built.problems.length + reach;
}
