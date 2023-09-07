import fetch from "node-fetch";
import { info } from "@actions/core";

const purge = async (pullZoneId: string, accessKey: string) => {
  const response = await fetch(
    `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`,
    {
      method: "POST",
      headers: {
        AccessKey: accessKey,
      },
    }
  );
  if (response.status !== 204) {
    throw new Error(`Purging failed with the status code ${response.status}.`);
  }
  info("Cache successfully purged.");
};

export default purge;
