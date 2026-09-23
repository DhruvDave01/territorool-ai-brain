#!/usr/bin/env node
/**
 * Checks that this machine can actually do the work, before any work starts.
 *
 * The brain is tool-agnostic, so the question is never "is it set up?" but "is it set up for what YOU
 * are about to do?". The doctor takes your tool choices (from .local/profile.json, or --tool flags) and
 * reports READY / MISSING per capability, with the exact fix for each miss.
 *
 * It never installs anything and never edits a repo — S0.3 requires approval for installs.
 * Documented in brain/context/tooling.md §2; if the two disagree, this file is right.
 *
 * Usage (from territool-brain/):
 *   node tools/doctor.js                      # uses .local/profile.json, or baseline if absent
 *   node tools/doctor.js --tool codex --tool cursor
 *   node tools/doctor.js --job mobile-e2e --job web-e2e
 *   node tools/doctor.js --all                # every tool and every job
 *   node tools/doctor.js --json               # machine-readable
 * Exit 0 if nothing REQUIRED is missing (optional misses are reported, not fatal).
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./lib/vault.js');

const ARGS = process.argv.slice(2);
const multi = (name) => ARGS.reduce((acc, a, i) => (a === name && ARGS[i + 1] && !ARGS[i + 1].startsWith('--') ? [...acc, ARGS[i + 1]] : acc), []);
const ALL = ARGS.includes('--all');
const JSON_OUT = ARGS.includes('--json');

const PROFILE = path.join(ROOT, '.local', 'profile.json');
const profile = fs.existsSync(PROFILE) ? JSON.parse(fs.readFileSync(PROFILE, 'utf8')) : null;

const tools = ALL ? ['claude', 'codex', 'cursor', 'copilot'] : (multi('--tool').length ? multi('--tool') : (profile && profile.tools) || []);
const jobs = ALL ? ['mobile-static', 'mobile-unit', 'web-unit', 'api-contract', 'web-e2e', 'mobile-e2e']
  : (multi('--job').length ? multi('--job') : (profile && profile.jobs) || ['mobile-static', 'web-unit', 'api-contract']);

// ---------------------------------------------------------------- probes
const which = (bin) => { try { return execFileSync('command', ['-v', bin], { shell: '/bin/zsh', encoding: 'utf8' }).trim() || null; } catch { return null; } };
const version = (bin, args) => { try { return execFileSync(bin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n')[0].trim(); } catch { return null; } };
const here = (rel) => path.join(ROOT, rel);
const exists = (rel) => fs.existsSync(here(rel));
const isExec = (rel) => { try { fs.accessSync(here(rel), fs.constants.X_OK); return true; } catch { return false; } };
const linkOk = (rel) => { try { return fs.statSync(here(rel)).isDirectory(); } catch { return false; } };

const results = [];
const add = (area, name, ok, detail, fix, required = true) => results.push({ area, name, ok: !!ok, detail: detail || '', fix: fix || '', required });

// ---------------------------------------------------------------- baseline
{
  const n = version('node', ['--version']);
  const major = n ? parseInt(n.replace(/^v/, ''), 10) : 0;
  add('baseline', 'node ≥ 18', major >= 18, n || 'not found', 'install Node 18 or newer');
  add('baseline', 'git', !!which('git'), version('git', ['--version']) || '', 'install git');

  for (const [name, rel] of [['repos/mobile', 'repos/mobile'], ['repos/web', 'repos/web']]) {
    const ok = linkOk(rel);
    let target = '';
    try { target = fs.readlinkSync(here(rel)); } catch { /* not a symlink */ }
    add('baseline', name, ok, ok ? (target || 'directory') : `does not resolve${target ? ` → ${target}` : ''}`,
      'run `node tools/brain-start.js` and give your local checkout path');
  }

  const acc = exists('.local/test-accounts.md');
  let mode = '';
  if (acc) mode = `mode ${(fs.statSync(here('.local/test-accounts.md')).mode & 0o777).toString(8)}`;
  add('baseline', '.local/test-accounts.md', acc, mode, 'ask the owner for staging test accounts; never commit this file');
}

