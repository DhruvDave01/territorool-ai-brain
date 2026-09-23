/**
 * F09 Route detail: `simplerouteview` for an ALREADY-OPEN route, and an ownership probe.
 * The action writes only `is_route_open = 1` when the caller owns the route and it is still 0
 * (`V2/RouteController.php` simpleRouteView, 2026-09-16). This suite picks routes whose flag is already 1, and the
 * probe calls it as a non-owner, so nothing is written.
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

async function openRoute(account) {
  const r = await call('routelist', { method: 'GET', token: await token(account), timeout: 60000 });
  const p = (r.json && r.json.data && r.json.data.published_routes) || [];
  const open = p.find((x) => String(x.is_route_open) === '1' && Number(x.totalpoints) > 0);
  return open ? open.id : null;
}
const hasStops = (j) => !!(j && String(j.status) === '1' && j.data && Object.keys(j.data).length);

module.exports = {
  flow: 'F09',
  slug: 'route-detail-read',
  title: 'Route detail (read contract + ownership probe)',
  priority: 'P1',
  source: '`V2/RouteController.php` `simpleRouteView()` (POST `simplerouteview`)',
  cases: [
    {
      id: 'TC-F09-001', title: 'My already-open route loads with its stops', type: 'happy', role: 'Sales Agent', refs: ['S2.4'],
      pre: 'a published route whose `is_route_open` is 1 (so the call writes nothing)', steps: '1. pick such a route from `routelist`\n2. POST `simplerouteview` with `route_id`',
      expected: 'HTTP 200; `status` 1; `data` present',
      async run(t, { account }) {
        const id = await openRoute(account);
        if (!id) return t.blocked('no already-open published route');
        const r = await call('simplerouteview', { body: { route_id: id }, token: await token(account), timeout: 90000 });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.ok(hasStops(r.json), '`status` 1 with `data`');
      },
    },
    {
      id: 'TC-F09-002', title: 'Another user\'s route is not returned (S3.8)', type: 'security', role: 'Sales Agent', refs: ['S3.8'],
      knownGap: 'UI-SEC-11',
      pre: 'the Business Sales Agent owns an already-open route', steps: '1. confirm, as the Business Sales Agent, that its route loads\n2. POST `simplerouteview` with that `route_id` **as the Sales Agent** (a non-owner call never writes)',
      expected: 'the owner gets the route; the other user gets no stops. **Today the non-owner receives the same `route_details` as the owner** (runtime 2026-09-16, known gap UI-SEC-11)',
      async run(t, { account }) {
        const E = require('../lib/env.js');
        const other = E.readAccounts()['Business Sales Agent'];
        if (!other) return t.blocked('no Business Sales Agent account');
        const id = await openRoute(other);
        if (!id) return t.blocked('the other user has no already-open route');
        const own = await call('simplerouteview', { body: { route_id: id }, token: await token(other), timeout: 90000 });
        if (!hasStops(own.json)) return t.blocked('inconclusive: the owner read returned no route');
        const r = await call('simplerouteview', { body: { route_id: id }, token: await token(account), timeout: 90000 });
        const d = r.json && r.json.data;
        // Runtime shape: data{route_companies, route_type, route_status, route_details[], shared_email_list[], …}; the stops are route_details.
        const stops = d && d.route_details;
        const leaked = String(r.json && r.json.status) === '1' && Array.isArray(stops) && stops.length > 0;
        t.ok(!leaked, 'no stops from another account');
      },
    },
  ],
};
