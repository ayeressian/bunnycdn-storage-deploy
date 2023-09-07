import fs from "fs";
import readdirp from "readdirp";
import { info } from "@actions/core";
import PQueue from "p-queue";
import axios from "./axios-retry";

const NUM_OF_CONCURRENT_REQ = 75; // https://docs.bunny.net/reference/api-limits

export default class Uploader {
  queue: PQueue;
  constructor(
    private path: string,
    private storageName: string,
    private storagePassword: string,
    private storageEndpoint: string
  ) {
    this.queue = new PQueue({ concurrency: NUM_OF_CONCURRENT_REQ });
  }

  private async uploadFile(entry: readdirp.EntryInfo) {
    const readStream = fs.createReadStream(entry.fullPath);
    info(
      `Deploying ${entry.path} by https://${this.storageEndpoint}/${this.storageName}/${entry.path}`
    );
    const response = await axios.put(
      `https://${this.storageEndpoint}/${this.storageName}/${entry.path}`,
      readStream,
      {
        headers: {
          AccessKey: this.storagePassword,
        },
        "axios-retry": {
          onRetry: (retryCount, error) => {
            info(`Uploading ${entry.path} has failed`);
            info(error.message);
            info("Retrying...");
          },
        },
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
