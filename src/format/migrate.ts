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

  return { ensemble, changes };
}
