import { describe, it, vi, expect, beforeAll, afterAll, Mock } from "vitest";
import promiseRetry, { RetryError } from "../promise-retry";

describe("promiseRetry", () => {
  let timeoutSpy: Mock;
  beforeAll(() => {
    //ignore timeout second argument to increase speed
    const originalSetTimeout = global.setTimeout;

    timeoutSpy = vi
      .spyOn(global, "setTimeout")
      .mockImplementation((fn) => originalSetTimeout(fn));
  });
  afterAll(() => {
    timeoutSpy.mockRestore();
  });
  it("should retry", async () => {
    const fn = vi.fn(() => {
      throw new RetryError("test");
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await promiseRetry(fn, { until: 3 }).catch(() => {});

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should throw error on retry attempt finish", async () => {
    await expect(
      promiseRetry(
        () => {
          throw new RetryError("test");
        },
        { until: 3 },
      ),
    ).rejects.toThrow("test");
  });

  it("should throw on non retry error", async () => {
    await expect(
      promiseRetry(
        () => {
          throw "test";
        },
        { until: 1 },
      ),
    ).rejects.toThrow("test");
  });
});
