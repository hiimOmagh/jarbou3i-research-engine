import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const moduleSource = fs.readFileSync('src/research/portable-oauth-spike.js', 'utf8');
const workerSource = fs.readFileSync('backend/cloudflare-worker.js', 'utf8');
const appSource = fs.readFileSync('src/research-engine.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));

for (const token of ['generatePkcePair','buildAuthorizationRequest','parseCallbackUrl','buildTokenExchangePayload','exportableSpikeStatus','code_verifier_exported']) {
  assert.ok(moduleSource.includes(token), `portable OAuth spike module missing ${token}`);
}
for (const token of ['/api/oauth/token-exchange','oauth_token_exchange_failed','oauth_refresh_requires_token_vault','token_response_sanitized']) {
  assert.ok(workerSource.includes(token), `worker missing OAuth token: ${token}`);
}
for (const token of ['portable-oauth-spike.js','buildPortableOAuthUrlBtn','completePortableOAuthCallbackBtn','oauthAuthorizationEndpoint','oauthCallbackUrl']) {
  assert.ok(index.includes(token), `index missing OAuth spike UI token: ${token}`);
}
assert.ok(appSource.includes('portable_oauth_spike'), 'research packet must include portable_oauth_spike');
assert.ok(appSource.includes('sessionStorage'), 'OAuth runtime verifier must stay in sessionStorage, not export packet state');
assert.ok(schema.required.includes('portable_oauth_spike'), 'schema must require portable_oauth_spike metadata');
assert.equal(schema.$defs.portable_oauth_spike.properties.code_verifier_exported.const, false);
assert.equal(fixture.portable_oauth_spike.oauth_spike_version, '0.28.0-beta');
assert.equal(fixture.portable_oauth_spike.raw_token_exported, false);
assert.equal(fixture.portable_oauth_spike.access_token_exported, false);
assert.equal(fixture.portable_oauth_spike.refresh_token_exported, false);
assert.equal(fixture.portable_oauth_spike.code_verifier_exported, false);

const context = { console, TextEncoder, Buffer, crypto: globalThis.crypto, URL, window: {} };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(moduleSource, context, { filename:'src/research/portable-oauth-spike.js' });
const oauth = context.window.Jarbou3iResearchModules.portableOAuthSpike;
assert.equal(oauth.VERSION, '0.28.0-beta');
const pair = await oauth.generatePkcePair({ code_verifier:'A'.repeat(64) });
assert.equal(pair.method, 'S256');
assert.equal(pair.code_verifier.length, 64);
assert.equal(pair.code_challenge.length >= 43, true);
assert.equal(pair.code_challenge.includes('='), false);
const config = { authorization_endpoint:'https://oauth.example/authorize', token_endpoint:'https://oauth.example/token', client_id:'client-dev', redirect_uri:'http://localhost:4173/oauth/callback', scopes:['openid','profile','inference:chat'] };
const auth = await oauth.buildAuthorizationRequest(config, { code_verifier:'B'.repeat(64), state:'state123', nonce:'nonce123' });
assert.equal(auth.exportable.code_verifier_exported, false);
assert.equal(auth.exportable.raw_token_exported, false);
assert.ok(auth.authorization_url.includes('code_challenge_method=S256'));
assert.ok(!JSON.stringify(auth.exportable).includes('B'.repeat(64)), 'exportable request leaked code_verifier');
const callback = oauth.parseCallbackUrl('http://localhost:4173/oauth/callback?code=CODE-123&state=state123', 'state123');
assert.equal(callback.code_present, true);
assert.equal(callback.state_matches, true);
const payload = oauth.buildTokenExchangePayload(config, auth.runtime_secret, callback);
assert.equal(payload.code, 'CODE-123');
assert.equal(payload.code_verifier, 'B'.repeat(64));
const status = oauth.sanitizedConnectedStatus({ access_token:'ACCESS_TOKEN_SECRET_1234567890', refresh_token:'REFRESH_TOKEN_SECRET_1234567890', expires_in:600, scope:'openid profile' }, config);
const exported = oauth.exportableSpikeStatus(status);
assert.equal(exported.access_token_exported, false);
assert.equal(exported.refresh_token_exported, false);
assert.equal(exported.code_verifier_exported, false);
assert.ok(!JSON.stringify(exported).includes('ACCESS_TOKEN_SECRET'));
assert.ok(!JSON.stringify(exported).includes('REFRESH_TOKEN_SECRET'));
assert.equal(oauth.disconnectStatus().token_present, false);

const workerUrl = pathToFileURL(path.resolve('backend/cloudflare-worker.js')).href;
const worker = (await import(workerUrl + `?oauth=${Date.now()}`)).default;
const originalFetch = globalThis.fetch;
let upstreamBody = '';
globalThis.fetch = async (url, options = {}) => {
  upstreamBody = String(options.body || '');
  assert.equal(String(url), 'https://oauth.example/token');
  return new Response(JSON.stringify({ access_token:'LIVE_ACCESS_TOKEN_SHOULD_NOT_LEAK_1234567890', refresh_token:'LIVE_REFRESH_TOKEN_SHOULD_NOT_LEAK_1234567890', expires_in:3600, scope:'openid profile inference:chat', account_id:'acct_123', email:'user@example.test' }), { status:200, headers:{'content-type':'application/json'} });
};
let response;
try {
  response = await worker.fetch(new Request('https://worker.local/api/oauth/token-exchange', { method:'POST', headers:{'content-type':'application/json', Origin:'https://example.pages.dev'}, body:JSON.stringify(payload) }), { ALLOWED_ORIGINS:'https://example.pages.dev', OAUTH_ALLOWED_TOKEN_ENDPOINTS:'https://oauth.example/token', OAUTH_TIMEOUT_MS:'5000' });
} finally { globalThis.fetch = originalFetch; }
const body = await response.json();
assert.equal(response.status, 200);
assert.equal(body.ok, true);
assert.equal(body.proxy_version, '0.28.0-beta');
assert.equal(body.portable_account.status, 'connected_oauth_dev');
assert.equal(body.portable_account.raw_token_exported, false);
assert.equal(body.portable_account.access_token_exported, false);
assert.equal(body.portable_account.refresh_token_exported, false);
assert.equal(body.safety.token_response_sanitized, true);
assert.ok(upstreamBody.includes('code_verifier='), 'upstream token exchange must receive PKCE verifier');
const responseText = JSON.stringify(body);
assert.ok(!responseText.includes('LIVE_ACCESS_TOKEN_SHOULD_NOT_LEAK'));
assert.ok(!responseText.includes('LIVE_REFRESH_TOKEN_SHOULD_NOT_LEAK'));
assert.ok(!responseText.includes('B'.repeat(64)), 'worker response leaked code_verifier');
const refresh = await worker.fetch(new Request('https://worker.local/api/oauth/refresh', { method:'POST', headers:{Origin:'https://example.pages.dev'} }), { ALLOWED_ORIGINS:'https://example.pages.dev' });
const refreshBody = await refresh.json();
assert.equal(refresh.status, 409);
assert.equal(refreshBody.error_code, 'oauth_refresh_requires_token_vault');

console.log('Portable OAuth/PKCE spike checks passed.');
process.exit(0);
