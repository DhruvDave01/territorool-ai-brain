/**
 * F25 — visual QA (2026-09-17): /hq/login at 1440 and 390 px in a real browser (lib/visual.js). Read-only
 * (the page handler was read for writes before this case was added).
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F25', slug: 'hq-login-visual', title: 'Admin HQ login page (visual, design-gate §B)', priority: 'P2',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F25-005', null, 'Public', '/hq/login', 'f25-hq-login', {'noNav': true}),
  teardown: V.teardown,
};
