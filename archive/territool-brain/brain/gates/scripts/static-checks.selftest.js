#!/usr/bin/env node
/**
 * Fixture test for static-checks.js. Builds throwaway git repos in the OS temp dir,
 * adds known-bad and known-good lines, and asserts which rule IDs fire.
 * Never touches repos/. Usage: node brain/gates/scripts/static-checks.selftest.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const SCRIPT = path.join(__dirname, 'static-checks.js');
const sh = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: 'pipe' });

function makeRepo(name, committed, changes) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `tt-sc-${name}-`));
  sh(dir, 'init', '-q');
  sh(dir, 'config', 'user.email', 'selftest@example.invalid');
  sh(dir, 'config', 'user.name', 'selftest');
  const write = (files) => Object.entries(files).forEach(([f, c]) => {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), c);
  });
  write(committed);
  sh(dir, 'add', '-A');
  sh(dir, 'commit', '-qm', 'base');
  write(changes);
  return dir;
}

function run(repo, dir) {
  const r = spawnSync('node', [SCRIPT, '--repo', repo, '--repo-path', dir, '--no-lint', '--json'], { encoding: 'utf8' });
  return { exit: r.status, out: JSON.parse(r.stdout) };
}

let failed = 0;
function expect(label, out, file, line, id, present = true) {
  const hit = out.findings.some((f) => f.file === file && f.line === line && f.id === id);
  if (hit !== present) { failed++; console.log(`FAIL  ${label}: expected ${id} ${present ? '' : 'NOT '}at ${file}:${line}`); }
  else console.log(`ok    ${label}`);
}

// ---------- mobile ----------
const oldScreen = [
  'import React from "react";',
  'export default function Old() {',
  '  const c = "#FF0000"; // legacy, must not be reported',
  '  return null;',
  '}',
  '',
].join('\n');
const mobileDir = makeRepo('mobile', {
  'App/components/old/index.js': oldScreen,
  'App/utils/Global.js': 'export default class Global {\n  static token = "";\n}\n',
}, {
  'App/components/old/index.js': oldScreen.replace('  return null;', [
    '  const x = "#124AC6";',                          // 4  M8-color
    '  const s = { fontSize: 14 };',                   // 5  M8-fontsize
    '  fetch("https://staging.territool.com/api");',   // 6  M2
    '  try { go(); } catch (e) {}',                    // 7  M6
    '  logout();',                                     // 8  M5 (warn)
    '  const k = "AIzaSyA1234567890abcdefghijklmnop";',// 9  M17
    '  const u = "https://app.territool.com/x";',      // 10 S-prod
    '  const t = <Text>{"Add Waypoint"}</Text>;',      // 11 S-glossary (warn)
    '  const v = <View style={{ flex: 1 }} />;',       // 12 M9 (warn)
    '  captureSentryError(e, { password });',          // 13 M16
    '  const ok = tokens.color.brand.primary;',        // 14 clean
    '  return null;',
  ].join('\n')),
  'App/utils/Global.js': 'export default class Global {\n  static token = "";\n  static newFlag = false;\n}\n',
  'App/components/fresh/index.js': 'import React from "react";\nexport default class Fresh extends React.Component {}\n',
  'App/styles/tokens.js': 'export const tokens = { color: { brand: { primary: "#124AC6" } } };\n',
});
const m = run('mobile', mobileDir);
expect('M8-color on added line', m.out, 'App/components/old/index.js', 4, 'M8-color');
expect('legacy colour not reported (new-code-only)', m.out, 'App/components/old/index.js', 3, 'M8-color', false);
expect('M8-fontsize', m.out, 'App/components/old/index.js', 5, 'M8-fontsize');
expect('M2 raw fetch', m.out, 'App/components/old/index.js', 6, 'M2');
expect('M6 empty catch', m.out, 'App/components/old/index.js', 7, 'M6');
expect('M5 logout warn', m.out, 'App/components/old/index.js', 8, 'M5');
expect('M17 secret', m.out, 'App/components/old/index.js', 9, 'M17');
expect('S-prod production host', m.out, 'App/components/old/index.js', 10, 'S-prod');
expect('S-glossary Waypoint', m.out, 'App/components/old/index.js', 11, 'S-glossary');
expect('M9 inline style warn', m.out, 'App/components/old/index.js', 12, 'M9');
expect('M16 telemetry password', m.out, 'App/components/old/index.js', 13, 'M16');
expect('token usage is clean', m.out, 'App/components/old/index.js', 14, 'M8-color', false);
expect('M14 Global.js new static', m.out, 'App/utils/Global.js', 3, 'M14');
expect('M1 class component in new untracked file', m.out, 'App/components/fresh/index.js', 2, 'M1');
expect('tokens.js may hold hex values', m.out, 'App/styles/tokens.js', 1, 'M8-color', false);
if (m.exit !== 1) { failed++; console.log('FAIL  mobile exit code should be 1'); } else console.log('ok    mobile exit code 1');

// ---------- web ----------
const webDir = makeRepo('web', {
  'app/Api/V2/Controllers/DemoController.php': '<?php\nclass DemoController {\n}\n',
  'app/Api/V1/Controllers/OldController.php': '<?php\nclass OldController {\n}\n',
  'app/Globals/Helper.php': '<?php\nclass Helper {\n}\n',
  'resources/views/demo.blade.php': '<div></div>\n',
  'config/demo.php': "<?php\nreturn [];\n",
}, {
  'app/Api/V2/Controllers/DemoController.php': [
    '<?php',                                                                  // 1
    'class DemoController {',                                                 // 2
    "  public function a() { return ['status' => '1']; }",                    // 3  W2
    '  public function b($id) { return DB::select("SELECT * FROM t WHERE id = $id"); }', // 4 W4
    '  public function c() { $u = JWTAuth::parseToken()->authenticate(); }',  // 5  W6
    '  public function d() { return new \\App\\Http\\Controllers\\RoutesController(); }', // 6 W7-layer
    '  public function e($request) { \\Log::info(json_encode($request->all())); }', // 7 W13
    '  public function f() { dd($x); }',                                      // 8  W14
    "  public function g() { return env('APP_KEY'); }",                       // 9  W15-env
    '  public function h($u) { return $u?->name; }',                          // 10 W17 (also php -l on 7.x)
    "  public function i() { return ['status' => 1]; }",                      // 11 clean
    "  public function j() { return config('services.demo.api_key', '0b499e9a-aaaa-4bbb-8ccc-000000000000'); }", // 12 W15-secret (fake key)
    '  public function k() { $storageKey = "jwt_token_storage_key_v2"; }',   // 13 clean (not key-like)
    '  /** @param array{lat: mixed, lng: mixed} $anchor */',                  // 14 clean (PHPDoc, not PHP 8 syntax)
    '}',
  ].join('\n') + '\n',
  'app/Api/V1/Controllers/OldController.php': '<?php\nclass OldController {\n  // touched\n}\n',
  'app/Globals/Helper.php': '<?php\nclass Helper {\n  public static function newThing() {}\n}\n',
  'resources/views/demo.blade.php': '<div></div>\n<script>alert(1)</script>\n<script src="/js/ok.js"></script>\n',
  'config/demo.php': "<?php\nreturn ['k' => env('X')];\n",
});
const w = run('web', webDir);
const W = 'app/Api/V2/Controllers/DemoController.php';
expect('W2 string status', w.out, W, 3, 'W2');
expect('W4 string SQL', w.out, W, 4, 'W4');
expect('W6 JWT parse', w.out, W, 5, 'W6');
expect('W7-layer web controller in API', w.out, W, 6, 'W7-layer');
expect('W13 logging request body', w.out, W, 7, 'W13');
expect('W14 dd()', w.out, W, 8, 'W14');
expect('W15-env outside config', w.out, W, 9, 'W15-env');
expect('W17 nullsafe operator', w.out, W, 10, 'W17');
expect('int status is clean', w.out, W, 11, 'W2', false);
expect('W15-secret hardcoded key fallback in config()', w.out, W, 12, 'W15-secret');
expect('storage-key name is not a secret', w.out, W, 13, 'W15-secret', false);
expect('W17 ignores PHPDoc array shapes', w.out, W, 14, 'W17', false);
expect('W1 V1 touched', w.out, 'app/Api/V1/Controllers/OldController.php', 3, 'W1');
expect('W7-frozen new method in Helper.php', w.out, 'app/Globals/Helper.php', 3, 'W7-frozen');
expect('W19 inline script', w.out, 'resources/views/demo.blade.php', 2, 'W19');
expect('W19 external script is clean', w.out, 'resources/views/demo.blade.php', 3, 'W19', false);
expect('env() inside config is clean', w.out, 'config/demo.php', 2, 'W15-env', false);
if (w.exit !== 1) { failed++; console.log('FAIL  web exit code should be 1'); } else console.log('ok    web exit code 1');

