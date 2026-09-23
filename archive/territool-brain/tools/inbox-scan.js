#!/usr/bin/env node
/**
 * Notices what has been dropped into the brain since the last look.
 *
 * `shoebox/00-INBOX/` is the single drop zone: anything at all goes there. This script compares the
 * folder against a manifest of what it has already reported, classifies each new item, and suggests a
 * destination. It deliberately does NOT move anything — a wrongly auto-filed document is harder to spot
 * than an unfiled one, and where something belongs is a judgement call.
 *
 * It also flags items sitting in the INBOX from previous runs, so nothing quietly rots there.
 *
 * Usage (from territool-brain/):
 *   node tools/inbox-scan.js            # report new + still-waiting items
 *   node tools/inbox-scan.js --ack      # mark everything currently present as seen
 *   node tools/inbox-scan.js --quiet    # only speak if something is new
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ROOT } = require('./lib/vault.js');

const ARGS = process.argv.slice(2);
const ACK = ARGS.includes('--ack');
const QUIET = ARGS.includes('--quiet');

const INBOX = 'shoebox/00-INBOX';
const MANIFEST = 'brain/audits/data/inbox-seen.json';

const KINDS = [
  [/\.(png|jpe?g|gif|webp|heic)$/i, 'screenshot / image', 'shoebox/02-mobile/screenshots/<Flow>/ or shoebox/03-web/screenshots/ — then `node tools/index-owner-screenshots.js`'],
  [/\.(mp4|mov|m4v|webm)$/i, 'screen recording', 'shoebox/02-mobile/Assets/Videos/ — tell the brain which flow it shows; frames need ffmpeg (not installed)'],
  [/\.(pdf)$/i, 'document', 'shoebox/05-standards/ (rules) · shoebox/04-design/ (design) · shoebox/01-context/ (product)'],
  [/\.(docx?|pages|rtf|txt|md)$/i, 'written notes', 'shoebox/01-context/ — or straight into brain/context/ if it is settled truth, with a citation'],
  [/\.(csv|xlsx?|numbers)$/i, 'tabular data', 'shoebox/06-testing/ (test data) · shoebox/01-context/ (business rules, e.g. plans & credits — gap W2)'],
  [/\.(json|ya?ml|toml|har|postman_collection)$/i, 'config / API export', 'shoebox/08-api/ — a Postman or OpenAPI export would close the "no API contract" gap'],
  [/\.(sql|dump)$/i, 'database export', 'shoebox/08-api/ — schema only. **Never commit real customer data** (S0.4)'],
  [/\.(sketch|fig|xd|afdesign|psd)$/i, 'design file', 'shoebox/04-design/ — export the tokens/assets you need into brain/assets/'],
  [/\.(zip|tar|gz|tgz)$/i, 'archive', 'unpack it here first, then re-run the scan'],
];
const classify = (f) => (KINDS.find(([re]) => re.test(f)) || [null, 'unrecognised', 'tell the brain what it is']).slice(1);

const readManifest = () => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, MANIFEST), 'utf8')); } catch { return { seen: {} }; } };

function walk(dir, out = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.')) continue;
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(rel, out);
    else if (e.isFile() && e.name !== 'README.md') out.push(rel);
  }
  return out;
}

const sizeOf = (rel) => fs.statSync(path.join(ROOT, rel)).size;
const human = (n) => (n > 1e9 ? `${(n / 1e9).toFixed(1)} GB` : n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
// Identity = path + size + mtime. Hashing a 160 MB video on every startup is not worth the certainty.
const stamp = (rel) => { const s = fs.statSync(path.join(ROOT, rel)); return crypto.createHash('sha1').update(`${rel}:${s.size}:${Math.round(s.mtimeMs)}`).digest('hex').slice(0, 12); };

const manifest = readManifest();
const files = walk(INBOX);
const fresh = [];
const waiting = [];
for (const f of files) (manifest.seen[f] === stamp(f) ? waiting : fresh).push(f);

if (ACK) {
  const seen = {};
  for (const f of files) seen[f] = stamp(f);
  fs.writeFileSync(path.join(ROOT, MANIFEST), `${JSON.stringify({ updated: new Date().toISOString(), seen }, null, 2)}\n`);
  console.log(`inbox: ${files.length} item(s) marked as seen.`);
  process.exit(0);
}

if (!files.length) {
  if (!QUIET) console.log(`inbox: empty (${INBOX}/). Drop anything in there and re-run.`);
  process.exit(0);
}
if (QUIET && !fresh.length) process.exit(0);

const show = (title, list) => {
  if (!list.length) return;
  console.log(`\n  ${title}`);
  for (const f of list) {
    const [kind, dest] = classify(path.basename(f));
    console.log(`   • ${path.relative(INBOX, f)}  (${kind}, ${human(sizeOf(f))})`);
    console.log(`       suggested home: ${dest}`);
  }
};
console.log(`inbox: ${fresh.length} new, ${waiting.length} still waiting  (${INBOX}/)`);
show(`NEW since the last scan (${fresh.length})`, fresh);
show(`Still unfiled from earlier (${waiting.length})`, waiting);
console.log('\n  Nothing was moved. Ask Claude to file these, or move them yourself and cite them from brain/context/.');
console.log('  `node tools/inbox-scan.js --ack` silences items you have decided to leave here.');
