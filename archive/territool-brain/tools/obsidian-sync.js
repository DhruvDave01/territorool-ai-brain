#!/usr/bin/env node
/**
 * Renders the brain index as an Obsidian vault.
 *
 * There is ONE model of the brain: brain/audits/data/brain-index.json, built by tools/brain-graph.js.
 * That same file feeds two views, so they cannot disagree:
 *   - workspace/brain-graph/index.html — the D3 page, published as an Artifact for other people
 *   - this vault                        — the same graph as notes, for the owner to read and edit
 *
 * What this writes:
 *   1. .obsidian/ config (core plugins, graph colour groups per area, ignore filters) — once;
 *      rewrite with --force-config so tweaks made inside Obsidian survive.
 *   2. On every REAL note: `area`/`tags`/`ref` properties and a managed "Linked" block holding one
 *      [[wikilink]] per edge that node has in the index. The brain's notes cite each other as
 *      backtick paths, which Obsidian cannot see; this block is what draws the graph.
 *   3. A generated note per non-note node, so the Obsidian graph is node-for-node identical to the
 *      D3 graph: _id/ (rules, gate checks, decisions, gaps, flows, journeys, screens),
 *      _capture/ (owner screenshots, image embedded), _code/ (repo + brain source files).
 *   4. _map/ hub notes — the vault's entry point. These are navigation furniture and are the ONLY
 *      links in the vault with no counterpart in the D3 graph.
 *
 * Managed regions are fenced by `brain-links` markers and rewritten every run; _map/, _id/,
 * _capture/ and _code/ are owned outright. Prose in real notes is never touched.
 * Reads nothing in .local/ and never leaves this folder.
 *
 * Run tools/brain-graph.js FIRST (tools/brain-sync.js does both in order).
 * Usage: node tools/obsidian-sync.js [--force-config] [--quiet] [--check] [--self-test]
 */
const fs = require('fs');
const path = require('path');
const { ROOT, GENERATED_DIRS, vaultNotes } = require('./lib/vault.js');
const { ID_GROUPS, ENTITY_FOLDERS, noteFor } = require('./lib/nodes.js');

const ARGS = process.argv.slice(2);
const FORCE_CONFIG = ARGS.includes('--force-config');
const QUIET = ARGS.includes('--quiet');
const CHECK = ARGS.includes('--check');

const START = '%% brain-links:start %%';
const END = '%% brain-links:end %%';
const GENERATED_BY = 'tools/obsidian-sync.js';
const INDEX_PATH = 'brain/audits/data/brain-index.json';

// Area → label, graph colour (identical to workspace/brain-graph/index.html), hub note.
const AREAS = [
  ['map',            '_map',          'Maps',           '#d4d6db', 'Brain Home'],
  ['context',        'brain/context', 'Derived truth',  '#6ea8fe', 'Context'],
  ['gates',          'brain/gates',   'Quality gates',  '#b39cff', 'Gates'],
  ['skills',         'brain/skills',  'Skills',         '#6fdc9a', 'Skills'],
  ['audits',         'brain/audits',  'Audits',         '#f3c46a', 'Audits'],
  ['design-library', 'brain/assets',  'Design library', '#ff8fb8', 'Design Library'],
  ['shoebox',        'shoebox',       'Raw inputs',     '#9fb4c8', 'Shoebox'],
  ['workspace',      'workspace',     'Output',         '#4cc9d6', 'Workspace'],
  ['memory',         'brain/memory',  'Knowledge memory', '#ff9f1c', 'Memory'],
];
// Node groups that become generated notes: folder, colour and hub come from lib/nodes.js.
const ENTITY = ENTITY_FOLDERS;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8')); } catch { return d; } };

// ---------------------------------------------------------------- note text helpers
/** Split a note into { fm, body } where fm is the raw frontmatter block (without fences) or null. */
function splitFrontmatter(text) {
  if (!text.startsWith('---\n')) return { fm: null, body: text };
  const end = text.indexOf('\n---\n', 3);
  if (end === -1) return { fm: null, body: text };
  return { fm: text.slice(4, end + 1), body: text.slice(end + 5) };
}

