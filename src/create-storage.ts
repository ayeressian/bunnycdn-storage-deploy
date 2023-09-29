import { getInput, setOutput, setFailed, info } from "@actions/core";
import fetch from "node-fetch";

type Params = {
  name: string;
  region: string;
  replicationRegions: string[];
  zoneTier: number;
  accessKey: string;
};

class Main {
  private params: Params;

  constructor() {
    this.params = this.getParams();
  }

  async run() {
    try {
      await this.createStorage();
    } catch (error) {
      setFailed(error as string | Error);
    }
  }

  private getParams(): Params {
    const result = {
      name: getInput("name"),
      region: getInput("region"),
      replicationRegions: getInput("replicationRegions")
        .split(",")
        .map((region) => region.trim()),
      zoneTier: parseInt(getInput("zoneTier"), 10),
      accessKey: getInput("accessKey"),
    };

    return result;
  }

  private async createStorage() {
    if (!this.params.name) {
      throw new Error("Can't create, name was not set.");
    }
    if (!this.params.region) {
      throw new Error("Can't create, region was not set.");
    }
    if (
      !this.params.replicationRegions ||
      this.params.replicationRegions.length === 0
    ) {
      throw new Error("Can't create, replicationRegions was not set.");
    }
    if (!this.params.zoneTier) {
      throw new Error("Can't create, zoneTier was not set.");
    }
    if (!this.params.accessKey) {
      throw new Error("Can't upload, accessKey was not set.");
    }
    info(`Creating new storage zone with the name ${this.params.name}`);

    const url = "https://api.bunny.net/storagezone";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: this.params.accessKey,
      },
      body: JSON.stringify({
        ZoneTier: this.params.zoneTier,
        ReplicationRegions: this.params.replicationRegions,
        Name: this.params.name,
        Region: this.params.region,
      }),
    };

    const [status, data] = await fetch(url, options).then((res) =>
      Promise.all([
        res.status,
        res.json() as Promise<{ Id: string; Name: string; Password: string }>,
      ])
    );
    if (status !== 201) {
      if (status === 400) {
        info(`Status 400: ${JSON.stringify(data)}`);
      }
      throw new Error(`Creating failed with the status code ${status}.`);
    }
    info(
      `Storage zone successfully created. Here is the id: ${data.Id} and password: ${data.Password}`
    );
    setOutput("storageZoneName", data.Name);
    setOutput("storageZoneId", data.Id);
    setOutput("storageZonePassword", data.Password);
  }
}

new Main().run();
