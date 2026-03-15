export type Env = {
  DB: D1Database;
  CACHE: KVNamespace;
  CONFIG_KV: KVNamespace;
  ASSETS_BUCKET: R2Bucket;
  CONTENT_QUEUE: Queue<ContentJob>;
  IMAGE_QUEUE: Queue<ImageJob>;
  GEMINI_KEY: string;
  UNSPLASH_KEY: string;
  CF_AI_TOKEN: string;
  ACCOUNT_ID: string;
  ADMIN_PASSWORD: string;
  ENVIRONMENT: 'dev' | 'prod';
};

export type Brief = {
  id: number;
  primary_keyword: string;
  secondary_keywords: string[];
  intent: string;
  word_count: number;
  affiliate_placements: string[];
  internal_targets: string[];
  meta_desc: string;
  faq: string[];
  market: string;
};

export type Article = {
  site_id?: number;
  id: number;
  slug: string;
  title: string;
  html: string;
  meta_description: string;
  hero_url: string;
  hero_alt: string;
  toc_html: string;
  reading_time: string;
  published_at: string;
  updated_at: string;
  primary_keyword: string;
  secondary_keywords: string[];
  affiliate_links: string[];
  internal_links: string[];
  market: string;
};

export type ContentJob = { briefId?: number; market?: string; slug?: string; };
export type ImageJob = { key: string; prompt: string };
