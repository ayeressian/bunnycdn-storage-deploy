import { describe, it, vi, expect, afterEach } from "vitest";
import purge from "../purge";

describe("when calling purge function", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("should call purge API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 204 }));
    await purge("zoneId", "zoneKey", 0, 1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.bunny.net/pullzone/zoneId/purgeCache",
      expect.anything(),
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
