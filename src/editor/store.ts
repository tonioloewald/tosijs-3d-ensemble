/*#
# Where the editor opens and saves

The component owns no persistence (SPEC): it hands documents to a host. A
**store** is the host's answer to "where do ensembles live". Give the editor
one and its Ensemble panel gains **Open** (the store's documents), **Save**
(back to the document it came from), **Save as**, and **History** when the
store keeps versions. Without one, the editor keeps a local draft and offers
a download, as before.

```ts
interface EnsembleStore {
  list(): Promise<Array<{ id: string; name?: string; updated?: string }>>;
  read(id: string): Promise<Ensemble>;
  write(id: string, ensemble: Ensemble): Promise<{ id: string; revision?: string } | void>;
  history?(id: string): Promise<Array<{ revision: string; at?: string; author?: string; message?: string }>>;
  readRevision?(id: string, revision: string): Promise<Ensemble>;
  idFor?(src: string): string | null;
}
```

`idFor` maps a page url to the store's id, so a document opened by
`<tosi-ensemble-editor src="…">` (or a nested ensemble opened with **Open
inside**) saves back to its entry instead of needing Save as. The editor
fires `loaded` (`{ src, storeId }`) when a load lands, and `error` when one
fails.

An `id` is the store's own address: a path on a dev server, a document id in a
service. Two backends were in view when this was designed (board #3363, from
Manta): a dev server writing the project's files, versioned by git, and a
service (service-compris) holding documents with role-gated writes. Both fit.

## The dev server's data store

tosijs-ui's dev server can let a page save the project's data files
(`editableData` in `site.config.ts`, tosijs-ui 1.16.25+), and its
`tosijs-ui/doc-system/data-client` module talks to it. `dataClientStore`
adapts that module; pass it in, so this package does not depend on tosijs-ui:

```ts
import * as dataClient from "tosijs-ui/doc-system/data-client";
import { dataClientStore } from "tosijs-3d-ensemble";

editor.store = dataClientStore(dataClient, { dir: "static/ensembles" });
```

Its `idFor` takes same-origin urls in that folder and nothing else (a
document from another host is never saved over a local file). tosijs-ui's
site serves `static/` at the root, so `static/ensembles` is at `/ensembles/`;
pass `servedAt` when your folder is served somewhere else:

```ts
dataClientStore(dataClient, { dir: "static/assemblies", servedAt: "/assemblies" });
```

Saving is gated as source editing is: this machine, an edit session over the
tunnel, or a LAN you named. A static host answers the endpoint with a page,
so `list()` rejects there and a host can leave the store off.
*/
/*{"parent":"Editor","order":9}*/
import type { Ensemble } from "../format/types.js";

/** One document a store can open. */
export interface StoreEntry {
  /** The store's address for it: a path, a document id. */
  id: string;
  /** What to call it, when the id is not a good name. */
  name?: string;
  /** When it last changed, as the store reports it. */
  updated?: string;
}

/** One saved version of a document. */
export interface StoreRevision {
  revision: string;
  at?: string;
  author?: string;
  message?: string;
}

/** Where ensembles live, as the host defines it. */
export interface EnsembleStore {
  list(): Promise<StoreEntry[]>;
  read(id: string): Promise<Ensemble>;
  write(
    id: string,
    ensemble: Ensemble
  ): Promise<{ id: string; revision?: string } | void>;
  history?(id: string): Promise<StoreRevision[]>;
  readRevision?(id: string, revision: string): Promise<Ensemble>;
  /**
   * The store's id for a document the editor opened by URL (`src`), or
   * null when that URL is not one of the store's. Lets Save write back to a
   * document a page opened by attribute (#3417).
   */
  idFor?(src: string): string | null;
}

/** What `dataClientStore` needs of tosijs-ui's `data-client` module. */
export interface DataClientLike {
  listData(): Promise<{
    files: Array<{ file: string; size: number; modified: string }>;
  }>;
  readData(
    file: string,
    options: { at?: string; json: true }
  ): Promise<unknown>;
  saveData(
    file: string,
    content: unknown
  ): Promise<{ commit?: string | null; commitError?: string }>;
  dataHistory?(
    file: string
  ): Promise<
    Array<{ commit: string; date: string; author: string; subject: string }>
  >;
}

