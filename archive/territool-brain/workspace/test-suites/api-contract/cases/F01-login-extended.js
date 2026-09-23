/**
 * F01 — extended contract (2026-09-17). An unknown account cannot log in, so no `usertoken` row is written.
 */
const { call } = require('../lib/env.js');

module.exports = {
  flow: 'F01',
  slug: 'login-extended',
  title: 'Login (extended edge data)',
  priority: 'P0',
  source: '`V2/AuthController.php` `login()`',
  cases: [
    {
      id: 'TC-F01-010', title: 'A 260-character unknown email is refused cleanly', type: 'edge-data', role: 'Public', refs: ['S2.4'],
      pre: 'none', steps: '1. POST `login` with a 260-character `example.invalid` address, a password and device fields',
      expected: 'a handled refusal (HTTP 200 `status` 0, or 4xx); no token; no 5xx; no SQL text',
      async run(t) {
        const email = `${'q'.repeat(240)}@example.invalid`;
        const r = await call('login', { body: { email, password: 'QA-AUTO-not-a-password', device_type: 'ios', device_token: 'QA-AUTO-contract' } });
        t.ok(r.httpStatus < 500, `no HTTP 5xx (got ${r.httpStatus})`);
        t.ok(!(r.json && r.json.data && r.json.data.token), 'no token');
        t.ok(!/SQLSTATE/.test(r.text), 'no SQL text');
      },
    },
  ],
};
