/**
 * F13 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only. Write endpoints appear only with an empty body, and only where the
 * controller refuses a missing required field before any database write (cited per case).
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F13',
  slug: 'contacts-extended',
  title: 'Contacts (extended read contract)',
  priority: 'P1',
  source: 'contactlist (POST page); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F13-003', 'contactlist', { body: { page: 0 } }),
    C.security('TC-F13-004', 'contactlist', 'Sales Agent', { body: { page: 0 } }),
    C.edge('TC-F13-005', 'contactlist', 'Sales Agent', { page: 9999 }, 'a page far past the last one'),
    C.permission('TC-F13-006', 'contactlist', { body: { page: 0 } }),
    C.validation('TC-F13-007', 'addcontact', 'Sales Agent', {}, 'a contact with no name or status (refused before any insert, V2/ContactSellController.php:57-73)'),
  ],
};
