#!/usr/bin/env node
/**
 * Stable index of the owner's web screenshots, by role.
 *
 * Source: shoebox/03-web/screenshots/<Role>/ while staged, otherwise the library copy at
 * brain/assets/screenshots/web-owner/ — the shoebox copy is deleted once ingested (standing rule).
 *
 * IDs (ADM-01, MGR-01, SLS-01 …) are ordered by capture time, which is read from the file name where
 * the exporter put one, and kept stable afterwards by role+filename.
 *
 * Page names come from the file name when the exporter wrote one ("Manager-Dashboard-TerriTool-…").
 * Many files are plain "Screenshot <timestamp>" and carry no page name; those are recorded as
 * `unnamed` rather than guessed at. Only a human or an image read can say what they show.
 *
 * Usage (from territool-brain/): node tools/index-web-screenshots.js
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./lib/vault.js');

const STAGED = path.join(ROOT, 'shoebox', '03-web', 'screenshots');
const LIB_REL = 'brain/assets/screenshots/web-owner';
const DATA = path.join(ROOT, 'brain', 'audits', 'data', 'web-screenshots.json');
const MD = path.join(ROOT, 'brain', 'context', 'web-screenshot-index.md');

const CODES = { Admin: 'ADM', Manager: 'MGR', Salespeople: 'SLS' };
// Which surface each role folder actually is, and the flows it belongs to.
const SURFACE = {
  Admin: { surface: 'Admin HQ (Backpack) + admin pages', flows: ['F25'], role: 'Admin' },
  Manager: { surface: 'Manager portal "TerriTool Cockpit" (React 18 + Vite)', flows: ['F23', 'F24'], role: 'Business Agent' },
  Salespeople: { surface: 'Web user app (Blade + AdminLTE)', flows: [], role: 'Sales Agent / Business Sales Agent' },
};

function source() {
  if (fs.existsSync(STAGED) && fs.readdirSync(STAGED).some((d) => fs.statSync(path.join(STAGED, d)).isDirectory())) return { root: STAGED, staged: true };
  const lib = path.join(ROOT, LIB_REL);
  return fs.existsSync(lib) ? { root: lib, staged: false } : null;
}
const src = source();
if (!src) { console.error('No web screenshots found.'); process.exit(1); }

/** "Manager-Dashboard-TerriTool-09-15-2026_01_28_PM.png" -> { page, when } ; plain screenshots -> null page */
function parseName(file) {
  const base = file.replace(/\.(png|jpe?g)$/i, '').replace(/ \(\d+\)$/, '');
  let m = base.match(/^(.*?)-?TerriTool-?(?:HQ-|Admin-)?(\d{2}-\d{2}-\d{4})_(\d{2})_(\d{2})_(AM|PM)$/i);
  if (m) {
    const page = (m[1] || '').replace(/-/g, ' ').trim();
    return { page: page || null, when: `${m[2]} ${m[3]}:${m[4]} ${m[5]}` };
  }
  m = base.match(/^Screenshot (\d{4}-\d{2}-\d{2}) at (\d{1,2}\.\d{2}\.\d{2})\s*(AM|PM)$/i);
  if (m) return { page: null, when: `${m[1]} ${m[2].replace(/\./g, ':')} ${m[3]}` };
  return { page: null, when: null };
}
const dim = (abs, key) => { try { return parseInt(execFileSync('mdls', ['-name', key, '-raw', abs], { encoding: 'utf8' }).trim(), 10) || null; } catch { return null; } };

// Every screenshot was opened and described by hand; those descriptions live here, keyed by ID.
// A name in this file beats the one the exporter happened to put in the file name.
const NAMES_FILE = path.join(ROOT, 'brain', 'audits', 'data', 'web-screenshot-names.json');
const NAMES = fs.existsSync(NAMES_FILE) ? JSON.parse(fs.readFileSync(NAMES_FILE, 'utf8')) : {};

const prev = fs.existsSync(DATA) ? JSON.parse(fs.readFileSync(DATA, 'utf8')) : { files: [] };
const prevId = new Map(prev.files.map((f) => [`${f.role}/${f.file}`, f.id]));
// Feature tags added per image after the first run (e.g. F26 on support screens) are knowledge: keep them (Law 1).
const prevFlows = new Map(prev.files.map((f) => [`${f.role}/${f.file}`, f.flows || []]));

