/**
 * The hub-and-spoke reading of the brain index (2026-09-17).
 *
 * The full graph links every note to every related note, which is right for tracing a fact and
 * unreadable as a picture. This gives each node exactly ONE parent so the brain can also be drawn as
 * a tree: Home → area hubs → feature / journey hubs → leaves. It is a view, not a second model: it is
 * computed from brain/audits/data/brain-index.json every run and adds no facts.
 *
 * Used by tools/hub-map.js (the hub-map Obsidian vault and workspace/brain-graph/hub-data.js).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

// Area hubs. Order is the order they are listed on the home note.
const AREAS = [
  ['flow', 'Product features', 'The 32 product features. Each one is a hub for its screenshots, problems and decisions.'],
  ['mflow', 'App journeys', 'Step-by-step mobile journeys built from the owner screenshots. Each journey is a hub for its screens.'],
  ['screen', 'App screens', 'Mobile screens from the code graph.'],
  ['capture', 'Screenshots', 'Owner screenshots that belong to no single journey or feature.'],
  ['video', 'Screen recordings', 'Owner screen recordings.'],
  ['rule', 'Coding rules', 'Rules new code must follow.'],
  ['gate', 'Quality checks', 'Checklist items of the code, design, test and QA gates.'],
  ['decision', 'Owner decisions', 'Decisions and open questions for the owner.'],
  ['gap', 'Problems found', 'Known gaps and fragile areas.'],
  ['doc:context', 'Context notes', 'Derived truth: brain/context/.'],
  ['doc:memory', 'Knowledge memory', 'Typed memory entries: brain/memory/ (commit records are left out of this view).'],
  ['doc:skills', 'Skills', 'brain/skills/.'],
  ['doc:gates', 'Gate documents', 'brain/gates/.'],
  ['doc:audits', 'Audits', 'brain/audits/.'],
  ['doc:design', 'Design library', 'brain/assets/.'],
  ['doc:shoebox', 'Shoebox', 'Raw inputs: shoebox/.'],
  ['doc:workspace', 'Workspace', 'Tasks, proposals, test cases, QA reports: workspace/.'],
  ['doc:root', 'Top-level documents', 'CLAUDE.md, SETUP.md, log.md and the other files at the top of the brain.'],
];

const DOC_AREAS = [
  ['brain/context/', 'doc:context'], ['brain/memory/', 'doc:memory'], ['brain/skills/', 'doc:skills'],
  ['brain/gates/', 'doc:gates'], ['brain/audits/', 'doc:audits'], ['brain/assets/', 'doc:design'],
  ['shoebox/', 'doc:shoebox'], ['workspace/', 'doc:workspace'],
];

// A node that links to more features than this is a cross-cutting note (parity-map, flows…):
// hanging it under one feature would be misleading, so it goes to its area hub instead.
const MAX_FEATURES = 2;

const isCommitEntry = (n) => {
  if (!/^brain\/memory\/entries\//.test(n.p || '')) return false;
  try { return /^origin:\s*manual-commit\s*$/m.test(fs.readFileSync(path.join(ROOT, n.p), 'utf8').slice(0, 1500)); } catch { return false; }
};

/** Why a node is left out of the hub view, or null when it is shown. */
function excluded(n) {
  if (n.g === 'code') return 'code file';
  if (n.g === 'doc' && !String(n.p).endsWith('.md')) return 'brain script';
  if (n.g === 'doc' && isCommitEntry(n)) return 'commit record';
  return null;
}

const docArea = (p) => (DOC_AREAS.find(([pre]) => p.startsWith(pre)) || [null, 'doc:root'])[1];
const areaOf = (n) => (n.g === 'doc' ? docArea(n.p) : n.g);

/**
 * index → { shown: Set(id), parent: Map(id → {hub} | {node}), areas, counts }
 * Hubs: every area in AREAS; feature nodes (g flow) and journey nodes (kind journey) are node hubs.
 */
function buildHubs(index) {
  const NODE = new Map(index.nodes.map((n) => [n.id, n]));
  const shown = new Set(index.nodes.filter((n) => !excluded(n)).map((n) => n.id));
  const w = new Map();
  const bump = (a, b) => { if (!w.has(a)) w.set(a, new Map()); w.get(a).set(b, (w.get(a).get(b) || 0) + 1); };
  for (const [a, b] of index.links) if (a !== b && NODE.has(a) && NODE.has(b)) { bump(a, b); bump(b, a); }
  const best = (id, pred) => {
    const c = [...(w.get(id) || new Map())].filter(([m]) => shown.has(m) && pred(NODE.get(m)));
    c.sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1));
    return c;
  };
  const isJourney = (m) => m.g === 'mflow' && m.kind === 'journey';
  const parent = new Map();
  for (const id of shown) {
    const n = NODE.get(id);
    if (n.g === 'flow' || n.g === 'mflow') { parent.set(id, { hub: n.g }); continue; }
    if (n.g === 'capture') {
      // A capture names its journey (n.j); journeys only link to their first screen in the index.
      if (n.j && shown.has(`id:${n.j}`)) { parent.set(id, { node: `id:${n.j}` }); continue; }
      const j = best(id, isJourney);
      if (j.length) { parent.set(id, { node: j[0][0] }); continue; }
    }
    const f = best(id, (m) => m.g === 'flow');
    if (f.length && f.length <= MAX_FEATURES) { parent.set(id, { node: f[0][0] }); continue; }
    parent.set(id, { hub: areaOf(n) });
  }
  const counts = {};
  for (const n of index.nodes) { const r = excluded(n); if (r) counts[r] = (counts[r] || 0) + 1; }
  return { NODE, shown, parent, areas: AREAS, excludedCounts: counts };
}

module.exports = { AREAS, buildHubs, excluded, areaOf, MAX_FEATURES };
