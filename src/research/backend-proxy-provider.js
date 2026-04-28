/* Jarbou3i Research Engine hosted backend proxy adapter v0.9.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  async function call(payload, config = {}, normalizeProviderTextResponse){
    const endpoint = (config.endpoint || '/api/provider-task').trim();
    const normalize = normalizeProviderTextResponse || root.providerCore?.normalizeProviderTextResponse || JSON.parse;
    const safePayload = Object.assign({}, payload, {
      provider: 'backend_proxy',
      provider_config: {
        endpoint,
        model: config.model || payload?.provider_config?.model || 'server-default',
        allow_live: !!config.allow_live,
        remember_key: false
      },
      provider_safety: Object.assign({}, payload.provider_safety || {}, {
        provider: 'backend_proxy',
        key_present: false,
        key_exported: false,
        key_storage: 'server_environment_secret',
        verdict: config.allow_live ? 'hosted_proxy_ready' : 'dry_run_only'
      })
    });
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(safePayload)
    });
    const text = await response.text();
    const parsed = normalize(text);
    if(!response.ok){
      const message = parsed?.message || parsed?.error || `backend_proxy_http_${response.status}`;
      throw new Error(message);
    }
    if(parsed && parsed.ok === true && parsed.data) return parsed.data;
    return parsed;
  }
  root.backendProxyProvider = {call};
})(window);
