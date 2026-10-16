import { describe, expect, it } from "bun:test";
import { writeTransform } from "./transform-write.js";

const elementBody = () => {
  const element = {
    x: 0,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    size: 1,
    scale: 1,
    /*
      The library instance's root node. Since tosijs-3d 0.8.1 the element turns
      it from `rx`/`ry`/`rz` and scales it from its UNIFORM `scale` — on every
      render, which is what this stub's `render` reproduces, because it is what
      wiped a non-uniform scale written to the node.
    */
    mesh: {
      rotation: { x: 0, y: 0, z: 0 },
      rotationQuaternion: { w: 1 } as unknown,
      scaling: { x: 1, y: 1, z: 1 },
    },
    render() {
      element.mesh.scaling.x = element.scale;
      element.mesh.scaling.y = element.scale;
      element.mesh.scaling.z = element.scale;
    },
  };
  return { element };
};

const nodeBody = () => ({
  node: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    rotationQuaternion: { w: 1 } as unknown,
    scaling: { x: 1, y: 1, z: 1 },
  },
});

describe("writeTransform", () => {
  it("writes an element through its ATTRIBUTES, not its mesh", () => {
    // The element owns its transform and rewrites mesh.position from these on
    // render — a write to the mesh is silently undone.
    const body = elementBody();
    expect(writeTransform(body, { at: [1, 2, 3] })).toBe("element");
    expect([body.element.x, body.element.y, body.element.z]).toEqual([1, 2, 3]);
  });

  it("keeps element rotation in DEGREES on the attribute", () => {
    const body = elementBody();
    writeTransform(body, { rot: [0, 90, 0] });
    expect(body.element.ry).toBe(90);
  });

  it("turns an element body through its attributes, leaving its node alone", () => {
    /*
      tosijs-3d 0.8.1 (#48) forwards `rx`/`ry`/`rz` to the instance and
      re-renders once it exists; measured on footprints in
      tests/library-transform.pw.ts. Writing the node as well was a second
      writer for one value.
    */
    const body = elementBody();
    writeTransform(body, { rot: [0, 90, 0] });
    expect([body.element.rx, body.element.ry, body.element.rz]).toEqual([
      0, 90, 0,
    ]);
    expect(body.element.mesh.rotation.y).toBe(0);
  });

  it("writes a node directly, converting rotation to radians", () => {
    const body = nodeBody();
    expect(writeTransform(body, { at: [4, 5, 6], rot: [0, 180, 0] })).toBe(
      "node"
    );
    expect([
      body.node.position.x,
      body.node.position.y,
      body.node.position.z,
    ]).toEqual([4, 5, 6]);
    expect(body.node.rotation.y).toBeCloseTo(Math.PI, 9);
  });

  it("clears a node quaternion before rotating it", () => {
    // A TransformNode ignores .rotation while it has a quaternion, and the glTF
    // loader always sets one. This is the exact bug that made library rotation
    // inert upstream until 0.7.0: it looked wired up because position worked.
    const body = nodeBody();
    expect(body.node.rotationQuaternion).not.toBeNull();
    writeTransform(body, { rot: [0, 45, 0] });
    expect(body.node.rotationQuaternion).toBeNull();
  });

  it("leaves the quaternion alone when only moving", () => {
    // Position does not need the quaternion cleared, and clearing it anyway
    // would throw away a model's baked orientation on a simple drag.
    const body = nodeBody();
    writeTransform(body, { at: [1, 0, 0] });
    expect(body.node.rotationQuaternion).not.toBeNull();
  });

  it("scales uniformly through the element's `scale`, never `size`", () => {
    /*
      `size` is the placeholder cube's edge and is ignored once `library` is
      set (measured: 5.273 wide at scale 1, 2 and 4). Since tosijs-3d 0.8.1
      the element has a uniform `scale`, which it applies itself.
    */
    const element = elementBody();
    writeTransform(element, { scale: 3 });
    expect(element.element.scale).toBe(3);
    expect(element.element.size).toBe(1);

    const node = nodeBody();
    writeTransform(node, { scale: 3 });
    expect(node.node.scaling).toEqual({ x: 3, y: 3, z: 3 });
  });

  it("keeps a per-axis scale through the element's re-renders", () => {
    /*
      Upstream's `scale` is uniform on purpose, so a stretch goes on the node,
      and the element resets the node to its uniform `scale` on EVERY render.
      Measured in a browser: one turn took [2, 1, 3] back to [1, 1, 1].
    */
    const element = elementBody();
    writeTransform(element, { scale: [2, 1, 4] });
    expect(element.element.mesh.scaling).toEqual({ x: 2, y: 1, z: 4 });
    element.element.render();
    expect(element.element.mesh.scaling).toEqual({ x: 2, y: 1, z: 4 });
    // ...and a later uniform scale takes over from the stretch.
    writeTransform(element, { scale: 2 });
    element.element.render();
    expect(element.element.mesh.scaling).toEqual({ x: 2, y: 2, z: 2 });
  });

  it("does not touch scale when a drag only moved the piece", () => {
    // A translate release writes `at` and nothing else; stamping a scale here
    // would reset a stretched piece the first time anyone nudged it.
    const element = elementBody();
    writeTransform(element, { at: [1, 2, 3] });
    expect(element.element.mesh.scaling).toEqual({ x: 1, y: 1, z: 1 });
  });

  it("prefers the element when a piece somehow has both", () => {
    const body = { ...elementBody(), ...nodeBody() };
    expect(writeTransform(body, { at: [1, 1, 1] })).toBe("element");
  });

  it('reports "none" rather than throwing on a body-less piece', () => {
    // An environment primitive (terrain, fog) has no body to move.
    expect(writeTransform({}, { at: [1, 2, 3] })).toBe("none");
  });
});
