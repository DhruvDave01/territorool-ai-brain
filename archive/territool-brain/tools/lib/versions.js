/**
 * One home for version numbers: brain/context/stack.md §0.
 *
 *   canonical(root)          → { key: value } parsed from the §0 table
 *   sourceDrift(root, canon) → [{ key, canonical, source, found }] where §0 disagrees with the repo/tool it cites
 *   mentions(text)           → [{ key, version, line }] version statements found in prose
 *   consistent(said, canon)  → true when `said` is the canonical value or a prefix of it ("7.4" vs "7.4.33")
 *
 *   node tools/lib/versions.js --self-test
 *
 * mobile-build is deliberately not scanned in prose: captures and QA reports correctly name the build they
 * were taken on, which will differ from §0 once a newer build is installed.
 */
const fs = require('fs');
const path = require('path');

const STACK = 'brain/context/stack.md';

function canonical(root) {
  const t = fs.readFileSync(path.join(root, STACK), 'utf8');
  const s = t.indexOf('## 0. Canonical versions');
  if (s === -1) return {};
  const block = t.slice(s, t.indexOf('\n## ', s + 5));
  const out = {};
  for (const m of block.matchAll(/^\|\s*`([a-z-]+)`\s*\|\s*([^|]+?)\s*\|/gm)) out[m[1]] = m[2];
  return out;
}

const bare = (v) => String(v).replace(/^[\^~]/, '').trim();

function consistent(said, canon) {
  const a = bare(said); const b = bare(canon);
  return a === b || b.startsWith(`${a}.`);
}

function sourceDrift(root, canon) {
  const read = (p) => { try { return fs.readFileSync(path.join(root, p), 'utf8'); } catch { return null; } };
  const out = [];
  const check = (key, source, found) => {
    if (found == null || canon[key] == null) return;
    if (bare(found) !== bare(canon[key])) out.push({ key, canonical: canon[key], source, found });
  };
  const pkg = read('repos/mobile/package.json');
  if (pkg) {
    const j = JSON.parse(pkg); const d = { ...j.devDependencies, ...j.dependencies };
    check('react-native', 'repos/mobile/package.json', d['react-native']);
    check('react-mobile', 'repos/mobile/package.json', d.react);
    check('typescript', 'repos/mobile/package.json', d.typescript);
    check('detox', 'repos/mobile/package.json', d.detox);
  }
  const web = read('repos/web/package.json');
  if (web) { const j = JSON.parse(web); check('react-portal', 'repos/web/package.json', ({ ...j.devDependencies, ...j.dependencies }).react); }
  const app = read('repos/web/vendor/laravel/framework/src/Illuminate/Foundation/Application.php');
  if (app) check('laravel', 'Application.php VERSION', (app.match(/const VERSION = '([^']+)'/) || [])[1]);
  const lock = read('repos/web/composer.lock');
  if (lock) { const p = (JSON.parse(lock)['packages-dev'] || []).concat(JSON.parse(lock).packages || []).find((x) => x.name === 'phpunit/phpunit'); check('phpunit', 'repos/web/composer.lock', p && p.version); }
  const doctor = read('tools/doctor.js');
  if (doctor) check('node-min', 'tools/doctor.js', (doctor.match(/major >= (\d+)/) || [])[1]);
  return out;
}

const V = '(\\d+\\.\\d+(?:\\.\\d+)?)';
const PATTERNS = [
  ['react-native', new RegExp(`React Native\\s+\\**v?${V}`, 'g')],
  ['react', new RegExp(`\\bReact\\s+\\**${V}`, 'g')],            // resolved to react-mobile / react-portal by major
  ['react', /\bReact\s+\**(\d+)\b(?![.\d])/g],
  ['typescript', new RegExp(`TypeScript\\s+\\^?${V}`, 'g')],
  ['detox', new RegExp(`Detox\\s+\\^?${V}`, 'g')],
  ['laravel', new RegExp(`Laravel\\s+\\**${V}`, 'g')],
  ['php', new RegExp(`\\bPHP\\s+\\**${V}`, 'g')],
  ['phpunit', new RegExp(`PHPUnit\\s+${V}`, 'g')],
  ['maestro', /Maestro\s+(?:CLI\s+)?(\d+\.\d+\.\d+)/g],
  ['node-min', /\bnode\s*(?:≥|>=)\s*(\d+)/gi],
  ['node-min', /\bNode\s+(\d+)\s+or newer/g],
];

function mentions(text) {
  const out = [];
  text.split('\n').forEach((line, i) => {
    for (const [key, re] of PATTERNS) {
      re.lastIndex = 0;
      for (const m of line.matchAll(re)) out.push({ key, version: m[1], line: i + 1 });
    }
  });
  return out;
}

/** Map a mention to the canonical key it must agree with (React is split by major version). */
function resolve(m, canon) {
  if (m.key !== 'react') return m.key;
  const major = bare(m.version).split('.')[0];
  for (const k of ['react-mobile', 'react-portal']) if (canon[k] && bare(canon[k]).split('.')[0] === major) return k;
  return 'react-mobile';
}

module.exports = { STACK, canonical, sourceDrift, mentions, consistent, resolve };

if (require.main === module && process.argv.includes('--self-test')) {
  const canon = { 'react-native': '0.84.1', 'react-mobile': '19.2.3', 'react-portal': '^18.3.1', php: '7.4.33', laravel: '5.3.31', 'node-min': '18' };
  const bad = (text) => mentions(text).filter((m) => !consistent(m.version, canon[resolve(m, canon)]));
  const cases = [
    ['exact match passes', bad('React Native 0.84.1 and Laravel 5.3.31').length === 0],
    ['prefix passes (PHP 7.4)', bad('PHP 7.4-compatible').length === 0],
    ['drift fails (RN 0.85.0)', bad('React Native 0.85.0').length === 1],
    ['drift fails (PHP 8.1)', bad('runs on PHP 8.1').length === 1],
    ['React 18 → portal passes', bad('React 18 + Vite').length === 0],
    ['React 19.2.3 → mobile passes', bad('React 19.2.3').length === 0],
    ['React 17 fails', bad('React 17 + Vite').length === 1],
    ['node ≥ 18 passes, ≥ 16 fails', bad('node ≥ 18').length === 0 && bad('node ≥ 16').length === 1],
    ['"PHP 7 syntax" is not a version', mentions('code uses PHP 7 syntax').length === 0],
    ['wrong prefix fails (5.31 vs 5.3.31)', !consistent('5.31', '5.3.31')],
  ];
  let failed = 0;
  for (const [name, ok] of cases) { if (!ok) failed++; console.log(`${ok ? '✓' : '✗'} ${name}`); }
  console.log(failed ? `${failed} failed` : `all ${cases.length} checks pass`);
  process.exit(failed ? 1 : 0);
}
