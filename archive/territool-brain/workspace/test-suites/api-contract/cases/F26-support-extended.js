/**
 * F26 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only. Write endpoints appear only with an empty body, and only where the
 * controller refuses a missing required field before any database write (cited per case).
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F26',
  slug: 'support-extended',
  title: 'Support tickets (extended read contract)',
  priority: 'P3',
  source: 'getticket / unreadticketcount (POST); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F26-003', 'getticket', { body: {} }),
    C.security('TC-F26-004', 'getticket', 'Sales Agent', { body: {} }),
    C.permission('TC-F26-005', 'unreadticketcount', { body: {} }),
    C.validation('TC-F26-008', 'addticket', 'Sales Agent', {}, 'a ticket with no title (refused before any insert, V2/SupportController.php:40-45)'),
  ],
};
