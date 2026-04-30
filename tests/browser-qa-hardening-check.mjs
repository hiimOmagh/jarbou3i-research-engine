import assert from 'node:assert/strict';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const playwrightConfig = fs.readFileSync('playwright.config.js', 'utf8');
const ciBrowser = fs.readFileSync('scripts/ci-browser.sh', 'utf8');
const ciNoBrowser = fs.readFileSync('scripts/ci-no-browser.sh', 'utf8');
const layoutSpec = fs.readFileSync('tests/browser-layout-persistence.spec.mjs', 'utf8');
const visualSpec = fs.readFileSync('tests/browser-visual-regression.spec.mjs', 'utf8');
const engine = fs.readFileSync('src/research-engine.js', 'utf8');
const docs = fs.existsSync('docs/v1.0.4-browser-qa-visual-regression-hardening.md') ? fs.readFileSync('docs/v1.0.4-browser-qa-visual-regression-hardening.md', 'utf8') : '';
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));

assert.equal(pkg.version, '1.0.4');
for (const script of ['test:browser:layout','test:browser:visual','test:browser:visual:strict','test:browser:qa','test:v104:no-browser','test:v104']) {
  assert.ok(pkg.scripts[script], `missing package script ${script}`);
}
assert.ok(pkg.scripts['test:patch'].includes('browser-qa-hardening-check'), 'patch gate must include browser QA hardening');
assert.ok(ciBrowser.includes('test:browser:layout'), 'CI browser script must run layout persistence spec');
assert.ok(ciBrowser.includes('test:browser:visual'), 'CI browser script must run visual capture spec');
assert.ok(ciNoBrowser.includes('browser-qa-hardening-check'), 'no-browser CI must include browser QA static gate');

for (const token of ['tests/browser-layout-persistence.spec.mjs','tests/browser-visual-regression.spec.mjs']) {
  assert.ok(fs.existsSync(token), `missing ${token}`);
}
for (const token of ['assertNoHorizontalOverflow','workflow tab selection persists','command center and engine map collapsed state persists','primary actions remain visible']) {
  assert.ok(layoutSpec.includes(token), `layout spec missing token ${token}`);
}
for (const token of ['VISUAL_BASELINE_STRICT','captureOrCompare','toHaveScreenshot','v104-desktop-${tab}','v104-mobile-analysis']) {
  assert.ok(visualSpec.includes(token), `visual spec missing token ${token}`);
}
for (const token of ['panelStorageKey','persistedPanelState','sessionStorage.setItem(panelStorageKey']) {
  assert.ok(engine.includes(token), `engine missing persistence token ${token}`);
}
assert.ok(playwrightConfig.includes('chromium') && playwrightConfig.includes('mobile-chrome'), 'Playwright projects must retain desktop and mobile coverage');
assert.ok(docs.includes('Browser QA + Visual Regression Hardening'), 'v1.0.4 docs missing');
assert.equal(fixture.workflow_version, '1.0.4');
assert.equal(fixture.browser_qa_hardening?.hardening_version, '1.0.4');
assert.equal(fixture.browser_qa_hardening?.feature_surface_added, false);
assert.equal(fixture.browser_qa_hardening?.visual_regression.mode, 'capture_or_strict_baseline');

console.log('Browser QA hardening checks passed.');
process.exit(0);
