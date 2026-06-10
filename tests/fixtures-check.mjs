import fs from 'node:fs';

const fail = (message) => {
  console.error(`Fixture check failed: ${message}`);
  process.exit(1);
};

const requiredTop = ['schema_version', 'subject', 'interests', 'actors', 'tools', 'narrative', 'results', 'feedback', 'contradictions', 'scenarios'];
const pillarKeys = ['interests', 'actors', 'tools', 'narrative', 'results', 'feedback'];
const systemAxes = ['human', 'society', 'state', 'market', 'corporate', 'geopolitical', 'technology', 'behavioral_engineering'];
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

  if (file === 'sample-analysis-bio-en.json' || (data.analysis_lens === 'biopolitical' && Array.isArray(data.systems?.items))) {
    const systems = data.systems?.items || [];
    if (!Array.isArray(systems) || systems.length < systemAxes.length) fail(`${file}: biopolitical systems fixture must contain systems.items with all 8 axes`);
    const axes = new Set(systems.map((item) => item.axis));
    for (const axis of systemAxes) if (!axes.has(axis)) fail(`${file}: missing systems axis ${axis}`);
    systems.forEach((item, idx) => {
      for (const key of ['id', 'axis', 'actor', 'mechanism', 'incentive', 'norm', 'outcome', 'resistance', 'power_shift']) {
        if (typeof item[key] !== 'string' || !item[key].trim()) fail(`${file}: systems.items[${idx}] missing ${key}`);
      }
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
