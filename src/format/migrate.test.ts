import { describe, expect, it } from "bun:test";
import { migrate, slugify } from "./migrate.js";
import type { Ensemble } from "./types.js";

const doc = (pieces: unknown[]): Ensemble =>
  ({ name: "legacy", pieces } as Ensemble);

describe("slugify", () => {
  it("makes a legible id from a mesh name", () => {
    expect(slugify("Dome Mystery")).toBe("dome-mystery");
    expect(slugify("Shield Projector A")).toBe("shield-projector-a");
  });
  it("never returns an empty id", () => {
    expect(slugify("   ")).toBe("piece");
    expect(slugify("!!!")).toBe("piece");
  });
});

describe("giving pieces ids", () => {
  it("names them after their mesh, not their index", () => {
    // The whole point: index-derived ids are what this format refuses.
    const { ensemble } = migrate(
      doc([{ mesh: "Dome Mystery", at: [0, 0, 0] }])
    );
    expect(ensemble.pieces[0]!.id).toBe("dome-mystery");
  });

  it("deduplicates repeats without renumbering anything", () => {
    const { ensemble } = migrate(
      doc([
        { mesh: "Dome Storage", at: [0, 0, 0] },
        { mesh: "Dome Storage", at: [1, 0, 0] },
        { mesh: "Dome Storage", at: [2, 0, 0] },
      ])
    );
    expect(ensemble.pieces.map((p) => p.id)).toEqual([
      "dome-storage",
      "dome-storage-2",
      "dome-storage-3",
    ]);
  });

  it("does not collide with an id written LATER in the file", () => {
    /*
      Claiming every existing id before generating any. One pass that read and
      wrote together would hand piece 0 the name piece 1 already has, and the
      two would silently merge in every map keyed by id.
    */
    const { ensemble } = migrate(
      doc([
        { mesh: "Dome Storage", at: [0, 0, 0] },
        { id: "dome-storage", mesh: "Dome Storage", at: [1, 0, 0] },
      ])
    );
    expect(ensemble.pieces.map((p) => p.id)).toEqual([
      "dome-storage-2",
      "dome-storage",
    ]);
  });

  it("leaves an existing id alone", () => {
    const { ensemble, changes } = migrate(
      doc([{ id: "objective", mesh: "Control Tower", at: [0, 0, 0] }])
    );
    expect(ensemble.pieces[0]!.id).toBe("objective");
    expect(changes).toEqual([]);
  });
});

describe("lifting hp into destroyable", () => {
  it("moves it and removes the stray", () => {
    const { ensemble } = migrate(
      doc([{ id: "a", mesh: "M", at: [0, 0, 0], hp: 26 }])
    );
    expect(ensemble.pieces[0]!.features?.destroyable).toEqual({ hp: 26 });
    expect("hp" in ensemble.pieces[0]!).toBe(false);
  });

  it("keeps other destroyable settings", () => {
    // `featuresOf` layers explicit features over a role's per key, so an
    // overridden hp must not take `armor` with it.
    const { ensemble } = migrate(
      doc([
        {
          id: "a",
          mesh: "M",
          at: [0, 0, 0],
          hp: 26,
          features: { destroyable: { armor: 12 } },
        },
      ])
    );
    expect(ensemble.pieces[0]!.features?.destroyable).toEqual({
      armor: 12,
      hp: 26,
    });
  });

  it("does not overwrite an hp somebody already lifted by hand", () => {
    const { ensemble } = migrate(
      doc([
        {
          id: "a",
          mesh: "M",
          at: [0, 0, 0],
          hp: 26,
          features: { destroyable: { hp: 99 } },
        },
      ])
    );
    expect(ensemble.pieces[0]!.features?.destroyable).toEqual({ hp: 99 });
  });
});

describe("the properties that make it safe to run", () => {
  const legacy = () =>
    doc([
      { mesh: "Dome Mystery", at: [0, 0, 0], role: "target", hp: 26 },
      { mesh: "Dome Storage", at: [16, 0, 4], role: "target", hp: 20 },
    ]);

  it("is idempotent — a second run changes nothing", () => {
    const once = migrate(legacy());
    const twice = migrate(once.ensemble);
    expect(twice.changes).toEqual([]);
    expect(twice.ensemble).toEqual(once.ensemble);
  });

  it("does not mutate the input", () => {
    // A caller may be diffing the migrated document against the original.
    const input = legacy();
    migrate(input);
    expect(input.pieces[0]!.id).toBeUndefined();
    expect((input.pieces[0] as { hp?: number }).hp).toBe(26);
  });

  it("reports every change it made", () => {
    const { changes } = migrate(legacy());
    expect(changes.length).toBe(4); // two ids, two hp lifts
    expect(changes.every((c) => c.path.startsWith("/pieces/"))).toBe(true);
  });

  it("preserves properties it does not understand", () => {
    /*
      A migration that tidies away data it does not recognise is a migration
      that loses data. `subsystems` is Manta's and stays Manta's.
    */
    const { ensemble } = migrate(
      doc([
        { mesh: "Rig", at: [0, 0, 0], subsystems: ["radar"], values: { a: 1 } },
      ])
    );
    const piece = ensemble.pieces[0] as unknown as Record<string, unknown>;
    expect(piece.subsystems).toEqual(["radar"]);
    expect(piece.values).toEqual({ a: 1 });
  });

  it("leaves an unregistered feature alone rather than inventing one", () => {
    // `radar` is Manta's to register. Stubbing it here would prove the
    // opposite of what an open registry is for.
    const { ensemble } = migrate(
      doc([{ id: "rig", mesh: "Rig", at: [0, 0, 0], features: { radar: {} } }])
    );
    expect(ensemble.pieces[0]!.features?.radar).toEqual({});
  });
});
