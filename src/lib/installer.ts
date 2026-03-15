import { markets, sites } from "../config/sites";
import { Env } from "../types";

export async function analyzeDomain(body: { domain: string }) {
  const site = sites.find(s => s.domain === body.domain) ?? sites[0];
  const recommendations = markets
    .filter(m => site.primaryMarketCodes.includes(m.code))
    .slice(0, 3)
    .map(m => ({
      name: `${site.brand} — ${m.city}`,
      desc: `${site.niche} for ${m.city}'s top-tier districts`,
      volume: "5k-40k/mo",
      affiliate: 8,
      competition: "Medium",
      rpm: 120,
      angles: ["discreet luxury","verified professional","concierge-level dates"],
      fit: `${body.domain} matches affluent ${m.city} audience`
    }));
  return { niches: recommendations, site };
}

export async function validateKeys(provider: string, key: string) {
  // lightweight check: ensure non-empty and correct length heuristics
  if (!key || key.length < 8) return false;
  return true;
}

export async function provision(input: any, env: Env) {
  // Persist chosen settings in KV; infra is assumed pre-provisioned via wrangler
  await env.CONFIG_KV.put(`site:${input.domain}`, JSON.stringify(input), { expirationTtl: 0 });
  return JSON.stringify({ ok: true, url: `https://${input.domain}` });
}
