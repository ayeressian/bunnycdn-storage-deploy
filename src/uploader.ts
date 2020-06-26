import fs from 'fs';
import fetch from 'node-fetch';
import readdirp from 'readdirp';
import { info, error } from '@actions/core';

function uploadFile(entry: readdirp.EntryInfo, storageName: string, accessKey: string) {
  const stats = fs.statSync(entry.fullPath);
  const fileSizeInBytes = stats.size;

  let readStream = fs.createReadStream(entry.fullPath);
  info(`Deploying ${entry.path}`);
  return fetch(`https://storage.bunnycdn.com/${storageName}/${entry.path}`, {
    method: 'POST',
    headers: {
      "AccessKey": accessKey,
      "Content-length": fileSizeInBytes.toString()
    },
    body: readStream
  }).then(response => {
    if (response.status === 200) {
      info(`Successfull deployment of ${entry.path}`);
    } else {
      return response;
    }
    return response;
  }).catch(errorObj => {
    error(errorObj);
  });
}

export default async function run(path: string, storageName: string, accessKey: string) {
  const uploadPromises = [];
  for await (const entry of readdirp(path)) {
    uploadPromises.push(uploadFile(entry, storageName, accessKey));
  }
  await Promise.all(uploadPromises);
}
