import { describe, it, vi, expect } from "vitest";
import got from "got";
import remove from "../remove";

describe("when calling remove function", () => {
  it("should call remove API", async () => {
    vi.mock("got");
    const gotMock = vi.mocked(got);
    gotMock.mockReturnValue(
      Promise.resolve({ statusCode: 200 }) as got.GotPromise<Buffer>
    );
    await remove("storageName", "key", "storage.bunnycdn.com");
    expect(gotMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/",
      expect.anything()
    );
    expect(gotMock).toHaveBeenCalledTimes(1);
  });
});
