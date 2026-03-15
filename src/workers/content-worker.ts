import { Env, ContentJob } from "../types";
import { generateArticle } from "../services/gemini";
import { seoCheck } from "../services/seo";
import { insertArticle } from "../lib/content";
import { markets } from "../config/sites";

export default {
  async queue(batch: MessageBatch<ContentJob>, env: Env) {
    for (const msg of batch.messages) {
      try {
        const marketCode = msg.body.market ?? "jhb";
        const market = markets.find(m => m.code === marketCode) ?? markets[0];
        const suburb = market.suburbs[Math.floor(Math.random()*market.suburbs.length)];
        const brief = {
          id: msg.body.briefId ?? Date.now(),
          primary_keyword: `${suburb.toLowerCase()} male escort for ladies`,
          secondary_keywords: ["elite companion","private date","rent men","verified gentleman"],
          intent:"transactional",
          word_count:1300,
          affiliate_placements:[],
          internal_targets:[],
          meta_desc:`Luxury male companion in ${suburb}, ${market.city}`,
          faq:[],
          market: `${suburb}, ${market.city}`
        };
        const article = await generateArticle(env, brief as any);
        if (!article) { msg.retry(); continue; }
        const ok = await seoCheck(article as any);
        if (!ok.ok) { msg.retry(); continue; }
        await insertArticle(env, article as any);
        msg.ack();
      } catch (err) { msg.retry(); }
    }
  }
};
