import fs from "fs";
import fetch from "node-fetch";
import readdirp from "readdirp";
import { info } from "@actions/core";
import PQueue from "p-queue";

const NUM_OF_CONCURRENT_REQ = 75; // https://docs.bunny.net/reference/api-limits

export default class Uploader {
  queue: PQueue;
  constructor(
    private path: string,
    private destination: string,
    private storageName: string,
    private storagePassword: string,
    private storageEndpoint: string
  ) {
    this.queue = new PQueue({ concurrency: NUM_OF_CONCURRENT_REQ });
  }

  private async uploadFile(entry: readdirp.EntryInfo) {
    const readStream = fs.createReadStream(entry.fullPath);
    const destination = this.destination
      ? `${this.destination}/${entry.path}`
      : entry.path;
    info(
      `Deploying ${entry.path} by https://${this.storageEndpoint}/${this.storageName}/${destination}`
    );
    const response = await fetch(
      `https://${this.storageEndpoint}/${this.storageName}/${destination}`,
      {
        method: "PUT",
        headers: {
          AccessKey: this.storagePassword,
        },
        body: readStream,
      }
    );
    if (response.status === 201) {
      info(`Successful deployment of ${entry.path}.`);
    } else {
      throw new Error(
        `Uploading ${entry.path} has failed width status code ${response.status}.`
      );
    }
    return response;
  }

  async run() {
    for await (const entry of readdirp(this.path)) {
      this.queue.add(() => this.uploadFile(entry));
    }
    await this.queue.onIdle();
  }
}
