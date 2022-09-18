const fetchMock = jest.fn(() => Promise.resolve({ status: 200 }));
jest.mock("node-fetch", () => fetchMock);

import remove from "../remove";

describe("when calling remove function", () => {
  it("should call remove API", async () => {
    await remove("storageName", "key");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://storage.bunnycdn.com/storageName/",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
