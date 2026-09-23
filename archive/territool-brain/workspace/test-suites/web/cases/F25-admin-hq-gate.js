/**
 * F25 Admin HQ — role gate (2026-09-17). GET only. Runtime baseline: brain/context/web-flows.md access matrix
 * (non-admin roles are sent away from /hq/*). Admin itself is not signed in here: /hq/login has a reCAPTCHA.
 */
const away = (id, role, target) => ({
  id, title: `${role} is sent away from /hq/dashboard`, type: 'permission', role, refs: ['S3.8', 'BT-1'],
  pre: `${role} account`, steps: '1. sign in through /login\n2. GET `/hq/dashboard`',
  expected: `a redirect away from /hq (first hop ${target}; web-flows.md records the final page after all redirects); no HQ content`,
  async run(t, { session }) {
    const r = await (await session()).get('/hq/dashboard');
    t.ok([301, 302].includes(r.status), `redirected (HTTP ${r.status})`);
    t.ok(new RegExp(`${target.replace(/\//g, '\\/')}$`).test(r.location || ''), `to ${target} (got ${r.location})`);
  },
});
module.exports = {
  flow: 'F25', slug: 'admin-hq-gate', title: 'Admin HQ (role gate)', priority: 'P2',
  source: '`CheckUserRole.php:20-40`; brain/context/web-flows.md access matrix',
  cases: [
    {
      id: 'TC-F25-001', title: 'An anonymous request is sent to the HQ login', type: 'negative', role: 'Public', refs: ['S3.8'],
      pre: 'none', steps: '1. GET `/hq/dashboard` without a session', expected: 'a redirect to `/hq/login`',
      async run(t, { session }) {
        const r = await (await session()).get('/hq/dashboard');
        t.ok([301, 302].includes(r.status), `redirected (HTTP ${r.status})`);
        t.ok(/\/hq\/login$/.test(r.location || ''), `to /hq/login (got ${r.location})`);
      },
    },
    away('TC-F25-002', 'Sales Agent', '/dashboard'),
    away('TC-F25-003', 'Business Sales Agent', '/dashboard'),
    away('TC-F25-004', 'Business Agent', '/dashboard'),
  ],
};
