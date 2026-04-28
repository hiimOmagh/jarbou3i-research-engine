import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Backend proxy check failed: ${message}`);
  process.exit(1);
};

const required = [
  'backend/cloudflare-worker.js',
  'backend/README.md',
  'wrangler.toml',
  'src/research/backend-proxy-provider.js'
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
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

for (const token of [
  'OPENAI_API_KEY',
  '/api/provider-task',
  '/api/health',
  'MAX_PROMPT_CHARS',
  'ALLOWED_ORIGINS',
  'payload_secret_fields_stripped',
  'api_key_exposed: false'
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

console.log('Backend proxy checks passed.');
process.exit(0);
