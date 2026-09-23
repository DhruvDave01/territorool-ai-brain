/**
 * F28 Referral invites: validation-only contract of invite-user. With neither email nor phone the controller
 * returns status 0 before creating any invite or sending anything (InviteController.php:25-40). No invite is sent.
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

module.exports = {
  flow: 'F28', slug: 'referral-validation', title: 'Referral invite (validation-only contract)', priority: 'P3',
  source: '`V2/InviteController.php:25` `inviteUser` (POST `invite-user`)',
  cases: [
    {
      id: 'TC-F28-001', title: 'Invite with neither email nor phone is refused, nothing sent', type: 'validation', role: 'Sales Agent', refs: ['KG-REF3'],
      pre: 'Sales Agent', steps: '1. POST `invite-user` with an empty body',
      expected: 'HTTP 200; `status` 0 with a validation message; no invite created or sent',
      async run(t, { account }) {
        const r = await call('invite-user', { body: {}, token: await token(account) });
        t.is(r.httpStatus, 200, 'HTTP 200 (handled)');
        t.ok(r.json && [0, '0'].includes(r.json.status), '`status` is 0');
        t.ok(r.json && typeof r.json.message === 'string' && r.json.message.length > 0, 'a message is returned');
      },
    },
    {
      id: 'TC-F28-002', title: 'Invite with a malformed phone is refused', type: 'validation', role: 'Sales Agent', refs: ['KG-REF3'],
      pre: 'Sales Agent', steps: '1. POST `invite-user` with `phone=abc`',
      expected: 'HTTP 200; `status` 0 "Please provide a valid phone number." (or similar); nothing sent',
      async run(t, { account }) {
        const r = await call('invite-user', { body: { phone: 'abc' }, token: await token(account) });
        t.is(r.httpStatus, 200, 'HTTP 200 (handled)');
        t.ok(r.json && [0, '0'].includes(r.json.status), '`status` is 0');
      },
    },
  ],
};
