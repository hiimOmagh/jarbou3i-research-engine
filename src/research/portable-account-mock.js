/* Portable account mock OAuth flow for Jarbou3i Research Engine. No real OAuth or live provider calls. */
(function(){
  'use strict';
  const root = window.Jarbou3iResearchModules = window.Jarbou3iResearchModules || {};

  function stableHash(text){
    let hash = 2166136261;
    const input = String(text || '');
    for (let i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `h${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  function nowIso(){ return new Date().toISOString(); }
  function plusMinutes(minutes){ return new Date(Date.now() + minutes * 60 * 1000).toISOString(); }

  function disconnected(version = '1.0.5'){
    return {
      portable_account_version: version,
      provider_id: 'portable_oauth',
      status: 'disconnected',
      account_id: null,
      display_name: null,
      connected_at: null,
      token_state: 'absent',
      token_hash: null,
      token_expires_at: null,
      refresh_available: false,
      scopes: [],
      billing_owner: 'portable_account',
      spending_limit_cents: 0,
      live_calls_enabled: false,
      live_calls_supported: false,
      mock_only: true,
      key_exported: false,
      raw_token_exported: false,
      verification: 'mock_oauth_simulation_only'
    };
  }

  function connect({version = '1.0.5', accountHint = 'demo-portable-user'} = {}){
    const connectedAt = nowIso();
    const seed = `${accountHint}|${connectedAt}|portable_oauth_mock`;
    const tokenHash = stableHash(seed);
    return {
      portable_account_version: version,
      provider_id: 'portable_oauth',
      status: 'connected_mock',
      account_id: `pa_${tokenHash.slice(1)}`,
      display_name: 'Mock Portable AI Account',
      connected_at: connectedAt,
      token_state: 'mock_access_token_active',
      token_hash: tokenHash,
      token_expires_at: plusMinutes(60),
      refresh_available: true,
      scopes: ['inference:chat', 'billing:read_mock', 'identity:read_mock'],
      billing_owner: 'portable_account',
      spending_limit_cents: 1000,
      live_calls_enabled: false,
      live_calls_supported: false,
      mock_only: true,
      key_exported: false,
      raw_token_exported: false,
      verification: 'mock_oauth_simulation_only'
    };
  }

  function refresh(session, {version = '1.0.5'} = {}){
    if(!session || session.status === 'disconnected') return disconnected(version);
    const refreshedAt = nowIso();
    const tokenHash = stableHash(`${session.account_id}|${refreshedAt}|refresh`);
    return Object.assign({}, session, {
      portable_account_version: version,
      status: 'connected_mock',
      token_state: 'mock_access_token_refreshed',
      token_hash: tokenHash,
      token_expires_at: plusMinutes(60),
      refreshed_at: refreshedAt,
      refresh_available: true,
      key_exported: false,
      raw_token_exported: false,
      mock_only: true,
      live_calls_enabled: false,
      live_calls_supported: false
    });
  }

  function status(session, {version = '1.0.5'} = {}){
    const base = session && typeof session === 'object' ? session : disconnected(version);
    const connected = base.status === 'connected_mock' || base.token_state === 'mock_access_token_active' || base.token_state === 'mock_access_token_refreshed';
    return Object.assign({}, base, {
      portable_account_version: base.portable_account_version || version,
      connected,
      token_present: connected && !!base.token_hash,
      key_exported: false,
      raw_token_exported: false,
      live_calls_supported: false,
      live_calls_enabled: false,
      mock_only: true,
      safety_verdict: connected ? 'portable_account_mock_connected_no_live_calls' : 'portable_account_mock_disconnected'
    });
  }

  function exportableStatus(session, opts = {}){
    const s = status(session, opts);
    const copy = Object.assign({}, s);
    delete copy.raw_token;
    delete copy.access_token;
    delete copy.refresh_token;
    copy.raw_token_exported = false;
    copy.key_exported = false;
    return copy;
  }

  root.portableAccountMock = {stableHash, disconnected, connect, refresh, status, exportableStatus};
})();
