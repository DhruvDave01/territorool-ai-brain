/**
 * F03 — visual QA (2026-09-17): /subscription at 1440 and 390 px in a real browser (lib/visual.js). Read-only
 * (the page handler was read for writes before this case was added).
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F03', slug: 'subscription-visual', title: 'Subscription page (visual, design-gate §B)', priority: 'P0',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F03-007', 'TC-F03-008', 'Sales Agent', '/subscription', 'f03-subscription', {}),
  teardown: V.teardown,
};