/**
 * Remove the managed block. Line-based on purpose: a regex over the whole body also matches a note
 * that merely QUOTES the markers in its prose (CLAUDE.md does), and would then truncate the note at
 * that sentence. A marker only counts when it is alone on its line and the block runs to the end.
 * Leading blank lines are normalised away too, or each run would add one after the frontmatter.
 */
function stripManaged(body) {
  const lines = body.split('\n');
  const trimLead = (t) => t.replace(/^\n+/, '');
  let start = -1;
  let end = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (end === -1) { if (lines[i].trim() === END) end = i; continue; }
    if (lines[i].trim() === START) { start = i; break; }
  }
  if (start === -1 || end === -1) return trimLead(body);
  if (lines.slice(end + 1).some((l) => l.trim() !== '')) return trimLead(body); // not the trailing block
  return trimLead(lines.slice(0, start).join('\n').replace(/\s*$/, '\n'));
}

/** Merge our properties into any existing frontmatter; existing keys are kept verbatim. */
function buildFrontmatter(props, fm) {
  const keep = [];
  const ours = new RegExp(`^(${Object.keys(props).join('|')}):`);
  if (fm) {
    const lines = fm.replace(/\n$/, '').split('\n');
    let skipping = false;
    for (const line of lines) {
      if (ours.test(line)) { skipping = true; continue; }
      if (skipping && /^\s+/.test(line)) continue; // continuation of a dropped key
      skipping = false;
      keep.push(line);
    }
  }
  const mine = Object.entries(props).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}: ${v}`);
  return ['---', ...keep, ...mine, '---', ''].join('\n');
}

const yamlStr = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

// ---------------------------------------------------------------- self-test
// A fixture for every bug this script has had. #1 once truncated CLAUDE.md in production.
function selfTest() {
  const cases = [];
  const check = (name, actual, expected) => cases.push([name, actual === expected, actual, expected]);

  const quoting = '# Doc\n\nThe block is fenced by ' + '`' + START + '`' + ' and ' + '`' + END + '`' + '.\n\n## Later\n\nkept\n';
  check('a note that only QUOTES the markers is untouched', stripManaged(quoting), quoting);

  const withBlock = '# Doc\n\nbody\n\n' + START + '\n\n## Linked (1)\n\nx\n' + END + '\n';
  check('a real trailing block is removed', stripManaged(withBlock), '# Doc\n\nbody\n');

  check('no block is a no-op', stripManaged('# Doc\n\nbody\n'), '# Doc\n\nbody\n');
  check('leading blank lines normalised', stripManaged('\n\n# Doc\n'), '# Doc\n');

  const notTrailing = '# Doc\n\n' + START + '\nx\n' + END + '\n\n## Still here\n';
  check('a block with prose after it is left alone', stripManaged(notTrailing), notTrailing);

  check('skill frontmatter survives the merge',
    buildFrontmatter({ area: 'skills', tags: '[brain/skills]' }, 'name: territool-code\ndescription: d\narea: stale\ntags: [old]\n'),
    '---\nname: territool-code\ndescription: d\narea: skills\ntags: [brain/skills]\n---\n');

  check('frontmatter is added when absent',
    buildFrontmatter({ area: 'context', tags: '[brain/context]' }, null),
    '---\narea: context\ntags: [brain/context]\n---\n');

  check('empty properties are dropped',
    buildFrontmatter({ area: 'root', tags: '[brain/root]', ref: undefined }, null),
    '---\narea: root\ntags: [brain/root]\n---\n');

  let failed = 0;
  for (const [name, ok, actual, expected] of cases) {
    if (ok) { console.log(`  PASS  ${name}`); continue; }
    failed++;
    console.log(`  FAIL  ${name}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`);
  }
  console.log(failed ? `obsidian-sync self-test: ${failed}/${cases.length} FAILED` : `obsidian-sync self-test: ${cases.length}/${cases.length} passed`);
  process.exit(failed ? 1 : 0);
}
if (ARGS.includes('--self-test')) selfTest();

// ---------------------------------------------------------------- the index
const INDEX = readJson(INDEX_PATH, null);
if (!INDEX) {
  console.error(`obsidian-sync: ${INDEX_PATH} is missing. Run \`node tools/brain-graph.js\` first (or use tools/brain-sync.js).`);
  process.exit(1);
}
const NODE = new Map(INDEX.nodes.map((n) => [n.id, n]));
const REAL_NOTES = new Set(vaultNotes());