/**
 * A store over tosijs-ui's dev-server data endpoint, limited to one folder of
 * `.json` files. A save that wrote the file but failed to commit is REPORTED
 * (it rejects), not passed off as a clean save.
 */
export function dataClientStore(
  client: DataClientLike,
  {
    dir = "static/ensembles",
    servedAt,
  }: {
    dir?: string;
    /**
     * Where the page serves `dir`, for `idFor`. tosijs-ui's site serves
     * `static/` at the root, so the default is `dir` without it:
     * `static/ensembles` is at `/ensembles/`.
     */
    servedAt?: string;
  } = {}
): EnsembleStore {
  const prefix = dir.replace(/\/+$/, "") + "/";
  const served =
    "/" +
    (servedAt ?? prefix.replace(/^static\//, ""))
      .replace(/^\/+/, "")
      .replace(/\/*$/, "/");
  const inDir = (file: string) =>
    file.startsWith(prefix) && file.endsWith(".json");
  /*
    FAILS CLOSED, without asking the server: an id that escapes the folder
    (`..`, `.`, empty or doubled segments, a leading `/`) is refused here.
    It used to be prefixed and sent, and only tosijs-ui's own check stopped
    `../levels/x` (0.7.0 review).
  */
  const pathOf = (id: string) => {
    const rest = id.startsWith(prefix) ? id.slice(prefix.length) : id;
    const parts = rest.split("/");
    if (
      !rest ||
      rest.startsWith("/") ||
      parts.some((p) => p === "" || p === "." || p === "..")
    )
      throw new Error(`not a document in ${prefix}: ${JSON.stringify(id)}`);
    return prefix + rest;
  };
  return {
    idFor(src) {
      /*
        SAME ORIGIN ONLY. A document fetched from another host that happens
        to share a path (`https://elsewhere/ensembles/x.json`) is not this
        store's `x.json`, and linking it would let Save write that host's
        document over the local file.
      */
      // A page with an opaque origin (`about:blank`) still takes relative urls.
      const href = (globalThis as { location?: { href?: string } }).location
        ?.href;
      const base =
        href && /^https?:/.test(href) ? href : "https://page.invalid/";
      let url: URL;
      try {
        url = new URL(src, base);
      } catch {
        return null;
      }
      if (url.origin !== new URL(base).origin) return null;
      let path: string;
      try {
        path = decodeURIComponent(url.pathname);
      } catch {
        return null;
      }
      if (!path.startsWith(served) || !path.endsWith(".json")) return null;
      try {
        return pathOf(path.slice(served.length));
      } catch {
        return null; // outside the folder: not this store's document
      }
    },
    async list() {
      const { files } = await client.listData();
      return files
        .filter((f) => inDir(f.file))
        .map((f) => ({
          id: f.file,
          name: f.file.slice(prefix.length).replace(/\.json$/, ""),
          updated: f.modified,
        }));
    },
    async read(id) {
      return (await client.readData(pathOf(id), { json: true })) as Ensemble;
    },
    async write(id, ensemble) {
      // Checked BEFORE the extension: `""` + ".json" would pass as a name.
      const path = pathOf(id);
      const file = path.endsWith(".json") ? path : `${path}.json`;
      const result = await client.saveData(file, ensemble);
      if (result.commitError)
        throw new Error(
          `saved ${file}, but not committed: ${result.commitError}`
        );
      return { id: file, revision: result.commit ?? undefined };
    },
    ...(client.dataHistory
      ? {
          async history(id: string) {
            return (await client.dataHistory!(pathOf(id))).map((h) => ({
              revision: h.commit,
              at: h.date,
              author: h.author,
              message: h.subject,
            }));
          },
          async readRevision(id: string, revision: string) {
            return (await client.readData(pathOf(id), {
              at: revision,
              json: true,
            })) as Ensemble;
          },
        }
      : {}),
  };
}
