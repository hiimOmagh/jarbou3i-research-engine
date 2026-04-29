import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('src/research/quality-gate.js', 'utf8');
new vm.Script(source, { filename: 'src/research/quality-gate.js' });
const context = { console, window: {} };
context.globalThis = context;
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'src/research/quality-gate.js' });
const gate = context.Jarbou3iResearchModules.qualityGate;

assert.equal(gate.QUALITY_GATE_VERSION, '0.27.0-beta');
assert.equal(typeof gate.calculateQualityGateV3Report, 'function');
assert.equal(typeof gate.calculateQualityScores, 'function');

const strongState = {
  plan: { counter_evidence_targets: ['counter'], questions: ['q1', 'q2', 'q3'] },
  evidence: [
    { evidence_id: 'E1', claim: 'i', source_url: 'https://a.example', source_date: '2026-01-01', source_type: 'official', evidence_strength: 5, supports: ['I1'], contradicts: ['N1'] },
    { evidence_id: 'E2', claim: 'a', source_url: 'https://b.example', source_date: '2026-01-02', source_type: 'academic', evidence_strength: 4, supports: ['A1'], contradicts: [] },
    { evidence_id: 'E3', claim: 't', source_url: 'https://c.example', source_date: '2026-01-03', source_type: 'news', evidence_strength: 4, supports: ['T1'], contradicts: [] },
    { evidence_id: 'E4', claim: 'n', source_url: 'https://d.example', source_date: '2026-01-04', source_type: 'expert', evidence_strength: 4, supports: ['R1'], contradicts: [] },
    { evidence_id: 'E5', claim: 'f', source_url: 'https://e.example', source_date: '2026-01-05', source_type: 'dataset', evidence_strength: 5, supports: ['F1'], contradicts: [] }
  ],
  causal_links: [
    { from: 'I1', to: 'A1', evidence_ids: ['E1'] },
    { from: 'A1', to: 'T1', evidence_ids: ['E2'] },
    { from: 'T1', to: 'R1', evidence_ids: ['E3'] },
    { from: 'R1', to: 'F1', evidence_ids: ['E4'] }
  ],
  analysis_brief: { source_clusters: [{ type: 'official' }], gaps: [] },
  critique: { findings: [{ type: 'counter_evidence_gap' }] },
  ai_runs: [{ status: 'ok', task: 'synthesis', response_validation: { accepted: true } }],
  provider_fixture_report: { pass_count: 3, fixture_count: 3 },
  source_policy: { live_fetching_enabled: false, verdict: 'safe_planning_layer_only' },
  source_fixture_report: { pass_count: 3, fixture_count: 3 },
  analysis_template_id: 'strategic_analysis_engine',
  analysis_template: { template_id: 'strategic_analysis_engine' },
  privacy_export: { safe: true, release_gate: 'pass', raw_token_exported: false, access_token_exported: false, refresh_token_exported: false, post_redaction_issue_count: 0 },
  packet_migration_report: { ok: true, import_safe: true, target_version: '0.27.0-beta', removed_sensitive_fields: [] },
  last_source_request: { task: 'source_plan' }
};
const deps = {
  evidenceReviewReport: () => ({ queue_count: 2, resolved_count: 2, accepted_count: 2 }),
  providerSafetyReport: () => ({ provider: 'mock', key_exported: false, auth_type: 'none', billing_owner: 'none', provider_identity: { provider_id: 'mock', live_blockers: [] } })
};
const report = gate.calculateQualityGateV3Report(strongState, deps);
assert.equal(report.quality_gate_version, '0.27.0-beta');
assert.equal(report.gate_name, 'Advanced Quality Gate v3');
assert.ok(report.overall_score >= 70, `expected strong packet score >=70, got ${report.overall_score}`);
assert.ok(['research_ready', 'publication_candidate'].includes(report.publication_readiness));
for (const key of ['completeness', 'evidence_strength', 'contradiction_coverage', 'source_diversity', 'actor_layer_coverage', 'causal_link_density', 'provider_safety', 'privacy_safety', 'migration_safety', 'template_fit']) {
  assert.equal(typeof report.dimensions[key], 'number', `missing dimension ${key}`);
}
assert.ok(report.weakest_dimensions.length >= 1, 'weakest dimensions required');
assert.ok(report.fix_actions.length >= 1, 'fix actions required');

const weakReport = gate.calculateQualityGateV3Report({ evidence: [], causal_links: [], ai_runs: [], privacy_export: { raw_token_exported: true } }, deps);
assert.equal(weakReport.publication_readiness, 'blocked');
assert.ok(weakReport.blockers.includes('raw_token_export_risk'));

const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
assert.ok(schema.required.includes('quality_gate'), 'workflow schema must require quality_gate');
assert.equal(schema.properties.quality_gate.properties.quality_gate_version.const, '0.27.0-beta');

const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));
assert.equal(fixture.quality_gate.quality_gate_version, '0.27.0-beta');
assert.equal(fixture.analysis_brief.quality_gate_report.quality_gate_version, '0.27.0-beta');
assert.ok(Array.isArray(fixture.quality_gate.fix_actions));

console.log('Advanced Quality Gate v3 checks passed.');
process.exit(0);
