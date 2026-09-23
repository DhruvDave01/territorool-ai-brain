/**
 * F20 — visual QA (2026-09-17): /salesperson/edit at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F20', slug: 'settings-visual', title: 'Settings (visual, design-gate §B)', priority: 'P2',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F20-008', 'TC-F20-009', 'Sales Agent', '/salesperson/edit', 'f20-settings', {}),
  teardown: V.teardown,
};
