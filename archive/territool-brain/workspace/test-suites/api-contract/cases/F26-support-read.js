/**
 * F26 Support tickets: the API exists although the mobile app has no support screen (api-map: no mobile caller).
 * Read-only (actions scanned 2026-09-16).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

module.exports = {
  flow: 'F26',
  slug: 'support-read',
  title: 'Support tickets (read contracts)',
  priority: 'P3',
  source: '`V2/SupportController.php` `getTicket()`, `unreadTicketCount()`',
  cases: [
    {
      id: 'TC-F26-001', title: 'Ticket list for the signed-in user', type: 'happy', role: 'Sales Agent', refs: ['S3.8'],
      pre: 'Sales Agent', steps: '1. POST `getticket` with an empty body',
      expected: 'HTTP 200; `status` 1; `tickets` is an array (top-level, not under `data`)',
      async run(t, { account }) {
        const r = await call('getticket', { body: {}, token: await token(account) });
        t.is(r.json && r.json.status, 1, '`status` is 1');
        t.ok(Array.isArray(r.json && r.json.tickets), '`tickets` is a top-level array');
      },
    },
    {
      id: 'TC-F26-002', title: 'Unread ticket count', type: 'happy', role: 'Business Sales Agent', refs: ['M3'],
      pre: 'Business Sales Agent', steps: '1. POST `unreadticketcount` with an empty body',
      expected: 'HTTP 200; `status` 1',
      async run(t, { account }) {
        const r = await call('unreadticketcount', { body: {}, token: await token(account) });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.is(r.json && r.json.status, 1, '`status` is 1');
      },
    },
  ],
};
