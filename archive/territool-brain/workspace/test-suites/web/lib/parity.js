/**
 * Parity helpers (2026-09-17): the same account read through the mobile V2 API and the web app must agree.
 * API calls go through the API suite's staging-guarded client; web reads are GETs on the signed-in session.
 * Lives in lib/, not cases/, so the runner does not load it as a suite.
 */
const path = require('path');
const E = require(path.resolve(__dirname, '../../api-contract/lib/env.js'));
const { token } = require(path.resolve(__dirname, '../../api-contract/lib/session.js'));

async function apiFor(role) {
  const a = E.readAccounts()[role];
  if (!a) return null;
  E.classify(a.email, a.pass);
  return token(a);
}
/** Stat cards on web list pages: "<label>" → number. */
function stats(html) {
  const out = {};
  for (const m of String(html).matchAll(/route-stat-label">([^<]+)<\/span>\s*<h4 class="route-stat-value">\s*([\d,]+)/g)) out[m[1].trim()] = Number(m[2].replace(/,/g, ''));
  return out;
}
module.exports = { E, apiFor, stats };
