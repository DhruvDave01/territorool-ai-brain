#!/usr/bin/env node
/**
 * Web contract runner (layer L4, request level): signs in through the real /login form and asserts the
 * session-authenticated JSON endpoints and page access of the web app / manager portal.
 *
 *   cd tools && PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" node ../workspace/test-suites/web/run.js --env staging [--only F23] [--json ../workspace/test-suites/web/last-run.json]
 *
 * Safety: staging only; the only POST ever sent is the login form; every case names GET endpoints that were
 * scanned for writes (ManagerDashboardController kpis/team/feed/sidebar-stats/rep, 2026-09-16). Credentials come
 * from .local/test-accounts.md and are redacted from all output.
 */
const fs = require('fs');
const path = require('path');
const { request } = require(path.resolve(__dirname, '../../../tools/node_modules/playwright'));

const BASE = 'https://staging.territool.com';
const ROOT = path.resolve(__dirname, '..', '..', '..');
const ARGS = process.argv.slice(2);
const flag = (n) => { const i = ARGS.indexOf(n); return i !== -1 ? ARGS[i + 1] : null; };
if (flag('--env') !== 'staging') { console.error('Refusing: pass --env staging (S0.1).'); process.exit(2); }

const md = fs.readFileSync(path.join(ROOT, '.local', 'test-accounts.md'), 'utf8');
const ACC = {};
for (const l of md.split('\n')) { const c = l.split('|').map((s) => s.trim()); if (['Sales Agent', 'Business Sales Agent', 'Business Agent', 'Admin'].includes(c[1]) && c[3] && !/pending/i.test(c[3])) ACC[c[1]] = { email: c[3], pass: c[4] }; }
const SECRETS = Object.values(ACC).flatMap((a) => [a.email, a.pass]);
const redact = (v) => SECRETS.reduce((s, x) => s.split(x).join('<redacted>'), typeof v === 'string' ? v : JSON.stringify(v)).replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '<email>');

const sessions = new Map();
/** A request context signed in as `role` (null = anonymous). Only GETs are allowed afterwards. */
async function session(role) {
  if (sessions.has(role)) return sessions.get(role);
  const ctx = await request.newContext({ baseURL: BASE, maxRedirects: 0 });
  if (role) {
    const page = await ctx.get('/login');
    const html = await page.text();
    const tok = (html.match(/name="_token"\s+value="([^"]+)"/) || [])[1];
    const r = await ctx.post('/login', { form: { _token: tok, email: ACC[role].email, password: ACC[role].pass } });
    if (![200, 302].includes(r.status())) throw new Error(`login failed for ${role}: HTTP ${r.status()}`);
  }
  const get = async (p) => {
    if (!p.startsWith('/')) throw new Error('relative paths only');
    const r = await ctx.get(p, { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
    const text = await r.text();
    let json = null; try { json = JSON.parse(text); } catch { /* not JSON */ }
    return { status: r.status(), location: r.headers().location || null, json, text };
  };
  const s = { get, dispose: () => ctx.dispose() };
  sessions.set(role, s);
  return s;
}

function makeT() {
  const checks = []; let blocked = null;
  const push = (ok, msg, detail) => checks.push({ ok: !!ok, msg, detail: detail === undefined ? null : redact(detail) });
  return { checks, get blockedReason() { return blocked; }, ok: (c, m) => push(c, m), is: (a, e, m) => push(Object.is(a, e), m, Object.is(a, e) ? undefined : `expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`), blocked: (r) => { blocked = r; } };
}

(async () => {
  const dir = path.join(__dirname, 'cases');
  const suites = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort().map((f) => require(path.join(dir, f)));
  const only = flag('--only');
  const results = [];
  const startedAt = new Date().toISOString();
  console.log(`Web contract · ${BASE} · ${startedAt.slice(0, 16).replace('T', ' ')} UTC`);
  for (const suite of suites) {
    if (only && suite.flow !== only) continue;
    console.log(`\n${suite.flow} ${suite.title} (${suite.priority})`);
    for (const c of suite.cases) {
      const t = makeT(); let error = null;
      try {
        if (c.role !== 'Public' && !ACC[c.role]) t.blocked(`no ${c.role} account in .local`);
        else await c.run(t, { session: () => session(c.role === 'Public' ? null : c.role), as: (r) => session(r) });
      } catch (e) { error = redact(e.message); }
      const failed = t.checks.filter((x) => !x.ok);
      const verdict = t.blockedReason ? 'BLOCKED' : error ? 'FAIL' : !failed.length ? 'PASS' : c.knownGap ? 'KNOWN GAP' : 'FAIL';
      console.log(`${{ PASS: '  ok  ', FAIL: ' FAIL ', BLOCKED: 'BLOCK ', 'KNOWN GAP': ' gap  ' }[verdict]} ${c.id}  ${c.title}`);
      if (error) console.log(`         error: ${error}`);
      for (const f of failed) console.log(`         ✗ ${f.msg}${f.detail ? ` — ${f.detail}` : ''}`);
      results.push({ id: c.id, flow: suite.flow, title: c.title, type: c.type, role: c.role, verdict, checks: t.checks.length, failed: failed.length, failures: failed, blockedReason: t.blockedReason, error, knownGap: c.knownGap || null });
    }
  }
  for (const s of sessions.values()) await s.dispose();
  for (const suite of suites) if (typeof suite.teardown === 'function') await suite.teardown();
  const n = (v) => results.filter((r) => r.verdict === v).length;
  console.log(`\n${results.length} cases · ${n('PASS')} passed · ${n('FAIL')} failed · ${n('KNOWN GAP')} known gap · ${n('BLOCKED')} blocked`);
  const out = flag('--json');
  if (out) fs.writeFileSync(path.resolve(out), `${JSON.stringify({ base: BASE, startedAt, finishedAt: new Date().toISOString(), summary: { total: results.length, pass: n('PASS'), fail: n('FAIL'), gap: n('KNOWN GAP'), blocked: n('BLOCKED') }, results }, null, 2)}\n`);
  process.exit(n('FAIL') ? 1 : 0);
})().catch((e) => { console.error(`runner error: ${redact(e.stack || e.message)}`); process.exit(1); });
