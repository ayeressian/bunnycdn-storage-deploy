import { getInput, setFailed, info } from "@actions/core";
import { join, isAbsolute } from "path";
import uploader from "./uploader";
import purge from "./purge";
import remove from "./remove";

const run = async () => {
  try {
    const source = isAbsolute(getInput("source")) ? getInput("source") : join(
      process.env.GITHUB_WORKSPACE as string,
      getInput("source")
    );
    const storageZoneName = getInput("storageZoneName");
    const storageEndpoint =
      getInput("storageEndpoint") ?? "storage.bunnycdn.com";
    const storagePassword = getInput("storagePassword");
    const accessKey = getInput("accessKey");
    const pullZoneId = getInput("pullZoneId");

    const purgePullZoneFlag = getInput("purgePullZone");
    const removeFlag = getInput("remove");
    const uploadFlag = getInput("upload");

    if (removeFlag === "true") {
      if (!storageZoneName) {
        throw new Error("Can't remove, storageZoneName was not set.");
      }
      if (!storagePassword) {
        throw new Error("Can't remove, storagePassword was not set.");
      }
      info(`Deleting files from storage ${storageZoneName}`);
      await remove(storageZoneName, storagePassword, storageEndpoint);
    }

    if (uploadFlag === "true") {
      if (!source) {
        throw new Error("Can't upload, source was not set.");
      }
      if (!storageZoneName) {
        throw new Error("Can't upload, storageZoneName was not set.");
      }
      if (!storagePassword) {
        throw new Error("Can't upload, storagePassword was not set.");
      }
      if (storageZoneName && storagePassword) {
        info(`Uploading ${source} folder/file to storage ${storageZoneName}`);
        await uploader(
          source,
          storageZoneName,
          storagePassword,
          storageEndpoint
        );
      }
    }

    if (purgePullZoneFlag == "true") {
      if (!pullZoneId) {
        throw new Error("Can't purge, pullZoneId was not set.");
      }
      if (!accessKey) {
        throw new Error("Can't upload, accessKey was not set.");
      }
      if (pullZoneId && accessKey) {
        info(`Purging pull zone with the id ${pullZoneId}`);
        await purge(pullZoneId, accessKey);
      }
    }
  } catch (error) {
    setFailed(error as string | Error);
  }
};

void run();
