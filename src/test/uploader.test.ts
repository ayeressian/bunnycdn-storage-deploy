import Uploader from "../uploader";
import readdirp, { EntryInfo, ReaddirpStream } from "readdirp";
import { beforeEach, describe, it, vi, expect, afterEach, Mock } from "vitest";
import fs from "fs";
import PQueue from "p-queue";
import { Readable } from "stream";

const timer = async (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

describe("Uploader", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });
  describe("run method", () => {
    let runMethod: () => Promise<void>;
    beforeEach(() => {
      runMethod = Uploader.prototype.run;
    });

    it("should call uploadFile correct number of times", async () => {
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
      } as unknown as ReaddirpStream);
      const uploadFileMock = vi.fn((): Promise<void> => Promise.resolve());
      await runMethod.call({
        uploadFile: uploadFileMock,
        path: "src/test/test-upload-dir",
        queue: new PQueue({ concurrency: 3 }),
      });
      expect(uploadFileMock).toHaveBeenCalledTimes(3);
    });

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

    it("should wait for queue to become idle", async () => {
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
      } as unknown as ReaddirpStream);
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
    let uploadFileMethod: (entry: EntryInfo) => Promise<void>;
    let calculateChecksumMethod: (fullPath: string) => Promise<string>;
    let createReadStreamMock: Mock;
    let toWebMock: Mock;
    let bodyStream: import("stream/web").ReadableStream;
    beforeEach(() => {
      createReadStreamMock = vi.spyOn(fs, "createReadStream");
      createReadStreamMock.mockImplementation(
        () => Readable.from(["stream-body"]) as fs.ReadStream,
      );
      bodyStream = {} as import("stream/web").ReadableStream;
      toWebMock = vi.spyOn(Readable, "toWeb").mockReturnValue(bodyStream);
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 201 }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uploadFileMethod = (Uploader as any).prototype.uploadFile;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      calculateChecksumMethod = (Uploader as any).prototype.calculateChecksum;
    });

    it("should make fetch request", async () => {
      await uploadFileMethod.call(
        {
          storageEndpoint: "test",
          storageName: "test",
          storagePassword: "test",
          maxRetries: 1,
          calculateChecksum: calculateChecksumMethod,
        },
        { path: "Test", fullPath: "Test", basename: "Test" },
      );
      expect(global.fetch).toHaveBeenCalled();
      expect(createReadStreamMock).toHaveBeenCalledWith("Test");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://test/test/Test",
        expect.objectContaining({
          method: "PUT",
          headers: {
            AccessKey: "test",
            Checksum:
              "C762FFC75EBED99207B6DF46AC412A60665DBE9BFCDAA0C01560CD13FF30E32F",
          },
          body: bodyStream,
          duplex: "half",
        }),
      );
      expect(toWebMock).toHaveBeenCalledTimes(1);
    });
    describe("when fetch request fails", () => {
      it("should attempt 5 times", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 500 }));
        const originalSetTimeout = global.setTimeout;

        //ignore timeout second argument to increase speed
        const timeoutSpy = vi
          .spyOn(global, "setTimeout")
          .mockImplementation((fn) => originalSetTimeout(fn));

        await uploadFileMethod
          .call(
            {
              storageEndpoint: "test",
              storageName: "test",
              storagePassword: "test",
              maxRetries: 5,
              calculateChecksum: calculateChecksumMethod,
            },
            { path: "Test", fullPath: "Test", basename: "Test" },
          )
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .catch(() => {});
        timeoutSpy.mockRestore();

        expect(global.fetch).toHaveBeenCalledTimes(5);
        expect(createReadStreamMock).toHaveBeenCalledTimes(6);
        expect(toWebMock).toHaveBeenCalledTimes(5);
      });
    });
  });
});
