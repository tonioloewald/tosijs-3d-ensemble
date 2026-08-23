import { afterEach, describe, expect, it } from 'bun:test'
import {
  defaultOptions,
  getTool,
  registerCommand,
  registeredCommands,
  registeredTools,
  registerTool,
  unregisterCommand,
  unregisterTool,
} from './tool-registry'

afterEach(() => {
  unregisterTool('probe')
  unregisterCommand('probe-cmd')
})

describe('tool registry', () => {
  it('registers a tool and lists it for the palette', () => {
    registerTool({ name: 'probe', label: 'Probe' })
    expect(registeredTools().map((t) => t.name)).toContain('probe')
    expect(getTool('probe')?.label).toBe('Probe')
  })

  it('registers commands separately from tools', () => {
    // A command runs and returns you to what you were doing; a tool is modal.
    // Conflating them would make "delete" a mode you have to leave.
    registerCommand({ name: 'probe-cmd', label: 'Delete', run: () => {} })
    expect(registeredCommands().map((c) => c.name)).toContain('probe-cmd')
    expect(registeredTools().map((t) => t.name)).not.toContain('probe-cmd')
  })

  it('takes option defaults FROM the schema, not a second copy', () => {
    const options = defaultOptions({
      type: 'object',
      properties: {
        mode: { type: 'string', enum: ['translate', 'rotate'], default: 'translate' },
        snap: { type: 'number', default: 1 },
        unset: { type: 'number' },
      },
    })
    expect(options).toEqual({ mode: 'translate', snap: 1 })
  })

  it('handles a tool with no options at all', () => {
    expect(defaultOptions(undefined)).toEqual({})
  })
})
