import fetch, { Response } from "node-fetch";
import { info } from "@actions/core";

const purge = async (
  pullZoneId: string,
  accessKey: string
): Promise<Response> => {
  const response = await fetch(
    `https://bunnycdn.com/api/pullzone/${pullZoneId}/purgeCache`,
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
  return response;
};

export default purge;
