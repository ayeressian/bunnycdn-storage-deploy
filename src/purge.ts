import { info } from "@actions/core";
import axios from "./axios-retry";

const purge = async (pullZoneId: string, accessKey: string) => {
  const response = await axios.post(
    `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`,
    null,
    {
      headers: {
        AccessKey: accessKey,
      },
      "axios-retry": {
        onRetry: (retryCount, error) => {
          info("Purging failed");
          info(error.message);
          info("Retrying...");
        },
      },
    }
  );
  if (response.status !== 204) {
    throw new Error(`Purging failed with the status code ${response.status}.`);
  }
  info("Cache successfully purged.");
};

export default purge;
