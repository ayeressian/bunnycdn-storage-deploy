import fs from 'fs';
import fetch from 'node-fetch';
import readdirp from 'readdirp';
import { info } from '@actions/core';

function uploadFile(entry: readdirp.EntryInfo, storageName: string, accessKey: string) {
  const stats = fs.statSync(entry.fullPath);
  const fileSizeInBytes = stats.size;

  const readStream = fs.createReadStream(entry.fullPath);
  info(`Deploying ${entry.path}`);
  return fetch(`https://storage.bunnycdn.com/${storageName}/${entry.path}`, {
    method: 'POST',
    headers: {
      "AccessKey": accessKey,
      "Content-length": fileSizeInBytes.toString()
    },
    body: readStream
  }).then(response => {
    info(`Response ${JSON.stringify(response)}`);
    if (response.status === 200) {
      info(`Successfull deployment of ${entry.path}`);
    } else {
      throw new Error(`Uploading ${entry.path} has failed width status code ${response.status}.`);
    }
    return response;
  });
}

export default async function run(path: string, storageName: string, accessKey: string): Promise<void> {
  const uploadPromises = [];
  for await (const entry of readdirp(path)) {
    uploadPromises.push(uploadFile(entry, storageName, accessKey));
  }
  await Promise.all(uploadPromises);
}
