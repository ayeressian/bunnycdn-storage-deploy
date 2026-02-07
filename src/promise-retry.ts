export class RetryError extends Error {
  err: unknown;
  constructor(err: unknown) {
    super();
    this.err = err;
  }
}

const timeout = (time = 0) =>
  new Promise((resolve) => setTimeout(resolve, time));

const promiseRetry = async <T>(
  fn: (attempt: number) => Promise<T>,
  options: { until: number },
) => {
  const { until } = options;
  for (let i = 0; i < until; ++i) {
    if (i !== 0) await timeout(Math.pow(2, i) * 100);
    try {
      return await fn(i + 1);
    } catch (err) {
      if (err instanceof RetryError) {
        if (i === until - 1) throw err.err;
        continue;
      } else {
        throw err;
      }
    }
  }
};

export default promiseRetry;
