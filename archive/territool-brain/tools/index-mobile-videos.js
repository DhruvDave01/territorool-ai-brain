#!/usr/bin/env node
/**
 * Stable index of the owner's module-organised mobile screen recordings.
 *
 * Source: shoebox/02-mobile/Video/<NN Module>/<Name>.mov while staged there, otherwise the library
 * copy at brain/assets/videos/mobile-owner/ — because the shoebox copy is deleted once ingested
 * (tools/shoebox-dedupe.js, the standing no-duplication rule).
 *
 * IDs (MV-01 …) are assigned in module order and then kept stable by module+filename, so re-running
 * after a rename or a move does not renumber everything that cites them.
 *
 * Duration and resolution come from `mdls` (Spotlight metadata) — no ffmpeg needed. This script does
 * NOT look inside the videos: frame extraction needs ffmpeg, which is not installed. Anything about
 * what a recording *shows* is therefore marked as coming from its filename, not from the footage.
 *
 * Usage (from territool-brain/): node tools/index-mobile-videos.js
 * Output: brain/audits/data/mobile-videos.json + brain/context/mobile-videos.md
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./lib/vault.js');

const STAGED = path.join(ROOT, 'shoebox', '02-mobile', 'Video');
const LIB_REL = 'brain/assets/videos/mobile-owner';
const DATA = path.join(ROOT, 'brain', 'audits', 'data', 'mobile-videos.json');
const MD = path.join(ROOT, 'brain', 'context', 'mobile-videos.md');

// Which flows each recording covers. Flow names are from brain/context/parity-map.md.
// This mapping is read from the module and the file name — the footage itself has not been watched.
const FLOWS = {
  'Dashboard Activity and Calendar': ['F05', 'F14'],
  'Company Activity and Visit': ['F12', 'F14', 'F10'],
  'Company Details and Edit': ['F12'],
  'Contact Notes and Test Data Deletion': ['F13', 'F12'],
  'Create Company and Validation': ['F12'],
  'Address Book Contacts and Purchase Verification': ['F13', 'F15'],
  'Contact Create Edit and Notes': ['F13'],
  'List Create Search and Edit': ['F11'],
  'List Find Contacts Purchase': ['F11', 'F15'],
  'List Search Filters Sharing and Map': ['F11', 'F17'],
  'Route Creation': ['F08'],
  'Route Find Contacts Purchase': ['F08', 'F15'],
  'Route Search Filters Sharing and Map': ['F09', 'F17'],
  'Route Visits and Editing': ['F09', 'F10'],
  'AI Find Leads Map and List Import': ['F06', 'F11'],
  'AI Find Leads Search to Route': ['F06', 'F08'],
  'Find Leads Search and Import': ['F07', 'F06'],
  'Business Card Gallery OCR and Save': ['F18'],
  'QR and Camera Scanner Availability': ['F19', 'F18'],
  'Current Package Modal Open and Close': ['F03', 'F20'],
  'Settings Tags and App Update': ['F20', 'F32'],
  'Login Logout and Password Validation': ['F01'],
  'Registration Until Payment Setup': ['F02', 'F03'],
  'Referral Forms and App Lifecycle': ['F28', 'F32'],
};

const FLOW_NAMES = {
  F01: 'Login & session', F02: 'Register & onboarding', F03: 'Subscription & paywall',
  F05: 'Dashboard & activity feed', F06: 'AI Find Leads', F07: 'Places / Yelp leads',
  F08: 'Create route', F09: 'Route detail & navigation', F10: 'Mark visited', F11: 'Lists',
  F12: 'Companies', F13: 'Contacts', F14: 'Activities', F15: 'Find & buy contacts',
  F17: 'Share route/list', F18: 'Scan business card', F19: 'QR route import',
  F20: 'Settings / status tags / stages', F28: 'Referral invites', F32: 'App launch, permissions, crash',
};

function source() {
  if (fs.existsSync(STAGED) && fs.readdirSync(STAGED).length) return { root: STAGED, staged: true };
  const lib = path.join(ROOT, LIB_REL);
  return fs.existsSync(lib) ? { root: lib, staged: false } : null;
}
const src = source();
if (!src) { console.error('No mobile videos found in shoebox/02-mobile/Video or brain/assets/videos/mobile-owner.'); process.exit(1); }

function walk(dir, base, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else if (/\.(mov|mp4|m4v)$/i.test(e.name)) out.push(path.relative(base, p));
  }
  return out;
}
const meta = (abs, key) => { try { return execFileSync('mdls', ['-name', key, '-raw', abs], { encoding: 'utf8' }).trim(); } catch { return ''; } };

// The capture session shipped its own manifest (written by the tool that recorded these). It is the
// only description of what each recording actually SHOWS, since the footage cannot be watched here.
const MANIFEST = path.join(ROOT, 'brain', 'audits', 'data', 'video-capture', 'video-manifest.json');
const manifest = new Map();
if (fs.existsSync(MANIFEST)) {
  for (const m of JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))) manifest.set(`${m.folder}/${path.basename(m.file).replace(/\.(mov|mp4|m4v)$/i, '')}`, m);
}

const prev = fs.existsSync(DATA) ? JSON.parse(fs.readFileSync(DATA, 'utf8')) : { files: [] };
const prevById = new Map(prev.files.map((f) => [`${f.module}/${f.name}`, f.id]));

const rels = walk(src.root, src.root).sort();
const files = [];
let n = 0;
for (const rel of rels) {
  const abs = path.join(src.root, rel);
  const parts = rel.split(path.sep);
  const module = parts.length > 1 ? parts[0] : 'misc';
  const name = path.basename(rel).replace(/\.(mov|mp4|m4v)$/i, '');
  const key = `${module}/${name}`;
  const id = prevById.get(key) || `MV-${String(++n).padStart(2, '0')}`;
  if (!prevById.has(key)) prevById.set(key, id);
  const dur = parseFloat(meta(abs, 'kMDItemDurationSeconds')) || 0;
  const m = manifest.get(key) || {};
  files.push({
    id, module, name,
    flows: FLOWS[name] || [],
    steps: m.executed_steps || '',
    sha256: m.sha256 || null,
    startsOnDashboard: m.starts_on_dashboard === true,
    seconds: Math.round(dur),
    width: parseInt(meta(abs, 'kMDItemPixelWidth'), 10) || null,
    height: parseInt(meta(abs, 'kMDItemPixelHeight'), 10) || null,
    bytes: fs.statSync(abs).size,
    staged: src.staged ? path.relative(ROOT, abs) : null,
    library: `${LIB_REL}/${rel.split(path.sep).join('/')}`,
  });
}
// Renumber only if this is the first run (no previous ids at all).
if (!prev.files.length) files.forEach((f, i) => { f.id = `MV-${String(i + 1).padStart(2, '0')}`; });

fs.writeFileSync(DATA, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: src.staged ? 'shoebox' : 'library', files }, null, 2)}\n`);

// ---------------------------------------------------------------- the note
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const mb = (b) => `${(b / 1e6).toFixed(0)} MB`;
const totalS = files.reduce((a, f) => a + f.seconds, 0);
const totalB = files.reduce((a, f) => a + f.bytes, 0);
const modules = [...new Set(files.map((f) => f.module))];
const covered = [...new Set(files.flatMap((f) => f.flows))].sort();

const out = [
  '# Mobile screen recordings (owner, by module)',
  '',
  `${files.length} recordings · ${mmss(totalS)} total · ${mb(totalB)} · ${files[0].width}×${files[0].height} (iPhone 17 Pro Max simulator, matching the 249 screenshots).`,
  `Captured 2026-09-16 on **staging**, app **42.32 (1) · iOS · Development (S)** (header strip visible in the evidence stills; simulator log shows bundle \`com.picwa.appterritool\`).`,
  '',
  '> [!warning] What this index does and does not know',
  '> IDs, modules, durations, sizes and SHA-256 are **VERIFIED** (file system + `mdls` + the capture manifest).',
  "> The **What was executed** column is `DOCUMENTED` — it is quoted from `brain/audits/data/video-capture/video-manifest.json`, written by the session that recorded these. The footage itself has not been watched: `ffmpeg` is not installed, so frames cannot be extracted here.",
  '> The **flow mapping** is `INFERRED` from the module and file name.',
  '',
  `Regenerate: \`node tools/index-mobile-videos.js\`. Library: \`${LIB_REL}/\`.`,
  '',
  '## Recordings',
  '',
  '| ID | Module | Recording | Length | Flows | What was executed (from the capture manifest) |',
  '|---|---|---|---|---|---|',
  ...files.map((f) => `| ${f.id} | ${f.module} | ${f.name} | ${mmss(f.seconds)} | ${f.flows.join(' · ') || '—'} | ${f.steps || '_not described_'} |`),
  '',
  '## Capture session',
  '',
  '| | |',
  '|---|---|',
  '| Device | iPhone 17 Pro Max, iOS 26.5 · simulator `C73F304D-CF29-425B-8771-61279049E475` |',
  '| Build | `com.picwa.appterritool` 42.32 (1), Debug, **development/staging** |',
  '| Account | the staging Sales Agent (`.local` role) · final credits **8320**, existing test credits only |',
  '| Money | **no real-money purchases**; the Pro package was opened and dismissed, never cancelled |',
  '| Produced by | Codex (`~/.codex/visualizations/…`), 2026-09-16 · every video starts on Dashboard; idle pauses trimmed, API waits left in |',
  '| Verified by the capture | first / midpoint / end frames decoded for all 24; SHA-256 re-checked after copying |',
  '',
  'Raw session records: `brain/audits/data/video-capture/{video-index.txt,video-manifest.json,playback-verification.json,final-simulator-log.txt}`.',
  '',
  '## What these recordings do NOT cover',
  '',
  'Quoted from the capture session, because a coverage gap that is not written down gets mistaken for a pass:',
  '',
  '- Real-money purchases, RevenueCat checkout and the final registration payment were **intentionally skipped** — matching S6.4 (stop before the pay step).',
  '- Current-package cancellation was opened and dismissed only; nothing was submitted.',
  '- **Live QR decoding and camera capture cannot run on the Simulator** — physical-device testing is still owed (F18, F19).',
  '- Share and referral forms were exercised, but **no email/SMS was actually sent** and no password reset was sent: no destination address was agreed.',
  '- AI map area-selection (lasso) controls were exercised, but **no valid lasso result was established**. Ordinary checkbox selection, import, map display and route/list destinations were verified.',
  '- External navigation, calling, email delivery and third-party CRM connections need their own setup and are **not claimed as end-to-end passes**.',
  '- No claim that every data combination or branch was covered; the executed path per recording is the table above.',
  '',
  '## Defects these recordings captured',
  '',
  '| Gap | What was seen | Recording |',
  '|---|---|---|',
  '| **KG-UI8** | Delete-contact sheet stays over Address Book after a successful delete. **Root cause verified in code** (`contacts/view.js:1207`) | MV-04 |',
  '| **KG-COPY2** | Editing a one-company *list* is rejected with a *route*-specific minimum-two-waypoints message | MV-08 |',
  '| **KG-RT2** | Editing a route reversed the default start/end points before saving | MV-14 |',
  '| **KG-SEL2** | AI search selected two leads; Create Route received one. Cause unconfirmed | MV-16 |',
  '| KG-UI1 | "Invalid Date PT" on Dashboard — **re-confirmed** in 42.32 | MV-01 |',
  '| KG-GLOSS1 | Retired term "Waypoint" in the Create Route error and the company search placeholder | MV-16 |',
  '',
  'Full entries: `brain/context/known-fragile.md` §5.',
  '',
  '## Flow coverage',
  '',
  `These ${covered.length} flows now have moving evidence, where before there were only still screenshots:`,
  '',
  '| Flow | Recordings |',
  '|---|---|',
  ...covered.map((fl) => `| **${fl}** ${FLOW_NAMES[fl] || ''} | ${files.filter((f) => f.flows.includes(fl)).map((f) => f.id).join(', ')} |`),
  '',
  '## Modules',
  '',
  ...modules.map((m) => {
    const list = files.filter((f) => f.module === m);
    return `- **${m}** — ${list.length} recording${list.length === 1 ? '' : 's'}, ${mmss(list.reduce((a, f) => a + f.seconds, 0))} (${list.map((f) => f.id).join(', ')})`;
  }),
  '',
];
fs.writeFileSync(MD, `${out.join('\n')}\n`);
console.log(`indexed ${files.length} recordings (${mmss(totalS)}, ${mb(totalB)}) from the ${src.staged ? 'shoebox' : 'library'}`);
console.log(`  ${path.relative(ROOT, DATA)}`);
console.log(`  ${path.relative(ROOT, MD)}`);
console.log(`  flows covered: ${covered.join(', ')}`);
