/**
 * F12 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F12',
  slug: 'companies-extended',
  title: 'Companies (extended read contract)',
  priority: 'P1',
  source: 'companylist / companydetail (POST); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F12-004', 'companylist', { body: { page: 0, sort_order: 'asc' } }),
    C.validation('TC-F12-005', 'companydetail', 'Sales Agent', {}, 'a missing company_id'),
    C.edge('TC-F12-006', 'companylist', 'Sales Agent', { page: 9999, sort_order: 'asc' }, 'a page far past the last one', { rowsKey: 'company_list' }),
    C.permission('TC-F12-007', 'companylist', { body: { page: 0, sort_order: 'asc' } }),
  ],
};
