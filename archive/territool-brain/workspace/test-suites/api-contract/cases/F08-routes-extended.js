/**
 * F08 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F08',
  slug: 'routes-extended',
  title: 'Routes library (extended read contract)',
  priority: 'P1',
  source: 'routelist (GET); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F08-003', 'routelist', { method: 'GET' }),
    C.security('TC-F08-004', 'routelist', 'Sales Agent', { method: 'GET' }),
    C.permission('TC-F08-005', 'routelist', { method: 'GET' }),
  ],
};
