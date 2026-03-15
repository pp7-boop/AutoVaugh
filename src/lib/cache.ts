import { Env } from "../types";

export async function kvCache<T>(env: Env, key: string, ttlSeconds: number, fetcher?: ()=>Promise<T>): Promise<T|null> {
  const cached = await env.CACHE.get(key, { type: "json" });
  if (cached) return cached as T;
  if (!fetcher) return null;
  const fresh = await fetcher();
  await env.CACHE.put(key, JSON.stringify(fresh), { expirationTtl: ttlSeconds });
  return fresh;
}
