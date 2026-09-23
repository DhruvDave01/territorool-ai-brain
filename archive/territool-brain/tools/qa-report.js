#!/usr/bin/env node
/**
 * Writes one per-feature QA report in workspace/qa-reports/ from the ACTUAL suite runs, so a report only
 * claims a passing verdict when real cases passed. It never invents results.
 *
 *   node tools/qa-report.js            # (re)write every feature report + QA-COVERAGE.md
 *   node tools/qa-report.js --check    # exit 1 if any would change
 *
 * Sources (all real run output): workspace/test-suites/api-contract/last-run.json,
 * workspace/test-suites/web/last-run.json, brain/context/evidence-ledger.md (EV-ids per feature),
 * brain/context/parity-map.md (parity line), brain/context/flows.md (name + criticality),
 * workspace/test-cases/coverage-na.json (optional: justified N/A coverage types per feature).
 *
 * Coverage (primary signal): the 10 types in territool-test §2, counted as run ÷ applicable. A type is
 * applicable unless coverage-na.json gives it a specific reason; a missing, generic or too-short reason
 * counts as not run.
 *
 * Verdict rule (honest): FAIL if any case failed; PARTIAL if nothing executed, any applicable type has no
 * executed case, or parity is "accidentally different"; else PASS-WITH-NOTES if any known gap / blocked /
 * waived; else PASS.
 *
 * Every feature report is generated — including F01, whose original hand-written record is kept verbatim
 * as an appendix below the generated part. tools/wiki-lint.js flags any feature report this tool did not write.
 */
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/vault.js');

const CHECK = process.argv.includes('--check');
const DATE = '2026-09-16'; // file-name prefix only (kept so every existing link resolves)
const read = (p) => (fs.existsSync(path.join(ROOT, p)) ? fs.readFileSync(path.join(ROOT, p), 'utf8') : '');
const runs = ['workspace/test-suites/api-contract/last-run.json', 'workspace/test-suites/web/last-run.json']
  .map((p) => ({ p, j: read(p) ? JSON.parse(read(p)) : null })).filter((r) => r.j);
// The date the reports state is the date the runs actually happened (Law 2), per run file.
const RUN_DATE = runs.map((r) => String(r.j.finishedAt || r.j.startedAt || '').slice(0, 10)).filter(Boolean).sort().pop() || 'unknown';
const runDates = (platforms) => runs.filter((r) => platforms.has(r.p.includes('/web/') ? 'web (staging)' : 'API V2 (staging)')).map((r) => `${r.p.includes('/web/') ? 'web' : 'API'} ${String(r.j.finishedAt || '').slice(0, 16).replace('T', ' ')} UTC`).join(' · ');

// flows.md → name + criticality
const flows = {};
for (const l of read('brain/context/flows.md').split('\n')) {
  // The criticality pattern goes first: the name-only pattern also matches the feature rows and would win.
  const m = l.match(/^\|\s*\**(F\d{2})\**\s+([^|]+?)\s*\|\s*\**(BLOCKER|HIGH|MEDIUM|LOW)\**[^|]*\|/) || l.match(/^\|\s*\**(F\d{2})\**\s+([^|]+?)\s*\|/);
  if (m && !(flows[m[1]] && flows[m[1]].crit)) flows[m[1]] = { name: m[2].trim().replace(/\*/g, ''), crit: (m[3] || '').trim() };
}
// parity-map.md → status line per feature
const parity = {};
for (const l of read('brain/context/parity-map.md').split('\n')) {
  const m = l.match(/^\|\s*(F\d{2})\b[^|]*\|(.+)$/);
  if (m) { const cells = m[2].split('|').map((c) => c.trim()); parity[m[1]] = cells[4] || cells[cells.length - 2] || ''; }
}
// evidence-ledger.md → EV-ids mentioning each feature
const evByFeature = {};
for (const l of read('brain/context/evidence-ledger.md').split('\n')) {
  const ev = (l.match(/\bEV-[A-Z]\d{2}\b/) || [])[0]; if (!ev) continue;
  for (const f of l.match(/\bF\d{2}\b/g) || []) (evByFeature[f] = evByFeature[f] || new Set()).add(ev);
}

// Collect cases per feature from the runs.
const feat = {};
for (const { p, j } of runs) {
  const platform = p.includes('/web/') ? 'web (staging)' : 'API V2 (staging)';
  for (const r of j.results) {
    const f = (feat[r.flow] = feat[r.flow] || { platform: new Set(), cases: [] });
    f.platform.add(platform); f.cases.push({ ...r, platform });
  }
}

