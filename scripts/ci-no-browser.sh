#!/usr/bin/env bash
set -euo pipefail

NODE_TIMEOUT_SECONDS="${CI_NODE_TEST_TIMEOUT_SECONDS:-60}"
run_node() {
  echo "RUN node $*"
  if command -v timeout >/dev/null 2>&1; then
    timeout "${NODE_TIMEOUT_SECONDS}s" node "$@"
  else
    node "$@"
  fi
}

echo "CI no-browser gate: static/schema/fixtures/research"
run_node tests/qa-check.mjs
run_node tests/static-check.mjs
run_node tests/schema-check.mjs
run_node tests/fixtures-check.mjs
run_node tests/research-workflow-check.mjs
run_node tests/a11y-static-check.mjs

echo "CI no-browser gate: privacy/export/release"
run_node tests/privacy-export-guard-check.mjs
run_node tests/privacy-export-check.mjs
run_node tests/privacy-audit-check.mjs
run_node tests/privacy-release-gate-check.mjs
run_node tests/export-pack-v2-check.mjs

echo "CI no-browser gate: migrations/modules/workspace/templates/quality/stable-patch"
run_node tests/migration-check.mjs
run_node tests/research-module-check.mjs
run_node tests/ux-reliability-check.mjs
run_node tests/project-workspace-check.mjs
run_node tests/analysis-template-check.mjs
run_node tests/quality-gate-v3-check.mjs
run_node tests/release-candidate-freeze-check.mjs
run_node tests/stable-release-check.mjs
run_node tests/patch-stabilization-check.mjs
run_node tests/ux-stabilization-patch-check.mjs
run_node tests/screen-discipline-patch-check.mjs

echo "CI no-browser gate: provider/OAuth/backend/source"
run_node tests/provider-identity-check.mjs
run_node tests/portable-account-check.mjs
run_node tests/portable-oauth-spike-check.mjs
run_node tests/provider-response-check.mjs
run_node tests/provider-fixtures-check.mjs
run_node tests/backend-proxy-check.mjs
run_node tests/backend-hardening-check.mjs
run_node tests/backend-worker-smoke.mjs
run_node tests/source-planning-check.mjs
run_node tests/source-import-check.mjs
run_node tests/evidence-review-queue-check.mjs
run_node tests/github-source-connector-check.mjs
run_node tests/web-search-provider-check.mjs

echo "CI no-browser gate: syntax"
run_node --check src/research-engine.js
run_node --check src/research/render-helpers.js
run_node --check src/research/release-candidate.js
run_node --check src/research/portable-oauth-spike.js
run_node --check src/research/search-provider-abstraction.js
run_node --check src/research/source-connectors.js
run_node --check backend/cloudflare-worker.js
run_node --check tests/provider-mode-browser.spec.mjs
run_node --check tests/ux-stabilization-patch-check.mjs
run_node --check tests/screen-discipline-patch-check.mjs
run_node --check tests/v103-no-browser-suite.mjs

echo "CI no-browser gate passed."
