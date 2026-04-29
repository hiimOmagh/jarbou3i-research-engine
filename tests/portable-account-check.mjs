import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => { console.error(`Portable account check failed: ${message}`); process.exit(1); };
const code = fs.readFileSync('src/research/portable-account-mock.js', 'utf8');
const context = { window: { Jarbou3iResearchModules: {} }, Date };
vm.createContext(context);
try { vm.runInContext(code, context, { filename: 'src/research/portable-account-mock.js' }); } catch (error) { fail(`module execution failed: ${error.message}`); }
const mod = context.window.Jarbou3iResearchModules.portableAccountMock;
if(!mod) fail('portableAccountMock module not registered');
const disconnected = mod.disconnected('1.0.0');
if(disconnected.status !== 'disconnected') fail('disconnected status mismatch');
if(disconnected.key_exported !== false || disconnected.raw_token_exported !== false) fail('disconnected state must export no secret');
const connected = mod.connect({version:'1.0.0', accountHint:'fixture'});
if(connected.status !== 'connected_mock') fail('connect did not produce connected_mock');
if(!connected.token_hash || connected.token_hash.includes('sk-')) fail('token hash missing or unsafe');
if(connected.live_calls_supported !== false || connected.mock_only !== true) fail('portable mock must not support live calls');
const status = mod.status(connected, {version:'1.0.0'});
if(!status.connected || !status.token_present) fail('status must mark connected token presence');
const refreshed = mod.refresh(connected, {version:'1.0.0'});
if(refreshed.token_hash === connected.token_hash) fail('refresh should rotate mock token hash');
const exported = mod.exportableStatus(refreshed, {version:'1.0.0'});
for (const forbidden of ['raw_token','access_token','refresh_token']) {
  if(Object.prototype.hasOwnProperty.call(exported, forbidden)) fail(`exported status leaked ${forbidden}`);
}
if(exported.key_exported !== false || exported.raw_token_exported !== false) fail('exported status must mark secret non-export');
console.log('Portable account checks passed.');
