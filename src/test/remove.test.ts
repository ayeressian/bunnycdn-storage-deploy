import { describe, it, vi, expect } from "vitest";
import nodeFetch, { Response } from "node-fetch";
import remove from "../remove";

describe("when calling remove function", () => {
  it("should call remove API", async () => {
    vi.mock("node-fetch");
    const fetchMock = vi.mocked(nodeFetch);
    fetchMock.mockReturnValue(Promise.resolve({ status: 200 } as Response));
    await remove("storageName", "key", "storage.bunnycdn.com");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
