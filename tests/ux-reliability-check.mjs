import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`UX reliability check failed: ${message}`);
  process.exit(1);
};

const source = fs.readFileSync('src/research/ux-reliability.js', 'utf8');
const context = { window: {}, globalThis: {}, module: { exports: {} } };
context.window = context;
context.globalThis = context;
vm.createContext(context);
try { vm.runInContext(source, context, { filename: 'src/research/ux-reliability.js' }); }
catch (error) { fail(`syntax/runtime error: ${error.message}`); }

const ux = context.Jarbou3iResearchModules?.uxReliability || context.module.exports;
if (!ux) fail('uxReliability module not exported');
if (ux.VERSION !== '1.0.6') fail('unexpected UX reliability version');

const packet = {
  workflow_version: '1.0.6',
  research_plan: { topic: 'Test topic' },
  evidence_matrix: [{ evidence_id: 'E1' }, { evidence_id: 'E2' }],
  causal_links: [{ from: 'I1', to: 'A1', evidence_ids: ['E1'] }],
  evidence_review_queue: [{ status: 'pending' }, { status: 'accepted' }],
  ai_runs: [{ run_id: 'R1' }],
  source_imports: [{}],
  privacy_export: { release_gate: 'pass' }
};
const summary = ux.workflowSummary(packet);
if (summary.evidence_count !== 2) fail('summary evidence count incorrect');
if (summary.pending_review_count !== 1) fail('summary pending review count incorrect');
if (!ux.exportConfirmationText(packet).includes('Privacy gate: pass')) fail('export confirmation summary missing privacy gate');
if (!ux.hasMeaningfulWorkflowState({ evidence: [{}], causal_links: [], ai_runs: [] })) fail('meaningful workflow state not detected');
if (!ux.emptyStateHtml('Empty', 'Body', 'Action').includes('emptyState')) fail('empty state HTML missing class');
if (!ux.providerModeGuideHtml('backend_proxy').includes('Hosted backend proxy')) fail('provider mode guide missing backend row');

console.log('UX reliability checks passed.');
process.exit(0);
