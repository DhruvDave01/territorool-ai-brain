/**
 * Real-browser helper for visual cases (2026-09-17). STAGING ONLY, read-only:
 *  - every non-GET request is aborted at the network layer, except the /login form POST;
 *  - pages are only navigated to (no clicks except the login submit);
 *  - screenshots go to workspace/qa-evidence/<date>/web-visual/.
 * Credentials come from .local/test-accounts.md and are never printed.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const BASE = 'https://staging.territool.com';
if (!/(^|\.)staging\.territool\.com$/.test(new URL(BASE).hostname)) throw new Error('Refusing: not staging');
const { chromium } = require(path.join(ROOT, 'tools/node_modules/playwright'));

const acc = () => {
  const out = {};
  for (const l of fs.readFileSync(path.join(ROOT, '.local', 'test-accounts.md'), 'utf8').split('\n')) {
    const c = l.split('|').map((s) => s.trim());
    if (['Sales Agent', 'Business Sales Agent', 'Business Agent'].includes(c[1]) && c[3] && !/pending/i.test(c[3])) out[c[1]] = { email: c[3], pass: c[4] };
  }
  return out;
};

let browser = null;
const contexts = new Map();
async function contextFor(role) {
  if (contexts.has(role)) return contexts.get(role);
  browser = browser || await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', (route) => {
    const req = route.request();
    const u = new URL(req.url());
    const loginPost = req.method() === 'POST' && u.hostname === 'staging.territool.com' && u.pathname === '/login';
    if (req.method() !== 'GET' && !loginPost) return route.abort();
    if (/app\.territool\.com/.test(u.hostname)) return route.abort();
    return route.continue();
  });
  if (role === 'Public') { contexts.set(role, ctx); return ctx; } // public pages: no sign-in
  const a = acc()[role];
  if (!a) throw new Error(`no ${role} account`);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="email"]', a.email);
  await page.fill('input[name="password"]', a.pass);
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}), page.click('button[type="submit"], input[type="submit"]')]);
  await page.close();
  contexts.set(role, ctx);
  return ctx;
}

/** Open `p` as `role` at `width`; return measurements and the screenshot path. */
async function measure(role, p, width, label) {
  const ctx = await contextFor(role);
  const page = await ctx.newPage();
  await page.setViewportSize({ width, height: 900 });
  const res = await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => null);
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  const m = await page.evaluate(() => {
    const pick = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontFamily : null; };
    const heads = [...document.querySelectorAll('h1, h2, h3, h4')].filter((e) => e.offsetParent !== null).slice(0, 8);
    const loaded = document.fonts ? [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, '')) : [];
    return {
      finalPath: location.pathname,
      bodyFont: pick('body'),
      headingFonts: [...new Set(heads.map((h) => getComputedStyle(h).fontFamily))],
      loadedFonts: [...new Set(loaded)],
      textFonts: (() => {
        const seen = {};
        for (const el of document.querySelectorAll('body *')) {
          if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
          if (!own) continue;
          const fam = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim();
          seen[fam] = (seen[fam] || 0) + 1;
        }
        return seen;
      })(),
      navVisible: [...document.querySelectorAll('a.sidebar-toggle, .navbar-toggle, [aria-label*="menu" i], [aria-label*="navigation" i], button[class*="menu" i], [class*="hamburger" i]')]
        .some((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.top < window.innerHeight && r.left < window.innerWidth; }),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
  const dir = path.join(ROOT, 'workspace', 'qa-evidence', new Date().toISOString().slice(0, 10), 'web-visual');
  fs.mkdirSync(dir, { recursive: true });
  const shot = path.join(dir, `${label}_w${width}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  await page.close();
  return { status: res ? res.status() : null, ...m, shot: path.relative(ROOT, shot) };
}

async function close() { if (browser) await browser.close(); browser = null; contexts.clear(); }
module.exports = { measure, close };
