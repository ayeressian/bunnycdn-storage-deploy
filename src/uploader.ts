import fs from "fs";
import { Readable } from "stream";
import readdirp, { EntryInfo } from "readdirp";
import PQueue from "p-queue";
import promiseRetry, { RetryError } from "./promise-retry";
import crypto from "crypto";

const NUM_OF_CONCURRENT_REQ = 75; // https://docs.bunny.net/reference/api-limits

export default class Uploader {
  queue: PQueue;
  constructor(
    private path: string,
    private destination: string,
    private storageName: string,
    private storagePassword: string,
    private storageEndpoint: string,
    private maxRetries: number,
    private logger?: {
      info: (message: string) => void;
      warning: (message: string) => void;
    },
  ) {
    this.queue = new PQueue({ concurrency: NUM_OF_CONCURRENT_REQ });
  }

  private async uploadFile(entry: EntryInfo) {
    const destination = this.destination
      ? `${this.destination}/${entry.path}`
      : entry.path;
    this.logger?.info(
      `Deploying ${entry.path} by https://${this.storageEndpoint}/${this.storageName}/${destination}`,
    );
    const checksum = await this.calculateChecksum(entry.fullPath).catch(
      (err) => {
        throw new Error(`Calculating checksum failed`, {
          cause: err,
        });
      },
    );
    return promiseRetry(
      async (attempt) => {
        const fileStream = fs.createReadStream(entry.fullPath);
        const body = Readable.toWeb(fileStream) as ReadableStream;
        const requestInit: RequestInit & { duplex: "half" } = {
          method: "PUT",
          headers: {
            AccessKey: this.storagePassword,
            Checksum: checksum,
          },
          body,
          duplex: "half",
        };
        const response = await fetch(
          `https://${this.storageEndpoint}/${this.storageName}/${destination}`,
          requestInit,
        ).catch((err: unknown) => {
          this.logger?.warning(
            `Uploading failed with network or cors error. Attempt number ${attempt}. Retrying...`,
          );
          throw new RetryError(err);
        });
        if (response.status === 201) {
          this.logger?.info(`Successful deployment of ${entry.path}.`);
        } else {
          this.logger?.warning(
            `Uploading ${entry.path} has failed with the status code ${response.status}. Attempt number ${attempt}. Retrying...`,
          );
          throw new RetryError(response);
        }
        return response;
      },
      { until: this.maxRetries },
    ).catch((err) => {
      throw new Error(`Uploading failed with following error`, {
        cause: err,
      });
    });
  }

  private async calculateChecksum(fullPath: string) {
    const hash = crypto.createHash("sha256");
    for await (const chunk of fs.createReadStream(fullPath)) {
      hash.update(chunk);
    }
    return hash.digest("hex").toUpperCase();
  }

  async run() {
    for await (const entry of readdirp(this.path)) {
      this.queue.add(() => this.uploadFile(entry));
    }
    await this.queue.onIdle();
  }
}
