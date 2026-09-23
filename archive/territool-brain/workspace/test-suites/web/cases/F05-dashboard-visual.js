/**
 * F05 — visual QA (2026-09-17): /dashboard at 1440 and 390 px in a real browser (lib/visual.js). Read-only
 * (the page handler was read for writes before this case was added).
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F05', slug: 'dashboard-visual', title: 'Dashboard (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F05-008', 'TC-F05-009', 'Sales Agent', '/dashboard', 'f05-dashboard', {}),
  teardown: V.teardown,
};
