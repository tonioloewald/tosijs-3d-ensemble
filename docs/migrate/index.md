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
