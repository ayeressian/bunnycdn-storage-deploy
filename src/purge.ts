import promiseRetry, { RetryError } from "./promise-retry";

const purge = async (
  pullZoneId: string,
  accessKey: string,
  delay: number,
  maxRetries: number,
  logger?: {
    info: (message: string) => void;
    warning: (message: string) => void;
  },
) => {
  if (delay > 0) {
    logger?.info(`Waiting ${delay} seconds before purging pull zone`);
    await new Promise((resolve) => setTimeout(resolve, delay * 1000));
  }
  await promiseRetry(
    async (attempt) => {
      const response = await fetch(
        `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`,
        {
          method: "POST",
          headers: {
            AccessKey: accessKey,
          },
        },
      ).catch((err: unknown) => {
        logger?.warning(
          `Purging failed with network or cors error. Attempt number ${attempt}. Retrying...`,
        );
        throw new RetryError(err);
      });
      if (response.status !== 204) {
        logger?.warning(
          `Purging failed with the status code ${response.status}. Attempt number ${attempt}. Retrying...`,
        );
        throw new RetryError(response);
      }
      logger?.info("Cache successfully purged.");
    },
    { until: maxRetries },
  ).catch((err) => {
    throw new Error(`Purging failed with the following error`, {
      cause: err,
    });
  });
};

export default purge;
