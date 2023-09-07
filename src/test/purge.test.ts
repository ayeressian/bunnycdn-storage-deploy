import { describe, it, vi, expect } from "vitest";
import nodeFetch, { Response } from "node-fetch";
import purge from "../purge";

describe("when calling purge function", () => {
  it("should call purge API", async () => {
    vi.mock("node-fetch");
    const fetchMock = vi.mocked(nodeFetch);
    fetchMock.mockReturnValue(Promise.resolve({ status: 204 } as Response));
    await purge("zoneId", "zoneKey");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bunny.net/pullzone/zoneId/purgeCache",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
