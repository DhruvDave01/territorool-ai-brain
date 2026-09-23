#!/usr/bin/env node
/**
 * Rebuilds the brain's two views from one model, in the only order that is correct:
 *
 *   1. brain-graph.js   scans the notes → brain/audits/data/brain-index.json (the model)
 *                       and workspace/brain-graph/graph-data.js (the shareable D3 page)
 *   2. obsidian-sync.js renders that same index as the Obsidian vault
 *   3. brain-parity.js  proves both views show the same nodes and the same edges
 *
 * Running obsidian-sync on its own after editing a note renders a stale graph, which is exactly the
 * drift this file exists to prevent. Always run this instead — the Stop hook does.
 *
 * Usage: node tools/brain-sync.js [--quiet]   (exit 1 if the views drift)
 */
const { execFileSync } = require('child_process');
const path = require('path');

const QUIET = process.argv.includes('--quiet');
const here = (f) => path.join(__dirname, f);

const STEPS = [
  // Memory first: register tables are rendered from entries, and the generated views are inputs to nothing else.
  ['memory: render registers', here('memory.js'), ['render']],
  ['memory: generated views', here('memory.js'), ['reindex']],
  ['index + shared graph', here('brain-graph.js'), []],
  ['Obsidian vault', here('obsidian-sync.js'), QUIET ? ['--quiet'] : []],
  ['parity check', here('brain-parity.js'), QUIET ? ['--quiet'] : []],
  // The simplified hub-and-spoke picture of the same index (views/hub-map/ + the D3 page's Hub map).
  ['hub map', here('hub-map.js'), QUIET ? ['--quiet'] : []],
  // Health of the KNOWLEDGE, not the code. Report-only: a stale claim should surface, not block a sync.
  ['wiki lint', here('wiki-lint.js'), QUIET ? ['--quiet'] : []],
];

for (const [name, script, args] of STEPS) {
  if (!QUIET) console.log(`\n── ${name} ───────────────────────────────`);
  try {
    execFileSync(process.execPath, [script, ...args], { stdio: QUIET ? ['ignore', 'ignore', 'inherit'] : 'inherit' });
  } catch (err) {
    console.error(`brain-sync: ${name} failed (exit ${err.status}).`);
    process.exit(err.status || 1);
  }
}
if (!QUIET) console.log('\nbrain-sync: both views rebuilt and in agreement.');
