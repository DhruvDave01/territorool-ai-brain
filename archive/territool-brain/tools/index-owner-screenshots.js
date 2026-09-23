#!/usr/bin/env node
/**
 * Stable index of owner-provided mobile captures (shoebox/02-mobile/{screenshots,frames,videos}).
 *
 * Gives every file a short, stable ID (e.g. RT-17 = RouteFlow step 17) that flow docs, audits and test cases cite.
 * IDs persist in brain/audits/data/owner-mobile-captures.json: re-running keeps existing IDs and appends new files.
 * Identical images in several flow folders (the same screen reused by several flows) are all kept and marked
 * "duplicate of" the first ID with the same sha1. Nothing is ever deleted.
 *
 * Usage (from territool-brain/): node tools/index-owner-screenshots.js
 * Writes: brain/audits/data/owner-mobile-captures.json, brain/context/mobile-screenshot-index.md
 * Library copies (after `node tools/sync-design-assets.js`): brain/assets/screenshots/mobile-owner/<folder>/<file>
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const SHOEBOX = path.join(ROOT, 'shoebox', '02-mobile');
const DATA = path.join(ROOT, 'brain', 'audits', 'data', 'owner-mobile-captures.json');
const MD = path.join(ROOT, 'brain', 'context', 'mobile-screenshot-index.md');
const NAMES_FILE = path.join(ROOT, 'brain', 'audits', 'data', 'owner-mobile-capture-names.json');
const NAMES = fs.existsSync(NAMES_FILE) ? JSON.parse(fs.readFileSync(NAMES_FILE, 'utf8')) : {};
const nameOf = (f) => NAMES[f.id] || (f.dupOf && NAMES[f.dupOf] ? `${NAMES[f.dupOf]} (same screen as ${f.dupOf})` : '');
const KINDS = [
  { kind: 'screenshot', dir: 'screenshots', re: /\.(png|jpe?g)$/i, lib: 'brain/assets/screenshots/mobile-owner' },
  { kind: 'frame', dir: 'frames', re: /\.(png|jpe?g)$/i, lib: 'brain/assets/screenshots/mobile-owner-frames' },
  { kind: 'video', dir: 'videos', re: /\.(mp4|mov|m4v)$/i, lib: 'brain/assets/videos/mobile-owner' },
];
// Folder codes used in brain/context/mobile-flows-captured.md
const CODES = { LoginRegistrationFlow: 'LR', Dashboard: 'DB', Setting: 'ST', ActivityCalendar: 'CAL', AIFindLeadsFlow: 'AI', ScanCardFlow: 'SC', AddCompany: 'AC', RouteFlow: 'RT', List: 'LS', AddressBookFlow: 'AB' };

const prev = fs.existsSync(DATA) ? JSON.parse(fs.readFileSync(DATA, 'utf8')) : { files: [] };
const byKey = new Map(prev.files.map((f) => [`${f.kind}:${f.path}`, f]));

const codeFor = (kind, folder) => {
  const base = CODES[folder] || folder.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'MISC';
  return kind === 'screenshot' ? base : `${base}${kind === 'video' ? 'V' : 'F'}`;
};

// Source of truth: the shoebox while material is still staged there, otherwise the design library.
// Once a capture is ingested, the shoebox copy is deleted (tools/shoebox-dedupe.js), so re-running
// this must keep working from brain/assets/ alone.
const sourceFor = (k) => {
  const staged = path.join(SHOEBOX, k.dir);
  if (fs.existsSync(staged) && fs.readdirSync(staged).length) return { root: staged, staged: true };
  const lib = path.join(ROOT, k.lib);
  return fs.existsSync(lib) ? { root: lib, staged: false } : null;
};

const out = [];
for (const k of KINDS) {
  const src = sourceFor(k);
  if (!src) continue;
  const root = src.root;
  const all = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (k.re.test(e.name)) all.push(path.relative(root, p));
    }
  };
  walk(root);
  const folderOf = (rel) => (rel.includes(path.sep) ? rel.split(path.sep)[0] : 'misc');
  const folders = [...new Set(all.map(folderOf))];
  // Order folders by their first capture time (file names carry timestamps), not alphabetically.
  const earliest = (f) => all.filter((r) => folderOf(r) === f).map((r) => path.basename(r)).sort()[0] || '';
  folders.sort((a, b) => earliest(a).localeCompare(earliest(b)));
  for (const folder of folders) {
    const files = all.filter((r) => folderOf(r) === folder).sort();
    const code = codeFor(k.kind, folder);
    const used = new Set(prev.files.filter((f) => f.kind === k.kind && f.folder === folder).map((f) => f.n));
    let next = used.size ? Math.max(...used) + 1 : 1;
    for (const rel of files) {
      const abs = path.join(root, rel);
      const sha1 = crypto.createHash('sha1').update(fs.readFileSync(abs)).digest('hex');
      const key = `${k.kind}:${rel}`;
      const existing = byKey.get(key);
      const n = existing ? existing.n : next++;
      const time = (path.basename(rel).match(/at (\d{2})\.(\d{2})\.(\d{2})/) || []).slice(1).join(':');
      const date = (path.basename(rel).match(/(\d{4}-\d{2}-\d{2})/) || [])[1] || '';
      out.push({
        id: `${code}-${String(n).padStart(2, '0')}`, n, kind: k.kind, folder, path: rel, date, time, sha1,
        bytes: fs.statSync(abs).size, shoebox: src.staged ? path.relative(ROOT, abs) : null, library: `${k.lib}/${rel.split(path.sep).join('/')}`,
      });
    }
  }
}
// duplicates: first occurrence (in ID order) wins
const firstBySha = new Map();
for (const f of out) {
  if (!firstBySha.has(f.sha1)) { firstBySha.set(f.sha1, f.id); f.dupOf = null; } else f.dupOf = firstBySha.get(f.sha1);
}
const removed = prev.files.filter((p) => !out.some((o) => o.kind === p.kind && o.path === p.path));
fs.mkdirSync(path.dirname(DATA), { recursive: true });
fs.writeFileSync(DATA, JSON.stringify({ generatedAt: new Date().toISOString(), files: out, missingSinceLastRun: removed.map((r) => ({ id: r.id, path: r.path })) }, null, 2));

const groups = {};
out.forEach((f) => { (groups[`${f.kind}|${f.folder}`] = groups[`${f.kind}|${f.folder}`] || []).push(f); });
const md = [
  '# Mobile capture index (owner-provided, generated: do not edit)', '',
  `Generated ${new Date().toISOString()} by \`node tools/index-owner-screenshots.js\`.`,
  'IDs are stable: new files get the next number, existing IDs never change. Flow write-ups: `brain/context/mobile-flows-captured.md`.', '',
  `**Totals:** ${out.length} files · ${out.filter((f) => !f.dupOf).length} unique · ${out.filter((f) => f.dupOf).length} exact duplicates (the same screen reused by more than one flow, kept on purpose).`,
  ...(removed.length ? ['', `**Missing since last run:** ${removed.map((r) => `${r.id} (${r.path})`).join(', ')}`] : []), '',
  '| Folder | Kind | Code | Files | Unique |', '|---|---|---|---|---|',
  ...Object.entries(groups).map(([k, arr]) => { const [kind, folder] = k.split('|'); return `| ${folder} | ${kind} | ${arr[0].id.split('-')[0]} | ${arr.length} | ${arr.filter((f) => !f.dupOf).length} |`; }), '',
];
for (const [k, arr] of Object.entries(groups)) {
  const [kind, folder] = k.split('|');
  md.push(`## ${folder} (${kind})`, '', '| ID | What it shows | Captured | Duplicate of | Library file |', '|---|---|---|---|---|',
    ...arr.map((f) => `| ${f.id} | ${nameOf(f)} | ${f.date} ${f.time} | ${f.dupOf || ''} | \`${f.library}\` |`), '');
}
fs.writeFileSync(MD, md.join('\n'));
console.log(`indexed ${out.length} (${out.filter((f) => !f.dupOf).length} unique, ${out.filter((f) => f.dupOf).length} duplicates); missing since last run: ${removed.length}`);
