import Uploader from "../uploader";
import readdirp, { ReaddirpStream } from "readdirp";
import { beforeEach, describe, it, vi, expect } from "vitest";
import axios from "../axios-retry";
import fs, { ReadStream } from "fs";
import PQueue from "p-queue";

const timer = async (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

const createPromises = (num = 1) => {
  const promises: Promise<unknown>[] = [];
  const promiseResolves: ((value: unknown) => void)[] = [];
  const promiseRejects: ((value: unknown) => void)[] = [];
  for (let i = 0; i < num; ++i) {
    const promise = new Promise((resolve, reject) => {
      promiseResolves.push(resolve);
      promiseRejects.push(reject);
    });
    promises.push(promise);
  }
  return { promises, promiseResolves, promiseRejects };
};

describe("Uploader", () => {
  describe("run method", () => {
    let runMethod: () => Promise<void>;
    beforeEach(() => {
      runMethod = Uploader.prototype.run;
      vi.mock("readdirp");
      const readdirpMock = vi.mocked(readdirp);
      readdirpMock.mockReturnValue({
        async *[Symbol.asyncIterator]() {
          for (let i = 0; i < 3; ++i) {
            yield {
              basename: `basename${i}`,
              path: `${i}`,
              fullPath: `full${i}`,
            };
          }
        },
      } as ReaddirpStream);
    });

    it("should call uploadFile correct number of times", async () => {
      const uploadFileMock = vi.fn((): Promise<void> => Promise.resolve());
      await runMethod.call({
        uploadFile: uploadFileMock,
        path: "src/test/test-upload-dir",
        queue: new PQueue({ concurrency: 3 }),
      });
      expect(uploadFileMock).toHaveBeenCalledTimes(3);
    });

    it("should wait for queue to become idle", async () => {
      const { promises, promiseResolves } = createPromises(3);
      const uploadFileMock = vi.fn();
      uploadFileMock.mockImplementationOnce(() => promises[0]);
      uploadFileMock.mockImplementationOnce(() => promises[1]);
      uploadFileMock.mockImplementationOnce(() => promises[2]);
      const queue = new PQueue({ concurrency: 3 });
      runMethod.call({
        uploadFile: uploadFileMock,
        path: "src/test/test-upload-dir",
        queue,
      });
      await timer();
      expect(queue.pending + queue.size).toBe(3);
      promiseResolves.forEach((resolve) => resolve(null));
      await timer();
      expect(queue.pending + queue.size).toBe(0);
    });
  });

  describe("uploadFile method", () => {
    let uploadFileMethod: (entry: readdirp.EntryInfo) => Promise<void>;
    const createReadStreamMock = vi.spyOn(fs, "createReadStream");
    createReadStreamMock.mockReturnValue(null as unknown as ReadStream);

    vi.mock("../axios-retry", () => {
      return {
        default: {
          put: vi.fn(() => Promise.resolve({ status: 201 })),
        },
      };
    });
    vi.mock("@actions/core", () => ({
      info: () => null,
    }));
    beforeEach(() => {
      uploadFileMethod = (Uploader as any).prototype.uploadFile;
    });
    it("should make fetch request", async () => {
      await uploadFileMethod.call(
        {
          storageEndpoint: "test",
          storageName: "test",
          storagePassword: "test",
        },
        { path: "Test", fullPath: "Test", basename: "Test" }
      );
      const axiosMock = vi.mocked(axios);
      expect(axiosMock.put).toHaveBeenCalled();
    });
  });
});
