import { Env, Article, ContentJob } from "../types";
import { slugify } from "./strings";

export async function getArticle(env: Env, slug: string) {
  const stmt = env.DB.prepare("SELECT * FROM articles WHERE slug=?");
  const row = await stmt.bind(slug).first<Article>();
  if (!row) throw new Error("not found");
  return hydrateArticle(row);
}

export async function listArticles(env: Env, opts: any) {
  const limit = Math.min(parseInt(opts.limit ?? "20", 10), 50);
  const rows = await env.DB.prepare("SELECT * FROM articles ORDER BY published_at DESC LIMIT ?").bind(limit).all<Article>();
  return rows.results?.map(hydrateArticle) ?? [];
}

export async function createManualJob(env: Env, body: { keyword: string; site?: string }) {
  const job: ContentJob = { market: body.site };
  await env.CONTENT_QUEUE.send(job);
  return { enqueued: true };
}

export async function insertArticle(env: Env, article: Partial<Article>) {
  const slug = article.slug ?? slugify(article.title || "untitled");
  const now = new Date().toISOString();
  const siteId = chooseSiteId(article.market);
  await env.DB.prepare(
    `INSERT INTO articles (site_id, slug, title, html, meta_description, hero_url, hero_alt, toc_html, reading_time, published_at, updated_at, primary_keyword, secondary_keywords, affiliate_links, internal_links, market)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    siteId,
    slug,
    article.title,
    article.html,
    article.meta_description,
    article.hero_url,
    article.hero_alt,
    article.toc_html,
    article.reading_time ?? "6 min",
    now,
    now,
    article.primary_keyword,
    JSON.stringify(article.secondary_keywords ?? []),
    JSON.stringify(article.affiliate_links ?? []),
    JSON.stringify(article.internal_links ?? []),
    article.market ?? "global"
  ).run();
  return { ...article, slug, published_at: now, site_id: siteId } as Article;
}

function hydrateArticle(row: Article) {
  return {
    ...row,
    secondary_keywords: safeParse(row.secondary_keywords),
    affiliate_links: safeParse(row.affiliate_links),
    internal_links: safeParse(row.internal_links)
  } as Article;
}

function safeParse(value: any) {
  try { return JSON.parse(value ?? "[]"); } catch { return []; }
}

function chooseSiteId(market?: string) {
  if (!market) return 1;
  const lower = market.toLowerCase();
  if (lower.includes("tour")) return 2;
  // assign by region
  if (lower.includes("johannesburg") || lower.includes("cape") || lower.includes("durban") || lower.includes("pretoria")) return 1;
  if (lower.includes("tokyo") || lower.includes("london") || lower.includes("new york") || lower.includes("los angeles")) return 3;
  return 1;
}

export async function getArticlesBySlugs(env: Env, slugs: string[]) {
  if (!slugs.length) return [];
  const placeholders = slugs.map(() => "?").join(",");
  const stmt = env.DB.prepare(`SELECT * FROM articles WHERE slug IN (${placeholders})`);
  const rows = await stmt.bind(...slugs).all<Article>();
  return rows.results?.map(hydrateArticle) ?? [];
}
