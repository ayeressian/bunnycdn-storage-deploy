const fetchMock = jest.fn(() => Promise.resolve({ status: 204 }));
jest.mock("node-fetch", () => fetchMock);

import purge from "../purge";

describe("when calling purge function", () => {
  it("should call purge API", async () => {
    await purge("zoneId", "zoneKey");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://bunnycdn.com/api/pullzone/zoneId/purgeCache",
      expect.anything()
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
