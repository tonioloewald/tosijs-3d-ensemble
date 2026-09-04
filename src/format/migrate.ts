/*#
# Migrating a legacy prefab

`manta-recon`'s prefabs predate this format and are **already ensembles in every
way that matters** — measured, not assumed: all four build every piece, and
their `subsystems`, `zones`, `points` and piece-level `values` survive a
load/save round trip untouched. Two of the four validate and load as they stand.

Two things stop the other two, and this fixes both:

| in the file | what it becomes |
| --- | --- |
| a piece with no `id` | `id` from its mesh name, deduplicated |
| `hp` sitting on the piece | `features.destroyable.hp` |

## Why `id` is generated from the MESH and not the index

Because index-derived ids are the thing this format exists to refuse: *"derived
ids mean every insertion renumbers the world"*. A migration that wrote
`piece-0`…`piece-6` would satisfy the validator and reintroduce the fault one
layer down, permanently, in a file somebody then hand-edits.

`"Dome Mystery"` becomes `dome-mystery`; a second one becomes `dome-mystery-2`.
Ugly in a tie, stable under insertion, and legible in a diff — which is what an
id is for.

## Idempotent, and that is the point

Run it twice and the second run reports no changes. A migration you cannot re-run
is one you are afraid of, so you run it once, by hand, and never again — and the
next legacy file gets fixed by hand too. Pieces that already have ids keep them;
an `hp` already lifted is not lifted twice.

## What it deliberately does NOT do

- **It does not invent features.** `ocean-rig` uses a `radar` feature nobody has
  registered, and that stays a validator WARNING rather than something this
  quietly deletes or stubs. Features are a registry open to consumers: `radar`
  is Manta's to register, and doing it for them would prove the opposite of what
  the registry is for.
- **It does not touch anything it does not recognise.** `subsystems` and
  piece-level `values` are Manta's, they round-trip already, and a migration that
  tidies away data it does not understand is a migration that loses data.
*/
/*{"parent":"Format","order":9}*/
import type { Ensemble, Piece } from "./types.js";

/** One thing the migration changed, in the author's terms. */
export interface Change {
  /** JSON Pointer to what changed. */
  path: string;
  note: string;
}

export interface Migration {
  ensemble: Ensemble;
  /** Empty when the input was already current — which is how you re-run it. */
  changes: Change[];
}

/**
 * A stable, legible id from a mesh name.
 *
 * Not a hash: an id appears in `links`, in `protector.source`, and in a diff a
 * person reads. `dome-mystery` tells you which piece; `p_8f3a` does not.
 */
export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "piece"
  );
}

/**
 * Bring a legacy prefab up to the current format.
 *
 * Returns a NEW document plus what changed; the input is not mutated, because a
 * caller may be migrating a file it also intends to diff against.
 */
