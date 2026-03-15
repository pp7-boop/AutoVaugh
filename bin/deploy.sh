#!/usr/bin/env bash
set -euo pipefail

# Simple end-to-end deploy for the autoblog stack.
# Prereqs: npm, wrangler (or npx wrangler), Cloudflare account logged in.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WRANGLER_BIN=${WRANGLER:-npx wrangler}
PAGES_PROJECT=${PAGES_PROJECT:-autoblog-pages}
TMP_WRANGLER=$(mktemp)

REQUIRED_VARS=(
  CLOUDFLARE_ACCOUNT_ID
  AUTOBLOG_D1_ID
  AUTOBLOG_KV_ID
  AUTOBLOG_CONFIG_KV_ID
)

missing=false
for v in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!v-}" ]; then
    echo "Missing env var: $v" >&2
    missing=true
  fi
done

if [ "$missing" = true ]; then
  echo "Set the missing variables and rerun." >&2
  exit 1
fi

if ! command -v envsubst >/dev/null; then
  echo "envsubst is required (usually from gettext). Please install it." >&2
  exit 1
fi

echo "Creating resolved wrangler config..."
envsubst < wrangler.jsonc > "$TMP_WRANGLER"

echo "Installing dependencies..."
npm install

echo "Building Astro site..."
npm run build

echo "Seeding D1 schema..."
$WRANGLER_BIN --config "$TMP_WRANGLER" d1 execute autoblog_db --remote --file src/db/schema.sql

echo "Deploying Workers + queues..."
pushd dist/server > /dev/null
$WRANGLER_BIN --config wrangler.json deploy --no-bundle --env ""
popd > /dev/null

echo "Deploying Pages project $PAGES_PROJECT..."
pushd dist/client > /dev/null
$WRANGLER_BIN pages deploy . --project-name "$PAGES_PROJECT" --branch main
popd > /dev/null

echo "(Optional) Kick off initial content jobs..."
if $WRANGLER_BIN --config "$TMP_WRANGLER" queues list 2>/dev/null | grep -q "content-queue"; then
  $WRANGLER_BIN --config "$TMP_WRANGLER" queues send content-queue '{"market":"jhb"}' || true
fi

cat <<'EOF'
Done. Next steps:
1) Ensure DNS: api subdomains point to Worker routes; roots point to Pages project.
2) Add secrets if not set: wrangler secret put GEMINI_KEY, UNSPLASH_KEY, CF_AI_TOKEN, ADMIN_PASSWORD.
3) Visit /install and /admin to verify.
EOF

rm -f "$TMP_WRANGLER"
