#!/usr/bin/env node
/**
 * Small JPEG thumbnails of the owner's mobile screenshots for the brain graph page.
 *
 * Reads brain/audits/data/owner-mobile-captures.json (run tools/index-owner-screenshots.js first). Duplicates reuse
 * the original's thumbnail. Uses macOS `sips` (read-only on the originals). Thumbnails are cached in
 * workspace/brain-graph/thumbs/ and bundled as workspace/brain-graph/thumbs.js (window.BRAIN_THUMBS).
 *
 * Usage (from territool-brain/): node tools/make-capture-thumbs.js [--width 300] [--quality 50]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const WIDTH = opt('--width', '300');
const QUALITY = opt('--quality', '50');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'brain', 'audits', 'data', 'owner-mobile-captures.json');
const CACHE = path.join(ROOT, 'workspace', 'brain-graph', 'thumbs', `w${WIDTH}-q${QUALITY}`);
const OUT = path.join(ROOT, 'workspace', 'brain-graph', 'thumbs.js');

const files = JSON.parse(fs.readFileSync(DATA, 'utf8')).files.filter((f) => f.kind !== 'video');
fs.mkdirSync(CACHE, { recursive: true });
const thumbs = {};
const alias = {};
let made = 0;
const missing = [];
for (const f of files) {
  if (f.dupOf) { alias[f.id] = f.dupOf; continue; }
  const out = path.join(CACHE, `${f.id}-${f.sha1.slice(0, 8)}.jpg`);
  if (!fs.existsSync(out)) {
    // Prefer the library copy: the shoebox staging copy is deleted once a capture is ingested.
    const src = [f.library, f.shoebox].filter(Boolean).map((r) => path.join(ROOT, r)).find((abs) => fs.existsSync(abs));
    if (!src) { missing.push(f.id); continue; }
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', QUALITY, '--resampleWidth', WIDTH, src, '--out', out], { stdio: 'pipe' });
    made++;
  }
  thumbs[f.id] = `data:image/jpeg;base64,${fs.readFileSync(out).toString('base64')}`;
}
fs.writeFileSync(OUT, `window.BRAIN_THUMBS = ${JSON.stringify(thumbs)};\nwindow.BRAIN_THUMB_ALIAS = ${JSON.stringify(alias)};\n`);
console.log(`thumbnails: ${Object.keys(thumbs).length} (${made} new), aliases ${Object.keys(alias).length}, bundle ${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB`);
if (missing.length) console.log(`  no source image for ${missing.length}: ${missing.slice(0, 8).join(', ')}`);
