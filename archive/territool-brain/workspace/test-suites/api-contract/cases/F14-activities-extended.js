/**
 * F14 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only. Write endpoints appear only with an empty body, and only where the
 * controller refuses a missing required field before any database write (cited per case).
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F14',
  slug: 'activities-extended',
  title: 'Activities / notes (extended read contract)',
  priority: 'P1',
  source: 'getcompanyactivities / getnotes (POST); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F14-003', 'getcompanyactivities', { body: {} }),
    C.validation('TC-F14-004', 'getnotes', 'Sales Agent', {}, 'a missing company_id'),
    C.edge('TC-F14-005', 'getnotes', 'Sales Agent', { company_id: 2147483647 }, 'a company id that cannot exist'),
    C.permission('TC-F14-006', 'getcompanyactivities', { body: {} }),
    C.validation('TC-F14-007', 'addnote', 'Sales Agent', {}, 'a note with no company or text (refused before save, V2/CompanyController.php:851-866)'),
  ],
};
