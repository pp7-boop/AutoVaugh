

pfu6YYgAt9Bk7Fz



#I ADDED A ONE-SHOT DEPLOY SCRIPT.

New file: bin/deploy.sh (bash, set -euo pipefail). It checks required env vars (CLOUDFLARE_ACCOUNT_ID, AUTOBLOG_D1_ID, AUTOBLOG_KV_ID, AUTOBLOG_CONFIG_KV_ID), runs npm install, builds Astro, seeds D1 schema, deploys the Worker + queues, deploys the Pages project (PAGES_PROJECT env defaults to autoblog-pages), and optionally kicks off a starter content job. Final instructions are echoed for DNS and secrets.






#RUN IT FROM THE REPO ROOT:

chmod +x bin/deploy.sh
CLOUDFLARE_ACCOUNT_ID=... AUTOBLOG_D1_ID=... AUTOBLOG_KV_ID=... AUTOBLOG_CONFIG_KV_ID=... ./bin/deploy.sh
//** Remember to set secrets separately (wrangler secret put GEMINI_KEY, UNSPLASH_KEY, CF_AI_TOKEN, ADMIN_PASSWORD) before first live run.


GEMINI_KEY = AIzaSyBR00IRaBTq-a23IGZ-umn7TDjsrqyLB6k
uNSPLASH_KEY ACCESS, =  OAA_G-TOMAXvwcRfDpm9nXeFxXPQLF8GuUiYKlOv4BY
UNSPLASH_SECRET_KEY = iyTNozUp7tMCYrmdFl58-r5scQFY4np3hVCI1yPteSY
UNSPLAsh_APP_ID  =  896344
CF_AI_TOKEN, =   czU795OJSM7WlxZ5UviSUfj2F9eIg0EDTbgNnwL-
ADMIN_PASSWORD) =  Ek like van topdeck naai way te kwaai




#Files to check:

wrangler.jsonc (bindings/routes)
astro.config.mjs (Pages adapter)
src/db/schema.sql (seeded sites)
src/config/sites.ts (market/domain mapping)


export CLOUDFLARE_ACCOUNT_ID=22f8a8390779ed8d3951cab297d2b32a
export AUTOBLOG_D1_ID=00d4816c-0146-45dc-a822-c227b272afe7
export AUTOBLOG_KV_ID=37784a09e6e04fec8dc91ca3294e6bae
export AUTOBLOG_CONFIG_KV_ID=57608d82b1234c2c8bf7a67e7d303c65


"d1_databases": [{
    "binding": "DB",
    "database_name": "autoblog_db",
    "database_id": "00d4816c-0146-45dc-a822-c227b272afe7"
 }]
