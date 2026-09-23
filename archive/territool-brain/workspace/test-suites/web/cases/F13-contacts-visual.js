/**
 * F13 — visual QA (2026-09-17): /contact at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F13', slug: 'contacts-visual', title: 'Contacts (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F13-008', 'TC-F13-009', 'Sales Agent', '/contact', 'f13-contacts', {}),
  teardown: V.teardown,
};
