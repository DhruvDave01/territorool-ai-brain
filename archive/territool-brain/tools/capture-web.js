/**
 * Territool web screenshot capture — STAGING ONLY, read-only navigation.
 *
 * Safety:
 *  - Base URL is hard-wired to staging; aborts if the host isn't staging.
 *  - Every non-GET request is aborted except the login form POST.
 *  - GET URLs that look destructive or side-effecting are aborted (delete, remove,
 *    cancel, cron, sync, buy, redeem, logout, (de)activate, resend, convert, payment…).
 *  - Only pages from an explicit allowlist or same-origin nav links that pass the
 *    filter are visited; nothing is clicked except the login submit.
 *  - Credentials are read from ../.local/test-accounts.md and never printed.
 *
 * Output: ../shoebox/03-web/screenshots/<role>/... + CAPTURED-BY-CLAUDE.md manifest.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = 'https://staging.territool.com';
if (!/(^|\.)staging\.territool\.com$/.test(new URL(BASE).hostname)) {
  throw new Error('Refusing to run: base URL is not staging');
}

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'shoebox', '03-web', 'screenshots');
const ACCOUNTS = path.join(ROOT, '.local', 'test-accounts.md');

const DESTRUCTIVE = /(delete|remove|destroy|deactive|deactivate|activate|cancel|cron|sync|buy|redeem|logout|resend|convert|payment|subscribe|upgrade|credits-addon|paypal|stripe|extend-days|lifetime|errorfix|bulkdelete|deletesession|clear-|generateroute|re_generate|regenerate|download|export|import|dataloader|disconnect|mark-as-visited|markasvisited|add-to-list|removecontact|uniqueroute|updatepreference|get_percentage|mongo_)/i;

function readAccounts() {
  const md = fs.readFileSync(ACCOUNTS, 'utf8');
  const rows = md.split('\n').filter((l) => /^\|\s*(Sales Agent|Business Sales Agent|Business Agent|Admin)\s*\|/.test(l));
  const acc = {};
  for (const r of rows) {
    const c = r.split('|').map((s) => s.trim());
    const role = c[1], email = c[3], pass = c[4];
    if (email && pass && !/pending/i.test(email)) acc[role] = { email, pass };
  }
  return acc;
}

const slug = (u) => (new URL(u).pathname.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'root').toLowerCase();
const manifest = [];

async function guard(context, log) {
  await context.route('**/*', (route) => {
    const req = route.request();
    const url = req.url();
    const sameOrigin = url.startsWith(BASE);
    const isLoginPost = req.method() === 'POST' && sameOrigin && /\/login\/?(\?|$)/.test(url);
    if (sameOrigin && req.method() !== 'GET' && req.method() !== 'HEAD' && !isLoginPost) {
      log.push(`${req.method()} ${url}`);
      return route.abort();
    }
    const isStaticAsset = /\.(js|css|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|otf|eot|map)$/i.test(new URL(url).pathname);
    if (sameOrigin && req.method() === 'GET' && !isStaticAsset && DESTRUCTIVE.test(new URL(url).pathname)) {
      log.push(`GET(blocked-pattern) ${url}`);
      return route.abort();
    }
    return route.continue();
  });
}

