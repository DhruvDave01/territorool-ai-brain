/**
 * One login per role per run. Each successful login inserts a `usertoken` row (F01-login.js), so read-only
 * cases share a cached token instead of logging in again.
 */
const { call, classify } = require('./env.js');

const cache = new Map();
async function token(account) {
  if (!account) return null;
  if (cache.has(account.email)) return cache.get(account.email);
  const r = await call('login', { body: { email: account.email, password: account.pass, device_type: 'ios', device_token: 'QA-AUTO-contract' } });
  const tk = r.json && r.json.data && r.json.data.token;
  if (!tk) throw new Error(`login failed for this role (status ${r.json && r.json.status})`);
  classify(tk);
  cache.set(account.email, tk);
  return tk;
}

/** Keys and value types only — never values. Used to document response shapes safely. */
function shape(v, depth = 0) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return v.length ? [shape(v[0], depth + 1)] : [];
  if (typeof v === 'object') {
    if (depth > 2) return 'object';
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape(v[k], depth + 1)]));
  }
  return typeof v;
}

module.exports = { token, shape };
