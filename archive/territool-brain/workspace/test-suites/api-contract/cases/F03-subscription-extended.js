/**
 * F03 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F03',
  slug: 'subscription-extended',
  title: 'Subscription / credits (extended read contract)',
  priority: 'P0',
  source: 'getusercredit / getuserdata (GET); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F03-004', 'getuserdata', { method: 'GET' }),
    C.security('TC-F03-005', 'getuserdata', 'Sales Agent', { method: 'GET' }),
    C.permission('TC-F03-006', 'getusercredit', { method: 'GET' }),
  ],
};
