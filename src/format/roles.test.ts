import { describe, expect, it } from 'bun:test'
import { featuresOf, registerRole, roleFeatures, roleNames } from './roles'

describe('roles', () => {
  it('ships NO roles — a role is a domain vocabulary, and the format has no domain', () => {
    // The fortification set (`power`, `shield`, `critical`) used to be built in,
    // which quietly made every consumer's scene format a combat format.
    for (const combat of ['structure', 'target', 'power', 'generator', 'shield', 'critical']) {
      expect(roleFeatures(combat)).toBeUndefined()
    }
  })

  it('expands a registered role into its feature preset', () => {
    registerRole('reactor', { destroyable: { hp: 16, explode: true } })
    expect(featuresOf({ id: 'a', at: [0, 0, 0], role: 'reactor' }).destroyable).toEqual({
      hp: 16,
      explode: true,
    })
  })

  it('merges explicit features over the preset PER FEATURE', () => {
    // Overriding one number must not drop the rest of a feature the author
    // never mentioned.
    registerRole('lamp', { light: { intensity: 0.8, range: 20 }, glow: { color: '#fff' } })
    const f = featuresOf({
      id: 'a',
      at: [0, 0, 0],
      role: 'lamp',
      features: { light: { intensity: 2 } },
    })
    expect(f.light).toEqual({ intensity: 2, range: 20 })
    expect(f.glow).toEqual({ color: '#fff' })
  })

  it('hands out copies, so an edit cannot corrupt the preset', () => {
    registerRole('bench', { seat: { slots: 3 } })
    ;(roleFeatures('bench')!.seat as { slots: number }).slots = 999
    expect((roleFeatures('bench')!.seat as { slots: number }).slots).toBe(3)
  })

  it('lists what a consumer registered, for the editor role picker', () => {
    registerRole('planter', {})
    expect(roleNames()).toContain('planter')
  })

  it('leaves an unknown role with no features rather than throwing', () => {
    expect(featuresOf({ id: 'a', at: [0, 0, 0], role: 'nope' })).toEqual({})
  })
})
