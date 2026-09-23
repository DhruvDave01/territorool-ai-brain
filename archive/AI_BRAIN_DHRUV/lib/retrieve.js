const fs = require("fs");
const path = require("path");

const STOP = new Set([
  "a", "an", "the", "and", "or", "to", "of", "in", "for", "on", "is", "it",
  "how", "what", "does", "do", "we", "can", "this", "that", "with", "from",
  "are", "was", "were", "be", "been", "our", "your", "you", "i", "my",
]);
const K1 = 1.5;
const B = 0.75;
const CHUNK_TARGET = 1200;
const SKIP_DIRS = new Set([".git", "api", "node_modules", "evals", "scripts", "__pycache__", ".vercel"]);
const HUB_RULES = [
  [["bug", "bugs", "typo", "typos", "gap", "gaps", "stale"],
    ["ops/known-bugs.md", "ops/", "05-constraints-and-drift.md"]],
  [["credit", "credits", "billing", "package", "packages", "stripe"],
    ["09-credits-billing.md", "features/10-credits-subscription.md", "features/07-ai-find-leads.md"]],
  [["env", "envs", "environment", "secret", "secrets", "variable", "variables"],
    ["ops/env-inventory.md", "ops/", "ops/release-flavor-matrix.md"]],
  [["column", "columns", "database", "schema", "table", "tables"],
    ["data/database-columns.md", "data/", "16-data-models.md"]],
  [["formdata", "jwt", "endpoint", "endpoints", "api"],
    ["brains/api.md", "12-mobile-api.md", "13-web-urls.md", "data/formdata-dictionary.md"]],
  [["mcp", "tools", "admin"],
    ["14-mcp.md", "brains/web-code.md", "code/web-code-details.md", "brains/api.md"]],
  [["role", "roles", "manager", "salesperson", "agent"],
    ["06-users-and-roles.md", "features/12-manager-portal.md", "features/13-admin-hq.md"]],
  [["color", "colours", "colors", "brand", "typography", "token", "tokens"],
    ["design/01-Brand-Guidelines/", "brains/mobile-ui.md", "design/MINI-DESIGN-BRAIN.md", "design-web/Tokens.md"]],
  [["screen", "navigator", "realm", "native", "footer", "header"],
    ["brains/mobile-code.md", "brains/mobile-ui.md", "10-mobile-app.md", "code/mobile-code-details.md", "04-style-guide.md", "screens/how-it-works.md"]],
  [["route", "routes", "optimize", "optimisation", "optimization", "waypoint", "visit", "visited"],
    ["features/09-routes.md", "features/15-maps-and-geo.md", "brains/api.md", "14-mcp.md"]],
  [["salesforce", "hubspot", "crm", "sync"],
    ["features/11-crm-sync.md", "17-integrations.md"]],
  [["laravel", "blade", "dingo", "controller"],
    ["brains/web-code.md", "11-web-backend.md", "code/web-code-details.md"]],
  [["hq"],
    ["13-web-urls.md", "features/13-admin-hq.md", "brains/web-code.md"]],
];

const TOKEN = /[a-z0-9]{3,}/g;
const HEADING = /^(#{1,6})\s+(.+)/;
let cached = null;

function tokenizeList(text) {
  return (String(text).toLowerCase().match(TOKEN) || []).filter((t) => !STOP.has(t));
}

function tokenize(text) {
  return new Set(tokenizeList(text));
}

function stripFrontmatter(body) {
  if (!body.startsWith("---")) return body;
  const end = body.indexOf("\n---", 3);
  if (end === -1) return body;
  return body.slice(end + 4);
}

function walkMarkdown(dir, root, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".") || SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkMarkdown(full, root, out);
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

function splitChunks(rel, body) {
  body = stripFrontmatter(body).trim();
  if (!body) return [];
  const lines = body.split(/\r?\n/);
  const chunks = [];
  let buf = [];
  let heading = "";
  let size = 0;
  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) chunks.push({ rel, heading, text });
    buf = [];
    size = 0;
  };
  for (const line of lines) {
    const m = line.match(HEADING);
    const overflow = size + line.length + 1 > CHUNK_TARGET && size >= 500;
    const onHeading = Boolean(m) && size >= 350;
    if (buf.length && (onHeading || overflow)) flush();
    if (m) heading = m[2].trim();
    buf.push(line);
    size += line.length + 1;
  }
  flush();
  return chunks;
}

