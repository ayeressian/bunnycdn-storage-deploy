import uploader from './uploader';
import { getInput, setFailed } from '@actions/core';
import { join } from 'path';
import { Utils } from '@technote-space/github-action-helper';

try {
  const source = join(Utils.getWorkspace(), getInput('source'));
  const storageZoneName = getInput('storageZoneName');
  const accessKey = getInput('accessKey');
  uploader(source, storageZoneName, accessKey);
} catch (error) {
  setFailed(error.message);
}
