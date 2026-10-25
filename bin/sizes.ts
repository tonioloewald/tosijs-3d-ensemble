#!/usr/bin/env bun
/*
  WHAT AN ADOPTER SHIPS, AND HOW MUCH IT GREW (board #3220, #3358).

    bun bin/sizes.ts           print the sizes and the delta from dist-sizes.json
    bun bin/sizes.ts --write   record them as the baseline (when cutting a tag)

  The build printed only the DOC SITE's sizes, so 0.4.0 grew the game entry
  8.2 → 9.3 kB gz and 0.6.0 grew it another 0.63 kB with nothing reporting
  either. `src/tree-shaking.test.ts` keeps the ceiling (a smoke alarm); this
  makes each release's growth a number you read in the build output.

  The bundles are the ones that test makes, with the engine and frameworks
  external: what is measured is OURS. The baseline names the version it was
  recorded at and the delta line prints it, so a baseline nobody refreshed
  reads as stale instead of quietly turning cumulative
  (practices/releasing.md "Track bundle size on every release").
*/
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import path from "path";

const root = path.resolve(import.meta.dir, "..");
const baselineFile = path.join(root, "dist-sizes.json");

interface Size {
  raw: number;
  gz: number;
}

const ENTRIES: Record<string, string> = {
  "game (scene + loader)": "src/__fixtures__/game-import.ts",
  "format kernel (validate)": "src/format/validate.ts",
  "everything (with the editor)": "src/index.ts",
};

const measure = (bytes: Uint8Array): Size => ({
  raw: bytes.byteLength,
  gz: Bun.gzipSync(bytes).byteLength,
});

async function bundled(entry: string): Promise<Size> {
  const result = await Bun.build({
    entrypoints: [path.join(root, entry)],
    external: ["tosijs", "tosijs-3d", "tosijs-schema", "@babylonjs/*"],
    minify: true,
    target: "browser",
  });
  if (!result.success) throw new Error(`could not bundle ${entry}`);
  return measure(new Uint8Array(await result.outputs[0]!.arrayBuffer()));
}

/** Every `.js` the tarball carries (package.json `files` leaves out the rest). */
function shipped(): Size | null {
  const dist = path.join(root, "dist");
  if (!existsSync(dist)) return null;
  const total = { raw: 0, gz: 0 };
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory()) {
        if (name !== "__fixtures__") walk(file);
      } else if (name.endsWith(".js") && name !== "iife.js") {
        const size = measure(readFileSync(file));
        total.raw += size.raw;
        total.gz += size.gz;
      }
    }
  };
  walk(dist);
  return total;
}

const sizes: Record<string, Size> = {};
for (const [name, entry] of Object.entries(ENTRIES))
  sizes[name] = await bundled(entry);
const dist = shipped();
if (dist) sizes["dist/**/*.js (unminified)"] = dist;

const version = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8")
).version as string;

/** The newest modification time under `dir` among files `keep` accepts. */
function newest(dir: string, keep: (name: string) => boolean): number {
  let out = 0;
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = statSync(file);
    if (stat.isDirectory()) out = Math.max(out, newest(file, keep));
    else if (keep(name)) out = Math.max(out, stat.mtimeMs);
  }
  return out;
}

if (process.argv.includes("--write")) {
  /*
    A STALE dist/ IS NOT A BASELINE (#3495, from the 0.9.0 review): the
    shipped total is read off whatever dist/ is on disk, so a --write after
    editing src/ without a build recorded the last build's size as this
    version's. Refuse it; `bun run build` first.
  */
  const source = newest(path.join(root, "src"), (n) => /\.ts$/.test(n));
  const built = newest(path.join(root, "dist"), (n) => n.endsWith(".js"));
  if (dist && built < source) {
    console.error(
      `dist/ is older than src/ (built ${new Date(
        built
      ).toISOString()}); run \`bun run build\` before recording sizes`
    );
    process.exit(1);
  }
  writeFileSync(
    baselineFile,
    JSON.stringify({ version, sizes }, null, 2) + "\n"
  );
  console.log(`wrote dist-sizes.json at ${version}`);
} else {
  const baseline = existsSync(baselineFile)
    ? (JSON.parse(readFileSync(baselineFile, "utf8")) as {
        version: string;
        sizes: Record<string, Size>;
      })
    : null;
  const kB = (n: number) => (n / 1024).toFixed(2);
  const signed = (n: number) => (n >= 0 ? "+" : "−") + kB(Math.abs(n));
  console.log(
    baseline
      ? `shipped sizes, gzipped, against ${baseline.version}:`
      : "shipped sizes, gzipped — no baseline (bun run sizes):"
  );
  for (const [name, size] of Object.entries(sizes)) {
    const was = baseline?.sizes[name];
    const delta = was
      ? ` (${signed(size.gz - was.gz)} kB, ${(
          ((size.gz - was.gz) / was.gz) *
          100
        ).toFixed(1)}%)`
      : "";
    console.log(`  ${name.padEnd(30)} ${kB(size.gz).padStart(8)} kB${delta}`);
  }
}
