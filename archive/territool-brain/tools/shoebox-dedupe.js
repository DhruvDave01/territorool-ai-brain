#!/usr/bin/env node
/**
 * Removes shoebox files that are already in the brain's design library, byte for byte.
 *
 * The rule (USER SAID 2026-09-16): raw material is dropped into shoebox/, ingested into the brain,
 * and the shoebox copy is then removed so nothing is stored twice. The brain keeps everything — old
 * and new — so it can reason about what changed; the shoebox is a staging area, not an archive.
 *
 * Safety, because this deletes:
 *  - A file is removed ONLY when an identical MD5 exists under brain/assets/. Content is compared,
 *    never names or paths.
 *  - Markdown is never removed: shoebox notes (READMEs, flows.md, fragile.md) are brain notes that
 *    live in the index and have no copy in brain/assets.
 *  - Dry run is the default. Deleting needs --delete, and the run prints the backup command first.
 *  - Nothing outside shoebox/ is touched, ever.
 *
 * Usage (from territool-brain/):
 *   node tools/shoebox-dedupe.js                 # dry run — what would go, and what would stay
 *   node tools/shoebox-dedupe.js --delete        # remove the proven duplicates
 *   node tools/shoebox-dedupe.js --delete --ds-store   # also clear macOS .DS_Store junk
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ROOT } = require('./lib/vault.js');

const ARGS = process.argv.slice(2);
const DELETE = ARGS.includes('--delete');
const DS = ARGS.includes('--ds-store');

const SHOEBOX = path.join(ROOT, 'shoebox');
const LIBRARY = path.join(ROOT, 'brain', 'assets');
// Notes are never duplicates of a library asset — they are brain notes in their own right.
const NEVER_DELETE = /\.(md|markdown)$/i;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}
const md5 = (f) => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');
const rel = (f) => path.relative(ROOT, f);
const mb = (n) => (n / 1e6).toFixed(1);

const library = new Map(); // md5 -> first library path
for (const f of walk(LIBRARY)) {
  const s = fs.statSync(f);
  if (!s.size) continue;
  const h = md5(f);
  if (!library.has(h)) library.set(h, f);
}

const dupes = [];
const keep = [];
const junk = [];
for (const f of walk(SHOEBOX)) {
  const base = path.basename(f);
  if (base === '.DS_Store') { junk.push(f); continue; }
  const s = fs.statSync(f);
  if (!s.size) { keep.push([f, 'empty file']); continue; }
  if (NEVER_DELETE.test(base)) { keep.push([f, 'markdown — a brain note, never a library duplicate']); continue; }
  const twin = library.get(md5(f));
  if (twin) dupes.push([f, twin, s.size]);
  else keep.push([f, 'NOT in brain/assets — ingest it before it can be removed']);
}

const total = dupes.reduce((n, [, , s]) => n + s, 0);
const junkTotal = junk.reduce((n, f) => n + fs.statSync(f).size, 0);

console.log(`shoebox-dedupe · library ${library.size} unique assets · shoebox ${dupes.length + keep.length + junk.length} files\n`);
const byDir = {};
for (const [f, , s] of dupes) { const d = path.dirname(rel(f)); byDir[d] = byDir[d] || { n: 0, b: 0 }; byDir[d].n++; byDir[d].b += s; }
console.log(`  DUPLICATES — already in brain/assets (${dupes.length} files, ${mb(total)} MB)`);
for (const [d, v] of Object.entries(byDir).sort((a, b) => b[1].b - a[1].b)) {
  console.log(`    ${mb(v.b).padStart(7)} MB  ${String(v.n).padStart(4)} files  ${d}`);
}
const notIngested = keep.filter(([, why]) => why.startsWith('NOT in'));
console.log(`\n  KEPT (${keep.length}): ${keep.length - notIngested.length} markdown/empty` + (notIngested.length ? `, ${notIngested.length} NOT YET INGESTED` : ''));
for (const [f, why] of notIngested) console.log(`    ! ${rel(f)} — ${why}`);
if (junk.length) console.log(`\n  macOS junk: ${junk.length} .DS_Store files (${mb(junkTotal)} MB)${DS ? '' : ' — add --ds-store to clear'}`);

if (!DELETE) {
  console.log('\n  DRY RUN — nothing was deleted.');
  console.log('  Back up first if you want a copy outside the brain:');
  console.log('    ditto shoebox ~/Desktop/territool-shoebox-backup-$(date +%Y%m%d)');
  console.log('  Then re-run with --delete.');
  process.exit(0);
}

let removed = 0;
let freed = 0;
for (const [f, , s] of dupes) {
  if (md5(f) !== md5(library.get(md5(f)))) continue; // paranoid re-check immediately before unlink
  fs.unlinkSync(f);
  removed++;
  freed += s;
}
let junkRemoved = 0;
if (DS) for (const f of junk) { fs.unlinkSync(f); junkRemoved++; }

// Remove directories the deletion emptied; never remove shoebox/ itself or a numbered top folder.
function prune(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(dir, e.name));
  if (dir === SHOEBOX || path.dirname(dir) === SHOEBOX) return;
  if (!fs.readdirSync(dir).length) fs.rmdirSync(dir);
}
prune(SHOEBOX);

console.log(`\n  DELETED ${removed} duplicate file(s), ${mb(freed)} MB reclaimed${junkRemoved ? `, plus ${junkRemoved} .DS_Store` : ''}.`);
console.log('  Every byte removed still exists under brain/assets/ — verified by MD5 immediately before each unlink.');
