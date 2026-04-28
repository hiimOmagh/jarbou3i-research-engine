import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => { console.error(`Provider identity check failed: ${message}`); process.exit(1); };
const code = fs.readFileSync('src/research/provider-identity.js','utf8');
const context = { window: { Jarbou3iResearchModules: {} } };
vm.createContext(context);
try { vm.runInContext(code, context, {filename:'src/research/provider-identity.js'}); } catch(error) { fail(`module execution failed: ${error.message}`); }
const mod = context.window.Jarbou3iResearchModules.providerIdentity;
if(!mod) fail('providerIdentity module not registered');
const providers = ['mock','openai_compatible','backend_proxy','portable_oauth'];
for (const provider of providers) {
  const identity = mod.providerIdentity(provider, {endpoint:'x', model:'m', allow_live: provider !== 'mock', remember_key: provider === 'openai_compatible'}, {key_present: provider === 'openai_compatible'});
  const billing = mod.billingPolicy(provider, {endpoint:'x', model:'m', allow_live: true}, {key_present: provider === 'openai_compatible'});
  if(identity.provider_id !== provider) fail(`${provider}: provider_id mismatch`);
  if(identity.key_exported !== false) fail(`${provider}: key_exported must be false`);
  if(!identity.auth_type || !identity.billing_owner || !identity.key_exposure) fail(`${provider}: missing identity metadata`);
  if(billing.provider_id !== provider) fail(`${provider}: billing provider_id mismatch`);
  if(!Array.isArray(billing.notes) || !billing.notes.length) fail(`${provider}: billing notes missing`);
}
const portable = mod.providerIdentity('portable_oauth', {allow_live:true}, {token_present:false});
if(portable.auth_type !== 'oauth_pkce') fail('portable_oauth must use oauth_pkce auth_type');
if(portable.billing_owner !== 'portable_account') fail('portable_oauth must declare portable_account billing owner');
if(!portable.live_blockers.includes('portable_oauth_live_integration_not_implemented')) fail('portable_oauth live blocker missing');
const summary = mod.registrySummary();
if(summary.length < 4 || !summary.some(item => item.provider_id === 'portable_oauth')) fail('registry summary missing portable_oauth');
console.log('Provider identity checks passed.');
