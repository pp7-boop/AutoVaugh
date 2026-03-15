import apiWorker from "./api";
import contentConsumer from "./content-worker";
import imageConsumer from "./image-worker";
import cronWorker from "./cron";
import { Env } from "../types";
import { rateLimit } from "../lib/rate-limit";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      const rateLimitResponse = await rateLimit(request as any, env);
      if (rateLimitResponse instanceof Response) return rateLimitResponse;

      return await apiWorker.fetch(request, env, ctx);
    } catch (err) {
      console.error("Worker fetch error", err);
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext) {
    try {
      if (batch.queue.includes("content")) return await contentConsumer.queue(batch as any, env);
      return await imageConsumer.queue(batch as any, env);
    } catch (err) {
      console.error("Queue handler error", err);
      throw err;
    }
  },
  scheduled: cronWorker.scheduled,
};
