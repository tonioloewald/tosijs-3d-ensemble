import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";

/*
  A RE-PARENT REBUILDS THE WHOLE SCENE, AND THIS IS THE TEST CLAUDE.md ASKS FOR.

  The worst bug this project has had wore four faces — dark sky, meshes
  rendering white, an empty scene, a half-loaded scene — and had one cause:
  `tosi-b3d`'s `connectedCallback` constructs a new Engine and Scene
  unconditionally, so ANY reconnect rebuilds everything. A reconnect needs no
  mutation in our shadow root at all; the doc system re-parenting our HOST in
  the light DOM disconnects and reconnects every element inside it.

  Two things about how it is tested are load-bearing, and both come from the
  write-up:

  - **NAVIGATE, DO NOT RELOAD.** Re-parenting is the trigger, so SPA
    navigation exercises it directly where a page load does so only
    incidentally — and it shuffles the race order rather than repeating one.
    The test asserts it really was SPA navigation, because a silent fallback to
    full loads would leave this passing while testing nothing.
  - **COUNT OUTCOMES OVER MANY TRIPS.** The owner's words: anything less
    cannot tell "fixed" from "rarer". A bug that fails 70% of the time hands
    you a clean pass 30% of the time, and this project recorded three separate
    confident conclusions from single samples, two of which were wrong.

  tosijs-3d#58 is marked FIXED UPSTREAM, UNVERIFIED HERE. This is the
  verification, and until it runs green that row keeps its 🟡.
*/
/*
  ⚠️ EIGHT, NOT THE TWENTY CLAUDE.md PRESCRIBES — and that is a finding, not a
  compromise I am happy with.

  At twenty the page stops responding and `page.goBack()` itself times out.
  Instrumenting the console shows why: Babylon announces itself several times
  per navigation —

      BJS - Babylon.js v9.22.1 - WebGL2   x4 during the first load
      BJS - Babylon.js v9.22.1 - WebGL2   x2 more on the next trip

  — so each re-parent constructs more than one engine, and Chrome hard-caps
  live WebGL contexts per page. Filed as tosijs-3d#79.

  FOUR is what runs reliably. Eight passed once in 1.6 minutes and then
  failed at 5.1 on the next run, alone and in a fresh browser — so the cost
  is not linear and not stable, which is itself consistent with contexts
  accumulating. This file keeps its own Playwright project so at least it is
  not downstream of the other scene tests as well.

  ⚠️ FOUR TRIPS DOES NOT MEET THIS PROJECT'S OWN STANDARD and must not be
  read as verifying tosijs-3d#58: the rule is that fewer than ~20 cannot tell
  fixed from rarer. What it does do is beat the "one confirming observation"
  failure this file exists to prevent. Raise it with REPARENT_TRIPS once the
  engine churn is fixed; the number is the only thing that needs to change.
*/
const TRIPS = Number(process.env.REPARENT_TRIPS || 4);

