import apiWorker from "./api";
import contentConsumer from "./content-worker";
import imageConsumer from "./image-worker";
import cronWorker from "./cron";
import { Env } from "../types";

export default {
  fetch: apiWorker.fetch,
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext) {
    if (batch.queue.includes("content")) return contentConsumer.queue(batch as any, env);
    return imageConsumer.queue(batch as any, env);
  },
  scheduled: cronWorker.scheduled
};
