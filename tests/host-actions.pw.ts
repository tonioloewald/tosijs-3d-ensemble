import { test, expect } from "@playwright/test";
import { collectPageErrors, realErrors } from "./page-errors.js";
import { reveal } from "./panel-locate.js";

/*
  THE HOST'S BUTTONS (board #3364, from Manta: "run the level and see how well
  it plays"). The host declares `hostActions`; each is a button in the file
  panel that hands the host a COPY of the current document, unsaved edits
  included. Clicked for real, and the copy checked against the document.
*/
test("a host action button hands the host a copy of the current document", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1400, height: 1100 });
  const errors = collectPageErrors(page);
  await page.goto("/editor/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      !!(
        document.querySelector("tosi-ensemble-editor") as Element | null
      )?.shadowRoot?.querySelector("tosi-b3d"),
    { timeout: 60_000 }
  );
  /*
    The page's OWN document first. An edit made while its `src` is still
    loading is replaced when the load lands (1 run in 5 under load,
    2026-10-20), and the host then gets pirate-cove, not the edit.
  */
  await page.waitForFunction(
    () =>
      (
        document.querySelector("tosi-ensemble-editor") as Element & {
          ensemble?: { name?: string };
        }
      ).ensemble?.name === "pirate-cove",
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      hostActions: unknown;
      edit(d: string, m: (e: { name: string }) => void): void;
    };
    // An UNSAVED edit first: the host must get what is on screen.
    ed.edit("rename", (e) => {
      e.name = "played-unsaved";
    });
    (window as unknown as { __played: unknown[] }).__played = [];
    ed.hostActions = [
      {
        label: "Play",
        handleAction: (doc: unknown) =>
          (window as unknown as { __played: unknown[] }).__played.push(doc),
      },
    ];
  });
  await page.waitForTimeout(500);
  // The chrome is drawn in the scene: find the button on screen.
  const found = await reveal(page, "Play");
  const box = found && { x: found.x + found.w / 2, y: found.y + found.h / 2 };
  expect(box, "no Play button in the editor").toBeTruthy();
  await page.mouse.click(box!.x, box!.y);
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      ensemble: { name: string };
    };
    const played = (window as unknown as { __played: Array<{ name: string }> })
      .__played;
    const copy = played[0];
    const same = copy === (ed.ensemble as unknown);
    const handedName = copy?.name;
    if (copy) copy.name = "mutated-by-host";
    return {
      calls: played.length,
      handedName,
      same,
      editorName: ed.ensemble.name,
    };
  });
  expect(r.calls).toBe(1);
  // What is on screen, unsaved edit included.
  expect(r.handedName).toBe("played-unsaved");
  expect(r.same, "the host got the editor's own document").toBe(false);
  // The host's copy is its own: changing it leaves the editor alone.
  expect(r.editorName).toBe("played-unsaved");
  expect(realErrors(errors)).toEqual([]);
});
