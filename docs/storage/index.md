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
