/**
 * F27 — visual QA (2026-09-17): /notification at 1440 and 390 px in a real browser (lib/visual.js). Read-only
 * (the page handler was read for writes before this case was added).
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F27', slug: 'notification-page-visual', title: 'Push notification page (visual, design-gate §B)', priority: 'P3',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F27-005', 'TC-F27-006', 'Sales Agent', '/notification', 'f27-notification-page', {}),
  teardown: V.teardown,
};