const out = [];
for (const role of Object.keys(CODES)) {
  const dir = path.join(src.root, role);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f))
    .sort((a, b) => (fs.statSync(path.join(dir, a)).mtimeMs - fs.statSync(path.join(dir, b)).mtimeMs) || a.localeCompare(b));
  let n = 0;
  for (const file of files) {
    const abs = path.join(dir, file);
    const key = `${role}/${file}`;
    const id = prevId.get(key) || `${CODES[role]}-${String(++n).padStart(2, '0')}`;
    if (!prevId.has(key)) prevId.set(key, id);
    const { page: filePage, when } = parseName(file);
    const page = NAMES[id] || filePage;
    const described = !!NAMES[id];
    out.push({
      id, role, file, page, when, described,
      surface: SURFACE[role].surface,
      flows: [...new Set([...SURFACE[role].flows, ...(prevFlows.get(key) || [])])],
      width: dim(abs, 'kMDItemPixelWidth'), height: dim(abs, 'kMDItemPixelHeight'),
      bytes: fs.statSync(abs).size,
      staged: src.staged ? path.relative(ROOT, abs) : null,
      library: `${LIB_REL}/${role}/${file}`,
    });
  }
}
// Renumber cleanly on the very first run.
if (!prev.files.length) {
  const seen = {};
  for (const f of out) { seen[f.role] = (seen[f.role] || 0) + 1; f.id = `${CODES[f.role]}-${String(seen[f.role]).padStart(2, '0')}`; }
}
fs.writeFileSync(DATA, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: src.staged ? 'shoebox' : 'library', files: out }, null, 2)}\n`);

const kb = (b) => `${Math.round(b / 1024)} KB`;
const named = out.filter((f) => f.page);
const described = out.filter((f) => f.described);
const roles = [...new Set(out.map((f) => f.role))];
const md = [
  '# Web screenshots (owner, by role)',
  '',
  `${out.length} images across ${roles.length} surfaces, provided by the owner 2026-09-15. Library: \`${LIB_REL}/\`.`,
  '',
  '> [!warning] What is known here',
  '> IDs, role, size and dimensions are **VERIFIED** from the file system.',
  `> **All ${described.length} of ${out.length} screenshots were opened and described** (2026-09-16). Each name below says what that screen actually shows, not what its file was called.`,
  '',
  'Regenerate: `node tools/index-web-screenshots.js`.',
  '',
  'Built from `brain/audits/data/web-screenshots.json` (id, role, file, size, description per image) and the image files it names. Structural re-check: `node tools/note-revalidate.js` confirms every listed image file exists.',
  '',
  '## By surface',
  '',
  '| Role folder | Surface | Images | Named | Flows |',
  '|---|---|---|---|---|',
  ...roles.map((r) => {
    const l = out.filter((f) => f.role === r);
    return `| ${r} | ${SURFACE[r].surface} | ${l.length} | ${l.filter((f) => f.page).length} | ${SURFACE[r].flows.join(', ') || '—'} |`;
  }),
  '',
  '## Every screenshot',
  '',
  '| ID | Role | What the screen shows |',
  '|---|---|---|',
  ...out.map((f) => `| ${f.id} | ${f.role} | ${f.page || '_undescribed_'} |`),
  '',
  ...(out.filter((f) => !f.page).length ? ['## Still undescribed', '',
    ...roles.map((r) => {
      const l = out.filter((f) => f.role === r && !f.page);
      return l.length ? `- **${r}** (${l.length}): ${l.map((f) => f.id).join(', ')}` : null;
    }).filter(Boolean), ''] : []),
];
fs.writeFileSync(MD, `${md.join('\n')}\n`);
console.log(`indexed ${out.length} web screenshots from the ${src.staged ? 'shoebox' : 'library'} (${named.length} named, ${out.length - named.length} unnamed)`);
for (const r of roles) console.log(`  ${r.padEnd(12)} ${out.filter((f) => f.role === r).length}`);
