#!/usr/bin/env node
/**
 * Territool design library sync — builds brain/assets/, a self-contained copy of every design asset the mobile
 * and web apps use:
 *   - fonts, icon fonts, logos, favicons, app icons, splash assets, images
 *   - themes, style files, email templates
 *   - brand and design docs, screenshots, videos, artifact pages
 *   - a colour inventory and a manifest
 * After it runs, design work needs nothing outside territool-brain/.
 * Code is NOT copied: code comes from the live repos (repos/mobile, repos/web) or the git remotes in MANIFEST.md.
 *
 * Sources:
 *   - repos/mobile and repos/web (read-only)
 *   - the exact CDN files the web app loads (Font Awesome 4.4.0 and 4.6.3, Ionicons 2.0.1, picker and jQuery UI
 *     themes). GET only, allowlisted hosts.
 *   - brain captures: shoebox/03-web/screenshots, workspace design-proposals, workspace artifact pages
 * Skipped:
 *   - user and generated data (public/user_session, public/pdf, generated PDFs and maps, public/screenshot,
 *     public/downloads), zips
 *   - text files that match a secret pattern (listed as withheld)
 * Hand-maintained, never touched: brain/assets/README.md, brain/assets/tokens/.
 *
 * Usage (from territool-brain/): node tools/sync-design-assets.js [--no-network] [--no-videos]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const NO_NET = args.includes('--no-network');
const NO_VIDEOS = args.includes('--no-videos');
const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'brain', 'assets');
const REPOS = { mobile: fs.realpathSync(path.join(ROOT, 'repos', 'mobile')), web: fs.realpathSync(path.join(ROOT, 'repos', 'web')), brain: ROOT };
const KEEP = new Set(['README.md', 'tokens']);
const IMG = /\.(png|jpe?g|gif|svg|webp|ico|bmp)$/i;
const TEXT = /\.(css|scss|js|jsx|ts|tsx|md|html?|xml|json|storyboard|txt|php|mjs)$/i;
const M = 'mobile';
const W = 'web';
const B = 'brain';

const manifest = [];
const skipped = [];
const withheld = [];

// ---------- secret guard (text files) ----------
const SECRET_RE = /AIza[0-9A-Za-z_-]{20,}|pk\.ey[0-9A-Za-z_.-]{20,}|phc_[0-9A-Za-z]{20,}|sk_(live|test)_[0-9A-Za-z]{8,}|xox[bap]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(password|passwd|client_secret|api_secret)\s*[:=]\s*['"][^'"\s]{6,}['"]/i;
const KEYISH = /(api[_-]?key|apikey|secret|access[_-]?token|client[_-]?token|bearer)/i;
const KEYLIKE = /['"](?=(?:[A-Za-z_-]*\d){2})(?=[0-9_-]*[A-Za-z])[A-Za-z0-9_-]{24,}['"]/;
function secretLine(text) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.length > 4000) continue; // minified CSS / embedded base64
    if (SECRET_RE.test(l) || (KEYISH.test(l) && KEYLIKE.test(l))) return i + 1;
  }
  return 0;
}

// ---------- helpers ----------
function record(destRel, buf, origin) {
  const rel = destRel.split(path.sep).join('/');
  const out = path.join(DEST, rel);
  if (!out.startsWith(DEST + path.sep)) throw new Error(`refusing to write outside brain/assets: ${rel}`);
  if (TEXT.test(rel)) {
    const ln = secretLine(buf.toString('utf8'));
    if (ln) { withheld.push({ dest: rel, origin, line: ln }); return false; }
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
  manifest.push({ dest: rel, origin, bytes: buf.length, sha1: crypto.createHash('sha1').update(buf).digest('hex') });
  return true;
}
function walk(abs, out = []) {
  if (!fs.existsSync(abs)) return out;
  if (fs.statSync(abs).isFile()) return [abs];
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.name === '.DS_Store' || e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(abs, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.isFile()) out.push(p);
  }
  return out;
}
function copy(repo, srcRel, destRel, filter = () => true, opts = {}) {
  const srcAbs = path.join(REPOS[repo], srcRel);
  if (!fs.existsSync(srcAbs)) { skipped.push({ origin: `${repo}:${srcRel}`, reason: 'not found' }); return 0; }
  const isDir = fs.statSync(srcAbs).isDirectory();
  const files = isDir
    ? (opts.flat ? fs.readdirSync(srcAbs).map((f) => path.join(srcAbs, f)).filter((f) => fs.statSync(f).isFile()) : walk(srcAbs))
    : [srcAbs];
  let n = 0;
  for (const f of files) {
    if (path.basename(f) === '.DS_Store') continue;
    const rel = isDir ? path.relative(srcAbs, f) : path.basename(f);
    const origin = `${repo}:${path.relative(REPOS[repo], f)}`;
    if (!filter(f)) { if (!opts.quietSkip) skipped.push({ origin, reason: opts.skipReason || 'not part of the design library' }); continue; }
    const buf = fs.readFileSync(f);
    if (!buf.length) { skipped.push({ origin, reason: 'empty file' }); continue; }
    if (record(path.join(destRel, rel), buf, origin)) n++;
  }
  return n;
}
function gitInfo(dir) {
  try {
    const g = (...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8' }).trim();
    return {
      path: dir, commit: g('rev-parse', '--short', 'HEAD'), branch: g('branch', '--show-current'),
      remote: g('remote', 'get-url', 'origin').replace(/\/\/[^@/]*@/, '//'),
      uncommittedFiles: g('status', '--porcelain').split('\n').filter(Boolean).length,
    };
  } catch (e) { return { path: dir, error: String(e.message).split('\n')[0] }; }
}

async function main() {
  // reset everything except hand-maintained files
  fs.mkdirSync(DEST, { recursive: true });
  for (const e of fs.readdirSync(DEST)) if (!KEEP.has(e)) fs.rmSync(path.join(DEST, e), { recursive: true, force: true });

  // ---------- fonts ----------
  copy(M, 'App/assets/fonts', 'fonts/mobile', (f) => /\.(ttf|otf)$/i.test(f));
  copy(W, 'public/fonts', 'fonts/web', (f) => /\.(ttf|otf|woff2?|eot)$/i.test(f));
  copy(W, 'public/generated', 'fonts/web-pdf', (f) => /\.(ttf|otf)$/i.test(f), { quietSkip: true });
  copy(M, 'Design-Brain/03-Assets/Fonts', 'fonts/mobile', (f) => /\.md$/i.test(f), { quietSkip: true });

  // ---------- icon fonts ----------
  copy(M, 'node_modules/react-native-vector-icons/Fonts', 'icon-fonts/mobile-react-native-vector-icons/fonts', (f) => /\.ttf$/i.test(f));
  copy(M, 'node_modules/react-native-vector-icons/glyphmaps', 'icon-fonts/mobile-react-native-vector-icons/glyphmaps', (f) => /\.json$/i.test(f));
  copy(M, 'node_modules/react-native-vector-icons/LICENSE', 'licenses/react-native-vector-icons');
  copy(W, 'public/vendor/adminlte/bootstrap/fonts', 'icon-fonts/web-glyphicons-bootstrap3');

  const usedSets = new Set();
  for (const f of walk(path.join(REPOS.mobile, 'App'))) {
    if (!/\.(js|jsx|ts|tsx)$/.test(f) || f.includes(`${path.sep}customPackage${path.sep}`)) continue;
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/react-native-vector-icons\/([A-Za-z0-9]+)/g)) usedSets.add(m[1]);
  }

  // ---------- brand: docs, logos, favicons, app icons, splash ----------
  for (const [src, dst] of [
    ['Design-Brain/01-Brand-Guidelines', 'brand/guidelines'],
    ['Design-Brain/02-User-Interface', 'brand/ui-notes'],
    ['Design-Brain/04-User-Flows', 'brand/flow-notes'],
    ['Design-Brain/05-Design-System', 'brand/design-system-notes'],
    ['Design-Brain/06-Coverage', 'brand/coverage-notes'],
  ]) copy(M, src, dst);
  copy(M, 'Design-Brain', 'brand/design-brain-root', (f) => /\.md$/i.test(f), { flat: true, quietSkip: true });
  copy(M, 'Design-Brain/03-Assets', 'brand/asset-notes', (f) => /\.md$/i.test(f), { flat: true, quietSkip: true });
  copy(M, 'Design-Brain/03-Assets/Logos', 'brand/logos/mobile');
  copy(W, 'public/images', 'brand/logos/web', (f) => IMG.test(f) && /(logo|tt_smal)/i.test(path.basename(f)), { flat: true, quietSkip: true });
  copy(W, 'public/vendor/adminlte/dist/img/logo.png', 'brand/logos/web/adminlte');
  copy(W, 'public/vendor/adminlte/dist/img', 'brand/favicons/web', (f) => /\.ico$/i.test(f), { flat: true, quietSkip: true });
  copy(W, 'public/favicon.ico', 'brand/favicons/web');
  copy(M, 'ios/TerriTool/Images.xcassets', 'brand/app-icons/ios', (f) => /\.(png|json)$/i.test(f));
  copy(M, 'android/app/src/main/res', 'brand/app-icons/android', (f) => /mipmap-[a-z]+[\\/][^\\/]+\.png$/i.test(f), { quietSkip: true });
  copy(M, 'App/assets/lottie', 'brand/splash/mobile/lottie');
  copy(M, 'ios/TerriTool/LaunchScreen.storyboard', 'brand/splash/mobile/ios');
  copy(M, 'android/app/src/main/res/values/color.xml', 'brand/splash/mobile/android');
  copy(M, 'android/app/src/main/res/values/styles.xml', 'brand/splash/mobile/android');
  skipped.push({ origin: 'mobile:android/app/src/main/res/values/strings.xml', reason: 'not design; contains Facebook app id and client token' });

  // ---------- icons ----------
  copy(M, 'Design-Brain/03-Assets/Icons', 'icons/mobile-png');
  const lucide = new Set();
  for (const f of walk(path.join(REPOS.web, 'resources', 'manager-portal'))) {
    if (!/\.(jsx?|tsx?)$/.test(f)) continue;
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g)) {
      m[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0]).filter(Boolean).forEach((n) => lucide.add(n));
    }
  }
  const lucidePkg = path.join(REPOS.web, 'node_modules', 'lucide-react');
  let lucideVersion = null;
  if (fs.existsSync(path.join(lucidePkg, 'dist', 'esm', 'lucide-react.js'))) {
    lucideVersion = JSON.parse(fs.readFileSync(path.join(lucidePkg, 'package.json'), 'utf8')).version;
    const idx = fs.readFileSync(path.join(lucidePkg, 'dist', 'esm', 'lucide-react.js'), 'utf8');
    const nameToFile = {};
    for (const m of idx.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"]\.\/icons\/([a-z0-9-]+)\.js['"]/g)) {
      for (const part of m[1].split(',')) { const mm = part.trim().match(/^default as (\w+)$/); if (mm) nameToFile[mm[1]] = m[2]; }
    }
    for (const name of [...lucide].sort()) {
      const file = nameToFile[name];
      const iconPath = file && path.join(lucidePkg, 'dist', 'esm', 'icons', `${file}.js`);
      if (!iconPath || !fs.existsSync(iconPath)) { skipped.push({ origin: `web:lucide-react/${name}`, reason: 'icon export not found' }); continue; }
      const src = fs.readFileSync(iconPath, 'utf8');
      const nodeStr = (src.match(/__iconNode\s*=\s*(\[[\s\S]*?\]);/) || [])[1] || '';
      const els = [...nodeStr.matchAll(/\[\s*["'](\w+)["']\s*,\s*\{([^}]*)\}\s*\]/g)].map(([, tag, attrs]) => {
        const a = [...attrs.matchAll(/(\w+)\s*:\s*["']([^"']*)["']/g)].filter(([, k]) => k !== 'key').map(([, k, v]) => `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${v}"`);
        return `  <${tag} ${a.join(' ')} />`;
      });
      if (!els.length) { skipped.push({ origin: `web:lucide-react/${name}`, reason: 'could not read icon geometry' }); continue; }
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n${els.join('\n')}\n</svg>\n`;
      record(`icons/web-portal-lucide/${name}.svg`, Buffer.from(svg), `web:node_modules/lucide-react/dist/esm/icons/${file}.js (lucide-react ${lucideVersion})`);
    }
    copy(W, 'node_modules/lucide-react/LICENSE', 'licenses/lucide-react');
  } else {
    skipped.push({ origin: 'web:node_modules/lucide-react', reason: 'package not installed; icon names listed in MANIFEST only' });
  }

  // ---------- images ----------
  copy(M, 'App/images', 'images/mobile', (f) => IMG.test(f), { skipReason: 'not an image (zip / pdf bundle)' });
  copy(M, 'Design-Brain/03-Assets/Images', 'images/mobile-design-brain');
  copy(M, 'docs/user-guide/assets', 'images/mobile-user-guide', (f) => IMG.test(f));
  copy(W, 'public/images', 'images/web', (f) => IMG.test(f));
  copy(W, 'public/vendor/adminlte/dist/img', 'images/web-adminlte', (f) => IMG.test(f));

  // ---------- themes ----------
  copy(M, 'App/styles', 'themes/mobile/App-styles');
  copy(M, 'App/utils/commonFunctions.ts', 'themes/mobile/support');
  copy(W, 'public/vendor/adminlte/dist/css', 'themes/web-adminlte/dist-css');
  copy(W, 'public/vendor/adminlte/bootstrap/css', 'themes/web-adminlte/bootstrap-css');
  copy(W, 'public/vendor/adminlte/plugins/pace', 'themes/web-adminlte/plugins-pace', (f) => /\.css$/i.test(f), { quietSkip: true });
  copy(W, 'public/vendor/backpack/backpack.base.css', 'themes/web-backpack');
  copy(W, 'public/vendor/backpack/pnotify', 'themes/web-backpack/pnotify', (f) => /\.css$/i.test(f), { quietSkip: true });
  copy(W, 'public/vendor/backpack/select2', 'themes/web-backpack/select2', (f) => /\.(css|png|gif)$/i.test(f), { quietSkip: true });
  copy(W, 'public/jqwidgets/styles', 'themes/web-jqwidgets', (f) => /jqx\.(base|bootstrap|arctic)\.css$/i.test(f) || /[\\/]images[\\/]/.test(f), { quietSkip: true });
  copy(W, 'resources/assets/sass', 'themes/web-laravel-sass');

  // ---------- styles ----------
  for (const f of walk(path.join(REPOS.mobile, 'App'))) {
    if (!f.endsWith('.styles.js') || f.includes(`${path.sep}customPackage${path.sep}`)) continue;
    const rel = path.relative(REPOS.mobile, f);
    record(path.join('styles', 'mobile-components', rel), fs.readFileSync(f), `mobile:${rel}`);
  }
  copy(W, 'public/css', 'styles/web-css');
  copy(W, 'public/partials', 'styles/web-static-partials');
  copy(W, 'resources/views/mails', 'styles/web-email-templates');
  let bladeInline = 0;
  for (const f of walk(path.join(REPOS.web, 'resources', 'views'))) {
    if (!f.endsWith('.blade.php')) continue;
    const blocks = [...fs.readFileSync(f, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
    if (!blocks.length) continue;
    const rel = path.relative(REPOS.web, f);
    const css = blocks.map((b, i) => `/* ===== ${rel} · <style> block ${i + 1} of ${blocks.length} ===== */\n${b[1].trim()}\n`).join('\n');
    const dest = path.join('styles', 'web-blade-inline', rel.replace(/^resources[\\/]views[\\/]/, '').replace(/\.blade\.php$/, '.css'));
    if (record(dest, Buffer.from(css), `web:${rel} (extracted <style> blocks)`)) bladeInline++;
  }

  // ---------- docs ----------
  for (const p of ['cursorUIUX.md', 'cursorUIUX.gu.md', 'INLINE_STYLE_AUDIT.md', 'appbutton-migration.md', 'components-audit.md', 'components-migration.md', 'fix-native-base-theme.md']) copy(M, `Prompts/${p}`, 'docs/mobile-ui-prompts');
  copy(M, 'docs/user-guide', 'docs/mobile-user-guide', (f) => /\.(html|pdf)$/i.test(f), { quietSkip: true });
  copy(M, 'docs/TerriTool-RevenueCat-Subscriptions-Guide.html', 'docs/mobile-subscriptions-guide');
  copy(M, 'docs/TerriTool-RevenueCat-Subscriptions-Guide.pdf', 'docs/mobile-subscriptions-guide');
  copy(B, 'workspace/design-proposals', 'docs/design-audits', (f) => /\.(md|json|png)$/i.test(f), { quietSkip: true });

  // ---------- screenshots, videos, artifacts ----------
  copy(M, 'Design-Brain/03-Assets/Screenshots', 'screenshots/mobile', (f) => IMG.test(f));
  for (const f of fs.readdirSync(REPOS.mobile).filter((x) => /^Screenshot.*\.png$/i.test(x))) copy(M, f, 'screenshots/mobile/repo-root');
  copy(B, 'shoebox/03-web/screenshots', 'screenshots/web');
  // Owner-provided captures dropped into the shoebox (see shoebox/02-mobile/README.md)
  const VIDEO = /\.(mp4|mov|m4v)$/i;
  copy(B, 'shoebox/02-mobile/screenshots', 'screenshots/mobile-owner', (f) => IMG.test(f), { quietSkip: true });
  copy(B, 'shoebox/02-mobile/frames', 'screenshots/mobile-owner-frames', (f) => IMG.test(f), { quietSkip: true });
  copy(B, 'shoebox/02-mobile/notes', 'docs/mobile-owner-notes', (f) => /\.md$/i.test(f), { quietSkip: true });
  copy(B, 'shoebox/03-web/frames', 'screenshots/web-owner-frames', (f) => IMG.test(f), { quietSkip: true });
  copy(B, 'shoebox/03-web/notes', 'docs/web-owner-notes', (f) => /\.md$/i.test(f), { quietSkip: true });
  copy(B, 'shoebox/04-design/references', 'docs/design-references', (f) => IMG.test(f) || /\.(md|pdf)$/i.test(f), { quietSkip: true });
  if (!NO_VIDEOS) {
    copy(B, 'shoebox/02-mobile/videos', 'videos/mobile-owner', (f) => VIDEO.test(f), { quietSkip: true });
    copy(B, 'shoebox/03-web/videos', 'videos/web-owner', (f) => VIDEO.test(f), { quietSkip: true });
  }
  if (NO_VIDEOS) skipped.push({ origin: 'mobile:Design-Brain/03-Assets/Videos', reason: '--no-videos' });
  else copy(M, 'Design-Brain/03-Assets/Videos', 'videos/mobile');
  copy(B, 'workspace/brain-map', 'artifacts/brain-map');
  copy(B, 'workspace/brain-graph', 'artifacts/brain-graph');

  for (const [p, why] of [
    ['public/user_session', 'user session uploads (user data)'],
    ['public/pdf', 'generated route PDFs (user data)'],
    ['public/generated', 'generated PDFs and map images (user data); fonts copied'],
    ['public/screenshot', 'uploaded 2019 screenshots (not app design)'],
    ['public/downloads', 'downloadable documents (not design)'],
    ['public/sample_document', 'CSV import samples (not design)'],
  ]) skipped.push({ origin: `web:${p}`, reason: why });

  // ---------- CDN files the web app loads (mirrored so nothing is fetched later) ----------
  const CDN_ALLOW = /^https:\/\/(maxcdn\.bootstrapcdn\.com|code\.ionicframework\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|code\.jquery\.com)\//;
  const CDN = [
    { root: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/', css: 'css/font-awesome.min.css', dest: 'icon-fonts/web-font-awesome-4.4.0' },
    { root: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/', css: 'css/font-awesome.min.css', dest: 'icon-fonts/web-font-awesome-4.6.3' },
    { root: 'https://code.ionicframework.com/ionicons/2.0.1/', css: 'css/ionicons.min.css', dest: 'icon-fonts/web-ionicons-2.0.1' },
    { root: 'https://cdn.jsdelivr.net/npm/daterangepicker/', css: 'daterangepicker.css', dest: 'themes/web-cdn-plugins/daterangepicker' },
    { root: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.5/', css: 'css/bootstrap-colorpicker.min.css', dest: 'themes/web-cdn-plugins/bootstrap-colorpicker-2.3.5' },
    { root: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.5.0/', css: 'css/bootstrap-datepicker.css', dest: 'themes/web-cdn-plugins/bootstrap-datepicker-1.5.0' },
    { root: 'https://cdn.jsdelivr.net/bootstrap.datetimepicker/4.17.42/', css: 'css/bootstrap-datetimepicker.min.css', dest: 'themes/web-cdn-plugins/bootstrap-datetimepicker-4.17.42' },
    { root: 'https://code.jquery.com/ui/1.10.4/themes/smoothness/', css: 'jquery-ui.css', dest: 'themes/web-cdn-plugins/jquery-ui-1.10.4-smoothness' },
  ];
  async function get(url) {
    if (!CDN_ALLOW.test(url)) throw new Error(`blocked host: ${url}`);
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  let cdnFiles = 0;
  if (NO_NET) {
    CDN.forEach((c) => skipped.push({ origin: c.root + c.css, reason: '--no-network' }));
  } else {
    for (const c of CDN) {
      const cssUrl = c.root + c.css;
      try {
        const css = await get(cssUrl);
        if (record(path.join(c.dest, c.css), css, cssUrl)) cdnFiles++;
        const refs = new Set();
        for (const m of css.toString('utf8').matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
          const ref = m[2].trim();
          if (/^(data:|https?:|\/\/|#)/i.test(ref)) continue;
          const u = new URL(ref, cssUrl);
          u.search = ''; u.hash = '';
          if (u.href.startsWith(c.root)) refs.add(u.href);
        }
        for (const href of refs) {
          try { if (record(path.join(c.dest, decodeURIComponent(href.slice(c.root.length))), await get(href), href)) cdnFiles++; }
          catch (e) { skipped.push({ origin: href, reason: `download failed: ${e.message}` }); }
        }
      } catch (e) { skipped.push({ origin: cssUrl, reason: `download failed: ${e.message}` }); }
    }
  }

  // ---------- colour inventory ----------
  function colorsIn(text) {
    const out = [];
    for (const m of text.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
      let h = m[1].toUpperCase();
      if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
      out.push(`#${h}`);
    }
    for (const m of text.matchAll(/rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[\d.]+\s*)?\)/gi)) out.push(m[0].replace(/\s+/g, '').toLowerCase());
    return out;
  }
  // Only §1–§4 (token tables). §5 onwards cites legacy / do-not-copy colours, which must not count as approved.
  const approvedHex = new Set((fs.readFileSync(path.join(ROOT, 'brain', 'context', 'design-system.md'), 'utf8').split(/^## 5\./m)[0].match(/#[0-9A-Fa-f]{6}\b/g) || []).map((h) => h.toUpperCase()));
  const colourSources = {
    mobile: [
      ...walk(path.join(REPOS.mobile, 'App')).filter((f) => /\.(js|jsx|ts|tsx)$/.test(f) && !f.includes(`${path.sep}customPackage${path.sep}`)),
      path.join(REPOS.mobile, 'android/app/src/main/res/values/color.xml'),
    ],
    web: [
      ...walk(path.join(REPOS.web, 'public', 'css')).filter((f) => /\.css$/.test(f)),
      path.join(REPOS.web, 'public/vendor/adminlte/dist/css/AdminLTE.min.css'),
      ...walk(path.join(REPOS.web, 'resources', 'manager-portal')).filter((f) => /\.(jsx?|css)$/.test(f)),
      ...walk(path.join(REPOS.web, 'resources', 'views')).filter((f) => /\.blade\.php$/.test(f)),
    ],
  };
  const palette = {};
  for (const [platform, files] of Object.entries(colourSources)) {
    const totals = {};
    for (const f of files.filter((x) => fs.existsSync(x))) {
      const rel = path.relative(REPOS[platform], f);
      for (const col of colorsIn(fs.readFileSync(f, 'utf8'))) {
        totals[col] = totals[col] || { count: 0, files: {} };
        totals[col].count++;
        totals[col].files[rel] = (totals[col].files[rel] || 0) + 1;
      }
    }
    palette[platform] = Object.entries(totals)
      .map(([color, v]) => ({ color, count: v.count, approvedToken: color.length === 7 && approvedHex.has(color), files: Object.keys(v.files).length, topFiles: Object.entries(v.files).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f, n]) => `${f} (${n})`) }))
      .sort((a, b) => b.count - a.count);
  }
  record('colors/palette.json', Buffer.from(JSON.stringify({ generatedAt: new Date().toISOString(), approvedTokenHex: [...approvedHex].sort(), palette }, null, 2)), 'generated from mobile App/** + color.xml; web public/css, AdminLTE.min.css, manager-portal, Blade views');
  const palMd = [
    '# Colour inventory (generated: do not edit)', '',
    `Generated ${new Date().toISOString()} by \`node tools/sync-design-assets.js\`.`, '',
    '**For new work, use only the approved tokens** (`brain/assets/tokens/`, `brain/context/design-system.md`).',
    'This inventory records what the apps contain today, so existing screens can be matched or audited. It is not a palette to pick from.', '',
  ];
  for (const [platform, list] of Object.entries(palette)) {
    palMd.push(
      `## ${platform === 'mobile' ? 'Mobile (App/**, Android color.xml)' : 'Web (public/css, AdminLTE, manager portal, Blade views)'}: ${list.length} distinct colour literals`, '',
      '| Colour | Uses | Files | Approved token? | Top files |', '|---|---|---|---|---|',
      ...list.map((c) => `| \`${c.color}\` | ${c.count} | ${c.files} | ${c.approvedToken ? 'yes' : ''} | ${c.topFiles.join('; ')} |`), '',
    );
  }
  record('colors/PALETTE.md', Buffer.from(palMd.join('\n') + '\n'), 'generated');

  // ---------- manifest ----------
  const sources = { mobile: gitInfo(REPOS.mobile), web: gitInfo(REPOS.web) };
  const mb = (b) => `${(b / 1048576).toFixed(1)} MB`;
  const folders = {};
  for (const m of manifest) {
    const key = m.dest.split('/').slice(0, 2).join('/');
    folders[key] = folders[key] || { files: 0, bytes: 0 };
    folders[key].files++; folders[key].bytes += m.bytes;
  }
  const groupedSkips = {};
  for (const s of skipped) {
    const key = `${s.origin.includes('://') ? s.origin : s.origin.replace(/[\\/][^\\/]+$/, '/…')}|${s.reason}`;
    groupedSkips[key] = (groupedSkips[key] || 0) + 1;
  }
  const totalBytes = manifest.reduce((s, m) => s + m.bytes, 0);
  const meta = {
    generatedAt: new Date().toISOString(), sources, totalFiles: manifest.length, totalBytes,
    usedVectorIconSets: [...usedSets].sort(), lucideIconsUsedInPortal: [...lucide].sort(), lucideVersion, bladeFilesWithInlineStyles: bladeInline, cdnFilesMirrored: cdnFiles,
  };
  fs.writeFileSync(path.join(DEST, 'manifest.json'), JSON.stringify({ ...meta, files: manifest, withheld, notCopied: skipped }, null, 2));
  const md = [
    '# Design library manifest (generated: do not edit)', '',
    `Generated ${meta.generatedAt} by \`node tools/sync-design-assets.js\`. How to use the library: \`brain/assets/README.md\` and \`brain/context/design-assets.md\`.`, '',
    '## Copied from', '',
    '| Repo | Local path at sync time | Branch | Commit | Uncommitted files | Remote |', '|---|---|---|---|---|---|',
    ...Object.entries(sources).map(([k, s]) => `| ${k} | \`${s.path}\` | ${s.branch || ''} | ${s.commit || s.error || ''} | ${s.uncommittedFiles ?? ''} | ${s.remote || ''} |`),
    '', `Plus CDN files the web app loads (${cdnFiles} files) and brain captures (shoebox web screenshots, design audits, artifact pages).`, '',
    `**Total:** ${manifest.length} files, ${mb(totalBytes)}.`, '',
    '| Folder | Files | Size |', '|---|---|---|',
    ...Object.entries(folders).sort().map(([k, v]) => `| \`${k}/\` | ${v.files} | ${mb(v.bytes)} |`), '',
    `**Mobile vector icon sets imported by the app:** ${meta.usedVectorIconSets.join(', ')} (all sets' fonts and glyph maps are copied).`, '',
    `**Lucide icons used by the manager portal** (lucide-react ${lucideVersion || 'n/a'}, SVGs generated in \`icons/web-portal-lucide/\`): ${meta.lucideIconsUsedInPortal.join(', ')}`, '',
    `**Blade views with inline <style> blocks extracted:** ${bladeInline}`, '',
    '## Withheld (possible secret in file)', '',
    ...(withheld.length ? ['| Would have been | From | Line |', '|---|---|---|', ...withheld.map((w) => `| \`${w.dest}\` | ${w.origin} | ${w.line} |`)] : ['None.']), '',
    '## Not copied', '', '| Source | Reason | Files |', '|---|---|---|',
    ...Object.entries(groupedSkips).map(([k, n]) => { const [o, r] = k.split('|'); return `| \`${o}\` | ${r} | ${n} |`; }), '',
    '## Files', '', '| File | From | Size | sha1 |', '|---|---|---|---|',
    ...manifest.map((m) => `| \`${m.dest}\` | ${m.origin} | ${m.bytes.toLocaleString()} B | \`${m.sha1.slice(0, 10)}\` |`), '',
  ];
  fs.writeFileSync(path.join(DEST, 'MANIFEST.md'), md.join('\n'));

  console.log(`library: ${manifest.length} files, ${mb(totalBytes)} · withheld ${withheld.length} · not-copied entries ${skipped.length}`);
  for (const [k, v] of Object.entries(folders).sort()) console.log(`  ${k.padEnd(48)} ${String(v.files).padStart(5)}  ${mb(v.bytes)}`);
  console.log(`sources: mobile ${sources.mobile.branch}@${sources.mobile.commit} (${sources.mobile.uncommittedFiles} uncommitted) · web ${sources.web.branch}@${sources.web.commit} (${sources.web.uncommittedFiles} uncommitted)`);
  console.log(`cdn mirrored ${cdnFiles} · lucide svgs ${manifest.filter((m) => m.dest.startsWith('icons/web-portal-lucide/')).length}/${lucide.size} · blade inline css ${bladeInline}`);
  console.log(`colours: mobile ${palette.mobile.length} distinct, web ${palette.web.length} distinct`);
  if (withheld.length) console.log('withheld:', withheld.map((w) => `${w.origin}:${w.line}`).join(', '));
  const fails = skipped.filter((s) => /failed|not found|not read|not installed/.test(s.reason));
  if (fails.length) console.log('attention:', fails.map((s) => `${s.origin} (${s.reason})`).join('; '));
}

main().catch((e) => { console.error('FATAL', e.stack); process.exit(1); });
