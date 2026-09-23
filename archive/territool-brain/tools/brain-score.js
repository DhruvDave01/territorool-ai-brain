#!/usr/bin/env node
/**
 * Confidence score: how well the brain equips an agent to take a task on each product feature.
 *
 * It scores what the brain HOLDS, not how capable the agent is. Formula approved by the owner
 * 2026-09-16; the definition and its limits live in brain/context/confidence-score.md.
 *
 * Each feature (F01–F32, from brain/context/flows.md via the index) gets 0–100, five parts × 20:
 *   code        20 code files linked · 10 only app screens linked · 0 none
 *   behaviour   20 screenshots or recordings · 10 only journeys/screens · 0 none
 *   parity      20 settled (owner-confirmed / identical / single-platform / n/a)
 *               10 known to differ · 0 UNVERIFIED or *proposed*
 *   tests       10 test cases in workspace/test-cases/Fxx-* · 10 a suite file in workspace/test-suites/**\/Fxx-*
 *   qa          20 a workspace/qa-reports/*-fxx-* report whose verdict is PASS or PASS-WITH-NOTES
 * Overall = average weighted by criticality: BLOCKER 4 · HIGH 3 · MEDIUM 2 · LOW 1.
 *
 * Usage (from territool-brain/):
 *   node tools/brain-score.js                  # overall + every feature
 *   node tools/brain-score.js --feature F08    # one task's features, with what would raise each
 *   node tools/brain-score.js --brief          # one line (used by brain-start)
 *   node tools/brain-score.js --json
 *   node tools/brain-score.js --self-test
 * Read-only. Run `node tools/brain-sync.js` first if notes changed, or it scores a stale index.
 */
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/vault.js');

