import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const context = { console, globalThis: {} };
context.window = context.globalThis;
vm.createContext(context);
for (const file of ['src/research/privacy-export-guard.js', 'src/research/privacy-audit.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}
const audit = context.globalThis.Jarbou3iResearchModules.privacyAudit;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full, files); continue; }
    if (entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

const exportCandidates = [
  ...walk('fixtures/research'),
  ...walk('fixtures/migrations'),
  ...walk('fixtures/privacy'),
  ...walk('schema')
].filter((file) => fs.existsSync(file));

assert.ok(exportCandidates.length > 0, 'release gate needs JSON candidates');
for (const file of exportCandidates) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const report = audit.assertPrivacyReleaseGate(json, { throw: false });
  assert.equal(report.safe, true, `${path.relative(root, file)} failed privacy release gate:\n${report.issues.map((issue) => `- ${issue.path}: ${issue.code}/${issue.pattern_id}`).join('\n')}`);
}

const sample = JSON.parse(fs.readFileSync('fixtures/privacy/browser-generated-export-v0.29-rc1.json', 'utf8'));
assert.equal(sample.privacy_export.audit_version, '1.0.2');
assert.equal(sample.privacy_export.release_gate, 'pass');
assert.equal(sample.privacy_export.post_redaction_issue_count, 0);
assert.equal(sample.privacy_export.key_exported, false);
assert.equal(sample.privacy_export.raw_token_exported, false);

console.log(`PASS privacy-release-gate-check (${exportCandidates.length} JSON candidates)`);
process.exit(0);
