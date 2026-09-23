/**
 * BT-10 queue worker check — STAGING ONLY, READ-ONLY.
 *
 * Logs in through API V2 `login` (as the mobile app does) and reads `routelist` (GET). Reports the
 * routes in each list by status and the age of any stuck in "processing": a route job dispatched
 * with QUEUE_DRIVER=database that no worker picked up (`publishRoute`, `updateRoute`, `reRoute`,
 * web route controllers). Only these two endpoints are called; nothing is created or changed.
 * Prints aggregates only: no credentials, tokens, route names or emails.
 *
 * Usage (from tools/): node queue-probe-readonly.js --roles "Sales Agent,Business Sales Agent"
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://staging.territool.com';
if (!/(^|\.)staging\.territool\.com$/.test(new URL(BASE).hostname)) throw new Error('Refusing to run: base URL is not staging');
const API = `${BASE}/index.php/api/`;
const ALLOWED = new Set(['POST login', 'GET routelist']);
const ACCOUNTS = path.resolve(__dirname, '..', '.local', 'test-accounts.md');

const args = process.argv.slice(2);
const roles = ((args[args.indexOf('--roles') + 1]) || 'Sales Agent').split(',').map((s) => s.trim());

function readAccounts() {
  const rows = fs.readFileSync(ACCOUNTS, 'utf8').split('\n').filter((l) => /^\|\s*(Sales Agent|Business Sales Agent|Business Agent|Admin)\s*\|/.test(l));
  const acc = {};
  for (const r of rows) {
    const c = r.split('|').map((s) => s.trim());
    if (c[3] && c[4] && !/pending/i.test(c[3])) acc[c[1]] = { email: c[3], pass: c[4] };
  }
  return acc;
}

async function call(method, endpoint, opts = {}) {
  if (!ALLOWED.has(`${method} ${endpoint}`)) throw new Error(`Blocked by read-only allowlist: ${method} ${endpoint}`);
  const res = await fetch(API + endpoint, { method, ...opts });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* non-JSON */ }
  return { http: res.status, json, bytes: text.length };
}

function findJwt(o) {
  if (typeof o === 'string') return /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(o) ? o : null;
  if (o && typeof o === 'object') for (const v of Object.values(o)) { const t = findJwt(v); if (t) return t; }
  return null;
}

// Collect arrays of route-like rows (objects with id + created_date) keyed by JSON path.
function routeLists(o, p = 'root', out = {}) {
  if (Array.isArray(o)) {
    const rows = o.filter((x) => x && typeof x === 'object' && 'id' in x && 'created_date' in x);
    if (rows.length) out[p] = rows;
    o.forEach((x, i) => { if (x && typeof x === 'object' && !('created_date' in x)) routeLists(x, `${p}[${i}]`, out); });
  } else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) routeLists(v, `${p}.${k}`, out);
  }
  return out;
}

(async () => {
  const accounts = readAccounts();
  const now = Date.now();
  for (const role of roles) {
    const acc = accounts[role];
    if (!acc) { console.log(`${role}: no staging account`); continue; }
    const fd = new FormData();
    fd.append('email', acc.email);
    fd.append('password', acc.pass);
    // The app always sends these (App/components/login/index.js:680-681); login inserts them into usertoken.
    // Empty token: no fake push token is stored.
    fd.append('device_token', '');
    fd.append('device_type', 'ios');
    const login = await call('POST', 'login', { body: fd });
    const token = findJwt(login.json);
    if (!login.json || Number(login.json.status) !== 1 || !token) { console.log(`${role}: login failed (HTTP ${login.http}, status ${login.json && login.json.status})`); continue; }
    const rl = await call('GET', 'routelist', { headers: { Authorization: `Bearer ${token}` } });
    const lists = routeLists(rl.json);
    const summary = { role, routelistHttp: rl.http, apiStatus: rl.json && rl.json.status, lists: {} };
    for (const [p, rows] of Object.entries(lists)) {
      const statuses = {};
      const processingAges = [];
      let newest = null;
      for (const r of rows) {
        const st = r.status === undefined ? '(not selected)' : String(r.status);
        statuses[st] = (statuses[st] || 0) + 1;
        const t = Date.parse(String(r.created_date).replace(' ', 'T'));
        if (!Number.isNaN(t)) newest = newest === null ? t : Math.max(newest, t);
        if (st.toLowerCase() === 'processing' && !Number.isNaN(t)) processingAges.push(+((now - t) / 36e5).toFixed(1));
      }
      summary.lists[p.replace(/^root\./, '')] = {
        count: rows.length,
        statuses,
        newestCreated: newest ? new Date(newest).toISOString().slice(0, 16) : null,
        processingAgeHours: processingAges.sort((a, b) => a - b),
      };
    }
    console.log(JSON.stringify(summary, null, 2));
  }
  console.log('Note: ages use created_date parsed as local time; server timezone unverified, so treat ages as approximate (± a few hours).');
})().catch((e) => { console.error('FATAL', e.message.split('\n')[0]); process.exit(1); });
