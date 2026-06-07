import fs from 'node:fs';

const fail = (message) => {
  console.error(`Schema check failed: ${message}`);
  process.exit(1);
};

const schema = JSON.parse(fs.readFileSync('schema/strategic-analysis.schema.json', 'utf8'));
const requiredTop = ['schema_version', 'subject', 'interests', 'actors', 'tools', 'narrative', 'results', 'feedback', 'contradictions', 'scenarios'];
const arraySections = ['interests', 'actors', 'tools', 'narrative', 'results', 'feedback'];
const resolveRequired = (items) => {
  const refName = items?.$ref?.split('/').pop();
  const def = refName ? schema.$defs?.[refName] : items;
  return def?.allOf?.[1]?.required || def?.required || [];
};

if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') fail('schema must declare JSON Schema draft 2020-12');
for (const key of requiredTop) {
  if (!schema.required?.includes(key)) fail(`schema missing required key: ${key}`);
  if (!schema.properties?.[key]) fail(`schema missing property declaration: ${key}`);
}
for (const section of arraySections) {
  const prop = schema.properties[section];
  if (prop.type !== 'array') fail(`${section} must be declared as array`);
  if (!prop.minItems || prop.minItems < 1) fail(`${section} must require at least one item`);
  const required = resolveRequired(prop.items);
  if (!required.includes('id')) fail(`${section} items must require id`);
}
const evidenceRequired = resolveRequired(schema.properties.evidence?.properties?.items?.items);
const scenarioRequired = resolveRequired(schema.properties.scenarios?.properties?.items?.items);
if (!evidenceRequired.includes('counter_evidence')) fail('evidence items must require counter_evidence');
if (!scenarioRequired.includes('disproven_if')) fail('scenario items must require disproven_if');
if (!schema.properties.links) fail('schema should keep causal links available');

const files = fs.readdirSync('fixtures').filter((name) => name.endsWith('.json'));
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(`fixtures/${file}`, 'utf8'));
  for (const key of requiredTop) if (!(key in data)) fail(`${file}: missing ${key}`);
  for (const section of arraySections) {
    if (!Array.isArray(data[section]) || data[section].length < 1) fail(`${file}: ${section} must have at least one item`);
    for (const [idx, item] of data[section].entries()) {
      if (!item.id) fail(`${file}: ${section}[${idx}] missing id`);
    }
  }
  const scenarios = data.scenarios?.items || [];
  if (!scenarios.every((item) => Array.isArray(item.disproven_if) && item.disproven_if.length)) fail(`${file}: each scenario needs disproven_if`);
  const evidence = data.evidence?.items || [];
  if (!evidence.some((item) => item.basis === 'source_based')) fail(`${file}: needs source_based evidence`);
  if (!evidence.some((item) => typeof item.counter_evidence === 'string' && item.counter_evidence.trim())) fail(`${file}: needs counter_evidence`);
}

console.log('Schema checks passed.');
process.exit(0);
