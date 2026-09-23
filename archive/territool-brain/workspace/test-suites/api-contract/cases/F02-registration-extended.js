/**
 * F02 — extended contract (2026-09-17). Every request omits `password`, which `mobileRegister` requires
 * (V2/AuthController.php:267-287): validation fails before any insert, so no account can be created.
 */
const { call } = require('../lib/env.js');
const CRED = /"(password|remember_token|api_key|token)"\s*:/i;

module.exports = {
  flow: 'F02',
  slug: 'registration-extended',
  title: 'Registration (extended, no account is ever created)',
  priority: 'P0',
  source: '`V2/AuthController.php:259-287` `mobileRegister()` (validation before insert)',
  cases: [
    {
      id: 'TC-F02-004', title: 'A 300-character name with emoji and no password is refused cleanly', type: 'edge-data', role: 'Public', refs: ['KG-P2', 'S2.4'],
      pre: 'none', steps: '1. POST `mobileregistration` with a 300-character name including emoji, an `example.invalid` email, country and device type — and no password',
      expected: 'HTTP 200; `status` "0"; the message names the missing password; no 5xx; nothing created',
      async run(t) {
        const name = `QA-AUTO-${'Ω😀'.repeat(146)}`.slice(0, 300);
        const r = await call('mobileregistration', { body: { name, email: 'qa-auto-f02-edge@example.invalid', country: 'US', device_type: 'ios' } });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.ok(r.json && String(r.json.status) === '0', '`status` 0');
        t.ok(r.json && /password/i.test(r.json.message || ''), 'refused for the missing password');
      },
    },
    {
      id: 'TC-F02-005', title: 'A refused registration returns no token and no server internals', type: 'security', role: 'Public', refs: ['S0.4', 'UI-SEC-02'],
      pre: 'none', steps: '1. POST `mobileregistration` with name + email only',
      expected: 'no `token` / `password` keys, no `debug` block, no SQL text',
      async run(t) {
        const r = await call('mobileregistration', { body: { name: 'QA-AUTO-20260917', email: 'qa-auto-f02-sec@example.invalid' } });
        t.ok(r.httpStatus < 500, `HTTP < 500 (got ${r.httpStatus})`);
        t.ok(!CRED.test(r.text), 'no token or credential keys');
        t.ok(!(r.json && 'debug' in r.json), 'no `debug` block');
        t.ok(!/SQLSTATE/.test(r.text), 'no SQL text');
      },
    },
  ],
};
