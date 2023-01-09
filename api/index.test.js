import { unstable_dev as UnStableDev } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('Worker', () => {
  let worker;

  beforeAll(async () => {
    worker = await UnStableDev('src/index.js', {}, { disableExperimentalWarning: true });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it('should return Hello World', async () => {
    const resp = await worker.fetch();
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot('Hello World!');
    }
  });
});
