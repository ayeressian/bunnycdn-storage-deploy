import { info } from "@actions/core";
import fetch from "node-fetch";

const remove = async (
  storageName: string,
  storagePassword: string,
  storageEndpoint: string
) => {
  const url = `https://${storageEndpoint}/${storageName}/`;
  info(`Removing storage data with ${url}`);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      AccessKey: storagePassword,
    },
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
