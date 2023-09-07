import { describe, it, vi, expect } from "vitest";
import purge from "../purge";
import axios from "../axios-retry";

describe("when calling purge function", () => {
  it("should call purge API", async () => {
    vi.mock("../axios-retry", () => {
      return {
        default: {
          post: vi.fn(() => Promise.resolve({ status: 204 })),
        },
      };
    });
    const axiosMock = vi.mocked(axios);
    await purge("zoneId", "zoneKey");
    expect(axiosMock.post).toHaveBeenCalledWith(
      "https://api.bunny.net/pullzone/zoneId/purgeCache",
      null,
      expect.anything()
    );
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
  });
});
