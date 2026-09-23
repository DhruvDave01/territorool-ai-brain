#!/usr/bin/env node
/**
 * Append-only timeline of what happened to the brain, and when.
 *
 * The brain records what it KNOWS (brain/context) and how each rule was established (brain/audits),
 * but until now it had no record of what was DONE. A new session had to re-derive the story from
 * phase audits and file timestamps. This is that missing record.
 *
 * Format is deliberately greppable — every entry starts with the same prefix, so:
 *   grep "^## \[" log.md | tail -5          the last five things that happened
 *   grep "^## \[" log.md | grep ingest      everything ever ingested
 *
 * Append-only: this never rewrites or reorders existing entries. New ones go at the top of the file
 * (newest first), because the question is almost always "what happened recently".
 *
 * Usage (from territool-brain/):
 *   node tools/log.js ingest "24 mobile screen recordings" --detail "..." --refs "MV-01..MV-24"
 *   node tools/log.js query  "Which flows have moving evidence?" --detail "filed as ..."
 *   node tools/log.js lint   "wiki lint" --detail "8 orphans, 0 broken links"
 *   node tools/log.js --last 5
 *
 * Types: ingest · query · lint · build · fix · decision
 */
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/vault.js');

const LOG = path.join(ROOT, 'log.md');
const TYPES = ['ingest', 'query', 'lint', 'build', 'fix', 'decision'];
const ARGS = process.argv.slice(2);
const flag = (n) => { const i = ARGS.indexOf(n); return i !== -1 && ARGS[i + 1] && !ARGS[i + 1].startsWith('--') ? ARGS[i + 1] : null; };

const HEADER = `---
area: root
tags: [brain/root]
---

# Log

Append-only record of what has been done to this brain — ingests, questions worth keeping, lint runs,
builds, fixes and owner decisions. Newest first. Written by \`node tools/log.js\`; **never edit by hand
and never reorder** — the value is that entries are immutable once written.

\`\`\`bash
grep "^## \\[" log.md | head -10      # the last ten things that happened
grep "^## \\[" log.md | grep ingest   # everything ever ingested
\`\`\`

`;

function read() {
  if (!fs.existsSync(LOG)) return HEADER;
  return fs.readFileSync(LOG, 'utf8');
}

// --last N
const last = flag('--last');
if (last || ARGS.includes('--last')) {
  const n = parseInt(last, 10) || 10;
  const lines = read().split('\n').filter((l) => /^## \[/.test(l));
  console.log(lines.slice(0, n).join('\n') || '(no entries yet)');
  process.exit(0);
}

const type = ARGS[0];
const title = ARGS[1];
if (!TYPES.includes(type) || !title || title.startsWith('--')) {
  console.error(`Usage: node tools/log.js <${TYPES.join('|')}> "<title>" [--detail "..."] [--refs "..."] [--date YYYY-MM-DD]`);
  console.error('       node tools/log.js --last 10');
  process.exit(2);
}

const date = flag('--date') || new Date().toISOString().slice(0, 10);
const detail = flag('--detail');
const refs = flag('--refs');

const entry = [`## [${date}] ${type} | ${title}`, ''];
if (detail) entry.push(detail, '');
if (refs) entry.push(`**Refs:** ${refs}`, '');

const current = read();
// Newest first: insert directly after the header block, before the first existing entry.
const firstEntry = current.indexOf('\n## [');
const out = firstEntry === -1
  ? `${current.replace(/\s*$/, '\n\n')}${entry.join('\n')}`
  : `${current.slice(0, firstEntry + 1)}${entry.join('\n')}${current.slice(firstEntry + 1)}`;

fs.writeFileSync(LOG, out.replace(/\n{3,}$/, '\n\n'));
console.log(`logged: [${date}] ${type} | ${title}`);