const ARGS = process.argv.slice(2);
const flag = (n) => { const i = ARGS.indexOf(n); return i !== -1 && ARGS[i + 1] && !ARGS[i + 1].startsWith('--') ? ARGS[i + 1] : null; };
const WEIGHT = { BLOCKER: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
const PASSING = /^\**\s*verdict:?\s*\**\s*(PASS-WITH-NOTES|PASS)\b/im;
// Only the FIRST verdict line counts (FEATURE_SCORE_MODEL.md): a report may quote an older verdict further down.
const firstVerdict = (text) => (text.match(/^\**\s*verdict:?.*$/im) || [''])[0];

function scoreFeature(f, near, ev) {
  const code = near.code ? 20 : near.screen ? 10 : 0;
  const behaviour = near.capture || near.video ? 20 : near.mflow || near.screen ? 10 : 0;
  const pa = String(f.pa || '');
  const parity = /UNVERIFIED|\*proposed\*/.test(pa) ? 0 : /owner-confirmed|identical|only|n\/a/.test(pa) ? 20 : 10;
  const tests = (ev.cases.has(f.ref) ? 10 : 0) + (ev.suites.has(f.ref) ? 10 : 0);
  const qa = ev.qa.has(f.ref) ? 20 : 0;
  const crit = String(f.c || '').split(/\s/)[0].toUpperCase();
  return { ref: f.ref, name: f.l, crit, weight: WEIGHT[crit] || 2, parts: { code, behaviour, parity, tests, qa }, score: code + behaviour + parity + tests + qa, problems: near.gap || 0, parityText: pa };
}

function overall(rows) {
  const w = rows.reduce((n, r) => n + r.weight, 0);
  return w ? Math.round((rows.reduce((n, r) => n + r.weight * r.score, 0) / w) * 10) / 10 : 0;
}

// What would move this feature's score, in the order that gains the most.
function raise(r) {
  const out = [];
  const p = r.parts;
  if (p.parity === 0) out.push(`+20 settle mobile/web parity (now: "${r.parityText.slice(0, 70)}")`);
  else if (p.parity === 10) out.push('+10 get the owner to confirm the known difference is intended, or fix it');
  if (p.tests < 20) out.push(`+${20 - p.tests} ${p.tests ? 'add the missing test cases or suite' : `test cases (workspace/test-cases/${r.ref}-*) and a suite file (${r.ref}-*)`}`);
  if (p.qa === 0) out.push(`+20 a passing QA report (workspace/qa-reports/<date>-${r.ref.toLowerCase()}-*.md)`);
  if (p.code < 20) out.push(`+${20 - p.code} link the feature's code files in the brain`);
  if (p.behaviour < 20) out.push(`+${20 - p.behaviour} screenshots or a screen recording of the feature`);
  return out;
}

function collectEvidence() {
  const refOf = (name) => (name.match(/^(F\d{2})-/i) || [])[1];
  const ls = (dir) => { try { return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return []; } };
  const walk = (dir, out = []) => { for (const e of ls(dir)) { if (e.isDirectory()) { if (!/^(node_modules|lib|\.)/.test(e.name)) walk(`${dir}/${e.name}`, out); } else out.push(e.name); } return out; };
  const up = (s) => s && s.toUpperCase();
  const cases = new Set(ls('workspace/test-cases').map((e) => up(refOf(e.name))).filter(Boolean));
  const suites = new Set(walk('workspace/test-suites').map((n) => up(refOf(n))).filter(Boolean));
  const qa = new Set();
  for (const e of ls('workspace/qa-reports')) {
    const m = e.name.match(/-(f\d{2})-/i);
    if (m && e.isFile() && PASSING.test(firstVerdict(fs.readFileSync(path.join(ROOT, 'workspace/qa-reports', e.name), 'utf8')))) qa.add(up(m[1]));
  }
  return { cases, suites, qa };
}

function scoreIndex(index, ev) {
  const group = new Map(index.nodes.map((n) => [n.id, n.g]));
  const near = {};
  for (const [s, t] of index.links) {
    for (const [a, b] of [[s, t], [t, s]]) {
      if (group.get(a) !== 'flow') continue;
      const g = group.get(b);
      (near[a] = near[a] || {})[g] = ((near[a] || {})[g] || 0) + 1;
    }
  }
  return index.nodes.filter((n) => n.g === 'flow').map((f) => scoreFeature(f, near[f.id] || {}, ev))
    .sort((a, b) => b.score - a.score || b.weight - a.weight || a.ref.localeCompare(b.ref));
}

function selfTest() {
  const node = (ref, c, pa) => ({ id: `id:${ref}`, g: 'flow', ref, l: ref, c, pa });
  const index = {
    nodes: [
      node('F01', 'BLOCKER', 'accidentally different'), node('F02', 'LOW', 'UNVERIFIED'),
      node('F03', 'MEDIUM (HIGH if sold)', 'intentionally different (owner-confirmed)'),
      { id: 'code:a', g: 'code' }, { id: 'cap:x', g: 'capture' }, { id: 'screen:s', g: 'screen' }, { id: 'id:G1', g: 'gap' },
    ],
    links: [['code:a', 'id:F01', 1, 0], ['id:F01', 'cap:x', 1, 0], ['screen:s', 'id:F02', 1, 0], ['id:G1', 'id:F01', 1, 0]],
  };
  const ev = { cases: new Set(['F01']), suites: new Set(['F01']), qa: new Set(['F01']) };
  const rows = Object.fromEntries(scoreIndex(index, ev).map((r) => [r.ref, r]));
  const checks = [
    ['full marks except parity', rows.F01.score === 90 && rows.F01.parts.parity === 10],
    ['screen only → code 10, behaviour 10', rows.F02.parts.code === 10 && rows.F02.parts.behaviour === 10],
    ['UNVERIFIED parity → 0', rows.F02.parts.parity === 0],
    ['owner-confirmed parity → 20', rows.F03.parts.parity === 20 && rows.F03.score === 20],
    ['criticality takes the first word', rows.F03.crit === 'MEDIUM' && rows.F03.weight === 2],
    ['problems counted, not scored', rows.F01.problems === 1],
    ['weighted overall', overall(Object.values(rows)) === Math.round(((90 * 4 + 20 * 1 + 20 * 2) / 7) * 10) / 10],
    ['verdict PASS read', PASSING.test('**Verdict: PASS-WITH-NOTES.** ok') && PASSING.test('Verdict: PASS')],
    ['verdict FAIL ignored', !PASSING.test('**Verdict: FAIL.**')],
    ['only the first verdict line counts', !PASSING.test(firstVerdict('**Verdict: PARTIAL.**\n\n**Verdict: PASS.** (old)')) && PASSING.test(firstVerdict('x\n**Verdict: PASS.**'))],
    ['raise lists the parity fix first', raise(rows.F02)[0].startsWith('+20 settle')],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`);
  const bad = checks.filter(([, ok]) => !ok).length;
  console.log(bad ? `${bad} check(s) FAILED` : `all ${checks.length} checks pass`);
  process.exit(bad ? 1 : 0);
}

if (ARGS.includes('--self-test')) selfTest();

const INDEX = path.join(ROOT, 'brain/audits/data/brain-index.json');
if (!fs.existsSync(INDEX)) { console.error('No index. Run `node tools/brain-sync.js` first.'); process.exit(2); }
const index = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
const all = scoreIndex(index, collectEvidence());
const total = overall(all);
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

const wanted = (flag('--feature') || '').split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
const rows = wanted.length ? all.filter((r) => wanted.includes(r.ref)) : all;
const unknown = wanted.filter((w) => !all.some((r) => r.ref === w));
if (unknown.length) { console.error(`Unknown feature(s): ${unknown.join(', ')}. Features are F01–F${all.length} (brain/context/flows.md).`); process.exit(2); }

if (ARGS.includes('--json')) {
  console.log(JSON.stringify({ indexBuilt: index.generatedAt, overall: total, task: wanted.length ? overall(rows) : undefined, features: rows }, null, 2));
  process.exit(0);
}
if (ARGS.includes('--brief')) {
  const low = all.filter((r) => r.score < 40 && r.weight >= 3).map((r) => r.ref);
  console.log(`  confidence     ${total}/100 across ${all.length} features${low.length ? ` · weakest high-stakes: ${low.join(', ')}` : ''} (node tools/brain-score.js)`);
  process.exit(0);
}

console.log(`Confidence score · index built ${index.generatedAt.slice(0, 16).replace('T', ' ')} UTC`);
console.log(wanted.length ? `This task (${wanted.join(', ')}): ${overall(rows)}/100 · whole brain: ${total}/100` : `Overall: ${total}/100 (weighted by criticality)`);
console.log();
console.log(`${pad('', 4)}${pad('Feature', 40)}${pad('Crit', 9)}  code behav parity tests  qa  score  problems`);
for (const r of rows) {
  const p = r.parts;
  console.log(`${pad(r.ref, 4)}${pad(r.name.slice(0, 38), 40)}${pad(r.crit, 9)}${num(p.code, 6)}${num(p.behaviour, 6)}${num(p.parity, 7)}${num(p.tests, 6)}${num(p.qa, 4)}${num(r.score, 7)}${num(r.problems, 10)}`);
}
if (wanted.length) {
  for (const r of rows) {
    const steps = raise(r);
    console.log();
    console.log(`${r.ref} ${r.name}: ${r.score}/100${r.problems ? ` · ${r.problems} known problem(s) linked (not scored; read them before starting)` : ''}`);
    for (const s of steps) console.log(`  ${s}`);
    if (!steps.length) console.log('  nothing left to add');
  }
}
console.log();
console.log('Scores what the brain holds, not the agent. Presence only: a feature with many known problems can still score high.');
