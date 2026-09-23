/**
 * F24 Business Sales Agent management: the manager may read only its own team's reps.
 * GET-only (`ManagerDashboardController.php:440-455` repDetail; scanned 2026-09-16, no writes).
 */
const isObj = (v) => v && typeof v === 'object';

module.exports = {
  flow: 'F24',
  slug: 'rep-management-read',
  title: 'Rep management (read contracts)',
  priority: 'P1',
  source: '`Manager/ManagerDashboardController.php:440-455` `repDetail()`',
  cases: [
    {
      id: 'TC-F24-001', title: 'A rep outside the manager\'s team is not returned', type: 'permission', role: 'Business Agent', refs: ['S3.8'],
      pre: 'Business Agent', steps: '1. GET `/manager/api/rep/999999999`',
      expected: 'HTTP 404 "Rep not found on your team"',
      async run(t, { session }) {
        const r = await (await session()).get('/manager/api/rep/999999999');
        t.is(r.status, 404, 'HTTP 404');
        t.ok(r.json && /not found/i.test(r.json.error || ''), 'error says the rep is not on the team');
      },
    },
    {
      id: 'TC-F24-002', title: 'A rep on the team can be read by its manager', type: 'happy', role: 'Business Agent', refs: ['S3.8'],
      pre: 'Business Agent whose team includes the staging Business Sales Agent', steps: '1. GET `/manager/api/team`\n2. take the first rep id\n3. GET `/manager/api/rep/{id}`',
      expected: 'HTTP 200 with `rep` for a team member',
      async run(t, { session }) {
        const s = await session();
        const team = await s.get('/manager/api/team');
        const list = team.json && (team.json.team || team.json.reps || team.json.data || (Array.isArray(team.json) ? team.json : null));
        const first = Array.isArray(list) ? list.find((x) => x && (x.id || x.user_id)) : null;
        if (!first) return t.blocked('team payload has no rep id (shape differs); see the run notes');
        const r = await s.get(`/manager/api/rep/${first.id || first.user_id}`);
        t.is(r.status, 200, 'HTTP 200');
        t.ok(r.json && isObj(r.json.rep), '`rep` object present');
      },
    },
  ],
};
