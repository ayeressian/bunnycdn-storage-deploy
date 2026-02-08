import { loadEnvFile } from "node:process";
import { describe, expect, it, vi } from "vitest";
import remove from "../remove";

loadEnvFile();

const storageEndpoint = process.env.STORAGE_ENDPOINT || "storage.bunnycdn.com";
const storagePass = process.env.STORAGE_PASSWORD;
const storageName = process.env.STORAGE_NAME;

if (!storageName) throw new Error("STORAGE_NAME env missing");
if (!storagePass) throw new Error("STORAGE_PASSWORD env missing");

describe("remove e2e", () => {
  it("should successfully remove", async () => {
    const logs = { info: vi.fn(console.log), warning: vi.fn(console.error) };
    await remove("", storageName, storagePass, "storage.bunnycdn.com", 5, logs);
    expect(logs.info).toBeCalledWith(
      `Removing storage data with https://${storageEndpoint}/${storageName}/`,
    );
    expect(logs.info).toBeCalledWith("Storage data successfully removed.");
    expect(logs.warning).toBeCalledTimes(0);
  });
});
