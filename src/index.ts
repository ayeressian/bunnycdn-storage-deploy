import uploader from './uploader';
import { getInput, setFailed, info } from '@actions/core';
import { join } from 'path';
import { Utils } from '@technote-space/github-action-helper';

async function run() {
  try {
    const source = join(Utils.getWorkspace(), getInput('source'));
    const storageZoneName = getInput('storageZoneName');
    const accessKey = getInput('accessKey');
    info(`Deploying ${source}`);
    await uploader(source, storageZoneName, accessKey);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
