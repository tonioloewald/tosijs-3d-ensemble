import { describe, expect, it } from 'bun:test'
import { createHistory } from './history'

const clone = <T,>(v: T): T => structuredClone(v)

describe('history', () => {
  it('steps back to the state before an edit', () => {
    const h = createHistory<{ n: number }>(clone)
    let doc = { n: 1 }
    h.record('set 2', doc)
    doc = { n: 2 }
    expect(h.undo(doc)!.state).toEqual({ n: 1 })
  })

  it('steps forward again', () => {
    const h = createHistory<{ n: number }>(clone)
    let doc = { n: 1 }
    h.record('set 2', doc)
    doc = { n: 2 }
    doc = h.undo(doc)!.state
    expect(doc).toEqual({ n: 1 })
    expect(h.redo(doc)!.state).toEqual({ n: 2 })
  })

  it('walks back through several edits in order', () => {
    const h = createHistory<{ n: number }>(clone)
    let doc = { n: 0 }
    for (const n of [1, 2, 3]) {
      h.record(`set ${n}`, doc)
      doc = { n }
    }
    doc = h.undo(doc)!.state
    expect(doc).toEqual({ n: 2 })
    doc = h.undo(doc)!.state
    expect(doc).toEqual({ n: 1 })
    doc = h.undo(doc)!.state
    expect(doc).toEqual({ n: 0 })
    expect(h.undo(doc)).toBeNull()
  })

  it('SNAPSHOTS, so a later mutation of the live object cannot reach back', () => {
    // The editor mutates its ensemble in place; a history that stored the
    // reference would "undo" to whatever the object became.
    const h = createHistory<{ n: number }>(clone)
    const doc = { n: 1 }
    h.record('bump', doc)
    doc.n = 99
    expect(h.undo(doc)!.state).toEqual({ n: 1 })
  })

  it('forks the timeline on a new edit, dropping what was undone', () => {
    /*
      Keeping the redos and letting a later one overwrite work done since is a
      data-loss bug wearing a feature's clothes.
    */
    const h = createHistory<{ n: number }>(clone)
    let doc = { n: 1 }
    h.record('set 2', doc)
    doc = { n: 2 }
    doc = h.undo(doc)!.state
    expect(h.canRedo()).toBe(true)
    h.record('set 7', doc)
    expect(h.canRedo()).toBe(false)
  })

  it('reports nothing to do on an untouched document', () => {
    const h = createHistory<{ n: number }>(clone)
    expect(h.canUndo()).toBe(false)
    expect(h.canRedo()).toBe(false)
    expect(h.undo({ n: 1 })).toBeNull()
    expect(h.redo({ n: 1 })).toBeNull()
  })

  it('bounds the past so a long session cannot grow without end', () => {
    const h = createHistory<{ n: number }>(clone, 3)
    for (let n = 0; n < 10; n++) h.record(`e${n}`, { n })
    expect(h.depth().past).toBe(3)
    // The OLDEST are dropped, so the most recent edits stay undoable.
    expect(h.undo({ n: 99 })!.state).toEqual({ n: 9 })
  })
})
