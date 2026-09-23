/**
 * F11 Lists: read contract behind the mobile Lists screen. Read-only (`getLists()` scanned 2026-09-16).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

const listsCase = (id, role) => ({
  id, title: `${role} lists screen data`, type: 'happy', role, refs: ['M3', 'S2.4'],
  pre: `${role} account`, steps: '1. GET `getlist` with the Bearer token',
  expected: 'HTTP 200; `status` 1; `data.lists` is an array; a list has an `id` and a `title`',
  async run(t, { account }) {
    const r = await call('getlist', { method: 'GET', token: await token(account) });
    t.is(r.httpStatus, 200, 'HTTP 200');
    t.is(r.json && r.json.status, 1, '`status` is 1');
    const lists = r.json && r.json.data && r.json.data.lists;
    t.ok(Array.isArray(lists), '`data.lists` is an array');
    t.ok(!lists || !lists[0] || (lists[0].id !== undefined && typeof lists[0].title === 'string'), 'a list has id and title');
  },
});

module.exports = {
  flow: 'F11',
  slug: 'lists-read',
  title: 'Lists (read contract)',
  priority: 'P1',
  source: '`V2/ListController.php` `getLists()` (GET `getlist`)',
  cases: [listsCase('TC-F11-001', 'Sales Agent'), listsCase('TC-F11-002', 'Business Sales Agent')],
};
