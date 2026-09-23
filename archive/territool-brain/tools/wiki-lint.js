#!/usr/bin/env node
/**
 * Health check for the KNOWLEDGE, not the code.
 *
 * static-checks.js lints the product's source. brain-parity.js proves the two graph views agree.
 * Neither looks at whether the brain's own writing is still true, still connected, or still cited.
 * That is this file's job, and it is the check the brain went longest without.
 *
 * What it looks for:
 *   dead-citation   a note cites repos/... or a brain path that no longer exists   (the strongest
 *                   stale-claim signal available without recording content hashes)
 *   broken-link     a [[wikilink]] with no target
 *   orphan          a written note with no inbound and no outbound links
 *   uncited         a brain/context note that cites nothing at all
 *   undefined-id    an ID referenced by notes but with no page that defines it
 *   duplicate-title two notes claiming the same H1
 *   unverified      a note that says in its own words that it has not been checked — surfaced as
 *                   a to-do list, because these are the claims most likely to rot
 *   stale-index     log.md or the index is older than the newest note
 *
 * Report-only by default so it can run inside brain-sync without blocking; --strict exits 1 if any
 * FAIL-level finding exists.
 *
 * Usage: node tools/wiki-lint.js [--strict] [--quiet] [--json]
 */
const fs = require('fs');
const path = require('path');
const { ROOT, vaultNotes } = require('./lib/vault.js');
const { noteFor } = require('./lib/nodes.js');

const ARGS = process.argv.slice(2);
const STRICT = ARGS.includes('--strict');
const QUIET = ARGS.includes('--quiet');
const JSON_OUT = ARGS.includes('--json');

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const findings = [];
const add = (level, rule, file, msg, hint) => findings.push({ level, rule, file, msg, hint: hint || '' });

const notes = vaultNotes();
const index = exists('brain/audits/data/brain-index.json') ? JSON.parse(read('brain/audits/data/brain-index.json')) : { nodes: [], links: [] };

// Strip frontmatter, the generated Linked block, and fenced code, so prose is what gets checked.
function prose(p) {
  let t = read(p);
  if (t.startsWith('---\n')) { const e = t.indexOf('\n---\n', 3); if (e !== -1) t = t.slice(e + 5); }
  const lines = t.split('\n');
  let s = -1; let e2 = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (e2 === -1) { if (lines[i].trim() === '%% brain-links:end %%') e2 = i; continue; }
    if (lines[i].trim() === '%% brain-links:start %%') { s = i; break; }
  }
  if (s !== -1 && e2 !== -1) t = lines.slice(0, s).join('\n');
  return t.replace(/^```[\s\S]*?^```/gm, '');
}

// ---------------------------------------------------------------- dead citations
// A citation is a backtick path that looks like a real file in this workspace or a repo.
const CITE = /`((?:repos\/(?:mobile|web)\/|brain\/|workspace\/|shoebox\/|tools\/)[A-Za-z0-9_@./-]+?\.[A-Za-z0-9]{1,5})(?::\d+(?:[-–]\d+)?)?`/g;
// A path the note itself marks as unbuilt is a plan, not a broken citation — report it, don't fail it.
const PLANNED = /(not created yet|not yet created|to be (built|created|written)|does not exist yet|not present|planned)/i;
for (const p of notes) {
  const seen = new Set();
  const lines = prose(p).split('\n');
  for (const line of lines) {
    for (const m of line.matchAll(CITE)) {
      const target = m[1];
      if (seen.has(target)) continue;
      seen.add(target);
      if (exists(target)) continue;
      if (PLANNED.test(line)) add('INFO', 'planned-path', p, `\`${target}\` is cited as planned and does not exist yet`);
      else add('FAIL', 'dead-citation', p, `cites \`${target}\`, which does not exist`, 'the file moved or was deleted — fix the citation or the claim built on it');
    }
  }
}

// ---------------------------------------------------------------- broken wikilinks
const noteSet = new Set(notes);
const generated = new Set(index.nodes.map((n) => noteFor(n)).filter(Boolean));
for (const p of notes) {
  for (const m of prose(p).matchAll(/(!?)\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)) {
    if (m[1] === '!') continue;
    const t = `${m[2].trim()}.md`;
    if (!noteSet.has(t) && !generated.has(t)) add('FAIL', 'broken-link', p, `[[${m[2].trim()}]] has no target`);
  }
}

