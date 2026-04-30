import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync('index.html', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');
const engine = fs.readFileSync('src/research-engine.js', 'utf8');
const renderHelpers = fs.readFileSync('src/research/render-helpers.js', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));
const migrations = fs.readFileSync('src/research/migrations.js', 'utf8');

assert.equal(pkg.version, '1.0.6');
assert.equal(fixture.workflow_version, '1.0.6');
assert.ok(pkg.scripts['test:screen-discipline']?.includes('screen-discipline-patch-check'), 'package must expose screen discipline test');
assert.ok(pkg.scripts['test:v105:no-browser']?.includes('v105-no-browser-suite'), 'package must expose v1.0.6 no-browser suite');
assert.ok(migrations.includes("'1.0.0','1.0.1','1.0.2','1.0.3','1.0.4','1.0.5','1.0.6'"), 'migrations must support v1.0.5 → v1.0.6');

for (const token of [
  'screenDisciplineNextAction',
  'workflowPanelToggle',
  'enginePanelToggle',
  'screenDisciplineCollapsed',
  'Show Command Center',
  'Show Engine Map'
]) assert.ok(index.includes(token), `index missing screen discipline token: ${token}`);

for (const token of [
  '.screenDisciplineCollapsed',
  '.disciplineAccordion',
  '.uxAccordionClosed',
  '.screenDisciplineNextAction',
  'Advanced details collapsed',
  'v1.0.6 screen discipline patch'
]) assert.ok(styles.includes(token), `styles missing screen discipline token: ${token}`);

for (const token of [
  'renderScreenDisciplineNextAction',
  'setCollapsiblePanel',
  'toggleCollapsiblePanel',
  'toggleAdvancedAccordion',
  "classList.add('uxStabilized','screenDiscipline')",
  'uxAccordionClosed'
]) assert.ok(engine.includes(token), `engine missing screen discipline token: ${token}`);

for (const forbidden of [
  '1. Research Plan',
  '2. Evidence Matrix',
  '3. Causal Links',
  '4. Analysis Compiler',
  '5. Provider Harness',
  '6. Source Planning Layer',
  '7. Source Import Adapter',
  '8. Evidence Review Queue',
  '9. Mock AI Workflow'
]) {
  assert.equal(index.includes(forbidden), false, `index should not expose global section number: ${forbidden}`);
  assert.equal(renderHelpers.includes(forbidden), false, `render helpers should not expose global section number: ${forbidden}`);
}

assert.equal((index.match(/id="exportTemplateProfileBtn"/g) || []).length, 1, 'duplicate template export button must stay removed');
assert.ok(index.includes('class="panel commandPanel screenDisciplineCollapsed"'), 'Command Center must be collapsed by default');
assert.ok(index.includes('class="panel screenDisciplineCollapsed" id="enginePanel"'), 'Analysis Engine Map must be collapsed by default');

console.log('Screen discipline patch checks passed.');
process.exit(0);
