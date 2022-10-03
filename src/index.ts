import { getInput, setFailed, info } from "@actions/core";
import { join } from "path";
import uploader from "./uploader";
import purge from "./purge";
import remove from "./remove";

const run = async () => {
  try {
    const source = join(
      process.env.GITHUB_WORKSPACE as string,
      getInput("source")
    );
    const storageZoneName = getInput("storageZoneName");
    const accessKey = getInput("accessKey");
    const removeFlag = getInput("remove");
    const pullZoneId = getInput("pullZoneId");
    const pullZoneAccessKey = getInput("pullZoneAccessKey");
    const purgeFlag = getInput("purge");

    if (removeFlag === "true") {
      info(`Deleting files from storage ${storageZoneName}`);
      await remove(storageZoneName, accessKey);
    }

    if (storageZoneName && accessKey) {
      info(`Deploying ${source} folder/file to storage ${storageZoneName}`);
      await uploader(source, storageZoneName, accessKey);
    }

    if (pullZoneId && pullZoneAccessKey && purgeFlag) {
      info(`Purging pull zone with the id ${pullZoneId}`);
      await purge(pullZoneId, pullZoneAccessKey);
    }
  } catch (error) {
    setFailed(error as string | Error);
  }
};

void run();
