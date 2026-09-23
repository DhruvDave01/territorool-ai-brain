/**
 * F24 Rep management — extended read contract (2026-09-17). GET-only (`repDetail`, scanned 2026-09-16).
 */
const CRED = /"(password|remember_token|api_key|secret|client_secret|access_token|refresh_token)"\s*:/i;

module.exports = {
  flow: 'F24',
  slug: 'rep-management-extended',
  title: 'Rep management (extended read contract)',
  priority: 'P1',
  source: '`Manager/ManagerDashboardController.php:440-455` `repDetail()`',
  cases: [
    {
      id: 'TC-F24-003', title: 'A non-numeric rep id is refused cleanly', type: 'validation', role: 'Business Agent', refs: ['S2.4'],
      pre: 'Business Agent', steps: '1. GET `/manager/api/rep/not-a-number`',
      expected: 'HTTP 404 (route constraint or "not found"); no rep data; no stack trace',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/rep/not-a-number');
        t.ok(r.status >= 400 && r.status < 500, `refused with 4xx (HTTP ${r.status})`);
        t.ok(!(r.json && r.json.rep), 'no rep data');
        t.ok(!/Stack trace|SQLSTATE/.test(r.text), 'no stack trace or SQL text');
      },
    },
    {
      id: 'TC-F24-004', title: 'Rep id 0 is not a team member', type: 'edge-data', role: 'Business Agent', refs: ['S3.8'],
      pre: 'Business Agent', steps: '1. GET `/manager/api/rep/0`',
      expected: 'HTTP 404 "not found on your team"',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/rep/0');
        t.is(r.status, 404, 'HTTP 404');
        t.ok(!(r.json && r.json.rep), 'no rep data');
      },
    },
    {
      id: 'TC-F24-005', title: 'An anonymous request cannot read a rep', type: 'negative', role: 'Public', refs: ['S3.8'],
      pre: 'None', steps: '1. GET `/manager/api/rep/1` without a session',
      expected: 'HTTP 401 or a redirect to /login; no rep data',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/rep/1');
        t.ok([301, 302, 401].includes(r.status), `turned away (HTTP ${r.status})`);
        t.ok(!(r.json && r.json.rep), 'no rep data');
      },
    },
    {
      id: 'TC-F24-006', title: 'A rep payload carries no credential fields', type: 'security', role: 'Business Agent', refs: ['S0.4', 'QG-12'],
      pre: 'Business Agent with a team', steps: '1. GET `/manager/api/team`\n2. GET `/manager/api/rep/{first id}`\n3. scan the raw body',
      expected: 'HTTP 200 and no `password` / `remember_token` / token keys',
      async run(t, { session }) {
        const s = await session();
        const team = await s.get('/manager/api/team');
        const list = team.json && (team.json.team || team.json.reps || team.json.data || (Array.isArray(team.json) ? team.json : null));
        const first = Array.isArray(list) ? list.find((x) => x && (x.id || x.user_id)) : null;
        if (!first) return t.blocked('team payload has no rep id');
        const r = await s.get(`/manager/api/rep/${first.id || first.user_id}`);
        t.is(r.status, 200, 'HTTP 200');
        t.ok(!CRED.test(r.text), 'no credential keys');
      },
    },
  ],
};
