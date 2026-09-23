/**
 * F26 Support tickets — parity (2026-09-17): the tickets the mobile API returns equal the web ticket rows.
 * Read-only: POST `getticket` (V2, read) and GET /support (SupportController@index reads support_ticket,
 * top-level tickets only: support_ticket_id = 0).
 */
const { E, apiFor } = require('../lib/parity.js');

const parity = (id, role) => ({
  id, title: `${role}: mobile API ticket count equals the web ticket rows`, type: 'parity', role, refs: ['S3', 'S2.4'],
  pre: `${role} account`, steps: '1. POST `getticket` (V2) as the role\n2. GET `/support` on the web as the same role\n3. compare `tickets.length` with the number of "View Detail" rows',
  expected: 'the two counts are equal',
  async run(t, { session }) {
    const tk = await apiFor(role);
    if (!tk) return t.blocked(`no ${role} account`);
    const api = await E.call('getticket', { body: {}, token: tk });
    const web = await (await session()).get('/support');
    t.is(web.status, 200, 'web /support HTTP 200');
    t.is((api.json && api.json.tickets || []).length, (web.text.match(/View Detail/g) || []).length, 'API tickets = web rows');
  },
});

module.exports = {
  flow: 'F26', slug: 'support-parity', title: 'Support tickets (mobile API ↔ web parity)', priority: 'P3',
  source: '`V2` `getticket`; `SupportController.php:35-50` `index()`',
  cases: [parity('TC-F26-006', 'Sales Agent'), parity('TC-F26-007', 'Business Sales Agent')],
};
