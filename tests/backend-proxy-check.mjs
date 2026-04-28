import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Backend proxy check failed: ${message}`);
  process.exit(1);
};

const required = [
  'backend/cloudflare-worker.js',
  'backend/README.md',
  'backend/.dev.vars.example',
  'backend/fixtures/mock-upstream-chat-completion.json',
  'docs/backend-production-checklist.md',
  'wrangler.toml',
  'src/research/backend-proxy-provider.js',
  'tests/backend-worker-smoke.mjs'
];
for (const file of required) {
  if (!fs.existsSync(file)) fail(`missing required backend proxy file: ${file}`);
}

try { new vm.Script(fs.readFileSync('src/research/backend-proxy-provider.js', 'utf8'), { filename: 'src/research/backend-proxy-provider.js' }); }
catch (error) { fail(`src/research/backend-proxy-provider.js syntax error: ${error.message}`); }
if (!fs.readFileSync('backend/cloudflare-worker.js', 'utf8').includes('export default')) fail('worker must use Cloudflare module-worker export default syntax');

const worker = fs.readFileSync('backend/cloudflare-worker.js', 'utf8');
const provider = fs.readFileSync('src/research/backend-proxy-provider.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const engine = fs.readFileSync('src/research-engine.js', 'utf8');
const readme = fs.readFileSync('backend/README.md', 'utf8');
const checklist = fs.readFileSync('docs/backend-production-checklist.md', 'utf8');
const smoke = fs.readFileSync('tests/backend-worker-smoke.mjs', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

for (const token of [
  'OPENAI_API_KEY',
  '/api/provider-task',
  '/api/source-task',
  '/api/health',
  'MAX_PROMPT_CHARS',
  'MAX_BODY_BYTES',
  'ALLOWED_ORIGINS',
  'payload_secret_fields_stripped',
  'api_key_exposed: false',
  'invalid_task',
  'prompt_too_large',
  'upstream_fetch_failed'
]) {
  if (!worker.includes(token)) fail(`worker missing token: ${token}`);
}
if (!worker.includes('structuredClone')) fail('worker must strip secret fields from payload clone');
if (!provider.includes('backendProxyProvider')) fail('browser backend proxy adapter missing namespace');
if (!provider.includes('/api/provider-task')) fail('browser backend proxy adapter missing default endpoint');
if (!index.includes('<option value="backend_proxy">Hosted backend proxy</option>')) fail('provider dropdown missing backend proxy option');
if (!index.includes('src="src/research/backend-proxy-provider.js" defer')) fail('backend proxy adapter not loaded by index');
if (!engine.includes('callBackendProxyProvider')) fail('research engine missing backend proxy call path');
if (!engine.includes('hosted_proxy_user_opt_in')) fail('research engine missing hosted proxy privacy mode');
if (!engine.includes('server_environment_secret')) fail('research engine missing server secret safety label');
if (!pkg.scripts?.['test:backend']) fail('package missing test:backend script');
if (!pkg.scripts?.['test:backend:worker']) fail('package missing test:backend:worker script');
if (!pkg.scripts['test:backend'].includes('backend-worker-smoke')) fail('test:backend must include Worker smoke test');
for (const token of ['GET  /api/health', 'POST /api/provider-task', 'POST /api/source-task', 'npm run test:backend:worker', 'payload_secret_fields_stripped']) {
  if (!readme.includes(token)) fail(`backend README missing token: ${token}`);
}
for (const token of ['OPENAI_API_KEY', 'ALLOWED_ORIGINS', 'npm run test:backend', 'Do not ship if']) {
  if (!checklist.includes(token)) fail(`production checklist missing token: ${token}`);
}
for (const token of ['missing_OPENAI_API_KEY_secret', 'invalid_task', 'invalid_source_task', 'prompt_too_large', 'SHOULD_NOT_LEAVE_BROWSER', 'api_key_exposed', 'mock-upstream']) {
  if (!smoke.includes(token)) fail(`Worker smoke test missing token: ${token}`);
}

console.log('Backend proxy checks passed.');
process.exit(0);
