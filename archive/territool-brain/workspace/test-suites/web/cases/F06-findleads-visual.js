/**
 * F06 — visual QA (2026-09-17): /findleads at 1440 and 390 px in a real browser (lib/visual.js). Read-only
 * (the page handler was read for writes before this case was added).
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F06', slug: 'findleads-visual', title: 'AI Find Leads page (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F06-007', 'TC-F06-008', 'Sales Agent', '/findleads', 'f06-findleads', {}),
  teardown: V.teardown,
};
