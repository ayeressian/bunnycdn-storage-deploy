import { describe, it, vi, expect } from "vitest";
import purge from "../purge";
import got from "got";

describe("when calling purge function", () => {
  it("should call purge API", async () => {
    vi.mock("got");
    const gotMock = vi.mocked(got);
    gotMock.mockReturnValue(
      Promise.resolve({ statusCode: 204 }) as got.GotPromise<Buffer>
    );
    await purge("zoneId", "zoneKey");
    expect(gotMock).toHaveBeenCalledWith(
      "https://api.bunny.net/pullzone/zoneId/purgeCache",
      expect.anything()
    );
    expect(gotMock).toHaveBeenCalledTimes(1);
  });
});
