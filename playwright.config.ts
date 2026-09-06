import { defineConfig, devices } from "@playwright/test";

/*
  THE SCENE LANE — what the features actually DO, in a real renderer.

  Everything else here runs under happy-dom, which has no WebGL, no layout and
  no render loop. That is fine for the format, the drag maths and the registry,
  and it is why CLAUDE.md has said all along:

    NOT checked: anything the built-in features actually do in a scene —
    turrets firing, chains, protection, terrain shape. Do not describe those
    as working.

  The cost of not having this lane is measured rather than theoretical. In one
  day: a `smart` turret that never led its target, an `underwaterFog` toggle
  writing a boolean to a number, an ambient `preset` naming something the
  element falls back from, a fog `mode` that rendered its opposite, and a
  `placePiece` that placed nothing while reporting 20 of 20 built. Every one was
  found by adopting a schema or by a consumer. None was found by a test, because
  no test could see a scene.

  ⚠️ WebGL2 IS available headless — verified before any of this was written,
  because the whole lane is worthless without it:

      WebGL2 { ok: true, renderer: 'WebKit WebGL' }   (SwiftShader)
      editor mounted, 49 content meshes, 3 lights, zero page errors

  Its own port, so it never collides with the `bun start` you have open on 8032
  — a test that kills your dev server to run is a test you stop running.
*/
const PORT = Number(process.env.E2E_PORT || 8039);

export default defineConfig({
  testDir: "./tests",
  // `.pw.ts`, the ecosystem's convention — and it keeps `bun test` and this
  // lane from ever picking up each other's files, which is the real point:
  // a scene test under happy-dom fails in ways that teach you nothing.
  testMatch: /.*\.pw\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /*
    ONE worker. Not timidity — every test here drives a WebGL context, and
    Chrome hard-caps live contexts per process (near 16) and force-loses the
    oldest when you pass it. Parallel scene tests would evict each other's
    contexts and fail in whichever order they happened to run, which is the
    least debuggable shape a flake can have. tosijs-3d#58's changelog makes the
    same point about leaked contexts from the other direction.
  */
  workers: 1,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: `https://localhost:${PORT}`,
    // The dev server is HTTPS with a local cert (`bun run tls`).
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `PORT=${PORT} bun bin/site.ts`,
    url: `https://localhost:${PORT}/`,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !process.env.CI,
    // A cold start builds the site AND fetches library glbs from a CDN.
    timeout: 120_000,
  },
});
