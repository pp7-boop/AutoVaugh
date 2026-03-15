import { Env, ImageJob } from "../types";
import { generateImage, fetchStock } from "../services/images";

export default {
  async queue(batch: MessageBatch<ImageJob>, env: Env) {
    for (const msg of batch.messages) {
      try {
        const img = await generateImage(env, msg.body.prompt) || await fetchStock(env, msg.body.prompt);
        await env.ASSETS_BUCKET.put(msg.body.key, img.body, { httpMetadata: { contentType: img.type } });
        msg.ack();
      } catch (err) { msg.retry(); }
    }
  }
};
