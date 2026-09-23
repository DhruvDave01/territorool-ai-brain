/**
 * F26 — visual QA (2026-09-17): /support at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F26', slug: 'support-visual', title: 'Support tickets (visual, design-gate §B)', priority: 'P3',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F26-009', 'TC-F26-010', 'Sales Agent', '/support', 'f26-support', {}),
  teardown: V.teardown,
};