/*
  ⚠️ `fixme`, NOT `skip`, AND NOT DELETED — tosijs-3d#79.

  The test is right and the subject is real; what is not stable is the page it
  runs on. Four trips passed on one run and failed on the next, alone, in a
  fresh browser, with nothing changed — because several engines are
  constructed per re-parent and Chrome caps live WebGL contexts, so the cost
  per trip is neither linear nor repeatable.

  Shipping it green would be worse than not shipping it: a flaky gate teaches
  people to ignore red, which is the failure this repo spent a day undoing in
  its Pages workflow. `fixme` reports distinctly from a pass, so "we did not
  look" and "we looked and it is fine" stay different sentences.

  Run it by hand with `bun run test:reparent`; raise REPARENT_TRIPS toward 20
  and remove this line when #79 lands.
*/
test.fixme("the scene survives repeated SPA re-parenting", async ({ page }) => {
  test.setTimeout(300_000);
  const errors = collectPageErrors(page);
  let loads = 0;
  page.on("load", () => loads++);

  /*
    START ON THE HOME PAGE AND CLICK IN, so the router owns a history entry
    either side of the editor. The editor page itself cannot be navigated away
    from by clicking: `editor.md` gives the element
    `position:absolute; inset:0; z-index:1`, so it covers the nav and every
    link under it times out. Back/forward is also the FAITHFUL gesture — a
    reader leaves a page and returns to it — and it drives the router through
    `popstate` with no page load, which is the whole point.
  */
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator('a.doc-link[href="/editor/"]').first().click();

  /** Mesh, light and material counts, plus the GL error register. */
  const health = async () =>
    page.evaluate(async () => {
      /*
        WAIT FOR THE COUNT TO SETTLE, not for it to be non-zero.

        A rebuild adds the backdrop first and the ensemble's pieces several
        frames later, so `meshes.length` is briefly 3 on its way to 74. The
        first version of this took the first truthy reading and recorded a
        3-mesh scene as a healthy one — which would have called a genuinely
        half-built scene a pass, and a half-loaded scene is one of the four
        faces of the bug this test is for.

        So: sample THROUGH the interval and accept only a count that has held
        still for three consecutive reads.
      */
      const deadline = Date.now() + 15_000;
      let last = -1;
      let stable = 0;
      while (Date.now() < deadline) {
        const ed = document.querySelector("tosi-ensemble-editor") as
          | (Element & { shadowRoot: ShadowRoot | null })
          | null;
        const b3d = ed?.shadowRoot?.querySelector("tosi-b3d") as
          | (Element & {
              scene?: {
                meshes?: unknown[];
                lights?: unknown[];
                materials?: unknown[];
              };
              shadowRoot?: ShadowRoot | null;
            })
          | null;
        const scene = b3d?.scene;
        const count = scene?.meshes?.length ?? 0;
        stable = count > 0 && count === last ? stable + 1 : 0;
        last = count;
        if (stable >= 3) {
          const canvas = b3d?.shadowRoot?.querySelector(
            "canvas"
          ) as HTMLCanvasElement | null;
          /*
            The corruption this hunts for took a shared shader program down
            with a disposed scene, and the survivor rendered black while every
            uniform read correct. `gl.getError()` was 1282 — the only honest
            readout at the time, and free to take here.
          */
          const gl =
            (canvas?.getContext("webgl2") as WebGL2RenderingContext | null) ??
            null;
          return {
            meshes: count,
            lights: scene?.lights?.length ?? 0,
            materials: scene?.materials?.length ?? 0,
            glError: gl ? gl.getError() : -1,
            lost: gl ? gl.isContextLost() : null,
          };
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      return null;
    });

  const first = await health();
  expect(first, "the editor never produced a scene at all").not.toBeNull();

  const outcomes: Array<Record<string, unknown> | null> = [];
  for (let i = 0; i < TRIPS; i++) {
    /*
      Away, then back — through the router, never through the address bar.

      ⚠️ WAIT FOR THE PATH, not for a timeout. `page.goBack()` resolves when
      the BROWSER has changed history, which is before an SPA router has
      finished re-rendering. A fixed sleep after it raced the router and
      reported three of four trips "dead" when the probe had simply looked
      while the old page was still mounted — a rig that removes the timing
      inventing a bug, which is the mirror of this project's other rule about
      rigs that remove the motion.

      ⚠️ AND LOOP, because one click on this site pushes TWO history entries,
      so a single `goBack()` lands on the other copy of the page you are
      already on. Measured against both sibling sites, which push one
      (tosijs-ui#174). Looping rather than hard-coding two means this keeps
      working when that is fixed.
    */
    const backTo = async (path: string, go: () => Promise<unknown>) => {
      for (let step = 0; step < 4; step++) {
        await go();
        try {
          await page.waitForFunction((p) => location.pathname === p, path, {
            timeout: 4000,
          });
          return;
        } catch {
          /* another entry for the same page — keep going */
        }
      }
      throw new Error(`never reached ${path}`);
    };

    await backTo("/", () => page.goBack());
    /*
      CLICK back in rather than `goForward()`. Forward history does not
      survive here — the router appears to push on `popstate`, so going back
      truncates it and `goForward()` is a no-op. Clicking is the faithful
      gesture anyway, and it is what a reader does.
    */
    await page.locator('a.doc-link[href="/editor/"]').first().click();
    await page.waitForFunction(() => location.pathname === "/editor/", null, {
      timeout: 20_000,
    });
    const t0 = Date.now();
    const h = await health();
    outcomes.push(h);
    if (process.env.REPARENT_TRACE)
      console.log(`trip ${i}: ${Date.now() - t0}ms ${JSON.stringify(h)}`);
  }

  /*
    ONE load event, for the initial `goto`. If the doc system ever stops
    intercepting these clicks, every trip becomes a full page load and this
    test silently stops exercising re-parenting — which is the failure mode it
    exists to prevent, one level up.
  */
  expect(loads, "navigation fell back to full page loads").toBe(1);

  // Count the outcomes rather than asserting on the last one.
  const dead = outcomes.filter((o) => !o).length;
  const empty = outcomes.filter((o) => o && (o.meshes as number) === 0).length;
  const broken = outcomes.filter((o) => o && (o.glError as number) > 0).length;
  const lost = outcomes.filter((o) => o?.lost === true).length;
  expect(
    { trips: TRIPS, dead, empty, broken, lost },
    "a scene failed to come back after a re-parent"
  ).toEqual({ trips: TRIPS, dead: 0, empty: 0, broken: 0, lost: 0 });

  // Every trip should rebuild the SAME scene, not an accumulating one: a
  // leaked scene shows up as counts that climb rather than counts that differ.
  const meshCounts = [...new Set(outcomes.map((o) => o?.meshes))];
  expect(
    meshCounts,
    "the rebuilt scene is not the scene we started with"
  ).toEqual([first!.meshes]);

  expect(realErrors(errors)).toEqual([]);
});
