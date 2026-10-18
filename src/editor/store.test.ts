import { describe, expect, it } from "bun:test";
import { dataClientStore, type DataClientLike } from "./store.js";

/*
  The dev-server store, against a fake of tosijs-ui's data-client: it keeps
  to its folder, writes .json paths, maps history, and REPORTS a save that
  wrote the file but did not commit rather than calling it clean.
*/
const fake = (overrides: Partial<DataClientLike> = {}) => {
  const files: Record<string, unknown> = {
    "static/ensembles/cove.json": { name: "cove", pieces: [] },
    "static/ensembles/notes.txt": "not an ensemble",
    "static/levels/elsewhere.json": { name: "elsewhere", pieces: [] },
  };
  const saved: Array<[string, unknown]> = [];
  const client: DataClientLike = {
    async listData() {
      return {
        files: Object.keys(files).map((file) => ({
          file,
          size: 1,
          modified: "2026-10-18",
        })),
      };
    },
    async readData(file) {
      return files[file];
    },
    async saveData(file, content) {
      saved.push([file, content]);
      files[file] = content;
      return { commit: "abc123" };
    },
    async dataHistory() {
      return [{ commit: "abc123", date: "d", author: "a", subject: "s" }];
    },
    ...overrides,
  };
  return { client, saved };
};

describe("dataClientStore", () => {
  it("lists only its folder's .json files, named without the folder", async () => {
    const store = dataClientStore(fake().client);
    expect(await store.list()).toEqual([
      {
        id: "static/ensembles/cove.json",
        name: "cove",
        updated: "2026-10-18",
      },
    ]);
  });

  it("writes a bare name into its folder as .json, and returns the commit", async () => {
    const { client, saved } = fake();
    const store = dataClientStore(client);
    const doc = { name: "new", pieces: [] } as never;
    expect(await store.write("new", doc)).toEqual({
      id: "static/ensembles/new.json",
      revision: "abc123",
    });
    expect(saved[0]![0]).toBe("static/ensembles/new.json");
  });

  it("rejects a save that wrote but did not commit", async () => {
    const store = dataClientStore(
      fake({
        saveData: async () => ({ commit: null, commitError: "mid-rebase" }),
      }).client
    );
    await expect(store.write("x", { pieces: [] } as never)).rejects.toThrow(
      "not committed"
    );
  });

  it("maps history, and has none when the client has none", async () => {
    const store = dataClientStore(fake().client);
    expect(await store.history!("cove.json")).toEqual([
      { revision: "abc123", at: "d", author: "a", message: "s" },
    ]);
    const bare = dataClientStore(fake({ dataHistory: undefined }).client);
    expect(bare.history).toBeUndefined();
  });
});
