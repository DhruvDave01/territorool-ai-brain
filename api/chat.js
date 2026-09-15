const { retrieve, sourcePaths } = require("../lib/retrieve");

const SYSTEM = `You answer questions about TerriTool using the attached AI_BRAIN notes.
Code wins over notes. Do not invent MCP tools, FormData keys, or credit costs.
If notes are missing, say so. Prefer the cited note path. Keep answers short.
Never print API keys or secret values.`;

const RATE_WINDOW = 600 * 1000;
const RATE_MAX = 20;
const hits = new Map();

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "unknown";
}

function rateOk(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function providedSecret(req, body) {
  const header = String(req.headers["x-brain-secret"] || "").trim();
  if (header) return header;
  const auth = String(req.headers.authorization || "").trim();
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return String((body && body.secret) || "").trim();
}

function packNotes(notes) {
  return notes.map((n) => `### ${n.rel}\n${n.body}`).join("\n\n") || "(no matching notes)";
}

function buildMessages(message, history, selected, notes) {
  const focus = selected ? `Selected graph node: ${selected}\n\n` : "";
  const messages = [];
  for (const item of (history || []).slice(-8)) {
    const role = item && item.role;
    const text = String((item && item.content) || "").trim();
    if ((role === "user" || role === "assistant") && text) {
      messages.push({ role, content: text });
    }
  }
  messages.push({
    role: "user",
    content: `${focus}Question:\n${message}\n\nNotes:\n${packNotes(notes)}`,
  });
  return messages;
}

function sendSse(res, obj) {
  res.write(`data: ${JSON.stringify(obj)}\n\n`);
}

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method === "OPTIONS") {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-headers", "content-type, x-brain-secret, authorization");
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST a JSON message." });
    return;
  }
  const secret = (process.env.GRAPH_CHAT_SECRET || "").trim();
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (secret && providedSecret(req, body) !== secret) {
    res.status(401).json({ error: "Ask is locked. Set the shared secret." });
    return;
  }
  if (!rateOk(clientIp(req))) {
    res.status(429).json({ error: "Too many questions. Wait a few minutes." });
    return;
  }
  const key = (process.env.ANTHROPIC_API_KEY || "").trim();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
  const version = process.env.ANTHROPIC_VERSION || "2023-06-01";
  const message = String(body.message || "").trim();
  if (!message) {
    res.status(400).json({ error: "Type a question first." });
    return;
  }
  const selected = String(body.selected || "").trim() || null;
  const history = Array.isArray(body.history) ? body.history : [];
  const notes = retrieve(message, selected, 6, process.cwd());
  const sources = sourcePaths(notes);
  if (!key) {
    res.status(200).json({
      reply: "Set ANTHROPIC_API_KEY in the Vercel project environment, then redeploy or wait a minute.",
      sources,
    });
    return;
  }
  const payload = {
    model,
    max_tokens: 1200,
    system: SYSTEM,
    messages: buildMessages(message, history, selected, notes),
  };
  if (body.stream) {
    payload.stream = true;
    res.setHeader("content-type", "text/event-stream; charset=utf-8");
    res.setHeader("x-accel-buffering", "no");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": version,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const detail = typeof data.error === "object" ? JSON.stringify(data.error) : String(data.error || data);
      sendSse(res, { type: "error", data: `Anthropic returned ${response.status}. ${String(detail).slice(0, 400)}` });
      sendSse(res, { type: "done", data: sources });
      res.end();
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        const raw = line.trim();
        if (!raw.startsWith("data:")) continue;
        const dataS = raw.slice(5).trim();
        if (dataS === "[DONE]") continue;
        let data;
        try {
          data = JSON.parse(dataS);
        } catch {
          continue;
        }
        const text = data.delta && data.delta.text;
        if (text) sendSse(res, { type: "delta", data: text });
        if (data.type === "error") sendSse(res, { type: "error", data: dataS.slice(0, 400) });
      }
    }
    sendSse(res, { type: "done", data: sources });
    res.end();
    return;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": version,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = typeof data.error === "object" ? JSON.stringify(data.error) : String(data.error || data);
    res.status(200).json({
      reply: `Anthropic returned ${response.status}. Check ANTHROPIC_MODEL. ${String(detail).slice(0, 400)}`,
      sources,
    });
    return;
  }
  const reply = (data.content || [])
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("") || "(empty reply)";
  res.status(200).json({ reply, sources });
};
