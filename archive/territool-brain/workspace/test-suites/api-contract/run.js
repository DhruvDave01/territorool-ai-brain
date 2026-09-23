#!/usr/bin/env node
/**
 * Territool API-contract runner — layer L3 of brain/audits/05-testing.md §2.
 *
 * Logs in per role against STAGING and asserts the V2 envelope and fields the mobile app and the
 * MCP modules depend on. Runner-agnostic: it is a plain node command, so Claude Code runs it inside
 * the QA loop and the same command works in any terminal. No dependencies, no install.
 *
 * Safety (05-testing.md §7, conventions-shared S0):
 *   staging only (lib/env.js refuses anything else) · credentials read at run time from
 *   .local/test-accounts.md and never printed · no credit-spending or purchase endpoints are
 *   called · nothing is deleted. Successful logins do insert a `usertoken` row; F01-login.js
 *   documents that side effect.
 *
 * Usage (from territool-brain/):
 *   node workspace/test-suites/api-contract/run.js --env staging
 *   node workspace/test-suites/api-contract/run.js --env staging --only F01
 *   node workspace/test-suites/api-contract/run.js --env staging --role "Sales Agent"
 *   node workspace/test-suites/api-contract/run.js --list
 *   node workspace/test-suites/api-contract/run.js --env staging --json report.json
 *
 * Exit code 0 only when every case PASSed or was a recorded KNOWN GAP; 1 on any FAIL.
 * BLOCKED cases (missing credentials, missing staging state) never fake a pass.
 */
const fs = require('fs');
const path = require('path');
const { BASE, readAccounts, classify, redact } = require('./lib/env.js');

const ARGS = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = ARGS.indexOf(name);
  return i === -1 ? fallback : (ARGS[i + 1] && !ARGS[i + 1].startsWith('--') ? ARGS[i + 1] : true);
};
const ENV = flag('--env');
const ONLY = flag('--only');
const ROLE = flag('--role');
const LIST = ARGS.includes('--list');
const JSON_OUT = flag('--json');

const SUITES = fs.readdirSync(path.join(__dirname, 'cases')).filter((f) => f.endsWith('.js')).sort()
  .map((f) => require(path.join(__dirname, 'cases', f)));

if (LIST) {
  for (const s of SUITES) {
    console.log(`${s.flow} ${s.title} (${s.priority}) — ${s.cases.length} cases`);
    for (const c of s.cases) console.log(`  ${c.id}  [${c.type}] ${c.role.padEnd(20)} ${c.title}`);
  }
  process.exit(0);
}
if (ENV !== 'staging') {
  console.error('Refusing to run: pass --env staging. This suite never runs against production (S0.1).');
  process.exit(2);
}

/** Assertion recorder. A case reports through this; nothing throws past its own case. */
function makeT() {
  const checks = [];
  let blockedReason = null;
  const push = (ok, msg, detail) => checks.push({ ok, msg, detail: detail === undefined ? null : redact(detail) });
  return {
    checks,
    get blockedReason() { return blockedReason; },
    ok: (cond, msg) => push(!!cond, msg),
    is: (actual, expected, msg) => push(Object.is(actual, expected), msg, Object.is(actual, expected) ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`),
    eq: (actual, expected, msg) => {
      const same = JSON.stringify(actual) === JSON.stringify(expected);
      push(same, msg, same ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    blocked: (reason) => { blockedReason = reason; },
  };
}

(async () => {
  const accounts = readAccounts();
  for (const a of Object.values(accounts)) classify(a.email, a.pass);

  const startedAt = new Date().toISOString();
  console.log(`API contract · ${BASE} · ${startedAt.slice(0, 16).replace('T', ' ')} UTC`);
  console.log(`roles available: ${Object.keys(accounts).join(', ') || 'none'}\n`);

  const results = [];
  for (const suite of SUITES) {
    if (ONLY && ONLY !== true && suite.flow !== ONLY) continue;
    console.log(`${suite.flow} ${suite.title} (${suite.priority})`);
    for (const c of suite.cases) {
      if (ROLE && ROLE !== true && c.role !== ROLE) continue;
      const account = accounts[c.role] || null;
      const t = makeT();
      let error = null;
      try {
        await c.run(t, { account });
      } catch (e) {
        error = redact(e && e.message ? e.message : String(e));
      }
      const failed = t.checks.filter((x) => !x.ok);
      let verdict;
      if (t.blockedReason) verdict = 'BLOCKED';
      else if (error) verdict = 'FAIL';
      else if (!failed.length) verdict = 'PASS';
      else verdict = c.knownGap ? 'KNOWN GAP' : 'FAIL';

      const mark = { PASS: '  ok  ', FAIL: ' FAIL ', BLOCKED: 'BLOCK ', 'KNOWN GAP': ' gap  ' }[verdict];
      console.log(`${mark} ${c.id}  ${c.title}`);
      if (t.blockedReason) console.log(`         ${t.blockedReason}`);
      if (error) console.log(`         error: ${error}`);
      for (const f of failed) console.log(`         ✗ ${f.msg}${f.detail ? ` — ${f.detail}` : ''}`);
      if (verdict === 'KNOWN GAP') console.log(`         recorded gap ${c.knownGap}: today's behaviour differs from the target`);

      results.push({
        id: c.id, flow: suite.flow, title: c.title, type: c.type, role: c.role,
        priority: suite.priority, refs: c.refs || [], knownGap: c.knownGap || null,
        verdict, checks: t.checks.length, failed: failed.length,
        failures: failed.map((f) => ({ msg: f.msg, detail: f.detail })),
        blockedReason: t.blockedReason, error,
      });
    }
    console.log('');
  }

  const count = (v) => results.filter((r) => r.verdict === v).length;
  const pass = count('PASS'); const fail = count('FAIL'); const blocked = count('BLOCKED'); const gap = count('KNOWN GAP');
  console.log(`${results.length} cases · ${pass} passed · ${fail} failed · ${gap} known gap · ${blocked} blocked`);
  console.log(`assertions: ${results.reduce((n, r) => n + r.checks, 0)}`);

  if (JSON_OUT && JSON_OUT !== true) {
    const out = path.resolve(JSON_OUT);
    fs.writeFileSync(out, `${JSON.stringify({ base: BASE, startedAt, finishedAt: new Date().toISOString(), summary: { total: results.length, pass, fail, gap, blocked }, results }, null, 2)}\n`);
    console.log(`report: ${path.relative(process.cwd(), out)}`);
  }
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(`runner error: ${redact(String(e && e.stack ? e.stack : e))}`); process.exit(1); });
