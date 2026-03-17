import { Env } from "../types";

export async function embedText(env: Env, text: string) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CF_AI_TOKEN}` },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error("embed failed");
  const json = await res.json<any>();
  return json?.result?.data?.[0]?.embedding as number[] | undefined;
}

export async function embedAndStore(env: Env, article: { slug: string; title: string; meta_description?: string; site_id?: number }) {
  const vector = await embedText(env, `${article.title}\n${article.meta_description || ""}`);
  if (!vector) return;
  await env.VEC.upsert([{
    id: article.slug,
    values: vector,
    metadata: { slug: article.slug, site_id: article.site_id ?? 1, title: article.title }
  }]);
}

export async function relatedSlugs(env: Env, slug: string, siteId?: number, topK = 5) {
  const result = await env.VEC.query({
    topK,
    id: slug,
    filter: siteId ? { site_id: siteId } : undefined
  });
  return (result.matches || [])
    .map(m => m.metadata?.slug as string | undefined)
    .filter(Boolean)
    .filter(s => s !== slug);
}
