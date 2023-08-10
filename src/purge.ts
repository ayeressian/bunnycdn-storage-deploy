import got from "got";
import { info } from "@actions/core";

const purge = async (
  pullZoneId: string,
  accessKey: string
): Promise<got.Response<string>> => {
  const response = await got(
    `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`,
    {
      method: "POST",
      headers: {
        AccessKey: accessKey,
      },
    }
  );
  if (response.statusCode !== 204) {
    throw new Error(
      `Purging failed with the status code ${response.statusCode}.`
    );
  }
  info("Cache successfully purged.");
  return response;
};

export default purge;
