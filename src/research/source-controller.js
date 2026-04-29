/* Jarbou3i Research Engine source controller boundary v1.0.2. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function buildPolicy(sourceConnectors){ return sourceConnectors && typeof sourceConnectors.sourcePolicy === 'function' ? sourceConnectors.sourcePolicy() : {live_fetching_enabled:false, verdict:'safe_planning_layer_only'}; }
  root.sourceController = {buildPolicy};
})(window);
