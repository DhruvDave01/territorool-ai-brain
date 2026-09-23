/**
 * F01 Login — parity (2026-09-17): who may sign in, on the mobile API and on the web, with the same credentials.
 * Rule (brain/context/parity-map.md F01, roles-permissions): Sales Agent and Business Sales Agent sign in on
 * both; the Business Agent is refused by the mobile API and admitted on the web (web-only role, owner-confirmed).
 */
const { E } = require('../lib/parity.js');

const apiLogin = async (role) => {
  const a = E.readAccounts()[role];
  if (!a) return null;
  E.classify(a.email, a.pass);
  const r = await E.call('login', { body: { email: a.email, password: a.pass, device_type: 'ios', device_token: 'QA-AUTO-contract' } });
  return !!(r.json && r.json.data && r.json.data.token);
};

const both = (id, role) => ({
  id, title: `${role} signs in on both the mobile API and the web`, type: 'parity', role, refs: ['S3', 'BT-2'],
  pre: `${role} account`, steps: '1. POST V2 `login` with the role\'s credentials\n2. sign in through the web `/login` form\n3. GET `/lists` with that session',
  expected: 'an API token, and a signed-in web session (HTTP 200 on /lists, not a redirect to /login)',
  async run(t, { session }) {
    const api = await apiLogin(role);
    if (api === null) return t.blocked(`no ${role} account`);
    t.ok(api, 'mobile API issues a token');
    const web = await (await session()).get('/lists');
    t.is(web.status, 200, 'web session reaches /lists');
  },
});

module.exports = {
  flow: 'F01', slug: 'login-parity', title: 'Login (mobile API ↔ web parity)', priority: 'P0',
  source: '`V2/AuthController.php` `login()`; `Auth/LoginController.php:44-50, 134-138`',
  cases: [
    both('TC-F01-011', 'Sales Agent'),
    both('TC-F01-012', 'Business Sales Agent'),
    {
      id: 'TC-F01-013', title: 'Business Agent: refused by the mobile API, admitted to the web portal (intentional)', type: 'parity', role: 'Business Agent', refs: ['S3', 'F23'],
      pre: 'Business Agent account', steps: '1. POST V2 `login` as the Business Agent\n2. sign in on the web\n3. GET `/manager/api/kpis`',
      expected: 'no API token; the web portal API answers HTTP 200 (the documented, intentional difference)',
      async run(t, { session }) {
        const api = await apiLogin('Business Agent');
        if (api === null) return t.blocked('no Business Agent account');
        t.ok(!api, 'mobile API refuses the Business Agent');
        const web = await (await session()).get('/manager/api/kpis');
        t.is(web.status, 200, 'web portal admits the Business Agent');
      },
    },
  ],
};