// brain/skills/territool-test/SKILL.md §2 — "all required, or N/A + reason".
const COVERAGE_TYPES = ['happy', 'validation', 'permission', 'negative', 'offline', 'edge-data', 'parity', 'regression', 'visual', 'security'];
const NA_FILE = 'workspace/test-cases/coverage-na.json';
const NA = read(NA_FILE) ? JSON.parse(read(NA_FILE)) : {};
const GENERIC = /^\s*(n\/?a|na|none|not applicable|not relevant|does not apply|-+)\s*\.?\s*$/i;
/** A reason must say why, specifically: at least 25 characters and not a stock phrase. */
const naVerdict = (reason) => {
  if (typeof reason !== 'string' || !reason.trim()) return 'missing reason';
  if (GENERIC.test(reason) || /^not applicable\b/i.test(reason.trim()) && reason.trim().length < 40) return 'generic reason';
  if (reason.trim().length < 25) return 'reason too short';
  return null;
};

const WEIGHT = { BLOCKER: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
const PATHS = { F01: 'workspace/qa-reports/2026-09-16-f01-login-api-contract.md' }; // keeps its original path and links
const reportPath = (flow, name) => PATHS[flow]
  || `workspace/qa-reports/${DATE}-${flow.toLowerCase()}-${(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || flow.toLowerCase()).slice(0, 40)}.md`;

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
let changed = 0;
// Compare only the content qa-report owns, ignoring blank-line/whitespace reflow that obsidian-sync applies
// to the frontmatter (it does not change meaning). Real content changes still differ.
const LINKS = '%% brain-links:start';
const body = (t) => (t.includes(LINKS) ? t.slice(0, t.indexOf(LINKS)) : t)
  .split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l !== '').join('\n');
const write = (file, text) => {
  const prev = read(file); const full = path.join(ROOT, file);
  let out = text;
  if (prev && prev.includes(LINKS)) out = `${text.replace(/\s*$/, '')}\n\n${prev.slice(prev.indexOf(LINKS))}`;
  if (body(prev) === body(out)) return;          // compare only the part qa-report owns; sync owns the link block
  changed++; if (!CHECK) fs.writeFileSync(full, out);
  console.log(`${CHECK ? 'would write' : 'wrote'} ${file}`);
};

