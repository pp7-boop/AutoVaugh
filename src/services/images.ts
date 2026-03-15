import { Env } from "../types";

export async function generateImage(env: Env, prompt: string) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/ai/run/@cf/stable-diffusion-xl-base`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CF_AI_TOKEN}` },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) return null;
  return { body: await res.arrayBuffer(), type: "image/png" };
}

export async function fetchStock(env: Env, query: string) {
  const res = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Client-ID ${env.UNSPLASH_KEY}` }
  });
  if (!res.ok) throw new Error("unsplash");
  const json = await res.json<any>();
  const img = await fetch(json.urls.regular);
  return { body: await img.arrayBuffer(), type: "image/jpeg" };
}
