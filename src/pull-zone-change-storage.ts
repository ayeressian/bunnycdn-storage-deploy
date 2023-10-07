import { getInput, setFailed, info } from "@actions/core";
import fetch from "node-fetch";

type Params = {
  pullZoneId: string;
  storageZoneId: string;
  accessKey: string;
};

class Main {
  private params: Params;

  constructor() {
    this.params = this.getParams();
  }

  async run() {
    try {
      await this.pullZoneChangeStorage();
    } catch (error) {
      setFailed(error as string | Error);
    }
  }

  private getParams(): Params {
    const result = {
      pullZoneId: getInput("pullZoneId"),
      storageZoneId: getInput("storageZoneId"),
      accessKey: getInput("accessKey"),
    };

    return result;
  }

  private async pullZoneChangeStorage() {
    if (!this.params.pullZoneId) {
      throw new Error("Can't create, pullZoneId was not set.");
    }
    if (!this.params.storageZoneId) {
      throw new Error("Can't create, storageZoneId was not set.");
    }
    if (!this.params.accessKey) {
      throw new Error("Can't upload, accessKey was not set.");
    }
    info(
      `Updating pull zone ${this.params.pullZoneId} with storage zone ${this.params.storageZoneId}`
    );

    const url = `https://api.bunny.net/pullzone/${this.params.pullZoneId}`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: this.params.accessKey,
      },
      body: JSON.stringify({
        StorageZoneId: this.params.storageZoneId,
        OriginType: 2,
      }),
    };

    const [status, data] = await fetch(url, options).then((res) =>
      Promise.all([
        res.status,
        res.json() as Promise<{ Id: string; Name: string; Password: string }>,
      ])
    );
    if (status !== 200) {
      if (status === 400) {
        info(`Status 400: ${JSON.stringify(data)}`);
      }
      throw new Error(`Creating failed with the status code ${status}.`);
    }
    info(`Pull zone updated`);
  }
}

new Main().run();
