/**
 * F23 — visual QA (2026-09-17): /manager/dashboard at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F23', slug: 'manager-dashboard-visual', title: 'Manager portal dashboard (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F23-011', 'TC-F23-012', 'Business Agent', '/manager/dashboard', 'f23-manager-dashboard', {'fontGap': 'UI-UX-08', 'navGap': 'KG-UI3'}),
  teardown: V.teardown,
};
