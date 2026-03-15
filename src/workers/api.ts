import { Router } from "itty-router";
import { rateLimit } from "../lib/rate-limit";
import { analyzeDomain, validateKeys, provision } from "../lib/installer";
import { getArticle, listArticles, createManualJob } from "../lib/content";
import { authAdmin } from "../lib/auth";
import { Env } from "../types";

const router = Router();

router.all("*", (req, env: Env, ctx) => rateLimit(req, env) ?? undefined);

router.post("/analyze-domain", async (req, env: Env) => {
  const body = (await req.json?.()) ?? {};
  return json(await analyzeDomain(body as { domain: string }));
});

router.post("/validate-key/:provider", async (req) => {
  const body = await req.text();
  const ok = await validateKeys(req.params?.provider || "", body);
  return json({ ok });
});

router.post("/provision", async (req, env: Env) => {
  const body = await req.json?.();
  return new Response(await provision(body, env), { headers: { "Content-Type": "application/json" } });
});

router.get("/article/:slug", async (req, env: Env) => {
  try { return json(await getArticle(env, req.params!.slug)); }
  catch { return new Response("Not found", { status: 404 }); }
});

router.get("/articles", async (req, env: Env) => json(await listArticles(env, req.query)) );

router.post("/admin/job", authAdmin, async (req, env: Env) => {
  const body = (await req.json?.()) ?? {};
  return json(await createManualJob(env, body as any));
});

router.get("/health", () => new Response("ok"));

export default { fetch: router.handle };

function json(data: any) {
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
