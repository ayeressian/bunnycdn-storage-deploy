import {
  describe,
  it,
  vi,
  expect,
  SpyInstance,
  beforeAll,
  afterAll,
} from "vitest";
import promiseRetry, { RetryError } from "../promise-retry";

describe("promiseRetry", () => {
  let timeoutSpy: SpyInstance;
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
    await promiseRetry(fn, { attempt: 3 }).catch((err) => {});

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should throw error on retry attempt finish", () => {
    expect(
      promiseRetry(
        () => {
          throw new RetryError("test");
        },
        { attempt: 3 }
      )
    ).rejects.toThrow("test");
  });

  it("should throw on non retry error", () => {
    expect(
      promiseRetry(() => {
        throw "test";
      })
    ).rejects.toThrow("test");
  });
});
