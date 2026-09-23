#!/usr/bin/env node
/**
 * Territool static gate — checks ONLY lines added/changed (new-code-only rule, S0.2).
 *
 * Usage (from territool-brain/):
 *   node brain/gates/scripts/static-checks.js --repo mobile|web [--base HEAD] [--no-lint] [--json]
 *   node brain/gates/scripts/static-checks.js --repo mobile|web --commit <sha>   # one past commit (retrospectives, QA of a commit)
 *
 * Working-tree mode: tracked changes vs --base (staged + unstaged) plus untracked code files (all lines count as added).
 * Commit mode: lines added by <sha> vs its parent; file contents read with `git show` (the working tree is never touched).
 * Read-only: runs git, eslint (mobile, changed files only) and `php -l` (web).
 * Exit code: 1 if any FAIL finding, else 0.
 *
 * Rule IDs map to brain/gates/code-gate.md (CG-*) and brain/context/conventions-*.md (M*, W*, S*).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const has = (k) => args.includes(k);

const BRAIN = path.resolve(__dirname, '..', '..', '..');
const repoName = opt('--repo');
if (!['mobile', 'web'].includes(repoName)) {
  console.error('usage: node brain/gates/scripts/static-checks.js --repo mobile|web [--base HEAD | --commit <sha>] [--no-lint] [--json]');
  process.exit(2);
}
// --repo-path is for the gate's own fixture tests (static-checks.selftest.js); normal use omits it.
const REPO = fs.realpathSync(opt('--repo-path', path.join(BRAIN, 'repos', repoName)));
const base = opt('--base', 'HEAD');
const commit = opt('--commit');
const git = (...a) => execFileSync('git', ['-C', REPO, ...a], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const label = commit ? `commit ${git('rev-parse', '--short', commit).trim()} vs parent` : `added lines vs ${base}`;
const readFile = (f) => (commit ? git('show', `${commit}:${f}`) : fs.readFileSync(path.join(REPO, f), 'utf8'));
const fileExists = (f) => (commit ? true : fs.existsSync(path.join(REPO, f)));

const CODE = /\.(js|jsx|ts|tsx|php|css|scss)$/;
const SKIP = /(^|\/)(node_modules|vendor|Pods|build|customPackage|jqwidgets)\/|\.min\.(js|css)$|^public\/js\/manager-portal[^/]*$|^public\/vendor\/|^bootstrap\/cache\/|^storage\/|^\.(codex|cursor|claude)\//;

// ---------- collect added lines ----------
const added = {};      // file -> Map(lineNo -> text)
const newFiles = new Set();
const diffArgs = commit ? [`${commit}~1`, commit] : [base];
const diff = git('diff', '--unified=0', '--no-color', '--no-ext-diff', ...diffArgs, '--');
let cur = null, ln = 0, pendingNew = false;
for (const l of diff.split('\n')) {
  if (l.startsWith('diff --git')) { pendingNew = false; cur = null; continue; }
  if (l.startsWith('new file mode')) { pendingNew = true; continue; }
  if (l.startsWith('+++ ')) {
    const p = l.slice(4).replace(/^b\//, '');
    cur = p === '/dev/null' ? null : p;
    if (cur && pendingNew) newFiles.add(cur);
    continue;
  }
  if (l.startsWith('@@')) { const m = l.match(/\+(\d+)/); ln = m ? parseInt(m[1], 10) : 0; continue; }
  if (!cur) continue;
  if (l.startsWith('+')) { (added[cur] = added[cur] || new Map()).set(ln, l.slice(1)); ln++; }
}
if (!commit) {
  for (const f of git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean)) {
    const abs = path.join(REPO, f);
    if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) continue;
    newFiles.add(f);
    const m = new Map();
    fs.readFileSync(abs, 'utf8').split('\n').forEach((t, i) => m.set(i + 1, t));
    added[f] = m;
  }
}
const files = Object.keys(added).filter((f) => CODE.test(f) && !SKIP.test(f));

// ---------- rules ----------
const isComment = (t) => /^\s*(\/\/|\*|\/\*|#)/.test(t);
const mob = {
  app: (f) => /^(App\/|index\.js$|init\.js$)/.test(f) && !/^App\/customPackage\//.test(f),
  comp: (f) => /^App\/components\//.test(f),
  tokens: (f) => /^App\/styles\/(theme|tokens)\.js$/.test(f),
};
const web = {
  php: (f) => f.endsWith('.php'),
  blade: (f) => f.endsWith('.blade.php'),
  app: (f) => /^app\//.test(f),
  api: (f) => /^app\/Api\//.test(f),
  config: (f) => /^config\//.test(f) || /^app\/[A-Za-z]+Mcp\/config\//.test(f),
  frozen: (f) => /^(app\/Http\/Controllers\/CompanylController\.php|app\/Globals\/Helper\.php|app\/Helpers\/helpers\.php|app\/Globals\/Routes\.php)$/.test(f),
};
const SECRET_RE = /AIza[0-9A-Za-z_-]{20,}|pk\.ey[0-9A-Za-z_.-]{20,}|phc_[0-9A-Za-z]{20,}|sk_(live|test)_[0-9A-Za-z]{8,}|xox[bap]-[0-9A-Za-z-]{10,}|@picwa\.co\.nz|(password|passwd|secret)\s*[:=]\s*['"][^'"\s]{4,}['"]/i;
// Phase 7: key-like literal on a line that names a key/secret/token, e.g. config('services.x.api_key', '<uuid>') fallbacks.
const KEYISH_NAME = /(api[_-]?key|apikey|secret|token|bearer|client[_-]?id|access[_-]?key)/i;
const KEYLIKE_LITERAL = /['"](?=(?:[A-Za-z_-]*\d){2})(?=[0-9_-]*[A-Za-z])[A-Za-z0-9_-]{24,}['"]/;
const SECRET = { test: (t) => SECRET_RE.test(t) || (KEYISH_NAME.test(t) && KEYLIKE_LITERAL.test(t)) };

const RULES = [
  // shared
  { id: 'S-prod', level: 'FAIL', repo: '*', when: () => true, test: (t) => /app\.territool\.com/i.test(t) && !isComment(t), msg: 'Production host referenced in new code (S0.1)' },
  { id: 'S-glossary', level: 'WARN', repo: '*', when: (f) => !/\.(css|scss)$/.test(f), test: (t) => /["'`>][^"'`<]*\b(Waypoints?|Business Client)\b/.test(t) && !isComment(t), msg: 'Retired UI term in copy: use Stop / Business Agent (S1.1)' },
  // mobile
  { id: 'M1', level: 'FAIL', repo: 'mobile', when: (f) => mob.app(f), newOnly: true, test: (t) => /extends\s+(React\.)?(Pure)?Component\b/.test(t), msg: 'Class component in a new file (M1)' },
  { id: 'M1-existing', level: 'WARN', repo: 'mobile', when: (f) => mob.app(f), existingOnly: true, test: (t) => /extends\s+(React\.)?(Pure)?Component\b/.test(t), msg: 'Class component added to an existing file (M1)' },
  { id: 'M2', level: 'FAIL', repo: 'mobile', when: (f) => mob.comp(f), test: (t) => /(^|[^.\w])fetch\s*\(/.test(t) && !isComment(t), msg: 'Raw fetch() in components; use API.js (M2)' },
  { id: 'M5', level: 'WARN', repo: 'mobile', when: (f) => mob.comp(f), test: (t) => /\blogout\s*\(/.test(t) && !isComment(t), msg: 'logout() added; allowed only for explicit sign-out (M5)' },
  { id: 'M6', level: 'FAIL', repo: 'mobile', when: (f) => mob.comp(f), test: (t) => /catch\s*(\([^)]*\))?\s*\{\s*\}/.test(t), msg: 'Empty catch in components (M6)' },
  { id: 'M8-color', level: 'FAIL', repo: 'mobile', when: (f) => mob.app(f) && !mob.tokens(f), test: (t) => /(['"`])#[0-9A-Fa-f]{3,8}\1|rgba?\s*\(/.test(t) && !isComment(t), msg: 'Hardcoded colour; use tokens (M8, S4.1)' },
  { id: 'M8-fontsize', level: 'FAIL', repo: 'mobile', when: (f) => mob.app(f) && !mob.tokens(f), test: (t) => /fontSize\s*:\s*\d/.test(t) && !isComment(t), msg: 'Literal fontSize; use type tokens (M8)' },
  { id: 'M9', level: 'WARN', repo: 'mobile', when: (f) => mob.comp(f), test: (t) => /style=\{\{/.test(t), msg: 'Inline style object; allowed only for render-time values (M9)' },
  { id: 'M14', level: 'FAIL', repo: 'mobile', when: (f) => f === 'App/utils/Global.js', test: (t) => /^\s*static\s+_?\w+\s*=/.test(t), msg: 'New field in Global.js (M14)' },
  { id: 'M16', level: 'FAIL', repo: 'mobile', when: (f) => mob.app(f), test: (t) => /JSON\.stringify\(\s*form[dD]ata/.test(t) || (/(captureSentryError|Sentry\.|posthog|capturePostHog)/.test(t) && /\b(password|token|jwt)\b/i.test(t)), msg: 'Telemetry may include body/password/token (M16)' },
  { id: 'M17', level: 'FAIL', repo: 'mobile', when: () => true, test: (t) => SECRET.test(t), msg: 'Secret / credential / staff email in source (M17, S0.4)' },
  // web
  { id: 'W1', level: 'FAIL', repo: 'web', when: (f) => /^app\/Api\/V1\//.test(f), test: () => true, msg: 'API V1 modified (dead; S0.6)' },
  { id: 'W2', level: 'FAIL', repo: 'web', when: (f) => web.api(f), test: (t) => /['"]status['"]\s*=>\s*(['"][01]['"]|(true|false)\b)/i.test(t), msg: 'status must be int 1/0 (W2)' },
  { id: 'W2-web', level: 'WARN', repo: 'web', when: (f) => web.app(f) && !web.api(f), test: (t) => /['"]status['"]\s*=>\s*(['"][01]['"]|(true|false)\b)/i.test(t), msg: 'status should be int 1/0 (W2)' },
  { id: 'W4', level: 'FAIL', repo: 'web', when: (f) => web.php(f), test: (t) => /(Raw|DB::raw|DB::select|DB::statement|DB::insert|DB::update|DB::delete)\s*\(\s*("[^"]*\$[A-Za-z_{]|['"][^'"]*['"]\s*\.\s*\$)/.test(t), msg: 'String-built SQL; use bindings (W4)' },
  { id: 'W6', level: 'FAIL', repo: 'web', when: (f) => web.api(f), test: (t) => /JWTAuth::(parseToken|refresh)\b/.test(t), msg: 'JWT parsing/refresh in controller; use \\Auth::user() (W6)' },
  { id: 'W7-frozen', level: 'FAIL', repo: 'web', when: (f) => web.frozen(f), test: (t) => /\bfunction\s+\w+\s*\(/.test(t), msg: 'New method added to a frozen file (W7)' },
  { id: 'W7-layer', level: 'FAIL', repo: 'web', when: (f) => web.api(f), test: (t) => /App\\Http\\Controllers\\(?!Controller\b)\w+/.test(t), msg: 'API layer references a web controller (W7)' },
  { id: 'W13', level: 'FAIL', repo: 'web', when: (f) => web.php(f), test: (t) => /Log::\w+\s*\(/.test(t) && /(\$request->all\(\)|Input::all\(\)|json_encode\(\s*\$(request|response|this->responseArr)|\bpassword\b|\btoken\b)/i.test(t), msg: 'Log contains body/response/secret (W13)' },
  { id: 'W14', level: 'FAIL', repo: 'web', when: (f) => web.php(f), test: (t) => /(^|[^\w>:$])(dd|dump|var_dump|print_r)\s*\(|(^|[^\w>:$])(exit|die)\s*[;(]/.test(t) && !isComment(t), msg: 'Debug output / exit (W14)' },
  { id: 'W15-env', level: 'FAIL', repo: 'web', when: (f) => web.php(f) && !web.config(f), test: (t) => /(^|[^\w>:$])env\s*\(/.test(t) && !isComment(t), msg: 'env() outside config (W15)' },
  { id: 'W15-secret', level: 'FAIL', repo: 'web', when: () => true, test: (t) => SECRET.test(t), msg: 'Secret / key literal in source (W15, S0.4)' },
  { id: 'W17', level: 'FAIL', repo: 'web', when: (f) => web.php(f) && !web.blade(f), test: (t) => /\?->|\bmatch\s*\(|\$request->validate\(|\bHttp::(get|post|put|patch|delete|withToken|withHeaders)\b|^\s*#\[|function\s+__construct\s*\([^)]*\b(public|private|protected)\s+[\w\\?]*\s*\$|:\s*mixed\b/.test(t) && (!isComment(t) || /^\s*#\[/.test(t)), msg: 'PHP 8 / Laravel >=5.4 syntax (W17)' },
  { id: 'W19', level: 'FAIL', repo: 'web', when: (f) => web.blade(f), test: (t) => /<script(?![^>]*\bsrc\s*=)[^>]*>|<style\b/i.test(t), msg: 'Inline <script>/<style> in Blade (W19)' },
];

const findings = [];
for (const f of files) {
  const lines = added[f];
  const isNew = newFiles.has(f);
  for (const r of RULES) {
    if (r.repo !== '*' && r.repo !== repoName) continue;
    if (!r.when(f)) continue;
    if (r.newOnly && !isNew) continue;
    if (r.existingOnly && isNew) continue;
    for (const [n, t] of lines) {
      if (r.test(t, f)) findings.push({ id: r.id, level: r.level, file: f, line: n, msg: r.msg, text: t.trim().slice(0, 140) });
    }
  }
}

// ---------- ESLint (mobile, errors on added lines only) ----------
if (repoName === 'mobile' && !has('--no-lint')) {
  const js = files.filter((f) => /\.(js|jsx|ts|tsx)$/.test(f) && mob.app(f) && fileExists(f));
  const bin = path.join(REPO, 'node_modules', '.bin', 'eslint');
  if (js.length && fs.existsSync(bin)) {
    const results = [];
    const parse = (out) => { try { results.push(...JSON.parse(out || '[]')); } catch (e) { findings.push({ id: 'M19', level: 'WARN', file: '-', line: 0, msg: 'ESLint output could not be parsed', text: String(e.message).slice(0, 120) }); } };
    if (commit) {
      for (const f of js) {
        const r = spawnSync(bin, ['-f', 'json', '--stdin', '--stdin-filename', f], { cwd: REPO, input: readFile(f), encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
        parse(r.stdout);
      }
    } else {
      parse(spawnSync(bin, ['-f', 'json', ...js], { cwd: REPO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }).stdout);
    }
    for (const fileRes of results) {
      const rel = path.isAbsolute(fileRes.filePath) ? path.relative(REPO, fileRes.filePath) : fileRes.filePath;
      const addedLines = added[rel] || new Map();
      for (const m of fileRes.messages) {
        if (!addedLines.has(m.line)) continue;
        if (m.severity === 2) findings.push({ id: 'M19', level: 'FAIL', file: rel, line: m.line, msg: `ESLint error ${m.ruleId || '(parse)'}: ${m.message}`.slice(0, 160), text: (addedLines.get(m.line) || '').trim().slice(0, 140) });
      }
    }
  }
}

// ---------- php -l (web, changed php files) ----------
if (repoName === 'web') {
  for (const f of files.filter((x) => x.endsWith('.php') && !x.endsWith('.blade.php') && fileExists(x))) {
    let target = path.join(REPO, f);
    let tmp = null;
    if (commit) {
      tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tt-phpl-'));
      target = path.join(tmp, path.basename(f));
      fs.writeFileSync(target, readFile(f));
    }
    const r = spawnSync('php', ['-l', target], { encoding: 'utf8' });
    if (r.status !== 0) findings.push({ id: 'W17-syntax', level: 'FAIL', file: f, line: 0, msg: 'php -l failed', text: (r.stdout || r.stderr || '').split('\n').find((x) => x.trim()) || ''.slice(0, 140) });
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ---------- output ----------
const fails = findings.filter((x) => x.level === 'FAIL');
const warns = findings.filter((x) => x.level === 'WARN');
const scannedNew = [...newFiles].filter((f) => files.includes(f));
if (has('--json')) {
  console.log(JSON.stringify({ repo: repoName, scope: label, filesScanned: files.length, newFiles: scannedNew, fails: fails.length, warns: warns.length, findings }, null, 2));
} else {
  console.log(`# Static checks — ${repoName} (${label})`);
  console.log(`Files scanned: ${files.length} (${scannedNew.length} new) · FAIL: ${fails.length} · WARN: ${warns.length}\n`);
  if (!findings.length) console.log('No findings.');
  else {
    console.log('| Level | Rule | File:line | Finding | Code |');
    console.log('|---|---|---|---|---|');
    for (const x of [...fails, ...warns]) console.log(`| ${x.level} | ${x.id} | ${x.file}:${x.line} | ${x.msg} | \`${x.text.replace(/\|/g, '\\|').replace(/`/g, "'")}\` |`);
  }
}
process.exit(fails.length ? 1 : 0);