// A report that was written by hand keeps that text, verbatim, as an appendix under the generated part.
const APPENDIX = '<!-- qa-report:appendix — hand-written text below is kept verbatim; the generator owns everything above -->';
function appendixFor(file) {
  const prev = read(file);
  if (!prev) return '';
  const cut = (t) => (t.includes(LINKS) ? t.slice(0, t.indexOf(LINKS)) : t).replace(/\s+$/, '');
  if (prev.includes(APPENDIX)) return cut(prev.slice(prev.indexOf(APPENDIX)));
  if (/Generated by `tools\/qa-report\.js`/.test(prev)) return '';
  let old = cut(prev);
  if (old.startsWith('---\n')) old = old.slice(old.indexOf('\n---\n', 3) + 5);
  old = old.replace(/^#\s+/m, '### ')                                   // one H1 per note
    .replace(/^(\*\*Verdict:)/gim, '> *(historical — superseded by the generated verdict above)* $1'); // scorer reads only the first verdict
  return [APPENDIX, '', `## Appendix — hand-written record (moved here ${new Date().toISOString().slice(0, 10)})`, '',
    'Kept verbatim except: its H1 became H3, and its verdict line is prefixed as historical so it cannot be read as the current verdict.', '',
    old.trim()].join('\n');
}

const summaryRows = [];
for (const [flow, f] of Object.entries(feat).sort()) {
  const cases = f.cases;
  const n = (v) => cases.filter((c) => c.verdict === v).length;
  const pass = n('PASS'); const fail = n('FAIL'); const gap = n('KNOWN GAP');
  const waived = cases.filter((c) => c.blockedReason && /waived/i.test(c.blockedReason)).length;
  const blocked = cases.filter((c) => c.verdict === 'BLOCKED' && !/waived/i.test(c.blockedReason || '')).length;
  const executed = pass + fail + gap;

  const ran = (t) => cases.filter((c) => c.type === t && ['PASS', 'FAIL', 'KNOWN GAP'].includes(c.verdict)).length;
  const naDecl = NA[flow] || {};
  const na = {}; const naRejected = {};
  for (const [t, reason] of Object.entries(naDecl)) {
    if (!COVERAGE_TYPES.includes(t)) { naRejected[t] = 'unknown coverage type'; continue; }
    const bad = naVerdict(reason);
    if (bad) naRejected[t] = bad; else na[t] = reason.trim();
  }
  const applicable = COVERAGE_TYPES.filter((t) => !na[t] || ran(t));   // a type that ran counts even if declared N/A
  const covered = applicable.filter((t) => ran(t));
  const missing = applicable.filter((t) => !ran(t));
  const parityOpen = /accidentally different/i.test(parity[flow] || '');
  const verdict = fail ? 'FAIL'
    : (executed === 0 || missing.length || parityOpen) ? 'PARTIAL'
    : (gap || blocked || waived) ? 'PASS-WITH-NOTES' : 'PASS';
  const info = flows[flow] || { name: flow, crit: '' };
  const evs = [...(evByFeature[flow] || [])].sort();
  const mobile = /\b(F01|F05|F06|F08|F11|F12|F20)\b/.test(flow) && evs.some((e) => e.startsWith('EV-M'));
  const file = reportPath(flow, info.name);
  summaryRows.push({ flow, name: info.name, crit: info.crit, covered: covered.length, applicable: applicable.length, missing, verdict, file, parityOpen });

  const status = (t) => (ran(t) ? 'covered' : na[t] ? `N/A — ${esc(na[t])}` : naRejected[t] ? `NOT COVERED (N/A rejected: ${naRejected[t]})` : 'NOT COVERED');
  const appendix = appendixFor(file);
  const lines = [
    '---', 'area: workspace', 'tags: [brain/workspace]', `ref: "${flow} QA report — ${info.name}"`, '---', '',
    `# ${flow} QA report — ${info.name}`, '',
    `**Verdict: ${verdict}.** Generated by \`tools/qa-report.js\` from the real suite runs (${runDates(f.platform)}); it reflects cases actually executed, not code inspection. Re-run: \`node tools/qa-report.js\`.`, '',
    `**Coverage: ${covered.length} of ${applicable.length} applicable types** (${COVERAGE_TYPES.length - applicable.length} justified N/A) · criticality ${info.crit || '—'} · ranking: \`workspace/qa-reports/QA-COVERAGE.md\``, '',
    '## Environment', '',
    `- **Runs:** ${runDates(f.platform)}`,
    `- **Platform(s):** ${[...f.platform].join(', ')}${mobile ? ' + mobile (second simulator, Maestro; build per the `EV-M*` rows)' : ''}`,
    `- **Criticality:** ${info.crit || '—'}`,
    `- **Execution mode:** Manual (no CI; run on demand — CI tracked in UPCOMING_IMPROVEMENTS.md)`,
    '- **Safety:** staging only; credentials read from `.local/` at run time and never printed; only endpoints scanned as non-mutating were called; no credit-spend or purchase step was run.', '',
    '## Cases executed', '',
    '| ID | Type | Role | Verdict | Assertions | Note |', '|---|---|---|---|---|---|',
    ...cases.map((c) => `| ${c.id} | ${c.type} | ${c.role} | ${c.verdict} | ${c.checks} | ${esc(c.knownGap ? `known gap ${c.knownGap}` : c.blockedReason || '')} |`),
    '',
    `## Summary`, '',
    `- **Passed:** ${pass}  ·  **Failed:** ${fail}  ·  **Known gap:** ${gap}  ·  **Blocked:** ${blocked}  ·  **Waived (owner):** ${waived}`,
    `- **Total assertions:** ${cases.reduce((a, c) => a + c.checks, 0)}`,
    `- **Machine-readable:** ${runs.map((r) => r.p).filter((p) => (p.includes('/web/') ? f.platform.has('web (staging)') : f.platform.has('API V2 (staging)'))).map((p) => `\`${p}\``).join(', ')}`,
    '',
    '## Coverage', '',
    `Types from \`territool-test\` §2, counted as run ÷ applicable. A type is N/A only with a specific written reason in \`${NA_FILE}\`${read(NA_FILE) ? '' : ' (file not created yet — no N/A declared)'}; a missing or generic reason counts as not run.`, '',
    '| Type | Executed cases | Status |', '|---|---|---|',
    ...COVERAGE_TYPES.map((t) => `| ${t} | ${ran(t)} | ${status(t)} |`),
    '',
    parityOpen ? '- **Open parity divergence** (parity-map says "accidentally different"): this feature cannot pass QA until it is resolved or approved as intentional.' : '',
    '',
    '## Runtime & cross-platform evidence', '',
    evs.length ? `- Evidence ledger: ${evs.map((e) => `\`${e}\``).join(', ')} (\`brain/context/evidence-ledger.md\`)` : '- (no ledger evidence id recorded)',
    mobile ? '- Mobile runtime confirmed on the second simulator (see the `EV-M*` rows).' : '',
    `- **Parity:** ${esc(parity[flow] || 'see parity-map.md')}`,
    '',
    '## Known issues (not fixed — application code frozen)', '',
    `- Any \`known gap\` above is documented in \`UPCOMING_IMPROVEMENTS.md\` / \`known-fragile.md\`; none was introduced or worsened by this QA (all cases are read-only).`,
    '',
    '## Not covered / blockers', '',
    ...cases.filter((c) => c.verdict === 'BLOCKED').map((c) => `- ${c.id}: ${esc(c.blockedReason || 'blocked')}`),
    missing.length ? `- No executed case for: ${missing.join(', ')} (see Coverage).` : '',
    '- Write flows and paid steps are out of scope for this run (see the feature matrix in `TASK_CONFIDENCE_LOOP.md`).',
    '',
    `## Final QA confidence`, '',
    verdict === 'PASS' ? 'Every applicable coverage type has an executed, passing case on staging.'
      : verdict === 'PASS-WITH-NOTES' ? 'Every applicable coverage type ran; the notes are pre-existing known gaps or owner-waived steps, not new defects.'
      : verdict === 'PARTIAL' ? (executed === 0
        ? '**Not a passing QA:** every case for this feature is blocked or waived by an external constraint (payment sandbox / access). Recorded so the gap is visible, not to claim confidence.'
        : `**Not a passing QA:** the ${executed} executed case(s) ran without failure, but ${[missing.length ? `${missing.length} applicable coverage type(s) have no executed case (${missing.join(', ')})` : '', parityOpen ? 'the parity divergence is open' : ''].filter(Boolean).join(' and ')}. The result covers only what the table shows.`)
      : '**FAIL:** a case failed — see the table.',
    '',
    appendix,
  ].filter((x) => x !== '').join('\n');
  write(file, lines);
}

