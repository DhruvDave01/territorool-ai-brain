/**
 * F27 Notifications: the list API works although the mobile Notifications screen is unreachable.
 * Read-only (`notificationListing()` scanned 2026-09-16). NOT `newreleasenotify`: it sends an FCM push.
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

module.exports = {
  flow: 'F27',
  slug: 'notifications-read',
  title: 'Notifications (read contract)',
  priority: 'P3',
  source: '`V2/RouteController.php` `notificationListing()` (GET `notificationlist`)',
  cases: [
    {
      id: 'TC-F27-001', title: 'Alert list with unread count', type: 'happy', role: 'Sales Agent', refs: ['M3'],
      pre: 'Sales Agent', steps: '1. GET `notificationlist`',
      expected: 'HTTP 200; `status` 1; `data` is an array of `{id, title, description, is_read, created_at}`; `unread_count` is a number. The endpoint is **not paginated** (1,088 items for this account on 2026-09-16)',
      async run(t, { account }) {
        const r = await call('notificationlist', { method: 'GET', token: await token(account), timeout: 60000 });
        t.is(r.json && r.json.status, 1, '`status` is 1');
        const d = (r.json && r.json.data) || [];
        t.ok(Array.isArray(d), '`data` is an array');
        t.ok(!d[0] || (d[0].id !== undefined && typeof d[0].title === 'string' && 'is_read' in d[0]), 'an alert has id, title, is_read');
        t.ok(typeof (r.json && r.json.unread_count) === 'number', '`unread_count` is a number');
      },
    },
  ],
};
