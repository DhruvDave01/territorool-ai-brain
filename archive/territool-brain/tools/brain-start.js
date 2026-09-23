#!/usr/bin/env node
/**
 * The one command a member runs — on a fresh clone, or at the start of any session.
 *
 *   node tools/brain-start.js
 *
 * It does, in order:
 *   1. profile   — which tools this member codes and tests with (asked once, stored per member)
 *   2. doctor    — is that setup actually present? names the exact fix for anything missing
 *   3. inbox     — anything new dropped into shoebox/00-INBOX/ since the last look
 *   4. sync      — rebuild the index, the shared graph and the Obsidian vault, and prove they agree
 *   5. status    — what to read first, and what is currently open
 *
 * Deliberately NON-INTERACTIVE. An agent runs this, and a script that stops for stdin would hang it.
 * If no profile exists it prints the question and the exact flags to answer with; the human answers in
 * conversation and the agent re-runs with --tools/--jobs.
 *
 *   node tools/brain-start.js --tools codex,cursor --jobs api-contract,web-unit
 *   node tools/brain-start.js --skip-sync      # faster; skips step 4
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./lib/vault.js');

const ARGS = process.argv.slice(2);
const val = (name) => { const i = ARGS.indexOf(name); return i !== -1 && ARGS[i + 1] && !ARGS[i + 1].startsWith('--') ? ARGS[i + 1] : null; };
const SKIP_SYNC = ARGS.includes('--skip-sync');
const PROFILE = path.join(ROOT, '.local', 'profile.json');

const KNOWN_TOOLS = ['claude', 'codex', 'cursor', 'copilot'];
const KNOWN_JOBS = ['mobile-static', 'mobile-unit', 'web-unit', 'api-contract', 'web-e2e', 'mobile-e2e'];
const line = (s = '') => console.log(s);
const rule = (t) => { line(); line(`── ${t} ${'─'.repeat(Math.max(0, 58 - t.length))}`); };

// ---------------------------------------------------------------- 1. profile
let profile = fs.existsSync(PROFILE) ? JSON.parse(fs.readFileSync(PROFILE, 'utf8')) : null;
const toolsArg = val('--tools');
const jobsArg = val('--jobs');

if (toolsArg || jobsArg) {
  const tools = (toolsArg || '').split(',').map((s) => s.trim()).filter(Boolean);
  const jobs = (jobsArg || '').split(',').map((s) => s.trim()).filter(Boolean);
  const badT = tools.filter((t) => !KNOWN_TOOLS.includes(t));
  const badJ = jobs.filter((j) => !KNOWN_JOBS.includes(j));
  if (badT.length || badJ.length) {
    console.error(`Unknown ${badT.length ? `tool(s): ${badT.join(', ')}` : ''}${badJ.length ? ` job(s): ${badJ.join(', ')}` : ''}`);
    console.error(`  tools: ${KNOWN_TOOLS.join(', ')}\n  jobs:  ${KNOWN_JOBS.join(', ')}`);
    process.exit(2);
  }
  profile = {
    ...(profile || {}),
    tools: tools.length ? tools : (profile && profile.tools) || [],
    jobs: jobs.length ? jobs : (profile && profile.jobs) || [],
    updated: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(PROFILE), { recursive: true });
  fs.writeFileSync(PROFILE, `${JSON.stringify(profile, null, 2)}\n`);
  line(`Saved your profile to .local/profile.json (personal, never committed).`);
}

rule('1. Your setup');
if (!profile || !profile.tools || !profile.tools.length) {
  line('  No profile yet. The brain works with any of these — which are you using?');
  line();
  line(`    coding tool : ${KNOWN_TOOLS.join(' · ')}`);
  line(`    test jobs   : ${KNOWN_JOBS.join(' · ')}`);
  line();
  line('  Answer in chat, or re-run with your choices, e.g.:');
  line('    node tools/brain-start.js --tools cursor,codex --jobs api-contract,web-unit');
  line();
  line('  Continuing with baseline checks only.');
} else {
  line(`  tools: ${profile.tools.join(', ')}`);
  line(`  jobs:  ${(profile.jobs || []).join(', ') || '(default set)'}`);
}

// ---------------------------------------------------------------- 2. doctor
rule('2. Can this machine do the work?');
let ready = true;
try {
  execFileSync(process.execPath, [path.join(__dirname, 'doctor.js')], { stdio: 'inherit' });
} catch {
  ready = false;
}

// ---------------------------------------------------------------- 3. inbox
rule('3. Anything new dropped in?');
try { execFileSync(process.execPath, [path.join(__dirname, 'inbox-scan.js')], { stdio: 'inherit' }); } catch { /* non-fatal */ }

// ---------------------------------------------------------------- 4. sync
if (!SKIP_SYNC) {
  rule('4. Rebuilding the brain');
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'sync-agent-files.js')], { stdio: 'inherit' });
    execFileSync(process.execPath, [path.join(__dirname, 'brain-sync.js'), '--quiet'], { stdio: 'inherit' });
    execFileSync(process.execPath, [path.join(__dirname, 'brain-parity.js')], { stdio: 'inherit' });
  } catch {
    line('  sync FAILED — the two views may disagree. Run `node tools/brain-sync.js` and read the error.');
    ready = false;
  }
}

// ---------------------------------------------------------------- 5. status
rule('5. Where things stand');
const count = (dir, ext = '.md') => { try { return fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(ext)).length; } catch { return 0; } };
line(`  read first     CLAUDE.md · AGENTS.md · _map/Brain Home.md (Obsidian)`);
line(`  context        ${count('brain/context')} notes · gates ${count('brain/gates')} · skills ${fs.existsSync(path.join(ROOT, 'brain/skills')) ? fs.readdirSync(path.join(ROOT, 'brain/skills')).length : 0}`);
line(`  work so far    tasks ${count('workspace/tasks')} · test-cases ${count('workspace/test-cases')} · qa-reports ${count('workspace/qa-reports')}`);
try { execFileSync(process.execPath, [path.join(__dirname, 'brain-score.js'), '--brief'], { stdio: 'inherit' }); } catch { line('  confidence     could not be scored — run `node tools/brain-score.js`'); }

const claudeMd = fs.existsSync(path.join(ROOT, 'CLAUDE.md')) ? fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8') : '';
const open = (claudeMd.split(/^## Open owner items[^\n]*$/m)[1] || '').split(/^## /m)[0].split('\n').filter((l) => l.trim().startsWith('- '));
if (open.length) {
  line();
  line('  open owner items (do not assume answers):');
  for (const o of open) line(`   ${o.trim()}`);
}

line();
line(ready
  ? 'Ready. Start any Territool task through the loop — it will classify it and route it.'
  : 'NOT READY — fix the ✗ items above first. The brain will not invent a way around a missing tool.');
process.exit(ready ? 0 : 1);
