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
    const destination = this.destination
      ? `${this.destination}/${entry.path}`
      : entry.path;
    info(
      `Deploying ${entry.path} by https://${this.storageEndpoint}/${this.storageName}/${destination}`
    );

    const numRetries = 10;
    let lastError: unknown = null;

    for (let i = 0; i < numRetries; ++i) {
      const readStream = fs.createReadStream(entry.fullPath);
      let status = -1;
      try {
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
        status = response.status;
      } catch (e) {
        lastError = e;
        info(`Error uploading ${entry.path}: ${e}. Retrying`);
      }

      if (status === -1) {
        const retryDelay = Math.pow(2, i) * 100; // Exponential backoff: 100ms, 200ms, 400ms, etc.
        await new Promise(res => setTimeout(res, retryDelay));
        continue;
      }

      if (status !== 201) {
        throw new Error(
          `Uploading ${entry.path} has failed with status code ${status}.`
        );
      }
        
      info(`Successful deployment of ${entry.path}.`);
      return;
    }

    throw new Error(`Uploading ${entry.path} has failed after ${numRetries} retries`);
  }

  async run() {
    for await (const entry of readdirp(this.path)) {
      this.queue.add(() => this.uploadFile(entry));
    }
    await this.queue.onIdle();
  }
}
