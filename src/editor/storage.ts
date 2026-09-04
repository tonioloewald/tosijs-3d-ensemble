/*#
# Saving and loading ensembles

An ensemble is a small JSON document, so both halves of "keep this" are cheap:
a named slot in `localStorage` for the thing you are working on, and a file for
the thing you want to keep, send, or commit.

Both are offered because they answer different questions. `localStorage` is
where a draft survives a reload and nothing else — it is per-browser, per-origin
and silently finite. A file is the one that outlives the browser, and it is what
a `.ensemble.json` in a repository looks like.

The DOM lives at the edges: everything here takes the storage or returns a
string, so the interesting parts are testable without a browser and the parts
that need one are three lines each.
*/
/*{"parent":"Editor","order":8}*/
import type { Ensemble } from "../format/types.js";

/**
 * Namespaced, because `localStorage` is one flat map shared with every other
 * script on the origin — including the doc site itself.
 */
export const SAVE_PREFIX = "ensemble:";

/** A minimal `localStorage`, so tests need no browser. */
export interface KeyStore {
  length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Saved ensemble names, in the order a human reads a list: sorted. */
export function savedNames(store: KeyStore): string[] {
  const names: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    if (key?.startsWith(SAVE_PREFIX)) names.push(key.slice(SAVE_PREFIX.length));
  }
  return names.sort();
}

/**
 * Read one back, or `null`.
 *
 * Malformed JSON is `null` rather than a throw: the store is editable by hand
 * and by other tabs, so a bad entry is a thing that happens, not a bug — and
 * losing the palette beats losing the editor.
 */
export function readSaved(store: KeyStore, name: string): Ensemble | null {
  const raw = store.getItem(SAVE_PREFIX + name);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Ensemble;
    return parsed && Array.isArray(parsed.pieces) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSaved(
  store: KeyStore,
  name: string,
  ensemble: Ensemble
): void {
  store.setItem(SAVE_PREFIX + name, serialise(ensemble));
}

export function removeSaved(store: KeyStore, name: string): void {
  store.removeItem(SAVE_PREFIX + name);
}

/**
 * The JSON an author would have written.
 *
 * Two-space indent and a trailing newline because this is a file you commit and
 * diff, not a payload. The `name` is normalised into the document so a saved
 * ensemble knows what it is called even after the file is renamed.
 */
export function serialise(ensemble: Ensemble): string {
  return JSON.stringify(ensemble, null, 2) + "\n";
}

/**
 * `[name].ensemble.json`, with anything a filesystem would object to replaced.
 *
 * A double extension on purpose: `.json` so editors and tooling treat it as
 * JSON, `.ensemble` so a directory of them says what they are.
 */
export function fileNameFor(name: string): string {
  const safe =
    name
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled";
  return `${safe}.ensemble.json`;
}

/** Parse a file's text, or `null` if it is not an ensemble. */
export function parseEnsemble(text: string): Ensemble | null {
  try {
    const parsed = JSON.parse(text) as Ensemble;
    return parsed && Array.isArray(parsed.pieces) ? parsed : null;
  } catch {
    return null;
  }
}
