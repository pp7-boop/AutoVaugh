


#I ADDED A ONE-SHOT DEPLOY SCRIPT.

New file: bin/deploy.sh (bash, set -euo pipefail). It checks required env vars (CLOUDFLARE_ACCOUNT_ID, AUTOBLOG_D1_ID, AUTOBLOG_KV_ID, AUTOBLOG_CONFIG_KV_ID), runs npm install, builds Astro, seeds D1 schema, deploys the Worker + queues, deploys the Pages project (PAGES_PROJECT env defaults to autoblog-pages), and optionally kicks off a starter content job. Final instructions are echoed for DNS and secrets.






#RUN IT FROM THE REPO ROOT:

chmod +x bin/deploy.sh
CLOUDFLARE_ACCOUNT_ID=... AUTOBLOG_D1_ID=... AUTOBLOG_KV_ID=... AUTOBLOG_CONFIG_KV_ID=... ./bin/deploy.sh
//** Remember to set secrets separately (wrangler secret put GEMINI_KEY, UNSPLASH_KEY, CF_AI_TOKEN, ADMIN_PASSWORD) before first live run.






#Files to check:

wrangler.jsonc (bindings/routes)
astro.config.mjs (Pages adapter)
src/db/schema.sql (seeded sites)
src/config/sites.ts (market/domain mapping)
