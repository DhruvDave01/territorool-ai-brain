/**
 * F10 Visits: the visit-log read and an ownership probe. `getlastvisitedentry` filters by company only, not by
 * user (`V2/RouteController.php:4014-4030`), so the probe asks for ANOTHER user's company with the Sales Agent's
 * token. Read-only: nothing is written.
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

// Runtime shape 2026-09-16: {status: 1, data: <latest entry object>, list: [entries]} or {status: 0, message}.
const hasEntries = (j) => !!(j && String(j.status) === '1' && ((Array.isArray(j.list) && j.list.length) || (j.data && j.data.id)));

async function companyIds(account) {
  const r = await call('companylist', { body: { page: 0, sort_order: 'asc' }, token: await token(account), timeout: 60000 });
  const d = r.json && r.json.data;
  const list = (d && d.company_list) || [];
  // Visited companies first (`last_visited_time` set), so the ownership probe finds real entries quickly.
  return list.sort((x, y) => (y.last_visited_time ? 1 : 0) - (x.last_visited_time ? 1 : 0)).map((x) => x.company_id || x.id).filter(Boolean);
}

async function firstCompanyId(account) {
  const r = await call('companylist', { body: { page: 0, sort_order: 'asc' }, token: await token(account), timeout: 60000 });
  const d = r.json && r.json.data;
  const list = Array.isArray(d) ? d : d && (d.company_list || d.companies || d.data || d.list);
  // Items carry `company_id` (not `id`): runtime shape 2026-09-16, `data.company_list[]`.
  const c = Array.isArray(list) ? list.find((x) => x && (x.company_id || x.id)) : null;
  return c ? (c.company_id || c.id) : null;
}

module.exports = {
  flow: 'F10',
  slug: 'visits-read',
  title: 'Visit log (read contract + ownership probe)',
  priority: 'P1',
  source: '`V2/RouteController.php:4014` `getLastVisitedEntry()`',
  firstCompanyId,
  companyIds,
  cases: [
    {
      id: 'TC-F10-001', title: 'Visit log for one of my companies', type: 'happy', role: 'Sales Agent', refs: ['S3.4'],
      pre: 'Sales Agent with companies', steps: '1. take a company id from `companylist`\n2. POST `getlastvisitedentry` with it',
      expected: 'HTTP 200; `status` 1 with `data` (latest entry) and `list` (all entries), or `status` 0 "Sorry, Visited entry not found."',
      async run(t, { account }) {
        const id = await firstCompanyId(account);
        if (!id) return t.blocked('no company id in the companylist payload');
        const r = await call('getlastvisitedentry', { body: { company_id: id }, token: await token(account) });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.ok(r.json && [0, 1, '0', '1'].includes(r.json.status), 'a handled status');
      },
    },
    {
      id: 'TC-F10-002', title: 'Another user\'s visit log is not returned (S3.8)', type: 'security', role: 'Sales Agent', refs: ['S3.8', 'KG-BT4'],
      knownGap: 'UI-SEC-10',
      pre: 'Business Sales Agent company ids are readable by that user', steps: '1. read a company id as the Business Sales Agent\n2. POST `getlastvisitedentry` with that id **as the Sales Agent**',
      expected: 'no visit entries for a company the caller does not own. **Code has no owner filter**, so entries may be returned (known gap UI-SEC-10)',
      async run(t, { account }) {
        const E = require('../lib/env.js');
        const other = E.readAccounts()['Business Sales Agent'];
        if (!other) return t.blocked('no Business Sales Agent account');
        // Find a company that HAS visit entries (read as its owner), in either direction; otherwise the probe proves nothing.
        const pairs = [[other, account], [account, other]];
        let probe = null;
        for (const [owner, caller] of pairs) {
          for (const cid of (await companyIds(owner)).slice(0, 40)) {
            const own = await call('getlastvisitedentry', { body: { company_id: cid }, token: await token(owner) });
            if (hasEntries(own.json)) { probe = { cid, caller }; break; }
          }
          if (probe) break;
        }
        if (!probe) return t.blocked('inconclusive: no company with visit entries among either user\'s first 40');
        const r = await call('getlastvisitedentry', { body: { company_id: probe.cid }, token: await token(probe.caller) });
        const leaked = hasEntries(r.json);
        t.ok(!leaked, 'no entries for a company the caller does not own');
      },
    },
  ],
};
