/**
 * F23 Manager portal — extended read contract (2026-09-17). GET-only, the same endpoints as the base suite.
 */
const CRED = /"(password|remember_token|api_key|secret|client_secret|access_token|refresh_token)"\s*:/i;

module.exports = {
  flow: 'F23',
  slug: 'manager-portal-extended',
  title: 'Manager portal (extended read contract)',
  priority: 'P1',
  source: '`routes/web.php` manager group; `Manager/ManagerDashboardController.php:344-455`',
  cases: [
    {
      id: 'TC-F23-008', title: 'A Business Sales Agent is turned away from the portal API', type: 'negative', role: 'Business Sales Agent', refs: ['S3.8', 'BT-2'],
      pre: 'Business Sales Agent', steps: '1. sign in as the Business Sales Agent\n2. GET `/manager/api/team`',
      expected: 'a redirect or 401/403; no team data',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/team');
        t.ok([301, 302, 401, 403].includes(r.status), `turned away (HTTP ${r.status})`);
        t.ok(!(r.json && (r.json.team || r.json.reps || r.json.data)), 'no team data in the body');
      },
    },
    {
      id: 'TC-F23-009', title: 'Portal payloads carry no credential fields', type: 'security', role: 'Business Agent', refs: ['S0.4', 'QG-12'],
      pre: 'Business Agent', steps: '1. GET `/manager/api/team`, `/manager/api/kpis`, `/manager/api/feed`\n2. scan each raw body for credential keys',
      expected: 'HTTP 200 and no `password` / `remember_token` / token keys in any body',
      async run(t, { session }) {
        const s = await session();
        for (const ep of ['team', 'kpis', 'feed']) {
          const r = await s.get(`/manager/api/${ep}`);
          t.is(r.status, 200, `${ep}: HTTP 200`);
          t.ok(!CRED.test(r.text), `${ep}: no credential keys`);
        }
      },
    },
    {
      id: 'TC-F23-010', title: 'An unknown portal API path is not served as data', type: 'edge-data', role: 'Business Agent', refs: ['S2.4'],
      pre: 'Business Agent', steps: '1. GET `/manager/api/does-not-exist`',
      expected: 'HTTP 404 (or a redirect); no JSON data; no stack trace',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/does-not-exist');
        t.ok([301, 302, 404, 405].includes(r.status), `not served (HTTP ${r.status})`);
        t.ok(!(r.json && (r.json.data || r.json.team || r.json.kpis)), 'no data');
        t.ok(!/Stack trace|vendor\/laravel/.test(r.text), 'no stack trace');
      },
    },
  ],
};
