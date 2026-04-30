/* Jarbou3i Research Engine real portable OAuth/PKCE spike v1.0.3. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const VERSION = '1.0.3';
  const VERIFIER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

  function nowIso(){ return new Date().toISOString(); }
  function plusSeconds(seconds){ return new Date(Date.now() + Math.max(0, Number(seconds || 0)) * 1000).toISOString(); }
  function stableHash(text){
    let hash = 2166136261;
    const input = String(text || '');
    for(let i = 0; i < input.length; i += 1){ hash ^= input.charCodeAt(i); hash = Math.imul(hash, 16777619); }
    return `h${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }
  function bytesToBase64Url(bytes){
    let binary = '';
    const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
    for(let i = 0; i < arr.length; i += 1) binary += String.fromCharCode(arr[i]);
    const b64 = (typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64'));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
  function randomBytes(length){
    const bytes = new Uint8Array(length);
    const cryptoObj = global.crypto || (typeof crypto !== 'undefined' ? crypto : null);
    if(cryptoObj?.getRandomValues) cryptoObj.getRandomValues(bytes);
    else for(let i = 0; i < length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    return bytes;
  }
  function randomVerifier(length = 64){
    const size = Math.max(43, Math.min(128, Number(length || 64)));
    const bytes = randomBytes(size);
    return Array.from(bytes).map((b) => VERIFIER_CHARS[b % VERIFIER_CHARS.length]).join('');
  }
  async function sha256Base64Url(input){
    const cryptoObj = global.crypto || (typeof crypto !== 'undefined' ? crypto : null);
    const data = new TextEncoder().encode(String(input || ''));
    if(cryptoObj?.subtle?.digest){
      const digest = await cryptoObj.subtle.digest('SHA-256', data);
      return bytesToBase64Url(new Uint8Array(digest));
    }
    if(typeof require === 'function'){
      return require('crypto').createHash('sha256').update(String(input || ''), 'ascii').digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }
    // deterministic fallback for old sandboxes; tests use subtle crypto.
    return stableHash(input).padEnd(43, '0').slice(0,43);
  }
  async function generatePkcePair(options = {}){
    const code_verifier = options.code_verifier || randomVerifier(options.length || 64);
    const code_challenge = await sha256Base64Url(code_verifier);
    return {method:'S256', code_verifier, code_challenge, code_verifier_hash:stableHash(code_verifier), verifier_length:code_verifier.length};
  }
  function validateOAuthConfig(config = {}){
    const errors = [];
    if(!config.authorization_endpoint) errors.push('authorization_endpoint_required');
    if(!config.token_endpoint) errors.push('token_endpoint_required');
    if(!config.client_id) errors.push('client_id_required');
    if(!config.redirect_uri) errors.push('redirect_uri_required');
    if(config.redirect_uri && !/^https?:\/\//.test(String(config.redirect_uri))) errors.push('redirect_uri_must_be_http_or_https');
    return {ok:errors.length === 0, errors};
  }
  async function buildAuthorizationRequest(config = {}, options = {}){
    const validation = validateOAuthConfig(config);
    const pkce = await generatePkcePair(options);
    const state = options.state || bytesToBase64Url(randomBytes(24));
    const nonce = options.nonce || bytesToBase64Url(randomBytes(16));
    const scopes = Array.isArray(config.scopes) ? config.scopes : String(config.scopes || 'openid profile email').split(/\s+/).filter(Boolean);
    const url = new URL(config.authorization_endpoint || 'https://portable-provider.example/oauth/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', config.client_id || 'portable-dev-client');
    url.searchParams.set('redirect_uri', config.redirect_uri || `${global.location?.origin || 'http://localhost'}/oauth/callback`);
    url.searchParams.set('scope', scopes.join(' '));
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    url.searchParams.set('code_challenge', pkce.code_challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    if(config.audience) url.searchParams.set('audience', config.audience);
    return {
      request_version: VERSION,
      created_at: nowIso(),
      provider_id:'portable_oauth',
      mode:'real_oauth_pkce_spike',
      validation,
      authorization_url: url.toString(),
      redirect_uri: url.searchParams.get('redirect_uri'),
      token_endpoint: config.token_endpoint || '',
      scopes,
      state,
      nonce_hash: stableHash(nonce),
      code_challenge: pkce.code_challenge,
      code_challenge_method:'S256',
      code_verifier_hash:pkce.code_verifier_hash,
      runtime_secret: {state, code_verifier: pkce.code_verifier, nonce},
      exportable: {
        oauth_spike_version: VERSION,
        provider_id:'portable_oauth',
        status:'oauth_pkce_authorization_url_built',
        mode:'real_oauth_pkce_spike',
        state_hash: stableHash(state),
        nonce_hash: stableHash(nonce),
        code_verifier_hash: pkce.code_verifier_hash,
        code_challenge: pkce.code_challenge,
        code_challenge_method:'S256',
        redirect_uri: url.searchParams.get('redirect_uri'),
        scopes,
        token_state:'authorization_pending',
        key_exported:false,
        raw_token_exported:false,
        access_token_exported:false,
        refresh_token_exported:false,
        code_verifier_exported:false,
        billing_owner:'portable_account',
        live_calls_enabled:false,
        threat_model_required:true,
        production_ready:false,
        safety_verdict: validation.ok ? 'oauth_pkce_spike_ready_for_dev_callback_no_tokens_exported' : 'oauth_pkce_config_invalid'
      }
    };
  }
  function parseCallbackUrl(callbackUrl, expectedState){
    const url = new URL(String(callbackUrl || ''), global.location?.origin || 'http://localhost');
    const code = url.searchParams.get('code') || '';
    const state = url.searchParams.get('state') || '';
    const error = url.searchParams.get('error') || '';
    const stateMatches = expectedState ? state === expectedState : !!state;
    return {callback_version:VERSION, code_present:!!code, code_hash:code ? stableHash(code) : null, code, state, state_hash:state ? stableHash(state) : null, state_matches:stateMatches, error:error || null, error_description:url.searchParams.get('error_description') || null};
  }
  function buildTokenExchangePayload(config = {}, runtime = {}, callback = {}){
    return {
      exchange_version: VERSION,
      provider_id:'portable_oauth',
      grant_type:'authorization_code',
      token_endpoint: config.token_endpoint || runtime.token_endpoint || '',
      client_id: config.client_id || '',
      redirect_uri: config.redirect_uri || runtime.redirect_uri || '',
      code: callback.code || '',
      code_verifier: runtime.code_verifier || runtime.runtime_secret?.code_verifier || '',
      state_hash: callback.state_hash || stableHash(callback.state || runtime.state || ''),
      code_hash: callback.code_hash || stableHash(callback.code || ''),
      scopes: config.scopes || runtime.scopes || []
    };
  }
  function sanitizedConnectedStatus(tokenResponse = {}, config = {}){
    const access = tokenResponse.access_token || '';
    const refresh = tokenResponse.refresh_token || '';
    const expiresIn = Number(tokenResponse.expires_in || 3600);
    return {
      portable_account_version: VERSION,
      oauth_spike_version: VERSION,
      provider_id:'portable_oauth',
      status:'connected_oauth_dev',
      mode:'real_oauth_pkce_spike',
      account_id: tokenResponse.account_id || tokenResponse.sub || `oauth_${stableHash(access || tokenResponse.id_token || 'connected').slice(1)}`,
      display_name: tokenResponse.display_name || tokenResponse.email || 'Portable OAuth dev account',
      connected_at: nowIso(),
      token_state:'oauth_access_token_exchanged_server_side',
      token_hash: access ? stableHash(access) : null,
      refresh_token_hash: refresh ? stableHash(refresh) : null,
      token_expires_at: plusSeconds(expiresIn),
      refresh_available: !!refresh,
      refresh_strategy: refresh ? 'server_side_token_vault_required_for_real_refresh' : 'refresh_not_available_without_refresh_token',
      scopes: Array.isArray(config.scopes) ? config.scopes : String(tokenResponse.scope || config.scopes || '').split(/\s+/).filter(Boolean),
      billing_owner:'portable_account',
      spending_limit_cents:Number(config.spending_limit_cents || 0),
      live_calls_supported:false,
      live_calls_enabled:false,
      mock_only:false,
      key_exported:false,
      raw_token_exported:false,
      access_token_exported:false,
      refresh_token_exported:false,
      code_verifier_exported:false,
      verification:'real_oauth_pkce_spike_sanitized_token_exchange',
      connected:true,
      token_present:!!access,
      safety_verdict:'oauth_dev_connected_tokens_sanitized_no_live_provider_calls'
    };
  }
  function disconnectStatus(version = VERSION){
    return {
      portable_account_version:version, oauth_spike_version:version, provider_id:'portable_oauth', status:'disconnected', mode:'real_oauth_pkce_spike', account_id:null, display_name:null, connected_at:null, token_state:'cleared', token_hash:null, refresh_token_hash:null, token_expires_at:null, refresh_available:false, refresh_strategy:'disconnect_clears_local_status_backend_token_vault_not_implemented', scopes:[], billing_owner:'portable_account', spending_limit_cents:0, live_calls_supported:false, live_calls_enabled:false, mock_only:false, key_exported:false, raw_token_exported:false, access_token_exported:false, refresh_token_exported:false, code_verifier_exported:false, verification:'oauth_spike_disconnected', connected:false, token_present:false, safety_verdict:'oauth_dev_disconnected_token_state_cleared'
    };
  }
  function exportableSpikeStatus(status = {}){
    const copy = Object.assign({}, status || disconnectStatus());
    for(const key of ['access_token','refresh_token','id_token','raw_token','code','code_verifier','client_secret','authorization']) delete copy[key];
    copy.key_exported = false;
    copy.raw_token_exported = false;
    copy.access_token_exported = false;
    copy.refresh_token_exported = false;
    copy.code_verifier_exported = false;
    return copy;
  }

  root.portableOAuthSpike = Object.freeze({VERSION, stableHash, bytesToBase64Url, randomVerifier, sha256Base64Url, generatePkcePair, validateOAuthConfig, buildAuthorizationRequest, parseCallbackUrl, buildTokenExchangePayload, sanitizedConnectedStatus, disconnectStatus, exportableSpikeStatus});
})(typeof window !== 'undefined' ? window : globalThis);
