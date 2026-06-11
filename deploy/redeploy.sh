#!/usr/bin/env bash
# Pull the latest code and restart. Run from the repo root on the VPS.
#   bash deploy/redeploy.sh
set -euo pipefail

git pull
npm install --include=dev
npm run build
pm2 restart cyber-store
echo "==> Redeployed. The SQLite database (server/data/cyber.db) is left untouched."
