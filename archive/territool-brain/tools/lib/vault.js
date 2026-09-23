/**
 * The one definition of what the brain vault contains.
 *
 * Both views read this so they can never disagree about their inputs:
 *   - tools/brain-graph.js  → the shareable D3 graph + brain/audits/data/brain-index.json
 *   - tools/obsidian-sync.js → the Obsidian vault (notes, generated entity notes, _map/)
 *
 * GENERATED_DIRS are written BY obsidian-sync from the index. They are never scanned, or the
 * generated links would feed back into the next run and the two graphs would drift apart.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

// Not part of the brain: live repos, browser binaries, deps, credentials, app config.
const IGNORE = [
  /^repos\//, /^tools\/ms-playwright\//, /^tools\/node_modules\//,
  /^\.local\//, /(^|\/)node_modules\//, /^\.obsidian\//, /^\.git\//,
  // Knowledge memory scaffolding: register templates (prose + row placeholders) and generated views.
  // Both are renderings of the entries; indexing them would duplicate every fact as a second node.
  /^brain\/memory\/_templates\//, /^brain\/memory\/_generated\//,
  // The hub map (tools/hub-map.js) is a second, simplified vault drawn from the same index.
  /^views\//,
];

// Written by obsidian-sync from the index; inputs to neither scan.
// Derived from lib/nodes.js so adding a node group can never leave its folder out of this list —
// a folder missing here is scanned as if it held real notes, which double-writes it and inflates
// the graph on the next rebuild.
const { ENTITY_FOLDERS } = require('./nodes.js');
const GENERATED_DIRS = ['_map', ...ENTITY_FOLDERS.map(([, folder]) => folder)];

// Written by sync-agent-files.js from brain/context/agent-brief.md. They are renderings of a note, not
// notes: indexing them would give one brief several nodes, and obsidian-sync would inject frontmatter
// into files that must stay byte-identical to what the generator produces.
// index.md is the generated catalogue: like _map/, it links to everything, so it is navigation rather
// than content and must not become a graph node — otherwise it invents edges the shared view lacks.
// log.md is NOT here: it is real content and belongs in the graph.
const GENERATED_FILES = ['AGENTS.md', '.github/copilot-instructions.md', 'index.md'];

const isGenerated = (p) => GENERATED_FILES.includes(p)
  || GENERATED_DIRS.some((d) => p === d || p.startsWith(`${d}/`))
  || p === '.cursor' || p.startsWith('.cursor/');
const ignored = (p) => IGNORE.some((re) => re.test(p)) || isGenerated(p);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir === '.' ? '' : dir), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = dir === '.' ? e.name : `${dir}/${e.name}`;
    if (ignored(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** Every real note in the vault, vault-relative, sorted. Excludes everything generated. */
const vaultNotes = () => walk('.');

module.exports = { ROOT, IGNORE, GENERATED_DIRS, GENERATED_FILES, isGenerated, ignored, vaultNotes };