// key -> note path, and the reverse, built once.
const NOTE_OF = new Map();
const KEY_OF = new Map();
for (const n of INDEX.nodes) {
  const p = noteFor(n);
  if (!p) continue;
  NOTE_OF.set(n.id, p);
  if (!KEY_OF.has(p)) KEY_OF.set(p, n.id);
}

// Every edge, rendered on BOTH ends. Obsidian collapses the pair into the one graph edge the index
// has, and either note can be opened from the other.
const ADJ = new Map();
for (const [a, b] of INDEX.links) {
  if (!NOTE_OF.has(a) || !NOTE_OF.has(b) || a === b) continue;
  if (!ADJ.has(a)) ADJ.set(a, new Set());
  if (!ADJ.has(b)) ADJ.set(b, new Set());
  ADJ.get(a).add(b);
  ADJ.get(b).add(a);
}

const label = (key) => {
  const n = NODE.get(key);
  return String((n && (n.l || n.ref)) || key).replace(/[|[\]]/g, '').trim() || key;
};
const wikilink = (key) => `[[${NOTE_OF.get(key).replace(/\.md$/, '')}|${label(key)}]]`;
const linkPath = (p, text) => `[[${p.replace(/\.md$/, '')}|${text}]]`;

const GROUP_LABEL = {
  doc: 'Document', rule: 'Coding rule', gate: 'Quality check', decision: 'Owner decision',
  gap: 'Problem found', flow: 'Product feature', mflow: 'App journey', screen: 'App screen',
  code: 'Code file', capture: 'Screenshot', video: 'Screen recording',
};

/** The managed block: one wikilink per edge this node has in the index. Never capped — a cap would
 *  drop edges and the two graphs would stop matching. */
function managedBlock(key) {
  const peers = [...(ADJ.get(key) || [])].sort((a, b) => label(a).localeCompare(label(b)));
  if (!peers.length) return '';
  const byGroup = new Map();
  for (const p of peers) {
    const g = NODE.get(p).g;
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g).push(p);
  }
  const order = ['doc', 'flow', 'mflow', 'rule', 'gate', 'decision', 'gap', 'screen', 'capture', 'code'];
  const lines = [START, `<!-- generated by ${GENERATED_BY} from ${INDEX_PATH}; edits here are overwritten -->`, '',
    `## Linked (${peers.length})`, ''];
  for (const g of order) {
    if (!byGroup.has(g)) continue;
    const list = byGroup.get(g);
    lines.push(`**${GROUP_LABEL[g] || g}${list.length > 1 ? 's' : ''} (${list.length}):** ${list.map(wikilink).join(' · ')}`, '');
  }
  lines.push(END);
  return lines.join('\n');
}

// ---------------------------------------------------------------- write
const written = new Set();
let changed = 0;
const stale = [];

function put(p, text) {
  written.add(p);
  const abs = path.join(ROOT, p);
  const prev = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (prev === text) return;
  stale.push(p);
  changed++;
  if (CHECK) return;
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
}

const areaOf = (p) => {
  for (const [key, prefix] of AREAS.map((a) => [a[0], a[1]])) if (p === prefix || p.startsWith(`${prefix}/`)) return key;
  for (const [key, prefix] of ENTITY.map((a) => [a[0], a[1]])) if (p.startsWith(`${prefix}/`)) return key;
  return 'root';
};

// 1. Real notes: keep the prose, refresh properties and the managed block.
for (const p of REAL_NOTES) {
  const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  const prose = stripManaged(body).replace(/\s*$/, '\n');
  const key = KEY_OF.get(p);
  const area = areaOf(p);
  // Commit records get their own kind so the default graph view can hide all 198 of them at once.
  const commit = area === 'memory' && /^origin:\s*manual-commit\s*$/m.test(fm || '');
  const front = buildFrontmatter({ area, tags: `[brain/${area}${commit ? ', brain/kind/commit' : ''}]`, ref: key ? yamlStr(label(key)) : undefined }, fm);
  const block = key ? managedBlock(key) : '';
  put(p, `${front}\n${prose}${block ? `\n${block}\n` : ''}`);
}