// ---------------------------------------------------------------- ranking: what to QA next
// Coverage is the primary signal (every verdict is PARTIAL today, so the verdict alone ranks nothing).
// priority = criticality weight × share of applicable types not yet run.
const ranked = summaryRows.map((r) => ({ ...r, priority: Math.round((WEIGHT[r.crit] || 1) * (1 - r.covered / r.applicable) * 100) / 100 }))
  .sort((a, b) => b.priority - a.priority || a.covered / a.applicable - b.covered / b.applicable || a.flow.localeCompare(b.flow));
const untested = Object.keys(flows).filter((f) => !feat[f]).sort()
  .sort((a, b) => (WEIGHT[flows[b].crit] || 0) - (WEIGHT[flows[a].crit] || 0));
write('workspace/qa-reports/QA-COVERAGE.md', [
  '---', 'area: workspace', 'tags: [brain/workspace]', 'ref: "QA coverage ranking — what to test next"', '---', '',
  '# QA coverage ranking — what to test next', '',
  `Generated by \`tools/qa-report.js\` from the suite runs of ${RUN_DATE}. **Coverage is the primary sort key**; the verdict is secondary.`,
  '**Priority = criticality weight (BLOCKER 4 · HIGH 3 · MEDIUM 2 · LOW 1) × share of applicable coverage types with no executed case.**', '',
  '## Features with executed cases', '',
  '| Rank | Feature | Criticality | Coverage | Priority | Missing types | Verdict | Report |', '|---:|---|---|---|---:|---|---|---|',
  ...ranked.map((r, i) => `| ${i + 1} | ${r.flow} ${esc(r.name)} | ${r.crit || '—'} | ${r.covered}/${r.applicable} | ${r.priority.toFixed(2)} | ${r.missing.join(', ') || '—'}${r.parityOpen ? ' · **parity open**' : ''} | ${r.verdict} | \`${r.file}\` |`),
  '',
  '## Features with no executed case at all', '',
  'No suite has run for these, so they need test cases before they can be ranked. Blockers per feature: `TASK_CONFIDENCE_LOOP.md` ("Blockers, classified").', '',
  '| Feature | Criticality |', '|---|---|',
  ...untested.map((f) => `| ${f} ${esc(flows[f].name)} | ${flows[f].crit || '—'} |`),
  '',
].join('\n'));

console.log(changed ? `${changed} file(s) ${CHECK ? 'stale' : 'written'}` : 'qa reports current');
process.exit(CHECK && changed ? 1 : 0);
