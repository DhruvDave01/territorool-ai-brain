#!/usr/bin/env node
/**
 * Territool brain graph generator (Obsidian-style map + step-by-step app journeys).
 *
 * Nodes:
 *  - brain notes (context, audits, skills, gates, tools, workspace, shoebox docs, design library README)
 *  - the IDs those notes define or reference: rules M/D/W/DW/S, flows F, owner decisions BT/D-DS/D-T/Q,
 *    gate checks CG/DG/TG/QG, known gaps KG + capture observations O
 *  - app journeys MF-01..10 and shared parts S1..S12 (brain/context/mobile-flows-captured.md)
 *  - owner screenshots LR-01, RT-17 … (brain/audits/data/owner-mobile-captures.json)
 *  - mobile screens and code modules from brain/audits/data/{mobile,web}-graph.json
 * Links: a note mentions an ID, note or code file; a table row keyed by an ID or file references others; a module
 * is imported by a screen; a flow lists a screen; a web class serves a flow's endpoints; a screenshot shows a stack
 * screen or duplicates another screenshot; a journey starts at its first screenshot and each screenshot links to the
 * next one in step order (step links, marked 1 in the output).
 *
 * Plain-language names (what every node is called on the page; codes stay as `ref`):
 *  - brain/audits/data/friendly-names.json (groups, journeys + step names, shared parts, screens, documents, IDs)
 *  - brain/audits/data/owner-mobile-capture-names.json (one name per screenshot)
 *
 * Usage (from territool-brain/): node tools/brain-graph.js   (thumbnails: node tools/make-capture-thumbs.js)
 * Output: workspace/brain-graph/graph-data.js (window.BRAIN_GRAPH) and fonts.js (DIN 2014 from brain/assets/fonts/web).
 * Reads brain files only, nothing in .local/.
 */
const fs = require('fs');
const path = require('path');

const { vaultNotes } = require('./lib/vault.js');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'workspace', 'brain-graph', 'graph-data.js');
const INDEX_OUT = path.join(ROOT, 'brain', 'audits', 'data', 'brain-index.json');
const FONTS_OUT = path.join(ROOT, 'workspace', 'brain-graph', 'fonts.js');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(ROOT, f));
const readJson = (f, d) => (exists(f) ? JSON.parse(read(f)) : d);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function walk(dir, re, out = []) {
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!/^(node_modules|ms-playwright|screens|data|thumbs|\.)/.test(e.name)) walk(p, re, out); }
    else if (re.test(e.name)) out.push(p);
  }
  return out;
}

// Every real note in the vault (shared with obsidian-sync via tools/lib/vault.js), plus the
// executable parts of the brain, which are documents too. One list, so the two views cannot diverge.
const DOCS = [
  ...vaultNotes(),
  'brain/gates/scripts/static-checks.js', 'brain/gates/scripts/static-checks.selftest.js',
  'tools/capture-web.js', 'tools/probe-styles.js', 'tools/queue-probe-readonly.js', 'tools/sync-design-assets.js',
  'tools/index-owner-screenshots.js', 'tools/make-capture-thumbs.js', 'tools/brain-graph.js', 'tools/obsidian-sync.js',
  'tools/brain-parity.js', 'tools/brain-sync.js', 'tools/brain-score.js', 'tools/lib/vault.js',
].filter((f, i, a) => a.indexOf(f) === i && exists(f));

const CAPTURED_FLOWS_DOC = 'brain/context/mobile-flows-captured.md';
const SUBFLOW_FILES = new Set([CAPTURED_FLOWS_DOC, 'brain/context/flows.md']);
const OBS_FILES = new Set([CAPTURED_FLOWS_DOC, 'brain/context/known-fragile.md']);

const FRIENDLY = { groups: {}, journeys: {}, steps: {}, subflows: {}, screens: {}, docs: {}, names: {}, ...readJson('brain/audits/data/friendly-names.json', {}) };
const CAP_NAMES = readJson('brain/audits/data/owner-mobile-capture-names.json', {});