// 2. Generated notes, one per non-note node, so the vault matches the index exactly.
const capNote = (n) => {
  const lines = [`# ${n.l}`, '', `\`${n.ref}\`${n.j ? ` · journey ${n.j}${n.sk ? `, step ${n.sk}` : ''}` : ''}${n.at ? ` · ${n.at}` : ''}`, ''];
  if (n.d) lines.push(n.d, '');
  if (n.dup) lines.push(`The same screen as ${wikilink(`cap:${n.dup}`)}, reused by another journey and kept on purpose.`, '');
  if (n.p) lines.push(`![[${n.p}]]`, '', `Image: \`${n.p}\``, '');
  return lines;
};
const codeNote = (n) => [
  `# ${n.l}`, '',
  `\`${n.p}\`${n.a ? ` · ${n.a}` : ''}`, '',
  n.g === 'doc'
    ? 'A script the brain runs. Lives in this folder.'
    : `Source file in the **read-only** \`repos/${n.a}\` checkout. This note is an index entry, not a copy — never edit code from here.`,
  '',
];
const vidNote = (n) => {
  const mmss = (x) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`;
  const lines = [`# ${n.l}`, '', `\`${n.ref}\` · Screen recording${n.sec ? ` · ${mmss(n.sec)}` : ''}${n.t ? ` · module ${n.t}` : ''}`, ''];
  if (n.d) lines.push(`**What was executed:** ${n.d}`, '');
  if (n.p) lines.push(`File: \`${n.p}\``, '', '_The footage has not been watched — ffmpeg is not installed, so frames cannot be extracted. The line above is quoted from the capture manifest._', '');
  return lines;
};

const idNote = (n) => {
  const lines = [`# ${n.l}`, '', `\`${n.ref}\` · ${GROUP_LABEL[n.g] || n.g}`, ''];
  if (n.t && n.t !== n.l) lines.push(`**${n.t}**`, '');
  if (n.d) lines.push(n.d, '');
  if (n.sev) lines.push(`Severity: ${n.sev}`, '');
  if (n.how) lines.push(n.how, '');
  if (n.sum) lines.push(n.sum, '');
  if (n.h && NOTE_OF.has(n.h)) lines.push(`Defined in ${wikilink(n.h)}.`, '');
  if (n.p) lines.push(`Code: \`${n.p}\``, '');
  return lines;
};

for (const n of INDEX.nodes) {
  const p = NOTE_OF.get(n.id);
  if (!p || REAL_NOTES.has(p)) continue; // real notes were handled above
  const area = areaOf(p);
  const front = buildFrontmatter({
    area, tags: `[brain/${area}, brain/kind/${n.g}]`, ref: yamlStr(n.ref || n.l), kind: n.g,
    ...(n.a ? { platform: n.a } : {}), ...(n.j ? { journey: n.j } : {}),
  }, null);
  const body = n.g === 'capture' ? capNote(n) : n.g === 'video' ? vidNote(n) : n.g === 'code' || n.g === 'doc' ? codeNote(n) : idNote(n);
  const block = managedBlock(n.id);
  put(p, `${front}\n${[`<!-- generated by ${GENERATED_BY}; this whole file is rewritten. -->`, '', ...body].join('\n')}${block ? `\n${block}\n` : ''}`);
}

// 3. Hub notes.
const hubFiles = [];
function writeHub(name, lines) {
  const p = `_map/${name}.md`;
  hubFiles.push(p);
  put(p, ['---', 'area: map', 'tags: [brain/map]', '---', '', `<!-- generated by ${GENERATED_BY}; this whole file is rewritten. -->`, '', ...lines, ''].join('\n'));
}

const realIn = (key) => [...REAL_NOTES].filter((p) => areaOf(p) === key).sort();
const countIn = (folder) => [...NOTE_OF.values()].filter((p) => p.startsWith(`${folder}/`)).length;
const entityNotes = (folder) => [...NOTE_OF.entries()].filter(([, p]) => p.startsWith(`${folder}/`) && !REAL_NOTES.has(p));
const degree = (key) => (ADJ.get(key) || new Set()).size;

const hottest = [...NOTE_OF.keys()]
  .filter((k) => NODE.get(k).g === 'doc')
  .sort((a, b) => degree(b) - degree(a) || label(a).localeCompare(label(b)))
  .slice(0, 10);

