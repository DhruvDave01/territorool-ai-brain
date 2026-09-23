/**
 * The one mapping from a graph node to its note in the Obsidian vault.
 *
 * tools/obsidian-sync.js WRITES notes from this, and tools/brain-parity.js CHECKS them against it.
 * They used to hold separate copies, which meant adding a node group could silently break parity —
 * the writer and the checker would simply disagree. One module, so that cannot happen.
 */
const ID_GROUPS = new Set(['rule', 'gate', 'decision', 'gap', 'flow', 'mflow', 'screen']);

// group → [folder, label, graph colour, hub note]. Colours match workspace/brain-graph/index.html.
const ENTITY_FOLDERS = [
  ['id', '_id', 'Rules, checks & decisions', '#6ea8fe', 'Rules & IDs'],
  ['capture', '_capture', 'Owner screenshots', '#9fb4c8', 'Screenshots'],
  ['video', '_video', 'Screen recordings', '#ff9f1c', 'Recordings'],
  ['code', '_code', 'Code files', '#80848c', 'Code'],
];

const safe = (s) => String(s).replace(/[\\:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();

/** Where a node's note lives, vault-relative. Real notes are themselves; everything else generated. */
function noteFor(n) {
  if (!n) return null;
  if (n.g === 'doc') return n.p.endsWith('.md') ? n.p : `_code/brain/${n.p}.md`;
  if (n.g === 'capture') return `_capture/${safe(n.ref)}.md`;
  if (n.g === 'video') return `_video/${safe(n.ref)}.md`;
  if (n.g === 'code') return `_code/${n.a || 'other'}/${n.p}.md`;
  if (ID_GROUPS.has(n.g)) return `_id/${safe(n.ref)}.md`;
  return null;
}

module.exports = { ID_GROUPS, ENTITY_FOLDERS, safe, noteFor };
