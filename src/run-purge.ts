import { getInput, setFailed, info } from "@actions/core";
import purge from "./purge";

type Params = {
  pullZoneId: string;
  accessKey: string;
};

class Main {
  private params: Params;

  constructor() {
    this.params = this.getParams();
  }

  async run() {
    try {
      await this.purge();
    } catch (error) {
      setFailed(error as string | Error);
    }
  }

  private getParams(): Params {
    const result = {
      pullZoneId: getInput("pullZoneId"),
      accessKey: getInput("accessKey"),
    };

    return result;
  }

  private async purge() {
    if (!this.params.pullZoneId) {
      throw new Error("Can't purge, pullZoneId was not set.");
    }
    if (!this.params.accessKey) {
      throw new Error("Can't purge, accessKey was not set.");
    }
    if (this.params.pullZoneId && this.params.accessKey) {
      info(`Purging pull zone with the id ${this.params.pullZoneId}`);
      await purge(this.params.pullZoneId, this.params.accessKey);
    }
  }
}

new Main().run();
