import { describe, expect, it } from "bun:test";
import { addSingleton, reapUnclaimedSingletons } from "./features-scene.js";
import type { FeatureContext, SceneElement } from "../format/registry.js";

/*
  THE BLACK SKY, AS A TEST.

  A scene-wide feature must be created once and MODIFIED thereafter. When it was
  created-and-destroyed per rebuild, `b3d-skybox` left a `SkyMaterial` behind
  every time — five of them, four orphaned, on a fresh page load with no edits —
  and because they share a name they share one cached GL program. Disposing any
  one deleted that program for the survivor, which went on reporting
  `isReady() === true` and drawing pure black about three loads in four.

  None of that is reachable from a unit test: it needs a GPU. What IS reachable,
  and what the whole failure hangs off, is the element churn — so that is what
  this pins. If a rebuild ever creates a second sky again, this fails.
*/

/** A scene stub that records children the way a DOM parent would. */
const fakeScene = () => {
  const children: Array<{ tagName: string; isConnected: boolean }> = [];
  const scene = {
    children,
    appendChild(el: { tagName: string; isConnected: boolean }) {
      el.isConnected = true;
      children.push(el);
    },
    querySelector(sel: string) {
      return (
        children.find(
          (c) => c.tagName.toLowerCase() === sel.toLowerCase() && c.isConnected
        ) ?? null
      );
    },
  };
  return scene as unknown as SceneElement & { children: typeof children };
};

const makeSky = (props: Record<string, unknown> = {}) => {
  const el = {
    tagName: "TOSI-B3D-SKYBOX",
    isConnected: false,
    remove() {
      this.isConnected = false;
      const i = created.indexOf(this);
      if (i >= 0) created.splice(i, 1);
    },
    ...props,
  };
  created.push(el);
  return el;
};
let created: Array<Record<string, unknown>> = [];

/** One build pass: returns the disposers it registered. */
const build = (scene: SceneElement, cfg: Record<string, unknown>) => {
  const disposers: Array<() => void> = [];
  const ctx = {
    scene,
    onDispose: (fn: () => void) => disposers.push(fn),
  } as unknown as FeatureContext;
  const el = addSingleton(
    ctx,
    "tosi-b3d-skybox",
    () => makeSky({ ...cfg }),
    cfg
  );
  return { el, dispose: () => disposers.forEach((d) => d()) };
};

describe("scene singletons", () => {
  it("reuses the same sky across rebuilds instead of recreating it", () => {
    created = [];
    const scene = fakeScene();

    const first = build(scene, { timeOfDay: 11 });
    // A rebuild is dispose-then-build, which is exactly the order that used to
    // destroy the element and strand its material.
    first.dispose();
    const second = build(scene, { timeOfDay: 14 });

    expect(second.el).toBe(first.el);
    expect(scene.children.filter((c) => c.isConnected)).toHaveLength(1);
    // "Modify what's there": the second build's config landed on the survivor.
    expect((second.el as unknown as { timeOfDay: number }).timeOfDay).toBe(14);
  });

  it("adopts a sky it did not create, so backdrop and ensemble cannot both make one", () => {
    created = [];
    const scene = fakeScene();
    const backdropSky = makeSky({ timeOfDay: 6 });
    (scene as unknown as { appendChild: (e: unknown) => void }).appendChild(
      backdropSky
    );

    const built = build(scene, { timeOfDay: 18 });

    expect(built.el).toBe(backdropSky as unknown as SceneElement);
    expect(scene.children.filter((c) => c.isConnected)).toHaveLength(1);
  });

  it("removes a sky nothing claimed, so deleting the piece deletes the sky", () => {
    created = [];
    const scene = fakeScene();

    const only = build(scene, { timeOfDay: 11 });
    only.dispose(); // the rebuild that follows no longer declares a sky
    reapUnclaimedSingletons(scene);

    expect(scene.children.filter((c) => c.isConnected)).toHaveLength(0);
  });

  it("does not reap a sky the following build re-claimed", () => {
    created = [];
    const scene = fakeScene();

    const first = build(scene, { timeOfDay: 11 });
    first.dispose();
    const second = build(scene, { timeOfDay: 11 });
    reapUnclaimedSingletons(scene);

    expect(second.el).toBe(first.el);
    expect(scene.children.filter((c) => c.isConnected)).toHaveLength(1);
  });
});
