/**
 * Territool design-audit probe — STAGING ONLY, read-only navigation (same guard as capture-web.js).
 *
 * Measures computed styles of named elements on one page at 1440 / 768 / 390, computes WCAG contrast
 * against the effective background, records layout signals (nav visible, horizontal overflow, tap sizes),
 * and saves screenshots. Used by territool-design AUDIT (formerly Mode A) and territool-qa design-gate §B.
 *
 * Usage (from tools/):
 *   PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" node probe-styles.js --role "Business Agent" \
 *     --path /manager/salespeople --targets ../workspace/design-proposals/<dir>/targets.json \
 *     --out ../workspace/design-proposals/<dir>/screens
 *
 * targets.json: [{ "label": "...", "text": "Visible text", "exact": true } | { "label": "...", "selector": "css" }]
 * Nothing is clicked except the login submit. Credentials come from ../.local/test-accounts.md and are never printed.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = 'https://staging.territool.com';
if (!/(^|\.)staging\.territool\.com$/.test(new URL(BASE).hostname)) throw new Error('Refusing to run: base URL is not staging');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const ROLE = opt('--role');
const PAGE_PATH = opt('--path');
const TARGETS = JSON.parse(fs.readFileSync(opt('--targets'), 'utf8'));
const OUT = path.resolve(opt('--out'));
const WIDTHS = (opt('--widths', '1440,768,390')).split(',').map(Number);
const ROOT = path.resolve(__dirname, '..');
const ACCOUNTS = path.join(ROOT, '.local', 'test-accounts.md');
const DESTRUCTIVE = /(delete|remove|destroy|deactive|deactivate|activate|cancel|cron|sync|buy|redeem|logout|resend|convert|payment|subscribe|upgrade|credits-addon|paypal|stripe|extend-days|lifetime|errorfix|bulkdelete|deletesession|clear-|generateroute|re_generate|regenerate|download|export|import|dataloader|disconnect|mark-as-visited|markasvisited|add-to-list|removecontact|uniqueroute|updatepreference|get_percentage|mongo_)/i;

function readAccounts() {
  const rows = fs.readFileSync(ACCOUNTS, 'utf8').split('\n').filter((l) => /^\|\s*(Sales Agent|Business Sales Agent|Business Agent|Admin)\s*\|/.test(l));
  const acc = {};
  for (const r of rows) {
    const c = r.split('|').map((s) => s.trim());
    if (c[3] && c[4] && !/pending/i.test(c[3])) acc[c[1]] = { email: c[3], pass: c[4] };
  }
  return acc;
}

async function guard(context, log) {
  await context.route('**/*', (route) => {
    const req = route.request();
    const url = req.url();
    const sameOrigin = url.startsWith(BASE);
    const isLoginPost = req.method() === 'POST' && sameOrigin && /\/login\/?(\?|$)/.test(url);
    if (sameOrigin && !['GET', 'HEAD'].includes(req.method()) && !isLoginPost) { log.push(`${req.method()} ${url}`); return route.abort(); }
    const isStatic = /\.(js|css|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|otf|eot|map)$/i.test(new URL(url).pathname);
    if (sameOrigin && req.method() === 'GET' && !isStatic && DESTRUCTIVE.test(new URL(url).pathname)) { log.push(`GET(blocked) ${url}`); return route.abort(); }
    return route.continue();
  });
}

// WCAG helpers
const parse = (c) => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
const lum = ({ r, g, b }) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
const hex = (c) => (c ? '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase() : null);

(async () => {
  const account = readAccounts()[ROLE];
  if (!account) throw new Error(`No staging account for role ${ROLE}`);
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const blocked = [];
  await guard(ctx, blocked);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('input[name="email"]', account.email);
  await page.fill('input[name="password"]', account.pass);
  await Promise.all([page.waitForNavigation({ timeout: 45000 }).catch(() => {}), page.click('button[type="submit"], input[type="submit"]')]);
  if (/\/login/.test(page.url())) throw new Error('Login did not complete');

  const report = { role: ROLE, path: PAGE_PATH, capturedAt: new Date().toISOString(), widths: {} };
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: w >= 1200 ? 900 : w >= 700 ? 1024 : 844 });
    await page.goto(BASE + PAGE_PATH, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const shot = path.join(OUT, `${PAGE_PATH.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}_w${w}.png`);
    await page.screenshot({ path: shot, fullPage: true });

    const layout = await page.evaluate(() => {
      const fonts = new Set();
      document.fonts.forEach((f) => { if (f.status === 'loaded') fonts.add(f.family.replace(/["']/g, '')); });
      const menuBtn = [...document.querySelectorAll('button, [role="button"], a')].find((b) => /menu|navigation|toggle/i.test((b.getAttribute('aria-label') || '') + ' ' + (b.className || '')) && b.getBoundingClientRect().width > 0);
      return { horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, menuButtonVisible: !!menuBtn, webFontsLoaded: [...fonts] };
    });

    const elements = [];
    for (const t of TARGETS) {
      const loc = t.selector ? page.locator(t.selector).first() : page.getByText(t.text, { exact: !!t.exact }).first();
      const visible = await loc.isVisible().catch(() => false);
      if (!visible) { elements.push({ label: t.label, visible: false }); continue; }
      const s = await loc.evaluate((e) => {
        const cs = getComputedStyle(e);
        let bgEl = e, bg = 'rgba(0, 0, 0, 0)';
        while (bgEl) { const b = getComputedStyle(bgEl).backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) { bg = b; break; } bgEl = bgEl.parentElement; }
        const r = e.getBoundingClientRect();
        return {
          tag: e.tagName.toLowerCase(), text: (e.innerText || e.value || e.getAttribute('placeholder') || '').trim().slice(0, 40),
          color: cs.color, background: cs.backgroundColor, effectiveBackground: bg, fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, padding: cs.padding, borderRadius: cs.borderRadius,
          border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`, boxShadow: cs.boxShadow, opacity: cs.opacity, width: Math.round(r.width), height: Math.round(r.height),
          // Phase 7: isVisible() is true for off-canvas drawers; gradients aren't seen by the background walk.
          inViewport: r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.width > 0,
          backgroundImage: (() => { let n = e; while (n) { const bi = getComputedStyle(n).backgroundImage; if (bi && bi !== 'none') return bi.slice(0, 120); n = n.parentElement; } return null; })(),
        };
      });
      const fg = parse(s.color), bg = parse(s.effectiveBackground) || { r: 255, g: 255, b: 255, a: 1 };
      const solidBg = bg.a < 1 ? over(bg, { r: 255, g: 255, b: 255, a: 1 }) : bg;
      const solidFg = fg ? over(fg, solidBg) : null;
      elements.push({ label: t.label, visible: true, ...s, colorHex: hex(solidFg), backgroundHex: hex(solidBg), contrast: solidFg ? ratio(solidFg, solidBg) : null });
    }
    report.widths[w] = { screenshot: path.relative(ROOT, shot), layout, elements };
    console.log(`w${w}: ${elements.filter((e) => e.visible).length}/${elements.length} targets visible · overflow=${layout.horizontalOverflow} · menuButton=${layout.menuButtonVisible}`);
  }
  report.blockedRequests = blocked.map((b) => b.replace(BASE, ''));
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(report, null, 2));
  console.log(`blocked requests: ${blocked.length}; report: ${path.relative(ROOT, path.join(OUT, 'probe.json'))}`);
  await browser.close();
})().catch((e) => { console.error('FATAL', e.message.split('\n')[0]); process.exit(1); });
