import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const guardCode = fs.readFileSync('src/research/privacy-export-guard.js', 'utf8');
const sandbox = { console, globalThis: {} };
sandbox.window = sandbox.globalThis;
vm.createContext(sandbox);
vm.runInContext(guardCode, sandbox, { filename: 'src/research/privacy-export-guard.js' });
const { auditPrivacyExport } = sandbox.globalThis.Jarbou3iResearchModules.privacyExportGuard;

const ignoredDirs = new Set(['.git','node_modules','dist','build','coverage','.next','.vite','playwright-report','test-results','assets']);
const candidateExtensions = new Set(['.json','.js','.mjs','.cjs']);
const candidateNamePattern = /(export|fixture|packet|ledger|payload|diagnostic|provider|portable|schema|privacy|workflow)/i;
const selfFiles = new Set([
  path.normalize('tests/privacy-export-check.mjs'),
  path.normalize('tests/privacy-export-guard-check.mjs'),
  path.normalize('src/research/privacy-export-guard.js')
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full, files); continue; }
    const rel = path.relative(root, full);
    if (selfFiles.has(path.normalize(rel))) continue;
    if (!candidateExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    if (!candidateNamePattern.test(rel)) continue;
    files.push(full);
  }
  return files;
}

function readJsonCandidate(file) {
  if (path.extname(file).toLowerCase() !== '.json') return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return null; }
}

const candidates = walk(root);
assert.ok(candidates.length > 0, 'No export/provider/privacy candidates found to audit.');

const jsonAudits = [];
for (const file of candidates) {
  const json = readJsonCandidate(file);
  if (!json) continue;
  const report = auditPrivacyExport(json);
  jsonAudits.push({ file: path.relative(root, file), report });
}

for (const { file, report } of jsonAudits) {
  assert.equal(report.safe, true, `${file} is privacy-unsafe:\n${report.issues.map((issue) => `- ${issue.path}: ${issue.code}`).join('\n')}`);
}

const corpus = candidates.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
for (const pattern of [
  /raw_token_exported\s*[:=]\s*true/i,
  /access_token_exported\s*[:=]\s*true/i,
  /refresh_token_exported\s*[:=]\s*true/i,
  /key_exported\s*[:=]\s*true/i,
  /secret_exported\s*[:=]\s*true/i,
  /credential_exported\s*[:=]\s*true/i
]) {
  assert.equal(pattern.test(corpus), false, `Dangerous privacy flag found: ${pattern}`);
}

assert.equal(/privacySafeExportPayload/.test(fs.readFileSync('src/research-engine.js', 'utf8')), true, 'downloadJson must route through privacySafeExportPayload.');
assert.equal(/privacy_export/.test(fs.readFileSync('schema/research-workflow.schema.json', 'utf8')), true, 'research workflow schema must define privacy_export.');
assert.equal(/privacy_export/.test(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8')), true, 'sample workflow fixture must include privacy_export.');

console.log(`PASS privacy-export-check (${candidates.length} candidates, ${jsonAudits.length} JSON audits)`);
