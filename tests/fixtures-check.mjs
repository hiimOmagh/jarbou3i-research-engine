import fs from 'node:fs';

const fail = (message) => {
  console.error(`Fixture check failed: ${message}`);
  process.exit(1);
};

const requiredTop = ['schema_version', 'subject', 'interests', 'actors', 'tools', 'narrative', 'results', 'feedback', 'contradictions', 'scenarios'];
const pillarKeys = ['interests', 'actors', 'tools', 'narrative', 'results', 'feedback'];
const files = fs.readdirSync('fixtures').filter((name) => name.endsWith('.json'));
if (!files.length) fail('no JSON fixtures found');

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(`fixtures/${file}`, 'utf8'));
  for (const key of requiredTop) if (!(key in data)) fail(`${file}: missing ${key}`);
  if (data.schema_version !== '1.1.0') fail(`${file}: schema_version must be 1.1.0`);
  for (const key of pillarKeys) {
    if (!Array.isArray(data[key]) || data[key].length === 0) fail(`${file}: ${key} must contain at least one item`);
    data[key].forEach((item, idx) => {
      if (!item.id) fail(`${file}: ${key}[${idx}] missing id`);
    });
  }
  const scenarios = data.scenarios?.items || [];
  if (!scenarios.length) fail(`${file}: missing scenarios`);
  scenarios.forEach((item, idx) => {
    if (!Array.isArray(item.disproven_if) || !item.disproven_if.length) fail(`${file}: scenario[${idx}] missing disproven_if`);
  });
  const evidence = data.evidence?.items || [];
  if (!evidence.length) fail(`${file}: missing evidence`);
  if (!evidence.some((item) => item.basis === 'source_based')) fail(`${file}: needs at least one source_based evidence item`);
  if (!evidence.some((item) => typeof item.counter_evidence === 'string' && item.counter_evidence.trim())) fail(`${file}: needs counter_evidence`);
}

console.log('Fixture checks passed.');

process.exit(0);
