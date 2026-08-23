/*#
# The built-in tools

Registered by the editor on connect. A consumer adds its own with
[[Tools and commands]] and they appear in the palette beside these — the same
open-for-extension property the feature registry has.

## Select

The default tool, and the one that defines what a gesture MEANS when no other
tool is active: press on a piece to select it, press on scenery to deselect.

It selects on gesture **end**, not start, so that a press which turns into a
camera orbit does not also change the selection — the two gestures begin
identically and only diverge when you move.
*/
import { registerCommand, registerTool } from './tool-registry'
import type { ToolContext } from './tool-registry'
import type { Gesture } from '../input/pointer'

let registered = false

/** Register the editor's own tools and commands. Idempotent. */
export function registerEditorTools(): void {
  if (registered) return
  registered = true

  registerTool({
    name: 'select',
    label: 'Select',
    icon: 'pointer',
    onGesture: {
      end(gesture: Gesture, ctx: ToolContext) {
        const ray = gesture.primary.ray()
        if (!ray) return
        ctx.select(ctx.pick(ray))
      },
    },
  })

  registerCommand({
    name: 'delete',
    label: 'Delete',
    icon: 'trash',
    enabled: (ctx) => ctx.selection !== null,
    run(ctx) {
      const id = ctx.selection?.id
      if (!id) return
      ctx.edit(`delete ${id}`, (ensemble) => {
        ensemble.pieces = ensemble.pieces.filter((p) => p.id !== id)
        // Links to a piece that no longer exists would validate as errors
        // pointing at content the author already removed.
        ensemble.links = (ensemble.links ?? []).filter((l) => l.from !== id && l.to !== id)
      })
      ctx.select(null)
    },
  })

  registerCommand({
    name: 'duplicate',
    label: 'Duplicate',
    icon: 'copy',
    enabled: (ctx) => ctx.selection !== null,
    run(ctx) {
      const source = ctx.selection
      if (!source) return
      const copy = structuredClone(source)
      copy.id = uniqueId(
        source.id,
        ctx.ensemble.pieces.map((p) => p.id)
      )
      // Offset so the copy is visible rather than exactly inside the original,
      // which reads as "nothing happened".
      copy.at = [source.at[0] + 2, source.at[1], source.at[2] + 2]
      ctx.edit(`duplicate ${source.id}`, (ensemble) => {
        ensemble.pieces.push(copy)
      })
      ctx.select(copy.id)
    },
  })
}

/**
 * A fresh id derived from an existing one.
 *
 * Ids are MANDATORY and never derived from array position, so a duplicate needs
 * a real new one. Trailing digits are treated as a counter (`gun-2` → `gun-3`)
 * rather than appended to, because `gun-2-copy-copy` is what happens otherwise.
 */
export function uniqueId(base: string, taken: string[]): string {
  const used = new Set(taken)
  const match = /^(.*?)(\d+)$/.exec(base)
  const stem = match ? match[1]! : `${base}-`
  let n = match ? Number(match[2]) + 1 : 2
  let candidate = `${stem}${n}`
  while (used.has(candidate)) candidate = `${stem}${++n}`
  return candidate
}
