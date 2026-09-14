const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const STOP = new Set([
  "a", "an", "the", "and", "or", "to", "of", "in", "for", "on", "is", "it",
  "how", "what", "does", "do", "we", "can", "this", "that", "with", "from",
]);
const SYSTEM = `You answer questions about TerriTool using the attached AI_BRAIN notes.
Code wins over notes. Do not invent MCP tools, FormData keys, or credit costs.
If notes are missing, say so. Prefer the cited note path. Keep answers short.
Never print API keys or secret values.`;

function tokenize(text) {
  return new Set(
    (String(text).toLowerCase().match(/[a-z0-9]{3,}/g) || []).filter((t) => !STOP.has(t))
  );
}

function walkMarkdown(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".") || name === "api" || name === "node_modules") continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkMarkdown(full, out);
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

function retrieve(question, selected, limit = 6) {
  const terms = tokenize(question);
  if (selected) {
    for (const t of tokenize(path.basename(selected, ".md").replace(/-/g, " "))) terms.add(t);
  }
  const scored = [];
  for (const file of walkMarkdown(ROOT)) {
    const rel = path.relative(ROOT, file).split(path.sep).join("/");
    let body;
    try {
      body = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const blob = `${rel} ${body}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      score += blob.split(t).length - 1;
    }
    if (selected && rel === selected) score += 80;
    if (score) scored.push({ score, rel, body });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((item) => ({
    rel: item.rel,
    body: item.body.slice(0, 4500),
  }));
}

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST a JSON message." });
    return;
  }
  const key = (process.env.ANTHROPIC_API_KEY || "").trim();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
  const version = process.env.ANTHROPIC_VERSION || "2023-06-01";
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const message = String(body.message || "").trim();
  if (!message) {
    res.status(400).json({ error: "Type a question first." });
    return;
  }
  if (!key) {
    res.status(200).json({
      reply: "Set ANTHROPIC_API_KEY in the Vercel project environment, then redeploy or wait a minute.",
    });
    return;
  }
  const selected = String(body.selected || "").trim() || null;
  const history = Array.isArray(body.history) ? body.history : [];
  const notes = retrieve(message, selected);
  const packed = notes.map((n) => `### ${n.rel}\n${n.body}`).join("\n\n") || "(no matching notes)";
  const focus = selected ? `Selected graph node: ${selected}\n\n` : "";
  const messages = [];
  for (const item of history.slice(-8)) {
    const role = item && item.role;
    const text = String((item && item.content) || "").trim();
    if ((role === "user" || role === "assistant") && text) {
      messages.push({ role, content: text });
    }
  }
  messages.push({
    role: "user",
    content: `${focus}Question:\n${message}\n\nNotes:\n${packed}`,
  });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": version,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      system: SYSTEM,
      messages,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = typeof data.error === "object" ? JSON.stringify(data.error) : String(data.error || data);
    res.status(200).json({
      reply: `Anthropic returned ${response.status}. Check ANTHROPIC_MODEL. ${String(detail).slice(0, 400)}`,
    });
    return;
  }
  const reply = (data.content || [])
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("") || "(empty reply)";
  res.status(200).json({ reply });
};