const rootNotes = realIn('root').sort((a, b) => (a === 'CLAUDE.md' ? -1 : b === 'CLAUDE.md' ? 1 : a.localeCompare(b)));

writeHub('Brain Home', [
  '# Brain Home',
  '',
  `Entry point for the Territool brain. This vault and the shareable D3 graph are two renderings of one model — \`${INDEX_PATH}\` — so they always show the same ${INDEX.nodes.length} things and the same ${INDEX.links.length} connections.`,
  '',
  '> [!warning] Non-negotiable rules',
  '> Never touch production · new code only · repos are read-only outside a task · never commit or push unless asked · credentials stay in `.local/` (not indexed here) · paid flows stop before the pay step · design uses only `brain/assets/` + approved tokens.',
  `> Full text: ${linkPath('CLAUDE.md', 'Start here – brain overview')} and \`brain/context/conventions-shared.md\` §S0.`,
  '',
  '## Written notes',
  '',
  '| Area | What it holds | Notes | Map |',
  '|---|---|---|---|',
  ...AREAS.filter(([k]) => k !== 'map').map(([key, prefix, lbl, , hub]) =>
    `| \`${prefix}/\` | ${lbl} | ${realIn(key).length} | ${linkPath(`_map/${hub}.md`, hub)} |`),
  `| root | Operating docs | ${rootNotes.length} | — |`,
  '',
  '## Generated from the index',
  '',
  'One note per node in the graph, so nothing in the shared view is missing here.',
  '',
  '| Folder | What it holds | Notes | Map |',
  '|---|---|---|---|',
  ...ENTITY.map(([key, prefix, lbl, , hub]) => `| \`${prefix}/\` | ${lbl} | ${countIn(prefix)} | ${linkPath(`_map/${hub}.md`, hub)} |`),
  '',
  '## Start here',
  '',
  ...rootNotes.map((p) => `- ${linkPath(p, KEY_OF.has(p) ? label(KEY_OF.get(p)) : p)} — \`${p}\``),
  '',
  '## The product',
  '',
  'Every Territool feature, so the map has a centre: these are what the rules, checks, screens, recordings and code all hang off.',
  '',
  ...(() => {
    const flows = [...NOTE_OF.keys()].filter((k) => NODE.get(k).g === 'flow')
      .sort((a, b) => String(NODE.get(a).ref).localeCompare(String(NODE.get(b).ref)));
    const journeys = [...NOTE_OF.keys()].filter((k) => NODE.get(k).g === 'mflow')
      .sort((a, b) => String(NODE.get(a).ref).localeCompare(String(NODE.get(b).ref)));
    return [
      `**Features (${flows.length}):** ${flows.map(wikilink).join(' · ')}`,
      '',
      `**App journeys (${journeys.length}):** ${journeys.map(wikilink).join(' · ')}`,
      '',
    ];
  })(),
  '## Most-connected notes',
  '',
  ...hottest.map((k) => `- ${wikilink(k)} — ${degree(k)} connections`),
  '',
  '## Open items',
  '',
  `See ${linkPath('_map/Open Items.md', 'Open Items')}.`,
  '',
  '## Keeping both views current',
  '',
  '```bash',
  'node tools/brain-sync.js     # rebuild the index, then the D3 graph and this vault from it',
  '```',
  '',
  'A Claude Code `Stop` hook runs that after every turn. Never run `obsidian-sync` alone after editing notes — the index has to be rebuilt first or the vault renders a stale graph.',
]);

for (const [key, prefix, lbl, , hub] of AREAS) {
  if (key === 'map') continue;
  const list = realIn(key);
  writeHub(hub, [
    `# ${hub}`, '', `${lbl} — \`${prefix}/\`, ${list.length} note${list.length === 1 ? '' : 's'}.`, '',
    ...list.map((p) => `- ${linkPath(p, KEY_OF.has(p) ? label(KEY_OF.get(p)) : path.basename(p, '.md'))} — \`${p}\``),
    '', `Back to ${linkPath('_map/Brain Home.md', 'Brain Home')}.`,
  ]);
}

