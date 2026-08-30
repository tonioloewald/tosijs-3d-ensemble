/*#
# The built-in tools

Registered by the editor on connect. A consumer adds its own with
[[Tools and commands]] and they appear in the palette beside these — the same
open-for-extension property the feature registry has.

Selecting is NOT here. It fused with the manipulator — see
[[The select-and-transform tool]] — because selecting and transforming are one
gesture with two outcomes, told apart by whether you grabbed a handle. A
separate select tool meant declaring your intent to a palette before declaring
it again to the thing you were pointing at.
*/
/*{"parent":"Editing","order":3}*/
import { snapVec3 } from '../handles'
import { registerCommand, registerTool } from './tool-registry'

let registered = false

/** Register the editor's own tools and commands. Idempotent. */
export function registerEditorTools(): void {
  if (registered) return
  registered = true

  registerTool({
    name: 'insert',
    label: 'Insert',
    icon: 'plus',
    optionsSchema: {
      type: 'object',
      title: 'Insert',
      properties: {
        // Set by the library palette rather than typed. It is `x-widget: mesh`
        // so that when the property panel renders schemas properly it offers a
        // pick list from the library instead of a text field.
        mesh: { type: 'string', title: 'Mesh', 'x-widget': 'mesh' },
        library: { type: 'string', title: 'Library' },
        gridSnap: { type: 'number', title: 'Grid snap', minimum: 0, maximum: 10, default: 1, 'x-unit': 'm' },
      },
    },
    onGesture: {
      /*
        Place on RELEASE, at the point the ray meets the scene.

        Placing where the author is AIMING rather than at the origin is the
        whole affordance: an ensemble is built by putting things where they go,
        and a palette that drops everything at 0,0,0 makes you move each piece
        immediately afterwards.
      */
      end(gesture, ctx) {
        const mesh = ctx.options.mesh as string | undefined
        if (!mesh) return
        const ray = gesture.primary.ray()
        if (!ray) return
        const point = ctx.pickPoint(ray)
        if (!point) return
        const step = Number(ctx.options.gridSnap ?? 0)
        const at = snapVec3(point, step)
        const id = uniqueId(
          slugify(mesh),
          ctx.ensemble.pieces.map((p) => p.id)
        )
        const library = ctx.options.library as string | undefined
        ctx.edit(`insert ${mesh}`, (ensemble) => {
          // Record WHICH library, when the ensemble declares more than one.
          // With a single library it is noise, so it is omitted.
          const declared = ensemble.libraries ?? []
          const qualify = library && declared.length > 1
          ensemble.pieces.push(qualify ? { id, mesh, library, at } : { id, mesh, at })
        })
        ctx.select(id)
      },
    },
  })

  registerCommand({
    name: 'undo',
    label: 'Undo',
    icon: 'undo',
    enabled: (ctx) => ctx.canUndo(),
    run: (ctx) => ctx.undo(),
  })

  registerCommand({
    name: 'redo',
    label: 'Redo',
    icon: 'redo',
    enabled: (ctx) => ctx.canRedo(),
    run: (ctx) => ctx.redo(),
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
 * An id stem from a mesh name.
 *
 * Library names are display names — `Pump Station`, `tree.001` — and an id is a
 * handle that goes into links, refs and eventually an encounter PATH. Spaces
 * and dots there are a quoting problem waiting to happen.
 */
export function slugify(meshName: string): string {
  return (
    meshName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'piece'
  )
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
  // The plain name when it is free — the FIRST building should be `building`,
  // not `building-2`. Counting up unconditionally reads as though something was
  // already there, and leaves every id in a fresh ensemble looking like a copy.
  if (!used.has(base)) return base
  const match = /^(.*?)(\d+)$/.exec(base)
  const stem = match ? match[1]! : `${base}-`
  let n = match ? Number(match[2]) + 1 : 2
  let candidate = `${stem}${n}`
  while (used.has(candidate)) candidate = `${stem}${++n}`
  return candidate
}
