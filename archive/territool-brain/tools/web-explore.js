#!/usr/bin/env node
/**
 * Read-only structural exploration of the STAGING web app, per role (brain evidence, not screenshots for design).
 *
 *   cd tools && PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" node web-explore.js [--roles "Sales Agent,Admin"] [--max 40]
 *
 * For every page reached it records STRUCTURE only: final URL, HTTP status, title, h1, breadcrumb, sidebar
 * labels, button labels, form field names/types/required flags, table headers, and which same-origin
 * requests the page tried to make (blocked non-GETs show which endpoints a page depends on).
 * It never records body text, cell values or e-mail addresses (those are staging copies of real data).
 *
 * Safety (stricter than capture-web.js):
 *  - Staging host only; aborts otherwise.
 *  - Every same-origin non-GET request is aborted, except the one login POST.
 *  - GET URLs matching BLOCK are never navigated to or fetched (HQ and web have GET routes that change
 *    data: subscription/active/{id}, calculateroute, delete/{id}, resendinvitation …).
 *  - Nothing is clicked except the login submit. No form is filled except the login form.
 *  - Credentials come from ../.local/test-accounts.md and are never printed or stored.
 *  - A role-access probe requests a fixed list of index pages as every role and records where each lands.
 *
 * Output: ../brain/audits/data/web-explore.json, screenshots in ../workspace/qa-evidence/<date>/web/<role>/.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = 'https://staging.territool.com';
if (new URL(BASE).hostname !== 'staging.territool.com') throw new Error('Refusing: not staging');
const ROOT = path.resolve(__dirname, '..');
const DATE = new Date().toISOString().slice(0, 10);
const SHOTS = path.join(ROOT, 'workspace', 'qa-evidence', DATE, 'web');
const OUT = path.join(ROOT, 'brain', 'audits', 'data', 'web-explore.json');
const ARGS = process.argv.slice(2);
const flag = (n) => { const i = ARGS.indexOf(n); return i !== -1 ? ARGS[i + 1] : null; };
const MAX = Number(flag('--max') || 40);
const PATHS = flag('--paths'); // comma list: visit only these (no crawl), e.g. --paths /businessagent/subscription

const BLOCK = /(delete|remove|destroy|deactive|deactivate|activate|\/active\/|activebusiness|activeyelp|lifetime|cancel|cron|sync|buy|redeem|logout|resend|convert|payment|subscribe|upgrade|credits-addon|paypal|stripe|extend|errorfix|bulkdelete|deletesession|clear|generate|download|export|import|dataloader|disconnect|mark|visited|add-to-list|uniqueroute|updatepreference|get_percentage|mongo_|calculateroute|aisearch|assign|publish|share|invite|send|notify|restore|reset|refresh|webhook|hubspot|sfdc|karma|salesforce|zapier|impersonat|switch|callback|oauth|connect|save|store|update|toggle|approve|reject|process|seed|fix|migrat|copy|duplicate|merge|append|autofill|upload|sessionroute|pdf|excel|csv|print|verify|confirm|unsubscribe|revenuecat|success|mobilelogin|lead-users|notification\/all|support\/view|mcp\/(sync|chat)|password\/reset|register|trial|b2b|special|payments-in-app|android|tutorial|onboarding)/i;
const STATIC = /\.(js|css|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|otf|eot|map)$/i;

const ACCOUNTS = (() => {
  const md = fs.readFileSync(path.join(ROOT, '.local', 'test-accounts.md'), 'utf8');
  const acc = {};
  for (const l of md.split('\n')) {
    const c = l.split('|').map((s) => s.trim());
    if (['Sales Agent', 'Business Sales Agent', 'Business Agent', 'Admin'].includes(c[1]) && c[3] && !/pending/i.test(c[3])) acc[c[1]] = { email: c[3], pass: c[4] };
  }
  return acc;
})();
const SECRETS = Object.values(ACCOUNTS).flatMap((a) => [a.email, a.pass]);
// Redact full and TRUNCATED emails (page headings are cut to 60 chars, so the TLD can be missing),
// the account local-parts, and any @-handle, before anything is written or printed.
const LOCALS = Object.values(ACCOUNTS).map((a) => (a.email || '').split('@')[0]).filter(Boolean);
const scrub = (s) => {
  let out = SECRETS.reduce((a, v) => a.split(v).join('***'), String(s ?? ''));
  for (const l of LOCALS) out = out.split(l).join('<redacted>');
  return out.replace(/[\w.+-]+@[\w.-]*/g, '<email>');
};

