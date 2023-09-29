import { info } from "@actions/core";
import fetch from "node-fetch";

const remove = async (
  destination: string,
  storageName: string,
  storagePassword: string,
  storageEndpoint: string
) => {
  const _destination = destination ? `${destination}/` : "";
  const url = `https://${storageEndpoint}/${storageName}/${_destination}`;
  info(`Removing storage data with ${url}`);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      AccessKey: storagePassword,
    },
  });

  if (response.status === 404) {
    info(`Destination not found: ${storageName}/${_destination}`);
  } else if (response.status !== 200 && response.status !== 400) {
    // THERE IS A BUG IN API 400 IS VALID SOMETIMES
    throw new Error(
      `Removing storage data failed with the status code ${response.status}.`
    );
  } else {
    info("Storage data successfully removed.");
  }
};

export default remove;
