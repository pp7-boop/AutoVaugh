CREATE TABLE IF NOT EXISTS sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  niche TEXT NOT NULL,
  tone TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL REFERENCES sites(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  html TEXT NOT NULL,
  meta_description TEXT,
  hero_url TEXT,
  hero_alt TEXT,
  toc_html TEXT,
  reading_time TEXT,
  published_at TEXT,
  updated_at TEXT,
  primary_keyword TEXT,
  secondary_keywords TEXT,
  affiliate_links TEXT,
  internal_links TEXT,
  market TEXT,
  UNIQUE(site_id, slug)
);

CREATE TABLE IF NOT EXISTS briefs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL REFERENCES sites(id),
  primary_keyword TEXT,
  secondary_keywords TEXT,
  intent TEXT,
  word_count INT,
  affiliate_placements TEXT,
  internal_targets TEXT,
  meta_desc TEXT,
  faq TEXT,
  market TEXT,
  status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL REFERENCES sites(id),
  email TEXT,
  status TEXT,
  token TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS affiliates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL REFERENCES sites(id),
  network TEXT,
  url TEXT,
  anchor TEXT,
  rpm REAL,
  approved INTEGER
);

CREATE TABLE IF NOT EXISTS analytics (
  site_id INTEGER PRIMARY KEY,
  date TEXT,
  sessions INT,
  ctr REAL,
  revenue REAL
);

CREATE INDEX IF NOT EXISTS idx_articles_pk ON articles(primary_keyword);
CREATE INDEX IF NOT EXISTS idx_articles_market ON articles(market);

INSERT OR IGNORE INTO sites (id, domain, brand, niche, tone, region) VALUES
  (1, 'vaughnsterling.com', 'Vaughn Sterling', 'elite male companion', 'luxury, discreet', 'South Africa + Intl'),
  (2, 'vaughnsterlingtours.com', 'Vaughn Sterling Tours', 'luxury hosted tours', 'white-glove travel', 'Global'),
  (3, 'swankyboyz.com', 'Swanky Boyz', 'male companions marketplace', 'bold, modern', 'Global');
