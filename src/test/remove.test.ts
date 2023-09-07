import { describe, it, vi, expect } from "vitest";
import axios from "../axios-retry";
import remove from "../remove";

describe("when calling remove function", () => {
  it("should call remove API", async () => {
    vi.mock("../axios-retry", () => {
      return {
        default: {
          delete: vi.fn(() => Promise.resolve({ status: 200 })),
        },
      };
    });
    const axiosMock = vi.mocked(axios);
    await remove("storageName", "key", "storage.bunnycdn.com");
    expect(axiosMock.delete).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/",
      expect.anything()
    );
    expect(axiosMock.delete).toHaveBeenCalledTimes(1);
  });
});
