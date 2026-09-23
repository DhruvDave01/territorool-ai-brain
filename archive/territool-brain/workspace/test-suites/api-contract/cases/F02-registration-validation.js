/**
 * F02 Registration: validation-only contract of `mobileregistration`. Every request here FAILS validation, so
 * no user is created (the validator runs before any insert: `V2/AuthController.php:259-288`). A field that would
 * let a request pass is always left out on purpose.
 */
const { call } = require('../lib/env.js');

module.exports = {
  flow: 'F02',
  slug: 'registration-validation',
  title: 'Registration (validation-only contract)',
  priority: 'P0',
  source: '`V2/AuthController.php:259` `mobileRegister()` (POST `mobileregistration`)',
  cases: [
    {
      id: 'TC-F02-001', title: 'Registration with nothing but an email is refused by validation', type: 'validation', role: 'Public', refs: ['KG-P2'],
      pre: 'None', steps: '1. POST `mobileregistration` with `email` only (an `example.invalid` address)',
      expected: 'HTTP 200; `status` "0"; a message naming the first missing field; no account is created (`name`, `password`, `country`, `device_type` are required)',
      async run(t) {
        const r = await call('mobileregistration', { body: { email: 'qa-auto-f02@example.invalid' } });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.is(r.json && r.json.status, '0', '`status` is "0"');
        t.ok(r.json && /required/i.test(r.json.message || ''), 'the message says a field is required');
      },
    },
    {
      id: 'TC-F02-002', title: 'An email that is already registered is refused', type: 'negative', role: 'Sales Agent', refs: ['KG-P2'],
      pre: 'The staging Sales Agent exists', steps: '1. POST `mobileregistration` with that email, a name, country and device_type, **and no password** (so it can never pass)',
      expected: 'HTTP 200; `status` "0"; the first message says the email is already taken',
      async run(t, { account }) {
        const r = await call('mobileregistration', { body: { name: 'QA-AUTO-20260916', email: account.email, country: 'US', device_type: 'ios' } });
        t.is(r.json && r.json.status, '0', '`status` is "0"');
        t.ok(r.json && /taken|already/i.test(r.json.message || ''), 'the message says the email is taken');
      },
    },
    {
      id: 'TC-F02-003', title: 'API registration rejects a malformed email (BT target: match web)', type: 'validation', role: 'Public', refs: ['KG-P2'],
      knownGap: 'KG-P2',
      pre: 'None', steps: '1. POST `mobileregistration` with `email=not-an-email`, a name, country, device_type, **no password**',
      expected: 'the first error is about the email format. **Today the API has no email-format rule**, so the first error is the missing password (known gap KG-P2)',
      async run(t) {
        const r = await call('mobileregistration', { body: { name: 'QA-AUTO-20260916', email: 'not-an-email', country: 'US', device_type: 'ios' } });
        t.is(r.json && r.json.status, '0', 'refused');
        t.ok(r.json && /email/i.test(r.json.message || ''), 'the first error is about the email');
      },
    },
  ],
};