async function shot(page, role, name, url, widths, blocked) {
  const dir = path.join(OUT, role.replace(/\s+/g, '-').toLowerCase());
  fs.mkdirSync(dir, { recursive: true });
  for (const w of widths) {
    const h = w >= 1200 ? 900 : w >= 700 ? 1024 : 844;
    await page.setViewportSize({ width: w, height: h });
    const before = blocked.length;
    let status = null, err = null;
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      status = resp ? resp.status() : null;
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
    } catch (e) { err = String(e.message).split('\n')[0]; }
    let fonts = null;
    if (w >= 1200) {
      fonts = await page.evaluate(async () => {
        const pick = (s) => { const el = document.querySelector(s); return el ? getComputedStyle(el).fontFamily : null; };
        try { await document.fonts.ready; } catch (e) {}
        const loaded = new Set();
        document.fonts.forEach((ff) => { if (ff.status === 'loaded') loaded.add(ff.family.replace(/["']/g, '')); });
        return { h1: pick('h1'), heading: pick('h2, h3, .box-title, .card-title'), body: getComputedStyle(document.body).fontFamily, button: pick('button, .btn'), loadedWebFonts: [...loaded] };
      }).catch(() => null);
    }
    const file = path.join(dir, `web_${name}_w${w}.png`);
    try { await page.screenshot({ path: file, fullPage: w >= 1200 }); } catch (e) { err = err || String(e.message).split('\n')[0]; }
    manifest.push({ role, name, requested: url, final: page.url(), status, width: w, title: await page.title().catch(() => ''), file: path.relative(ROOT, file), blockedDuringPage: blocked.slice(before), error: err, fonts });
    console.log(`${role} | ${name} | w${w} | ${status} | ${page.url().replace(BASE, '')}${err ? ' | ERR ' + err : ''}`);
  }
}

async function login(page, account) {
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('input[name="email"]', account.email);
  await page.fill('input[name="password"]', account.pass);
  await Promise.all([
    page.waitForNavigation({ timeout: 45000 }).catch(() => {}),
    page.click('button[type="submit"], input[type="submit"]'),
  ]);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  return page.url();
}

async function navLinks(page, limit) {
  const hrefs = await page.$$eval('aside a[href], .sidebar a[href], nav a[href], .sidebar-menu a[href]', (as) => as.map((a) => a.href));
  const seen = new Set();
  return hrefs
    .filter((h) => h.startsWith('https://staging.territool.com/') && !h.includes('#'))
    .map((h) => h.split('?')[0])
    .filter((h) => !/(delete|remove|destroy|deactive|activate|cancel|cron|sync|buy|redeem|logout|resend|convert|payment|subscribe|upgrade|download|export|import|disconnect|mongo_)/i.test(h))
    .filter((h) => (seen.has(h) ? false : (seen.add(h), true)))
    .slice(0, limit);
}

(async () => {
  const accounts = readAccounts();
  const browser = await chromium.launch();

  // Logged out
  {
    const ctx = await browser.newContext({ deviceScaleFactor: 1 });
    const blocked = [];
    await guard(ctx, blocked);
    const page = await ctx.newPage();
    for (const [name, p] of [['auth_01_login', '/login'], ['auth_02_register', '/register'], ['auth_03_password-reset', '/password/reset'], ['auth_04_b2b-signup', '/b2b']]) {
      await shot(page, 'public', name, BASE + p, [1440, 768, 390], blocked);
    }
    await ctx.close();
  }

  const plans = [
    { role: 'Sales Agent', fixed: ['/dashboard'], nav: 12 },
    { role: 'Business Sales Agent', fixed: ['/dashboard'], nav: 8 },
    { role: 'Business Agent', fixed: ['/manager/dashboard', '/manager/ai-find-leads', '/manager/salespeople', '/manager/salespeople/create', '/manager/activity', '/manager/reports', '/manager/support', '/manager/settings'], nav: 6 },
  ];

  for (const plan of plans) {
    const account = accounts[plan.role];
    if (!account) { console.log(`skip ${plan.role}: no account`); continue; }
    const ctx = await browser.newContext({ deviceScaleFactor: 1 });
    const blocked = [];
    await guard(ctx, blocked);
    const page = await ctx.newPage();
    let landing;
    try { landing = await login(page, account); } catch (e) { console.log(`${plan.role} login error: ${e.message.split('\n')[0]}`); await ctx.close(); continue; }
    console.log(`${plan.role} landed on ${landing.replace(BASE, '')}`);
    if (/\/login/.test(landing)) { console.log(`${plan.role}: still on login (credentials or captcha?)`); await ctx.close(); continue; }

    const urls = plan.fixed.map((p) => BASE + p);
    await page.goto(urls[0], { waitUntil: 'domcontentloaded' }).catch(() => {});
    for (const h of await navLinks(page, plan.nav)) if (!urls.includes(h)) urls.push(h);

    let i = 1;
    for (const u of urls) {
      const widths = i <= 2 ? [1440, 768, 390] : [1440];
      await shot(page, plan.role, `${String(i).padStart(2, '0')}_${slug(u)}`, u, widths, blocked);
      i++;
    }
    await ctx.close();
  }
  await browser.close();

  const lines = [
    '# Web screenshots — CAPTURED BY CLAUDE',
    '',
    `- Captured: ${new Date().toISOString()} with Playwright Chromium (\`tools/capture-web.js\`)`,
    `- Environment: **STAGING** (${BASE}); read-only navigation; non-GET requests blocked except login; destructive-looking URLs blocked`,
    '- Widths: 1440 (full page) for all; 768 and 390 for the first two pages per role',
    '- Roles: Sales Agent, Business Sales Agent, Business Agent (Manager); Admin pending (no account)',
    '- Data shown is staging test data',
    '',
    '| Role | Name | Width | HTTP | Final URL | Blocked requests on page | Error |',
    '|---|---|---|---|---|---|---|',
    ...manifest.map((m) => `| ${m.role} | ${m.name} | ${m.width} | ${m.status ?? ''} | ${m.final.replace(BASE, '')} | ${m.blockedDuringPage.length} | ${m.error ?? ''} |`),
    '',
    '## Fonts actually rendered (computed style + web fonts loaded, 1440 captures)',
    '',
    '| Role | Page | h1 | heading | body | button | web fonts loaded |',
    '|---|---|---|---|---|---|---|',
    ...manifest.filter((m) => m.fonts).map((m) => `| ${m.role} | ${m.name} | ${m.fonts.h1 ?? ''} | ${m.fonts.heading ?? ''} | ${m.fonts.body ?? ''} | ${m.fonts.button ?? ''} | ${(m.fonts.loadedWebFonts || []).join(', ') || 'none'} |`),
    '',
    '## Blocked requests (detail)',
    ...manifest.filter((m) => m.blockedDuringPage.length).map((m) => `- ${m.role} / ${m.name} w${m.width}: ${m.blockedDuringPage.map((b) => '`' + b.replace(BASE, '') + '`').join(', ')}`),
  ];
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'CAPTURED-BY-CLAUDE.md'), lines.join('\n') + '\n');
  console.log(`manifest: ${manifest.length} screenshots`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
