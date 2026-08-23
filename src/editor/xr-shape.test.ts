import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

/*
  THE FLAT-ONLY TRAP IS CLOSED HERE, NOT BY INTENTION.

  VR is not the initial focus, but starting flat-only is the trap: a flat-only
  contract bakes mouse assumptions into every tool, and each one has to be found
  and removed later. That is how "we'll add VR after" becomes "we rewrote the
  editor".

  So the tool layer may not name a mouse, a click, a screen coordinate or a DOM
  event. Adapters may — that is their entire job — and they are listed below by
  name, so adding a new one is a decision someone makes on purpose rather than a
  regex quietly widening.

  Same discipline as `tree-shaking.test.ts`. That boundary has held for exactly
  one reason: something fails when it is crossed.
*/

/** Files whose job IS to know about a specific input device. */
const ADAPTERS = new Set([
  'input/flat-pointer.ts',
  'input/xr-pointer.ts',
  // The component itself owns the DOM: it mounts the scene and the panels.
  'ensemble-editor.ts',
])

/** Identifiers that mean "this code assumes a flat screen". */
const FLAT_ONLY = [
  /\bMouseEvent\b/,
  /\bPointerEvent\b/,
  /\bclientX\b/,
  /\bclientY\b/,
  /\boffsetX\b/,
  /\baddEventListener\b/,
  /\bonclick\b/i,
  /\bscreenX\b/,
]

const walk = (dir: string, base = ''): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    const rel = base ? `${base}/${entry}` : entry
    if (statSync(full).isDirectory()) return walk(full, rel)
    return rel.endsWith('.ts') && !rel.endsWith('.test.ts') ? [rel] : []
  })

describe('the tool layer is XR-shaped', () => {
  const files = walk('src/editor').filter((f) => !ADAPTERS.has(f))

  it('finds the editor sources (so this cannot pass by scanning nothing)', () => {
    expect(files.length).toBeGreaterThan(2)
  })

  for (const file of files) {
    it(`${file} names no mouse, click or screen coordinate`, () => {
      const source = readFileSync(join('src/editor', file), 'utf8')
      const offenders = FLAT_ONLY.filter((pattern) => pattern.test(source)).map(String)
      expect(offenders).toEqual([])
    })
  }

  it('every declared adapter still exists', () => {
    // An adapter that was renamed or deleted would leave a permanent hole in the
    // check, exempting a file that no longer needs exempting.
    const all = walk('src/editor')
    for (const adapter of ADAPTERS) expect(all).toContain(adapter)
  })
})
