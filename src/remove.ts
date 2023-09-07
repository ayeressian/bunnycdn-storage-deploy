import { info } from "@actions/core";
import axios from "./axios-retry";

const remove = async (
  storageName: string,
  storagePassword: string,
  storageEndpoint: string
) => {
  const url = `https://${storageEndpoint}/${storageName}/`;
  info(`Removing storage data with ${url}`);
  const response = await axios
    .delete(url, {
      headers: {
        AccessKey: storagePassword,
      },
      "axios-retry": {
        onRetry: (retryCount, error) => {
          info("Removing storage data failed.");
          info(error.message);
          info("Retrying...");
        },
      },
    })
    .catch((error) => {
      if (error?.response.status === 400) {
        return error;
      }
      info("TTTTTTT");
      info(JSON.stringify(error));
      throw error;
    });
  // THERE IS A BUG IN API 400 IS VALID SOMETIMES
  if (response.status !== 200 && response.status !== 400) {
    throw new Error(
      `Removing storage data failed with the status code ${response.status}.`
    );
  }
  info("Storage data successfully removed.");
};

export default remove;
