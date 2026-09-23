/**
 * F24 — visual QA (2026-09-17): /manager/salespeople at 1440 and 390 px in a real browser (lib/visual.js). Read-only.
 */
const V = require('../lib/visual.js');

module.exports = {
  flow: 'F24', slug: 'manager-salespeople-visual', title: 'Manager portal Salespeople (visual, design-gate §B)', priority: 'P1',
  source: 'design-system.md §2 (D-DS3) and §5 rule 5; `workspace/test-suites/web/lib/browser.js`',
  cases: V.page('TC-F24-007', 'TC-F24-008', 'Business Agent', '/manager/salespeople', 'f24-manager-salespeople', {'fontGap': 'UI-UX-08', 'navGap': 'KG-UI5'}),
  teardown: V.teardown,
};