// ---------------------------------------------------------------- orphans
const deg = new Map();
for (const [a, b] of index.links) { deg.set(a, (deg.get(a) || 0) + 1); deg.set(b, (deg.get(b) || 0) + 1); }
const nodeByPath = new Map(index.nodes.filter((n) => n.p && n.p.endsWith('.md')).map((n) => [n.p, n]));
for (const p of notes) {
  const n = nodeByPath.get(p);
  if (!n) continue;
  // Commit entries reference git history, which is not a graph node; their unmapped files are reported in memory GAPS.
  if (/^brain\/memory\/entries\/(change|fix|failed-approach)\//.test(p) && /^origin:\s*manual-commit/m.test(read(p).slice(0, 900))) continue;
  if (!deg.get(n.id)) add('WARN', 'orphan', p, 'nothing links to it and it links to nothing', 'cite it from a note that matters, or fold it into one');
}

// ---------------------------------------------------------------- uncited context notes
for (const p of notes.filter((x) => x.startsWith('brain/context/'))) {
  const t = prose(p);
  const cites = (t.match(CITE) || []).length + (t.match(/\[\[/g) || []).length + (t.match(/`[A-Z]{1,3}-?[A-Z]*\d+`|\b(USER SAID|A\d §)/g) || []).length;
  if (!cites) add('WARN', 'uncited', p, 'derived-truth note with no citation at all', 'every claim in brain/context should trace to a file, a screenshot, an audit or an owner decision (S0.5)');
}

// ---------------------------------------------------------------- IDs referenced but never defined
for (const n of index.nodes) {
  if (!['rule', 'gate', 'decision', 'gap', 'flow', 'mflow'].includes(n.g)) continue;
  if (n.h) continue; // has a home note that defines it
  const links = deg.get(n.id) || 0;
  if (links >= 2) add('WARN', 'undefined-id', '—', `${n.ref} is referenced by ${links} things but no note defines it`, 'give it a row in the note that owns its family, or stop citing it');
}

// ---------------------------------------------------------------- duplicate titles
const titles = new Map();
for (const p of notes) {
  const m = prose(p).match(/^#\s+(.+?)\s*$/m);
  if (!m) continue;
  const key = m[1].trim().toLowerCase();
  if (titles.has(key)) add('INFO', 'duplicate-title', p, `same H1 as ${titles.get(key)}: "${m[1].trim()}"`);
  else titles.set(key, p);
}

// ---------------------------------------------------------------- self-declared unverified claims
// Only claims a note makes about ITS OWN content. Skills, templates and CLAUDE.md talk *about*
// saying "not verified" — that is an instruction, not a rotting claim.
const UNVERIFIED = /(nothing (here|in (this|it)) has been verified|has not been (verified|checked|watched)|not (yet )?verified against|remains? unconfirmed|cause (is )?unconfirmed)/i;
const INSTRUCTIONAL = /^(brain\/skills\/|CLAUDE\.md|AGENTS\.md)/;
for (const p of notes) {
  if (INSTRUCTIONAL.test(p) || /template/i.test(p)) continue;
  const t = prose(p);
  if (UNVERIFIED.test(t)) {
    const line = t.split('\n').find((l) => UNVERIFIED.test(l)) || '';
    add('INFO', 'unverified', p, line.trim().replace(/^[>*\-\s]+/, '').slice(0, 120), 'these are the claims most likely to rot — verify or re-state');
  }
}

// ---------------------------------------------------------------- version drift (one home: stack.md §0)
// Current-state files may mention a version only if it agrees with stack.md §0. Dated records (ledger,
// registers, audits, captures, QA reports, log) keep the value that was true when written; superseded
// notes are frozen.
const versions = require('./lib/versions.js');
const canon = versions.canonical(ROOT);
if (!Object.keys(canon).length) add('FAIL', 'version-drift', versions.STACK, 'the §0 "Canonical versions" table is missing');
for (const d of versions.sourceDrift(ROOT, canon)) {
  add('FAIL', 'version-drift', versions.STACK, `§0 says ${d.key} = ${d.canonical}, but ${d.source} says ${d.found}`, 'update §0 (the only place to change it)');
}
const DATED = /^brain\/context\/(evidence-ledger|contradiction-register|UNKNOWN_REGISTER|UPCOMING_IMPROVEMENTS|brain-qa|brain-scorecard|mobile-flows-captured|mobile-screenshot-index|mobile-videos|web-screenshot-index|open-questions)\.md$/;
const CURRENT = (p) => (/^brain\/(context|skills|gates)\//.test(p) || /^(CLAUDE|SETUP|AGENTS)\.md$/.test(p)) && p !== versions.STACK && !DATED.test(p);
const superseded = (p) => /^status:\s*SUPERSEDED\b/m.test(read(p).slice(0, 600));
const scanVersions = (p, text) => {
  for (const m of versions.mentions(text)) {
    const key = versions.resolve(m, canon);
    if (canon[key] && !versions.consistent(m.version, canon[key])) {
      add('FAIL', 'version-drift', p, `line ~${m.line}: says ${key} ${m.version}, stack.md §0 says ${canon[key]}`, 'link to stack.md §0 instead of repeating the number');
    }
  }
};
// Whole file minus the generated link block: fenced config blocks must not hide a copied version.
const withCode = (p) => { const t = read(p); const i = t.indexOf('%% brain-links:start'); return i === -1 ? t : t.slice(0, i); };
for (const p of notes.filter(CURRENT)) if (!superseded(p)) scanVersions(p, withCode(p));
for (const p of ['tools/doctor.js', '.cursor/rules/territool-brain.mdc', '.github/copilot-instructions.md']) if (exists(p)) scanVersions(p, read(p));

// ---------------------------------------------------------------- QA reports the generator did not write
// A hand-written feature report escapes the coverage rule and is where a stale PASS survives.
for (const f of exists('workspace/qa-reports') ? fs.readdirSync(path.join(ROOT, 'workspace/qa-reports')) : []) {
  if (!/-f\d{2}-.*\.md$/.test(f)) continue;
  if (!/Generated by `tools\/qa-report\.js`/.test(read(`workspace/qa-reports/${f}`))) {
    add('FAIL', 'qa-not-generated', `workspace/qa-reports/${f}`, 'feature QA report not produced by tools/qa-report.js', 'let the generator own verdict + coverage; keep hand-written parts as its appendix');
  }
}

// ---------------------------------------------------------------- freshness
const mtime = (p) => fs.statSync(path.join(ROOT, p)).mtimeMs;
const newest = notes.reduce((a, p) => Math.max(a, mtime(p)), 0);
for (const f of ['log.md', 'index.md']) {
  if (!exists(f)) { add('WARN', 'stale-index', f, 'missing'); continue; }
  if (mtime(f) < newest - 60_000) add('INFO', 'stale-index', f, 'older than the newest note', 'regenerate it, or log what changed');
}

// ---------------------------------------------------------------- report
const by = (l) => findings.filter((f) => f.level === l);
if (JSON_OUT) { console.log(JSON.stringify({ findings, counts: { FAIL: by('FAIL').length, WARN: by('WARN').length, INFO: by('INFO').length } }, null, 2)); process.exit(STRICT && by('FAIL').length ? 1 : 0); }

if (!QUIET || by('FAIL').length) {
  console.log(`wiki-lint · ${notes.length} written notes · ${index.nodes.length} nodes\n`);
  let rule = '';
  for (const f of findings.sort((a, b) => a.rule.localeCompare(b.rule) || a.file.localeCompare(b.file))) {
    if (f.rule !== rule) { rule = f.rule; console.log(`  ${rule.toUpperCase()}`); }
    const where = f.file === '—' ? '' : `${f.file} — `;
    console.log(`   ${f.level === 'FAIL' ? '✗' : f.level === 'WARN' ? '!' : '·'} ${where}${f.msg}`);
  }
  if (!findings.length) console.log('  clean.');
  console.log(`\n  ${by('FAIL').length} fail · ${by('WARN').length} warn · ${by('INFO').length} info`);
}
process.exit(STRICT && by('FAIL').length ? 1 : 0);
