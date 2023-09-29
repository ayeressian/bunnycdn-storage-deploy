import { getInput, setOutput, setFailed, info } from "@actions/core";

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

    const res = await fetch(url, options).then((res) => res.json());
    if (res.status !== 201) {
      throw new Error(`Creating failed with the status code ${res.status}.`);
    }
    info(
      `Storage zone successfully created. Here is the id: ${res.data.Id} and password: ${res.data.Password}`
    );
    setOutput("storageZoneName", res.data.Name);
    setOutput("storageZoneId", res.data.Id);
    setOutput("storageZonePassword", res.data.Password);
  }
}

new Main().run();
