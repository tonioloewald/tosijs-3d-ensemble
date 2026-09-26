/*
  A SCENE TEST'S TIME BUDGET, SCALED FOR THE MACHINE IT RUNS ON.

  Every scene test renders through SwiftShader — WebGL on the CPU — and
  SwiftShader spreads rasterisation across every core it has. So the same
  page is several times slower on a 4-vCPU GitHub runner than on a laptop.
  Measured on the same commit, same day:

  | test                         | laptop (18 cores) | CI runner |
  | ---------------------------- | ----------------- | --------- |
  | piece-list filter            | ~17 s             | 81–91 s   |
  | the id-field rename          | ~8 s              | 77 s      |
  | land-and-sky                 | ~40 s             | > 120 s   |

  With a flat 120 s the filter test passed or failed on runner variance
  alone, and land-and-sky never finished. A bisect over four commits
  (2026-09-26) found no code regression behind that — the 20 September code
  passes on today's runner, just as close to the line — so this is a budget
  for the rig, not a claim about the scene. The local number stays tight on
  purpose: a test that suddenly takes three times as long on a laptop is news.
*/
export const CI_FACTOR = process.env.CI ? 3 : 1;

export const budget = (localMs: number): number => localMs * CI_FACTOR;
