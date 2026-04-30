/* Jarbou3i Research Engine OpenAI-compatible provider adapter v1.0.3. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  async function call(payload, apiKey, config = {}, normalizeProviderTextResponse){
    const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
    const model = config.model || 'gpt-4.1-mini';
    const normalize = normalizeProviderTextResponse || root.providerCore?.normalizeProviderTextResponse || JSON.parse;
    const body = {
      model,
      temperature: payload.task === 'critique' ? 0.2 : 0.1,
      messages: [
        {role:'system', content:'You are Jarbou3i Research Engine provider adapter. Follow the response contract exactly. Return JSON only.'},
        {role:'user', content: payload.prompt}
      ],
      response_format: {type:'json_object'}
    };
    const response = await fetch(endpoint, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body: JSON.stringify(body)
    });
    if(!response.ok) throw new Error(`provider_http_${response.status}`);
    const json = await response.json();
    const content = json.choices?.[0]?.message?.content || json.output_text || JSON.stringify(json);
    return normalize(content);
  }
  root.openAICompatibleProvider = {call};
})(window);
