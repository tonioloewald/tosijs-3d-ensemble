import { afterEach, describe, expect, test } from "bun:test";
import {
  featureProvides,
  registerFeature,
  unregisterFeature,
} from "./registry.js";
import { registerSceneFeatures } from "../runtime/features-scene.js";

/*
  The editor's backdrop yields each part to whatever the ensemble PROVIDES,
  and a game's own floor has to be able to say it is one (#4210).
*/
describe("featureProvides", () => {
  afterEach(() => {
    unregisterFeature("podFloor");
  });

  test("a feature provides the part it is named for, registered or not", () => {
    expect(featureProvides("ground")).toEqual(["ground"]);
    expect(featureProvides("skybox")).toEqual(["skybox"]);
    expect(featureProvides("spin")).toEqual([]);
  });

  test("the built-in sun and terrain declare what they stand in for", () => {
    registerSceneFeatures();
    expect(featureProvides("sun")).toEqual(["light"]);
    expect(featureProvides("terrain")).toEqual(["ground"]);
  });

  test("a consumer's floor says it is ground", () => {
    expect(featureProvides("podFloor")).toEqual([]);
    registerFeature({
      name: "podFloor",
      schema: { type: "object", "x-accepts": "*" },
      provides: ["ground"],
    });
    expect(featureProvides("podFloor")).toEqual(["ground"]);
  });
});
