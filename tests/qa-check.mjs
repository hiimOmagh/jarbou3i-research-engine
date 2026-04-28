import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`QA check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const index = read('index.html');
const app = read('src/app.js');
const css = read('src/styles.css');
const manifest = JSON.parse(read('manifest.webmanifest'));
const pkg = JSON.parse(read('package.json'));
const schema = JSON.parse(read('schema/strategic-analysis.schema.json'));

try { new vm.Script(app, { filename: 'src/app.js' }); } catch (error) { fail(`JavaScript syntax error: ${error.message}`); }
const ids = [...index.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate DOM ids found in index.html');
for (const token of ['id="exportJson"','id="exportMd"','id="printBtn"','id="selfCheckBtn"','function markdown(','function selfCheckResults(','function runSelfCheck(','function playwrightSnippet(','window.StrategicWorkbenchSelfCheck','assets/jarbou3i-mascot.png"','v1.1.2','v1.1.1']) {
  if ((index + app + css).includes(token)) fail(`forbidden legacy token remains: ${token}`);
}
for (const file of ['src/app.js','src/styles.css','assets/favicon-32.png','assets/apple-touch-icon.png','assets/jarbou3i-mascot-192.png','assets/jarbou3i-mascot-512.png','schema/strategic-analysis.schema.json']) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
}
for (const asset of ['assets/jarbou3i-mascot-192.png','assets/jarbou3i-mascot-512.png']) {
  const size = fs.statSync(asset).size;
  if (size > 600 * 1024) fail(`${asset} is too large for runtime use: ${size} bytes`);
}
if (index.length > 50000) fail(`index.html is too large after modularization: ${index.length} bytes`);
if (!index.includes('href="src/styles.css"')) fail('external stylesheet link missing');
if (!index.includes('src="src/app.js" defer')) fail('deferred app script missing');
if (/<style>[\s\S]*<\/style>/.test(index)) fail('index.html still contains inline stylesheet');
if (/<script>[\s\S]*<\/script>/.test(index)) fail('index.html still contains inline script');
if (!manifest.icons?.some((icon) => icon.sizes === '192x192')) fail('manifest lacks 192x192 icon');
if (!manifest.icons?.some((icon) => icon.sizes === '512x512')) fail('manifest lacks 512x512 icon');
if (!app.includes('SETTINGS_KEY')) fail('settings persistence is missing');
if (!app.includes('schema_version')) fail('schema_version support is missing');
if (!app.includes('modeResearch')) fail('research prompt mode is missing');
if (!app.includes('qualityGateHtml')) fail('quality gate UI is missing');
if (!app.includes('actorPowerScore')) fail('computed API scoring is missing');
if (pkg.version !== '1.2.0') fail('package version must be 1.2.0');
if (!index.includes('name="app-version" content="1.2.0"')) fail('app version metadata missing');

const requiredTop = ['schema_version','subject','interests','actors','tools','narrative','results','feedback','contradictions','scenarios'];
const arraySections = ['interests','actors','tools','narrative','results','feedback'];
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
  if (!resolveRequired(prop.items).includes('id')) fail(`${section} items must require id`);
}
if (!resolveRequired(schema.properties.evidence?.properties?.items?.items).includes('counter_evidence')) fail('evidence items must require counter_evidence');
if (!resolveRequired(schema.properties.scenarios?.properties?.items?.items).includes('disproven_if')) fail('scenario items must require disproven_if');

const files = fs.readdirSync('fixtures').filter((name) => name.endsWith('.json'));
if (!files.length) fail('no JSON fixtures found');
for (const file of files) {
  const data = JSON.parse(read(`fixtures/${file}`));
  for (const key of requiredTop) if (!(key in data)) fail(`${file}: missing ${key}`);
  for (const section of arraySections) {
    if (!Array.isArray(data[section]) || data[section].length < 1) fail(`${file}: ${section} must have at least one item`);
    data[section].forEach((item, idx) => { if (!item.id) fail(`${file}: ${section}[${idx}] missing id`); });
  }
  const scenarios = data.scenarios?.items || [];
  if (!scenarios.every((item) => Array.isArray(item.disproven_if) && item.disproven_if.length)) fail(`${file}: each scenario needs disproven_if`);
  const evidence = data.evidence?.items || [];
  if (!evidence.some((item) => item.basis === 'source_based')) fail(`${file}: needs source_based evidence`);
  if (!evidence.some((item) => typeof item.counter_evidence === 'string' && item.counter_evidence.trim())) fail(`${file}: needs counter_evidence`);
}

if (!/<html[^>]+lang="ar"[^>]+dir="rtl"/.test(index)) fail('root html must define initial lang and dir');
if (!index.includes('name="viewport"')) fail('viewport meta tag missing');
if (!index.includes('aria-live="polite"')) fail('aria-live region missing');
if (!index.includes('role="dialog"')) fail('modal dialog role missing');
if (!index.includes('aria-modal="true"')) fail('modal aria-modal missing');
if (!index.includes('aria-labelledby="modalTitle"')) fail('modal labelling missing');
if (!index.includes('role="tablist"')) fail('tablist role missing');
if (!app.includes('role="tab"')) fail('runtime tabs must use role tab');
if (!app.includes('aria-selected')) fail('runtime tabs must set aria-selected');
if (!app.includes('aria-current="step"')) fail('current stage marker missing');
for (const tag of [...(index + app).matchAll(/<img\b[^>]*>/g)].map((m) => m[0])) {
  if (!/\balt="[^"]*"/.test(tag)) fail(`image without alt attribute: ${tag}`);
}
for (const tag of [...(index + app).matchAll(/<button\b[^>]*>/g)].map((m) => m[0])) {
  if (!/\btype="button"/.test(tag)) fail(`button without explicit type=button: ${tag}`);
}
if (!/\.srOnly/.test(css)) fail('screen-reader utility class missing');
if (!/:focus-visible/.test(css)) fail('focus-visible styling missing');

console.log('QA checks passed.');
process.exit(0);
