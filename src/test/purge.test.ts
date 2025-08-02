import { describe, it, vi, expect } from "vitest";
import nodeFetch, { Response } from "node-fetch";
import purge from "../purge";

vi.mock("node-fetch");

describe("when calling purge function", () => {
  it("should call purge API", async () => {
    const fetchMock = vi.mocked(nodeFetch);
    fetchMock.mockReturnValue(Promise.resolve({ status: 204 } as Response));
    await purge("zoneId", "zoneKey", 0, 1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bunny.net/pullzone/zoneId/purgeCache",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
