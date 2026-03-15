import { Env } from "../types";

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const markets = ["jhb","cpt","dbn","pta","bkk","ber","lon","nyc","la","tok"];
    markets.forEach(code => ctx.waitUntil(env.CONTENT_QUEUE.send({ market: code })));
    ctx.waitUntil(env.IMAGE_QUEUE.send({ key: `og/${Date.now()}.png`, prompt: "luxury skyline night" }));
  }
};
