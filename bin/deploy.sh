#!/usr/bin/env bash
set -euo pipefail

# Simple end-to-end deploy for the autoblog stack.
# Prereqs: npm, wrangler (or npx wrangler), Cloudflare account logged in.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WRANGLER_BIN=${WRANGLER:-npx wrangler}
PAGES_PROJECT=${PAGES_PROJECT:-autoblog-pages}
export WRANGLER_LOG="${WRANGLER_LOG:-none}"

echo "Installing dependencies..."
npm install

echo "Building Astro site..."
npm run build

echo "Seeding D1 schema..."
$WRANGLER_BIN d1 execute autoblog_db --remote --file src/db/schema.sql --yes

echo "Deploying Workers + queues..."
rm -rf .wrangler/deploy
$WRANGLER_BIN deploy --minify --env production

echo "Deploying Pages projects..."
# vaughnsterling.com
PUBLIC_API_BASE=https://api.vaughnsterling.com npm run build
$WRANGLER_BIN pages deploy dist --project-name vaughnsterling-pages --branch main
# vaughnsterlingtours.com
PUBLIC_API_BASE=https://api.vaughnsterlingtours.com npm run build
$WRANGLER_BIN pages deploy dist --project-name vaughnsterlingtours-pages --branch main
# swankyboyz.com
PUBLIC_API_BASE=https://api.swankyboyz.com npm run build
$WRANGLER_BIN pages deploy dist --project-name swankyboyz-pages --branch main

echo "(Optional) Kick off initial content jobs..."
if $WRANGLER_BIN queues list 2>/dev/null | grep -q "content-queue-prod"; then
  $WRANGLER_BIN queues send content-queue-prod '{"market":"jhb"}' || true
fi

cat <<'EOF'
Done. Next steps:
1) Ensure DNS: api subdomains point to Worker routes; roots point to Pages project.
2) Add secrets if not set: wrangler secret put GEMINI_KEY, UNSPLASH_KEY, CF_AI_TOKEN, ADMIN_PASSWORD.
3) Visit /install and /admin to verify.
EOF
