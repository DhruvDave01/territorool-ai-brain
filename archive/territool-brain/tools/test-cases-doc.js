#!/usr/bin/env node
/**
 * Keeps workspace/test-cases/ in step with the API contract suite (format: brain/audits/05-testing.md §6).
 *
 *   node tools/test-cases-doc.js          # (re)write <flow>-<slug>.md/.csv for every suite that declares `slug`,
 *                                         # and rebuild every CSV from its Markdown table (fixes quoting)
 *   node tools/test-cases-doc.js --check  # exit 1 if anything would change
 *
 * Suites without `slug` (F01-login.js) keep their hand-written Markdown; only their CSV is regenerated from it.
 * Status and Last run come from workspace/test-suites/api-contract/last-run.json.
 */
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/vault.js');

const OUT = path.join(ROOT, 'workspace/test-cases');
// Suite families: api-contract (V2 API) and web (session-level web/portal). Each has cases/ and last-run.json.
const FAMILIES = [
  { dir: 'workspace/test-suites/api-contract', platform: 'api', cmd: (f) => `node workspace/test-suites/api-contract/run.js --env staging --only ${f}`, label: 'staging API v2' },
  { dir: 'workspace/test-suites/web', platform: 'web', cmd: (f) => `cd tools && PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" node ../workspace/test-suites/web/run.js --env staging --only ${f}`, label: 'staging web' },
];
const CHECK = process.argv.includes('--check');
const HEAD = ['ID', 'Flow', 'Title', 'Platform', 'Role', 'Priority', 'Type', 'Preconditions', 'Test data', 'Steps', 'Expected result', 'Rule / target refs', 'Known gap', 'Evidence', 'Automation', 'Status', 'Last run'];
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const csvCell = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const STATUS = { PASS: 'Pass', FAIL: 'Fail', BLOCKED: 'Blocked', 'KNOWN GAP': 'Known gap' };
let changed = 0;
const write = (file, text) => {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  // Keep the vault's managed link block (obsidian-sync owns it), so the two generators never fight.
  if (prev && file.endsWith('.md') && prev.includes('%% brain-links:start')) text = `${text.replace(/\s*$/, '')}\n\n${prev.slice(prev.indexOf('%% brain-links:start'))}`;
  if (prev === text) return;
  changed++;
  if (!CHECK) fs.writeFileSync(file, text);
  console.log(`${CHECK ? 'would update' : 'wrote'} ${path.relative(ROOT, file)}`);
};

// 1. Generated case files.
for (const fam of FAMILIES) {
const CASES = path.join(ROOT, fam.dir, 'cases');
if (!fs.existsSync(CASES)) continue;
const RUN = path.join(ROOT, fam.dir, 'last-run.json');
const run = fs.existsSync(RUN) ? JSON.parse(fs.readFileSync(RUN, 'utf8')) : { results: [], finishedAt: '' };
const byId = Object.fromEntries(run.results.map((r) => [r.id, r]));
for (const f of fs.readdirSync(CASES).filter((x) => x.endsWith('.js')).sort()) {
  const suite = require(path.join(CASES, f));
  if (!suite.slug) continue;
  const last = run.finishedAt ? `${run.finishedAt.slice(0, 10)} · ${fam.label}` : 'not run';
  const rows = suite.cases.map((c) => {
    const r = byId[c.id];
    return [c.id, suite.flow, c.title, fam.platform, c.role, suite.priority, c.type, c.pre || '—', c.role === 'Public' ? 'none (no token)' : `\`.local\` role "${c.role}" (never raw)`, c.steps || '—', c.expected || '—', (c.refs || []).join(', ') || '—', c.knownGap || '—',
      r ? `${fam.dir}/last-run.json ${c.id} (${r.checks} assertions)` : 'not run', `${fam.platform}: ${fam.dir}/cases/${f}`, r ? (r.verdict === 'BLOCKED' && /^Waived/.test(r.blockedReason || '') ? 'Waived (owner)' : STATUS[r.verdict] || r.verdict) : 'Not run', r ? last : '—'];
  });
  const title = `Test cases — ${suite.flow} ${suite.title} (${suite.priority})`;
  const md = [
    '---', 'area: workspace', 'tags: [brain/workspace]', `ref: "${title}"`, '---', '', `# ${title}`, '',
    'Format: `brain/audits/05-testing.md` §6. **Generated** from the suite file by `node tools/test-cases-doc.js`; edit the suite, not this page.', '',
    `**Contract source:** ${suite.source || 'see the suite file'}.`, '',
    '**Exact command (from `territool-brain/`):**', '', '```bash', fam.cmd(suite.flow), '```', '',
    '**Safety:** staging only; credentials read from `.local/` at run time and never printed; every endpoint here was scanned for writes before it was added; one cached login per role (`lib/session.js`), which inserts one `usertoken` row per role per run.', '',
    '## Cases', '', `| ${HEAD.join(' | ')} |`, `|${HEAD.map(() => '---').join('|')}|`,
    ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`), '',
  ].join('\n');
  const base = path.join(OUT, `${suite.flow}-${suite.slug}`);
  write(`${base}.md`, md);
}
}

// 2. Every CSV rebuilt from its Markdown table (the one source of truth for hand-written cases too).
for (const f of fs.readdirSync(OUT).filter((x) => x.endsWith('.md'))) {
  const text = CHECK && !fs.existsSync(path.join(OUT, f)) ? '' : fs.readFileSync(path.join(OUT, f), 'utf8');
  const lines = text.split('\n');
  const h = lines.findIndex((l) => l.startsWith('| ID |'));
  if (h < 0) continue;
  const splitRow = (l) => l.slice(1, -1).split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
  const out = [splitRow(lines[h])];
  for (let i = h + 2; i < lines.length && lines[i].startsWith('|'); i++) out.push(splitRow(lines[i]));
  write(path.join(OUT, f.replace(/\.md$/, '.csv')), `${out.map((r) => r.map(csvCell).join(',')).join('\n')}\n`);
}
console.log(changed ? `${changed} file(s) ${CHECK ? 'stale' : 'updated'}` : 'test-cases are current');
process.exit(CHECK && changed ? 1 : 0);
