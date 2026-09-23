/**
 * F11 Lists — parity (2026-09-17): the number of lists the mobile API returns equals the web "Total Lists" card.
 * Read-only: GET `getlist` (V2/ListController.php:51) and GET /lists (ListController@index, no writes).
 */
const { E, apiFor, stats } = require('../lib/parity.js');

const parity = (id, role) => ({
  id, title: `${role}: mobile API list count equals the web "Total Lists"`, type: 'parity', role, refs: ['S3', 'S2.4'],
  pre: `${role} account`, steps: '1. GET `getlist` (V2) as the role\n2. GET `/lists` on the web as the same role\n3. compare `data.lists.length` with the "Total Lists" card',
  expected: 'the two counts are equal',
  async run(t, { session }) {
    const tk = await apiFor(role);
    if (!tk) return t.blocked(`no ${role} account`);
    const api = await E.call('getlist', { method: 'GET', token: tk });
    const web = await (await session()).get('/lists');
    const n = (api.json && api.json.data && api.json.data.lists || []).length;
    const s = stats(web.text);
    t.is(web.status, 200, 'web /lists HTTP 200');
    t.ok(Number.isFinite(s['Total Lists']), 'web shows a Total Lists card');
    t.is(n, s['Total Lists'], 'API list count = web Total Lists');
  },
});

module.exports = {
  flow: 'F11', slug: 'lists-parity', title: 'Lists (mobile API ↔ web parity)', priority: 'P1',
  source: '`V2/ListController.php:51` `getLists()`; `ListController.php` `index()` (totalListsCount)',
  cases: [parity('TC-F11-006', 'Sales Agent'), parity('TC-F11-007', 'Business Sales Agent')],
};