for (const [key, prefix, lbl, , hub] of ENTITY) {
  const list = entityNotes(prefix);
  const groups = new Map();
  for (const [k] of list) {
    const g = NODE.get(k).g;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(k);
  }
  const lines = [`# ${hub}`, '', `${lbl} — \`${prefix}/\`, ${list.length} generated note${list.length === 1 ? '' : 's'} from \`${INDEX_PATH}\`.`, ''];
  for (const [g, keys] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`## ${GROUP_LABEL[g] || g} (${keys.length})`, '');
    lines.push(keys.sort((a, b) => label(a).localeCompare(label(b))).map(wikilink).join(' · '), '');
  }
  lines.push(`Back to ${linkPath('_map/Brain Home.md', 'Brain Home')}.`);
  writeHub(hub, lines);
}

// ---------------------------------------------------------------- index.md (the wiki catalogue)
// Content-oriented, unlike _map/ which is navigation: every written note, one line each, so a reader
// (or an agent) can find the right page from the catalogue instead of guessing at file names.
{
  const oneLine = (p) => {
    const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
    const { body } = splitFrontmatter(raw);
    for (const line of stripManaged(body).split('\n')) {
      const l = line.trim();
      if (!l || l.startsWith('#') || l.startsWith('>') || l.startsWith('|') || l.startsWith('```') || l.startsWith('<!--') || l.startsWith('%%')) continue;
      return l.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').slice(0, 150);
    }
    return '';
  };
  const lines = [
    '---', 'area: root', 'tags: [brain/root]', '---', '',
    `<!-- generated by ${GENERATED_BY}; this whole file is rewritten. -->`, '',
    '# Index',
    '',
    `Every written note in the brain, one line each — ${REAL_NOTES.size} pages. This is the catalogue; ${linkPath('_map/Brain Home.md', 'Brain Home')} is the map, and \`log.md\` is the timeline.`,
    '',
    `The ${INDEX.nodes.length - REAL_NOTES.size} generated pages (rules, checks, screenshots, recordings, code) are not listed here — they are indexed in \`_id/\`, \`_capture/\`, \`_video/\` and \`_code/\` and reachable from their hubs.`,
    '',
  ];
  for (const [key, prefix, lbl] of [...AREAS.filter(([k]) => k !== 'map'), ['root', '', 'Operating docs']]) {
    const list = (key === 'root' ? rootNotes : realIn(key));
    if (!list.length) continue;
    lines.push(`## ${lbl}${prefix ? ` — \`${prefix}/\`` : ''} (${list.length})`, '');
    for (const p of list) {
      const title = KEY_OF.has(p) ? label(KEY_OF.get(p)) : path.basename(p, '.md');
      const sum = oneLine(p);
      lines.push(`- ${linkPath(p, title)}${sum ? ` — ${sum}` : ''}`);
    }
    lines.push('');
  }
  put('index.md', `${lines.join('\n')}\n`);
}

// Open items: read the curated list out of CLAUDE.md so this page cannot drift from it.
const claudeText = fs.existsSync(path.join(ROOT, 'CLAUDE.md')) ? fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8') : '';
const openSection = claudeText.split(/^## Open owner items[^\n]*$/m)[1];
const openBullets = openSection ? openSection.split(/^## /m)[0].split('\n').filter((l) => l.trim().startsWith('- ')) : [];
writeHub('Open Items', [
  '# Open Items', '',
  `Owner decisions the brain must not assume. Source: the "Open owner items" section of ${linkPath('CLAUDE.md', 'Start here – brain overview')}; weaknesses W1–W11 are in \`brain/audits/07-validation.md\` §5.`,
  '', ...(openBullets.length ? openBullets : ['- _None listed in CLAUDE.md._']),
  '', `Back to ${linkPath('_map/Brain Home.md', 'Brain Home')}.`,
]);

// 4. Remove generated notes that no longer correspond to a node.
let removed = 0;
function sweep(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { sweep(p); continue; }
    if (!e.name.endsWith('.md') || written.has(p)) continue;
    removed++;
    if (!CHECK) fs.unlinkSync(path.join(ROOT, p));
  }
  if (!CHECK && !fs.readdirSync(abs).length) fs.rmdirSync(abs);
}
for (const d of GENERATED_DIRS) sweep(d);

