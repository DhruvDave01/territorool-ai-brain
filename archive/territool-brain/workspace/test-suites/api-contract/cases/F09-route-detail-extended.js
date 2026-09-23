/**
 * F09 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F09',
  slug: 'route-detail-extended',
  title: 'Route detail (extended read contract)',
  priority: 'P1',
  source: 'simplerouteview (POST route_id); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F09-003', 'simplerouteview', { body: { route_id: 1 } }),
    C.validation('TC-F09-004', 'simplerouteview', 'Sales Agent', {}, 'a missing route_id'),
    C.edge('TC-F09-005', 'simplerouteview', 'Sales Agent', { route_id: 2147483647 }, 'a route id that cannot exist'),
    C.permission('TC-F09-006', 'routelist', { method: 'GET' }),
  ],
};
