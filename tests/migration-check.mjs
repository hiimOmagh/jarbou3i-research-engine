import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (file) => fs.readFileSync(file, 'utf8');
const moduleText = read('src/research/migrations.js');
const index = read('index.html');
const engine = read('src/research-engine.js');
const schema = JSON.parse(read('schema/research-workflow.schema.json'));

new vm.Script(moduleText, { filename: 'src/research/migrations.js' });
const context = { console, window: {} };
context.globalThis = context;
context.window = context;
vm.createContext(context);
vm.runInContext(moduleText, context, { filename: 'src/research/migrations.js' });

const migrations = context.Jarbou3iResearchModules.migrations;
assert.equal(migrations.TARGET_VERSION, '0.18.0-beta');
assert.equal(typeof migrations.migrateResearchPacket, 'function');
assert.ok(index.includes('src="src/research/migrations.js" defer'), 'migration module must load before research-engine');
assert.ok(engine.includes('migrateWorkflowPacketForImport'), 'import path must migrate before validation');
assert.ok(engine.includes('packet_migration_report'), 'engine must persist/export migration report');
assert.ok(schema.required.includes('packet_migration_report'), 'schema must require packet_migration_report');
assert.ok(schema.$defs.packet_migration_report, 'schema must define packet_migration_report');

const secretLike = /(sk-[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._~+/=-]{12,}|raw-token-should-redact|ya29.[A-Za-z0-9._-]{20,}|ghp_[A-Za-z0-9_]{16,})/i;
const fixtures = fs.readdirSync('fixtures/migrations').filter((name) => name.endsWith('.json')).sort();
assert.deepEqual(fixtures, [
  'v0.11.0-packet.json',
  'v0.12.0-packet.json',
  'v0.13.0-packet.json',
  'v0.14.0-packet.json',
  'v0.15.0-packet.json',
  'v0.16.0-packet.json',
  'v0.17.0-packet.json'
]);

for (const file of fixtures) {
  const input = JSON.parse(read(`fixtures/migrations/${file}`));
  const result = migrations.migrateResearchPacket(input, { targetVersion: '0.18.0-beta' });
  assert.equal(result.ok, true, `${file} should migrate`);
  assert.equal(result.packet.workflow_version, '0.18.0-beta', `${file} workflow version`);
  assert.equal(result.packet.research_plan.plan_version, '0.18.0-beta', `${file} plan version`);
  assert.equal(result.packet.privacy_export.key_exported, false, `${file} key export flag`);
  assert.equal(result.packet.privacy_export.raw_token_exported, false, `${file} token export flag`);
  assert.equal(result.packet.provider_config.allow_live, false, `${file} live calls disabled after migration`);
  assert.equal(result.packet.provider_config.remember_key, false, `${file} key memory disabled after migration`);
  assert.ok(result.packet.packet_migration_report, `${file} migration report exported`);
  assert.equal(result.packet.packet_migration_report.target_version, '0.18.0-beta', `${file} report target`);
  assert.equal(result.packet.packet_migration_report.import_safe, true, `${file} import_safe`);
  assert.equal(result.packet.evidence_matrix[0].evidence_id, 'E1', `${file} evidence renumbered`);
  assert.ok(result.packet.causal_links[0].evidence_ids.includes('E1'), `${file} causal links repaired to migrated evidence ids`);
  assert.equal(secretLike.test(JSON.stringify(result.packet)), false, `${file} migrated packet must not leak secret-shaped values`);
}

const unsafeLegacy = JSON.parse(read('fixtures/migrations/v0.11.0-packet.json'));
unsafeLegacy.provider_config.api_key = 'sk-testSECRETSECRETSECRET123456789';
const redacted = migrations.migrateResearchPacket(unsafeLegacy, { targetVersion: '0.18.0-beta' });
assert.ok(redacted.report.removed_sensitive_fields.some((field) => field.includes('provider_config')), 'v0.11 fixture should redact legacy provider secret');
assert.equal(redacted.packet.privacy_export.redaction_applied, true, 'migration privacy report should record redaction');

console.log('Migration checks passed.');
