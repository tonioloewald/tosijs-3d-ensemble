/*#
# Undo

A bounded two-stack history, kept **pure** so the part with the off-by-one in it
can be tested without a browser.

## Snapshots, not diffs

An ensemble is a small JSON document and an edit is coarse — one drag release,
one typed field, one insert. Cloning the whole thing costs less than the rebuild
that follows it, and unlike a diff it cannot get out of step with a mutation it
did not model. Undo was a v1 non-goal on the strength of "everything goes
through one mutation path, so adding it later is cheap"; this is that promise
being cashed.

## A new edit forks the timeline

Undo three times, then edit: the three redos are gone. That is what every editor
does, and the alternative — keeping them and letting a later redo overwrite work
done since — is a data-loss bug wearing a feature's clothes.
*/
/*{"parent":"Editing","order":5}*/

/** One step: the state as it was, and a note on what changed it. */
export interface Step<T> {
  describe: string;
  state: T;
}

export interface History<T> {
  /** Remember `state` as the version BEFORE the edit about to happen. */
  /**
   * Record a step.
   *
   * `coalesce` folds this into the previous step when it carries the same
   * `describe` — for a control that reports CONTINUOUSLY. A slider has no
   * gesture end to wait for (`slider3d` exposes only `onChange`), so dragging
   * one would otherwise put a step in the history per pointer-move and undo
   * would walk back through the drag a pixel at a time.
   *
   * Folding keeps the OLDEST state, because that is what "before the drag"
   * means — the thing undo has to restore.
   */
  record(describe: string, state: T, coalesce?: boolean): void;
  /** The state to go back to, given where we are now. Null when there is none. */
  undo(current: T): Step<T> | null;
  /** The state to go forward to. Null when nothing was undone. */
  redo(current: T): Step<T> | null;
  canUndo(): boolean;
  canRedo(): boolean;
  /** Steps currently held, for tests and for a status line. */
  depth(): { past: number; future: number };
  clear(): void;
}

/**
 * `limit` bounds the past, so a session left open overnight cannot grow without
 * end. Generous by default: the documents are small and the edits are coarse.
 */
export function createHistory<T>(
  clone: (value: T) => T,
  limit = 200
): History<T> {
  const past: Array<Step<T>> = [];
  const future: Array<Step<T>> = [];

  return {
    record(describe, state, coalesce) {
      const last = past[past.length - 1];
      if (coalesce && last?.describe === describe) {
        // Same gesture continuing: the step already holds the state before it
        // started, which is the one undo needs. Nothing to add.
        future.length = 0;
        return;
      }
      past.push({ describe, state: clone(state) });
      if (past.length > limit) past.shift();
      // The fork: what was undone is no longer reachable once you edit again.
      future.length = 0;
    },
    undo(current) {
      const step = past.pop();
      if (!step) return null;
      future.push({ describe: step.describe, state: clone(current) });
      return step;
    },
    redo(current) {
      const step = future.pop();
      if (!step) return null;
      past.push({ describe: step.describe, state: clone(current) });
      return step;
    },
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
    depth: () => ({ past: past.length, future: future.length }),
    clear() {
      past.length = 0;
      future.length = 0;
    },
  };
}
