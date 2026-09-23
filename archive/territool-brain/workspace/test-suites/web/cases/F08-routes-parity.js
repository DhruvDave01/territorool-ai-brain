/**
 * F08 Routes — parity (2026-09-17): published and draft route counts from the mobile API equal the web cards.
 * Read-only: GET `routelist` (V2) and GET /routes (web index).
 */
const { E, apiFor, stats } = require('../lib/parity.js');

const parity = (id, role) => ({
  id, title: `${role}: mobile API published/draft counts equal the web route cards`, type: 'parity', role, refs: ['S3', 'S2.4'],
  pre: `${role} account`, steps: '1. GET `routelist` (V2) as the role\n2. GET `/routes` on the web as the same role\n3. compare `published_routes` / `draft_routes` lengths with the Published / Draft cards',
  expected: 'published = Published, draft = Draft',
  async run(t, { session }) {
    const tk = await apiFor(role);
    if (!tk) return t.blocked(`no ${role} account`);
    const api = await E.call('routelist', { method: 'GET', token: tk, timeout: 60000 });
    const d = (api.json && api.json.data) || {};
    const web = await (await session()).get('/routes');
    const s = stats(web.text);
    t.is(web.status, 200, 'web /routes HTTP 200');
    t.is((d.published_routes || []).length, s.Published, 'published: API = web');
    t.is((d.draft_routes || []).length, s.Draft, 'draft: API = web');
  },
});

module.exports = {
  flow: 'F08', slug: 'routes-parity', title: 'Routes (mobile API ↔ web parity)', priority: 'P1',
  source: '`V2/RouteController.php` `routeList()` (GET `routelist`); web `/routes` index cards',
  cases: [parity('TC-F08-006', 'Sales Agent'), parity('TC-F08-007', 'Business Sales Agent')],
};
