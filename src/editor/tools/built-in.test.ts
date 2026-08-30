import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { registerEditorTools, slugify, uniqueId } from './built-in'
import { getTool, registeredCommands } from './tool-registry'
import type { ToolContext } from './tool-registry'
import type { Ensemble, Vec3 } from '../../format/types'
import type { Gesture, EditorRay } from '../input/pointer'

const ray: EditorRay = { origin: [0, 10, 0], direction: [0, -1, 0] }
const gesture = (): Gesture => ({
  primary: {
    id: 'primary',
    kind: 'flat',
    ray: () => ray,
    grip: () => null,
    active: false,
    secondary: false,
  },
  helper: null,
  startRay: ray,
  startGrip: null,
})

let ensemble: Ensemble
let selectedId: string | null
let groundPoint: Vec3 | null

const ctx = (options: Record<string, unknown> = {}): ToolContext =>
  ({
    ensemble,
    selection: ensemble.pieces.find((p) => p.id === selectedId) ?? null,
    select: (id: string | null) => (selectedId = id),
    scene: {} as never,
    edit: (_d: string, mutate: (e: Ensemble) => void) => mutate(ensemble),
    options,
    pick: () => null,
    captureCamera: () => {},
    undo: () => {},
    redo: () => {},
    canUndo: () => false,
    canRedo: () => false,
    meshCatalog: () => [],
    pickPoint: () => groundPoint,
    meshNames: () => ['building', 'tree'],
  }) as ToolContext

beforeEach(() => {
  registerEditorTools()
  ensemble = { name: 'test', pieces: [] }
  selectedId = null
  groundPoint = [4.4, 0, -2.6]
})

describe('insert tool', () => {
  const insert = () => getTool('insert')!

  it('places the chosen mesh where the ray meets the scene, snapped', () => {
    insert().onGesture!.end!(gesture(), ctx({ mesh: 'building', gridSnap: 1 }))
    expect(ensemble.pieces).toHaveLength(1)
    expect(ensemble.pieces[0]!.mesh).toBe('building')
    expect(ensemble.pieces[0]!.id).toBe('building')
    expect(ensemble.pieces[0]!.at).toEqual([4, 0, -3])
  })

  it('selects what it just placed', () => {
    insert().onGesture!.end!(gesture(), ctx({ mesh: 'tree', gridSnap: 0 }))
    expect(selectedId).toBe(ensemble.pieces[0]!.id)
  })

  it('gives every insert a distinct id', () => {
    const c = ctx({ mesh: 'building', gridSnap: 1 })
    insert().onGesture!.end!(gesture(), c)
    insert().onGesture!.end!(gesture(), ctx({ mesh: 'building', gridSnap: 1 }))
    const ids = ensemble.pieces.map((p) => p.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('places nothing when no mesh has been chosen', () => {
    insert().onGesture!.end!(gesture(), ctx({ gridSnap: 1 }))
    expect(ensemble.pieces).toHaveLength(0)
  })

  it('places nothing when the ray misses the scene entirely', () => {
    // Aiming at the sky. Dropping the piece at the origin instead would put it
    // somewhere the author was demonstrably not looking.
    groundPoint = null
    insert().onGesture!.end!(gesture(), ctx({ mesh: 'building' }))
    expect(ensemble.pieces).toHaveLength(0)
  })
})

describe('delete and duplicate', () => {
  beforeEach(() => {
    ensemble = {
      name: 'test',
      pieces: [
        { id: 'a', mesh: 'building', at: [0, 0, 0] },
        { id: 'b', mesh: 'tree', at: [5, 0, 0] },
      ],
      links: [{ from: 'a', to: 'b' }],
    }
    selectedId = 'a'
  })

  const command = (name: string) => registeredCommands().find((c) => c.name === name)!

  it('deletes the selection AND the links that referenced it', () => {
    // A link to a piece that no longer exists validates as an error pointing at
    // content the author already removed.
    command('delete').run(ctx())
    expect(ensemble.pieces.map((p) => p.id)).toEqual(['b'])
    expect(ensemble.links).toEqual([])
    expect(selectedId).toBeNull()
  })

  it('duplicates offset, with a new id, and selects the copy', () => {
    command('duplicate').run(ctx())
    expect(ensemble.pieces).toHaveLength(3)
    const copy = ensemble.pieces[2]!
    expect(copy.id).not.toBe('a')
    expect(copy.at).not.toEqual([0, 0, 0]) // visible, not hidden inside the original
    expect(selectedId).toBe(copy.id)
  })

  it('is disabled with nothing selected', () => {
    selectedId = null
    expect(command('delete').enabled!(ctx())).toBe(false)
    expect(command('duplicate').enabled!(ctx())).toBe(false)
  })
})

describe('id generation', () => {
  it('slugifies display names into handles', () => {
    // Ids go into links, refs and eventually encounter PATHS; spaces and dots
    // there are a quoting problem waiting to happen.
    expect(slugify('Pump Station')).toBe('pump-station')
    expect(slugify('tree.001')).toBe('tree-001')
    expect(slugify('!!!')).toBe('piece')
  })

  it('uses the plain name when it is free', () => {
    expect(uniqueId('building', [])).toBe('building')
  })

  it('counts up rather than appending forever', () => {
    expect(uniqueId('gun-2', ['gun-2'])).toBe('gun-3')
    expect(uniqueId('gun', ['gun'])).toBe('gun-2')
    expect(uniqueId('gun', ['gun', 'gun-2'])).toBe('gun-3')
  })
})
