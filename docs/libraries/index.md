# Mounting libraries

An ensemble declares the libraries its meshes come from, so loading one anywhere
is enough — the consumer does not have to be told out of band what content to
mount first.

```typescript
await mountLibraries(ensemble, scene)   // idempotent; awaits each `ready`
```

## Resolution order, and why a piece may name its library

A piece's `mesh` is looked up in its own `library` when it names one, otherwise
in each mounted library **in declaration order**, first hit wins. That default
is what keeps the common case quiet: one library, or several with distinct
names, and no piece needs a qualifier.

The qualifier earns its place the moment two libraries both export `cube`.
Without it that piece renders differently depending on which library finished
loading first — a bug that reproduces on one machine and not another.
