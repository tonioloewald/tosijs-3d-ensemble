/*#
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
*/
/*{"parent":"Internals","order":10}*/
import type { Ensemble, Piece } from "../format/types.js";
import type { SceneElement } from "../format/registry.js";

interface LibraryElement extends Element {
  ready?: Promise<void>;
  getNames?: () => string[];
  instantiate?: (name: string, options?: Record<string, unknown>) => unknown;
}

interface SceneWithLibraries {
  getLibrary?: (type: string) => LibraryElement | null;
  querySelector?: (selector: string) => Element | null;
  appendChild?: (node: Node) => void;
  ownerDocument?: Document;
}

/**
 * Ensure every library an ensemble declares is mounted, and wait for them.
 *
 * Idempotent: a library already in the scene is reused rather than mounted
 * twice, so rebuilding — which the editor does on every edit — does not
 * re-download a multi-megabyte glb each time.
 */
export async function mountLibraries(
  ensemble: Ensemble,
  scene: SceneElement
): Promise<void> {
  const host = scene as unknown as SceneWithLibraries;
  const declared = ensemble.libraries ?? [];
  if (!declared.length) return;

  const mounted: LibraryElement[] = [];
  for (const { name, url } of declared) {
    if (!name || !url) continue;
    let element = host.getLibrary?.(name) ?? null;
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
    if (element && element.getAttribute("url") !== url) {
      element.remove();
      element = null;
    }
    if (!element) {
      const doc =
        host.ownerDocument ??
        (typeof document === "undefined" ? null : document);
      if (!doc) continue;
      const created = doc.createElement("tosi-b3d-library") as LibraryElement;
      created.setAttribute("url", url);
      created.setAttribute("type", name);
      host.appendChild?.(created);
      element = created;
    }
    mounted.push(element);
  }

  /*
    READ `ready` ONLY AFTER THE ELEMENT IS UPGRADED.

    `ready` is a property the custom element defines, so it does not exist on a
    node whose class has not been registered yet — and appending does not
    upgrade an element the registry has never heard of. On a page that imports
    tosijs-3d eagerly the definition is already there and reading `ready` inline
    works; on one that reaches it through a dynamic import it is `undefined`,
    nothing is awaited, and the caller builds against a library that has not
    even started downloading. Every piece becomes a placeholder box, silently.

    Measured on the doc-site editor page: 19 boxes, no error, and a manual
    rebuild from the console fixed it — the tell that this is a race, not a
    resolution failure.
  */
  await whenLibrariesUpgrade();

  // A library that fails to load must not reject the whole mount: the rest
  // still resolve, and the pieces that needed this one fall back to boxes.
  await Promise.all(mounted.map((el) => el.ready?.catch(() => undefined)));
}

/** Resolves once `<tosi-b3d-library>` is a defined custom element. */
async function whenLibrariesUpgrade(): Promise<void> {
  const registry = globalThis.customElements;
  if (!registry?.whenDefined) return;
  await registry.whenDefined("tosi-b3d-library").catch(() => undefined);
}

/** Names a scene can resolve meshes from, in declaration order. */
export function libraryNames(ensemble: Ensemble, extra?: string): string[] {
  const names = (ensemble.libraries ?? []).map((l) => l.name).filter(Boolean);
  if (extra && !names.includes(extra)) names.push(extra);
  return names;
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
  if (piece.library) return piece.library;
  if (!piece.mesh) return null;
  const host = scene as unknown as SceneWithLibraries;
  for (const name of libraries) {
    const names = host.getLibrary?.(name)?.getNames?.();
    if (names?.includes(piece.mesh)) return name;
  }
  return libraries[0] ?? null;
}

/** What a library says about one of its models. */
export interface CatalogueItem {
  name: string;
  category?: string;
  tags?: string[];
  clips?: string[];
}

interface SourceNode {
  name?: string;
  metadata?: {
    gltf?: {
      extras?: { category?: string; tags?: string[]; clips?: string[] };
    };
  };
}

interface LibraryWithContainer {
  container?: { transformNodes?: SourceNode[]; meshes?: SourceNode[] };
}

/**
 * A library's own description of its models — category, tags, clips.
 *
 * The packing pipeline writes these as glTF `extras` on each exported node, and
 * Babylon parses them onto the SOURCE nodes as `metadata.gltf.extras`. What
 * `library.instantiate()` hands back is a CLONE, and the clone does not carry
 * them — which is why this reads the container rather than an instance.
 *
 * ⚠️ **Stopgap.** `container` is not part of tosijs-3d's public surface; we are
 * reaching past the API because the metadata has no other route out
 * (tosijs-3d#45). It costs nothing at runtime — no second fetch, the data is
 * already parsed — but it will break if that field is renamed, and it should be
 * deleted the day `getInfo()` or its equivalent exists.
 *
 * Returns an empty array for a library that declares nothing, which is the
 * honest answer for the older un-annotated packs.
 */
export function libraryCatalogue(
  scene: SceneElement,
  library: string
): CatalogueItem[] {
  const host = scene as unknown as SceneWithLibraries;
  const element = host.getLibrary?.(
    library
  ) as unknown as LibraryWithContainer | null;
  const container = element?.container;
  if (!container) return [];
  const seen = new Set<string>();
  const items: CatalogueItem[] = [];
  for (const node of [
    ...(container.transformNodes ?? []),
    ...(container.meshes ?? []),
  ]) {
    const extras = node.metadata?.gltf?.extras;
    const name = node.name;
    // Only nodes the pipeline ANNOTATED are exports. That is what separates a
    // model from a sub-part: `getNames()` lists a chest's `lid` and a ship's
    // `sail-a` alongside the chest and the ship, and a palette should not.
    if (!name || !extras?.category || seen.has(name)) continue;
    seen.add(name);
    items.push({
      name,
      category: extras.category,
      ...(extras.tags ? { tags: extras.tags } : {}),
      ...(extras.clips ? { clips: extras.clips } : {}),
    });
  }
  return items;
}

/** Every mesh name each mounted library exposes — for validation and palettes. */
export function meshesByLibrary(
  scene: SceneElement,
  libraries: string[]
): Map<string, Set<string>> {
  const host = scene as unknown as SceneWithLibraries;
  const out = new Map<string, Set<string>>();
  for (const name of libraries) {
    const names = host.getLibrary?.(name)?.getNames?.();
    if (names?.length) out.set(name, new Set(names));
  }
  return out;
}
