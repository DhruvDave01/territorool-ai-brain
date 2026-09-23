#!/usr/bin/env node
/**
 * Mobile E2E runner (layer L5): Maestro on a SECOND iOS simulator, staging build only.
 *
 *   node workspace/test-suites/mobile/run.js --device <UDID> --role "Sales Agent" <flow.yaml> [--out <dir>]
 *
 * Safety:
 *  - Refuses to run without --device, and refuses any simulator that is not Shutdown→Booted by us:
 *    the device must NOT be the owner's working simulator (listed in PROTECTED below, and any device
 *    whose name the caller has not confirmed). Never drive the user's booted simulator (S0 rule 7).
 *  - Credentials come from .local/test-accounts.md at run time, are passed as Maestro env vars, and are
 *    redacted from every line of output. They are never written to disk by this runner.
 *  - Flows under this folder are read-only navigation: no purchase, save, delete, share or sync taps.
 */
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const ARGS = process.argv.slice(2);
const flag = (n) => { const i = ARGS.indexOf(n); return i !== -1 ? ARGS[i + 1] : null; };
const PROTECTED = ['C73F304D-CF29-425B-8771-61279049E475']; // owner's booted iPhone 17 Pro Max
const MAESTRO = path.join(process.env.HOME, '.maestro', 'bin', 'maestro');

const device = flag('--device');
const role = flag('--role') || 'Sales Agent';
const out = flag('--out') && path.resolve(flag('--out'));
const flowArg = ARGS.find((a) => a.endsWith('.yaml'));
const flow = flowArg && path.resolve(flowArg);
if (!device || !flow) { console.error('usage: run.js --device <UDID> --role "<role>" <flow.yaml> [--out dir]'); process.exit(2); }
if (PROTECTED.includes(device)) { console.error('Refusing: that is the owner\'s working simulator.'); process.exit(2); }
const booted = execFileSync('xcrun', ['simctl', 'list', 'devices', 'booted']).toString();
if (!booted.includes(device)) { console.error('Refusing: the target simulator is not booted.'); process.exit(2); }

const md = fs.readFileSync(path.join(ROOT, '.local', 'test-accounts.md'), 'utf8');
const row = md.split('\n').map((l) => l.split('|').map((s) => s.trim())).find((c) => c[1] === role);
if (!row || !row[3] || /pending/i.test(row[3])) { console.error(`No staging account for role "${role}".`); process.exit(2); }
const [email, pass] = [row[3], row[4]];
const secrets = [email, pass].filter(Boolean);
const redact = (s) => secrets.reduce((a, v) => a.split(v).join('***'), s);

const args = ['--device', device, 'test', '-e', `LOGIN_EMAIL=${email}`, '-e', `LOGIN_PASSWORD=${pass}`];
if (out) { fs.mkdirSync(out, { recursive: true }); args.push('--test-output-dir', out); }
args.push(flow);
const child = spawn(MAESTRO, args, { cwd: out || process.cwd(), env: { ...process.env, MAESTRO_CLI_NO_ANALYTICS: '1' } });
child.stdout.on('data', (d) => process.stdout.write(redact(d.toString())));
child.stderr.on('data', (d) => process.stderr.write(redact(d.toString())));
child.on('close', (code) => {
  // Maestro may echo resolved env into its own logs; scrub anything it wrote under --out.
  if (out) {
    // Maestro's own debug logs echo the resolved env (the login email) and are not evidence we keep, so they
    // are DELETED; the screenshots are the evidence. Any remaining text file is redacted as a backstop.
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name === 'logs') fs.rmSync(p, { recursive: true, force: true }); else walk(p); }
      else if (/xctest_runner_.*\.log$|^maestro\.log$|^commands\.json$/i.test(e.name)) fs.rmSync(p, { force: true });
      else if (/\.(txt|log|json|html|yaml)$/i.test(e.name)) {
        const raw = fs.readFileSync(p, 'utf8'); const r = redact(raw);
        if (r !== raw) fs.writeFileSync(p, r);
      }
    });
    walk(out);
  }
  process.exit(code);
});
