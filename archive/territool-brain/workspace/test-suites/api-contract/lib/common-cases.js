/**
 * Reusable read-only contract cases (2026-09-17). Each factory builds one case for one endpoint.
 *
 * Every call is a read: the endpoints passed in were already scanned read-only for their feature suites
 * (see each cases/Fxx-*-read.js header). No case sends quotes, SQL fragments or payloads that could
 * write, spend credits or send anything. Staging only (lib/env.js).
 *
 *   negative     no token and a malformed token are refused and return no data
 *   security     the authenticated payload carries no credential fields and no SQL text
 *   permission   the Admin role is refused by the mobile API (target BT-1; today a known gap)
 *   validation   a malformed or missing input is refused cleanly (no 5xx, no SQL text)
 *   edge-data    a boundary input (page far past the end, an id that cannot exist) is handled
 */
const { call } = require('./env.js');
const { token } = require('./session.js');

const hasData = (j) => !!(j && String(j.status) === '1' && j.data !== undefined && j.data !== null
  && (Array.isArray(j.data) ? j.data.length > 0 : typeof j.data !== 'object' || Object.keys(j.data).length > 0));
/** Rows in an envelope: an array's length, or the summed lengths of array fields inside an object. */
const rowsIn = (j) => { const d = j && j.data; if (Array.isArray(d)) return d.length; if (d && typeof d === 'object') return Object.values(d).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0); return 0; };
const refused = (r) => r.httpStatus === 401 || r.httpStatus === 403 || (r.httpStatus === 200 && r.json && String(r.json.status) === '0')
  || (r.httpStatus >= 400 && r.httpStatus < 500);
const CRED_KEYS = /"(password|remember_token|api_key|secret|client_secret|access_token|refresh_token)"\s*:/i;
const opts = (method, body) => (method === 'GET' ? { method: 'GET' } : { body: body || {} });
const T = 60000;

function negative(id, ep, { method = 'POST', body } = {}) {
  return {
    id, title: `\`${ep}\` refuses a missing or malformed token`, type: 'negative', role: 'Public', refs: ['S2.4', 'M5'],
    pre: 'none', steps: `1. ${method} \`${ep}\` with no Authorization header\n2. repeat with \`Bearer not-a-jwt\``,
    expected: 'both refused (HTTP 401/403, or HTTP 200 with `status` 0) and no data returned',
    async run(t) {
      const a = await call(ep, { ...opts(method, body), timeout: T });
      t.ok(refused(a), `no token → refused (HTTP ${a.httpStatus})`);
      t.ok(!hasData(a.json), 'no token → no data');
      const b = await call(ep, { ...opts(method, body), token: 'not-a-jwt', timeout: T });
      t.ok(refused(b), `malformed token → refused (HTTP ${b.httpStatus})`);
      t.ok(!hasData(b.json), 'malformed token → no data');
    },
  };
}

function security(id, ep, role, { method = 'POST', body } = {}) {
  return {
    id, title: `\`${ep}\` payload carries no credential fields or SQL text`, type: 'security', role, refs: ['S0.4', 'QG-12', 'UI-SEC-05'],
    pre: `${role} account`, steps: `1. ${method} \`${ep}\` as ${role}\n2. scan the raw body for credential keys and SQL error text`,
    expected: 'no `password` / `remember_token` / `api_key` / token keys; no `SQLSTATE`; HTTP < 500',
    async run(t, { account }) {
      if (!account) return t.blocked(`no ${role} account`);
      const r = await call(ep, { ...opts(method, body), token: await token(account), timeout: T });
      t.ok(r.httpStatus < 500, `HTTP < 500 (got ${r.httpStatus})`);
      t.ok(!CRED_KEYS.test(r.text), 'no credential keys in the payload');
      t.ok(!/SQLSTATE/.test(r.text), 'no SQL error text');
    },
  };
}

function permission(id, ep, { method = 'POST', body } = {}) {
  return {
    id, title: `Admin is refused by \`${ep}\` (mobile API is not for Admin)`, type: 'permission', role: 'Admin', refs: ['BT-1', 'S3'],
    knownGap: 'BT-1',
    pre: 'Admin account (read-only observation, USER SAID 2026-09-16)', steps: `1. log in as Admin through V2 \`login\`\n2. ${method} \`${ep}\` with that token`,
    expected: 'target (BT-1): Admin is blocked on the mobile API, so the call is refused. **Today the V2 login admits Admin (TC-F01-008), so data may come back — recorded as known gap BT-1.**',
    async run(t, { account }) {
      if (!account) return t.blocked('no Admin account');
      let tk;
      try { tk = await token(account); } catch { t.ok(true, 'Admin login refused (target behaviour)'); return; }
      const r = await call(ep, { ...opts(method, body), token: tk, timeout: T });
      t.ok(r.httpStatus < 500, `HTTP < 500 (got ${r.httpStatus})`);
      t.ok(refused(r), `Admin is refused (HTTP ${r.httpStatus}, status ${r.json && r.json.status})`);
    },
  };
}

function validation(id, ep, role, body, what, { knownGap } = {}) {
  return {
    id, title: `\`${ep}\` rejects ${what} cleanly`, type: 'validation', role, refs: ['S2.4', 'W12'], knownGap,
    pre: `${role} account`, steps: `1. POST \`${ep}\` with ${JSON.stringify(body)}`,
    expected: 'a handled refusal (HTTP 200 `status` 0, or 4xx) with no data; never HTTP 5xx or SQL text',
    async run(t, { account }) {
      if (!account) return t.blocked(`no ${role} account`);
      const r = await call(ep, { body, token: await token(account), timeout: T });
      t.ok(r.httpStatus < 500, `no HTTP 5xx (got ${r.httpStatus})`);
      t.ok(!/SQLSTATE/.test(r.text), 'no SQL error text');
      t.ok(refused(r) || !hasData(r.json), 'refused, or no data returned');
    },
  };
}

/** `rowsKey` names the page-rows field when the envelope also carries non-page arrays (e.g. `company_list_ids`). */
function edge(id, ep, role, body, what, { knownGap, rowsKey } = {}) {
  return {
    id, title: `\`${ep}\` handles ${what}`, type: 'edge-data', role, refs: ['S2.4', 'BT-5'], knownGap,
    pre: `${role} account`, steps: `1. POST \`${ep}\` with ${JSON.stringify(body)}`,
    expected: 'HTTP < 500; a handled envelope (`status` 0 or 1) with no rows for an input that cannot match; no SQL text',
    async run(t, { account }) {
      if (!account) return t.blocked(`no ${role} account`);
      const r = await call(ep, { body, token: await token(account), timeout: T });
      t.ok(r.httpStatus < 500, `no HTTP 5xx (got ${r.httpStatus})`);
      t.ok(r.json && [0, 1, '0', '1'].includes(r.json.status), 'a handled `status`');
      t.ok(!/SQLSTATE/.test(r.text), 'no SQL error text');
      const rows = rowsKey ? ((r.json && r.json.data && r.json.data[rowsKey]) || []).length : rowsIn(r.json);
      t.is(rows, 0, `no ${rowsKey ? `\`${rowsKey}\` ` : ''}rows for an input that cannot match`);
    },
  };
}

module.exports = { negative, security, permission, validation, edge, hasData, refused, rowsIn };
