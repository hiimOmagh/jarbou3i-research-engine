/* Jarbou3i Research Engine evidence review controller boundary v0.19.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function pendingItems(queue){ return (queue || []).filter(item => item.status === 'pending' || item.status === 'needs_edit'); }
  function report(queue){
    const items = queue || [];
    return {
      review_report_version:'0.19.0-beta',
      queue_count:items.length,
      pending_count:items.filter(item => item.status === 'pending').length,
      needs_edit_count:items.filter(item => item.status === 'needs_edit').length,
      accepted_count:items.filter(item => item.status === 'accepted').length,
      rejected_count:items.filter(item => item.status === 'rejected').length,
      resolved_count:items.filter(item => item.status === 'accepted' || item.status === 'rejected').length
    };
  }
  root.evidenceReviewController = {pendingItems, report};
})(window);
