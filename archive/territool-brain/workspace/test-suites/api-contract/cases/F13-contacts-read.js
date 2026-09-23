/**
 * F13 Contacts: the contact list read. Read-only (`contactList()` scanned 2026-09-16; it builds SQL from `scrtext`,
 * which this suite never sends).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

const listCase = (id, role) => ({
  id, title: `${role} contact list first page`, type: 'happy', role, refs: ['S2.4'],
  pre: `${role} account`, steps: '1. POST `contactlist` with `page=0`',
  expected: 'HTTP 200; `status` 1 (or 0 with a message when the user has no contacts)',
  async run(t, { account }) {
    const r = await call('contactlist', { body: { page: 0 }, token: await token(account), timeout: 60000 });
    t.is(r.httpStatus, 200, 'HTTP 200');
    t.ok(r.json && [0, 1, '0', '1'].includes(r.json.status), 'a handled status');
  },
});

module.exports = {
  flow: 'F13',
  slug: 'contacts-read',
  title: 'Contacts (read contract)',
  priority: 'P1',
  source: '`V2/RouteController.php:2388` `contactList()`',
  cases: [listCase('TC-F13-001', 'Sales Agent'), listCase('TC-F13-002', 'Business Sales Agent')],
};
