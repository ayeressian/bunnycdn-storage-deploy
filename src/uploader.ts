import fs from "fs";
import fetch from "node-fetch";
import readdirp from "readdirp";
import { info, warning } from "@actions/core";
import PQueue from "p-queue";
import promiseRetry, { RetryError } from "./promise-retry";

const NUM_OF_CONCURRENT_REQ = 75; // https://docs.bunny.net/reference/api-limits

export default class Uploader {
  queue: PQueue;
  constructor(
    private path: string,
    private destination: string,
    private storageName: string,
    private storagePassword: string,
    private storageEndpoint: string,
    private maxRetries: number
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
    return promiseRetry(
      async (attempt) => {
        const readStream = fs.createReadStream(entry.fullPath);
        const response = await fetch(
          `https://${this.storageEndpoint}/${this.storageName}/${destination}`,
          {
            method: "PUT",
            headers: {
              AccessKey: this.storagePassword,
            },
            body: readStream,
          }
        ).catch((err) => {
          warning(
            `Uploading failed with network or cors error. Attempt number ${attempt}. Retrying...`
          );
          throw new RetryError(err);
        });
        if (response.status === 201) {
          info(`Successful deployment of ${entry.path}.`);
        } else {
          warning(
            `Uploading ${entry.path} has failed width the status code ${response.status}. Attempt number ${attempt}. Retrying...`
          );
          throw new RetryError(response);
        }
        return response;
      },
      { until: this.maxRetries }
    ).catch((err) => {
      throw new Error(`Uploading failed with following error`, {
        cause: err,
      });
    });
  }

  async run() {
    for await (const entry of readdirp(this.path)) {
      this.queue.add(() => this.uploadFile(entry));
    }
    await this.queue.onIdle();
  }
}
