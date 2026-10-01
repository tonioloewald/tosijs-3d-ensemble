import { test } from "@playwright/test";
import { writeFileSync } from "node:fs";
test("heap snapshot after leaving the editor", async ({ page }) => {
  test.setTimeout(600_000);
  const cdp = await page.context().newCDPSession(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  for (let i = 0; i < 2; i++) {
    await page.locator('a.doc-link[href="/editor/"]').first().click();
    await page.waitForFunction(() => location.pathname === "/editor/", null, { timeout: 30000 });
    await page.waitForTimeout(9000);
    for (let s = 0; s < 4 && (await page.evaluate(() => location.pathname)) !== "/"; s++)
      await page.evaluate(async () => { history.back(); await new Promise((r) => setTimeout(r, 1200)); });
    await page.waitForTimeout(2000);
  }
  for (let g = 0; g < 3; g++) { await cdp.send("HeapProfiler.collectGarbage"); await page.waitForTimeout(400); }
  const chunks: string[] = [];
  cdp.on("HeapProfiler.addHeapSnapshotChunk", (e: any) => chunks.push(e.chunk));
  await cdp.send("HeapProfiler.takeHeapSnapshot", { reportProgress: false });
  writeFileSync("/private/tmp/claude-501/-Users-tonioloewald-tosijs-3d-ensemble/e8116964-6d74-4d86-aa61-866617cd9299/scratchpad/editor.heapsnapshot", chunks.join(""));
  console.log("SNAP bytes", chunks.join("").length);
});