// ---------------------------------------------------------------- tools
const TOOL_CHECKS = {
  claude: () => add('tool', 'Claude Code', !!which('claude'), which('claude') || 'not on PATH', 'install Claude Code'),
  codex: () => {
    const bin = which('codex');
    add('tool', 'Codex CLI', !!bin, bin || 'not on PATH (~/.codex exists, so it is installed but not linked)',
      'add the Codex binary to PATH, or install the Codex CLI');
    // repos/web/.codex/config.toml registers production MCP servers. The owner decided 2026-09-16 NOT
    // to change the project file, so this is reported as a standing constraint rather than a blocker:
    // the rule is "always use https://staging.territool.com", enforced by S-prod in static-checks and
    // by never opening Codex with repos/web as its working directory.
    const cfg = path.join(ROOT, 'repos', 'web', '.codex', 'config.toml');
    if (fs.existsSync(cfg)) {
      const live = (fs.readFileSync(cfg, 'utf8').match(/app\.territool\.com/g) || []).length;
      add('tool', 'Codex: production MCP present', live === 0,
        live ? `${live} production entr(ies) in repos/web/.codex/config.toml — file left unchanged by owner decision` : 'clean',
        'NEVER open Codex with repos/web as its working directory. Use https://staging.territool.com only (S0.1).',
        false);
    }
  },
  cursor: () => {
    add('tool', 'Cursor app', fs.existsSync('/Applications/Cursor.app'), fs.existsSync('/Applications/Cursor.app') ? 'installed' : 'not installed', 'install Cursor');
    add('tool', 'cursor CLI (optional)', !!which('cursor'), which('cursor') || 'not on PATH',
      "Cursor → Cmd-Shift-P → Shell Command: Install 'cursor'", false);
    add('tool', 'Cursor rules present', exists('.cursor/rules/territool-brain.mdc'), '', 'run `node tools/sync-agent-files.js`');
  },
  copilot: () => {
    add('tool', 'VS Code', fs.existsSync('/Applications/Visual Studio Code.app'), '', 'install VS Code + the Copilot extension');
    add('tool', 'Copilot instructions present', exists('.github/copilot-instructions.md'), '', 'run `node tools/sync-agent-files.js`');
  },
};
for (const t of tools) (TOOL_CHECKS[t] || (() => add('tool', t, false, 'unknown tool', 'supported: claude, codex, cursor, copilot')))();

// ---------------------------------------------------------------- jobs
const JOB_CHECKS = {
  'mobile-static': () => {
    add('job', 'mobile: eslint', isExec('repos/mobile/node_modules/.bin/eslint'), '', 'yarn install in the mobile repo (needs owner approval — S0.3)');
    add('job', 'mobile: tsc', isExec('repos/mobile/node_modules/.bin/tsc'), '', 'yarn install in the mobile repo');
  },
  'mobile-unit': () => add('job', 'mobile: jest', isExec('repos/mobile/node_modules/.bin/jest'), 'baseline is RED — the only suite already fails', 'yarn install in the mobile repo'),
  'web-unit': () => {
    add('job', 'php', !!which('php'), version('php', ['--version']) || '', 'install PHP 7.4');
    add('job', 'web: phpunit', isExec('repos/web/vendor/bin/phpunit'), 'run it with --filter Manager only; ExampleTest hits the DB', 'composer install in the web repo');
  },
  'api-contract': () => {
    add('job', 'api-contract runner', exists('workspace/test-suites/api-contract/run.js'), 'no dependencies', 'missing from the brain — re-clone');
    add('job', 'staging credentials', exists('.local/test-accounts.md'), '', 'ask the owner');
  },
  'web-e2e': () => add('job', 'playwright browsers', exists('tools/ms-playwright'), '', 'cd tools && PLAYWRIGHT_BROWSERS_PATH=$PWD/ms-playwright npx playwright install chromium'),
  'mobile-e2e': () => {
    add('job', 'maestro', !!which('maestro'), which('maestro') || 'not on PATH', 'install Maestro (ask the owner first — S0.3)');
    add('job', 'a second iOS simulator', true, 'not auto-detected — never drive the booted one (S0.7)', '', false);
  },
};
for (const j of jobs) (JOB_CHECKS[j] || (() => add('job', j, false, 'unknown job', `supported: ${Object.keys(JOB_CHECKS).join(', ')}`)))();

// ---------------------------------------------------------------- brain invariants
add('brain', 'index present', exists('brain/audits/data/brain-index.json'), '', 'run `node tools/brain-sync.js`');
add('brain', 'tool files rendered', exists('AGENTS.md'), '', 'run `node tools/sync-agent-files.js`');

// ---------------------------------------------------------------- report
const missingRequired = results.filter((r) => !r.ok && r.required);
const missingOptional = results.filter((r) => !r.ok && !r.required);

if (JSON_OUT) {
  console.log(JSON.stringify({ tools, jobs, ready: missingRequired.length === 0, results }, null, 2));
  process.exit(missingRequired.length ? 1 : 0);
}

console.log(`Doctor · tools: ${tools.length ? tools.join(', ') : '(none chosen — baseline only)'} · jobs: ${jobs.join(', ')}\n`);
let area = '';
for (const r of results) {
  if (r.area !== area) { area = r.area; console.log(`  ${area.toUpperCase()}`); }
  console.log(`   ${r.ok ? '✓' : (r.required ? '✗' : '·')} ${r.name.padEnd(34)} ${r.detail}`);
  if (!r.ok && r.fix) console.log(`       → ${r.fix}`);
}
console.log('');
if (missingRequired.length) {
  console.log(`NOT READY — ${missingRequired.length} required item(s) missing. Fix those first; the brain will not invent a way around them.`);
} else {
  console.log(`READY${missingOptional.length ? ` — with ${missingOptional.length} optional item(s) missing` : ''}. You can start work.`);
}
process.exit(missingRequired.length ? 1 : 0);
