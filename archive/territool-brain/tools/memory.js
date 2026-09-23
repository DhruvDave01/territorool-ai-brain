#!/usr/bin/env node
/**
 * The knowledge memory: brain/memory/ (owner decision 2026-09-17; design in brain/memory/README.md).
 *
 *   node tools/memory.js status                  evidence-based health (counts only, nothing invented)
 *   node tools/memory.js context <query>         HOT + entries matching a feature id, file or word (max 25)
 *   node tools/memory.js impact <path>...        entries and features touched by these files
 *   node tools/memory.js history <F-id>          a feature's entries, oldest first
 *   node tools/memory.js new --type T --title X --source S --what W --why Y --implication I [--features F11,F12]
 *                        [--files a,b] [--platforms mobile,web] [--evidence DOCUMENTED] [--origin ai-loop] [--status CURRENT]
 *                                                capture one entry; an identical type+title increments `occurrences`
 *   node tools/memory.js supersede <old-id> <new-id>
 *   node tools/memory.js migrate <register|all> [--allow-dirty]   convert a brain/context register into entries
 *   node tools/memory.js seed-git [--since YYYY-MM-DD]            `change` entries for committed repo history
 *   node tools/memory.js sync [--check]          pull-based reconciliation (no git hooks): new commits, working-tree
 *                                                changes, environment pointers, freshness, LAST-SYNC
 *   node tools/memory.js render [--check]        rebuild the register files from entries + templates
 *   node tools/memory.js reindex [--check]       rebuild brain/memory/_generated/*
 *   node tools/memory.js lint [--strict]         schema, provenance, implication, secrets, ids, supersession
 *   node tools/memory.js promote                 occurrences >= 3 → proposed rules (prints only; owner approves)
 *   node tools/memory.js --self-test
 *
 * Laws (brain/memory/RULES.md): append, never destroy · evidence or nothing · one home per fact · idempotent ·
 * growth must not slow retrieval · never overwrite human work · no false completion.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

let ROOT = process.env.MEMORY_ROOT || require('./lib/vault.js').ROOT;
const MEM = 'brain/memory';
const ENT = `${MEM}/entries`;
const GEN = `${MEM}/_generated`;
const TPL = `${MEM}/_templates`;
const TODAY = new Date().toISOString().slice(0, 10);

const TYPES = ['decision', 'change', 'bug', 'fix', 'pattern', 'antipattern', 'failed-approach', 'design', 'parity', 'api',
  'schema', 'vocabulary', 'testing', 'qa', 'environment', 'performance', 'integration', 'product', 'question', 'conflict',
  'correction', 'incident', 'deprecation', 'regression-link'];
const STATUSES = ['CURRENT', 'VERIFIED', 'OBSERVED', 'INFERRED', 'UNKNOWN', 'CONFLICTED', 'NEEDS-REVALIDATION', 'NEEDS-VERIFICATION',
  'HISTORICAL', 'DEPRECATED', 'SUPERSEDED', 'STALE', 'OPEN', 'RESOLVED', 'BROKEN-REFERENCE'];
const EVIDENCE = ['VERIFIED', 'VISUAL', 'DOCUMENTED', 'INFERRED', 'UNKNOWN'];
const ORIGINS = ['ai-loop', 'manual-commit', 'user-statement', 'audit', 'qa', 'incident', 'review', 'migration'];
const RELATIONS = ['DEPENDS_ON', 'USED_BY', 'CALLS', 'READS_FROM', 'WRITES_TO', 'TRIGGERS', 'AFFECTS', 'SHARED_WITH',
  'TESTED_BY', 'VALIDATED_BY', 'SUPERSEDES', 'RELATED_TO'];
const CRIT_WEIGHT = { BLOCKER: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

// ------------------------------------------------------------------------------------------------ io helpers
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => (exists(p) ? fs.readFileSync(abs(p), 'utf8') : '');
const mkdirp = (p) => fs.mkdirSync(abs(p), { recursive: true });
let WRITES = 0;
let CHECK = false;
const STALE = [];
/** Write only when content changes; in --check mode record staleness instead. */
function put(p, text) {
  if (read(p) === text) return false;
  if (CHECK) { STALE.push(p); return true; }
  mkdirp(path.dirname(p));
  fs.writeFileSync(abs(p), text);
  WRITES++;
  return true;
}
const LINKS = '%% brain-links:start';
const managed = (t) => (t.includes(LINKS) ? t.slice(t.indexOf(LINKS)) : '');
const body = (t) => (t.includes(LINKS) ? t.slice(0, t.indexOf(LINKS)) : t);
/** Replace the part a generator owns, keeping the brain-links block obsidian-sync maintains. */
function putOwned(p, text) {
  const prev = read(p);
  const m = managed(prev);
  const out = m ? `${text.replace(/\s*$/, '')}\n\n${m}` : text;
  const norm = (t) => body(t).split('\n').map((l) => l.replace(/\s+$/, '')).filter(Boolean).join('\n');
  if (prev && norm(prev) === norm(out)) return false;
  return put(p, out);
}
const git = (repo, args) => {
  try { return execFileSync('git', ['-C', abs(repo), ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).trim(); }
  catch { return null; }
};
const hash6 = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 6);
const slug = (s) => String(s).toLowerCase().replace(/[`*_]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'entry';
const stripMd = (s) => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\*\*|__|`/g, '').replace(/\s+/g, ' ').trim();
const cut = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

// ------------------------------------------------------------------------------------------------ entry format
/** Minimal YAML subset we write ourselves: scalars, inline JSON-ish lists, and a block list of {REL: target}. */
function parseEntry(text, file) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  let key = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const v = kv[2].trim();
      if (v === '') fm[key] = key === 'relations' ? [] : '';
      else if (v.startsWith('[')) fm[key] = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^"|"$/g, '')).filter(Boolean);
      else fm[key] = v.replace(/^"(.*)"$/, '$1');
      continue;
    }
    const rel = line.match(/^\s+-\s+([A-Z_]+):\s*(.+)$/);
    if (rel && key === 'relations') { fm.relations.push({ rel: rel[1], to: rel[2].trim() }); continue; }
  }
  const rest = text.slice(m[0].length);
  const content = body(rest);
  const section = (name) => {
    const r = content.match(new RegExp(`^## ${name}[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm'));
    return r ? r[1].trim() : '';
  };
  const title = (content.match(/^#\s+(.+)$/m) || [])[1] || '';
  const rowBlock = content.match(/^~~~text\nROW: (.*)\n~~~$/m);
  return { file, fm, title: title.trim(), what: section('What'), why: section('Why it matters'), evidenceText: section('Evidence'),
    implication: section('Implication for future work'), related: section('Related'), row: rowBlock ? rowBlock[1] : null,
    statusHistory: section('Status history'), raw: text };
}

const FM_ORDER = ['id', 'legacy_id', 'register', 'type', 'status', 'status_note', 'evidence', 'source', 'origin', 'approver',
  'supersedes', 'superseded_by', 'features', 'flows', 'platforms', 'files', 'commits', 'relations', 'occurrences',
  'first_recorded', 'last_verified', 'verified_against', 'labels'];
const LISTS = new Set(['supersedes', 'superseded_by', 'features', 'flows', 'platforms', 'files', 'commits', 'labels']);
const q = (v) => (/^[\w.@/ ():,+≤#-]*$/.test(v) && !/^\s|\s$/.test(v) && !/: /.test(v) ? v : JSON.stringify(v));
function emitEntry(e) {
  const fm = e.fm;
  const lines = ['---'];
  for (const k of FM_ORDER) {
    if (fm[k] === undefined) continue;
    if (k === 'relations') {
      lines.push('relations:');
      for (const r of fm.relations || []) lines.push(`  - ${r.rel}: ${r.to}`);
    } else if (LISTS.has(k)) lines.push(`${k}: [${(fm[k] || []).map((x) => (/[,\[\]]/.test(x) ? JSON.stringify(x) : x)).join(', ')}]`);
    else lines.push(`${k}: ${q(String(fm[k]))}`);
  }
  // keep keys other tools add (obsidian-sync: area, tags, ref) after ours
  for (const [k, v] of Object.entries(fm)) {
    if (FM_ORDER.includes(k)) continue;
    lines.push(Array.isArray(v) ? `${k}: [${v.join(', ')}]` : `${k}: ${v}`);
  }
  lines.push('---', '', `# ${e.title}`, '',
    '## What', '', e.what || '—', '',
    '## Why it matters', '', e.why || '—', '',
    '## Evidence', '', e.evidenceText || '—', '',
    '## Implication for future work', '', e.implication || '', '');
  if (e.row !== null && e.row !== undefined) lines.push('## Register row (verbatim — the register table is rendered from this)', '', '~~~text', `ROW: ${e.row}`, '~~~', '');
  if (e.statusHistory) lines.push('## Status history', '', e.statusHistory, '');
  lines.push('## Related', '', e.related || '—', '');
  return lines.join('\n');
}

function entryPath(fm, title) {
  const date = String(fm.id).match(/VAULT-(\d{8})-/)[1];
  return `${ENT}/${fm.type}/${date}-${fm.id.slice(-6)}-${slug(title)}.md`;
}
function listEntries() {
  const out = [];
  const walk = (d) => {
    if (!exists(d)) return;
    for (const e of fs.readdirSync(abs(d), { withFileTypes: true })) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md')) { const x = parseEntry(read(p), p); if (x) out.push(x); }
    }
  };
  walk(ENT);
  return out.sort((a, b) => a.fm.id.localeCompare(b.fm.id));
}
function saveEntry(e) {
  const p = e.file || entryPath(e.fm, e.title);
  e.file = p;
  const prev = read(p);
  const text = emitEntry(e);
  const m = managed(prev);
  const out = m ? `${text.replace(/\s*$/, '')}\n\n${m}` : text;
  if (prev && body(prev).replace(/\s+$/, '') === body(out).replace(/\s+$/, '')) return false;
  return put(p, out);
}
function newId(dateYMD, key) { return `VAULT-${dateYMD.replace(/-/g, '')}-${hash6(key)}`; }

