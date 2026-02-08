import { loadEnvFile } from "node:process";
import { describe, expect, it, vi } from "vitest";
import Uploader from "../uploader";

loadEnvFile();

const storageEndpoint = process.env.STORAGE_ENDPOINT || 'storage.bunnycdn.com';
const storagePass = process.env.STORAGE_PASSWORD;
const storageName = process.env.STORAGE_NAME;

if (!storageName) throw new Error("STORAGE_NAME env missing");
if (!storagePass) throw new Error("STORAGE_PASSWORD env missing");

describe("upload e2e", () => {
  it("should successfully upload", async () => {
    const logs = { info: vi.fn(console.log), warning: vi.fn(console.error) };
    const uploader = new Uploader(
      "./src/e2e/test-dir",
      "",
      storageName,
      storagePass,
      storageEndpoint,
      5,
      logs,
    );

    await uploader.run();
    expect(logs.info).toBeCalledWith(
      `Deploying test-file.txt by https://${storageEndpoint}/${storageName}/test-file.txt`,
    );
    expect(logs.info).toBeCalledWith(
      `Deploying test-file2.txt by https://${storageEndpoint}/${storageName}/test-file2.txt`,
    );
    expect(logs.info).toBeCalledWith(
      `Deploying nested/test-file3.txt by https://${storageEndpoint}/${storageName}/nested/test-file3.txt`,
    );

    expect(logs.info).toBeCalledWith(
      "Successful deployment of test-file2.txt.",
    );
    expect(logs.info).toBeCalledWith(
      "Successful deployment of nested/test-file3.txt.",
    );
    expect(logs.info).toBeCalledWith("Successful deployment of test-file.txt.");
    expect(logs.warning).toBeCalledTimes(0);
  });
});
