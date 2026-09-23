/**
 * F12 Companies (Address Book): read contract of `companylist`. Read-only (`companyList()` scanned 2026-09-16).
 * The mobile app sends `limit=0` (all rows) or `page`; this suite asks for the first page only.
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

module.exports = {
  flow: 'F12',
  slug: 'companies-read',
  title: 'Companies / Address Book (read contract)',
  priority: 'P1',
  source: '`V2/RouteController.php:1517` `companyList()` (POST `companylist`); mobile `route/create.js:841`',
  cases: [
    {
      id: 'TC-F12-001', title: 'Address Book first page', type: 'happy', role: 'Sales Agent', refs: ['M3', 'S2.4'],
      pre: 'Sales Agent with saved companies', steps: '1. POST `companylist` with `page=0`, `sort_order=asc`',
      expected: 'HTTP 200; `status` 1; `data` holds the companies (≤ 20 per page, the controller default)',
      async run(t, { account }) {
        const r = await call('companylist', { body: { page: 0, sort_order: 'asc' }, token: await token(account), timeout: 60000 });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.is(r.json && r.json.status, 1, '`status` is 1');
        t.ok(r.json && r.json.data !== undefined, '`data` is present');
      },
    },
    {
      id: 'TC-F12-002', title: 'A request with no parameters fails cleanly, not with an SQL error', type: 'negative', role: 'Sales Agent', refs: ['W12', 'S5.4'],
      knownGap: 'UI-API-02',
      pre: 'Sales Agent', steps: '1. POST `companylist` with an empty body',
      expected: 'A handled failure (HTTP 200 `status` 0, or 4xx) with no SQL text and no `debug` block. **Today: HTTP 500 with the MySQL error text (SQLSTATE 42000) and a stack trace**',
      async run(t, { account }) {
        const r = await call('companylist', { body: {}, token: await token(account), timeout: 60000 });
        t.ok(r.httpStatus < 500, 'no HTTP 5xx');
        t.ok(!/SQLSTATE/.test(r.text), 'no SQL error text in the body');
        t.ok(!(r.json && 'debug' in r.json), 'no `debug` block');
      },
    },
    {
      id: 'TC-F12-003', title: 'Another user\'s company detail is not returned (S3.8)', type: 'security', role: 'Sales Agent', refs: ['S3.8'],
      pre: 'the Sales Agent owns companies', steps: '1. read a company id and its detail as the Sales Agent (the owner)\n2. POST `companydetail` with that id **as the Business Sales Agent**',
      expected: 'the owner gets the company; the other user gets none (the query is scoped to the caller, `V2/RouteController.php:2170`)',
      async run(t, { account }) {
        const E = require('../lib/env.js');
        const { companyIds } = require('./F10-visits-read.js');
        const other = E.readAccounts()['Business Sales Agent'];
        if (!other) return t.blocked('no Business Sales Agent account');
        const has = (j) => !!(j && String(j.status) === '1' && j.data && (Array.isArray(j.data) ? j.data.length : Object.keys(j.data).length));
        const id = (await companyIds(account))[0];
        const own = await call('companydetail', { body: { company_id: id }, token: await token(account), timeout: 60000 });
        if (!has(own.json)) return t.blocked('inconclusive: the owner read returned no company');
        const r = await call('companydetail', { body: { company_id: id }, token: await token(other), timeout: 60000 });
        const leaked = has(r.json);
        t.ok(!leaked, 'no company data from another account');
      },
    },
  ],
};