// ---------- commit mode (retrospective on a past commit; working tree untouched) ----------
sh(webDir, 'add', '-A');
sh(webDir, 'commit', '-qm', 'change');
const wcRun = spawnSync('node', [SCRIPT, '--repo', 'web', '--repo-path', webDir, '--commit', 'HEAD', '--json'], { encoding: 'utf8' });
const wc = JSON.parse(wcRun.stdout);
expect('commit mode: W2 in committed change', wc, W, 3, 'W2');
expect('commit mode: W19 in committed Blade', wc, 'resources/views/demo.blade.php', 2, 'W19');
expect('commit mode: unchanged legacy line not reported', wc, 'app/Api/V1/Controllers/OldController.php', 2, 'W1', false);

// ---------- clean change passes ----------
const cleanDir = makeRepo('clean', { 'app/Services/X.php': '<?php\nclass X {\n}\n' }, { 'app/Services/X.php': "<?php\nclass X {\n  public function ok() { return ['status' => 1]; }\n}\n" });
const c = run('web', cleanDir);
if (c.exit !== 0 || c.out.fails !== 0) { failed++; console.log('FAIL  clean change should exit 0 with 0 FAIL', JSON.stringify(c.out.findings)); } else console.log('ok    clean change exit 0');

for (const d of [mobileDir, webDir, cleanDir]) fs.rmSync(d, { recursive: true, force: true });
console.log(failed ? `\n${failed} assertion(s) failed` : '\nAll static-checks fixtures passed');
process.exit(failed ? 1 : 0);
