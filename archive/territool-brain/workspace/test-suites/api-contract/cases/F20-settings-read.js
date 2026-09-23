/**
 * F20 Settings / status tags: read contracts behind the mobile Settings "Tags" row and the status colours.
 * Read-only (actions scanned 2026-09-16).
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

// Slots per role (runtime 2026-09-16, web-flows.md §1): 7 for a Sales Agent (incl. Gold), 6 for a Business Sales Agent.
const MAX_TAGS = { 'Sales Agent': 7, 'Business Sales Agent': 6 };

const tags = (id, role) => ({
  id, title: `${role} status tags have id, name and colour`, type: 'happy', role, refs: ['M3'],
  pre: `${role} account`, steps: '1. GET `getuserstatus` with the Bearer token',
  expected: `HTTP 200; \`status\` 1; \`data\` is a non-empty array of \`{id, name, colorcode}\`; at most ${MAX_TAGS[role]} tags for a ${role} (tag names are user-editable, so only the count is asserted)`,
  async run(t, { account }) {
    const r = await call('getuserstatus', { method: 'GET', token: await token(account) });
    t.is(r.json && r.json.status, 1, '`status` is 1');
    const d = (r.json && r.json.data) || [];
    t.ok(Array.isArray(d) && d.length > 0 && d.length <= MAX_TAGS[role], `between 1 and ${MAX_TAGS[role]} tags`);
    t.ok(d.every((x) => x.id !== undefined && typeof x.name === 'string' && typeof x.colorcode === 'string'), 'every tag has id, name, colorcode');
  },
});

const publicWithoutToken = (id, ep) => ({
  id, title: `\`${ep}\` without a token is refused with 401`, type: 'security', role: 'Public', refs: ['S3.8'],
  knownGap: 'UI-API-03',
  pre: 'None', steps: `1. GET \`${ep}\` with no Authorization header`,
  expected: `HTTP 401 and no data. The route sits outside the JWT group but calls \`currentUser()\`. **Today: HTTP 500 "The token could not be parsed from the request" with a \`debug\` block**; no user data is returned`,
  async run(t) {
    const r = await call(ep, { method: 'GET' });
    t.ok(!(r.json && Array.isArray(r.json.data) && r.json.data.length), 'no user data without a token');
    t.is(r.httpStatus, 401, 'HTTP 401, not 500');
    t.ok(!(r.json && 'debug' in r.json), 'no `debug` block');
  },
});

module.exports = {
  flow: 'F20',
  slug: 'settings-read',
  title: 'Settings / status tags (read contracts)',
  priority: 'P2',
  source: '`V2/RouteController.php` `getUserStatus()`, `getUserCategories()`, `getUserContactStage()`',
  cases: [
    tags('TC-F20-001', 'Sales Agent'),
    tags('TC-F20-002', 'Business Sales Agent'),
    publicWithoutToken('TC-F20-003', 'getcategories'),
    publicWithoutToken('TC-F20-004', 'getusercontactstage'),
  ],
};
