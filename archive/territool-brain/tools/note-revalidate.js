#!/usr/bin/env node
/**
 * Re-validates the structural claims of derived-truth notes against the current code and brain data.
 *
 *   node tools/note-revalidate.js            # report per note: claims checked, unresolved
 *   node tools/note-revalidate.js --json
 *
 * What "structural" means: every endpoint, screen, table, file, id and image a note names must exist today.
 * Runtime and visual claims (what a screen showed on 2026-09-16) are NOT re-observed here; they keep their
 * original date and tier. A note passes only when every structural claim resolves.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./lib/vault.js');

const read = (p) => { try { return fs.readFileSync(path.isAbsolute(p) ? p : path.join(ROOT, p), 'utf8'); } catch { return ''; } };
const body = (p) => read(p).split('%% brain-links:start')[0];
const J = (p) => JSON.parse(read(p) || '{}');

// ---------------------------------------------------------------- reference sets
const api = new Set((J('brain/audits/data/api-map.json').routes || []).map((r) => r.uri.toLowerCase()));
const dm = J('brain/audits/data/data-model.json');
const tables = new Set([...(dm.models || []).map((m) => m.table), ...Object.keys(dm.queryBuilderTables || {}),
  ...(dm.migrations || []).flatMap((m) => m.creates || [])].filter(Boolean).map((x) => String(x).toLowerCase()));
const realm = new Set(JSON.stringify(dm.realm || {}).match(/[A-Z][A-Za-z]+/g) || []);
const appJs = read('repos/mobile/App/App.js');
const screens = new Set([...appJs.matchAll(/Stack\.Screen\s+name="([^"]+)"/g)].map((m) => m[1]));
const webRoutes = read('repos/web/routes/web.php') + read('repos/web/app/McpClient/routes/web.php');
const ids = (p, re) => new Set([...body(p).matchAll(re)].map((m) => m[1]));
const EV = ids('brain/context/evidence-ledger.md', /^\| \**(EV-[A-Z]\d{2})/gm);
const KG = ids('brain/context/known-fragile.md', /^\| \**(KG-[A-Z]+\d*)/gm);
const CR = ids('brain/context/contradiction-register.md', /^\| (CR-\d+)/gm);
const UI = ids('brain/context/UPCOMING_IMPROVEMENTS.md', /^\| \**(UI-[A-Z]+-\d+)/gm);
const UN = ids('brain/context/UNKNOWN_REGISTER.md', /^\| \**(U-[A-Z]+-\d+)/gm);
const caps = new Set([
  ...(J('brain/audits/data/owner-mobile-captures.json').files || []).map((c) => c.id),
  ...(J('brain/audits/data/web-screenshots.json').files || []).map((c) => c.id),
]);
const tcs = new Set();
for (const dir of ['workspace/test-suites/api-contract/cases', 'workspace/test-suites/web/cases']) {
  for (const f of fs.readdirSync(path.join(ROOT, dir))) for (const m of read(`${dir}/${f}`).matchAll(/TC-(F\d{2})-(?:\$\{[^}]+\}|0\d\d)/g)) tcs.add(m[0]);
}
// TC ids built in loops (`TC-F23-00${i + 1}`) are expanded from the run files.
for (const p of ['workspace/test-suites/api-contract/last-run.json', 'workspace/test-suites/web/last-run.json']) for (const r of (J(p).results || [])) tcs.add(r.id);
let repoFiles = null;
function repoIndex() {
  if (repoFiles) return repoFiles;
  repoFiles = [];
  for (const repo of ['repos/mobile', 'repos/web']) {
    const out = execFileSync('git', ['-C', path.join(ROOT, repo), 'ls-files'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    for (const f of out.split('\n').filter(Boolean)) repoFiles.push(`${repo}/${f}`);
  }
  return repoFiles;
}
const brainNotes = new Set(execFileSync('git', ['-C', ROOT, 'ls-files', '-co', '--exclude-standard', 'brain', 'workspace'], { encoding: 'utf8' }).split('\n').filter(Boolean));
/** Resolve `a/b.js:12` against the repos (by path suffix) and check the line exists. */
function fileRef(ref) {
  const [f, line] = ref.split(':');
  // Brain shorthand: `V2/X.php` means app/Api/V2/Controllers/X.php (used across brain/context).
  const want = f.replace(/^V2\//, 'app/Api/V2/Controllers/');
  const hits = repoIndex().filter((p) => p.endsWith(`/${want}`) || p === want);
  if (!hits.length) return `file not found: ${f}`;
  if (line) {
    const n = Number(line.split(/[-–,\s]/)[0]);
    const ok = hits.some((h) => read(h).split('\n').length >= n);
    if (!ok) return `line ${n} beyond end of ${f}`;
  }
  return null;
}
const noteRef = (n) => [...brainNotes].some((p) => p.endsWith(`/${n}`)) || fs.existsSync(path.join(ROOT, n));

// ---------------------------------------------------------------- per-note checks
function check(note) {
  const t = body(note);
  const claims = []; const bad = [];
  const claim = (kind, v, err) => { claims.push(`${kind}:${v}`); if (err) bad.push(`${kind} ${v} — ${err}`); };
  for (const m of t.matchAll(/`(?:GET|POST)\s+([A-Za-z][\w/{}-]*)`/g)) claim('endpoint', m[1], api.has(m[1].toLowerCase()) ? null : 'not in api-map (routes/api.php)');
  const PLANNED = /(planned|not created yet|not yet created|to be (built|created|written))/i;
  for (const line of t.split('\n')) {
    for (const m of line.matchAll(/`([A-Za-z0-9_./-]+\.(?:js|jsx|ts|tsx|php))(?::([\d,\s–-]+))?`/g)) {
      const ref = m[2] ? `${m[1]}:${m[2].trim()}` : m[1];
      if (/^(brain|tools|workspace)\//.test(m[1])) { claim('file', ref, fs.existsSync(path.join(ROOT, m[1])) ? null : 'missing'); continue; }
      const err = fileRef(ref);
      claim(err && PLANNED.test(line) ? 'planned-file' : 'file', ref, err && !PLANNED.test(line) ? err : null);
    }
  }
  for (const m of t.matchAll(/`([a-z][a-z0-9_]+)`/g)) {
    if (!/_/.test(m[1])) continue; // table names in this codebase are snake_case with an underscore
    if (tables.has(m[1])) claim('table', m[1], null);
  }
  for (const m of t.matchAll(/\b(EV-[A-Z]\d{2})\b/g)) claim('evidence', m[1], EV.has(m[1]) ? null : 'no ledger row');
  for (const m of t.matchAll(/\b(KG-[A-Z]+\d*)\b/g)) claim('known-gap', m[1], KG.has(m[1]) ? null : 'no known-fragile row');
  for (const m of t.matchAll(/\b(CR-\d{2})\b/g)) claim('contradiction', m[1], CR.has(m[1]) ? null : 'no register row');
  for (const m of t.matchAll(/\b(UI-[A-Z]+-\d{2})\b/g)) claim('improvement', m[1], UI.has(m[1]) ? null : 'no improvements row');
  for (const m of t.matchAll(/\b(U-[A-Z]+-\d{2})\b/g)) claim('unknown', m[1], UN.has(m[1]) ? null : 'no unknown-register row');
  for (const m of t.matchAll(/\b(TC-F\d{2}-\d{3})\b/g)) claim('test-case', m[1], tcs.has(m[1]) ? null : 'no such case');
  for (const m of t.matchAll(/\b((?:LR|DB|AI|RT|LS|AB|AC|SC|ST|CAL|SLS|MGR|ADM)-\d{2})\b/g)) claim('capture', m[1], caps.has(m[1]) ? null : 'no such screenshot id');
  for (const m of t.matchAll(/`([a-zA-Z-]+\.md)`/g)) claim('note', m[1], noteRef(m[1]) ? null : 'no such note');
  if (note.endsWith('system-map.md')) {
    for (const row of t.split('\n').filter((l) => /^\| M\d+ /.test(l))) {
      const cell = row.split('|')[3] || '';
      for (const m of cell.matchAll(/`([A-Za-z]+)`/g)) claim('screen', m[1], screens.has(m[1]) ? null : 'not a Stack.Screen in App/App.js');
    }
    for (const row of t.split('\n').filter((l) => /^\| W\d+ /.test(l))) {
      const cell = row.split('|')[3] || '';
      for (const m of cell.matchAll(/`(\/[a-z][\w/{}-]*)`/g)) {
        const seg = m[1].split('/').filter(Boolean)[0];
        claim('web-route', m[1], new RegExp(`['"/]${seg}\\b`).test(webRoutes) ? null : 'no matching route in routes/web.php');
      }
    }
  }
  if (note.endsWith('web-screenshot-index.md')) {
    const data = J('brain/audits/data/web-screenshots.json');
    const lib = 'brain/assets/screenshots/web-owner';
    for (const f of data.files || []) claim('image', f.id, fs.existsSync(path.join(ROOT, lib, f.role, f.file)) ? null : `missing ${lib}/${f.role}/${f.file}`);
    claim('image-count', String((data.files || []).length), /101 images/.test(t) && (data.files || []).length === 101 ? null : 'note count differs from data');
  }
  return { note, claims: claims.length, unique: new Set(claims).size, unresolved: [...new Set(bad)] };
}

const NOTES = ['brain/context/system-map.md', 'brain/context/design-states.md', 'brain/context/brain-qa.md', 'brain/context/web-screenshot-index.md'];
const fi = process.argv.indexOf('--file');
const res = (fi !== -1 ? [process.argv[fi + 1]] : NOTES).map(check);
if (process.argv.includes('--json')) console.log(JSON.stringify({ at: new Date().toISOString(), results: res }, null, 2));
else {
  for (const r of res) {
    console.log(`${r.unresolved.length ? '✗' : '✓'} ${r.note} — ${r.unique} distinct structural claims, ${r.unresolved.length} unresolved`);
    for (const u of r.unresolved.slice(0, 40)) console.log(`     ${u}`);
  }
}
process.exit(res.some((r) => r.unresolved.length) ? 1 : 0);
