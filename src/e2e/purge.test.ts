import { loadEnvFile } from "node:process";
import { describe, expect, it, vi } from "vitest";
import purge from "../purge";

loadEnvFile();

const zoneId = process.env.ZONE_ID;
const accessKey = process.env.ACCESS_KEY;
if (!zoneId) throw new Error("ZONE_ID env missing");
if (!accessKey) throw new Error("ACCESS_KEY env missing");

describe("purge e2e", () => {
  it("should successfuly purge", async () => {
    const logs = { info: vi.fn(console.log), warning: vi.fn(console.error) };
    await purge(zoneId, accessKey, 0, 5, logs);
    expect(logs.info).toBeCalledWith("Cache successfully purged.");
    expect(logs.warning).toBeCalledTimes(0);
  });
});
