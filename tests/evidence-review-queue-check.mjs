import fs from 'node:fs';

const fail = (message) => {
  console.error(`Evidence review queue check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const index = read('index.html');
const researchApp = read('src/research-engine.js');
const schema = JSON.parse(read('schema/research-workflow.schema.json'));
const fixture = JSON.parse(read('fixtures/research/sample-research-workflow-en.json'));

for (const id of [
  'evidenceReviewOutput',
  'acceptAllReviewEvidenceBtn',
  'acceptEditedReviewEvidenceBtn',
  'exportEvidenceReviewQueueBtn',
  'clearResolvedReviewEvidenceBtn'
]) {
  if (!index.includes(`id="${id}"`)) fail(`review queue UI missing ${id}`);
}
for (const token of [
  'evidence_review_queue',
  'evidenceReviewReport',
  'queueImportedEvidence',
  'promoteReviewItem',
  'rejectReviewItem',
  'renderEvidenceReviewQueue',
  'evidenceReviewScore'
]) {
  if (!researchApp.includes(token)) fail(`research app missing token: ${token}`);
}
if (!schema.required.includes('evidence_review_queue')) fail('schema must require evidence_review_queue');
if (!schema.required.includes('evidence_review_report')) fail('schema must require evidence_review_report');
if (!schema.$defs.evidence_review_item) fail('schema missing evidence_review_item definition');
if (!schema.$defs.evidence_review_report) fail('schema missing evidence_review_report definition');
if (schema.$defs.evidence_review_report.properties.live_fetching_performed.const !== false) fail('review report must force live_fetching_performed=false');
if (schema.$defs.evidence_review_report.properties.verification_claimed.const !== false) fail('review report must force verification_claimed=false');
if (fixture.workflow_version !== '1.0.0') fail('fixture version mismatch');
if (!Array.isArray(fixture.evidence_review_queue) || fixture.evidence_review_queue.length < 2) fail('fixture needs review queue entries');
if (!fixture.evidence_review_queue.some((item) => item.status === 'pending')) fail('fixture should include pending candidate');
if (!fixture.evidence_review_queue.some((item) => item.status === 'accepted')) fail('fixture should include accepted candidate');
if (!fixture.evidence_review_report || fixture.evidence_review_report.review_version !== '1.0.0') fail('fixture review report missing');
if (fixture.evidence_review_report.live_fetching_performed !== false) fail('fixture review report must not fetch');
if (fixture.evidence_review_report.verification_claimed !== false) fail('fixture review report must not claim verification');
if (!fixture.source_imports?.some((item) => item.queue_only === true && Array.isArray(item.review_ids))) fail('source import fixture must route through queue');
console.log('Evidence review queue checks passed.');
process.exit(0);
