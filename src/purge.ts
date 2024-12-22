import fetch from "node-fetch";
import { info, warning } from "@actions/core";
import promiseRetry, { RetryError } from "./promise-retry";

const purge = async (pullZoneId: string, accessKey: string) => {
  await promiseRetry(async (attempt) => {
    const response = await fetch(
      `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`,
      {
        method: "POST",
        headers: {
          AccessKey: accessKey,
        },
      }
    ).catch((err) => {
      warning(
        `Purging failed with network or cors error. Attempt number ${attempt}. Retrying...`
      );
      throw new RetryError(err);
    });
    if (response.status !== 204) {
      warning(
        `Purging failed with the status code ${response.status}. Attempt number ${attempt}. Retrying...`
      );
      throw new RetryError(response);
    }
    info("Cache successfully purged.");
  }).catch((err) => {
    if (err.status) {
      throw new Error(`Purging failed with the status code ${err.status}.`);
    }
    throw new Error(`Purging failed with network or cors error.`);
  });
};

export default purge;
