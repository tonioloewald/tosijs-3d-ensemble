/*#
# Tools and commands

The editor's palette is **whatever is registered**, not a hardcoded list —
deliberately the same shape as [[The feature registry]], so a consumer can add a
tool to the editor exactly the way it adds a feature to the format.

Two kinds of thing live in the palette, because two kinds of thing belong there:

- a **tool** is modal. Picking it changes what a gesture means, and it owns the
  options panel while it is current.
- a **command** runs once and returns you to what you were doing. Duplicate and
  delete are commands; making them modes would be a lie about how they behave.

```typescript
registerTool({
  name: 'manipulate',
  label: 'Move',
  optionsSchema: {
    type: 'object',
    properties: {
      mode: { type: 'string', enum: ['translate', 'rotate', 'scale'], default: 'translate' },
      snap: { type: 'number', default: 1, 'x-unit': 'm' },
    },
  },
  onGesture(gesture, ctx) { ... },
})
```

The options are **JSON Schema**, so the panel that edits them is generated, not
written — the same renderer the piece property panel uses. A tool with a
bespoke panel would drift from the rest of the editor within a week.
*/
import type { EditorRay, Gesture } from '../input/pointer'
import type { Ensemble, Piece, Vec3 } from '../../format/types'
import type { FeatureSchema, SceneElement } from '../../format/registry'

/** What a tool or command is given to work with. */
export interface ToolContext {
  /** The ensemble as authored. Never mutate it directly — see `edit`. */
  readonly ensemble: Ensemble
  /** The selected piece, or null. Single selection for now. */
  readonly selection: Piece | null
  select(id: string | null): void
  /** The `<tosi-b3d>` element. */
  readonly scene: SceneElement
  /**
   * THE mutation path. Every edit goes through here — manipulator release,
   * insert, delete, a panel field — so that undo, dirty-tracking and autosave
   * are one change each rather than an archaeology exercise across the editor.
   */
  edit(describe: string, mutate: (ensemble: Ensemble) => void): void
  /** Current options for the active tool, already defaulted from its schema. */
  readonly options: Record<string, unknown>
  /**
   * What piece a ray hits, walking up to the owning piece — or null for
   * scenery. A tool asks this without knowing the engine or how bodies are
   * indexed, which is what lets the same tool run from a mouse or a hand.
   */
  pick(ray: EditorRay): string | null
  /**
   * Where a ray meets the scene — ground, terrain, anything — as a world point.
   *
   * Distinct from `pick`, which answers "which PIECE", because placing needs a
   * PLACE and the useful answer is usually the ground the author is aiming at
   * rather than the piece they are not.
   */
  pickPoint(ray: EditorRay): Vec3 | null
  /** Mesh names the mounted libraries expose, for a palette to offer. */
  meshNames(): string[]
  /**
   * Every mesh, with the library it came from.
   *
   * Two libraries can export the same name, so a palette that offers bare
   * strings cannot record which one the author picked — and the piece then
   * resolves to whichever library loaded first.
   */
  meshCatalog(): CatalogEntry[]
  /**
   * Take the camera out of the way for the duration of a drag.
   *
   * Without this a drag does BOTH — the piece moves and the view orbits under
   * it, so the thing you are aiming at keeps sliding away from the pointer.
   * Babylon's own gizmos detach camera control for exactly this reason.
   */
  captureCamera(capture: boolean): void
}

/** One offerable mesh: which library, what it is called, and its family. */
export interface CatalogEntry {
  library: string
  mesh: string
  /**
   * The library's own category when it declares one, else the leading word of
   * the name. A packed kit annotates each model, and that beats any inference.
   */
  category: string
  /** Free tags from the library, for filtering. */
  tags?: string[]
  /** Animation clips this model has — known WITHOUT instantiating it. */
  clips?: string[]
}

export interface ToolRegistration {
  name: string
  label: string
  /** Icon name from tosijs-ui's set, when the palette can show one. */
  icon?: string
  /** JSON Schema for the options panel. Omit for a tool with no settings. */
  optionsSchema?: FeatureSchema
  activate?(ctx: ToolContext): void
  deactivate?(ctx: ToolContext): void
  onGesture?: {
    start?(gesture: Gesture, ctx: ToolContext): void
    move?(gesture: Gesture, ctx: ToolContext): void
    end?(gesture: Gesture, ctx: ToolContext): void
  }
}

export interface CommandRegistration {
  name: string
  label: string
  icon?: string
  /** Whether the command can run right now — greys out the palette entry. */
  enabled?(ctx: ToolContext): boolean
  run(ctx: ToolContext): void
}

const tools = new Map<string, ToolRegistration>()
const commands = new Map<string, CommandRegistration>()

export function registerTool(tool: ToolRegistration): void {
  tools.set(tool.name, tool)
}

export function registerCommand(command: CommandRegistration): void {
  commands.set(command.name, command)
}

export function getTool(name: string): ToolRegistration | undefined {
  return tools.get(name)
}

export function registeredTools(): ToolRegistration[] {
  return [...tools.values()]
}

export function registeredCommands(): CommandRegistration[] {
  return [...commands.values()]
}

/** Drop registrations. Mainly for tests, which must not leak into each other. */
export function unregisterTool(name: string): boolean {
  return tools.delete(name)
}

export function unregisterCommand(name: string): boolean {
  return commands.delete(name)
}

/**
 * Default values for a tool's options, read from its schema.
 *
 * The schema is the single source of truth for what an option IS, including its
 * default — a second copy in the tool's code is a second thing to keep in sync,
 * and the one that drifts is always the one nobody is looking at.
 */
export function defaultOptions(schema: FeatureSchema | undefined): Record<string, unknown> {
  const properties = (schema?.properties ?? {}) as Record<string, { default?: unknown }>
  const out: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(properties)) {
    if (spec?.default !== undefined) out[key] = spec.default
  }
  return out
}
