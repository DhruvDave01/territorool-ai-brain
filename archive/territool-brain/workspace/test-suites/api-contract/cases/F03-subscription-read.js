/**
 * F03 Subscription: the plan fields the mobile Settings screen reads (read-only; `getusercredit`, `getuserdata`).
 * Purchase and cancel are never called (S6.4: no payment setup).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

module.exports = {
  flow: 'F03',
  slug: 'subscription-read',
  title: 'Subscription state (read contracts; purchase waived)',
  priority: 'P0',
  source: '`V2/RouteController.php` `getUserCredit()`; `V2/UserDataController.php` `show()`',
  cases: [
    {
      id: 'TC-F03-001', title: 'Sales Agent subscription block is complete', type: 'happy', role: 'Sales Agent', refs: ['S2.4'],
      pre: 'Sales Agent with an active plan', steps: '1. GET `getuserdata`',
      expected: '`data.subscription` has `package_name`, `status`, `start_date`, `end_date`, `duration`, `payment_method`, `subscription_status`',
      async run(t, { account }) {
        const r = await call('getuserdata', { method: 'GET', token: await token(account), timeout: 60000 });
        const sub = r.json && r.json.data && r.json.data.subscription;
        t.is(r.json && r.json.status, 1, '`status` is 1');
        for (const k of ['package_name', 'status', 'start_date', 'end_date', 'duration', 'payment_method', 'subscription_status']) t.ok(sub && k in sub, `subscription.${k} present`);
      },
    },
    {
      id: 'TC-F03-002', title: 'An active Sales Agent is not flagged as expired', type: 'happy', role: 'Sales Agent', refs: ['S2.4'],
      pre: 'Sales Agent with an active plan', steps: '1. GET `getusercredit`',
      expected: '`is_subscription_expired` is false; `package_isupgrade` is a boolean',
      async run(t, { account }) {
        const r = await call('getusercredit', { method: 'GET', token: await token(account) });
        t.is(r.json && r.json.is_subscription_expired, false, 'not expired');
        t.ok(typeof (r.json && r.json.package_isupgrade) === 'boolean', '`package_isupgrade` is boolean');
      },
    },
    {
      id: 'TC-F03-003', title: 'Purchase, upgrade and cancel are not exercised', type: 'waived', role: 'Sales Agent', refs: ['S6.4'],
      pre: 'A staging payment sandbox (Q-T5)', steps: '—',
      expected: '`Waived (owner)`: no payment setup (USER SAID 2026-09-15)',
      async run(t) { t.blocked('Waived (owner): no payment setup, S6.4 / U-PAY-01'); },
    },
  ],
};
