/*#
# World behaviour rules

Doors, locks, lamps and spinners are mostly **state over time**, and state over
time is where behaviour goes subtly wrong: a door that opens the long way round,
a flicker that stalls when a frame is late, a lock that opens for the wrong key
because someone compared a missing key to a missing key.

So the rules live here as pure functions and the bindings stay thin. None of
this needs a scene, so all of it is tested without one.

## Everything is driven by ELAPSED TIME, not by frames

A behaviour that advances "a bit each frame" runs at a different speed on a
144 Hz monitor than on a 30 fps laptop, and stops entirely when the scene
pauses. Each function here takes elapsed seconds and returns the state that
elapsed time implies, so a dropped frame is a bigger step rather than a
different outcome.
*/
/*{"parent":"Internals","order":11}*/

/** Where a door is in its travel. */
export type DoorPhase = "closed" | "opening" | "open" | "closing";

export interface DoorState {
  phase: DoorPhase;
  /** 0 = shut, 1 = fully open. */
  progress: number;
  /** Seconds the current phase has been running. */
  elapsed: number;
}

export const closedDoor = (): DoorState => ({
  phase: "closed",
  progress: 0,
  elapsed: 0,
});

/**
 * Smooth-step easing.
 *
 * Linear travel reads as mechanical in a way real doors do not — they start
 * heavy and settle. This is the cheapest curve that fixes it.
 */
export function ease(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped * clamped * (3 - 2 * clamped);
}

export interface DoorRules {
  /** Seconds for a full open or close. */
  seconds: number;
  /** Seconds to wait before closing again; 0 or less means stay open. */
  autoClose?: number;
}

/**
 * Advance a door by `dt` seconds.
 *
 * `wants` is what the world is asking for right now — a held-open trigger, a
 * body standing in the doorway — and is checked EVERY step rather than only on
 * a transition, because a door whose opener walks away mid-swing should turn
 * around rather than complete a journey nobody wants any more.
 */
export function stepDoor(
  state: DoorState,
  dt: number,
  rules: DoorRules,
  wants: boolean
): DoorState {
  const seconds = Math.max(0.0001, rules.seconds);
  const step = dt / seconds;

  // Shut and wanted shut: nothing to do but age.
  if (state.phase === "closed" && !wants)
    return { ...state, elapsed: state.elapsed + dt };

  if (state.phase === "open") {
    if (wants) return { phase: "open", progress: 1, elapsed: 0 };
    const hold = rules.autoClose ?? 0;
    const elapsed = state.elapsed + dt;
    if (hold > 0 && elapsed < hold)
      return { phase: "open", progress: 1, elapsed };
    return { phase: "closing", progress: 1, elapsed: 0 };
  }

  /*
    Moving — and a change of DIRECTION must not swallow the frame.

    An earlier version returned the new phase without advancing, so every
    transition cost one frame of travel. With small frames that is invisible;
    with large ones it is most of the journey, and a door opened measurably
    slower on a slow machine — the exact frame-dependence this module claims to
    avoid. Decide direction from intent, then always move.
  */
  const progress = wants ? state.progress + step : state.progress - step;
  if (wants && progress >= 1) return { phase: "open", progress: 1, elapsed: 0 };
  if (!wants && progress <= 0)
    return { phase: "closed", progress: 0, elapsed: 0 };
  return {
    phase: wants ? "opening" : "closing",
    progress,
    elapsed: state.elapsed + dt,
  };
}

/** The angle (or offset) a door should be at, eased. */
export const doorAmount = (state: DoorState, full: number): number =>
  ease(state.progress) * full;

export interface LockState {
  locked: boolean;
  /** What opens it. Absent means "no key fits", which is not the same as open. */
  key?: string;
}

/**
 * Does this key open this lock?
 *
 * A lock with no key is **not** opened by a caller with no key. That comparison
 * — `undefined === undefined` — is the bug this function exists to prevent: it
 * turns every keyless lock into an open door for anyone empty-handed.
 */
export function unlocks(lock: LockState, key: string | undefined): boolean {
  if (!lock.locked) return true;
  if (!lock.key || !key) return false;
  return lock.key === key;
}

export interface ReachRules {
  /** Metres. `0` or less means "no distance limit". */
  reach: number;
  enabled: boolean;
}

/** Can this thing be used from `distance` metres away? */
export function canUse(rules: ReachRules, distance: number): boolean {
  if (!rules.enabled) return false;
  if (rules.reach <= 0) return true;
  return distance <= rules.reach;
}

/**
 * Flicker brightness at a moment in time.
 *
 * Deterministic from `seed` and `time` rather than `Math.random()`, so two
 * clients running the same scene see the same flame, a replay matches, and a
 * test can assert an actual number. `amount` 0 is perfectly steady.
 */
export function flicker(
  base: number,
  amount: number,
  time: number,
  seed = 1
): number {
  if (amount <= 0) return base;
  // Two incommensurable sine terms: cheap, and it does not repeat on a beat the
  // eye can pick out the way a single sine does.
  const n =
    Math.sin(time * 11.3 + seed * 7.7) * 0.6 +
    Math.sin(time * 23.1 + seed * 3.1) * 0.4;
  return Math.max(0, base * (1 + n * amount));
}

/**
 * Choose an animation clip by name.
 *
 * Exact match, then case-insensitive, then **nothing**. It deliberately never
 * falls back to "the first clip": a model with `Open`, `Close` and `Idle` would
 * silently play the wrong one for a typo, and a door that plays its idle
 * animation when asked to open looks like a physics bug rather than a spelling
 * mistake. Returning null lets the caller say so.
 */
export function selectClip(
  available: string[],
  requested?: string
): string | null {
  if (!available.length) return null;
  if (!requested) return available[0] ?? null;
  const exact = available.find((name) => name === requested);
  if (exact) return exact;
  const lower = requested.toLowerCase();
  return available.find((name) => name.toLowerCase() === lower) ?? null;
}

/** Degrees turned after `elapsed` seconds, wrapped to a single turn. */
export function spinAngle(degreesPerSecond: number, elapsed: number): number {
  // Wrapped so a scene left running for days does not accumulate a float big
  // enough to lose precision in its rotation.
  return (((degreesPerSecond * elapsed) % 360) + 360) % 360;
}