const PLANS = {
  'Sales Agent': { login: '/login', start: ['/dashboard', '/company', '/recent-company', '/routes', '/lists', '/contact', '/salesperson/edit', '/subscription', '/support', '/notification', '/findleads', '/ai-lead-finder', '/route/step1', '/list/step1', '/company/create', '/contact/create/'] },
  'Business Sales Agent': { login: '/login', start: ['/dashboard', '/company', '/routes', '/lists', '/contact', '/salesperson/edit', '/subscription', '/support', '/findleads'] },
  'Business Agent': { login: '/login', start: ['/manager/dashboard', '/manager/ai-find-leads', '/manager/salespeople', '/manager/salespeople/create', '/manager/activity', '/manager/reports', '/manager/support', '/manager/support/create', '/manager/settings', '/businesssalesperson', '/businessagent/subscription', '/dashboard'] },
  // /hq/login carries a reCAPTCHA, which this tool never solves: the Admin run stops at login (BLOCKED) unless a
  // person signs in. The shared /login refuses Admin ("not authorize to access this page", runtime 2026-09-16).
  Admin: { login: '/hq/login', start: ['/hq', '/hq/dashboard', '/hq/subscription/dashboard', '/hq/subscription/cancelled-users', '/hq/subscription/cancelled-revenuecat-trials', '/hq/salesperson', '/hq/salesperson/create', '/hq/businessclient', '/hq/businessclient/create', '/hq/promocode', '/hq/promocode/create', '/hq/support', '/hq/support/create', '/hq/specialdiscount', '/hq/specialdiscount/create', '/hq/settings', '/hq/userdevices'] },
};
// Every role requests these; where each lands is the access matrix.
const PROBE = ['/dashboard', '/company', '/routes', '/lists', '/contact', '/findleads', '/salesperson/edit', '/subscription', '/businessagent/subscription', '/businesssalesperson', '/support', '/manager/dashboard', '/manager/salespeople', '/manager/settings', '/hq', '/hq/dashboard', '/hq/salesperson', '/hq/businessclient', '/hq/settings'];

const norm = (u) => { const x = new URL(u); return `${x.origin}${x.pathname.replace(/\/+$/, '') || '/'}`; };
const pattern = (u) => new URL(u).pathname.replace(/\/\d+(?=\/|$)/g, '/{id}').replace(/\/[A-Za-z0-9_-]{24,}(?=\/|$)/g, '/{token}');

async function guard(context, log) {
  await context.route('**/*', (route) => {
    const req = route.request();
    const url = req.url();
    if (!url.startsWith(BASE)) return route.continue();
    const p = new URL(url).pathname;
    const loginPost = req.method() === 'POST' && /\/(hq\/)?login\/?$/.test(p);
    if (req.method() !== 'GET' && req.method() !== 'HEAD' && !loginPost) { log.push(`${req.method()} ${p}`); return route.abort(); }
    if (!STATIC.test(p) && BLOCK.test(p)) { log.push(`GET(blocked) ${p}`); return route.abort(); }
    if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') log.push(`XHR GET ${p}`);
    return route.continue();
  });
}

async function structure(page) {
  return page.evaluate(() => {
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    const uniq = (a) => [...new Set(a.filter(Boolean))];
    const short = (s) => (s.length > 60 ? `${s.slice(0, 57)}…` : s);
    return {
      h1: short(txt(document.querySelector('h1'))),
      breadcrumb: short(txt(document.querySelector('.breadcrumb, [aria-label="breadcrumb"]'))),
      nav: uniq([...document.querySelectorAll('aside a, .sidebar a, .main-sidebar a, nav a')].map((a) => short(txt(a)))).slice(0, 40),
      buttons: uniq([...document.querySelectorAll('button, a.btn, input[type=submit], input[type=button]')].map((b) => short(txt(b) || b.value || b.getAttribute('aria-label') || ''))).slice(0, 40),
      forms: [...document.querySelectorAll('form')].slice(0, 6).map((f) => ({
        action: (f.getAttribute('action') || '').replace(location.origin, ''),
        method: (f.getAttribute('method') || 'get').toUpperCase(),
        fields: [...f.querySelectorAll('input, select, textarea')].filter((i) => i.type !== 'hidden').slice(0, 40).map((i) => `${i.name || i.id || '?'}:${i.type || i.tagName.toLowerCase()}${i.required ? '*' : ''}`),
      })),
      tables: [...document.querySelectorAll('table')].slice(0, 4).map((t) => [...t.querySelectorAll('thead th')].map((th) => short(txt(th))).filter(Boolean)),
      headings: uniq([...document.querySelectorAll('h2, h3, .box-title, .card-title')].map((h) => short(txt(h)))).slice(0, 20),
      links: uniq([...document.querySelectorAll('a[href]')].map((a) => a.href)).slice(0, 300),
      captcha: !!document.querySelector('.g-recaptcha, iframe[src*="recaptcha"], [data-sitekey]'),
    };
  });
}

