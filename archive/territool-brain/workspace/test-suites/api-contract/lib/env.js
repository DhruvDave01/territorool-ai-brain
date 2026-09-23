/**
 * Shared plumbing for the API-contract suite (layer L3 of brain/audits/05-testing.md §2).
 *
 * Safety, per the staging policy (05-testing.md §7) and S0:
 *  - The base URL is hard-wired to staging and the runner refuses to start otherwise.
 *  - Only endpoints a case names are ever called. Nothing here loops over routes.
 *  - Credentials are read from ../../../.local/test-accounts.md at run time and never printed:
 *    redact() scrubs emails, passwords and JWTs from everything a case reports.
 *
 * Deliberately dependency-free: node's built-in fetch, so the suite runs with no install.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
// Same shape the mobile app uses: App/config/index.js URL_BASE (pretty URLs 404, hence index.php).
const BASE = 'https://staging.territool.com/index.php/api/';
const HOST = new URL(BASE).hostname;
if (!/(^|\.)staging\.territool\.com$/.test(HOST)) throw new Error(`Refusing to run: ${HOST} is not staging`);

const ACCOUNTS = path.join(ROOT, '.local', 'test-accounts.md');

/** Roles from .local/test-accounts.md. Same parser as tools/capture-web.js. */
function readAccounts() {
  const md = fs.readFileSync(ACCOUNTS, 'utf8');
  const rows = md.split('\n').filter((l) => /^\|\s*(Sales Agent|Business Sales Agent|Business Agent|Admin)\s*\|/.test(l));
  const acc = {};
  for (const r of rows) {
    const c = r.split('|').map((s) => s.trim());
    const [, role, , email, pass] = c;
    if (email && pass && !/pending/i.test(email) && !/pending/i.test(pass)) acc[role] = { email, pass };
  }
  return acc;
}

const SECRETS = [];
/** Register a value that must never reach the console or a report. */
function classify(...values) { for (const v of values) if (v && String(v).length > 3) SECRETS.push(String(v)); }

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Scrub known credentials and any JWT from a string or object before it is shown or written. */
function redact(value) {
  let s = typeof value === 'string' ? value : JSON.stringify(value);
  for (const secret of SECRETS) s = s.split(secret).join('<redacted>');
  s = s.replace(/eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, '<jwt>');
  s = s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '<email>');
  return s;
}

/** POST/GET a named endpoint. `endpoint` is a bare path like 'login' — never a full URL. */
async function call(endpoint, { method = 'POST', body, token, timeout = 20000 } = {}) {
  if (/^https?:/i.test(endpoint)) throw new Error('call() takes a bare endpoint, not a URL');
  const url = new URL(endpoint.replace(/^\/+/, ''), BASE).toString();
  if (!url.startsWith(BASE)) throw new Error(`Refusing to call outside the staging API: ${url}`);
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const started = Date.now();
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  try {
    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: ctl.signal, redirect: 'manual' });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* handled by the case as a contract failure */ }
    return { httpStatus: res.status, json, text, ms: Date.now() - started, url };
  } finally { clearTimeout(timer); }
}

module.exports = { BASE, ROOT, readAccounts, classify, redact, call };