// ---------------------------------------------------------------- .obsidian config
const hexToInt = (h) => parseInt(h.slice(1), 16);
const OBS = path.join(ROOT, '.obsidian');
const DEFAULT_SEARCH = '-tag:#brain/kind/code -tag:#brain/kind/capture -tag:#brain/kind/commit';
const OLD_SEARCHES = ['-tag:#brain/kind/code -tag:#brain/kind/capture'];
const CONFIG = {
  'app.json': {
    alwaysUpdateLinks: true, newLinkFormat: 'absolutePath', useMarkdownLinks: false,
    showUnsupportedFiles: false, attachmentFolderPath: 'brain/assets',
    userIgnoreFilters: ['repos/', 'tools/ms-playwright/', 'tools/node_modules/', '.local/', 'node_modules/', 'views/'],
    defaultViewMode: 'preview', promptDelete: true,
  },
  'appearance.json': { accentColor: '#6ea8fe', theme: 'obsidian', textFontFamily: '', monospaceFontFamily: '' },
  'core-plugins.json': {
    'file-explorer': true, 'global-search': true, switcher: true, graph: true, backlink: true,
    'outgoing-link': true, 'tag-pane': true, properties: true, outline: true, 'page-preview': true,
    bookmarks: true, 'word-count': true, 'file-recovery': true, canvas: true, 'command-palette': true,
    'markdown-importer': false, 'zk-prefixer': false, 'random-note': false, 'daily-notes': false,
    templates: false, 'note-composer': true, 'slash-command': true, 'editor-status': true, sync: false,
    publish: false, slides: false, 'audio-recorder': false, workspaces: false,
  },
  // Obsidian's own schema — it writes these keys with HYPHENS (collapse-filter, not collapse_filter)
  // and silently drops anything it does not recognise, which is how the first colour groups were lost.
  // Colours are keyed on the `brain/kind/*` tag every generated note carries, so they match the shared
  // D3 page group for group rather than approximating it by folder.
  'graph.json': {
    'collapse-filter': false,
    // Default view hides the three bulk groups (code files, screenshots, commit records) so the structure
    // is visible. Clear this box in Obsidian to see every node. For the hub-and-spoke picture, open
    // views/hub-map/ as its own vault (tools/hub-map.js).
    search: DEFAULT_SEARCH,
    showTags: false,
    showAttachments: false,
    hideUnresolved: true,
    showOrphans: true,
    'collapse-color-groups': false,
    colorGroups: [
      // The hubs — the only white nodes, so the centre of the map reads at a glance.
      ['path:_map/', '#ffffff'],
      // Entities, coloured exactly as the shared graph colours them.
      ['tag:#brain/kind/flow', '#6fdc9a'],
      ['tag:#brain/kind/mflow', '#ff8fb8'],
      ['tag:#brain/kind/video', '#ff9f1c'],
      ['tag:#brain/kind/gap', '#ef6a5a'],
      ['tag:#brain/kind/rule', '#6ea8fe'],
      ['tag:#brain/kind/gate', '#b39cff'],
      ['tag:#brain/kind/decision', '#f3c46a'],
      ['tag:#brain/kind/screen', '#4cc9d6'],
      ['tag:#brain/kind/capture', '#9fb4c8'],
      ['tag:#brain/kind/code', '#80848c'],
      // Written notes, by area.
      ['tag:#brain/context', '#8ab4f8'],
      ['tag:#brain/gates', '#c9b6ff'],
      ['tag:#brain/skills', '#7ee3a8'],
      ['tag:#brain/audits', '#ffd98a'],
      ['tag:#brain/design-library', '#ffa8c6'],
      ['tag:#brain/shoebox', '#b6c6d6'],
      ['tag:#brain/workspace', '#6fd8e3'],
      ['tag:#brain/memory', '#ffb35c'],
      ['tag:#brain/root', '#e8e9ed'],
    ].map(([query, hex]) => ({ query, color: { a: 1, rgb: parseInt(hex.slice(1), 16) } })),
    'collapse-display': false,
    showArrow: false,
    textFadeMultiplier: 0,
    nodeSizeMultiplier: 1.2,
    lineSizeMultiplier: 0.8,
    'collapse-forces': false,
    centerStrength: 0.5,
    repelStrength: 14,
    linkStrength: 0.8,
    linkDistance: 220,
    scale: 0.35,
    close: false,
  },
  'bookmarks.json': {
    items: [
      { type: 'file', path: '_map/Brain Home.md', title: 'Brain Home' },
      { type: 'file', path: '_map/Open Items.md', title: 'Open Items' },
      { type: 'file', path: 'CLAUDE.md', title: 'Start here' },
      { type: 'graph', title: 'Brain graph' },
    ],
  },
  'hotkeys.json': {},
};

