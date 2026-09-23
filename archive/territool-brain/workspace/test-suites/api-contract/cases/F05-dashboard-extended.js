/**
 * F05 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F05',
  slug: 'dashboard-extended',
  title: 'Dashboard (extended read contract)',
  priority: 'P1',
  source: 'getUserActivity (POST scope); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F05-005', 'getUserActivity', { body: { scope: 'recent' } }),
    {
      id: 'TC-F05-006', title: '`getUserActivity` treats an unknown scope as "all activity" (documented fallback)', type: 'validation', role: 'Sales Agent', refs: ['S2.4'],
      pre: 'Sales Agent', steps: '1. POST `getUserActivity` with `scope=not-a-scope`',
      expected: 'HTTP 200; `status` 1; `data` is an array — `V2/AuthController.php:853-859` falls back to all activity for any scope other than recent/latest/weekly; no 5xx, no SQL text',
      async run(t, { account }) {
        const { call } = require('../lib/env.js');
        const { token } = require('../lib/session.js');
        const r = await call('getUserActivity', { body: { scope: 'not-a-scope' }, token: await token(account), timeout: 60000 });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.is(r.json && r.json.status, 1, '`status` is 1 (fallback, not an error)');
        t.ok(r.json && Array.isArray(r.json.data), '`data` is an array');
        t.ok(!/SQLSTATE/.test(r.text), 'no SQL error text');
      },
    },
  ],
};
