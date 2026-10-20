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
