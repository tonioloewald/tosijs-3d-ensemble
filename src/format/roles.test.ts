import { describe, expect, it } from 'bun:test'
import { featuresOf, registerRole, roleFeatures, roleNames } from './roles'

describe('roles', () => {
  it('expands a role into its feature preset', () => {
    expect(featuresOf({ id: 'a', at: [0, 0, 0], role: 'power' }).destroyable).toEqual({
      hp: 16,
      explode: true,
    })
  })

  it('merges explicit features over the preset PER FEATURE', () => {
    // Overriding one number must not drop the rest of a feature the author
    // never mentioned.
    const f = featuresOf({
      id: 'a',
      at: [0, 0, 0],
      role: 'power',
      features: { destroyable: { hp: 80 } },
    })
    expect(f.destroyable).toEqual({ hp: 80, explode: true })
    expect(f.blip).toEqual({ faction: 'hostile', profile: 1 })
  })

  it('hands out copies, so an edit cannot corrupt the preset', () => {
    const first = roleFeatures('power')!
    ;(first.destroyable as { hp: number }).hp = 999
    expect((roleFeatures('power')!.destroyable as { hp: number }).hp).toBe(16)
  })

  it('lets a consumer register its own role', () => {
    registerRole('reactor', { destroyable: { hp: 40 } })
    expect(roleNames()).toContain('reactor')
    expect(featuresOf({ id: 'a', at: [0, 0, 0], role: 'reactor' }).destroyable).toEqual({ hp: 40 })
  })

  it('leaves an unknown role with no features rather than throwing', () => {
    expect(featuresOf({ id: 'a', at: [0, 0, 0], role: 'nope' })).toEqual({})
  })
})
