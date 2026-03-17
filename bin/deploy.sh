#!/usr/bin/env bash
set -euo pipefail

# Simple end-to-end deploy for the autoblog stack.
# Prereqs: npm, wrangler (or npx wrangler), Cloudflare account logged in.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WRANGLER_BIN=${WRANGLER:-npx wrangler}
PAGES_PROJECT=${PAGES_PROJECT:-autoblog-pages}
export WRANGLER_LOG="${WRANGLER_LOG:-none}"

# Validate required environment variables
echo "Validating required environment variables..."
REQUIRED_VARS=("CF_ACCOUNT_ID" "AUTOBLOG_D1_ID" "AUTOBLOG_KV_ID" "AUTOBLOG_CONFIG_KV_ID")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    MISSING_VARS+=("$var")
  fi
done

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
  echo "ERROR: Missing required environment variables:"
  for var in "${MISSING_VARS[@]}"; do
    echo "  - $var"
  done
  echo ""
  echo "Expected usage:"
  echo "  CF_ACCOUNT_ID=... AUTOBLOG_D1_ID=... AUTOBLOG_KV_ID=... AUTOBLOG_CONFIG_KV_ID=... $0"
  exit 1
fi

echo "Environment variables validated ✓"
echo ""

echo "Installing dependencies..."
npm install

echo "Building Astro site..."
npm run build

echo "Verifying Cloudflare authentication..."
if ! $WRANGLER_BIN whoami > /dev/null 2>&1; then
  echo "ERROR: Not authenticated with Cloudflare. Run 'wrangler login' first."
  exit 1
fi
echo "Cloudflare authentication verified ✓"
echo ""

echo "Seeding D1 schema..."
if ! $WRANGLER_BIN d1 execute autoblog_db --remote --file src/db/schema.sql --yes 2>/dev/null; then
  echo "WARNING: D1 schema seeding failed or already initialized. Continuing..."
fi
echo ""

echo "Deploying Workers + queues..."
rm -rf .wrangler/deploy
$WRANGLER_BIN deploy --minify --env production

echo ""
echo "Deploying Pages projects..."
# vaughnsterling.com
echo "Deploying vaughnsterling.com..."
PUBLIC_API_BASE=https://api.vaughnsterling.com npm run build
$WRANGLER_BIN pages deploy dist --project-name vaughnsterling-pages --branch main

# vaughnsterlingtours.com
echo "Deploying vaughnsterlingtours.com..."
PUBLIC_API_BASE=https://api.vaughnsterlingtours.com npm run build
$WRANGLER_BIN pages deploy dist --project-name vaughnsterlingtours-pages --branch main

# swankyboyz.com
echo "Deploying swankyboyz.com..."
PUBLIC_API_BASE=https://api.swankyboyz.com npm run build
$WRANGLER_BIN pages deploy dist --project-name swankyboyz-pages --branch main

echo ""
echo "(Optional) Kick off initial content jobs..."
if $WRANGLER_BIN queues list 2>/dev/null | grep -q "content-queue-prod"; then
  $WRANGLER_BIN queues send content-queue-prod '{"market":"jhb"}' || true
fi

cat <<'EOF'

✅ Deployment complete! Next steps:
1) Ensure DNS: api subdomains point to Worker routes; roots point to Pages project.
2) Add secrets if not set:
   - wrangler secret put GEMINI_KEY
   - wrangler secret put UNSPLASH_KEY
   - wrangler secret put CF_AI_TOKEN
   - wrangler secret put ADMIN_PASSWORD
3) Visit /install and /admin to verify deployments.
EOF
