import { afterEach, describe, expect, it } from "bun:test";
import { fetchEnsembleData } from "./build.js";

/*
  THE ONE FETCH every loader uses (#3222). The editor's version had no `ok`
  check, so a 404 surfaced as an unhandled JSON parse rejection; a host that
  answers a missing file with its HTML shell at 200 is the same failure.
*/
const realFetch = globalThis.fetch;
const serve = (body: string, status = 200) => {
  globalThis.fetch = (async () =>
    new Response(body, {
      status,
      statusText: status === 404 ? "Not Found" : "OK",
    })) as never;
};
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("fetchEnsembleData", () => {
  it("returns the document", async () => {
    serve(JSON.stringify({ name: "x", pieces: [] }));
    expect((await fetchEnsembleData("/x.json")).name).toBe("x");
  });

  it("rejects a 404, naming the url and the status", async () => {
    serve("nope", 404);
    await expect(fetchEnsembleData("/missing.json")).rejects.toThrow(
      'ensemble "/missing.json": 404'
    );
  });

  it("rejects an HTML shell served at 200 as not JSON", async () => {
    serve("<!doctype html><html></html>");
    await expect(fetchEnsembleData("/spa.json")).rejects.toThrow(
      "the response is not JSON"
    );
  });
});
