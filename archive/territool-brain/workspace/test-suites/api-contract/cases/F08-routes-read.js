/**
 * F08/F09 Routes: read contract behind the mobile Routes Library. Read-only (`routeList()` scanned 2026-09-16).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

const routesCase = (id, role) => ({
  id, title: `${role} routes library lists draft and published routes`, type: 'happy', role, refs: ['M3', 'S2.4'],
  pre: `${role} account`, steps: '1. GET `routelist` with the Bearer token',
  expected: 'HTTP 200; `status` 1; `data.draft_routes` and `data.published_routes` are arrays; each published route has an `id` and a `title`',
  async run(t, { account }) {
    const r = await call('routelist', { method: 'GET', token: await token(account), timeout: 60000 });
    t.is(r.httpStatus, 200, 'HTTP 200');
    t.is(r.json && r.json.status, 1, '`status` is 1');
    const d = (r.json && r.json.data) || {};
    t.ok(Array.isArray(d.draft_routes) && Array.isArray(d.published_routes), 'draft_routes and published_routes are arrays');
    const first = (d.published_routes || [])[0];
    t.ok(!first || (first.id !== undefined && typeof first.title === 'string'), 'a published route has id and title');
  },
});

module.exports = {
  flow: 'F08',
  slug: 'routes-read',
  title: 'Routes library (read contract)',
  priority: 'P1',
  source: '`V2/RouteController.php` `routeList()` (GET `routelist`)',
  cases: [routesCase('TC-F08-001', 'Sales Agent'), routesCase('TC-F08-002', 'Business Sales Agent')],
};
