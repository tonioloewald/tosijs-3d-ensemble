import { test, expect } from "@playwright/test";
import { budget } from "./budget.js";
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

  TWENTY TRIPS, the project's own standard: fewer cannot tell "fixed" from
  "rarer". It ran at four, as `test.fixme`, while tosijs-3d#79 made the page
  itself unstable — several engines per re-parent against Chrome's WebGL
  context cap, so four trips passed on one run and failed on the next.
  tosijs-3d 0.8.4 releases the context on teardown and gives a re-added
  element a fresh canvas; measured here, twenty trips, one canvas
  throughout, 74 meshes every time, no GL error, no lost context.

  It costs ~6 minutes under headless SwiftShader, which is why it keeps its
  own Playwright project and CI job. `REPARENT_TRIPS` lowers it for a quick
  local look — but a lower number is a smoke test, not the claim.
*/
const TRIPS = Number(process.env.REPARENT_TRIPS || 20);

test("the scene survives repeated SPA re-parenting", async ({ page }) => {
  // Scaled to the trip count: a trip is a navigation plus a health read that
  // may wait up to 15 s for the count to settle.
  test.setTimeout(budget(60_000 + TRIPS * 60_000));
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
    page.evaluate(async (settleMs: number) => {
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
      /*
        40 s (x3 on CI, via `budget`), not 15. At twenty trips under headless SwiftShader the page is
        so busy rendering that a 300 ms sleep takes ~3 s, and three of twenty
        trips ran out of a 15 s window — reported `null`, "dead". A trace of
        the same run found every trip settling at 74 meshes, one canvas
        throughout and a flat heap: slow, not broken. The window is a budget
        for the rig, not a claim about the scene.
      */
      const deadline = Date.now() + settleMs;
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
    }, budget(40_000));

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

    /*
      `history.back()` IN THE PAGE, not `page.goBack()`. The duplicate entry
      tosijs-ui#174 pushes has the SAME URL, and Playwright's `goBack` never
      sees a same-URL, same-document step as a committed navigation — so on
      tosijs-ui 1.15.4 the first call timed out instead of landing on the
      duplicate, and the loop below never got to take its second step.
      Measured: `history.back()` ×2 reaches `/` every time. It is still a real
      `popstate`, which is the thing this test drives.
    */
    await backTo("/", () =>
      page.evaluate(() => {
        history.back();
      })
    );
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
