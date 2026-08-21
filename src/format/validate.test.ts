import { describe, expect, it } from 'bun:test'
import { validate } from './validate'
import { registerFeature, unregisterFeature } from './registry'
import type { Ensemble } from './types'

const minimal = (over: Partial<Ensemble> = {}): Ensemble => ({
  name: 'test',
  pieces: [{ id: 'a', mesh: 'Pump Station', at: [0, 0, 0] }],
  ...over,
})

const codes = (e: Ensemble, opts = {}) => validate(e, opts).map((p) => p.code)

describe('validate', () => {
  it('accepts a minimal ensemble', () => {
    expect(validate(minimal(), { checkRegistry: false })).toEqual([])
  })

  it('reports a missing name and missing pieces', () => {
    expect(codes({ name: '', pieces: [] })).toEqual(['no-name', 'no-pieces'])
  })

  it('requires an id rather than deriving one from the index', () => {
    const e = minimal({ pieces: [{ mesh: 'X', at: [0, 0, 0] } as never] })
    expect(codes(e, { checkRegistry: false })).toContain('no-piece-id')
  })

  it('catches duplicate ids', () => {
    const e = minimal({
      pieces: [
        { id: 'a', mesh: 'X', at: [0, 0, 0] },
        { id: 'a', mesh: 'Y', at: [1, 0, 0] },
      ],
    })
    expect(codes(e, { checkRegistry: false })).toContain('duplicate-piece-id')
  })

  it('checks mesh names only when a library is loaded', () => {
    const e = minimal()
    expect(codes(e, { checkRegistry: false })).toEqual([])
    expect(codes(e, { checkRegistry: false, meshes: new Set(['Other']) })).toEqual(['unknown-mesh'])
    expect(codes(e, { checkRegistry: false, meshes: new Set(['Pump Station']) })).toEqual([])
  })

  it('reports links to pieces that do not exist', () => {
    const e = minimal({ links: [{ from: 'a', to: 'ghost' }] })
    expect(codes(e, { checkRegistry: false })).toEqual(['unknown-link-target'])
  })

  it('reports a field nothing can bring down', () => {
    const e = minimal({
      pieces: [
        { id: 'reactor', mesh: 'X', at: [0, 0, 0] },
        { id: 'field', mesh: 'Y', at: [0, 4, 0], features: { protector: { protection: 12 } } },
      ],
    })
    expect(codes(e, { checkRegistry: false })).toEqual(['unreachable-shield'])

    const linked = { ...e, links: [{ from: 'reactor', to: 'field' }] }
    expect(codes(linked, { checkRegistry: false })).toEqual([])
  })

  it('puts a JSON Pointer on the problem so the editor can place it', () => {
    const e = minimal({ pieces: [{ id: 'a', mesh: 'X', at: [0, 0, 0] }, { id: 'b', at: [0, 0, 0] }] })
    const problem = validate(e, { checkRegistry: false }).find((p) => p.code === 'empty-piece')
    expect(problem?.path).toBe('/pieces/1')
  })

  it('allows a mesh-less piece when a feature is its body', () => {
    registerFeature({ name: 'terrain', schema: { type: 'object' } })
    const e = minimal({
      pieces: [{ id: 'landform', at: [0, 0, 0], features: { terrain: { seed: 1 } } }],
    })
    expect(validate(e)).toEqual([])
    unregisterFeature('terrain')
  })

  it('rejects an invalid subsystem regex rather than throwing at load', () => {
    const e = minimal({
      pieces: [{ id: 'a', mesh: 'X', at: [0, 0, 0], subsystems: [{ match: '([', hp: 1, label: 'p' }] }],
    })
    expect(codes(e, { checkRegistry: false })).toEqual(['bad-subsystem-match'])
  })

  it('reports a nested ensemble instead of silently ignoring it', () => {
    const e = minimal({ pieces: [{ id: 'a', ensemble: 'ocean-rig', at: [0, 0, 0] }] })
    expect(codes(e, { checkRegistry: false })).toContain('nested-not-supported')
  })

  it('warns rather than errors on unregistered features, so a host can register late', () => {
    const e = minimal({ pieces: [{ id: 'a', mesh: 'X', at: [0, 0, 0], features: { wat: {} } }] })
    const problems = validate(e)
    expect(problems.map((p) => p.code)).toEqual(['unknown-feature'])
    expect(problems[0]!.severity).toBe('warning')
  })
})