// ------------------------------------------------------------------------------------------------ extraction helpers
const PATH_RE = /`((?:repos\/(?:mobile|web)\/|brain\/|workspace\/|shoebox\/|tools\/|App\/|app\/|routes\/|resources\/|database\/|config\/)[A-Za-z0-9_@./{},-]+?\.[A-Za-z0-9]{1,5})(?::[\d, -]+)?`/g;
const BARE_FILE_RE = /`([A-Za-z0-9_./-]+\.(?:php|js|jsx|ts|tsx|json|yaml|md))(?::[\d, -]+)?`/g;
function filesIn(text) {
  const s = new Set();
  for (const m of String(text).matchAll(PATH_RE)) s.add(m[1]);
  for (const m of String(text).matchAll(BARE_FILE_RE)) if (m[1].includes('/')) s.add(m[1]);
  return [...s].slice(0, 12);
}
const featuresIn = (text) => [...new Set(String(text).match(/\bF\d{2}\b/g) || [])].sort();
const flowsIn = (text) => [...new Set(String(text).match(/\bMF-\d{2}\b/g) || [])].sort();
function platformsIn(text) {
  const t = String(text).toLowerCase();
  const p = [];
  if (/\bmobile\b|\bios\b|\bandroid\b|app\//i.test(t)) p.push('mobile');
  if (/\bweb\b|blade|\/manager|manager portal|\/hq\b/.test(t)) p.push('web');
  if (/\bapi\b|v2\//.test(t)) p.push('api');
  if (/\bmcp\b/.test(t)) p.push('integration');
  if (/\bdb\b|table|migration/.test(t)) p.push('db');
  return p;
}
const splitCells = (line) => line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());

// ------------------------------------------------------------------------------------------------ registers
const REG_BASE = 'mobile f20c5aa · web 21d6348c (register baseline, workspace/loop/2026-09-16-brain-loop/baseline-git.txt)';
const col = (h, cells, ...names) => {
  for (const n of names) { const i = h.findIndex((x) => stripMd(x).toLowerCase().startsWith(n)); if (i >= 0 && cells[i] !== undefined) return cells[i]; }
  return '';
};
const evidenceTier = (text) => (/\.(php|js|jsx|ts|tsx|json|yaml|blade)\b[^|]*:\d|EV-[A-Z]\d{2}|runtime|Runtime|VERIFIED|Verified/.test(text) ? 'VERIFIED' : /IMG_|LS-|RT-|AB-|SLS-|MGR-|ADM-|screenshot/.test(text) ? 'VISUAL' : 'DOCUMENTED');
const REGISTERS = [
  {
    name: 'open-questions', file: 'brain/context/open-questions.md', idRe: /^Q-[A-Z]+\d+$/,
    map: (id, h, c, ctx) => {
      const answered = /answered/i.test(ctx.heading);
      return {
        type: 'question', status: answered ? 'RESOLVED' : 'OPEN', evidence: 'DOCUMENTED',
        origin: answered ? 'user-statement' : 'audit', approver: answered ? 'owner' : undefined,
        title: cut(stripMd(col(h, c, 'question')), 110),
        what: stripMd(col(h, c, 'question')),
        why: stripMd(col(h, c, 'why')) || (answered ? 'An owner answer that became a rule or target.' : ''),
        evidenceText: answered ? `Answer (USER SAID 2026-09-15): ${stripMd(col(h, c, 'answer'))}` : `Source: ${stripMd(col(h, c, 'source'))}`,
        implication: answered ? `Apply the owner's answer: ${stripMd(col(h, c, 'answer'))}` : 'Never assume an answer. Ask the owner, and stop any task whose plan depends on it.',
        source: `brain/context/open-questions.md (${answered ? 'Answered' : 'Open'})`,
      };
    },
  },
  {
    name: 'UNKNOWN_REGISTER', file: 'brain/context/UNKNOWN_REGISTER.md', idRe: /^U-[A-Z]+-\d+$/,
    map: (id, h, c) => ({
      type: 'question', status: 'OPEN', evidence: 'UNKNOWN', origin: 'audit',
      title: cut(stripMd(col(h, c, 'question')), 110),
      what: `${stripMd(col(h, c, 'question'))} (area: ${stripMd(col(h, c, 'area'))})`,
      why: `${stripMd(col(h, c, 'why unknown'))} Importance: ${stripMd(col(h, c, 'importance'))}; blocks 90+: ${stripMd(col(h, c, 'blocks'))}.`,
      evidenceText: `Checked so far: ${stripMd(col(h, c, 'evidence checked'))}`,
      implication: `Treat as UNKNOWN until resolved. To resolve: ${stripMd(col(h, c, 'what would resolve'))}`,
      source: 'brain/context/UNKNOWN_REGISTER.md',
    }),
  },
  {
    name: 'UPCOMING_IMPROVEMENTS', file: 'brain/context/UPCOMING_IMPROVEMENTS.md', idRe: /^UI-[A-Z]+-\d+$/,
    map: (id, h, c) => {
      const fam = id.split('-')[1];
      const type = { SEC: 'bug', API: 'api', PERF: 'performance', UX: 'product', DX: 'pattern' }[fam] || 'bug';
      return {
        type, status: 'OPEN', evidence: evidenceTier(col(h, c, 'evidence')), origin: 'audit',
        title: cut(stripMd(col(h, c, 'current behaviour')), 110),
        what: `${stripMd(col(h, c, 'area'))}: ${stripMd(col(h, c, 'current behaviour'))}`,
        why: `Severity ${stripMd(col(h, c, 'severity'))}. User impact: ${stripMd(col(h, c, 'user impact'))}`,
        evidenceText: stripMd(col(h, c, 'evidence')),
        implication: `Not fixed (application code frozen during brain work). Improvement: ${stripMd(col(h, c, 'potential improvement'))}. Investigate next: ${stripMd(col(h, c, 'investigate next')) || '—'}`,
        source: `brain/context/UPCOMING_IMPROVEMENTS.md · ${stripMd(col(h, c, 'evidence')).slice(0, 120)}`,
        labels: fam === 'SEC' ? ['security'] : [],
      };
    },
  },
  {
    name: 'known-fragile', file: 'brain/context/known-fragile.md', idRe: /^KG-[A-Z]+\d*$/,
    map: (id, h, c) => ({
      type: /^KG-P\d/.test(id) ? 'parity' : 'bug', status: 'OPEN', evidence: evidenceTier(col(h, c, 'evidence')), origin: 'audit',
      title: cut(stripMd(col(h, c, 'gap')), 110),
      what: stripMd(col(h, c, 'gap')),
      why: `Pre-existing known gap on ${stripMd(col(h, c, 'flow')) || 'the flows listed'}; the QA gate classifies it instead of failing (known-fragile §5).`,
      evidenceText: stripMd(col(h, c, 'evidence')),
      implication: 'Classify as a known gap, never as a new failure, unless the task touches it or makes it worse (known-fragile §5, 05-testing §4.3). Never relabel a new defect as this gap.',
      source: `brain/context/known-fragile.md §5 (draft origin: shoebox/09-known-issues/fragile.md) · ${stripMd(col(h, c, 'evidence')).slice(0, 100)}`,
    }),
  },
  {
    name: 'contradiction-register', file: 'brain/context/contradiction-register.md', idRe: /^CR-\d+$/,
    map: (id, h, c) => {
      const st = stripMd(col(h, c, 'status'));
      const status = /^open/i.test(st) ? 'OPEN' : 'RESOLVED';
      const note = st.replace(/^(open|resolved|no action)\s*/i, '').replace(/^\(|\)$/g, '').trim();
      return {
        type: 'conflict', status, status_note: /^no action/i.test(st) ? `no action: both claims true${note ? `; ${note}` : ''}` : (note || undefined),
        evidence: evidenceTier(col(h, c, 'evidence')), origin: 'audit',
        title: cut(`${stripMd(col(h, c, 'claim a'))} ↔ ${stripMd(col(h, c, 'claim b'))}`, 110),
        what: `Claim A: ${stripMd(col(h, c, 'claim a'))}\n\nClaim B: ${stripMd(col(h, c, 'claim b'))}`,
        why: `Two sources disagreed. Stronger source: ${stripMd(col(h, c, 'stronger'))}.`,
        evidenceText: stripMd(col(h, c, 'evidence')),
        implication: status === 'OPEN'
          ? `Unresolved — do not pick a side. Needed: ${note || 'owner decision or more evidence'}. Current working note: ${stripMd(col(h, c, 'resolution'))}`
          : `Follow the resolution: ${stripMd(col(h, c, 'resolution'))}. Files corrected: ${stripMd(col(h, c, 'files corrected')) || '—'}`,
        source: `brain/context/contradiction-register.md · ${stripMd(col(h, c, 'evidence')).slice(0, 100)}`,
      };
    },
  },
  {
    name: 'evidence-ledger', file: 'brain/context/evidence-ledger.md', idRe: /^EV-[A-Z]\d{2}$/,
    map: (id, h, c, ctx) => {
      const conf = stripMd(col(h, c, 'confidence'));
      const tier = /^Verified-(RT|Code)/.test(conf) ? 'VERIFIED' : /^Verified-Owner/.test(conf) ? 'DOCUMENTED' : /^Inferred/.test(conf) ? 'INFERRED' : null;
      return {
        type: 'qa', status: tier ? 'VERIFIED' : 'NEEDS-REVALIDATION', evidence: tier || 'UNKNOWN', origin: /^Verified-Owner/.test(conf) ? 'user-statement' : 'qa',
        status_note: tier ? undefined : `label "${conf}" does not map (SCHEMA §evidence mapping)`,
        title: cut(stripMd(col(h, c, 'what it proves')), 110),
        what: `${stripMd(col(h, c, 'what it proves'))}${col(h, c, 'role') ? ` (role: ${stripMd(col(h, c, 'role'))})` : ''} — ${ctx.heading.replace(/^#+\s*/, '')}`,
        why: `Evidence that other notes cite by ${id}. Confidence label: ${conf}.`,
        evidenceText: stripMd(col(h, c, 'source')),
        implication: `Cite ${id} for this claim at tier ${tier || 'UNKNOWN'}. Re-check it when its source files change (FRESHNESS), and add a new row that supersedes it rather than editing it.`,
        source: `brain/context/evidence-ledger.md · ${stripMd(col(h, c, 'source')).slice(0, 120)}`,
        brainFile: stripMd(col(h, c, 'brain file')),
      };
    },
  },
];

/** Parse a register into template lines + rows. Rows keep their exact text. */
function parseRegister(reg, source) {
  const text = source !== undefined ? source : body(read(reg.file)).replace(/\s*$/, '\n');
  const lines = text.split('\n');
  let heading = ''; let header = null;
  const rows = [];
  const tpl = lines.map((line, i) => {
    if (/^#{1,4}\s/.test(line)) heading = line;
    if (/^<!-- memory-row: \S+ -->$/.test(line)) return line; // an already-migrated row keeps the table open
    if (!line.startsWith('|')) { header = null; return line; }
    if (/^\|\s*:?-{3}/.test(line)) return line;
    const cells = splitCells(line);
    const next = lines[i + 1] || '';
    if (/^\|\s*:?-{3}/.test(next)) { header = cells; return line; }
    const id = (stripMd(cells[0]).match(/^[A-Z]+(?:-[A-Z]+)*(?:-?\d+)?(?![\w-])/) || [])[0];
    if (!header || !id || !reg.idRe.test(id)) return line;
    rows.push({ id, line, cells, header, heading });
    return `<!-- memory-row: ${id} -->`;
  });
  return { text, tpl: tpl.join('\n'), rows };
}

const NOTICE = (reg) => `> [!info] Rendered from \`brain/memory/\` — edit the entries, not this table\n> Each ID row below is stored verbatim in its memory entry (\`node tools/memory.js context ${reg.name}\`). Prose outside the tables lives in \`brain/memory/_templates/${reg.name}.md\`. Rebuild: \`node tools/memory.js render\`.\n`;

function createRowEntry(reg, r) {
  const m = reg.map(r.id, r.header, r.cells, { heading: r.heading });
  const full = r.line;
  const fm = {
    id: newId('2026-09-17', `${reg.name}:${r.id}`), legacy_id: r.id, register: reg.name, type: m.type, status: m.status,
    status_note: m.status_note, evidence: m.evidence, source: m.source, origin: m.origin || 'migration', approver: m.approver,
    supersedes: [], superseded_by: [], features: featuresIn(full), flows: flowsIn(full), platforms: platformsIn(full),
    files: filesIn(full), relations: [], occurrences: '1',
    first_recorded: '≤2026-09-17 (row present at brain baseline 5d7214e)', last_verified: '≤2026-09-17',
    verified_against: m.evidence === 'VERIFIED' ? REG_BASE : 'not verified', labels: ['migrated', reg.name, ...(m.labels || [])],
  };
  for (const other of new Set((full.match(/\b(?:CR|KG|UI|EV|U|Q|BT)-[A-Z]*-?\d+\b/g) || []))) if (other !== r.id) fm.relations.push({ rel: 'RELATED_TO', to: other });
  fm.relations = fm.relations.slice(0, 10);
  const e = { fm, title: `${r.id} — ${m.title || 'untitled'}`, what: m.what, why: m.why, evidenceText: m.evidenceText,
    implication: m.implication, row: r.line, related: `- Register: \`${reg.file}\` (${stripMd(r.heading.replace(/^#+/, '')) || 'table'})${m.brainFile ? `\n- Brain file: ${m.brainFile}` : ''}` };
  saveEntry(e);
}

function migrate(which, opts) {
  const regs = which === 'all' ? REGISTERS : REGISTERS.filter((r) => r.name === which);
  if (!regs.length) throw new Error(`unknown register ${which}`);
  const report = [];
  for (const reg of regs) {
    if (exists(`${TPL}/${reg.name}.md`)) {
      // Incremental: rows still sitting in the template as plain text (e.g. an ID the first pass did not recognise).
      const before = renderOne(reg);
      const { tpl: tpl2, rows: left } = parseRegister(reg, read(`${TPL}/${reg.name}.md`));
      if (!left.length) { report.push(`${reg.name}: already migrated — no-op`); continue; }
      for (const r of left) createRowEntry(reg, r);
      put(`${TPL}/${reg.name}.md`, tpl2);
      if (renderOne(reg) !== before) throw new Error(`${reg.name}: ROUND-TRIP FAILED after incremental migration`);
      report.push(`${reg.name}: ${left.length} remaining row(s) → entries (${left.map((r) => r.id).join(', ')}); round-trip OK`);
      continue;
    }
    const dirty = git('.', ['status', '--porcelain', '--', reg.file]);
    if (dirty && !opts.allowDirty) { report.push(`${reg.name}: STOPPED — ${reg.file} has uncommitted changes (use --allow-dirty only when every change is logged)`); continue; }
    const { text, tpl, rows } = parseRegister(reg);
    const seen = new Set();
    const existing = new Map(listEntries().filter((e) => e.fm.register === reg.name).map((e) => [e.fm.legacy_id, e]));
    let created = 0;
    for (const r of rows) {
      if (seen.has(r.id)) throw new Error(`${reg.name}: duplicate row id ${r.id}`);
      seen.add(r.id);
      if (existing.has(r.id)) continue;
      createRowEntry(reg, r);
      created++;
    }
    // template + notice; the register itself must render back byte-identical apart from the notice
    const withNotice = tpl.replace(/^(# .+\n)/m, `$1\n${NOTICE(reg)}`);
    put(`${TPL}/${reg.name}.md`, withNotice);
    report.push(`${reg.name}: ${rows.length} rows → ${created} new entries`);
    const rendered = renderOne(reg);
    const expected = text.replace(/^(# .+\n)/m, `$1\n${NOTICE(reg)}`);
    if (rendered !== expected) throw new Error(`${reg.name}: ROUND-TRIP FAILED — rendered register differs from the original`);
    report.push(`${reg.name}: round-trip OK (rendered == original + notice, ${rows.length} rows)`);
    putOwned(reg.file, rendered);
  }
  return report;
}

function renderOne(reg) {
  const tpl = read(`${TPL}/${reg.name}.md`);
  const byLegacy = new Map(listEntries().filter((e) => e.fm.register === reg.name).map((e) => [e.fm.legacy_id, e]));
  return tpl.replace(/^<!-- memory-row: (\S+) -->$/gm, (all, id) => {
    const e = byLegacy.get(id);
    if (!e || e.row == null) throw new Error(`${reg.name}: no entry holds row ${id}`);
    return e.row;
  });
}
function render() {
  const out = [];
  for (const reg of REGISTERS) {
    if (!exists(`${TPL}/${reg.name}.md`)) { out.push(`${reg.name}: not migrated`); continue; }
    const changed = putOwned(reg.file, renderOne(reg));
    out.push(`${reg.name}: ${changed ? (CHECK ? 'STALE' : 'rendered') : 'current'}`);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ index facts
function indexFacts() {
  const idx = read('brain/audits/data/brain-index.json');
  const facts = { featureOfCode: new Map(), features: new Map() };
  if (!idx) return facts;
  const j = JSON.parse(idx);
  const byId = new Map(j.nodes.map((n) => [n.id, n]));
  const fid = (n) => (n && n.g === 'flow' && /^id:F\d{2}$/.test(n.id) ? n.id.slice(3) : null);
  for (const n of j.nodes) if (fid(n)) facts.features.set(fid(n), { name: n.t || n.l, crit: n.c || '' });
  for (const [s, t2] of j.links) {
    const a = byId.get(s); const b = byId.get(t2);
    for (const [code, flow] of [[a, b], [b, a]]) {
      if (code && code.g === 'code' && code.p && fid(flow)) {
        const k = `${code.a || 'mobile'}/${code.p}`;
        if (!facts.featureOfCode.has(k)) facts.featureOfCode.set(k, new Set());
        facts.featureOfCode.get(k).add(fid(flow));
      }
    }
  }
  // flows.md is the authority for criticality
  for (const l of read('brain/context/flows.md').split('\n')) {
    const m = l.match(/^\|\s*\**(F\d{2})\**\s+([^|]+?)\s*\|\s*\**(BLOCKER|HIGH|MEDIUM|LOW)\**[^|]*\|/);
    if (m) facts.features.set(m[1], { name: m[2].trim(), crit: m[3] });
  }
  return facts;
}

// ------------------------------------------------------------------------------------------------ git seeding
const REPOS = { mobile: 'repos/mobile', web: 'repos/web' };
const SOURCE_RE = /^(App\/|app\/|resources\/|routes\/|database\/|config\/|android\/app\/src|ios\/TerriTool\/|__tests__\/|tests\/|\.maestro\/|public\/js\/[^/]+\.js$)/;
const TRIVIAL_MSG = /^(wip|\.|update|updates|changes|minor|test)$/i;
function commitsOf(repoKey, range) {
  const out = git(REPOS[repoKey], ['log', '--no-merges', '--format=%H%x1f%ad%x1f%an%x1f%s', '--date=short', '--name-only', ...range]);
  if (out == null) return null;
  const commits = [];
  let cur = null;
  for (const line of out.split('\n')) {
    if (line.includes('\x1f')) { const [sha, date, author, subject] = line.split('\x1f'); cur = { sha, date, author, subject, files: [] }; commits.push(cur); }
    else if (line.trim() && cur) cur.files.push(line.trim());
  }
  return commits;
}
function classifyCommit(c) {
  const s = c.subject.toLowerCase();
  if (/^revert\b/.test(s)) return 'failed-approach';
  if (/\b(fix|fixed|fixes|solve|solved|resolve|resolved|issue|bug|crash|error)\b/.test(s)) return 'fix';
  return 'change';
}
/** Files that still exist are cited; files moved or deleted since are marked historical (not a dead citation). */
function commitRelated(repoKey, files, short) {
  return files.slice(0, 12).map((f) => (exists(`${REPOS[repoKey]}/${f}`)
    ? `- \`${REPOS[repoKey]}/${f}\``
    : `- ${REPOS[repoKey]}/${f} — historical path at ${repoKey}@${short}; no longer at HEAD (trace: git -C ${REPOS[repoKey]} log --follow --oneline -- ${f})`)).join('\n') || '—';
}
function refreshCommitRelated() {
  let n = 0;
  for (const e of listEntries().filter((x) => x.fm.origin === 'manual-commit' && (x.fm.commits || []).length)) {
    const [repoKey, short] = e.fm.commits[0].split('@');
    const rel = (e.fm.files || []).map((f) => f.replace(`${REPOS[repoKey]}/`, ''));
    const next = commitRelated(repoKey, rel, short);
    if (next !== e.related) { e.related = next; if (saveEntry(e)) n++; }
  }
  return n;
}
function seedCommits(repoKey, commits, facts) {
  let created = 0; let skipped = 0;
  const existing = new Set(listEntries().filter((e) => e.fm.commits && e.fm.commits.length).flatMap((e) => e.fm.commits));
  for (const c of commits) {
    const src = c.files.filter((f) => SOURCE_RE.test(f));
    const short = c.sha.slice(0, repoKey === 'web' ? 8 : 7);
    if (existing.has(`${repoKey}@${short}`)) continue;
    if (!src.length || TRIVIAL_MSG.test(c.subject.trim())) { skipped++; continue; } // non-trigger: no source files / no message
    const feats = new Set();
    for (const f of src) for (const x of facts.featureOfCode.get(`${repoKey}/${f}`) || []) feats.add(x);
    const type = classifyCommit(c);
    const featList = [...feats].sort();
    const crit = featList.map((f) => (facts.features.get(f) || {}).crit).filter(Boolean);
    const fm = {
      id: newId(c.date, `commit:${repoKey}:${c.sha}`), type, status: 'HISTORICAL', evidence: 'DOCUMENTED',
      source: `git ${repoKey}@${short} (commit message + file list)`, origin: 'manual-commit',
      supersedes: [], superseded_by: [], features: featList, flows: [], platforms: [repoKey === 'mobile' ? 'mobile' : 'web'],
      files: src.slice(0, 12).map((f) => `${REPOS[repoKey]}/${f}`), commits: [`${repoKey}@${short}`], relations: [], occurrences: '1',
      first_recorded: c.date, last_verified: c.date, verified_against: `${repoKey}@${short}`, labels: ['git-seed', repoKey],
    };
    const e = {
      fm, title: `${repoKey} ${short} — ${cut(c.subject.trim(), 90)}`,
      what: `Commit \`${short}\` on ${c.date} by ${c.author === 'Rahul Singh' || c.author === 'Dhruv Dave' || c.author === 'Mehul' ? 'a team developer' : 'a contributor'}: "${c.subject.trim()}". ${src.length} source file(s) changed${c.files.length > src.length ? ` (${c.files.length - src.length} non-source file(s) ignored)` : ''}.`,
      why: featList.length ? `Touches ${featList.map((f) => `${f} ${(facts.features.get(f) || {}).name || ''}`.trim()).join(', ')}${crit.length ? ` (criticality ${[...new Set(crit)].join('/')})` : ''}.` : 'No feature mapping in the brain index for these files (the change may be infrastructure, or the index lacks the file).',
      evidenceText: `\`git -C ${REPOS[repoKey]} show --stat ${short}\` — the commit message is the only statement of intent (DOCUMENTED, not VERIFIED).`,
      implication: type === 'failed-approach'
        ? 'A reverted approach: before retrying anything similar in these files, read the reverted commit and say why the new attempt differs.'
        : featList.length
          ? `When these files change again, re-verify ${featList.join(', ')} (\`node tools/memory.js impact <file>\`). ${type === 'fix' ? 'This was a fix: a regression here is a repeat, so look for it in known-fragile before patching.' : ''}`.trim()
          : 'Map these files to a feature in the brain index before relying on this change for impact analysis.',
      related: commitRelated(repoKey, src, short),
      row: null,
    };
    saveEntry(e);
    existing.add(`${repoKey}@${short}`);
    created++;
  }
  return { created, skipped };
}

// ------------------------------------------------------------------------------------------------ sync
const SYNC_BLOCK = /```json sync-state\n([\s\S]*?)\n```/;
function readSyncState() {
  const m = read(`${MEM}/LAST-SYNC.md`).match(SYNC_BLOCK);
  return m ? JSON.parse(m[1]) : null;
}
function envPointers() {
  const cfg = read('repos/mobile/App/config/index.js');
  const active = (cfg.match(/^export const URL_BASE\s*=\s*'([^']+)'/m) || [])[1] || null;
  const urls = (p) => [...new Set((read(p).match(/https?:\/\/[a-z0-9.-]*territool\.com[^"'\s]*/g) || []))].sort();
  return {
    'mobile.URL_BASE': active,
    'web/.codex/config.toml': urls('repos/web/.codex/config.toml'),
    'web/.cursor/mcp.json': urls('repos/web/.cursor/mcp.json'),
  };
}
const isProd = (v) => (Array.isArray(v) ? v : [v]).some((x) => /app\.territool\.com/.test(String(x)));

function sync() {
  const facts = indexFacts();
  const prev = readSyncState() || { baselines: { mobile: 'f20c5aa', web: '21d6348c' }, pointers: {} };
  const state = { at: new Date().toISOString(), baselines: {}, heads: {}, behind: {}, pointers: envPointers(), result: 'COMPLETE', notes: [] };
  const lines = [];
  let seeded = 0;
  for (const [k, repo] of Object.entries(REPOS)) {
    const head = git(repo, ['rev-parse', '--short=8', 'HEAD']);
    if (!head) { state.result = 'PARTIAL'; state.notes.push(`${k}: repo not readable`); continue; }
    const base = prev.heads && prev.heads[k] ? prev.heads[k] : prev.baselines[k];
    const commits = commitsOf(k, [`${base}..HEAD`]) || [];
    state.behind[k] = commits.length;
    const r = seedCommits(k, commits, facts);
    seeded += r.created;
    state.baselines[k] = base; state.heads[k] = head;
    const wt = (git(repo, ['status', '--porcelain']) || '').split('\n').filter(Boolean);
    lines.push(`## ${k} (${repo})`, '', `- Baseline \`${base}\` → HEAD \`${head}\`: ${commits.length} new commit(s), ${r.created} captured, ${r.skipped} non-trigger.`);
    if (wt.length) {
      lines.push(`- **Working tree: ${wt.length} uncommitted change(s) — classified NEEDS-VERIFICATION, not ingested (Law 6).**`, '', '| Status | Path | Known to memory? |', '|---|---|---|');
      const all = listEntries();
      for (const w of wt) {
        const p = w.slice(3);
        const known = all.filter((e) => (e.fm.files || []).some((f) => f.endsWith(p))).map((e) => e.fm.id).slice(0, 3);
        lines.push(`| \`${w.slice(0, 2).trim() || '?'}\` | \`${p}\` | ${known.length ? known.join(', ') : 'NEW+UNDOCUMENTED'} |`);
      }
    } else lines.push('- Working tree clean.');
    lines.push('');
  }
  // environment pointers → one environment entry per distinct value (idempotent)
  lines.push('## Environment pointers', '', '| Pointer | Value now | Production? | Changed since last sync? |', '|---|---|---|---|');
  for (const [k, v] of Object.entries(state.pointers)) {
    const was = prev.pointers ? prev.pointers[k] : undefined;
    const changed = was !== undefined && JSON.stringify(was) !== JSON.stringify(v);
    lines.push(`| ${k} | ${Array.isArray(v) ? v.map((x) => `\`${x}\``).join('<br>') : `\`${v}\``} | ${isProd(v) ? '**YES**' : 'no'} | ${was === undefined ? 'first record' : changed ? '**CHANGED**' : 'no'} |`);
    if (isProd(v)) {
      const key = `env:${k}:${JSON.stringify(v)}`;
      const id = newId(TODAY, key);
      if (!listEntries().some((e) => e.fm.id === id)) {
        saveEntry({ fm: { id, type: 'environment', status: 'NEEDS-VERIFICATION', evidence: 'VERIFIED', source: `${k === 'mobile.URL_BASE' ? 'repos/mobile/App/config/index.js' : `repos/${k}`} (read by memory sync ${TODAY})`, origin: 'audit',
          supersedes: [], superseded_by: [], features: [], flows: [], platforms: [k.startsWith('mobile') ? 'mobile' : 'integration'],
          files: [k === 'mobile.URL_BASE' ? 'repos/mobile/App/config/index.js' : `repos/${k}`], relations: [{ rel: 'RELATED_TO', to: 'VAULT-20260917-ef8968' }],
          occurrences: '1', first_recorded: TODAY, last_verified: TODAY, verified_against: 'working tree', labels: ['production-pointer'] },
        title: `Production pointer active: ${k}`,
        what: `\`${k}\` currently holds a production value: ${(Array.isArray(v) ? v : [v]).filter((x) => /app\.territool/.test(x)).map((x) => `\`${x}\``).join(', ')}.`,
        why: 'S0.1: nothing the brain runs may reach production. A running Metro / an opened Codex or Cursor session follows this pointer.',
        evidenceText: 'Read directly from the file by `node tools/memory.js sync` (URLs only).',
        implication: 'Until this changes: LOOP INTAKE blocks any task that runs the mobile app (mobile pointer) or opens Codex/Cursor in repos/web (MCP pointer). Do not edit the owner\'s file (Law 6); report and wait.',
        related: '- Incident `VAULT-20260917-ef8968`\n- `brain/context/tooling.md` §3', row: null });
        seeded++;
      }
    }
    if (changed) state.notes.push(`pointer ${k} changed`);
  }
  lines.push('');
  // freshness
  const fresh = freshness(state);
  const stale = fresh.filter((f) => f.kind === 'committed');
  for (const f of stale) {
    const e = f.entry;
    // An OPEN entry (incident, conflict, question) stays OPEN: moving it out would hide that it is still
    // unresolved. The change is recorded in its history instead, once per reason.
    if (e.fm.status === 'OPEN') {
      const note = `- ${TODAY}: still OPEN; revalidate (${f.why})`;
      if (!(e.statusHistory || '').includes(`(${f.why})`)) { e.statusHistory = `${e.statusHistory ? `${e.statusHistory}\n` : ''}${note}`; saveEntry(e); }
      continue;
    }
    if (!['NEEDS-REVALIDATION', 'SUPERSEDED', 'HISTORICAL', 'RESOLVED', 'DEPRECATED'].includes(e.fm.status)) {
      e.statusHistory = `${e.statusHistory ? `${e.statusHistory}\n` : ''}- ${TODAY}: ${e.fm.status} → NEEDS-REVALIDATION (${f.why})`;
      e.fm.status = 'NEEDS-REVALIDATION';
      saveEntry(e);
    }
  }
  state.freshness = { committed: stale.length, workingTree: fresh.filter((f) => f.kind === 'working-tree').length };
  if (!CHECK) {
    putOwned(`${MEM}/LAST-SYNC.md`, lastSyncDoc(state));
    putOwned(`${GEN}/CHANGES.md`, genHeader('CHANGES', 'What changed in the repos since the last sync, and how memory classified it.') + lines.join('\n'));
  }
  return { state, seeded };
}
function lastSyncDoc(s) {
  return [
    '---', 'area: memory', '---', '', '# LAST-SYNC — when memory last reconciled with the repos', '',
    `**Result: ${s.result}** · ${s.at} · written by \`node tools/memory.js sync\` (never by hand).`, '',
    '| Repo | Baseline used | HEAD recorded | Commits since baseline |', '|---|---|---|---|',
    ...Object.keys(REPOS).map((k) => `| ${k} | \`${s.baselines[k] || '—'}\` | \`${s.heads[k] || '—'}\` | ${s.behind[k] ?? '—'} |`), '',
    `Freshness: ${s.freshness ? `${s.freshness.committed} entr(ies) outdated by later commits · ${s.freshness.workingTree} touched by uncommitted work` : 'not computed'}.`,
    s.notes.length ? `Notes: ${s.notes.join('; ')}.` : 'Notes: none.', '',
    '**Honest limit:** memory is reconciled only when this command runs (loop INTAKE, `/memory-sync`, or the Stop hook). Nothing watches the repos in between.', '',
    '```json sync-state', JSON.stringify(s, null, 2), '```', '',
  ].join('\n');
}
function freshness(state) {
  const out = [];
  const heads = state.heads;
  const wt = {};
  for (const [k, repo] of Object.entries(REPOS)) wt[k] = new Set((git(repo, ['status', '--porcelain']) || '').split('\n').filter(Boolean).map((l) => l.slice(3)));
  const logCache = new Map();
  for (const e of listEntries()) {
    // A historical record (a commit, a past run) states what happened then; later commits cannot make it stale.
    if (['HISTORICAL', 'SUPERSEDED'].includes(e.fm.status)) continue;
    const va = String(e.fm.verified_against || '');
    for (const f of e.fm.files || []) {
      const m = f.match(/^repos\/(mobile|web)\/(.+)$/);
      if (!m) continue;
      const [, k, rel] = m;
      if (wt[k] && wt[k].has(rel)) out.push({ entry: e, kind: 'working-tree', file: f, why: 'uncommitted change in the working tree' });
      const sha = (va.match(new RegExp(`${k}(?:@| )([0-9a-f]{7,})`)) || [])[1];
      if (!sha || !heads[k] || sha.startsWith(heads[k]) || heads[k].startsWith(sha)) continue;
      const key = `${k}:${sha}:${rel}`;
      if (!logCache.has(key)) logCache.set(key, git(REPOS[k], ['log', '--format=%h', `${sha}..HEAD`, '--', rel]) || '');
      const later = logCache.get(key);
      if (later) out.push({ entry: e, kind: 'committed', file: f, why: `${rel} changed in ${later.split('\n').length} commit(s) after ${sha}` });
    }
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ generated views
const genHeader = (name, what) => `---\narea: memory\n---\n\n# ${name}\n\n> Generated by \`node tools/memory.js\` — never edit. ${what}\n\n`;
const link = (e) => `[${e.fm.id}](../${path.relative(MEM, e.file)})`;
const short = (e) => cut(e.title.replace(/^[A-Z]+(?:-[A-Z]+)?-?\d+ — /, (m) => m), 90);
function reindex() {
  const all = listEntries();
  const facts = indexFacts();
  const live = all.filter((e) => !['SUPERSEDED'].includes(e.fm.status));
  const archived = [];
  const byType = {};
  for (const e of live) (byType[e.fm.type] = byType[e.fm.type] || []).push(e);
  const count = (arr, k) => arr.reduce((m, e) => { const v = e.fm[k] || '—'; m[v] = (m[v] || 0) + 1; return m; }, {});
  const tbl = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ');

  // INDEX
  const idx = [genHeader('INDEX', 'Every live entry, one line each. Load HOT + matched entries, never this whole file.'),
    `**${live.length} live entries** (${all.length - live.length} superseded, ${archived.length} archived).`, '',
    `By type: ${tbl(count(live, 'type'))}`, '', `By status: ${tbl(count(live, 'status'))}`, '', `By evidence: ${tbl(count(live, 'evidence'))}`, ''];
  for (const t of TYPES.filter((x) => byType[x])) {
    idx.push(`## ${t} (${byType[t].length})`, '', '| ID | Legacy | Status | Title | Features | Occ | Verified |', '|---|---|---|---|---|---|---|');
    for (const e of byType[t]) idx.push(`| ${link(e)} | ${e.fm.legacy_id || ''} | ${e.fm.status} | ${short(e).replace(/\|/g, '\\|')} | ${(e.fm.features || []).join(' ')} | ${e.fm.occurrences} | ${e.fm.last_verified} |`);
    idx.push('');
  }
  putOwned(`${GEN}/INDEX.md`, idx.join('\n'));

  // HOT: what matters now
  const critOf = (e) => Math.max(0, ...(e.fm.features || []).map((f) => CRIT_WEIGHT[(facts.features.get(f) || {}).crit] || 0));
  const score = (e) => (e.fm.type === 'incident' && e.fm.status === 'OPEN' ? 100 : 0)
    + (e.fm.status === 'NEEDS-VERIFICATION' ? 60 : 0)
    + (e.fm.type === 'conflict' && e.fm.status === 'OPEN' ? 50 : 0)
    + (e.fm.type === 'question' && e.fm.status === 'OPEN' && e.fm.register === 'open-questions' ? 45 : 0)
    + (e.fm.type === 'decision' && e.fm.status === 'CURRENT' ? 30 : 0)
    + (e.fm.status === 'NEEDS-REVALIDATION' ? 25 : 0)
    + ((e.fm.labels || []).includes('security') && e.fm.status === 'OPEN' ? 20 : 0)
    + (Number(e.fm.occurrences) || 1) * 5 + critOf(e) * 3
    + (String(e.fm.first_recorded) >= '2026-09-10' && e.fm.origin !== 'manual-commit' ? 5 : 0);
  const hot = live.filter((e) => e.fm.status !== 'HISTORICAL').sort((a, b) => score(b) - score(a) || a.fm.id.localeCompare(b.fm.id)).slice(0, 30);
  putOwned(`${GEN}/HOT.md`, [genHeader('HOT', 'The ~30 entries that matter right now. Every task loads this first.'),
    'Ranking: open incidents › needs-verification › open conflicts › open owner questions › current decisions › needs-revalidation › open security findings, then occurrences × feature criticality.', '',
    '| # | ID | Type | Status | Title |', '|---|---|---|---|---|',
    ...hot.map((e, i) => `| ${i + 1} | ${link(e)} | ${e.fm.type} | ${e.fm.status} | ${short(e).replace(/\|/g, '\\|')} |`), ''].join('\n'));

  // BY-FEATURE
  const feats = [...facts.features.keys()].sort();
  const bf = [genHeader('BY-FEATURE', 'Per feature: links to its entries by type. A view — the facts live in the entries.')];
  for (const f of feats) {
    const es = live.filter((e) => (e.fm.features || []).includes(f));
    const info = facts.features.get(f);
    bf.push(`## ${f} ${info.name} · ${info.crit || '—'} · ${es.length} entr${es.length === 1 ? 'y' : 'ies'}`, '');
    if (!es.length) { bf.push('- **No entries.** Gap: see GAPS.md.', ''); continue; }
    const g = {};
    for (const e of es) (g[e.fm.type] = g[e.fm.type] || []).push(e);
    for (const t of TYPES.filter((x) => g[x])) bf.push(`- **${t}** (${g[t].length}): ${g[t].slice(0, 15).map((e) => `${link(e)}${e.fm.legacy_id ? ` ${e.fm.legacy_id}` : ''}`).join(' · ')}${g[t].length > 15 ? ` · +${g[t].length - 15} more` : ''}`);
    bf.push('');
  }
  putOwned(`${GEN}/BY-FEATURE.md`, bf.join('\n'));

  // BY-FLOW
  const flowIds = [...new Set(live.flatMap((e) => e.fm.flows || []))].sort();
  putOwned(`${GEN}/BY-FLOW.md`, [genHeader('BY-FLOW', 'Per app journey (MF-xx).'),
    flowIds.length ? '' : 'No entry names an app journey yet (MF-xx). Journeys are reached through their features in BY-FEATURE.md.', '',
    ...flowIds.map((fl) => `- **${fl}**: ${live.filter((e) => (e.fm.flows || []).includes(fl)).map(link).join(' · ')}`), ''].join('\n'));

  // BY-PLATFORM
  const plats = ['mobile', 'web', 'backend', 'db', 'api', 'integration'];
  putOwned(`${GEN}/BY-PLATFORM.md`, [genHeader('BY-PLATFORM', 'Counts per platform and type.'),
    '| Platform | Entries | By type |', '|---|---|---|',
    ...plats.map((p) => { const es = live.filter((e) => (e.fm.platforms || []).includes(p)); return `| ${p} | ${es.length} | ${tbl(count(es, 'type'))} |`; }), ''].join('\n'));

  // KNOWLEDGE-GRAPH
  const rels = live.flatMap((e) => (e.fm.relations || []).map((r) => [e, r]));
  putOwned(`${GEN}/KNOWLEDGE-GRAPH.md`, [genHeader('KNOWLEDGE-GRAPH', 'Typed relations between entries and brain IDs. The visual graph is the brain index (Obsidian / shared page).'),
    `${rels.length} relations.`, '', '| From | Relation | To |', '|---|---|---|',
    ...rels.slice(0, 600).map(([e, r]) => `| ${link(e)} | ${r.rel} | ${r.to} |`), rels.length > 600 ? `\n… ${rels.length - 600} more (see entries).` : '', ''].join('\n'));

  // COVERAGE
  const impl = live.filter((e) => e.implication && e.implication.trim().length > 10).length;
  const cov = [genHeader('COVERAGE', 'How much of the product and the registers memory holds. Counts only.'),
    `- Live entries: **${live.length}**; with a non-empty implication: **${impl}** (${pct(impl, live.length)}).`,
    `- Evidence: ${tbl(count(live, 'evidence'))}.`,
    `- Registers migrated: **${REGISTERS.filter((r) => exists(`${TPL}/${r.name}.md`)).length} / ${REGISTERS.length}**.`,
    `- Features with ≥1 non-commit entry: **${feats.filter((f) => live.some((e) => e.fm.origin !== 'manual-commit' && (e.fm.features || []).includes(f))).length} / ${feats.length}**.`,
    `- Commit capture (last 90 days): ${captureRate().map((c) => `${c.repo} ${c.captured}/${c.total} (${pct(c.captured, c.total)})`).join(' · ')}.`, '',
    '| Feature | Crit | Entries (non-commit) | Commit entries | Types |', '|---|---|---|---|---|',
    ...feats.map((f) => { const es = live.filter((e) => (e.fm.features || []).includes(f)); const nc = es.filter((e) => e.fm.origin !== 'manual-commit'); return `| ${f} | ${(facts.features.get(f) || {}).crit || '—'} | ${nc.length} | ${es.length - nc.length} | ${Object.keys(count(nc, 'type')).join(', ') || '—'} |`; }), ''];
  putOwned(`${GEN}/COVERAGE.md`, cov.join('\n'));

  // FRESHNESS
  const st = readSyncState() || { heads: {} };
  const fr = freshness({ heads: st.heads || {} });
  putOwned(`${GEN}/FRESHNESS.md`, [genHeader('FRESHNESS', 'Entries whose files changed after the commit they were verified against, ranked by feature criticality.'),
    `Computed against LAST-SYNC heads: ${Object.entries(st.heads || {}).map(([k, v]) => `${k} \`${v}\``).join(' · ') || 'none yet'}.`, '',
    `**Outdated by later commits: ${fr.filter((x) => x.kind === 'committed').length}** · touched by uncommitted work: ${fr.filter((x) => x.kind === 'working-tree').length}`, '',
    '| Kind | Entry | Crit | File | Why |', '|---|---|---|---|---|',
    ...fr.sort((a, b) => critOf(b.entry) - critOf(a.entry)).slice(0, 200).map((x) => `| ${x.kind} | ${link(x.entry)} | ${critOf(x.entry) || '—'} | \`${x.file}\` | ${x.why} |`), ''].join('\n'));

  // CONFLICTS
  const conf = live.filter((e) => e.fm.type === 'conflict');
  putOwned(`${GEN}/CONFLICTS.md`, [genHeader('CONFLICTS', 'Where sources disagree. Resolved ones stay listed (history).'),
    `**Open: ${conf.filter((e) => e.fm.status === 'OPEN').length}** · resolved: ${conf.filter((e) => e.fm.status === 'RESOLVED').length}`, '',
    '| ID | Legacy | Status | Note | Title |', '|---|---|---|---|---|',
    ...conf.sort((a, b) => (a.fm.status === 'OPEN' ? -1 : 1) - (b.fm.status === 'OPEN' ? -1 : 1)).map((e) => `| ${link(e)} | ${e.fm.legacy_id || ''} | ${e.fm.status} | ${e.fm.status_note || ''} | ${short(e).replace(/\|/g, '\\|')} |`), ''].join('\n'));

  // GAPS
  const openQ = live.filter((e) => e.fm.type === 'question' && e.fm.status === 'OPEN');
  const noFeat = feats.filter((f) => !live.some((e) => e.fm.origin !== 'manual-commit' && (e.fm.features || []).includes(f)));
  const nv = live.filter((e) => ['NEEDS-VERIFICATION', 'NEEDS-REVALIDATION'].includes(e.fm.status));
  putOwned(`${GEN}/GAPS.md`, [genHeader('GAPS', 'One maintained list of what memory does not know.'),
    `## Open questions (${openQ.length})`, '', ...openQ.map((e) => `- ${link(e)} ${e.fm.legacy_id || ''} — ${short(e)}`), '',
    `## Needs verification / revalidation (${nv.length})`, '', ...nv.map((e) => `- ${link(e)} (${e.fm.status}) — ${short(e)}`), '',
    `## Features with no knowledge entry beyond commits (${noFeat.length})`, '', ...noFeat.map((f) => `- ${f} ${(facts.features.get(f) || {}).name}`), '',
    `## Commit entries touching files the brain index does not map to a feature (${live.filter((e) => e.fm.origin === 'manual-commit' && !(e.fm.features || []).length).length})`, '',
    'These commits changed code the dependency graphs do not cover (new modules, config, tests). Map the files in the brain index before relying on them for impact analysis.', '',
    `## Entries without an implication (${live.length - impl})`, '', ...live.filter((e) => !(e.implication && e.implication.trim().length > 10)).map((e) => `- ${link(e)}`), ''].join('\n'));

  // ORPHANS
  const orphans = [];
  for (const e of live) {
    for (const f of e.fm.files || []) {
      const p = f.startsWith('repos/') || f.startsWith('brain/') || f.startsWith('workspace/') || f.startsWith('tools/') || f.startsWith('shoebox/') ? f : null;
      if (p && !/[{}*]/.test(p) && !exists(p)) orphans.push([e, f, e.fm.status === 'HISTORICAL' ? 'historical path: moved or deleted after that commit (record stays valid)' : 'file no longer exists — reclassify the entry (STALE / BROKEN-REFERENCE / supersede)']);
    }
    if (!(e.fm.features || []).length && !(e.fm.files || []).length && !(e.fm.relations || []).length && !e.fm.legacy_id) orphans.push([e, '—', 'no feature, file, relation or legacy id']);
  }
  putOwned(`${GEN}/ORPHANS.md`, [genHeader('ORPHANS', 'Knowledge pointing at things that no longer exist. Reclassify, never delete.'),
    `**${orphans.length}** finding(s).`, '', '| Entry | Reference | Problem |', '|---|---|---|',
    ...orphans.map(([e, f, w]) => `| ${link(e)} | \`${f}\` | ${w} |`), ''].join('\n'));

  // SUPERSESSION-MAP
  const byId = new Map(all.map((e) => [e.fm.id, e]));
  const chains = all.filter((e) => (e.fm.superseded_by || []).length || (e.fm.supersedes || []).length);
  const broken = [];
  for (const e of chains) {
    for (const s of e.fm.superseded_by || []) if (!byId.has(s) || !(byId.get(s).fm.supersedes || []).includes(e.fm.id)) broken.push(`${e.fm.id} → ${s}`);
    for (const s of e.fm.supersedes || []) if (!byId.has(s) || !(byId.get(s).fm.superseded_by || []).includes(e.fm.id)) broken.push(`${s} ← ${e.fm.id}`);
  }
  putOwned(`${GEN}/SUPERSESSION-MAP.md`, [genHeader('SUPERSESSION-MAP', 'Old → new chains. A broken chain is a lint failure.'),
    `${chains.length} entr(ies) in chains · **broken: ${broken.length}**`, '',
    ...all.filter((e) => (e.fm.superseded_by || []).length).map((e) => `- ${link(e)} → ${(e.fm.superseded_by || []).join(', ')}`),
    ...broken.map((b) => `- BROKEN: ${b}`), ''].join('\n'));
  return { live: live.length, hot: hot.length };
}
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');
function captureRate(since = '2026-06-19') {
  const captured = new Set(listEntries().flatMap((e) => e.fm.commits || []));
  return Object.entries(REPOS).map(([k, repo]) => {
    const shas = (git(repo, ['rev-list', '--no-merges', `--since=${since}`, 'HEAD']) || '').split('\n').filter(Boolean);
    const n = shas.filter((s) => captured.has(`${k}@${s.slice(0, k === 'web' ? 8 : 7)}`)).length;
    // commits that are non-triggers (no source files) count as handled
    let nonTrigger = 0;
    for (const s of shas) {
      if (captured.has(`${k}@${s.slice(0, k === 'web' ? 8 : 7)}`)) continue;
      const files = (git(repo, ['show', '--name-only', '--format=', s]) || '').split('\n').filter(Boolean);
      if (!files.some((f) => SOURCE_RE.test(f))) nonTrigger++;
    }
    return { repo: k, total: shas.length, captured: n, nonTrigger };
  });
}

// ------------------------------------------------------------------------------------------------ lint
const SECRET_RES = [
  [/eyJ[\w-]{15,}\.[\w-]{10,}\.[\w-]{5,}/, 'JWT'], [/AKIA[0-9A-Z]{16}/, 'AWS key'], [/-----BEGIN [A-Z ]*PRIVATE KEY/, 'private key'],
  [/\bsk-[A-Za-z0-9]{20,}/, 'API key'], [/AIza[0-9A-Za-z_-]{35}/, 'Google key'], [/password\s*[:=]\s*['"][^'"]{4,}['"]/i, 'password value'],
  [/[A-Za-z0-9._%+-]+@(?!example\.invalid)[A-Za-z0-9-]+\.[A-Za-z.]{2,}/, 'email address'],
];
let EVIDENCE_FILES = null;
function evidenceFiles() {
  if (EVIDENCE_FILES) return EVIDENCE_FILES;
  EVIDENCE_FILES = new Set();
  const walk = (d) => {
    if (!exists(d)) return;
    for (const e of fs.readdirSync(abs(d), { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== 'node_modules') walk(`${d}/${e.name}`); } else EVIDENCE_FILES.add(e.name);
    }
  };
  for (const d of ['workspace/qa-evidence', 'workspace/test-suites', 'brain/audits/data', 'workspace/loop']) walk(d);
  return EVIDENCE_FILES;
}
function lint() {
  const all = listEntries();
  const errs = []; const warns = [];
  const ids = new Map(); const legacy = new Map();
  for (const e of all) {
    const f = e.fm; const at = e.file;
    for (const k of ['id', 'type', 'status', 'evidence', 'source', 'origin', 'first_recorded', 'last_verified', 'verified_against']) if (!f[k]) errs.push(`${at}: missing ${k}`);
    if (f.id && !/^VAULT-\d{8}-[0-9a-f]{6}$/.test(f.id)) errs.push(`${at}: bad id ${f.id}`);
    if (f.id && !path.basename(at).includes(f.id.slice(-6))) errs.push(`${at}: filename does not carry the id hash`);
    if (f.type && !TYPES.includes(f.type)) errs.push(`${at}: unknown type ${f.type}`);
    if (f.type && !at.includes(`/entries/${f.type}/`)) errs.push(`${at}: stored under the wrong type folder`);
    if (f.status && !STATUSES.includes(f.status)) errs.push(`${at}: unknown status ${f.status}`);
    if (f.evidence && !EVIDENCE.includes(f.evidence)) errs.push(`${at}: unknown evidence ${f.evidence}`);
    if (f.origin && !ORIGINS.includes(f.origin)) errs.push(`${at}: unknown origin ${f.origin}`);
    for (const r of f.relations || []) if (!RELATIONS.includes(r.rel)) errs.push(`${at}: unknown relation ${r.rel}`);
    if (ids.has(f.id)) errs.push(`${at}: duplicate id ${f.id} (also ${ids.get(f.id)})`); else ids.set(f.id, at);
    if (f.legacy_id) { const k = `${f.register}:${f.legacy_id}`; if (legacy.has(k)) errs.push(`${at}: duplicate legacy id ${k}`); else legacy.set(k, at); }
    if (!e.implication || e.implication.trim().length < 10) errs.push(`${at}: empty "Implication for future work"`);
    if (!e.title) errs.push(`${at}: no title`);
    // provenance: VERIFIED needs something checkable
    if (f.evidence === 'VERIFIED') {
      const hay = `${f.source} ${e.evidenceText} ${e.row || ''}`;
      const cited = [...hay.matchAll(PATH_RE)].map((m) => m[1]).filter((p) => /^(brain|workspace|tools|shoebox|repos)\//.test(p) && !/[{}*]/.test(p));
      const dead = cited.filter((p) => !exists(p));
      // Evidence artefacts cited by bare file name (screenshots, run reports) must exist in an evidence folder.
      const artefacts = [...hay.matchAll(/`([\w.-]+\.(?:png|jpg|json|jsonl|yaml|yml|log|txt))`/g)].map((m) => m[1]);
      const lost = artefacts.filter((n) => !evidenceFiles().has(n));
      const checkable = cited.length || artefacts.length || /EV-[A-Z]\d{2}|\.(php|js|jsx|ts|tsx)\b|\.(json|ya?ml|gradle|plist|xml):\d+|git |runtime|Runtime|last-run|logcat|sessions|read directly/.test(hay);
      if (!checkable) errs.push(`${at}: evidence VERIFIED but the source names nothing checkable`);
      if (dead.length) errs.push(`${at}: VERIFIED source does not resolve: ${dead.join(', ')}`);
      if (lost.length) errs.push(`${at}: evidence artefact not found in workspace/qa-evidence, workspace/test-suites or brain/audits/data: ${lost.join(', ')}`);
    }
    // secrets
    const text = e.raw.split(LINKS)[0];
    for (const [re, what] of SECRET_RES) if (re.test(text)) errs.push(`${at}: possible ${what} — never store secret or personal values`);
    if (f.status === 'SUPERSEDED' && !(f.superseded_by || []).length) errs.push(`${at}: SUPERSEDED without superseded_by`);
    if (e.row != null && !f.register) errs.push(`${at}: holds a register row but has no register`);
  }
  // supersession integrity
  for (const e of all) for (const s of e.fm.superseded_by || []) {
    const t = all.find((x) => x.fm.id === s);
    if (!t) errs.push(`${e.file}: superseded_by ${s} does not exist`);
    else if (!(t.fm.supersedes || []).includes(e.fm.id)) errs.push(`${e.file}: ${s} does not list it in supersedes`);
  }
  // registers: every placeholder has an entry, every register entry has a placeholder
  for (const reg of REGISTERS) {
    if (!exists(`${TPL}/${reg.name}.md`)) { warns.push(`${reg.name}: not migrated yet`); continue; }
    const tpl = read(`${TPL}/${reg.name}.md`);
    const ph = new Set([...tpl.matchAll(/^<!-- memory-row: (\S+) -->$/gm)].map((m) => m[1]));
    for (const e of all.filter((x) => x.fm.register === reg.name)) if (!ph.has(e.fm.legacy_id) && e.fm.status !== 'SUPERSEDED') errs.push(`${e.file}: ${e.fm.legacy_id} has no row placeholder in the ${reg.name} template`);
    for (const id of ph) if (!legacy.has(`${reg.name}:${id}`)) errs.push(`${TPL}/${reg.name}.md: placeholder ${id} has no entry`);
  }
  return { errs, warns, n: all.length };
}

// ------------------------------------------------------------------------------------------------ queries
function matches(e, qy) {
  const s = qy.toLowerCase();
  if (/^f\d{2}$/.test(s)) return (e.fm.features || []).includes(qy.toUpperCase());
  if (/^mf-\d{2}$/.test(s)) return (e.fm.flows || []).includes(qy.toUpperCase());
  if (s.includes('/') || /\.\w{2,4}$/.test(s)) return (e.fm.files || []).some((f) => f.toLowerCase().includes(s));
  if (REGISTERS.some((r) => r.name.toLowerCase() === s)) return (e.fm.register || '').toLowerCase() === s;
  return `${e.title} ${e.fm.legacy_id || ''} ${(e.fm.labels || []).join(' ')}`.toLowerCase().includes(s);
}
function context(qy, cap = 25) {
  const all = listEntries().filter((e) => e.fm.status !== 'SUPERSEDED');
  const hit = all.filter((e) => matches(e, qy));
  const rank = (e) => (e.fm.origin === 'manual-commit' ? 0 : 1000) + (Number(e.fm.occurrences) || 1) * 10 + (e.fm.status === 'OPEN' ? 5 : 0);
  hit.sort((a, b) => rank(b) - rank(a));
  const hot = read(`${GEN}/HOT.md`).split('\n').filter((l) => /^\| \d+ \|/.test(l)).length;
  const lines = [`CONTEXT for "${qy}" — HOT has ${hot} entries (brain/memory/_generated/HOT.md, load it first)`, `${hit.length} matching entr(ies)${hit.length > cap ? `; showing ${cap}, truncated ${hit.length - cap} (lowest-ranked: commit history)` : ''}:`];
  for (const e of hit.slice(0, cap)) lines.push(`  ${e.fm.id} [${e.fm.type}/${e.fm.status}/${e.fm.evidence}] ${cut(e.title, 100)}\n      → ${cut(e.implication.replace(/\s+/g, ' '), 180)}\n      ${e.file}`);
  return lines.join('\n');
}
function impact(paths) {
  const facts = indexFacts();
  const all = listEntries().filter((e) => e.fm.status !== 'SUPERSEDED');
  const out = [];
  const feats = new Set();
  for (const p of paths) {
    const rel = p.replace(/^repos\//, '');
    for (const f of facts.featureOfCode.get(rel) || []) feats.add(f);
    for (const e of all) if ((e.fm.files || []).some((x) => x.includes(p.replace(/^repos\/(mobile|web)\//, '')))) for (const f of e.fm.features || []) feats.add(f);
  }
  const risky = all.filter((e) => ['bug', 'antipattern', 'failed-approach', 'incident', 'regression-link', 'fix'].includes(e.fm.type)
    && ((e.fm.files || []).some((x) => paths.some((p) => x.includes(p.replace(/^repos\/(mobile|web)\//, '')))) || (e.fm.features || []).some((f) => feats.has(f))));
  out.push(`IMPACT for ${paths.join(', ')}`);
  out.push(`features: ${[...feats].sort().map((f) => `${f} (${(facts.features.get(f) || {}).crit || '?'})`).join(', ') || 'UNKNOWN — file not mapped in the brain index'}`);
  out.push(`risk entries (surface these in PLAN before proposing an approach): ${risky.length}`);
  const order = ['incident', 'failed-approach', 'antipattern', 'bug', 'regression-link', 'fix'];
  risky.sort((a, b) => order.indexOf(a.fm.type) - order.indexOf(b.fm.type));
  for (const e of risky.slice(0, 25)) out.push(`  ${e.fm.id} [${e.fm.type}/${e.fm.status}] ${cut(e.title, 100)}`);
  out.push('Answers per area stay YES / NO / POSSIBLE / UNKNOWN in the loop state file; this list is the input, not the verdict.');
  return out.join('\n');
}
function history(f) {
  const es = listEntries().filter((e) => (e.fm.features || []).includes(f.toUpperCase()));
  es.sort((a, b) => String(a.fm.first_recorded).replace('≤', '').localeCompare(String(b.fm.first_recorded).replace('≤', '')));
  return [`HISTORY ${f.toUpperCase()} — ${es.length} entries, oldest first`, ...es.map((e) => `  ${String(e.fm.first_recorded).slice(0, 12).padEnd(12)} ${e.fm.type.padEnd(15)} ${e.fm.status.padEnd(18)} ${cut(e.title, 90)}`)].join('\n');
}
function status() {
  const all = listEntries();
  const l = lint();
  const s = readSyncState();
  const cap = captureRate();
  const fr = s ? freshness({ heads: s.heads || {} }) : [];
  const c = (fn) => all.filter(fn).length;
  return [
    'MEMORY STATUS (counts only)',
    `  entries: ${all.length} · live ${c((e) => e.fm.status !== 'SUPERSEDED')} · lint errors ${l.errs.length}`,
    `  last sync: ${s ? `${s.at} (${s.result}) · heads ${Object.entries(s.heads).map(([k, v]) => `${k} ${v}`).join(', ')}` : 'NEVER'}`,
    `  behind HEAD: ${s ? Object.entries(REPOS).map(([k, repo]) => `${k} ${(git(repo, ['rev-list', '--count', `${s.heads[k]}..HEAD`]) || '?')}`).join(', ') : 'unknown'}`,
    `  registers migrated: ${REGISTERS.filter((r) => exists(`${TPL}/${r.name}.md`)).length}/${REGISTERS.length}`,
    `  capture (90 days): ${cap.map((x) => `${x.repo} ${x.captured}/${x.total} (+${x.nonTrigger} non-trigger)`).join(' · ')}`,
    `  open incidents ${c((e) => e.fm.type === 'incident' && e.fm.status === 'OPEN')} · open conflicts ${c((e) => e.fm.type === 'conflict' && e.fm.status === 'OPEN')} · open questions ${c((e) => e.fm.type === 'question' && e.fm.status === 'OPEN')}`,
    `  needs verification ${c((e) => e.fm.status === 'NEEDS-VERIFICATION')} · needs revalidation ${c((e) => e.fm.status === 'NEEDS-REVALIDATION')} · freshness hits ${fr.length}`,
    `  evidence: ${['VERIFIED', 'VISUAL', 'DOCUMENTED', 'INFERRED', 'UNKNOWN'].map((k) => `${k} ${c((e) => e.fm.evidence === k)}`).join(' · ')}`,
  ].join('\n');
}
function newEntry(a) {
  for (const k of ['type', 'title', 'source', 'what', 'implication']) if (!a[k]) throw new Error(`--${k} is required`);
  if (!TYPES.includes(a.type)) throw new Error(`unknown type ${a.type}`);
  const all = listEntries();
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const dup = all.find((e) => e.fm.type === a.type && norm(e.title) === norm(a.title) && e.fm.status !== 'SUPERSEDED');
  if (dup) {
    dup.fm.occurrences = String((Number(dup.fm.occurrences) || 1) + 1);
    dup.fm.last_verified = TODAY;
    dup.statusHistory = `${dup.statusHistory ? `${dup.statusHistory}\n` : ''}- ${TODAY}: occurred again (${a.source})`;
    saveEntry(dup);
    return `occurrence ${dup.fm.occurrences} recorded on ${dup.fm.id} (${dup.file})`;
  }
  const list = (v) => (v ? String(v).split(',').map((x) => x.trim()).filter(Boolean) : []);
  const fm = { id: newId(TODAY, `${a.type}:${norm(a.title)}`), type: a.type, status: a.status || 'CURRENT', evidence: a.evidence || 'DOCUMENTED',
    source: a.source, origin: a.origin || 'ai-loop', approver: a.approver, supersedes: [], superseded_by: [], features: list(a.features),
    flows: list(a.flows), platforms: list(a.platforms), files: list(a.files), relations: list(a.related).map((to) => ({ rel: 'RELATED_TO', to })),
    occurrences: '1', first_recorded: TODAY, last_verified: TODAY, verified_against: a.verifiedAgainst || 'not verified', labels: list(a.labels) };
  const e = { fm, title: a.title, what: a.what, why: a.why || '', evidenceText: a.evidenceText || a.source, implication: a.implication, related: a.relatedText || '—', row: null };
  // A new register row: the entry holds the row; a placeholder goes into the template after `--after <legacy id>`.
  if (a.register) {
    const reg = REGISTERS.find((r) => r.name === a.register);
    if (!reg || !exists(`${TPL}/${reg.name}.md`)) throw new Error(`register ${a.register} is not migrated`);
    if (!a.legacy || !reg.idRe.test(a.legacy)) throw new Error(`--legacy must be a ${reg.name} id`);
    if (!a.row || !a.row.startsWith(`| **${a.legacy}**`) && !a.row.startsWith(`| ${a.legacy} `)) throw new Error('--row must be the full table row starting with the legacy id');
    if (listEntries().some((x) => x.fm.register === reg.name && x.fm.legacy_id === a.legacy)) throw new Error(`${a.legacy} already exists`);
    const tpl = read(`${TPL}/${reg.name}.md`);
    const anchor = `<!-- memory-row: ${a.after} -->`;
    if (!a.after || !tpl.includes(anchor)) throw new Error('--after must name an existing row id in that register');
    fm.id = newId(TODAY, `${reg.name}:${a.legacy}`);
    fm.legacy_id = a.legacy; fm.register = reg.name;
    e.title = `${a.legacy} — ${a.title}`;
    e.row = a.row;
    const l2 = lintOne(e);
    if (l2.length) throw new Error(`refused: ${l2.join('; ')}`);
    saveEntry(e);
    put(`${TPL}/${reg.name}.md`, tpl.replace(anchor, `${anchor}\n<!-- memory-row: ${a.legacy} -->`));
    putOwned(reg.file, renderOne(reg));
    return `created ${fm.id} (${e.file}) and added ${a.legacy} to ${reg.file}`;
  }
  const l = lintOne(e);
  if (l.length) throw new Error(`refused: ${l.join('; ')}`);
  saveEntry(e);
  return `created ${fm.id} (${e.file})`;
}
function lintOne(e) {
  const text = emitEntry(e);
  return SECRET_RES.filter(([re]) => re.test(text)).map(([, w]) => `possible ${w}`);
}
function supersede(oldId, newIdV) {
  const all = listEntries();
  const o = all.find((e) => e.fm.id === oldId); const n = all.find((e) => e.fm.id === newIdV);
  if (!o || !n) throw new Error('both ids must exist');
  o.fm.superseded_by = [...new Set([...(o.fm.superseded_by || []), newIdV])];
  o.statusHistory = `${o.statusHistory ? `${o.statusHistory}\n` : ''}- ${TODAY}: ${o.fm.status} → SUPERSEDED by ${newIdV}`;
  o.fm.status = 'SUPERSEDED';
  n.fm.supersedes = [...new Set([...(n.fm.supersedes || []), oldId])];
  saveEntry(o); saveEntry(n);
  return `${oldId} → ${newIdV}`;
}
function promote() {
  const cands = listEntries().filter((e) => Number(e.fm.occurrences) >= 3 && e.fm.status !== 'SUPERSEDED');
  if (!cands.length) return 'No entry has occurrences >= 3. Nothing to propose.';
  return cands.map((e) => `PROPOSE (owner approves): turn ${e.fm.id} "${e.title}" (x${e.fm.occurrences}) into a rule in brain/context/conventions-*.md or a gate item in brain/gates/.`).join('\n');
}

// ------------------------------------------------------------------------------------------------ self-test
function selfTest() {
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'memtest-'));
  const saved = ROOT; ROOT = tmp;
  const checks = [];
  const ok = (name, v) => checks.push([name, !!v]);
  try {
    fs.mkdirSync(path.join(tmp, 'brain/context'), { recursive: true });
    const reg = '---\narea: context\n---\n\n# Questions put to the owner\n\nIntro prose.\n\n## Open\n\n| # | Question | Why it matters | Source |\n|---|---|---|---|\n| **Q-P9** | Is the customer MCP sold? | pricing \\| scope | A3 §7 |\n| not-an-id | row kept as prose | x | y |\n\n## Answered\n\n| # | Question | Answer (USER SAID 2026-09-15) |\n|---|---|---|\n| Q-T1 | Are tests run? | No, never |\n\n%% brain-links:start %%\nmanaged\n%% brain-links:end %%\n';
    fs.writeFileSync(path.join(tmp, 'brain/context/open-questions.md'), reg);
    const r1 = migrate('open-questions', { allowDirty: true });
    ok('migrate reports round-trip OK', r1.some((x) => /round-trip OK/.test(x)));
    const es = listEntries();
    ok('two ID rows became entries (non-ID row stays prose)', es.length === 2);
    const q9 = es.find((e) => e.fm.legacy_id === 'Q-P9');
    ok('escaped pipe kept verbatim in the row', q9 && q9.row.includes('pricing \\| scope'));
    ok('open question → OPEN, answered → RESOLVED', q9.fm.status === 'OPEN' && es.find((e) => e.fm.legacy_id === 'Q-T1').fm.status === 'RESOLVED');
    const after = fs.readFileSync(path.join(tmp, 'brain/context/open-questions.md'), 'utf8');
    ok('register keeps its managed block', after.includes('%% brain-links:start %%\nmanaged'));
    ok('register body = original + notice only', body(after).replace(/\n> \[!info\][^\n]*\n> [^\n]*\n\n?/, '\n').replace(/\s+$/, '') === body(reg).replace(/\s+$/, ''));
    const r2 = migrate('open-questions', { allowDirty: true });
    ok('migrate is idempotent (second run no-op)', /no-op/.test(r2[0]) && listEntries().length === 2);
    q9.row = q9.row.replace('Is the customer MCP sold?', 'Is the customer MCP sold (edited)?'); saveEntry(q9);
    render();
    ok('editing the entry re-renders the register', fs.readFileSync(path.join(tmp, 'brain/context/open-questions.md'), 'utf8').includes('(edited)'));
    ok('parse → emit is stable', emitEntry(parseEntry(read(q9.file), q9.file)).split(LINKS)[0] === read(q9.file).split(LINKS)[0]);
    const created = newEntry({ type: 'decision', title: 'Use trailing filter', source: 'USER SAID test', what: 'x', implication: 'Place filters at the end of the search row.' });
    const again = newEntry({ type: 'decision', title: 'use  trailing FILTER', source: 'second time', what: 'x', implication: 'Place filters at the end of the search row.' });
    ok('new entry created, duplicate increments occurrences', /created/.test(created) && /occurrence 2/.test(again));
    let refused = false;
    try { newEntry({ type: 'bug', title: 'leak', source: 's', what: 'token eyJhbGciOiJIUzI1NiIsInR5cCI6.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghij', implication: 'rotate it now please' }); } catch (e) { refused = /JWT/.test(e.message); }
    ok('secret guard refuses a JWT', refused);
    const all2 = listEntries();
    const d = all2.find((e) => e.fm.type === 'decision');
    const d2 = newEntry({ type: 'decision', title: 'Use leading filter', source: 'USER SAID later', what: 'y', implication: 'Place filters at the start instead.' });
    const nid = listEntries().find((e) => e.title === 'Use leading filter').fm.id;
    supersede(d.fm.id, nid);
    const l = lint();
    ok('supersede keeps a valid chain; lint clean', /created/.test(d2) && l.errs.length === 0);
    ok('superseded entry kept, not deleted', listEntries().some((e) => e.fm.id === d.fm.id && e.fm.status === 'SUPERSEDED'));
    // a new register row goes through an entry and appears in the rendered table, right after its anchor
    const addRow = newEntry({ type: 'question', title: 'Is the chat feature sold?', source: 'USER SAID test', what: 'x', implication: 'Ask the owner before building.',
      register: 'open-questions', legacy: 'Q-P10', after: 'Q-P9', row: '| **Q-P10** | Is the chat feature sold? | pricing | A3 §7 |' });
    const regText = fs.readFileSync(path.join(tmp, 'brain/context/open-questions.md'), 'utf8');
    ok('a new register row is rendered after its anchor', /added Q-P10/.test(addRow) && regText.indexOf('Q-P10') > regText.indexOf('Q-P9') && lint().errs.length === 0);

    // pull-based sync on a throwaway repo: new commit captured, verified entry goes stale, prod pointer flagged
    const g = (...a) => execFileSync('git', ['-C', path.join(tmp, 'repos/mobile'), ...a], { stdio: 'ignore' });
    fs.mkdirSync(path.join(tmp, 'repos/mobile/App/config'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'repos/web'), { recursive: true });
    g('init', '-q'); g('config', 'user.email', 'test@example.invalid'); g('config', 'user.name', 'test');
    fs.writeFileSync(path.join(tmp, 'repos/mobile/App/a.js'), 'one\n');
    fs.writeFileSync(path.join(tmp, 'repos/mobile/App/config/index.js'), "export const URL_BASE = 'https://staging.territool.com/index.php/api/';\n");
    g('add', '.'); g('commit', '-qm', 'first');
    const base = execFileSync('git', ['-C', path.join(tmp, 'repos/mobile'), 'rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim();
    execFileSync('git', ['-C', path.join(tmp, 'repos/web'), 'init', '-q']);
    execFileSync('git', ['-C', path.join(tmp, 'repos/web'), '-c', 'user.email=t@example.invalid', '-c', 'user.name=t', 'commit', '-q', '--allow-empty', '-m', 'w']);
    const wbase = execFileSync('git', ['-C', path.join(tmp, 'repos/web'), 'rev-parse', '--short=8', 'HEAD'], { encoding: 'utf8' }).trim();
    fs.mkdirSync(path.join(tmp, MEM), { recursive: true });
    fs.writeFileSync(path.join(tmp, MEM, 'LAST-SYNC.md'), `\`\`\`json sync-state\n${JSON.stringify({ baselines: { mobile: base, web: wbase }, heads: { mobile: base, web: wbase }, pointers: {} })}\n\`\`\`\n`);
    newEntry({ type: 'pattern', title: 'a.js returns one', source: 'repos/mobile/App/a.js read', what: 'x', implication: 'Expect one.', files: 'repos/mobile/App/a.js', verifiedAgainst: `mobile@${base}`, evidence: 'VERIFIED' });
    newEntry({ type: 'incident', status: 'OPEN', title: 'a.js incident', source: 'repos/mobile/App/a.js read', what: 'x', implication: 'Stays open.', files: 'repos/mobile/App/a.js', verifiedAgainst: `mobile@${base}`, evidence: 'VERIFIED' });
    fs.writeFileSync(path.join(tmp, 'repos/mobile/App/a.js'), 'two\n');
    fs.writeFileSync(path.join(tmp, 'repos/mobile/App/config/index.js'), "export const URL_BASE = 'https://app.territool.com/index.php/api/';\n");
    g('add', '.'); g('commit', '-qm', 'fix: return two');
    const s1 = sync();
    ok('sync captures the new commit as a fix entry', s1.state.behind.mobile === 1 && listEntries().some((e) => e.fm.type === 'fix' && /return two/.test(e.title)));
    ok('sync marks the outdated entry NEEDS-REVALIDATION', listEntries().find((e) => e.title === 'a.js returns one').fm.status === 'NEEDS-REVALIDATION');
    const inc = listEntries().find((e) => e.title === 'a.js incident');
    ok('sync keeps an OPEN entry OPEN and records why it needs revalidation', inc.fm.status === 'OPEN' && /still OPEN; revalidate/.test(inc.statusHistory || ''));
    ok('sync flags the production pointer', listEntries().some((e) => e.fm.type === 'environment' && e.fm.status === 'NEEDS-VERIFICATION'));
    const n1 = listEntries().length;
    const s2 = sync();
    ok('second sync adds nothing (idempotent)', listEntries().length === n1 && s2.state.behind.mobile === 0);

    const bad = listEntries().find((e) => e.fm.legacy_id === 'Q-T1');
    bad.implication = ''; saveEntry(bad);
    ok('lint catches an empty implication', lint().errs.some((x) => /Implication/.test(x)));
  } catch (e) {
    checks.push([`unexpected error: ${e.message}`, false]);
  } finally {
    ROOT = saved;
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  let failed = 0;
  for (const [n, v] of checks) { if (!v) failed++; console.log(`${v ? '✓' : '✗'} ${n}`); }
  console.log(failed ? `${failed} check(s) FAILED` : `all ${checks.length} checks pass`);
  return failed === 0;
}

// ------------------------------------------------------------------------------------------------ cli
function args(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2).replace(/-([a-z])/g, (m, c) => c.toUpperCase());
      if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) { o[k] = argv[++i]; } else o[k] = true;
    } else o._.push(a);
  }
  return o;
}
function main() {
  const a = args(process.argv.slice(2));
  CHECK = !!a.check;
  const cmd = a._[0];
  if (a.selfTest || cmd === 'self-test') process.exit(selfTest() ? 0 : 1);
  switch (cmd) {
    case 'status': console.log(status()); break;
    case 'context': console.log(context(a._.slice(1).join(' '))); break;
    case 'impact': console.log(impact(a._.slice(1))); break;
    case 'history': console.log(history(a._[1] || '')); break;
    case 'new': console.log(newEntry(a)); break;
    case 'supersede': console.log(supersede(a._[1], a._[2])); break;
    case 'promote': console.log(promote()); break;
    case 'refresh-commits': console.log(`refreshed Related on ${refreshCommitRelated()} commit entr(ies)`); break;
    case 'migrate': console.log(migrate(a._[1] || 'all', { allowDirty: !!a.allowDirty }).join('\n')); break;
    case 'seed-git': {
      const facts = indexFacts();
      for (const k of Object.keys(REPOS)) {
        const c = commitsOf(k, [`--since=${a.since || '2026-06-19'}`, 'HEAD']);
        if (!c) { console.log(`${k}: repo not readable`); continue; }
        const r = seedCommits(k, c, facts);
        console.log(`${k}: ${c.length} commits → ${r.created} new entries, ${r.skipped} non-trigger`);
      }
      break;
    }
    case 'sync': {
      const r = sync();
      console.log(`sync ${r.state.result}: behind ${JSON.stringify(r.state.behind)} · new entries ${r.seeded} · freshness ${JSON.stringify(r.state.freshness)}`);
      if (!CHECK) reindex();
      break;
    }
    case 'render': { const r = render(); console.log(r.join('\n')); if (CHECK && STALE.length) process.exit(1); break; }
    case 'reindex': { const r = reindex(); console.log(`reindex: ${r.live} live entries, HOT ${r.hot}${CHECK ? (STALE.length ? ` · STALE: ${STALE.join(', ')}` : ' · current') : ''}`); if (CHECK && STALE.length) process.exit(1); break; }
    case 'lint': {
      const l = lint();
      for (const e of l.errs.slice(0, 50)) console.log(`✗ ${e}`);
      for (const w of l.warns) console.log(`! ${w}`);
      console.log(`memory lint: ${l.n} entries · ${l.errs.length} error(s) · ${l.warns.length} warning(s)`);
      if (a.strict && l.errs.length) process.exit(1);
      break;
    }
    default:
      console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(2, 22).map((l) => l.replace(/^ \* ?/, '')).join('\n'));
  }
}
if (require.main === module) main();
module.exports = { listEntries, parseEntry, REGISTERS, lint, captureRate, readSyncState, freshness, indexFacts, newEntry, supersede, reindex, render };