export function migrate(input: Ensemble): Migration {
  const changes: Change[] = [];
  const ensemble: Ensemble = structuredClone(input);
  const pieces = ensemble.pieces ?? [];

  /*
    Every id ALREADY in the document is claimed before any is generated —
    including ids that appear later in the array. Generating in one pass while
    reading in the same pass would let a generated `dome-storage` collide with a
    hand-written `dome-storage` two pieces further down, and the collision would
    silently merge two things in every map keyed by id.
  */
  const taken = new Set(pieces.map((piece) => piece.id).filter(Boolean));

  pieces.forEach((piece, index) => {
    if (!piece.id) {
      const base = slugify(piece.mesh ?? "piece");
      let id = base;
      for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
      taken.add(id);
      piece.id = id;
      changes.push({
        path: `/pieces/${index}/id`,
        note: `gave it the id "${id}", from its mesh`,
      });
    }

    /*
      `hp` was a piece property; it is a `destroyable` setting. Merged rather
      than assigned, so a role's `armor` survives having its `hp` overridden —
      `featuresOf` already layers explicit features over a role's per KEY.
    */
    const loose = piece as Piece & { hp?: unknown };
    if (loose.hp !== undefined) {
      const features = (piece.features ??= {});
      const destroyable = (features.destroyable ?? {}) as Record<
        string,
        unknown
      >;
      // Already lifted by hand? Leave the explicit value alone and just drop
      // the stray — re-running must not undo somebody's edit.
      if (destroyable.hp === undefined) destroyable.hp = loose.hp;
      features.destroyable = destroyable;
      delete loose.hp;
      changes.push({
        path: `/pieces/${index}/hp`,
        note: `moved hp into features.destroyable of "${piece.id}"`,
      });
    }
  });

  /*
    VALUES THAT WERE NEVER VALUES.

    Four scene-feature fields were hand-copied wrong, so a file could carry a
    setting the element had no way to honour — and it did not complain, it fell
    back. `preset: "birds"` rendered MOTES; `mode: "none"` rendered LINEAR fog.
    The file said one thing and the scene did another, for as long as anyone
    left it alone.

    Adopting `sceneSchemas` (tosijs-3d#63) makes those unreachable going
    forward: the panel is a picker over the real set. It does nothing for a
    file already written, which is what this is for — the point of a migration
    is to make a document SAY what it already DOES.
  */
  const AMBIENT_PRESETS = [
    "motes",
    "bubbles",
    "rain",
    "snow",
    "dust",
    "leaves",
  ];
  const AMBIENT_WHERE = ["always", "underwater", "above"];
  const FOG_MODES = ["linear", "exp", "exp2"];

  pieces.forEach((piece, index) => {
    const features = piece.features as
      | Record<string, Record<string, unknown>>
      | undefined;
    if (!features) return;
    const at = (feature: string, key: string) =>
      `/pieces/${index}/features/${feature}/${key}`;

    const ambient = features.ambient;
    if (ambient && typeof ambient.preset === "string") {
      if (!AMBIENT_PRESETS.includes(ambient.preset)) {
        const was = ambient.preset;
        // `PRESETS[this.preset] ?? PRESETS.motes` — this is what it rendered.
        ambient.preset = "motes";
        changes.push({
          path: at("ambient", "preset"),
          note: `"${was}" is not a preset; the scene has been rendering "motes" — said so`,
        });
      }
    }
    if (ambient && typeof ambient.where === "string") {
      if (!AMBIENT_WHERE.includes(ambient.where)) {
        const was = ambient.where;
        ambient.where = "always";
        changes.push({
          path: at("ambient", "where"),
          note: `"${was}" is not a placement; the scene has been rendering "always" — said so`,
        });
      }
    }

    const fog = features.fog;
    if (fog && typeof fog.mode === "string" && !FOG_MODES.includes(fog.mode)) {
      const was = fog.mode;
      /*
        ⚠️ "none" almost certainly meant NO FOG, and it never delivered that:
        `FOG_MODES[attrs.mode] ?? FOGMODE_LINEAR`. So this preserves the
        RENDER, which is a migration's job, and the note has to carry the
        intent — because the fix for "I wanted no fog" is to delete the piece,
        and only the author can decide that.
      */
      fog.mode = "linear";
      changes.push({
        path: at("fog", "mode"),
        note:
          was === "none"
            ? 'fog mode "none" was never a mode — the scene has been rendering LINEAR fog, and now says so. If you meant NO fog, delete the fog piece'
            : `"${was}" is not a fog mode; the scene has been rendering LINEAR — said so`,
      });
    }

    const water = features.water;
    if (water && typeof water.underwaterFog === "boolean") {
      /*
        The attribute is a NUMBER, 0..1, and a boolean written to it was
        DISCARDED — so both `true` and `false` rendered the element's 0.12.

        `true` therefore keeps its render and gains a value. `false` does not:
        it renders differently after this, on purpose, because "off" is what it
        plainly meant and honouring it is the whole reason to migrate rather
        than to leave the file lying.
      */
      const was = water.underwaterFog;
      water.underwaterFog = was ? 0.12 : 0;
      changes.push({
        path: at("water", "underwaterFog"),
        note: was
          ? "underwaterFog is a 0..1 amount, not a switch; `true` was discarded and the scene rendered 0.12 — said so"
          : "underwaterFog is a 0..1 amount, not a switch; `false` was discarded and the scene rendered 0.12 — now genuinely off",
      });
    }
  });

  return { ensemble, changes };
}
