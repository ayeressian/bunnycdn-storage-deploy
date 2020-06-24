import fs from 'fs';
import fetch from 'node-fetch';

function uploadFile(path: string) {
  const stats = fs.statSync(path);
  const fileSizeInBytes = stats.size;

  // You can pass any of the 3 objects below as body
  let readStream = fs.createReadStream(path);
  //var stringContent = fs.readFileSync('foo.txt', 'utf8');
  //var bufferContent = fs.readFileSync('foo.txt');

  console.log('hit', path);
  return fetch('http://asdfasdfasdf.org/post', {
    method: 'POST',
    headers: {
      "Content-length": fileSizeInBytes.toString()
    },
    body: readStream // Here, stringContent or bufferContent would also work
  }).then((r) => {
    console.log('BBBBB', r);
    return r;
  });
}

async function getFilePaths(path: string, resultFiles: string[]) {
  const isDirectory = fs.lstatSync(path).isDirectory();
  
  if (isDirectory) {
    const fileNames = await fs.promises.readdir(path);
    for (const fileName of fileNames) {
      await getFilePaths(`${path}/${fileName}`, resultFiles);
    }
  } else {
    resultFiles.push(path);
  }
}

export default async function run(path: string) {
  const filePaths: string[] = [];
  await getFilePaths(path, filePaths);
  await Promise.all(filePaths.map(uploadFile));
}

