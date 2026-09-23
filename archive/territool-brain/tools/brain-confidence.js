#!/usr/bin/env node
/**
 * Brain confidence score — how far an agent can trust this brain today (rubric: brain/context/brain-confidence.md).
 * Every point comes from a measured signal. Owner-only signals are reported separately as the ceiling.
 *
 *   node tools/brain-confidence.js           # table + total
 *   node tools/brain-confidence.js --json    # machine-readable
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./lib/vault.js');

const read = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; } };
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const run = (args, opts = {}) => {
  try { return { code: 0, out: execFileSync(args[0], args.slice(1), { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...opts }) }; }
  catch (e) { return { code: e.status || 1, out: `${e.stdout || ''}${e.stderr || ''}` }; }
};
const node = (script, ...a) => run([process.execPath, path.join(ROOT, script), ...a]);
const clamp = (x) => Math.max(0, Math.min(1, x));
const W = { BLOCKER: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

const rows = [];
const add = (area, id, label, weight, frac, detail, owner = false) => rows.push({ area, id, label, weight, frac: clamp(frac), points: +(weight * clamp(frac)).toFixed(2), detail, owner });

// ---------------------------------------------------------------- A. knowledge
const cite = node('tools/cite-check.js').out;
const ok = +(cite.match(/OK (\d+)/) || [])[1] || 0;
const drift = +(cite.match(/DRIFT (\d+)/) || [])[1] || 0;
const oor = +(cite.match(/OUT-OF-RANGE (\d+)/) || [])[1] || 0;
add('A', 'a1', 'citations do not drift', 5, ok + drift + oor ? ok / (ok + drift + oor) : 0, `OK ${ok} · drift ${drift} · out-of-range ${oor}`);
let lintJson = { findings: [], counts: {} };
try { lintJson = JSON.parse(node('tools/wiki-lint.js', '--json').out); } catch { /* keep empty */ }
const uncited = lintJson.findings.filter((f) => f.rule === 'uncited').length;
add('A', 'a2', 'no uncited derived-truth note', 4, (4 - uncited) / 4, `${uncited} uncited note(s)`);
add('A', 'a3', 'knowledge lint has 0 FAIL', 3, (lintJson.counts.FAIL || 0) === 0 ? 1 : 0, `${lintJson.counts.FAIL || 0} FAIL`);
const score = node('tools/brain-score.js').out;
const feats = [...score.matchAll(/^(F\d{2}) .+?\s(BLOCKER|HIGH|MEDIUM|LOW)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*$/gm)]
  .map((m) => ({ f: m[1], crit: m[2], code: +m[3], beh: +m[4], par: +m[5] }));
const know = feats.length ? feats.reduce((n, x) => n + (x.code + x.beh + x.par) / 60, 0) / feats.length : 0;
add('A', 'a4', 'feature knowledge (code + behaviour + parity)', 8, know, `${feats.length} features · mean ${(know * 100).toFixed(1)}%`);

