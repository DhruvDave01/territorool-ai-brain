/**
 * F06 AI Find Leads: the saved-search read that restores the last search on mobile (EV-M06). Searching calls a
 * provider and saving spends credits, so neither is called here.
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

const readCase = (id, role) => ({
  id, title: `${role} saved AI search can be read`, type: 'happy', role, refs: ['S2.4'],
  pre: `${role} with a saved AI search (seen on mobile, EV-M06)`, steps: '1. GET `getAiLeadData`',
  expected: 'HTTP 200; `status` 1; a `data` key is present',
  async run(t, { account }) {
    const r = await call('getAiLeadData', { method: 'GET', token: await token(account) });
    t.is(r.httpStatus, 200, 'HTTP 200');
    t.is(r.json && r.json.status, 1, '`status` is 1');
    t.ok(r.json && 'data' in r.json, '`data` present');
  },
});

module.exports = {
  flow: 'F06',
  slug: 'ai-leads-read',
  title: 'AI Find Leads (read contract; search and save waived)',
  priority: 'P1',
  source: '`V2/CompanyController.php` `getAiLeadData()` → `Helper::getAiLeadData`',
  cases: [
    readCase('TC-F06-001', 'Sales Agent'),
    readCase('TC-F06-002', 'Business Sales Agent'),
    {
      id: 'TC-F06-003', title: 'Search and save are not exercised', type: 'waived', role: 'Sales Agent', refs: ['S6.4'],
      pre: '—', steps: '—', expected: '`Waived`: the search calls paid providers and the save spends 1 credit per lead (`business-rules.md` §10)',
      async run(t) { t.blocked('Waived: provider cost and credit spend (S6.4)'); },
    },
  ],
};
