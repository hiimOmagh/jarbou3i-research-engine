/* Jarbou3i Research Engine provider controller boundary v0.24.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function defaultEndpointForProvider(provider){ return provider === 'backend_proxy' ? '/api/provider-task' : 'https://api.openai.com/v1/chat/completions'; }
  function sanitizeProviderConfig(config = {}, provider = 'mock'){
    return {
      endpoint: config.endpoint || defaultEndpointForProvider(provider),
      model: config.model || 'gpt-4.1-mini',
      allow_live: !!config.allow_live,
      remember_key: provider === 'openai_compatible' && !!config.remember_key
    };
  }
  root.providerController = {defaultEndpointForProvider, sanitizeProviderConfig};
})(window);
