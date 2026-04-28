/* Provider identity and billing abstraction for Jarbou3i Research Engine. */
(function(){
  'use strict';
  const root = window.Jarbou3iResearchModules = window.Jarbou3iResearchModules || {};

  const PROVIDER_REGISTRY = Object.freeze({
    mock: Object.freeze({
      provider_id: 'mock', display_name: 'MockProvider', auth_type: 'none', billing_owner: 'none', key_exposure: 'none', privacy_mode: 'local_only', credential_class: 'no_credential', live_supported: false, production_status: 'safe_default', oauth_pkce: false, portable_account: false,
      description: 'Deterministic local mock provider. No network, no key, no billing.'
    }),
    openai_compatible: Object.freeze({
      provider_id: 'openai_compatible', display_name: 'OpenAI-compatible BYOK', auth_type: 'api_key', billing_owner: 'user_provider_account', key_exposure: 'browser_memory_or_optional_local', privacy_mode: 'direct_provider', credential_class: 'user_api_key', live_supported: true, production_status: 'alpha_direct_provider', oauth_pkce: false, portable_account: false,
      description: 'User supplies a provider API key. Calls go directly from the browser to the configured endpoint.'
    }),
    backend_proxy: Object.freeze({
      provider_id: 'backend_proxy', display_name: 'Hosted backend proxy', auth_type: 'server_secret', billing_owner: 'app_owner_or_deployment_owner', key_exposure: 'server_environment_only', privacy_mode: 'hosted_proxy', credential_class: 'server_environment_secret', live_supported: true, production_status: 'beta_proxy_scaffold', oauth_pkce: false, portable_account: false,
      description: 'Frontend calls a server endpoint. Provider secret stays in backend environment variables.'
    }),
    portable_oauth: Object.freeze({
      provider_id: 'portable_oauth', display_name: 'Portable account / OAuth provider', auth_type: 'oauth_pkce', billing_owner: 'portable_account', key_exposure: 'oauth_access_token_not_provider_key', privacy_mode: 'portable_proxy', credential_class: 'oauth_access_token', live_supported: false, production_status: 'planned_placeholder', oauth_pkce: true, portable_account: true,
      description: 'Future BrainLink/OpenRouter-style provider mode. User links a portable AI account; no raw provider API key is pasted into the app.'
    })
  });

  function providerRecord(provider){ return PROVIDER_REGISTRY[provider] || PROVIDER_REGISTRY.mock; }

  function providerIdentity(provider, config = {}, options = {}){
    const record = providerRecord(provider);
    const liveOptIn = !!config.allow_live;
    const keyPresent = !!options.key_present;
    const rememberKey = !!config.remember_key;
    const tokenPresent = !!options.token_present;
    const blockers = [];
    const warnings = [];
    if(record.provider_id === 'openai_compatible'){
      if(liveOptIn && !keyPresent) blockers.push('live_byok_enabled_without_api_key');
      if(rememberKey) warnings.push('api_key_persistence_is_local_device_only');
    }
    if(record.provider_id === 'backend_proxy'){
      if(liveOptIn && !config.endpoint) blockers.push('backend_proxy_endpoint_missing');
    }
    if(record.provider_id === 'portable_oauth'){
      if(liveOptIn) blockers.push('portable_oauth_live_integration_not_implemented');
      if(!tokenPresent) warnings.push('oauth_token_not_connected_placeholder');
    }
    const liveReady = liveOptIn && blockers.length === 0 && (record.provider_id === 'backend_proxy' || (record.provider_id === 'openai_compatible' && keyPresent));
    return {
      provider_id: record.provider_id,
      display_name: record.display_name,
      auth_type: record.auth_type,
      billing_owner: record.billing_owner,
      key_exposure: record.key_exposure,
      privacy_mode: liveOptIn ? record.privacy_mode : 'local_or_dry_run',
      credential_class: record.credential_class,
      production_status: record.production_status,
      live_supported: !!record.live_supported,
      live_opt_in: liveOptIn,
      live_ready: !!liveReady,
      key_present: keyPresent,
      key_exported: false,
      remember_key: rememberKey,
      token_present: tokenPresent,
      oauth_pkce: !!record.oauth_pkce,
      portable_account: !!record.portable_account,
      live_blockers: blockers,
      warnings,
      description: record.description
    };
  }

  function billingPolicy(provider, config = {}, options = {}){
    const identity = providerIdentity(provider, config, options);
    const base = {billing_policy_version: 'provider-billing-v0.14', provider_id: identity.provider_id, billing_owner: identity.billing_owner, user_charge_controlled_by_app: false, app_owner_cost_exposure: 'none', requires_user_acknowledgement: false, notes: []};
    if(identity.provider_id === 'openai_compatible'){
      base.requires_user_acknowledgement = true;
      base.notes.push('User provider account is billed by the external provider.');
    } else if(identity.provider_id === 'backend_proxy'){
      base.requires_user_acknowledgement = true;
      base.app_owner_cost_exposure = 'server_provider_usage';
      base.notes.push('Deployment owner controls server-side provider key, quotas, and billing exposure.');
    } else if(identity.provider_id === 'portable_oauth'){
      base.requires_user_acknowledgement = true;
      base.app_owner_cost_exposure = 'none_if_portable_account_provider_handles_billing';
      base.notes.push('Planned mode: user-paid portable account or inference wallet; OAuth/PKCE integration not implemented in this beta.');
    } else {
      base.notes.push('Mock mode has no external billing.');
    }
    return base;
  }

  function registrySummary(){
    return Object.values(PROVIDER_REGISTRY).map((item) => ({provider_id: item.provider_id, display_name: item.display_name, auth_type: item.auth_type, billing_owner: item.billing_owner, privacy_mode: item.privacy_mode, production_status: item.production_status, live_supported: item.live_supported}));
  }

  root.providerIdentity = {PROVIDER_REGISTRY, providerRecord, providerIdentity, billingPolicy, registrySummary};
})();
