import { info } from "@actions/core";
import got from "got";

const remove = async (
  storageName: string,
  storagePassword: string,
  storageEndpoint: string
): Promise<got.Response<string>> => {
  const url = `https://${storageEndpoint}/${storageName}/`;
  info(`Removing storage data with ${url}`);
  const response = await got(url, {
    method: "DELETE",
    headers: {
      AccessKey: storagePassword,
    },
  });
  // THERE IS A BUG IN API 400 IS VALID SOMETIMES
  if (response.statusCode !== 200 && response.statusCode !== 400) {
    throw new Error(
      `Removing storage data failed with the status code ${response.statusCode}.`
    );
  }
  info("Storage data successfully removed.");
  return response;
};

export default remove;
