#!/usr/bin/env bun
/*
  Bring legacy prefabs up to the current format, in place.

    bun bin/migrate.ts path/to/*.json          # report only
    bun bin/migrate.ts --write path/to/*.json  # actually rewrite

  DRY BY DEFAULT, because the alternative is a tool that rewrites somebody's
  files on a mistyped glob. `migrate` is idempotent and non-mutating, so the
  dry run is the real answer — running with `--write` afterwards cannot differ.

  Formatting is preserved only in the sense that JSON is reprinted at two-space
  indent. A file with meaningful hand formatting will show a whole-file diff, so
  read the change list rather than the diff stat.
*/
import { readFileSync, writeFileSync } from "node:fs";
import { migrate } from "../src/format/migrate";

const args = process.argv.slice(2);
const write = args.includes("--write");
const files = args.filter((a) => !a.startsWith("--"));

if (!files.length) {
  console.error("usage: bun bin/migrate.ts [--write] <file.json> ...");
  process.exit(1);
}

let total = 0;
for (const file of files) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    // Skipped, not fatal: one unreadable file in a glob must not strand the
    // rest half-migrated.
    console.error(`${file}: could not read or parse — ${String(err)}`);
    continue;
  }
  const { ensemble, changes } = migrate(parsed);
  total += changes.length;
  if (!changes.length) {
    console.log(`${file}: already current`);
    continue;
  }
  console.log(`${file}: ${changes.length} change(s)`);
  for (const change of changes) console.log(`  ${change.path}  ${change.note}`);
  if (write) writeFileSync(file, `${JSON.stringify(ensemble, null, 2)}\n`);
}

if (total && !write) {
  console.log(`\n${total} change(s) — re-run with --write to apply.`);
}
