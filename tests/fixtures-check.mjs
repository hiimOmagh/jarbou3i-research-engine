import fs from 'node:fs';

const fail = (message) => {
  console.error(`Fixture check failed: ${message}`);
  process.exit(1);
};

const requiredTop = ['schema_version', 'subject', 'interests', 'actors', 'tools', 'narrative', 'results', 'feedback', 'contradictions', 'scenarios'];
const pillarKeys = ['interests', 'actors', 'tools', 'narrative', 'results', 'feedback'];
const systemAxes = ['human', 'society', 'state', 'market', 'corporate', 'geopolitical', 'technology', 'behavioral_engineering'];
const thinReplayFixtures = new Set(['sample-analysis-bio-thin-en.json']);
const criticalSystemFields = ['incentive', 'mechanism', 'resistance', 'power_shift'];

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

  const systems = data.systems?.items || [];
  const isBiopoliticalSystemsFixture = file === 'sample-analysis-bio-en.json' || (data.analysis_lens === 'biopolitical' && Array.isArray(data.systems?.items));
  const isThinReplayFixture = thinReplayFixtures.has(file);

  if (isBiopoliticalSystemsFixture && !isThinReplayFixture) {
    if (!Array.isArray(systems) || systems.length < systemAxes.length) fail(`${file}: biopolitical systems fixture must contain systems.items with all 8 axes`);
    const axes = new Set(systems.map((item) => item.axis));
    for (const axis of systemAxes) if (!axes.has(axis)) fail(`${file}: missing systems axis ${axis}`);
    systems.forEach((item, idx) => {
      for (const key of ['id', 'axis', 'actor', 'mechanism', 'incentive', 'norm', 'outcome', 'resistance', 'power_shift']) {
        if (typeof item[key] !== 'string' || !item[key].trim()) fail(`${file}: systems.items[${idx}] missing ${key}`);
      }
    });
  }

  if (isThinReplayFixture) {
    if (data.analysis_lens !== 'biopolitical') fail(`${file}: thin replay fixture must be biopolitical`);
    if (!Array.isArray(systems) || !systems.length) fail(`${file}: thin replay fixture must contain partial systems.items`);
    const axes = new Set(systems.map((item) => item.axis));
    if (axes.size >= systemAxes.length) fail(`${file}: thin replay fixture must remain incomplete to exercise diagnostics`);
    const hasMissingCriticalField = systems.some((item) => criticalSystemFields.some((key) => typeof item[key] !== 'string' || !item[key].trim()));
    if (!hasMissingCriticalField) fail(`${file}: thin replay fixture must omit critical systems fields to exercise warnings`);
    if (!systems.some((item) => item.axis === 'technology')) fail(`${file}: thin replay fixture must include a partial technology axis`);
    if (!systems.some((item) => item.axis === 'behavioral_engineering')) fail(`${file}: thin replay fixture must include a partial behavioral_engineering axis`);
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
