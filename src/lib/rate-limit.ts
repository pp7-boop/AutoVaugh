import { IRequest } from "itty-router";
import { Env } from "../types";

const WINDOW = 60; // seconds
const MAX = 120;   // free-tier safe

export async function rateLimit(request: IRequest, env: Env) {
  if (!env?.CACHE || typeof env.CACHE.get !== "function") {
    return;
  }

  try {
    const ip = request.headers.get("cf-connecting-ip") || "anon";
    const key = `rl:${ip}:${Math.floor(Date.now()/1000/WINDOW)}`;
    const count = await env.CACHE.get(key, { type: "text" });
    const n = count ? parseInt(count, 10) : 0;
    if (n >= MAX) return new Response("Rate limit", { status: 429 });
    await env.CACHE.put(key, String(n+1), { expirationTtl: WINDOW * 2 });
  } catch (err) {
    console.error("Rate-limit check failed", err);
  }
}
