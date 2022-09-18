const fetchMock = jest.fn(() => Promise.resolve({ status: 200 }));
jest.mock("node-fetch", () => fetchMock);

import purge from "../purge";

describe("when calling purge function", () => {
  it("should call purge API", async () => {
    await purge("zoneId", "zoneKey");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://bunnycdn.com/api/pullzone/purgeCache?id=zoneId",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
