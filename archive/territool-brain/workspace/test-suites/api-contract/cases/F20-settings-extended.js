/**
 * F20 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only. Write endpoints appear only with an empty body, and only where the
 * controller refuses a missing required field before any database write (cited per case).
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F20',
  slug: 'settings-extended',
  title: 'Settings / status tags (extended read contract)',
  priority: 'P2',
  source: 'getuserstatus (GET); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F20-005', 'getuserstatus', { method: 'GET' }),
    C.permission('TC-F20-006', 'getuserstatus', { method: 'GET' }),
    C.validation('TC-F20-007', 'updateuserstatus', 'Sales Agent', {}, 'an update with no status details (returns before any update, V2/RouteController.php:3936, 3955-3958)'),
  ],
};
