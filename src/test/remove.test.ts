import { describe, it, vi, expect, afterEach } from "vitest";
import nodeFetch, { Response } from "node-fetch";
import remove from "../remove";

describe("when calling remove function", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("should call remove API", async () => {
    vi.mock("node-fetch");
    const fetchMock = vi.mocked(nodeFetch);
    fetchMock.mockReturnValue(Promise.resolve({ status: 200 } as Response));
    await remove("", "storageName", "key", "storage.bunnycdn.com");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should be possible to call remove API with a destination", async () => {
    vi.mock("node-fetch");
    const fetchMock = vi.mocked(nodeFetch);
    fetchMock.mockReturnValue(Promise.resolve({ status: 200 } as Response));
    await remove(
      "subfolder/folder2",
      "storageName",
      "key",
      "storage.bunnycdn.com"
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/subfolder/folder2/",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should be possible to call remove API with a destination that does not exist", async () => {
    vi.mock("node-fetch");
    const fetchMock = vi.mocked(nodeFetch);
    fetchMock.mockReturnValue(Promise.resolve({ status: 404 } as Response));
    await remove(
      "subfolder/new-folder",
      "storageName",
      "key",
      "storage.bunnycdn.com"
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/subfolder/new-folder/",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
