/**
 * F10 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F10',
  slug: 'visits-extended',
  title: 'Visits (extended read contract)',
  priority: 'P1',
  source: 'getlastvisitedentry (POST company_id); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F10-003', 'getlastvisitedentry', { body: { company_id: 1 } }),
    C.validation('TC-F10-004', 'getlastvisitedentry', 'Sales Agent', {}, 'a missing company_id'),
    C.edge('TC-F10-005', 'getlastvisitedentry', 'Sales Agent', { company_id: 2147483647 }, 'a company id that cannot exist'),
  ],
};
