import fs from 'fs';
import fetch from 'node-fetch';
import readdirp from 'readdirp';

function uploadFile(entry: readdirp.EntryInfo, storageName: string, accessKey: string) {
  const stats = fs.statSync(entry.fullPath);
  const fileSizeInBytes = stats.size;

  let readStream = fs.createReadStream(entry.fullPath);

  return fetch(`https://storage.bunnycdn.com/${storageName}/${entry.path}`, {
    method: 'POST',
    headers: {
      "AccessKey": accessKey,
      "Content-length": fileSizeInBytes.toString()
    },
    body: readStream
  });
}

export default async function run(path: string, storageName: string, accessKey: string) {
  for await (const entry of readdirp(path)) {
    uploadFile(entry, storageName, accessKey);
  }
}
