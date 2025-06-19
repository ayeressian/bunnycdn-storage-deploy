import { info, warning } from "@actions/core";
import fetch from "node-fetch";
import promiseRetry, { RetryError } from "./promise-retry";

const remove = async (
  destination: string,
  storageName: string,
  storagePassword: string,
  storageEndpoint: string,
  maxRetries: number,
) => {
  destination = destination ? `${destination}/` : "";
  const url = `https://${storageEndpoint}/${storageName}/${destination}`;
  info(`Removing storage data with ${url}`);

  await promiseRetry(async (attempt) => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        AccessKey: storagePassword,
      },
    }).catch((err) => {
      warning(
        `Removing storage data failed with network or cors error. Attempt number ${attempt}. Retrying...`
      );
      throw new RetryError(err);
    });

    if (response.status === 404) {
      info(`Destination not found: ${storageName}/${destination}`);
    } else if (response.status !== 200 && response.status !== 400) {
      // THERE IS A BUG IN API 400 IS VALID SOMETIMES
      warning(
        `Removing storage data failed with the status code ${response.status}. Attempt number ${attempt}. Retrying...`
      );
      throw new RetryError(response);
    } else {
      info("Storage data successfully removed.");
    }
  }, { until: maxRetries }).catch((err) => {
    if (err.status) {
      throw new Error(
        `Removing storage data failed with the status code ${err.status}.`
      );
    }
    throw new Error(`Removing storage data failed with network or cors error.`);
  });
};

export default remove;