let configWritten = 0;
// Display settings that make the graph unreadable when on (every image, stylesheet and tag becomes a dot).
// They are set back to the brain's defaults once per change of this marker, not on every run, so a
// deliberate toggle in Obsidian survives until the defaults change again.
const VIEW_DEFAULTS_VERSION = '2026-09-17-clean';
if (!CHECK) {
  fs.mkdirSync(OBS, { recursive: true });
  for (const [name, value] of Object.entries(CONFIG)) {
    const abs = path.join(OBS, name);
    if (fs.existsSync(abs) && !FORCE_CONFIG) {
      // Exception: Obsidian resets colorGroups to [] every time the graph settings panel is opened.
      // Put the colours back, but keep whatever else the user changed in the UI.
      if (name === 'app.json') {
        // Ignore filters are additive: a folder the brain must hide (e.g. views/) is added, nothing the user added is removed.
        let live; try { live = JSON.parse(fs.readFileSync(abs, 'utf8')); } catch { live = null; }
        const have = (live && live.userIgnoreFilters) || [];
        const missing = value.userIgnoreFilters.filter((f) => !have.includes(f));
        if (live && missing.length) {
          fs.writeFileSync(abs, `${JSON.stringify({ ...live, userIgnoreFilters: [...have, ...missing] }, null, 2)}\n`);
          configWritten++;
        }
        continue;
      }
      if (name !== 'graph.json') continue;
      let live;
      try { live = JSON.parse(fs.readFileSync(abs, 'utf8')); } catch { live = null; }
      if (!live) continue;
      const stamp = path.join(OBS, '.brain-view-defaults');
      const upgrade = !fs.existsSync(stamp) || fs.readFileSync(stamp, 'utf8').trim() !== VIEW_DEFAULTS_VERSION;
      const emptyColours = !(Array.isArray(live.colorGroups) && live.colorGroups.length);
      if (!upgrade && !emptyColours) continue;
      const healed = { ...live, colorGroups: emptyColours ? value.colorGroups : live.colorGroups, search: live.search || value.search };
      if (upgrade) {
        Object.assign(healed, { showTags: false, showAttachments: false, hideUnresolved: true });
        if (!live.search || OLD_SEARCHES.includes(live.search)) healed.search = value.search;
        fs.writeFileSync(stamp, `${VIEW_DEFAULTS_VERSION}\n`);
      }
      fs.writeFileSync(abs, `${JSON.stringify(healed, null, 2)}\n`);
      configWritten++;
      continue;
    }
    fs.writeFileSync(abs, `${JSON.stringify(value, null, 2)}\n`);
    configWritten++;
  }
}

// ---------------------------------------------------------------- report
const rendered = NOTE_OF.size;
const missing = INDEX.nodes.filter((n) => !NOTE_OF.has(n.id));
if (CHECK) {
  if (stale.length || removed) {
    console.error(`obsidian-sync: out of date — ${stale.length} file(s) to write, ${removed} to remove:\n  ${stale.slice(0, 20).join('\n  ')}`);
    process.exit(1);
  }
  if (!QUIET) console.log('obsidian-sync: vault matches the index.');
  process.exit(0);
}
if (!QUIET) {
  console.log(`obsidian-sync: ${rendered}/${INDEX.nodes.length} index nodes rendered as notes (${REAL_NOTES.size} written, ${rendered - REAL_NOTES.size} generated), ${INDEX.links.length} edges, ${hubFiles.length} hubs.`);
  console.log(`  updated: ${changed} file(s)${removed ? `, removed: ${removed}` : ''}${configWritten ? `, config: ${configWritten}` : ''}`);
  if (missing.length) console.log(`  NOT rendered (${missing.length}): ${missing.slice(0, 6).map((n) => n.id).join(', ')}`);
}