// ---------------------------------------------------------------- B. tooling
const check = node('tools/brain-check.js');
const [, ckPass, ckTotal] = check.out.match(/brain-check: (\d+)\/(\d+) passed/) || [0, 0, 1];
add('B', 'b1', 'brain-check pass ratio', 9, +ckPass / +ckTotal, `${ckPass}/${ckTotal}`);
const parity = node('tools/brain-parity.js', '--quiet');
add('B', 'b2', 'graph ↔ vault parity', 2, parity.code === 0 ? 1 : 0, parity.code === 0 ? 'OK' : 'FAILED');
const hook = read('.claude/settings.json');
add('B', 'b3', 'Stop hook is portable', 2, /\/Users\/|\/home\//.test(hook) ? 0 : 1, /\/Users\//.test(hook) ? 'absolute path in hook' : 'uses $CLAUDE_PROJECT_DIR');
const agents = node('tools/sync-agent-files.js', '--check');
add('B', 'b4', 'generated agent files current', 2, agents.code === 0 ? 1 : 0, agents.code === 0 ? 'current' : 'stale');

// ---------------------------------------------------------------- C. verified behaviour
const cov = read('workspace/qa-reports/QA-COVERAGE.md');
const covered = new Map();
for (const m of cov.matchAll(/^\| \d+ \| (F\d{2}) [^|]*\| (BLOCKER|HIGH|MEDIUM|LOW|—) \| (\d+)\/(\d+) \|/gm)) covered.set(m[1], { crit: m[2], c: +m[3], a: +m[4] });
const allF = [];
for (const l of read('brain/context/flows.md').split('\n')) {
  const m = l.match(/^\|\s*\**(F\d{2})\**\s+[^|]+?\|\s*\**(BLOCKER|HIGH|MEDIUM|LOW)/);
  if (m && !allF.some((x) => x.f === m[1])) allF.push({ f: m[1], crit: m[2] });
}
const wsum = allF.reduce((n, x) => n + W[x.crit], 0) || 1;
const wcov = allF.reduce((n, x) => { const c = covered.get(x.f); return n + W[x.crit] * (c && c.a ? c.c / c.a : 0); }, 0) / wsum;
const wany = allF.reduce((n, x) => n + (covered.has(x.f) ? W[x.crit] : 0), 0) / wsum;
add('C', 'c1', 'criticality-weighted coverage, all features', 14, wcov, `${(wcov * 100).toFixed(1)}% over ${allF.length} features (${covered.size} with runs)`);
add('C', 'c2', 'weighted share of features with executed cases', 4, wany, `${(wany * 100).toFixed(1)}%`);
const lastRuns = ['workspace/test-suites/api-contract/last-run.json', 'workspace/test-suites/web/last-run.json'].map((p) => { try { return JSON.parse(read(p)); } catch { return null; } }).filter(Boolean);
const fails = lastRuns.reduce((n, j) => n + (j.summary ? j.summary.fail : 0), 0);
add('C', 'c3', 'last runs have 0 FAIL', 2, fails === 0 && lastRuns.length ? 1 : 0, `${fails} FAIL in ${lastRuns.length} run file(s)`);
const age = lastRuns.length ? Math.max(...lastRuns.map((j) => (Date.now() - Date.parse(j.finishedAt || j.startedAt)) / 86400000)) : 99;
add('C', 'c4', 'last runs ≤ 7 days old', 2, age <= 7 ? 1 : 0, `oldest ${age.toFixed(1)} day(s)`);
const ciFiles = ['.github/workflows', 'bitbucket-pipelines.yml'].filter(exists);
const ci = ciFiles.some((p) => { const s = fs.statSync(path.join(ROOT, p)); return s.isDirectory() ? fs.readdirSync(path.join(ROOT, p)).some((f) => /run\.js/.test(read(`${p}/${f}`))) : /run\.js/.test(read(p)); });
add('C', 'c5', 'CI runs the suites', 3, ci ? 1 : 0, ci ? 'workflow found' : 'no CI workflow runs the suites', true);

// ---------------------------------------------------------------- D. memory
const mem = require('./memory.js');
const migrated = mem.REGISTERS.filter((r) => exists(`brain/memory/_templates/${r.name}.md`)).length;
add('D', 'd1', 'registers migrated', 3, migrated / mem.REGISTERS.length, `${migrated}/${mem.REGISTERS.length}`);
const ml = mem.lint();
add('D', 'd2', 'memory lint clean', 2, ml.errs.length === 0 ? 1 : 0, `${ml.errs.length} error(s) over ${ml.n} entries`);
const rend = node('tools/memory.js', 'render', '--check').code === 0 && node('tools/memory.js', 'reindex', '--check').code === 0;
add('D', 'd3', 'registers render and views current', 2, rend ? 1 : 0, rend ? 'current' : 'stale');
const cap = mem.captureRate();
const capT = cap.reduce((n, x) => n + x.total, 0);
const capC = cap.reduce((n, x) => n + x.captured + x.nonTrigger, 0);
add('D', 'd4', 'commit capture (90 days)', 3, capT ? capC / capT : 0, cap.map((x) => `${x.repo} ${x.captured}+${x.nonTrigger}/${x.total}`).join(' · '));
const ents = mem.listEntries();
const withImpl = ents.filter((e) => e.implication && e.implication.trim().length >= 10).length;
add('D', 'd5', 'entries with an implication', 2, ents.length ? withImpl / ents.length : 0, `${withImpl}/${ents.length}`);
const st = mem.readSyncState();
const behind = st ? Object.entries({ mobile: 'repos/mobile', web: 'repos/web' }).reduce((n, [k, r]) => n + (+run(['git', '-C', path.join(ROOT, r), 'rev-list', '--count', `${st.heads[k]}..HEAD`]).out || 0), 0) : 99;
add('D', 'd6', 'LAST-SYNC complete, 0 behind', 2, st && st.result === 'COMPLETE' && behind === 0 ? 1 : 0, st ? `${st.result} · ${behind} behind` : 'never synced');
const loop = read('brain/skills/territool-router/LOOP.md');
const wiring = [/memory\.js sync/.test(loop), /memory\.js context/.test(loop), /memory\.js impact/.test(loop), /QG-13/.test(read('brain/gates/qa-gate.md')), /KNOWLEDGE MEMORY IS MANDATORY/.test(read('CLAUDE.md'))];
add('D', 'd7', 'loop wiring present', 3, wiring.filter(Boolean).length / wiring.length, `${wiring.filter(Boolean).length}/${wiring.length}`);
const cmds = ['status', 'context', 'impact', 'learn', 'history', 'sync', 'audit', 'ingest', 'promote', 'reindex', 'supersede'].filter((c) => exists(`.claude/commands/memory-${c}.md`)).length;
add('D', 'd8', '/memory-* commands exist', 1, cmds / 11, `${cmds}/11`);
const depth = allF.filter((x) => ents.some((e) => e.fm.origin !== 'manual-commit' && (e.fm.features || []).includes(x.f))).length;
add('D', 'd9', 'features with non-commit knowledge', 2, allF.length ? depth / allF.length : 0, `${depth}/${allF.length}`);

// ---------------------------------------------------------------- E. safety
// Anything not explicitly closed counts as open: an incident waiting for revalidation is not resolved.
const openInc = ents.filter((e) => e.fm.type === 'incident' && !['RESOLVED', 'SUPERSEDED', 'HISTORICAL', 'DEPRECATED'].includes(e.fm.status)).length;
add('E', 'e1', 'no OPEN incident', 3, openInc ? 0 : 1, `${openInc} open`, true);
const cfg = read('repos/mobile/App/config/index.js');
const pointers = [
  /^export const URL_BASE\s*=\s*'https:\/\/app\.territool\.com/m.test(cfg),
  /app\.territool\.com/.test(read('repos/web/.codex/config.toml')),
  /app\.territool\.com/.test(read('repos/web/.cursor/mcp.json')),
];
const active = pointers.filter(Boolean).length;
add('E', 'e2', 'no production pointer active', 3, (3 - active) / 3, `${active}/3 active (mobile URL_BASE, Codex MCP, Cursor MCP)`, true);
const guards = [
  /staging\\\.territool\\\.com/.test(read('workspace/test-suites/api-contract/lib/env.js')),
  /Refusing: pass --env staging/.test(read('workspace/test-suites/web/run.js')),
  /S-prod/.test(read('brain/gates/scripts/static-checks.js')),
  /INTAKE production check/.test(loop),
  /QG-14/.test(read('brain/gates/qa-gate.md')),
];
add('E', 'e3', 'staging guards present', 2, guards.filter(Boolean).length / guards.length, `${guards.filter(Boolean).length}/${guards.length}`);
const secretErrs = ml.errs.filter((e) => /possible /.test(e)).length;
add('E', 'e4', 'no secret in memory', 2, secretErrs ? 0 : 1, `${secretErrs} finding(s)`);

// ---------------------------------------------------------------- F. team readiness
const isGit = run(['git', 'rev-parse', '--is-inside-work-tree']).out.trim() === 'true';
add('F', 'f1', 'brain under git', 1, isGit ? 1 : 0, isGit ? 'yes' : 'no');
const dirty = isGit ? run(['git', 'status', '--porcelain']).out.split('\n').filter(Boolean).length : -1;
add('F', 'f2', 'working tree committed', 3, dirty === 0 ? 1 : 0, `${dirty} uncommitted path(s)`, true);
const remotes = isGit ? run(['git', 'remote']).out.trim() : '';
add('F', 'f3', 'git remote configured', 2, remotes ? 1 : 0, remotes || 'none', true);
const doc = node('tools/doctor.js', '--all');
add('F', 'f4', 'doctor.js --all passes', 2, doc.code === 0 ? 1 : 0, `exit ${doc.code}`);
const backup = ents.some((e) => (e.fm.labels || []).includes('backup-confirmed'));
add('F', 'f5', 'video backup confirmed', 2, backup ? 1 : 0, backup ? 'confirmed' : 'not confirmed', true);

// ---------------------------------------------------------------- report
const total = rows.reduce((n, r) => n + r.points, 0);
const ceiling = rows.reduce((n, r) => n + (r.owner ? r.weight : r.points), 0);
const areas = ['A', 'B', 'C', 'D', 'E', 'F'];
const NAMES = { A: 'Product and code knowledge', B: 'Tooling and integrity', C: 'Verified behaviour', D: 'Memory and continuity', E: 'Safety', F: 'Team readiness' };
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ at: new Date().toISOString(), total: +total.toFixed(1), ceilingWithOwnerActions: +ceiling.toFixed(1), rows }, null, 2));
} else {
  console.log(`Brain confidence · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · rubric brain/context/brain-confidence.md\n`);
  for (const a of areas) {
    const rs = rows.filter((r) => r.area === a);
    const w = rs.reduce((n, r) => n + r.weight, 0); const p = rs.reduce((n, r) => n + r.points, 0);
    console.log(`${a}. ${NAMES[a].padEnd(28)} ${p.toFixed(1).padStart(5)} / ${w}`);
    for (const r of rs) console.log(`   ${r.id} ${r.label.padEnd(46)} ${r.points.toFixed(2).padStart(5)} / ${r.weight}${r.owner ? '  [owner]' : ''}   ${r.detail}`);
  }
  console.log(`\nTOTAL ${total.toFixed(1)} / 100`);
  console.log(`Owner-only signals still open: ${rows.filter((r) => r.owner && r.frac < 1).map((r) => r.id).join(', ') || 'none'} → ${(ceiling - total).toFixed(1)} point(s) that only owner actions can add (ceiling ${ceiling.toFixed(1)}).`);
}
