/**
 * F27 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F27',
  slug: 'notifications-extended',
  title: 'Notifications (extended read contract)',
  priority: 'P3',
  source: 'notificationlist (GET); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F27-002', 'notificationlist', { method: 'GET' }),
    C.security('TC-F27-003', 'notificationlist', 'Sales Agent', { method: 'GET' }),
    C.permission('TC-F27-004', 'notificationlist', { method: 'GET' }),
  ],
};
