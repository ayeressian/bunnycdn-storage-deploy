import uploader from '../src/uploader';
import {resolve} from 'path';
import fetch from 'jest-fetch-mock';

jest.setMock('node-fetch', fetch);

fetch.enableMocks();

describe('when uploading a directory with 3 files', () => {

  it('should call fetch api 3 times', async () => {
    fetch.mockResponse(() => new Promise(resolve => setTimeout(() => resolve({ body: 'ok' }), 100)));
    await uploader(resolve('test/test-upload-dir'));
    expect(fetch.mock.calls.length).toEqual(3);
  });
});