import { getInput, setFailed, info } from "@actions/core";
import fetch from "node-fetch";

type Params = {
  startsWith: string;
  keepLast: number;
  dryMode: boolean;
  accessKey: string;
};

class Main {
  private params: Params;

  constructor() {
    this.params = this.getParams();
  }

  async run() {
    try {
      await this.removeOld();
    } catch (error) {
      setFailed(error as string | Error);
    }
  }

  private getParams(): Params {
    const result = {
      startsWith: getInput("startsWith"),
      keepLast: parseInt(getInput("keepLast"), 10),
      dryMode: getInput("dryMode").toLowerCase() == "true",
      accessKey: getInput("accessKey"),
    };

    return result;
  }

  private async removeOld() {
    if (!this.params.startsWith) {
      throw new Error("Can't remove old, startsWith was not set.");
    }
    if (!this.params.keepLast) {
      throw new Error("Can't remove old, keepLast was not set.");
    }
    if (!Number.isInteger(this.params.keepLast)) {
      throw new Error("Can't remove old, keepLast was not an integer.");
    }
    if (!this.params.accessKey) {
      throw new Error("Can't remove old, accessKey was not set.");
    }

    if (this.params.startsWith && this.params.keepLast) {
      info(
        `Removing old storage zones with the prefix ${this.params.startsWith}, keeping last ${this.params.keepLast} zones`
      );

      const url = `https://api.bunny.net/storagezone?page=1&perPage=1000&includeDeleted=false&search=${this.params.startsWith}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          AccessKey: this.params.accessKey,
        },
      };

      const [status, data] = await fetch(url, options).then((res: any) =>
        Promise.all([res.status, res.json() as Promise<{ Items: any[] }>])
      );

      if (status !== 200) {
        if (status === 400) {
          info(`Status 400: ${JSON.stringify(data)}`);
        }
        throw new Error(
          `Failed fetching storage zones with status code: ${status}.`
        );
      }

      const items = data.Items;
      if (items.length === 0) {
        info("No storage zones found");
      } else {
        // Order by DateModified, and only include items with a name that starts with the prefix startsWith
        const orderedItems = items
          .filter((item) => item.Name.startsWith(this.params.startsWith))
          .sort((a, b) => {
            if (a.DateModified < b.DateModified) {
              return 1;
            }
            if (a.DateModified > b.DateModified) {
              return -1;
            }
            return 0;
          });

        info(
          `Found ${orderedItems.length} storage zones with the prefix ${this.params.startsWith}. Listing...`
        );

        orderedItems.forEach((item) => {
          info(
            `- (${item.Id}) Storage zone ${item.Name} with DateModified ${item.DateModified}`
          );
        });

        const zonesToBeDeleted = orderedItems.slice(this.params.keepLast);
        if (zonesToBeDeleted.length === 0) {
          info("No storage zones to be deleted");
        } else {
          if (!this.params.dryMode) {
            info("Deleting storage zones...");
          } else {
            info(
              "Dry mode enabled, not deleting storage zones. The following would have been deleted:"
            );
          }
          const zonesToBeDeletedPromises = zonesToBeDeleted.map(
            (item) =>
              new Promise<void>((resolve, reject) => {
                info(
                  `- (${item.Id}) Storage zone ${item.Name} with DateModified ${item.DateModified}`
                );

                if (this.params.dryMode) {
                  return resolve();
                }
                const url = `https://api.bunny.net/storagezone/${item.Id}`;
                const options = {
                  method: "DELETE",
                  headers: {
                    AccessKey: this.params.accessKey,
                  },
                };
                return fetch(url, options).then((res) => {
                  if (res.status !== 204) {
                    reject(
                      new Error(
                        `Failed deleting storage zones with status code: ${status}.`
                      )
                    );
                  }
                  resolve();
                });
              })
          );
          await Promise.all(zonesToBeDeletedPromises);
        }
      }
    }
  }
}

new Main().run();
