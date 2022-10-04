import { resolve } from "path";
const fetchMock = jest.fn(() => Promise.resolve({ status: 201 }));
jest.mock("node-fetch", () => fetchMock);

import uploader from "../uploader";

describe("when uploading a directory with 3 files", () => {
  it("should call fetch api 3 times with correct arguments", async () => {
    await uploader(
      resolve("src/test/test-upload-dir"),
      "storageName",
      "key",
      "storage.bunnycdn.com"
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/test.txt",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/test2.txt",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/nestd/test3.txt",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