const area = (f) => (f.startsWith('brain/') ? f.split('/')[1] : f.startsWith('shoebox/') ? 'shoebox' : f.startsWith('workspace/') ? 'workspace' : f.startsWith('tools/') ? 'tools' : 'root');
// memory: entries mention the IDs whose rows they hold, but the register page stays the ID's home.
const PRI = { context: 6, gates: 5, skills: 4, audits: 3, assets: 2, shoebox: 2, root: 2, memory: 1, workspace: 1, tools: 0 };
const stripMd = (s) => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|__|`/g, '').replace(/\s+/g, ' ').trim();
// Readable text for the page: keeps line breaks and bullets, swaps shared-part codes (S3) for their names.
const SUB_NAME_RE = /(?<![\w-])S(?:1[0-2]|[1-9])(?![\w.])/g;
const plain = (s) => String(s || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|__|`/g, '')
  .replace(SUB_NAME_RE, (m) => (FRIENDLY.subflows[m] ? `“${FRIENDLY.subflows[m]}”` : m))
  .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
function short(s, max = 56) {
  const t = stripMd(s);
  if (!t) return '';
  let cut = t.split(/\s[—–]\s|;\s|\s\(|:\s|\.\s/)[0].trim();
  if (cut.length < 12) cut = t;
  return cut.length <= max ? cut : `${cut.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

const nodes = new Map();
const edges = new Map();
function addNode(id, props) {
  if (!nodes.has(id)) nodes.set(id, { id, ...props });
  return nodes.get(id);
}
function link(a, b) {
  if (!a || !b || a === b || !nodes.has(a) || !nodes.has(b)) return;
  const k = a < b ? `${a}|${b}` : `${b}|${a}`;
  edges.set(k, (edges.get(k) || 0) + 1);
}

const ID_RULES = [
  ['flow', /(?<![\w-])F(?:0[1-9]|[12]\d|3[0-2])(?![\w-])/g],
  ['decision', /(?<![\w-])BT-(?:1[0-2]|[1-9])(?![\w-])/g],
  ['decision', /(?<![\w-])D-DS[1-8](?![\w-])/g],
  ['decision', /(?<![\w-])D-T[1-7](?![\w-])/g],
  ['decision', /(?<![\w-])Q-[PTM]\d{1,2}(?![\w-])/g],
  ['rule', /(?<![\w-])DW[1-5](?![\w])/g],
  ['rule', /(?<![\w-])M(?:1\d|[1-9])(?![\w])/g],
  ['rule', /(?<![\w-])W(?:20|1\d|[1-9])(?![\w])/g],
  ['rule', /(?<![\w-])D[1-5](?![\w-])/g],
  ['rule', /(?<![\w-])S[0-7]\.\d{1,2}(?!\d)/g],
  ['gate', /(?<![\w-])CG-[AMW]\d{1,2}(?!\d)/g],
  ['gate', /(?<![\w-])DG-[AB]\d{1,2}(?!\d)/g],
  ['gate', /(?<![\w-])TG-\d{1,2}(?!\d)/g],
  ['gate', /(?<![\w-])QG-\d{1,2}(?!\d)/g],
  ['gap', /(?<![\w-])KG-[A-Z]+\d*(?![\w-])/g],
  ['mflow', /(?<![\w-])MF-(?:0[1-9]|10)(?!\d)/g],
  ['video', /(?<![\w-])MV-\d{2}(?![\w-])/g],
];
const SUBFLOW_RE = /(?<![\w-])S(?:1[0-2]|[1-9])(?![\w.])/g;
const OBS_RE = /(?<![\w-])O(?:1[0-5]|[1-9])(?![\w])/g;
function findIds(text, file) {
  const out = new Map();
  for (const [g, re] of ID_RULES) for (const m of String(text).matchAll(re)) out.set(m[0], g);
  if (SUBFLOW_FILES.has(file)) for (const m of String(text).matchAll(SUBFLOW_RE)) out.set(m[0], 'mflow');
  if (OBS_FILES.has(file)) for (const m of String(text).matchAll(OBS_RE)) out.set(m[0], 'gap');
  return out;
}

// ---------- owner screenshots ----------
const CAPTURES = readJson('brain/audits/data/owner-mobile-captures.json', { files: [] }).files.filter((c) => c.kind !== 'video');
const WEBCAPS = readJson('brain/audits/data/web-screenshots.json', { files: [] }).files;
const CAPTURE_IDS = new Set([...CAPTURES.map((c) => c.id), ...WEBCAPS.map((c) => c.id)]);
const CAP_BY_ID = new Map(CAPTURES.map((c) => [c.id, c]));
const capNum = (id) => (CAP_BY_ID.get(id) || { n: 0 }).n;
const CAP_CODES = [...new Set([...CAPTURES, ...WEBCAPS].map((c) => c.id.split('-')[0]))].join('|') || 'NONE';
const CAP_RE = new RegExp(`(?<![\\w-])(${CAP_CODES})-(\\d{2})((?:\\s*[–-]\\s*(?:(?:${CAP_CODES})-)?\\d{1,2}(?!\\d))|(?:\\/\\d{2})+)?`, 'g');
function findCaptures(text) {
  const out = new Set();
  for (const m of String(text).matchAll(CAP_RE)) {
    const code = m[1];
    const a = parseInt(m[2], 10);
    const nums = [a];
    if (m[3]) {
      if (m[3].trim().startsWith('/')) m[3].split('/').filter(Boolean).forEach((n) => nums.push(parseInt(n, 10)));
      else {
        const b = parseInt(m[3].replace(/[^\d]/g, '').slice(-2), 10);
        if (b > a && b - a <= 90) for (let n = a + 1; n <= b; n++) nums.push(n);
      }
    }
    for (const n of nums) { const id = `${code}-${String(n).padStart(2, '0')}`; if (CAPTURE_IDS.has(id)) out.add(id); }
  }
  return out;
}
const byCapNum = (a, b) => a.localeCompare(b.split('-')[0]) === 0 ? capNum(a) - capNum(b) : a.localeCompare(b);
for (const c of CAPTURES) {
  addNode(`cap:${c.id}`, {
    l: c.id, g: 'capture', at: `${c.date} ${c.time}`.trim(), p: c.library, a: 'mobile',
    ...(c.dupOf ? { dup: c.dupOf } : {}),
    d: c.dupOf ? `The same screen as ${c.dupOf}, reused by another journey (kept on purpose).` : 'Screenshot from the owner, iOS simulator, app build 42.32 (development build on staging).',
  });
}

for (const w of WEBCAPS) {
  addNode(`cap:${w.id}`, {
    l: w.page || w.id, g: 'capture', ref: w.id, p: w.library, a: 'web',
    t: w.surface,
    at: w.when || '',
    d: `Web screenshot from the owner (${w.role}). ${w.page ? `Page: ${w.page}.` : 'The file name carries no page name; contents not described.'}`,
  });
  // A web screenshot is behaviour evidence for the feature(s) it shows (its `flows` tag). The mobile
  // captures link to features through journeys; web captures had no such path, so link them here.
  for (const f of w.flows || []) { addNode(`id:${f}`, { l: f, g: 'flow' }); link(`cap:${w.id}`, `id:${f}`); }
}

// ---------- owner screen recordings (module-organised, 2026-09-16) ----------
const VIDEOS = readJson('brain/audits/data/mobile-videos.json', { files: [] }).files;
for (const v of VIDEOS) {
  addNode(`id:${v.id}`, {
    l: v.name, g: 'video', ref: v.id, p: v.library, a: 'mobile',
    t: v.module,
    d: v.steps || 'Screen recording from the owner; contents not described.',
    sec: v.seconds,
  });
}

// ---------- code nodes from the dependency graphs ----------
const mobileGraph = JSON.parse(read('brain/audits/data/mobile-graph.json'));
const webGraph = JSON.parse(read('brain/audits/data/web-graph.json'));
const codeLabel = (p) => { const parts = p.split('/'); const b = parts.pop(); return /^index\./.test(b) ? `${parts.pop()}/${b}` : b; };

const SCREENS = new Set(Object.keys(mobileGraph.screens));
for (const [name, file] of Object.entries(mobileGraph.screens)) addNode(`screen:${name}`, { l: name, g: 'screen', p: file, a: 'mobile' });
for (const [file, screens] of Object.entries(mobileGraph.moduleToScreens)) {
  addNode(`code:${file}`, { l: codeLabel(file), g: 'code', p: file, a: 'mobile' });
  for (const s of screens) link(`code:${file}`, `screen:${s}`);
}
for (const file of Object.keys(webGraph)) addNode(`code:${file}`, { l: path.basename(file, '.php'), g: 'code', p: file, a: 'web' });
const CODE_PATHS = [...nodes.values()].filter((n) => n.g === 'code').map((n) => n.p);

function codeRefs(text) {
  const out = new Set();
  for (const m of String(text).matchAll(/`([^`\n]+)`/g)) {
    for (const raw of m[1].split(/[\s,;]+/)) {
      const t = raw.replace(/^repos\/(mobile|web)\//, '').replace(/[:(].*$/, '').replace(/[.,;)]+$/, '');
      if (!/\.(jsx?|tsx?|php)$/.test(t)) continue;
      let c = CODE_PATHS.filter((p) => p === t || p.endsWith(`/${t}`));
      if (!c.length) {
        const b = t.split('/').pop();
        c = CODE_PATHS.filter((p) => p.split('/').pop() === b);
        if (c.length > 1) { const segs = t.split('/').slice(0, -1); c = c.filter((p) => segs.every((s) => p.split('/').includes(s))); }
      }
      if (c.length === 1) out.add(`code:${c[0]}`);
    }
  }
  return out;
}

// ---------- note nodes ----------
const DOC_ID = (f) => `doc:${f}`;
function docLabel(f) {
  const b = path.basename(f);
  const dir = path.basename(path.dirname(f));
  if (b === 'SKILL.md') return dir;
  if (b === 'README.md') return `${dir}/README`;
  if (b === 'audit.md') return dir.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (f.startsWith('shoebox/')) return `shoebox/${b.replace(/\.md$/, '')}`;
  return b.replace(/\.md$/, '');
}
function docTitle(f, text) {
  if (f.endsWith('.md')) { const m = text.match(/^#\s+(.+)$/m); return m ? stripMd(m[1]) : ''; }
  const m = text.match(/^\s*\*\s+(\S[^\n]*)$/m);
  return m ? m[1].trim() : '';
}
const TEXT = {};
for (const f of DOCS) {
  TEXT[f] = read(f);
  addNode(DOC_ID(f), { l: docLabel(f), g: 'doc', p: f, a: area(f), t: docTitle(f, TEXT[f]) });
}
// A `path.md` citation, resolved against the note set: exact, then relative to the citing note,
// then a unique basename. Ambiguous basenames (README.md, SKILL.md) need a path to count.
const DOC_SET = new Set(DOCS);
const DOC_BY_BASE = new Map();
for (const f of DOCS) {
  const b = path.basename(f);
  if (!DOC_BY_BASE.has(b)) DOC_BY_BASE.set(b, []);
  DOC_BY_BASE.get(b).push(f);
}
function resolveNotePath(ref, from) {
  const c = String(ref).replace(/^\.\//, '').replace(/^\//, '').split('#')[0];
  if (DOC_SET.has(c)) return c;
  const sibling = path.posix.normalize(path.posix.join(path.posix.dirname(from), c));
  if (DOC_SET.has(sibling)) return sibling;
  const hits = DOC_BY_BASE.get(path.basename(c)) || [];
  if (hits.length === 1) return hits[0];
  const suffix = hits.filter((h) => h === c || h.endsWith('/' + c));
  return suffix.length === 1 ? suffix[0] : null;
}

const BASES = {};
for (const f of DOCS) {
  const b = path.basename(f);
  if (['SKILL.md', 'README.md', 'audit.md'].includes(b)) continue;
  (BASES[b] = BASES[b] || []).push(f);
}
const SKILLS = DOCS.filter((f) => f.endsWith('/SKILL.md'));
const AUDITS = {};
for (const f of DOCS) { const m = f.match(/^brain\/audits\/0(\d)-/); if (m) AUDITS[m[1]] = f; }

const JOURNEYS = {}; // MF-xx -> { code, steps: [{ k, n, w, ids }] }
for (const f of DOCS) {
  const text = TEXT[f];
  const me = DOC_ID(f);
  const pri = PRI[area(f)];
  // 07-validation §5 numbers its weaknesses W1..W11, which are not web rules.
  const scan = f === 'brain/audits/07-validation.md' ? text.replace(/^\| W\d+ \|/gm, '| |') : text;

  for (const [id, g] of findIds(scan, f)) { addNode(`id:${id}`, { l: id, g }); link(me, `id:${id}`); }
  for (const c of findCaptures(scan)) link(me, `cap:${c}`);

  for (const m of text.matchAll(/`([A-Za-z0-9_@.\/-]+\.md)`|\]\(([^)\s]+\.md)(?:#[^)\s]*)?\)/g)) {
    const target = resolveNotePath(m[1] || m[2], f);
    if (target && target !== f) link(me, DOC_ID(target));
  }
  for (const [b, list] of Object.entries(BASES)) {
    if (!new RegExp(`(?<![\\w-])${esc(b)}(?![\\w-])`).test(text)) continue;
    const target = list.length === 1 ? list[0] : (list.find((x) => text.includes(x)) || list.find((x) => x.startsWith('brain/')) || list[0]);
    if (target !== f) link(me, DOC_ID(target));
  }
  for (const sk of SKILLS) {
    const name = path.basename(path.dirname(sk));
    if (sk !== f && new RegExp(`(?<![\\w-])${esc(name)}(?![\\w-])`).test(text)) link(me, DOC_ID(sk));
  }
  for (const m of text.matchAll(/(?<![\w-])A([0-7])(?![\w.-])/g)) if (AUDITS[m[1]] && AUDITS[m[1]] !== f) link(me, DOC_ID(AUDITS[m[1]]));
  for (const c of codeRefs(text)) link(me, c);

  if (!f.endsWith('.md')) continue;
  let section = null; // journey section (MF-xx) in mobile-flows-captured.md
  for (const line of scan.split('\n')) {
    if (f === CAPTURED_FLOWS_DOC) {
      const h = line.match(/^###\s+(MF-\d{2})\s+(.+)$/);
      if (h) {
        section = `id:${h[1]}`;
        addNode(section, { l: h[1], g: 'mflow' });
        const n = nodes.get(section);
        n.t = stripMd(h[2]).replace(/\s*·\s*F\d.*$/, '');
        n.d = `App journey written from the owner's screenshots (build 42.32): ${stripMd(h[2])}`;
        n.h = me; n.dp = 99;
        JOURNEYS[h[1]] = { code: (h[2].match(/\(([A-Z]{2,3})\)/) || [])[1], steps: [] };
      } else if (/^##\s/.test(line)) section = null;
      if (section && !h) {
        for (const [id, g] of findIds(line, f)) { addNode(`id:${id}`, { l: id, g }); link(section, `id:${id}`); }
        const J = JOURNEYS[section.slice(3)];
        const row = line.match(/^\|\s*(\d+[a-z]?)\s*\|(.+)\|\s*$/);
        const item = !row && line.match(/^(\d+)\.\s+(.+)$/);
        if (row) {
          const cells = row[2].split('|').map((c) => c.trim());
          J.steps.push({ k: row[1], n: stripMd(cells[0]), w: cells.length > 2 ? cells[1] : '', ids: cells[cells.length - 1] });
        } else if (item) {
          J.steps.push({ k: item[1], n: stripMd(item[2]).replace(/\s*\([^()]*\)\.?$/, '').replace(/\.$/, ''), w: '', ids: item[2] });
        }
      }
      // coverage table: `Screen` IDs · `Screen` IDs …
      if (/Captured \(route/.test(line) || /^\| `Login`/.test(line)) {
        for (const m of line.matchAll(/`([A-Za-z]+)`([^`]*)/g)) {
          if (!SCREENS.has(m[1])) continue;
          for (const c of findCaptures(m[2].split('·')[0])) link(`screen:${m[1]}`, `cap:${c}`);
        }
      }
    }
    if (!/^\|/.test(line) || /^\|\s*:?-{3}/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2) continue;
    const keyIds = [...findIds(cells[0], f).keys()];
    const keys = [...keyIds.map((k) => `id:${k}`), ...codeRefs(cells[0])];
    const rest = cells.slice(1).join(' | ');
    const otherIds = [...findIds(rest, f).keys()];
    const restCode = codeRefs(rest);
    const restCaps = findCaptures(rest);
    const restScreens = [...rest.matchAll(/`([^`]+)`/g)].map((m) => m[1]).filter((s) => SCREENS.has(s));
    for (const k of keys) {
      for (const o of otherIds) { addNode(`id:${o}`, { l: o, g: findIds(rest, f).get(o) }); link(k, `id:${o}`); }
      for (const c of restCode) link(k, c);
      for (const c of restCaps) link(k, `cap:${c}`);
      for (const s of restScreens) link(k, `screen:${s}`);
    }
    if (keyIds.length === 1) {
      const n = nodes.get(`id:${keyIds[0]}`);
      // Recordings are described by brain/audits/data/mobile-videos.json, not by the row that cites them.
      if (n && n.g === 'video') continue;
      const isSub = /^S\d/.test(keyIds[0]) && f === CAPTURED_FLOWS_DOC;
      const isObs = /^O\d/.test(keyIds[0]) && f === CAPTURED_FLOWS_DOC;
      let title = stripMd(cells[0]).replace(keyIds[0], '').replace(/^[\s:·—–/-]+/, '').trim();
      let def = stripMd(cells[1]);
      if (isSub) {
        title = stripMd(cells[1]); def = stripMd(cells[2] || '');
        n.kind = 'part'; n.how = plain(cells[2]); n.caps = [...findCaptures(cells[3] || '')].sort(byCapNum);
      }
      if (isObs) {
        title = stripMd(cells[2] || '').slice(0, 110); def = `${stripMd(cells[1])} · ${stripMd(cells[2] || '')}`;
        n.sev = stripMd(cells[1]); n.how = plain(cells[2]); n.caps = [...findCaptures(cells[3] || '')].sort(byCapNum);
      }
      if (f === 'brain/context/flows.md' && /^F\d/.test(keyIds[0]) && cells.length > 5) { n.c = stripMd(cells[1]); n.pl = stripMd(cells[2]); def = `${n.c} · ${n.pl}`; }
      if (f === 'brain/context/parity-map.md' && cells[5]) n.pa = stripMd(cells[5]).slice(0, 180);
      const p = isSub || isObs ? 98 : pri;
      if (n.dp === undefined || p > n.dp) {
        if (title.length > 1) n.t = title.slice(0, 120);
        if (def) n.d = def.slice(0, 280);
        n.h = me;
        n.dp = p;
      }
    }
  }
}

// ---------- recordings -> the flows they cover ----------
for (const v of VIDEOS) {
  for (const f of v.flows || []) {
    addNode(`id:${f}`, { l: f, g: 'flow' });
    link(`id:${v.id}`, `id:${f}`);
  }
}

// ---------- journeys: step order, "next screen" links ----------
const STEP_PAIRS = new Set();
for (const [mf, J] of Object.entries(JOURNEYS)) {
  const node = nodes.get(`id:${mf}`);
  const mine = CAPTURES.filter((c) => c.id.startsWith(`${J.code}-`)).sort((a, b) => a.n - b.n);
  const stepOf = new Map();
  J.steps.forEach((s, i) => {
    // "LS-01–19 = duplicates of RT-34–44 …": only this journey's own screenshots belong to its steps
    s.c = [...findCaptures(s.ids.split(/=\s*duplicates of/i)[0])].filter((id) => id.startsWith(`${J.code}-`) && !stepOf.has(id)).sort(byCapNum);
    s.c.forEach((id) => stepOf.set(id, i));
  });
  for (const c of mine) {
    if (stepOf.has(c.id) || !J.steps.length) continue;
    // not listed in any step: keep it with the screenshot taken just before it
    const before = mine.filter((x) => x.n < c.n && stepOf.has(x.id)).pop();
    const i = before ? stepOf.get(before.id) : 0;
    J.steps[i].c.push(c.id);
    J.steps[i].c.sort(byCapNum);
    stepOf.set(c.id, i);
  }
  const order = J.steps.flatMap((s) => s.c);
  order.forEach((id, i) => { const n = nodes.get(`cap:${id}`); n.j = mf; n.o = i; n.sk = J.steps[stepOf.get(id)].k; });
  if (order.length) link(`id:${mf}`, `cap:${order[0]}`);
  for (let i = 1; i < order.length; i++) { link(`cap:${order[i - 1]}`, `cap:${order[i]}`); STEP_PAIRS.add(`cap:${order[i - 1]}|cap:${order[i]}`); }
  const fj = FRIENDLY.journeys[mf] || {};
  node.kind = 'journey';
  node.sum = fj.summary || '';
  node.cover = fj.cover || order[0];
  node.steps = J.steps.map((s) => ({ k: s.k, n: FRIENDLY.steps[`${mf}#${s.k}`] || s.n, w: plain(s.w).slice(0, 700), c: s.c }));
}
for (const c of CAPTURES) if (c.dupOf) link(`cap:${c.id}`, `cap:${c.dupOf}`);

// ---------- web classes -> flows (flow entry points vs routes each class serves) ----------
const flowGlobs = [];
for (const line of TEXT['brain/context/flows.md'].split('\n')) {
  if (!/^\|/.test(line)) continue;
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  const ids = [...findIds(cells[0] || '', 'brain/context/flows.md').keys()].filter((x) => /^F\d/.test(x));
  if (ids.length !== 1 || !cells[4]) continue;
  for (const m of cells[4].matchAll(/`([^`]+)`/g)) {
    for (const tok of m[1].split(/[\s,]+/)) {
      const t = tok.replace(/^\//, '');
      if (t.length < 3 || /[{}]/.test(t)) continue;
      flowGlobs.push([ids[0], new RegExp(`^${t.split('*').map(esc).join('.*')}${t.endsWith('*') ? '' : '$'}`)]);
    }
  }
}
// Curated feature -> concrete implementation files (verified by code reading), for features whose real
// code the route-glob matcher misses (e.g. the /manager and /hq route groups are not attributed in web-graph).
// Only links files that already exist as code nodes, so it can never invent a node.
const FEATURE_CODE = readJson('brain/audits/data/feature-code.json', {});
for (const [fid, files] of Object.entries(FEATURE_CODE)) {
  if (fid.startsWith('_')) continue;
  addNode(`id:${fid}`, { l: fid, g: 'flow' });
  for (const f of files) link(`code:${f}`, `id:${fid}`);
}

for (const [file, deps] of Object.entries(webGraph)) {
  const routes = [...(deps.api || []), ...(deps.web || [])].map((r) => String(r).replace(/^\//, ''));
  const hit = new Set(flowGlobs.filter(([, re]) => routes.some((r) => re.test(r))).map(([fid]) => fid));
  for (const fid of hit) { addNode(`id:${fid}`, { l: fid, g: 'flow' }); link(`code:${file}`, `id:${fid}`); }
}

// ---------- plain-language names (codes move to `ref`) ----------
for (const n of nodes.values()) {
  if (n.g === 'capture') { if (n.a === 'web') continue; n.ref = n.l; n.l = CAP_NAMES[n.ref] || (n.dup && CAP_NAMES[n.dup]) || n.ref; continue; }
  if (n.g === 'doc') { n.ref = n.l; n.l = FRIENDLY.docs[n.p] || n.t || n.ref; continue; }
  if (n.g === 'screen') { n.ref = n.l; n.l = FRIENDLY.screens[n.ref] || n.ref; continue; }
  if (n.g === 'video') { continue; } // label and ref already set from mobile-videos.json
  if (n.g === 'code') { n.ref = n.p; continue; }
  n.ref = n.l;
  n.l = (FRIENDLY.journeys[n.ref] || {}).name || FRIENDLY.subflows[n.ref] || FRIENDLY.names[n.ref] || short(n.t) || short(n.d) || n.ref;
}

// ---------- output ----------
const list = [...nodes.values()];
const index = new Map(list.map((n, i) => [n.id, i]));
const links = [...edges.entries()].map(([k, w]) => {
  const [a, b] = k.split('|');
  if (STEP_PAIRS.has(`${a}|${b}`)) return [index.get(a), index.get(b), w, 1];
  if (STEP_PAIRS.has(`${b}|${a}`)) return [index.get(b), index.get(a), w, 1];
  return [index.get(a), index.get(b), w];
});
const outNodes = list.map(({ dp, ...n }) => n);
// One timestamp for both files: tools/hub-map.js stamps hub-data.js with the index's, and the page
// only uses the hub map when the two match.
const BUILT_AT = new Date().toISOString();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `window.BRAIN_GRAPH = ${JSON.stringify({ generatedAt: BUILT_AT, groups: FRIENDLY.groups, journeys: Object.keys(JOURNEYS).sort(), nodes: outNodes, links })};\n`);

// The canonical index: the same nodes and edges, keyed by string instead of array position, so
// tools/obsidian-sync.js can render the identical graph as notes. This file is the contract between
// the two views — whatever is in here is in both.
fs.mkdirSync(path.dirname(INDEX_OUT), { recursive: true });
fs.writeFileSync(INDEX_OUT, `${JSON.stringify({
  generatedAt: BUILT_AT,
  groups: FRIENDLY.groups,
  journeys: Object.fromEntries(Object.keys(JOURNEYS).sort().map((mf) => [mf, nodes.get(`id:${mf}`).steps || []])),
  nodes: outNodes,
  links: [...edges.entries()].map(([k, w]) => {
    const [a, b] = k.split('|');
    const step = STEP_PAIRS.has(`${a}|${b}`) ? 1 : STEP_PAIRS.has(`${b}|${a}`) ? 1 : 0;
    return step && STEP_PAIRS.has(`${b}|${a}`) ? [b, a, w, 1] : [a, b, w, step];
  }),
}, null, 0)}\n`);

// Project fonts for the page (A1/A6: DIN 2014 from the design library, private artifact only), as data URIs.
const FONT_FILES = [['DIN 2014 Bold', 'brain/assets/fonts/web/DinBold.ttf'], ['DIN 2014 Light', 'brain/assets/fonts/web/DinLight.ttf']].filter(([, p]) => exists(p));
fs.writeFileSync(FONTS_OUT, `(function () {\n  if (!window.FontFace || !document.fonts) return;\n  var faces = ${JSON.stringify(FONT_FILES.map(([fam, p]) => [fam, fs.readFileSync(path.join(ROOT, p)).toString('base64')]))};\n  window.BRAIN_FONTS = Promise.all(faces.map(function (f) { var face = new FontFace(f[0], 'url(data:font/ttf;base64,' + f[1] + ')'); document.fonts.add(face); return face.load(); }));\n})();\n`);

const deg = new Array(list.length).fill(0);
links.forEach(([a, b]) => { deg[a]++; deg[b]++; });
const byGroup = {};
list.forEach((n) => { byGroup[n.g] = (byGroup[n.g] || 0) + 1; });
console.log(`nodes ${list.length} · links ${links.length} (${STEP_PAIRS.size} next-screen links) · notes scanned ${DOCS.length}`);
console.log('by group', byGroup);
console.log('orphans', deg.filter((d) => d === 0).length, '· screenshots without a journey', list.filter((n) => n.g === 'capture' && !n.j).map((n) => n.ref).join(',') || 'none');
console.log('journeys', Object.entries(JOURNEYS).map(([mf, J]) => `${mf} ${nodes.get(`id:${mf}`).l}: ${J.steps.length} steps/${J.steps.reduce((s, x) => s + x.c.length, 0)} shots`).join(' · '));
console.log('names still codes', list.filter((n) => n.g !== 'code' && n.l === n.ref && !/^[A-Z][\w]+$/.test('x')).filter((n) => /^[A-Z]{1,3}-?[A-Z]*\d/.test(n.l)).map((n) => n.l).join(',') || 'none');
console.log(`index ${path.relative(ROOT, INDEX_OUT)} (${Math.round(fs.statSync(INDEX_OUT).size / 1024)} KB)`);
console.log(`written ${path.relative(ROOT, OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB), fonts.js ${Math.round(fs.statSync(FONTS_OUT).size / 1024)} KB`);
