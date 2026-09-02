/*#
# Scale, uniform or per axis

A piece's `scale` is `number | [x, y, z]`. Both spellings are canonical: a
number is what a file says when the scale IS uniform, not sugar for a triple.
These are the two functions that let everything else stop caring which it got.

## Why per-axis at all

Because the manipulator offers per-axis scale grips, and a control that quietly
collapses to uniform is the [[The built-in tools]] version of a slider that does
nothing. Once the widget can stretch one axis, the format has to be able to hold
the result or the drag is a lie that survives until you reload.

## The uniform reading is the LARGEST component

`FeatureContext.scale` is a single number, and features use it to size things —
a blast radius, a detection range. Given `[3, 1, 1]` the honest scalar is the
one that ENCLOSES the piece, so `3`. The mean would put the radius inside the
geometry it is meant to cover, and the minimum is worse. Say which you mean at
the call site if it matters; most callers want the enclosing extent.
*/
/*{"parent":"Format","order":6}*/
import type { Vec3 } from "./types";

/** A scale as three components, whichever way it was written. */
export function scaleVector(
  scale: number | Vec3 | undefined,
  fallback = 1
): Vec3 {
  if (scale === undefined) return [fallback, fallback, fallback];
  if (typeof scale === "number") return [scale, scale, scale];
  return [scale[0] ?? fallback, scale[1] ?? fallback, scale[2] ?? fallback];
}

/** The enclosing scalar for a scale — see the note above on why it is the max. */
export function uniformScale(
  scale: number | Vec3 | undefined,
  fallback = 1
): number {
  if (scale === undefined) return fallback;
  if (typeof scale === "number") return scale;
  return Math.max(
    scale[0] ?? fallback,
    scale[1] ?? fallback,
    scale[2] ?? fallback
  );
}

/** True when all three components agree, within floating-point reach. */
export function isUniform(scale: Vec3, epsilon = 1e-6): boolean {
  return (
    Math.abs(scale[0] - scale[1]) < epsilon &&
    Math.abs(scale[1] - scale[2]) < epsilon
  );
}

/**
 * The narrowest spelling of a scale: a number when uniform, else the triple.
 *
 * Used when WRITING back from a drag, so a file does not fill up with
 * `[1, 1, 1]` where it previously said nothing, and a uniform scale keeps
 * round-tripping as the number the author typed.
 */
export function narrowScale(scale: Vec3): number | Vec3 {
  return isUniform(scale) ? scale[0] : [scale[0], scale[1], scale[2]];
}
