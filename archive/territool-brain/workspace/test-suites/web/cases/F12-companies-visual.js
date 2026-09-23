/**
 * F12 — visual QA (2026-09-17): /company at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F12', slug: 'companies-visual', title: 'Address Book (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F12-008', 'TC-F12-009', 'Sales Agent', '/company', 'f12-companies', {}),
  teardown: V.teardown,
};
