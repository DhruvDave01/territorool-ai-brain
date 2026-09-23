/**
 * F08 — visual QA (2026-09-17): /routes at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F08', slug: 'routes-visual', title: 'Routes library (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F08-008', 'TC-F08-009', 'Sales Agent', '/routes', 'f08-routes', {}),
  teardown: V.teardown,
};
