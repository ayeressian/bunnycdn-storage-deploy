import fs from "fs";
import fetch from "node-fetch";
import readdirp from "readdirp";
import { info } from "@actions/core";

const uploadFile = async (
  entry: readdirp.EntryInfo,
  storageName: string,
  accessKey: string,
  storageEndpoint: string
) => {
  const readStream = fs.createReadStream(entry.fullPath);
  info(`Deploying ${entry.path}`);
  const response = await fetch(
    `https://${storageEndpoint}/${storageName}/${entry.path}`,
    {
      method: "PUT",
      headers: {
        AccessKey: accessKey,
      },
      body: readStream,
    }
  );

  if (response.status === 201) {
    info(`Successfull deployment of ${entry.path}.`);
  } else {
    throw new Error(
      `Uploading ${entry.path} has failed width status code ${response.status}.`
    );
  }
  return response;
};

export default async function run(
  path: string,
  storageName: string,
  accessKey: string,
  storageEndpoint: string
): Promise<void> {
  for await (const entry of readdirp(path)) {
    await uploadFile(entry, storageName, accessKey, storageEndpoint);
  }
}
