/**
 * F11 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only. Write endpoints appear only with an empty body, and only where the
 * controller refuses a missing required field before any database write (cited per case).
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F11',
  slug: 'lists-extended',
  title: 'Lists (extended read contract)',
  priority: 'P1',
  source: 'getlist (GET); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F11-003', 'getlist', { method: 'GET' }),
    C.security('TC-F11-004', 'getlist', 'Sales Agent', { method: 'GET' }),
    C.permission('TC-F11-005', 'getlist', { method: 'GET' }),
    C.validation('TC-F11-008', 'createList', 'Sales Agent', {}, 'a list with no name (refused before any insert, V2/ListController.php:97-110)'),
  ],
};
