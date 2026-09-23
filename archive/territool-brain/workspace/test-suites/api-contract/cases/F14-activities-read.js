/**
 * F14 Activities: the activity list read (owner-scoped: `Notes::where('user_id', …)`, `V2/CompanyController.php:911`).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');
const { firstCompanyId } = require('./F10-visits-read.js');

module.exports = {
  flow: 'F14',
  slug: 'activities-read',
  title: 'Activities (read contracts + ownership probe)',
  priority: 'P1',
  source: '`V2/CompanyController.php:911` `getCompanyActivities()`, `:826` `getCompanyNotes()`',
  cases: [
    {
      id: 'TC-F14-001', title: 'All my activities', type: 'happy', role: 'Sales Agent', refs: ['S3.6'],
      pre: 'Sales Agent with activities (the dashboard shows one)', steps: '1. POST `getcompanyactivities` with no company_id',
      expected: 'HTTP 200; `status` 1; `data` present',
      async run(t, { account }) {
        const r = await call('getcompanyactivities', { body: {}, token: await token(account) });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.is(r.json && Number(r.json.status), 1, '`status` is 1');
        t.ok(r.json && 'data' in r.json, '`data` present');
      },
    },
    {
      id: 'TC-F14-002', title: 'Another user\'s company activities are not returned', type: 'security', role: 'Sales Agent', refs: ['S3.8'],
      pre: 'the Sales Agent has activities on a company', steps: '1. find, as the Sales Agent, a company whose `getnotes` is not empty\n2. POST `getnotes` with that id **as the Business Sales Agent**',
      expected: 'the owner gets notes; the other user gets none (`Notes::where(user_id)`)',
      async run(t, { account }) {
        const E = require('../lib/env.js');
        const { companyIds } = require('./F10-visits-read.js');
        const other = E.readAccounts()['Business Sales Agent'];
        if (!other) return t.blocked('no Business Sales Agent account');
        const notes = (j) => (j && Array.isArray(j.data) ? j.data.length : 0);
        let id = null;
        for (const cid of (await companyIds(account)).slice(0, 20)) {
          const own = await call('getnotes', { body: { company_id: cid }, token: await token(account) });
          if (notes(own.json)) { id = cid; break; }
        }
        if (!id) return t.blocked('inconclusive: none of the owner\'s first 20 companies has notes');
        const r = await call('getnotes', { body: { company_id: id }, token: await token(other) });
        const d = r.json && r.json.data;
        t.ok(!(Array.isArray(d) && d.length), 'no notes from another account');
      },
    },
  ],
};
