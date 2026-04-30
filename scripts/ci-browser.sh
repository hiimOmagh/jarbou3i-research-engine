#!/usr/bin/env bash
set -euo pipefail

if [ ! -x ./node_modules/.bin/playwright ]; then
  echo "Playwright Node CLI missing. Run npm install before browser CI." >&2
  exit 127
fi

./node_modules/.bin/playwright install --with-deps
npm run test:browser:provider
npm run test:browser:layout
npm run test:browser:visual
npm run test:browser
