/*
  A NESTED piece's selection box encloses its children; its own body is an
  empty anchor. Measured over the children once per build (or per in-place
  move) and carried by the anchor after that (#3423: walking every child's
  hierarchy every frame was the cost).

  Cached only once every child has its body (#3440, 0.8.1 review). A library
  child instantiates inside `lib.ready.then(...)`, so straight after a build
  its element has no mesh; a box cached then encloses only the children that
  were quick, and stayed that small until the next build.
*/

export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export interface Box {
  min: XYZ;
  max: XYZ;
}

/** A built child, as the editor holds it. */
export interface NestChild {
  element?: unknown;
  node?: unknown;
}

interface Measurable {
  computeWorldMatrix?: (force: boolean) => void;
  getHierarchyBoundingVectors?: () => Box;
}

/** A child's body: its element's mesh, else its node. */
const bodyOf = (child: NestChild): unknown =>
  (child.element as { mesh?: unknown } | null | undefined)?.mesh ?? child.node;

/** A child whose element has not instantiated its mesh yet. */
const pending = (child: NestChild): boolean =>
  !!child.element && !(child.element as { mesh?: unknown }).mesh;

/** World bounds enclosing several bodies, or undefined when none has any. */
export function unionBounds(bodies: unknown[]): Box | undefined {
  let out: Box | undefined;
  for (const body of bodies) {
    const b = body as Measurable | null | undefined;
    b?.computeWorldMatrix?.(true);
    const v = b?.getHierarchyBoundingVectors?.();
    if (!v || !Number.isFinite(v.min.x) || !Number.isFinite(v.max.x)) continue;
    out = out
      ? {
          min: {
            x: Math.min(out.min.x, v.min.x),
            y: Math.min(out.min.y, v.min.y),
            z: Math.min(out.min.z, v.min.z),
          },
          max: {
            x: Math.max(out.max.x, v.max.x),
            y: Math.max(out.max.y, v.max.y),
            z: Math.max(out.max.z, v.max.z),
          },
        }
      : { min: { ...v.min }, max: { ...v.max } };
  }
  return out;
}

export class NestBounds {
  private cache: { key: unknown; id: string; bounds: Box; at: XYZ } | null =
    null;

  /** Forget the box: the children moved. */
  clear(): void {
    this.cache = null;
  }

  /**
   * The box around `children`, shifted by however far the anchor has moved
   * (`now`) since it was measured. `key` is the build: a new one measures
   * again.
   */
  measure(
    key: unknown,
    id: string,
    children: NestChild[],
    now: XYZ
  ): Box | undefined {
    let cache = this.cache;
    if (!cache || cache.key !== key || cache.id !== id) {
      const bounds = unionBounds(children.map(bodyOf));
      if (!bounds) return undefined;
      if (children.some(pending)) return bounds; // measure again next frame
      const at = { x: now.x, y: now.y, z: now.z };
      cache = this.cache = { key, id, bounds, at };
    }
    const d = {
      x: now.x - cache.at.x,
      y: now.y - cache.at.y,
      z: now.z - cache.at.z,
    };
    const { min, max } = cache.bounds;
    return {
      min: { x: min.x + d.x, y: min.y + d.y, z: min.z + d.z },
      max: { x: max.x + d.x, y: max.y + d.y, z: max.z + d.z },
    };
  }
}
