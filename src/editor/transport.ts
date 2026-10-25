/*#
# Animation transport

The editor's play / pause / speed / scrub for the animation groups its
pieces carry (board #3355). A view setting: it never touches the document.

Library animation groups arrive **stopped** — tosijs-3d clones a model's
groups onto each instance (`instance.metadata.animationGroups`) and starts
none of them. An editor that leaves them stopped shows a frozen rig and hides
the moving parts it exists to judge (Manta's pump and radar), so the
transport starts them, and pause and scrub are how you check a pose.

A group flagged `__wreckStopped` (a destroyed piece's clip) is left alone: a
dead rig stays dead.

**Sim speed scales the transport.** `<tosi-b3d>`'s `timeScale` slows
everything stepping by the scene's sim delta, but Babylon's animation groups
run on their own clock, so slow motion left a rig at full speed
(tosijs-3d#128). Each group's `speedRatio` is the transport's speed times the
scene's `timeScale`, read on every sync, so the scene's own Slow motion
button slows a rig too. Pause needs nothing: a paused scene disables
animations.
*/

/** The part of a Babylon `AnimationGroup` the transport drives. */
export interface TransportGroup {
  isPlaying: boolean;
  speedRatio: number;
  from: number;
  to: number;
  play(loop?: boolean): unknown;
  pause(): unknown;
  goToFrame(frame: number): unknown;
  __wreckStopped?: boolean;
}

export class AnimationTransport {
  /** Whether groups play. Scrubbing pauses them. */
  playing = true;
  /** Playback speed, before the scene's `timeScale`. */
  speed = 1;
  /** Where a scrub left the groups, 0 to 1 through each; null when playing. */
  position: number | null = null;

  /** Play, or pause where they are. */
  setPlaying(on: boolean): void {
    this.playing = on;
    if (on) this.position = null;
  }

  /** Pause, and put every group `t` (0 to 1) of the way through its clip. */
  scrub(t: number): void {
    this.playing = false;
    this.position = Math.min(1, Math.max(0, t));
  }

  /** Where each group was last put, so a held scrub seeks it only once. */
  private _placed = new WeakMap<TransportGroup, number>();

  /**
   * Bring `groups` into line. Cheap enough for every frame: a group already
   * in the wanted state is only read, and a scrubbed group is sought once
   * (a group that loads later is put at the same place). `timeScale` is
   * the scene's.
   */
  sync(groups: Iterable<TransportGroup>, timeScale = 1): void {
    const ratio = this.speed * Math.max(0, timeScale);
    for (const g of groups) {
      if (g.__wreckStopped) continue;
      if (this.playing) {
        this._placed.delete(g);
        if (!g.isPlaying) g.play(true);
        if (g.speedRatio !== ratio) g.speedRatio = ratio;
        continue;
      }
      if (g.isPlaying) g.pause();
      const at = this.position;
      if (at === null || this._placed.get(g) === at) continue;
      this._placed.set(g, at);
      try {
        g.goToFrame(g.from + (g.to - g.from) * at);
      } catch {
        /* a group with nothing to seek */
      }
    }
  }
}

/** Every animation group on a set of built bodies, deduplicated. */
export function groupsOf(bodies: Iterable<unknown>): TransportGroup[] {
  const out = new Set<TransportGroup>();
  for (const body of bodies) {
    const groups = (
      body as { metadata?: { animationGroups?: TransportGroup[] } } | null
    )?.metadata?.animationGroups;
    if (Array.isArray(groups)) for (const g of groups) out.add(g);
  }
  return [...out];
}
