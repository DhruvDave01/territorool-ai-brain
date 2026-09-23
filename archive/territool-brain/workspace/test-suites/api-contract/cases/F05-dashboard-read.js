/**
 * F05 Dashboard: read contracts behind the mobile header credits pill and the Recent activity tab.
 * Read-only: both actions were scanned for writes on 2026-09-16 (none; `getusercredit` reads Stripe for
 * Stripe-paid plans). One cached login per role (lib/session.js).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

const n = (v) => typeof v === 'number';

module.exports = {
  flow: 'F05',
  slug: 'dashboard-read',
  title: 'Dashboard, activity feed (read contracts)',
  priority: 'P1',
  source: '`V2/RouteController.php` `getUserCredit()` (GET `getusercredit`), `V2/AuthController.php:845` `getUserActivity()`',
  cases: [
    {
      id: 'TC-F05-001', title: 'Sales Agent credit balance has the shape the header pill reads', type: 'happy', role: 'Sales Agent', refs: ['M3', 'S2.4'],
      pre: 'Sales Agent with an active plan', steps: '1. GET `getusercredit` with the Bearer token',
      expected: 'HTTP 200; `status` 1 (number); `data.leads` has numeric `total_credit` and `used_credit`, plus `package_name`; `is_subscription_expired` boolean; `unread_route_count` / `unread_list_count` numbers (the dashboard tile badges)',
      async run(t, { account }) {
        const r = await call('getusercredit', { method: 'GET', token: await token(account) });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.is(r.json && r.json.status, 1, '`status` is the number 1');
        const leads = r.json && r.json.data && r.json.data.leads;
        t.ok(leads && n(leads.total_credit) && n(leads.used_credit), '`data.leads` has numeric total_credit and used_credit');
        t.ok(leads && typeof leads.package_name === 'string', 'a Sales Agent credit row names its package');
        t.ok(typeof r.json.is_subscription_expired === 'boolean', '`is_subscription_expired` is boolean');
        t.ok(n(r.json.unread_route_count) && n(r.json.unread_list_count), 'route/list badge counts are numbers');
      },
    },
    {
      id: 'TC-F05-002', title: 'Business Sales Agent credits come from the manager allotment', type: 'permission', role: 'Business Sales Agent', refs: ['S3.2'],
      pre: 'Business Sales Agent under a Business Agent', steps: '1. GET `getusercredit` with the BSA token',
      expected: 'HTTP 200; `status` 1; `data.leads.alloted_credits` is a number (manager-allotted credits); no `package_name` on the row (the BSA has no plan of its own)',
      async run(t, { account }) {
        const r = await call('getusercredit', { method: 'GET', token: await token(account) });
        t.is(r.json && r.json.status, 1, '`status` is 1');
        const leads = r.json && r.json.data && r.json.data.leads;
        t.ok(leads && n(leads.alloted_credits), '`alloted_credits` is present for a BSA');
        t.ok(leads && !('package_name' in leads), 'no own package on a BSA credit row');
      },
    },
    {
      id: 'TC-F05-003', title: 'Recent activity returns at most five items', type: 'happy', role: 'Sales Agent', refs: ['M3'],
      pre: 'Sales Agent with activity history', steps: '1. POST `getUserActivity` with `scope=recent`',
      expected: 'HTTP 200; `status` 1; `data` is an array of ≤ 5 items (the controller takes the latest 5 for `recent`)',
      async run(t, { account }) {
        const r = await call('getUserActivity', { body: { scope: 'recent' }, token: await token(account) });
        t.is(r.json && r.json.status, 1, '`status` is 1');
        t.ok(Array.isArray(r.json && r.json.data) && r.json.data.length <= 5, '`data` is an array of at most 5');
      },
    },
    {
      id: 'TC-F05-004', title: 'A missing token gets 401 without server internals', type: 'security', role: 'Public', refs: ['S0.4', 'W13'],
      knownGap: 'UI-SEC-02',
      pre: 'None', steps: '1. GET `getusercredit` with no Authorization header',
      expected: 'HTTP 401 with a message. **No `debug` block** (file, line, trace). Today staging returns the Dingo `debug` block, so this is a known gap until `API_DEBUG` is off on staging',
      async run(t) {
        const r = await call('getusercredit', { method: 'GET' });
        t.is(r.httpStatus, 401, 'HTTP 401');
        t.ok(r.json && typeof r.json.message === 'string', 'a message is returned');
        t.ok(r.json && !('debug' in r.json), 'no `debug` block (file, line, trace) is exposed');
      },
    },
  ],
};
