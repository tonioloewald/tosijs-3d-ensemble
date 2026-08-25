import { describe, expect, it } from 'bun:test'
import { writeTransform } from './transform-write'

const elementBody = () => ({ element: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, size: 1 } })

const nodeBody = () => {
  const scaling = { value: 1, setAll(v: number) { this.value = v } }
  return {
    node: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      rotationQuaternion: { w: 1 } as unknown,
      scaling,
    },
  }
}

describe('writeTransform', () => {
  it('writes an element through its ATTRIBUTES, not its mesh', () => {
    // The element owns its transform and rewrites mesh.position from these on
    // render — a write to the mesh is silently undone.
    const body = elementBody()
    expect(writeTransform(body, { at: [1, 2, 3] })).toBe('element')
    expect([body.element.x, body.element.y, body.element.z]).toEqual([1, 2, 3])
  })

  it('keeps element rotation in DEGREES', () => {
    const body = elementBody()
    writeTransform(body, { rot: [0, 90, 0] })
    expect(body.element.ry).toBe(90)
  })

  it('writes a node directly, converting rotation to radians', () => {
    const body = nodeBody()
    expect(writeTransform(body, { at: [4, 5, 6], rot: [0, 180, 0] })).toBe('node')
    expect([body.node.position.x, body.node.position.y, body.node.position.z]).toEqual([4, 5, 6])
    expect(body.node.rotation.y).toBeCloseTo(Math.PI, 9)
  })

  it('clears a node quaternion before rotating it', () => {
    // A TransformNode ignores .rotation while it has a quaternion, and the glTF
    // loader always sets one. This is the exact bug that made library rotation
    // inert upstream until 0.7.0: it looked wired up because position worked.
    const body = nodeBody()
    expect(body.node.rotationQuaternion).not.toBeNull()
    writeTransform(body, { rot: [0, 45, 0] })
    expect(body.node.rotationQuaternion).toBeNull()
  })

  it('leaves the quaternion alone when only moving', () => {
    // Position does not need the quaternion cleared, and clearing it anyway
    // would throw away a model's baked orientation on a simple drag.
    const body = nodeBody()
    writeTransform(body, { at: [1, 0, 0] })
    expect(body.node.rotationQuaternion).not.toBeNull()
  })

  it('scales both kinds', () => {
    const element = elementBody()
    writeTransform(element, { scale: 3 })
    expect(element.element.size).toBe(3)

    const node = nodeBody()
    writeTransform(node, { scale: 3 })
    expect(node.node.scaling.value).toBe(3)
  })

  it('prefers the element when a piece somehow has both', () => {
    const body = { ...elementBody(), ...nodeBody() }
    expect(writeTransform(body, { at: [1, 1, 1] })).toBe('element')
  })

  it('reports "none" rather than throwing on a body-less piece', () => {
    // An environment primitive (terrain, fog) has no body to move.
    expect(writeTransform({}, { at: [1, 2, 3] })).toBe('none')
  })
})
