/*#
# Mounting an ensemble's libraries

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
*/
import type { Ensemble, Piece } from '../format/types'
import type { SceneElement } from '../format/registry'

interface LibraryElement extends Element {
  ready?: Promise<void>
  getNames?: () => string[]
  instantiate?: (name: string, options?: Record<string, unknown>) => unknown
}

interface SceneWithLibraries {
  getLibrary?: (type: string) => LibraryElement | null
  querySelector?: (selector: string) => Element | null
  appendChild?: (node: Node) => void
  ownerDocument?: Document
}

/**
 * Ensure every library an ensemble declares is mounted, and wait for them.
 *
 * Idempotent: a library already in the scene is reused rather than mounted
 * twice, so rebuilding — which the editor does on every edit — does not
 * re-download a multi-megabyte glb each time.
 */
export async function mountLibraries(ensemble: Ensemble, scene: SceneElement): Promise<void> {
  const host = scene as unknown as SceneWithLibraries
  const declared = ensemble.libraries ?? []
  if (!declared.length) return

  const pending: Array<Promise<void>> = []
  for (const { name, url } of declared) {
    if (!name || !url) continue
    let element = host.getLibrary?.(name) ?? null
    /*
      IDEMPOTENT BY NAME **AND URL**.

      Reusing purely by name means a library whose URL has changed — a page
      loading a second ensemble, or content moving from a mega-library to a
      per-kit one — silently keeps the OLD file under the new name. Every mesh
      then reports unknown while a library that answers to that name is sitting
      right there, which reads as bad content rather than a stale mount.

      Measured: switching the pirate sample from the mega-library to
      `pirate-kit.glb` left all 19 meshes unknown and the palette showing the
      previous library's 383 entries.
    */
    if (element && element.getAttribute('url') !== url) {
      element.remove()
      element = null
    }
    if (!element) {
      const doc = host.ownerDocument ?? (typeof document === 'undefined' ? null : document)
      if (!doc) continue
      const created = doc.createElement('tosi-b3d-library') as LibraryElement
      created.setAttribute('url', url)
      created.setAttribute('type', name)
      host.appendChild?.(created)
      element = created
    }
    const ready = element.ready
    // A library that fails to load must not reject the whole mount: the rest
    // still resolve, and the pieces that needed this one fall back to boxes.
    if (ready) pending.push(ready.catch(() => undefined))
  }
  await Promise.all(pending)
}

/** Names a scene can resolve meshes from, in declaration order. */
export function libraryNames(ensemble: Ensemble, extra?: string): string[] {
  const names = (ensemble.libraries ?? []).map((l) => l.name).filter(Boolean)
  if (extra && !names.includes(extra)) names.push(extra)
  return names
}

/**
 * Which mounted library should instantiate this piece.
 *
 * Returns the piece's own `library` when it names one — even if that library
 * has not loaded yet, because the author's stated intent outranks what happens
 * to be resolvable this millisecond.
 */
export function resolveLibrary(
  scene: SceneElement,
  libraries: string[],
  piece: Piece
): string | null {
  if (piece.library) return piece.library
  if (!piece.mesh) return null
  const host = scene as unknown as SceneWithLibraries
  for (const name of libraries) {
    const names = host.getLibrary?.(name)?.getNames?.()
    if (names?.includes(piece.mesh)) return name
  }
  return libraries[0] ?? null
}

/** Every mesh name each mounted library exposes — for validation and palettes. */
export function meshesByLibrary(
  scene: SceneElement,
  libraries: string[]
): Map<string, Set<string>> {
  const host = scene as unknown as SceneWithLibraries
  const out = new Map<string, Set<string>>()
  for (const name of libraries) {
    const names = host.getLibrary?.(name)?.getNames?.()
    if (names?.length) out.set(name, new Set(names))
  }
  return out
}