function buildIndex(root) {
  const files = walkMarkdown(root, root).sort();
  const chunks = [];
  const df = new Map();
  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    let body;
    try {
      body = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const ch of splitChunks(rel, body)) {
      const blob = `${rel} ${ch.heading} ${ch.text}`;
      const tf = new Map();
      for (const t of tokenizeList(blob)) tf.set(t, (tf.get(t) || 0) + 1);
      ch.tf = tf;
      let dl = 0;
      for (const n of tf.values()) dl += n;
      ch.dl = Math.max(1, dl);
      chunks.push(ch);
      for (const term of tf.keys()) df.set(term, (df.get(term) || 0) + 1);
    }
  }
  const n = Math.max(1, chunks.length);
  const avgdl = chunks.reduce((s, c) => s + c.dl, 0) / n;
  return { root, chunks, df, n, avgdl };
}

function getIndex(root) {
  if (!cached || cached.root !== root) cached = buildIndex(root);
  return cached;
}

function idf(term, index) {
  const df = index.df.get(term) || 0;
  return Math.log((index.n - df + 0.5) / (df + 0.5) + 1);
}

function bm25(tf, dl, terms, index) {
  let score = 0;
  const avgdl = index.avgdl || 1;
  for (const term of terms) {
    const freq = tf.get(term) || 0;
    if (!freq) continue;
    const denom = freq + K1 * (1 - B + B * (dl / avgdl));
    score += idf(term, index) * (freq * (K1 + 1)) / denom;
  }
  return score;
}

function hubPrefixes(question) {
  const terms = tokenize(question);
  const out = [];
  const seen = new Set();
  for (const [keys, prefixes] of HUB_RULES) {
    if (keys.some((k) => terms.has(k))) {
      for (const p of prefixes) {
        if (!seen.has(p)) {
          seen.add(p);
          out.push(p);
        }
      }
    }
  }
  return out;
}

const DESIGN_DUMPS = new Set([
  "design/MINI-DESIGN-BRAIN.md",
  "design-web/MINI-DESIGN-BRAIN.md",
  "design/02-User-Interface/Screen-Inventory.md",
  "design/05-Design-System/Token-Inconsistencies.md",
]);

function termsOverlap(qterms, other) {
  let n = 0;
  for (const q of qterms) {
    for (const s of other) {
      if (q === s || q.startsWith(s) || s.startsWith(q)) {
        n += 1;
        break;
      }
    }
  }
  return n;
}

function pathBoost(rel, prefixes, selected, qterms) {
  let boost = 1;
  if (prefixes.length && prefixes.some((p) => rel === p || rel.startsWith(p))) boost *= 1.55;
  if (selected && rel === selected) boost *= 2.2;
  const stem = path.basename(rel, ".md").toLowerCase().replace(/-/g, " ");
  const overlap = termsOverlap(qterms, tokenize(stem));
  if (overlap) boost *= 1 + 0.35 * overlap;
  const designOk = prefixes.some((p) => p.startsWith("design"));
  if ((rel.startsWith("design/") || rel.startsWith("design-web/")) && !designOk) boost *= 0.5;
  if (DESIGN_DUMPS.has(rel) && !designOk) boost *= 0.45;
  return boost;
}

function retrieve(question, selected, limit = 6, root = process.cwd()) {
  const index = getIndex(root);
  const qterms = tokenize(question);
  if (selected) {
    for (const t of tokenize(path.basename(selected, ".md").replace(/-/g, " "))) qterms.add(t);
  }
  if (!qterms.size) return [];
  const prefixes = hubPrefixes(question);
  const ranked = [];
  for (const ch of index.chunks) {
    const raw = bm25(ch.tf, ch.dl, qterms, index);
    if (raw <= 0) continue;
    ranked.push({ score: raw * pathBoost(ch.rel, prefixes, selected, qterms), ch });
  }
  ranked.sort((a, b) => b.score - a.score);
  const out = [];
  const perFile = new Map();
  for (const item of ranked) {
    const rel = item.ch.rel;
    if ((perFile.get(rel) || 0) >= 2) continue;
    perFile.set(rel, (perFile.get(rel) || 0) + 1);
    const heading = item.ch.heading ? `## ${item.ch.heading}\n` : "";
    out.push({ rel, body: heading + item.ch.text });
    if (out.length >= limit) break;
  }
  return out;
}

function sourcePaths(hits) {
  const seen = [];
  for (const h of hits) {
    if (!seen.includes(h.rel)) seen.push(h.rel);
  }
  return seen;
}

module.exports = { retrieve, sourcePaths, tokenize };
