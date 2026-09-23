#!/usr/bin/env node
/**
 * Self-test for the two live-code map generators (api-map.js, data-model.js): the parts that are pure logic,
 * on fixed inputs, so a regression in the parser is caught without touching the repos.
 *
 *   node tools/api-map.selftest.js
 */
const assert = require('assert');
let n = 0; const ok = (name, cond) => { n++; if (!cond) { console.error(`✗ ${name}`); process.exitCode = 1; } else console.log(`✓ ${name}`); };

// --- route parsing: only the v2 block, commented lines skipped, auth group detected ---
const api = `
$api->version('v1', function ($api) {
    $api->post('deadv1', 'App\\\\Api\\\\V1\\\\Controllers\\\\X@dead');
});
$api->version('v2', function ($api) {
    $api->post('login', 'App\\\\Api\\\\V2\\\\Controllers\\\\AuthController@login');
    // $api->post('old', 'App\\\\Api\\\\V2\\\\Controllers\\\\AuthController@old');
    $api->get('citysearch', 'App\\\\Api\\\\V2\\\\Controllers\\\\CityController@search');
    $api->group(['middleware' => 'jwt.refresh'], function ($api) {
        $api->post('createroute', 'App\\\\Api\\\\V2\\\\Controllers\\\\RouteController@createRoute');
    });
});`;
const v2 = api.slice(api.indexOf("$api->version('v2'"));
const routes = [];
let authed = false;
v2.split('\n').forEach((raw) => {
  const line = raw.trim();
  if (line.startsWith('//')) return;
  if (/middleware'\s*=>\s*'jwt\.refresh'/.test(line)) authed = true;
  const m = line.match(/\$api->(get|post|put|delete|patch)\(\s*'([^']+)'\s*,\s*'\\?([^'@]+)@([^']+)'/);
  if (!m) return;
  routes.push({ method: m[1].toUpperCase(), uri: m[2], auth: authed ? 'JWT' : 'public' });
});
ok('only v2 routes parsed (3)', routes.length === 3);
ok('v1 route excluded', !routes.some((r) => r.uri === 'deadv1'));
ok('commented route excluded', !routes.some((r) => r.uri === 'old'));
ok('public before the group', routes.find((r) => r.uri === 'login').auth === 'public');
ok('citysearch is public', routes.find((r) => r.uri === 'citysearch').auth === 'public');
ok('route inside the group is JWT', routes.find((r) => r.uri === 'createroute').auth === 'JWT');

// --- kind inference (the labelled heuristic in api-map.js) ---
const kindOf = (uri, method) => {
  const u = uri.toLowerCase();
  if (/webhook|revenue-subscription|revenuecate/.test(u)) return 'webhook';
  if (/buycontacts|redeem|saveaileads|cancelsubscription|package-upgrade/.test(u)) return 'paid/billing';
  if (/sync|zapier|shareroute|invite|recovery|reset|addticket|notify|notifications$/.test(u)) return 'external side effect';
  if (/^(get|fetch|check|simple|advance|notificationlist|routelist|contactlist|companylist|citysearch|getuser)/.test(u) || /list$/.test(u) || method === 'GET') return 'read';
  if (/remove|delete/.test(u)) return 'delete';
  return 'write';
};
ok('apollo-webhook → webhook', kindOf('apollo-webhook', 'POST') === 'webhook');
ok('buyContacts → paid/billing', kindOf('buyContacts', 'POST') === 'paid/billing');
ok('newreleasenotify → external side effect', kindOf('newreleasenotify', 'GET') === 'external side effect');
ok('routelist → read', kindOf('routelist', 'GET') === 'read');
ok('createroute → write', kindOf('createroute', 'POST') === 'write');

// --- PHP comment stripping (data-model.js: a commented $table must not be read) ---
const code = (t) => t.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).replace(/^\s*(\/\/|#).*$/gm, '');
const cls = `class HubspotMapping extends Model {\n\t//protected $table = 'user_visited_companies';\n\tprotected $fillable = ['a'];\n}`;
const stripped = code(cls);
ok('commented $table ignored', !/\$table\s*=\s*'user_visited_companies'/.test(stripped));

// --- Realm property extraction at depth 1 only ---
const realm = `static schema = { name: "JWTToken", primaryKey: "id", properties: { id: { type: "string" }, value: { type: "string" }, meta: { nested: { deep: 1 } } } };`;
const m = realm.match(/properties:\s*\{/);
let i = m.index + m[0].length, depth = 1, body = '';
while (i < realm.length && depth) { const ch = realm[i++]; if (ch === '{') depth++; else if (ch === '}') depth--; if (depth === 1 && ch !== '}') body += ch; else if (depth > 1) body += ' '; }
const props = [...body.matchAll(/(\w+)\s*:/g)].map((p) => p[1]);
ok('Realm props at depth 1 only', JSON.stringify(props) === JSON.stringify(['id', 'value', 'meta']));

console.log(process.exitCode ? '\nFAILED' : `\nall ${n} checks pass`);
