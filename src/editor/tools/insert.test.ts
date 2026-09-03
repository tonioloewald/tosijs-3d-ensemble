import { beforeEach, describe, expect, it } from "bun:test";
import { registerEditorTools } from "./built-in";
import { getTool } from "./tool-registry";
import type { ToolContext } from "./tool-registry";
import type { Ensemble, Vec3 } from "../../format/types";

/*
  INSERTING AN ENVIRONMENT PRIMITIVE.

  The format has always allowed a piece whose features ARE its body — that is
  how `sun`, `skybox` and `terrain` exist — but nothing could create one. The
  palette lists library MESHES, and every primitive has no mesh, so an author
  could edit the ones a file already had and never add another: "I can't add a
  terrain to a new scene."
*/
let ensemble: Ensemble;
let selected: string | null = null;

const ctx = (options: Record<string, unknown>): ToolContext =>
  ({
    ensemble,
    selection: null,
    select: (id: string | null) => (selected = id),
    scene: {} as never,
    edit: (_d: string, mutate: (e: Ensemble) => void) => mutate(ensemble),
    options: { gridSnap: 0, ...options },
    pick: () => null,
    // A click on the ground, three metres out.
    pickPoint: () => [3, 0, 0] as Vec3,
    captureCamera: () => {},
    panCamera: () => {},
    undo: () => {},
    redo: () => {},
    canUndo: () => false,
    canRedo: () => false,
    meshNames: () => [],
  } as unknown as ToolContext);

/** A click: the gesture starts and ends on the same ray. */
const ray = { origin: [0, 5, 0] as Vec3, direction: [0, -1, 0] as Vec3 };
const gesture = { primary: { ray: () => ray } } as never;

const place = (options: Record<string, unknown>) => {
  const tool = getTool("insert")!;
  tool.onGesture!.start!(gesture, ctx(options));
  tool.onGesture!.end!(gesture, ctx(options));
};

/*
  Registered ONCE. `registerEditorTools` is guarded against re-registration, so
  a test that unregisters between cases leaves every later case with no tool —
  which fails as `tool.onGesture is undefined`, several tests away from the
  cause.
*/
registerEditorTools();

beforeEach(() => {
  ensemble = { name: "t", pieces: [] };
  selected = null;
});

describe("inserting a utility", () => {
  it("places a piece whose feature is its body — no mesh", () => {
    place({ feature: "terrain", library: "utilities" });
    expect(ensemble.pieces).toEqual([
      { id: "terrain", at: [3, 0, 0], features: { terrain: {} } },
    ]);
  });

  it("leaves the config EMPTY so the schema's defaults apply", () => {
    /*
      Writing defaults in here would put them in the document as though the
      author had chosen them — and then a later change to a default could not
      reach the files that took it.
    */
    place({ feature: "skybox", library: "utilities" });
    expect(ensemble.pieces[0]!.features!.skybox).toEqual({});
  });

  it("does not record a library — a utility comes from no kit", () => {
    place({ feature: "sun", library: "utilities" });
    expect("library" in ensemble.pieces[0]!).toBe(false);
    expect("mesh" in ensemble.pieces[0]!).toBe(false);
  });

  it("selects what it placed", () => {
    place({ feature: "water", library: "utilities" });
    expect(selected).toBe("water");
  });

  it("gives a second one of the same kind its own id", () => {
    place({ feature: "lamp", library: "utilities" });
    place({ feature: "lamp", library: "utilities" });
    expect(ensemble.pieces.map((p) => p.id)).toEqual(["lamp", "lamp-2"]);
  });
});

describe("which of the two options wins", () => {
  it("places the FEATURE when one is armed", () => {
    // The palette clears the other when you choose, but the tool must not
    // depend on that: whichever is set is what gets placed.
    place({ feature: "fog", mesh: "barrel", library: "pirate" });
    expect(ensemble.pieces[0]!.features).toEqual({ fog: {} });
  });

  it("still places a mesh when no feature is armed", () => {
    place({ mesh: "barrel", library: "pirate" });
    expect(ensemble.pieces[0]).toEqual({
      id: "barrel",
      mesh: "barrel",
      at: [3, 0, 0],
    });
  });

  it("does nothing when neither is armed", () => {
    place({});
    expect(ensemble.pieces).toEqual([]);
  });
});
