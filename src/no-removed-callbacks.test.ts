import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/*
  NO CALLBACK NAME THAT tosijs-3d 0.10 REMOVES.

  0.10 drops the `onX` callback options (`onChange`, `onClick`, `onSelect`,
  `onActivate`, `onClose`, `onKey`, `onAction`, `onCaretMove`, `onEnter`,
  `onFocus`) in favour of `handleX`, the trigger's `onEnter`/`onExit`
  properties in favour of `whenEnter`/`whenExit`, and the manipulator's
  `handleChange`/`handleCommit` in favour of `whenChange`/`whenCommit`. An old
  name is IGNORED there, with a warning printed once: a control that silently
  stops responding. This fails at test time instead.

  Measured clean on 2026-10-09, against 0.9.0 and against tosijs-3d's main
  (0.10 unreleased): no old name in the source, and no deprecation warning
  across every shipped sample and panel. Our OWN widgets' options are not
  tosijs-3d's and are not checked here; the editor's `handleChange` on
  schemaWidgets, for one, is ours.
*/
const REMOVED = [
  "onChange",
  "onClick",
  "onSelect",
  "onActivate",
  "onClose",
  "onKey",
  "onAction",
  "onCaretMove",
  "onEnter",
  "onExit",
  "onFocus",
];

const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.ts$/.test(name) && !/\.test\.ts$/.test(name) ? [path] : [];
  });

describe("tosijs-3d 0.10's removed callback names", () => {
  const files = sources(new URL(".", import.meta.url).pathname);

  it("scans the source", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("no file passes an onX option or assigns an onX callback", () => {
    // An OPTION key (`onChange:`) or a PROPERTY assignment (`.onEnter =`);
    // a local `const onKey = …` is ours and fine.
    const names = REMOVED.join("|");
    const pattern = new RegExp(
      `(?:^|[{,(\\s])(${names})\\s*:|\\.(${names})\\s*=(?!=)`
    );
    const hits: string[] = [];
    for (const file of files) {
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          // Comments may name the old spellings; code may not.
          const code = line.replace(/\/\/.*$/, "");
          if (/^\s*\*/.test(code)) return;
          if (pattern.test(code)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
        });
    }
    expect(hits).toEqual([]);
  });

  it("the manipulator is driven with whenChange / whenCommit", () => {
    const hits = files.filter((f) =>
      /b3dManipulator\([^)]*\bhandle(Change|Commit)\b/s.test(
        readFileSync(f, "utf8")
      )
    );
    expect(hits).toEqual([]);
  });
});
