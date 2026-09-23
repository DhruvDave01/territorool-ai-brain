#!/usr/bin/env node
/**
 * Proves the two views of the brain show the same graph.
 *
 * Reads brain/audits/data/brain-index.json (what the shared D3 page draws) and, separately, every
 * [[wikilink]] actually present in the vault's markdown (what Obsidian draws), then compares the two
 * as sets of unordered node pairs. Any difference is a real drift between what the owner sees in
 * Obsidian and what other people see through the shared link.
 *
 * _map/ hubs are excluded by design: they are navigation furniture with no counterpart in the D3
 * graph, and they are the ONLY sanctioned difference between the two views.
 *
 * Usage: node tools/brain-parity.js [--quiet]   (exit 1 on drift)
 */
const fs = require('fs');
const path = require('path');
const { ROOT, GENERATED_DIRS, ignored } = require('./lib/vault.js');
const { noteFor } = require('./lib/nodes.js');

const QUIET = process.argv.includes('--quiet');
const INDEX_PATH = 'brain/audits/data/brain-index.json';

const index = JSON.parse(fs.readFileSync(path.join(ROOT, INDEX_PATH), 'utf8'));
const NODE = new Map(index.nodes.map((n) => [n.id, n]));
// Node -> note mapping comes from lib/nodes.js, the same module obsidian-sync writes from, so the
// writer and this checker can never disagree about where a node's note should be.
const KEY_OF = new Map();
for (const n of index.nodes) { const p = noteFor(n); if (p && !KEY_OF.has(p)) KEY_OF.set(p, n.id); }

const pair = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

// What the shared graph draws.
const expected = new Set();
for (const [a, b] of index.links) if (a !== b && NODE.has(a) && NODE.has(b)) expected.add(pair(a, b));

// What Obsidian draws: every wikilink in the vault, excluding _map/ navigation and attachments.
function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir === '.' ? '' : dir), { withFileTypes: true })) {
    const p = dir === '.' ? e.name : `${dir}/${e.name}`;
    if (ignored(p) && !GENERATED_DIRS.some((d) => p === d || p.startsWith(`${d}/`))) continue;
    if (p === '_map' || p.startsWith('_map/') || p === 'index.md') continue; // navigation, not content
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const actual = new Set();
const unresolved = [];
let noKey = 0;
for (const file of walk('.')) {
  const from = KEY_OF.get(file);
  if (!from) { noKey++; continue; }
  // Obsidian does not resolve links inside code, so neither do we — CLAUDE.md documents the
  // `[[wikilink]]` syntax in backticks and those mentions are not edges.
  const text = fs.readFileSync(path.join(ROOT, file), 'utf8')
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/`[^`\n]*`/g, '');
  for (const m of text.matchAll(/(!?)\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)) {
    if (m[1] === '!') continue; // image embed, not a graph link
    const target = `${m[2].trim()}.md`;
    const to = KEY_OF.get(target);
    if (!to) { unresolved.push(`${file} -> ${m[2].trim()}`); continue; }
    if (to !== from) actual.add(pair(from, to));
  }
}

const missing = [...expected].filter((k) => !actual.has(k));
const extra = [...actual].filter((k) => !expected.has(k));
const name = (k) => { const n = NODE.get(k); return n ? `${n.ref || n.l} (${n.g})` : k; };
const show = (k) => k.split('|').map(name).join('  ↔  ');

if (!QUIET || missing.length || extra.length || unresolved.length) {
  console.log(`nodes      index ${index.nodes.length} · vault ${KEY_OF.size}`);
  console.log(`edges      index ${expected.size} · vault ${actual.size}`);
  console.log(`in the shared graph but not in Obsidian: ${missing.length}`);
  missing.slice(0, 10).forEach((k) => console.log(`  - ${show(k)}`));
  console.log(`in Obsidian but not in the shared graph: ${extra.length}`);
  extra.slice(0, 10).forEach((k) => console.log(`  + ${show(k)}`));
  if (unresolved.length) {
    console.log(`broken wikilinks: ${unresolved.length}`);
    unresolved.slice(0, 10).forEach((u) => console.log(`  ? ${u}`));
  }
  if (noKey) console.log(`notes with no index node: ${noKey}`);
}
const ok = !missing.length && !extra.length && !unresolved.length;
console.log(ok ? 'PARITY OK — both views show the same graph.' : 'PARITY FAILED — the two views differ.');
process.exit(ok ? 0 : 1);