async function visit(page, role, url, blockedLog, record) {
  const before = blockedLog.length;
  let status = null; let error = null;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    status = resp ? resp.status() : null;
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(800);
  } catch (e) { error = String(e.message).split('\n')[0]; }
  const s = await structure(page).catch(() => ({ links: [] }));
  const finalUrl = page.url();
  const entry = { role, requested: url.replace(BASE, ''), final: finalUrl.replace(BASE, ''), status, title: scrub(await page.title().catch(() => '')), ...s, links: undefined, requests: [...new Set(blockedLog.slice(before))], error };
  for (const k of ['h1', 'breadcrumb']) entry[k] = scrub(entry[k]);
  for (const k of ['nav', 'buttons', 'headings']) entry[k] = (entry[k] || []).map(scrub);
  if (record) record(entry);
  return { entry, links: s.links || [] };
}

(async () => {
  const roles = (flag('--roles') || Object.keys(PLANS).join(',')).split(',').map((s) => s.trim());
  const browser = await chromium.launch();
  const result = { capturedAt: new Date().toISOString(), base: BASE, roles: {}, probe: {} };
  for (const role of roles) {
    const acc = ACCOUNTS[role];
    if (!acc) { result.roles[role] = { status: 'NO ACCOUNT' }; continue; }
    const plan = PLANS[role];
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const log = [];
    await guard(ctx, log);
    const page = await ctx.newPage();
    const pages = [];
    const dir = path.join(SHOTS, role.toLowerCase().replace(/\s+/g, '-'));
    fs.mkdirSync(dir, { recursive: true });

    // Login
    await page.goto(BASE + plan.login, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const pre = await structure(page).catch(() => ({}));
    await page.screenshot({ path: path.join(dir, '00-login.png') }).catch(() => {});
    let landed = null;
    try {
      await page.fill('input[name="email"]', acc.email);
      await page.fill('input[name="password"]', acc.pass);
      await Promise.all([page.waitForNavigation({ timeout: 45000 }).catch(() => {}), page.click('button[type="submit"], input[type="submit"]')]);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      landed = page.url().replace(BASE, '');
    } catch (e) { landed = `ERROR ${String(e.message).split('\n')[0]}`; }
    const loginOk = !/\/login/.test(landed) && !landed.startsWith('ERROR');
    const loginErr = loginOk ? null : scrub(await page.$$eval('.alert, .help-block, .invalid-feedback, .error', (els) => els.map((e) => e.textContent.trim()).filter(Boolean).join(' | ')).catch(() => ''));
    result.roles[role] = { loginPage: plan.login, captchaOnLogin: !!pre.captcha, landed, loginOk, loginError: loginErr, pages };
    console.log(`${role}: login ${loginOk ? 'OK' : 'FAILED'} → ${landed}${pre.captcha ? ' (captcha present)' : ''}`);
    if (!loginOk) { await ctx.close(); continue; }

    // Crawl: the plan's start pages, then same-origin links one level deep, one URL per pattern.
    const seen = new Set();
    const starts = PATHS ? PATHS.split(',') : plan.start;
    const queue = starts.map((p) => ({ url: BASE + p, depth: PATHS ? 1 : 0 }));
    if (!PATHS) queue.unshift({ url: BASE + landed, depth: 0 });
    while (queue.length && pages.length < MAX) {
      const { url, depth } = queue.shift();
      if (!url.startsWith(BASE) || url.includes('#')) continue;
      const key = pattern(norm(url));
      if (seen.has(key) || BLOCK.test(new URL(url).pathname)) continue;
      seen.add(key);
      const { entry, links } = await visit(page, role, norm(url), log, (e) => pages.push(e));
      const n = String(pages.length).padStart(2, '0');
      await page.screenshot({ path: path.join(dir, `${n}-${key.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root'}.png`) }).catch(() => {});
      console.log(`  ${role} ${n} ${entry.status} ${entry.requested} → ${entry.final}`);
      if (depth < 1) for (const l of links) if (l.startsWith(BASE) && !l.includes('#') && !BLOCK.test(new URL(l).pathname)) queue.push({ url: l.split('?')[0], depth: depth + 1 });
    }

    // Access probe
    result.probe[role] = {};
    if (PATHS) { await ctx.close(); continue; }
    for (const p of PROBE) {
      try {
        const resp = await page.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 30000 });
        result.probe[role][p] = { status: resp ? resp.status() : null, final: page.url().replace(BASE, '') };
      } catch (e) { result.probe[role][p] = { error: String(e.message).split('\n')[0] }; }
    }
    await ctx.close();
  }
  await browser.close();
  const text = scrub(JSON.stringify(result, null, 1));
  // Partial runs (--roles / --paths) merge into the existing file instead of replacing other roles.
  const outFile = (PATHS || flag('--roles')) ? OUT.replace(/\.json$/, `.${(PATHS ? 'paths' : 'roles')}-${roles.join('_').replace(/\s+/g, '-').toLowerCase()}.json`) : OUT;
  fs.writeFileSync(outFile, `${text}\n`);
  console.log(`web-explore: ${Object.values(result.roles).reduce((n, r) => n + ((r.pages || []).length), 0)} pages → ${path.relative(ROOT, outFile)}`);
})().catch((e) => { console.error('FATAL', scrub(e.message)); process.exit(1); });
