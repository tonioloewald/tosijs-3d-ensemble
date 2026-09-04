import { afterEach, describe, expect, it } from "bun:test";
import { buildEnsemble } from "./build.js";
import {
  linkPayload,
  registerLink,
  unregisterLink,
} from "../format/registry.js";
import type { LinkContext, SceneElement } from "../format/registry.js";
import type { Ensemble } from "../format/types.js";

/*
  THE PHASE THAT WAS DOCUMENTED AND ABSENT.

  `buildEnsemble`'s header promised the instantiator wires `ensemble.links`, and
  nothing read them — so an ensemble with chain reactions built cleanly, reported
  no problems, and did nothing. These are the assertions that would have caught
  it, which is the only reason to trust the fix.
*/
const fakeScene = () =>
  ({ appendChild: () => {}, remove: () => {} } as unknown as SceneElement);

const registered: string[] = [];
const register = (...args: Parameters<typeof registerLink>) => {
  registered.push(args[0].name);
  registerLink(...args);
};
afterEach(() => {
  while (registered.length) unregisterLink(registered.pop()!);
});

const twoPieces = (links: unknown[]): Ensemble =>
  ({
    name: "linked",
    pieces: [
      { id: "reactor", mesh: "R", at: [0, 0, 0] },
      { id: "field", mesh: "F", at: [0, 10, 0] },
    ],
    links,
  } as Ensemble);

describe("the link phase", () => {
  it("invokes a handler for a payload key", () => {
    const seen: Array<Record<string, unknown>> = [];
    register({ name: "delay", bind: (cfg) => seen.push(cfg) });
    buildEnsemble(twoPieces([{ from: "reactor", to: "field", delay: 0.4 }]), {
      scene: fakeScene(),
    });
    // A scalar payload arrives boxed, so a handler always gets an object.
    expect(seen).toEqual([{ value: 0.4 }]);
  });

  it("hands the handler BOTH resolved ends", () => {
    /*
      The thing a feature `link` hook could not do. A chain is a property of the
      LINK, not of either endpoint — whichever end wired it would have to reach
      across, and both trying leaves teardown ambiguous.
    */
    let ctx: LinkContext | null = null;
    register({ name: "delay", bind: (_cfg, c) => (ctx = c) });
    buildEnsemble(twoPieces([{ from: "reactor", to: "field", delay: 1 }]), {
      scene: fakeScene(),
    });
    expect(ctx!.from!.piece.id).toBe("reactor");
    expect(ctx!.to!.piece.id).toBe("field");
    expect(ctx!.to!.at).toEqual([0, 10, 0]);
  });

  it("runs a handler per payload key, so one link can do two things", () => {
    const seen: string[] = [];
    register({ name: "delay", bind: () => seen.push("delay") });
    register({ name: "beam", bind: () => seen.push("beam") });
    buildEnsemble(
      twoPieces([{ from: "reactor", to: "field", delay: 0.4, beam: true }]),
      { scene: fakeScene() }
    );
    expect(seen.sort()).toEqual(["beam", "delay"]);
  });

  it("ignores a payload key nobody registered", () => {
    // A consumer's own link kind is theirs to register; an unknown one is not
    // an error, for the same reason an unregistered feature is only a warning.
    const built = buildEnsemble(
      twoPieces([{ from: "reactor", to: "field", nobodyHandlesThis: 1 }]),
      { scene: fakeScene() }
    );
    expect(built.problems).toEqual([]);
  });

  it("resolves a dangling end to undefined rather than throwing", () => {
    // `validate` already reports it. Throwing here would cost an author the
    // rest of a scene they are mid-edit on.
    let ctx: LinkContext | null = null;
    register({ name: "delay", bind: (_c, c2) => (ctx = c2) });
    buildEnsemble(twoPieces([{ from: "reactor", to: "ghost", delay: 1 }]), {
      scene: fakeScene(),
    });
    expect(ctx!.from!.piece.id).toBe("reactor");
    expect(ctx!.to).toBeUndefined();
  });

  it("reports a handler that throws, and builds the rest", () => {
    register({
      name: "delay",
      bind: () => {
        throw new Error("nope");
      },
    });
    const built = buildEnsemble(
      twoPieces([{ from: "reactor", to: "field", delay: 1 }]),
      { scene: fakeScene() }
    );
    expect(built.problems.map((p) => p.code)).toEqual(["link-bind-failed"]);
    expect(built.pieces.size).toBe(2);
  });

  it("disposes what a handler registered", () => {
    let torn = 0;
    register({
      name: "beam",
      bind: (_cfg, ctx) => ctx.onDispose(() => (torn += 1)),
    });
    const built = buildEnsemble(
      twoPieces([{ from: "reactor", to: "field", beam: true }]),
      { scene: fakeScene() }
    );
    built.dispose();
    expect(torn).toBe(1);
  });
});

describe("where a link's payload lives", () => {
  it("reads the top-level spelling, which is what files in the wild use", () => {
    expect(linkPayload({ from: "a", to: "b", delay: 0.4 } as never)).toEqual({
      delay: 0.4,
    });
  });

  it("reads the documented `values` spelling too", () => {
    expect(
      linkPayload({ from: "a", to: "b", values: { delay: 0.4 } } as never)
    ).toEqual({ delay: 0.4 });
  });

  it("never treats the format's own fields as payload", () => {
    expect(
      linkPayload({ from: "a", to: "b", kind: "power", delay: 1 } as never)
    ).toEqual({ delay: 1 });
  });

  it("lets the explicit spelling win a collision", () => {
    expect(
      linkPayload({
        from: "a",
        to: "b",
        delay: 1,
        values: { delay: 2 },
      } as never)
    ).toEqual({ delay: 2 });
  });
});
