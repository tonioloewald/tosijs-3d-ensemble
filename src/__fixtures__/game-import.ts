/*
  What a GAME imports: the format and the instantiator, through the package's
  own entry point. Used by tree-shaking.test.ts — bundling this must not drag
  the editor in. Not part of the published surface.
*/
export {
  buildEnsemble,
  loadEnsemble,
  validate,
  registerSceneFeatures,
  ensemble, // <tosi-ensemble> — the one-line embed a game uses
} from "../index.js";
