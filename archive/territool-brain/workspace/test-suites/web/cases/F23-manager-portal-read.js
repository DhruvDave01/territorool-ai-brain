/**
 * F23 Manager portal / F24 rep management: read contracts of the portal's JSON API and its role gate.
 * Every endpoint is a GET that ManagerDashboardController answers from ManagerDashboardService read paths
 * (scanned 2026-09-16: no writes; the only write in the service marks a support ticket read, not used here).
 */
const isObj = (v) => v && typeof v === 'object';

module.exports = {
  flow: 'F23',
  slug: 'manager-portal-read',
  title: 'Manager portal API and role gate (read contracts)',
  priority: 'P1',
  source: '`routes/web.php:186-229`; `Manager/ManagerDashboardController.php:344-455, 692-697`',
  cases: [
    ...['kpis', 'team', 'feed', 'sidebar-stats', 'dashboard-data'].map((ep, i) => ({
      id: `TC-F23-00${i + 1}`, title: `Business Agent reads /manager/api/${ep}`, type: 'happy', role: 'Business Agent', refs: ['S3.8'],
      pre: 'Business Agent with a team', steps: `1. sign in through /login\n2. GET \`/manager/api/${ep}\``,
      expected: 'HTTP 200 with a JSON object (no redirect)',
      async run(t, { session }) {
        const s = await session();
        const r = await s.get(`/manager/api/${ep}`);
        t.is(r.status, 200, 'HTTP 200');
        t.ok(isObj(r.json), 'a JSON body');
      },
    })),
    {
      id: 'TC-F23-006', title: 'A Sales Agent is turned away from the portal API', type: 'permission', role: 'Sales Agent', refs: ['S3.8'],
      pre: 'Sales Agent', steps: '1. sign in as a Sales Agent\n2. GET `/manager/api/kpis`',
      expected: 'a redirect (to /dashboard); no JSON data',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/kpis');
        t.ok([301, 302].includes(r.status), 'redirected, not served');
        t.ok(!(r.json && (r.json.kpis || r.json.data)), 'no portal data in the body');
      },
    },
    {
      id: 'TC-F23-007', title: 'An anonymous request is turned away from the portal API', type: 'security', role: 'Public', refs: ['S3.8'],
      pre: 'None', steps: '1. GET `/manager/api/team` without a session',
      expected: 'HTTP 401 `{error}` (or a redirect to /login); no team data',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/team');
        t.ok([301, 302, 401].includes(r.status), 'redirected or 401');
        // Runtime 2026-09-16: HTTP 401 with body {error}. Only data-bearing keys would be a leak.
        t.ok(!(r.json && (r.json.team || r.json.reps || r.json.data)), 'no team data in the body');
      },
    },
  ],
};
