#!/usr/bin/env bash
# First-time app setup on the VPS. Run from the repo root AFTER you've created
# the root .env (with JWT_SECRET) and installed Node 20+ and pm2.
#   bash deploy/setup.sh
set -euo pipefail

echo "==> Installing dependencies (incl. dev, needed to build the frontend)"
npm install --include=dev

echo "==> Building the SPA + installing server prod deps"
npm run build

echo "==> Starting under pm2"
pm2 start ecosystem.config.cjs
pm2 save

echo "==> Done. App is running on 127.0.0.1:3001 (proxied by nginx)."
echo "    Run 'pm2 startup' once and follow its instructions so it survives reboots."
