import uploader from './uploader';
import core from '@actions/core';
import {resolve} from 'path';

try {
  console.log('AAAAA', __dirname);
  const source = core.getInput('source');
  const storageZoneName = core.getInput('storageZoneName');
  const accessKey = core.getInput('accessKey');
  uploader(resolve(source), storageZoneName, accessKey);
} catch (error) {
  core.setFailed(error.message);
}
