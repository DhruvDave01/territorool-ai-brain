#!/usr/bin/env node
/**
 * Checks that `file:line` citations in the brain still point at what the sentence says they do.
 *
 * wiki-lint.js proves a cited FILE exists. Lines drift as code changes (AuthController.php:135 became :140),
 * and a drifted line silently cites the wrong code. For every citation like `V2/AuthController.php:140` or
 * `utils/API.js:229-342` in brain/context/*.md this tool:
 *   1. resolves the file under repos/web or repos/mobile (by the cited path suffix; ambiguous → skipped),
 *   2. checks the line range is inside the file,
 *   3. takes the identifiers written on the same line of the note (backticked words, function-like names)
 *      and looks for any of them within ±12 lines of the cited range. If none is near but one exists
 *      elsewhere in the file, it reports DRIFT with the line where it is now.
 * Heuristic by design: a PASS means "an identifier from the sentence is near the cited line", not proof.
 *
 *   node tools/cite-check.js            # report
 *   node tools/cite-check.js --strict   # exit 1 on OUT-OF-RANGE or DRIFT
 *   node tools/cite-check.js --json
 */
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/vault.js');

const ARGS = process.argv.slice(2);
const REPOS = [['repos/web', 'app'], ['repos/web', 'routes'], ['repos/web', 'config'], ['repos/web', 'resources'], ['repos/mobile', 'App'], ['repos/mobile', 'scripts']];
const NOTES = fs.readdirSync(path.join(ROOT, 'brain/context')).filter((f) => f.endsWith('.md')).map((f) => `brain/context/${f}`);

// Index repo files by basename once.
const byBase = new Map();
function walk(abs) {
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = path.join(abs, e.name);
    if (e.isDirectory()) { if (!/^(node_modules|vendor|Pods|build|\.)/.test(e.name)) walk(p); } else if (/\.(php|js|jsx|ts|tsx)$/.test(e.name)) {
      const list = byBase.get(e.name) || []; list.push(p); byBase.set(e.name, list);
    }
  }
}
for (const [repo, dir] of REPOS) walk(path.join(ROOT, repo, dir));
const cache = new Map();
const linesOf = (f) => { if (!cache.has(f)) cache.set(f, fs.readFileSync(f, 'utf8').split('\n')); return cache.get(f); };

// file:LINE[-END][, LINE[-END]]… — every range listed after one file counts.
const CITE = /`?((?:[\w.-]+\/)*[\w.-]+\.(?:php|js|jsx|ts|tsx)):(\d+(?:\s*[-–]\s*\d+)?(?:\s*,\s*\d+(?:\s*[-–]\s*\d+)?)*)/g;
const STOP = new Set(['status', 'data', 'message', 'true', 'false', 'null', 'return', 'function', 'user', 'users', 'request', 'response', 'json', 'this', 'code', 'file', 'line', 'Code', 'VERIFIED', 'INFERRED', 'UNKNOWN', 'RT']);
const results = [];

for (const note of NOTES) {
  const text = fs.readFileSync(path.join(ROOT, note), 'utf8').split('\n');
  const genStart = text.findIndex((l) => /:start \(generated/.test(l));
  const genEnd = text.findIndex((l) => /:end -->/.test(l));
  text.forEach((raw, i) => {
    if (genStart >= 0 && i > genStart && i < genEnd) return; // generated tables are checked by their own --check
    if (/brain-links:start/.test(raw)) return;
    for (const m of raw.matchAll(CITE)) {
      const cited = m[1];
      const ranges = m[2].split(',').map((r) => r.split(/[-–]/).map((n) => +n.trim())).map(([a, b]) => [a, b || a]);
      const from = Math.min(...ranges.map((r) => r[0])); const to = Math.max(...ranges.map((r) => r[1]));
      const base = path.basename(cited);
      const cands = (byBase.get(base) || []).filter((p) => p.endsWith(cited.replace(/^\.?\//, '')) || p.endsWith(`/${cited}`));
      const loc = `${note}:${i + 1}`;
      if (!cands.length) { results.push({ level: 'SKIP', loc, cite: m[0], why: (byBase.get(base) || []).length ? 'ambiguous or partial path' : 'file not in repos (or not a repo path)' }); continue; }
      if (cands.length > 1) { results.push({ level: 'SKIP', loc, cite: m[0], why: `ambiguous: ${cands.length} files` }); continue; }
      const file = cands[0]; const L = linesOf(file);
      if (from < 1 || to > L.length) { results.push({ level: 'OUT-OF-RANGE', loc, cite: m[0], why: `file has ${L.length} lines` }); continue; }
      // Anchor text = the table cell (or sentence) holding the citation, minus every path on the line, so
      // folder names (UserMcp, findLeads) and other citations' identifiers do not count.
      const cells = raw.split('|');
      let pos = 0; let cell = raw;
      for (const c of cells) { if (m.index >= pos && m.index <= pos + c.length) { cell = c; break; } pos += c.length + 1; }
      const pathWords = new Set([...raw.matchAll(/[\w.-]+(?=\/)|[\w-]+(?=\.(?:php|js|jsx|ts|tsx|md|json))/g)].map((x) => x[0]));
      const cellIds = cell.replace(CITE, ' ');
      const anchorText = /[A-Za-z]{4,}/.test(cellIds.replace(/[\w.-]+\//g, '')) ? cellIds : raw.replace(CITE, ' ');
      const ids = [...new Set([...anchorText.matchAll(/`([A-Za-z_$][\w$]{3,})(?:\(\))?`|\b([a-z]+[A-Z][\w]{2,})\b|\b([A-Z][a-z]+[A-Z][\w]{2,})\b/g)]
        .map((x) => x[1] || x[2] || x[3]).filter((w) => w && !STOP.has(w) && !pathWords.has(w) && w !== base.replace(/\.\w+$/, '')))];
      if (!ids.length) { results.push({ level: 'NO-ANCHOR', loc, cite: m[0], why: 'no identifier on the note line to check against' }); continue; }
      const near = ranges.map(([a, b]) => L.slice(Math.max(0, a - 13), Math.min(L.length, b + 12)).join('\n')).join('\n');
      const hit = ids.find((w) => near.includes(w));
      if (hit) { results.push({ level: 'OK', loc, cite: m[0], why: `\`${hit}\` near the cited line` }); continue; }
      const elsewhere = ids.map((w) => [w, L.findIndex((l) => l.includes(w))]).filter(([, k]) => k >= 0);
      if (elsewhere.length) results.push({ level: 'DRIFT', loc, cite: m[0], why: `\`${elsewhere[0][0]}\` is now at line ${elsewhere[0][1] + 1}, not near ${from}` });
      else results.push({ level: 'NO-ANCHOR', loc, cite: m[0], why: `none of ${ids.slice(0, 3).join(', ')} appear in the file` });
    }
  });
}

const count = (l) => results.filter((r) => r.level === l).length;
if (ARGS.includes('--json')) { console.log(JSON.stringify(results, null, 1)); } else {
  for (const r of results.filter((x) => ['DRIFT', 'OUT-OF-RANGE'].includes(x.level))) console.log(`${r.level.padEnd(12)} ${r.loc}  ${r.cite}  — ${r.why}`);
  console.log(`\ncite-check: ${results.length} citations · OK ${count('OK')} · DRIFT ${count('DRIFT')} · OUT-OF-RANGE ${count('OUT-OF-RANGE')} · no anchor ${count('NO-ANCHOR')} · skipped ${count('SKIP')}`);
}
process.exit(ARGS.includes('--strict') && (count('DRIFT') || count('OUT-OF-RANGE')) ? 1 : 0);
