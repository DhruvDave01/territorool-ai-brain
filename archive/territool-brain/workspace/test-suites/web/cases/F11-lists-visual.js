/**
 * F11 — visual QA (2026-09-17): /lists at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F11', slug: 'lists-visual', title: 'Lists library (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F11-009', 'TC-F11-010', 'Sales Agent', '/lists', 'f11-lists', {}),
  teardown: V.teardown,
};
