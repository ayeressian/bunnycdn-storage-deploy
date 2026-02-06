import { describe, it, vi, expect, afterEach } from "vitest";
import remove from "../remove";

describe("when calling remove function", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("should call remove API", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });
    await remove("", "storageName", "key", "storage.bunnycdn.com", 1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/",
      expect.anything(),
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should be possible to call remove API with a destination", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });
    await remove(
      "subfolder/folder2",
      "storageName",
      "key",
      "storage.bunnycdn.com",
      1,
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/subfolder/folder2/",
      expect.anything(),
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should be possible to call remove API with a destination that does not exist", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 404 });
    await remove(
      "subfolder/new-folder",
      "storageName",
      "key",
      "storage.bunnycdn.com",
      1,
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/subfolder/new-folder/",
      expect.anything(),
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
