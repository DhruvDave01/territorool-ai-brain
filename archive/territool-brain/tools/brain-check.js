#!/usr/bin/env node
/**
 * One command that runs every brain self-check and reports a single table.
 *
 *   node tools/brain-check.js          # run all checks
 *   node tools/brain-check.js --strict # exit 1 if any FAILs (the generators' drift + wiki-lint fails)
 *
 * It does NOT rebuild anything (that is brain-sync.js). It only verifies that the generated notes are current,
 * the two graph views agree, citations have not drifted, the knowledge lints clean, and the tools' self-tests pass.
 */
const { execFileSync } = require('child_process');
const path = require('path');

const HERE = __dirname;
const node = process.execPath;
const run = (script, args = []) => {
  try { const out = execFileSync(node, [path.join(HERE, script), ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); return { ok: true, out }; }
  catch (e) { return { ok: false, out: `${e.stdout || ''}${e.stderr || ''}` }; }
};
const tail = (s) => (s.trim().split('\n').pop() || '').trim();

// [label, script, args, treatNonZeroAsFail]
const CHECKS = [
  ['api-map current', 'api-map.js', ['--check'], true],
  ['data-model current', 'data-model.js', ['--check'], true],
  ['web-flows current', 'web-inventory.js', ['--check'], true],
  ['test-cases current', 'test-cases-doc.js', ['--check'], true],
  ['qa-reports current', 'qa-report.js', ['--check'], true], // freshness only; sync rewrites the link block, so non-fatal
  ['citations (no drift)', 'cite-check.js', ['--strict'], true],
  ['api-map self-test', 'api-map.selftest.js', [], true],
  ['brain-score self-test', 'brain-score.js', ['--self-test'], true],
  ['graph ↔ vault parity', 'brain-parity.js', ['--quiet'], true],
  ['hub map current', 'hub-map.js', ['--check'], true],
  ['knowledge lint', 'wiki-lint.js', ['--strict'], true],
  ['versions self-test', 'lib/versions.js', ['--self-test'], true],
  ['memory self-test', 'memory.js', ['--self-test'], true],
  ['memory lint', 'memory.js', ['lint', '--strict'], true],
  ['memory registers render', 'memory.js', ['render', '--check'], true],
  ['memory views current', 'memory.js', ['reindex', '--check'], true],
  ['static-checks self-test', '../brain/gates/scripts/static-checks.selftest.js', [], true],
  ['notes re-validate', 'note-revalidate.js', [], true],
];

const fatalMap = Object.fromEntries(CHECKS.map(([l,,,f]) => [l, f]));
const rows = [];
for (const [label, script, args] of CHECKS) {
  try { require('fs').accessSync(path.join(HERE, script)); } catch { rows.push([label, 'SKIP', 'tool not present']); continue; }
  const r = run(script, args);
  const fatal = fatalMap[label] !== false;
  rows.push([label, r.ok ? 'PASS' : (fatal ? 'FAIL' : 'WARN'), tail(r.out)]);
}

const w = Math.max(...rows.map((r) => r[0].length));
for (const [label, status, note] of rows) console.log(`${status === 'PASS' ? '✓' : status === 'WARN' ? '⚠' : status === 'SKIP' ? '·' : '✗'} ${label.padEnd(w)}  ${note}`);
const fails = rows.filter((r) => r[1] === 'FAIL').length;
console.log(`\nbrain-check: ${rows.filter((r) => r[1] === 'PASS').length}/${rows.length} passed${fails ? `, ${fails} FAILED` : ''}`);
process.exit(process.argv.includes('--strict') && fails ? 1 : 0);
