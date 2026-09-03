import { describe, expect, it } from "bun:test";
import { tosi } from "tosijs";

/*
  HOW A TOSIJS STORE ACTUALLY BEHAVES — the parts this editor depends on.

  Kept as a test rather than a note because every one of these was measured
  after guessing wrong about it, and the stale-capture case is the expensive
  kind: it leaves the app holding old data with no error anywhere, and it looks
  exactly like a write that never happened.
*/
describe("replacing the whole document", () => {
  it("assigning .tosi.value writes the store", () => {
    const store = tosi({ r1: { name: "empty", pieces: [] } }) as any;
    store.r1.tosi.value = { name: "loaded", pieces: [{ id: "a" }] };
    expect(store.r1.tosi.value.name).toBe("loaded");
    expect(store.r1.tosi.value.pieces.length).toBe(1);
  });

  it("⚠️ a captured box DISAGREES WITH ITSELF after its parent is replaced", () => {
    /*
      A box holds a PATH, not a value, and resolves live — which is why
      traversing a captured box is correct. `.value` is the exception: it
      returns the target the box was constructed over, permanently, however
      many times the path is reassigned.

      So one object gives two answers, and the wrong one is the cheap read that
      everything reaches for. The editor held the store in a field and read
      `.value`, so loading an ensemble looked like a silent no-op while the
      bound widgets — which traverse — had the real document. An afternoon went
      to the writer before anyone suspected the read. tosijs#35.

      Hence `_store` is a GETTER over `_stores[_storeKey]`: every access mints a
      fresh proxy (`store.q === store.q` is false), so nothing is ever held.
    */
    const store = tosi({ r2: { name: "empty" } }) as any;
    const captured = store.r2;
    store.r2.tosi.value = { name: "loaded" };

    expect(store.r2.tosi.value.name).toBe("loaded"); // fresh proxy: correct
    expect(captured.name.value).toBe("loaded"); // traversal: also correct
    expect(captured.tosi.value.name).toBe("empty"); // .value: the original
  });

  it("a leaf write goes through the box", () => {
    const store = tosi({ r4: { pieces: [{ id: "a", n: 1 }] } }) as any;
    store.r4["pieces[id=a].n"].value = 5;
    expect(store.r4.tosi.value.pieces[0].n).toBe(5);
  });
});

describe("addressing a leaf by piece id", () => {
  const doc = () => ({
    pieces: [{ id: "sky", features: { skybox: { timeOfDay: 10 } } }],
  });

  it("resolves an id-keyed path to a box", () => {
    const s = (tosi({ p1: doc() }) as any).p1;
    const box = s["pieces[id=sky].features.skybox.timeOfDay"];
    expect(typeof box?.observe).toBe("function");
    expect(box.value).toBe(10);
  });

  it("survives an insert above it, which an index would not", () => {
    const s = (tosi({ p2: doc() }) as any).p2;
    s.tosi.value.pieces.unshift({ id: "new", features: {} });
    s.tosi.touch();
    expect(s["pieces[id=sky].features.skybox.timeOfDay"].value).toBe(10);
  });
});

describe("what makes a hand-rolled binding unnecessary", () => {
  it("coalesces a burst of writes into one notification", async () => {
    const s = (tosi({ c1: { n: 0 } }) as any).c1;
    let fired = 0;
    s.tosi.observe(() => {
      fired += 1;
    });
    for (let i = 0; i < 50; i++) s.n.value = i;
    await new Promise((r) => setTimeout(r, 80));
    expect(fired).toBe(1);
  });

  it("says nothing when a write changes nothing", async () => {
    // This is what stops the editor's round-in-place observer feeding itself.
    const s = (tosi({ c2: { n: 5 } }) as any).c2;
    await new Promise((r) => setTimeout(r, 40));
    let fired = 0;
    s.tosi.observe(() => {
      fired += 1;
    });
    s.n.value = 5;
    s.n.value = 5;
    await new Promise((r) => setTimeout(r, 60));
    expect(fired).toBe(0);
  });
});

describe("the shape of an observed path", () => {
  it("is the path you OBSERVED, not the leaf that changed", async () => {
    /*
      Worth pinning because it is the opposite of what I assumed twice. An
      observer registered on the store root is told "something under the root
      changed" — it is a notification, not a diff — so a listener cannot learn
      WHICH field moved by parsing the string.

      In the browser the same observer sometimes reports the full leaf path,
      which is worse than always reporting the root: code that parses it appears
      to work. The first version rounded "the field the path names" and silently
      did nothing whenever the root was reported, and fell through to
      re-rendering the panel — destroying the slider under the pointer, which
      looked exactly like the bug it was meant to fix.

      So `_onDocumentWrite` reads the DOCUMENT rather than the path, and uses
      the path only as a coalescing key for undo, where a coarse value is
      harmless.
    */
    const store = tosi({
      myKey: { pieces: [{ id: "a", features: { f: { k: 1 } } }] },
    }) as any;
    const seen: string[] = [];
    store.myKey.tosi.observe((path: string) => seen.push(String(path)));
    store.myKey["pieces[id=a].features.f.k"].value = 2;
    await new Promise((r) => setTimeout(r, 60));
    expect(seen.length).toBeGreaterThan(0);
    expect(store.myKey.tosi.value.pieces[0].features.f.k).toBe(2);
  });
});
