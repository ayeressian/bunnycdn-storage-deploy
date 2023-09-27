import { getInput, setFailed, info } from "@actions/core";
import { join, isAbsolute } from "path";
import Uploader from "./uploader";
import purge from "./purge";
import remove from "./remove";

type Params = {
  source: string;
  destination: string;
  storageZoneName: string;
  storageEndpoint: string;
  storagePassword: string;
  accessKey: string;
  pullZoneId: string;
  purgePullZoneFlag: string;
  removeFlag: string;
  uploadFlag: string;
};

class Main {
  private params: Params;

  constructor() {
    this.params = this.getParams();
  }

  async run() {
    try {
      await this.remove();
      await this.upload();
      await this.purge();
    } catch (error) {
      setFailed(error as string | Error);
    }
  }

  private getParams(): Params {
    const result = {
      source: getInput("source"),
      destination: getInput("destination"),
      storageZoneName: getInput("storageZoneName"),
      storageEndpoint: getInput("storageEndpoint") ?? "storage.bunnycdn.com",
      storagePassword: getInput("storagePassword"),
      accessKey: getInput("accessKey"),
      pullZoneId: getInput("pullZoneId"),

      purgePullZoneFlag: getInput("purgePullZone"),
      removeFlag: getInput("remove"),
      uploadFlag: getInput("upload"),
    };
    result.source = isAbsolute(result.source)
      ? result.source
      : join(process.env.GITHUB_WORKSPACE as string, result.source);
    return result;
  }

  private async remove() {
    if (this.params.removeFlag === "true") {
      if (!this.params.storageZoneName) {
        throw new Error("Can't remove, storageZoneName was not set.");
      }
      if (!this.params.storagePassword) {
        throw new Error("Can't remove, storagePassword was not set.");
      }
      info(`Deleting files from storage ${this.params.storageZoneName}`);
      await remove(
        this.params.destination,
        this.params.storageZoneName,
        this.params.storagePassword,
        this.params.storageEndpoint
      );
    }
  }

  private async upload() {
    if (this.params.uploadFlag === "true") {
      if (!this.params.source) {
        throw new Error("Can't upload, source was not set.");
      }
      if (!this.params.storageZoneName) {
        throw new Error("Can't upload, storageZoneName was not set.");
      }
      if (!this.params.storagePassword) {
        throw new Error("Can't upload, storagePassword was not set.");
      }
      if (this.params.storageZoneName && this.params.storagePassword) {
        info(
          `Uploading ${this.params.source} folder/file to storage ${this.params.storageZoneName}`
        );
        await new Uploader(
          this.params.source,
          this.params.destination,
          this.params.storageZoneName,
          this.params.storagePassword,
          this.params.storageEndpoint
        ).run();
      }
    }
  }

  private async purge() {
    if (this.params.purgePullZoneFlag == "true") {
      if (!this.params.pullZoneId) {
        throw new Error("Can't purge, pullZoneId was not set.");
      }
      if (!this.params.accessKey) {
        throw new Error("Can't upload, accessKey was not set.");
      }
      if (this.params.pullZoneId && this.params.accessKey) {
        info(`Purging pull zone with the id ${this.params.pullZoneId}`);
        await purge(this.params.pullZoneId, this.params.accessKey);
      }
    }
  }
}

new Main().run();
