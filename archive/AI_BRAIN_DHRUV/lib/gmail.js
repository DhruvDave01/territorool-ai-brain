const crypto = require("crypto");

const ACCOUNTS = {
  picwa: {
    email: "dhruv@picwa.co.nz",
    label: "Picwa",
    query: 'subject:"Agenda Email"',
    max: 20,
  },
  territorool: {
    email: "dhruv@territool.com",
    label: "TerriTool",
    query: "in:inbox",
    max: 25,
  },
};

const COOKIE = {
  picwa: "tt_gmail_picwa",
  territorool: "tt_gmail_territool",
  state: "tt_gmail_state",
};

function publicOrigin(req) {
  const explicit = (process.env.BRAIN_PUBLIC_URL || "").trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const prod = (process.env.VERCEL_PROJECT_PRODUCTION_URL || "").trim();
  if (prod) return "https://" + prod.replace(/^https?:\/\//, "");
  const host = req.headers.host || "tt-gmail-allow.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  return proto + "://" + host;
}

function redirectUri(req) {
  return publicOrigin(req) + "/api/gmail/callback";
}

function secretKey() {
  const secret = (process.env.GMAIL_TOKEN_SECRET || process.env.GRAPH_CHAT_SECRET || "").trim();
  if (!secret) return null;
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(obj) {
  const key = secretKey();
  if (!key) throw new Error("GMAIL_TOKEN_SECRET is missing.");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const bin = Buffer.concat([cipher.update(JSON.stringify(obj), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, bin]).toString("base64url");
}

function decrypt(token) {
  const key = secretKey();
  if (!key || !token) return null;
  try {
    const buf = Buffer.from(String(token), "base64url");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const bin = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(bin), decipher.final()]).toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const header = String(req.headers.cookie || "");
  const out = {};
  header.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  });
  return out;
}

function cookieHeader(name, value, maxAge) {
  const parts = [
    name + "=" + encodeURIComponent(value),
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=" + String(maxAge),
  ];
  return parts.join("; ");
}

function googleConfigured() {
  return Boolean((process.env.GOOGLE_CLIENT_ID || "").trim() && (process.env.GOOGLE_CLIENT_SECRET || "").trim() && secretKey());
}

function authUrl(req, account, state) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID.trim(),
    redirect_uri: redirectUri(req),
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "false",
    login_hint: ACCOUNTS[account].email,
    state,
  });
  return "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
}

async function exchangeCode(req, code) {
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID.trim(),
    client_secret: process.env.GOOGLE_CLIENT_SECRET.trim(),
    redirect_uri: redirectUri(req),
    grant_type: "authorization_code",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || "token exchange failed");
  return data;
}

async function refreshAccess(refreshToken) {
  const envToken = refreshToken;
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID.trim(),
    client_secret: process.env.GOOGLE_CLIENT_SECRET.trim(),
    refresh_token: envToken,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || "refresh failed");
  return data.access_token;
}

async function gmailGet(accessToken, path, query) {
  const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me" + path);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((item) => url.searchParams.append(k, item));
      else url.searchParams.set(k, v);
    });
  }
  const response = await fetch(url, { headers: { authorization: "Bearer " + accessToken } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error && data.error.message ? data.error.message : "gmail error");
  return data;
}

function headerValue(payload, name) {
  const headers = (payload && payload.headers) || [];
  const hit = headers.find((h) => String(h.name).toLowerCase() === name.toLowerCase());
  return hit ? hit.value : "";
}

function envRefresh(account) {
  if (account === "picwa") return (process.env.GMAIL_REFRESH_PICWA || "").trim();
  if (account === "territool") return (process.env.GMAIL_REFRESH_TERRITOOL || "").trim();
  return "";
}

function sessionFor(req, account) {
  const cookies = parseCookies(req);
  const fromCookie = decrypt(cookies[COOKIE[account]]);
  if (fromCookie && fromCookie.refresh_token) return fromCookie;
  const refresh = envRefresh(account);
  if (refresh) return { refresh_token: refresh, email: ACCOUNTS[account].email, source: "env" };
  return null;
}

function canReadMail(req) {
  const secret = (process.env.GMAIL_READ_SECRET || process.env.GRAPH_CHAT_SECRET || "").trim();
  if (secret) {
    const header = String(req.headers["x-brain-secret"] || "").trim();
    const auth = String(req.headers.authorization || "").trim();
    const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
    if (header === secret || bearer === secret) return true;
  }
  const cookies = parseCookies(req);
  return Boolean(decrypt(cookies[COOKIE.picwa]) || decrypt(cookies[COOKIE.territool]));
}

async function fetchAccountMail(req, account) {
  const spec = ACCOUNTS[account];
  const session = sessionFor(req, account);
  if (!session) return { account, email: spec.email, connected: false, messages: [] };
  const access = await refreshAccess(session.refresh_token);
  const profile = await gmailGet(access, "/profile");
  const email = String(profile.emailAddress || "").toLowerCase();
  if (email !== spec.email.toLowerCase()) {
    return { account, email: spec.email, connected: false, wrong_account: email, messages: [] };
  }
  const listed = await gmailGet(access, "/messages", { q: spec.query, maxResults: String(spec.max) });
  const ids = (listed.messages || []).map((m) => m.id);
  const messages = [];
  for (const id of ids) {
    const msg = await gmailGet(access, "/messages/" + id, { format: "metadata", metadataHeaders: ["Subject", "From", "Date"] });
    messages.push({
      id,
      subject: headerValue(msg.payload, "Subject") || "(no subject)",
      from: headerValue(msg.payload, "From"),
      date: headerValue(msg.payload, "Date"),
      snippet: String(msg.snippet || "").replace(/\s+/g, " ").trim(),
    });
  }
  return { account, email: spec.email, connected: true, resultSizeEstimate: listed.resultSizeEstimate || messages.length, messages };
}

function wantsMail(message) {
  return /\b(email|gmail|inbox|agenda|mailbox|mail)\b/i.test(String(message || ""));
}

async function mailNotes(req, message) {
  if (!googleConfigured() || !wantsMail(message) || !canReadMail(req)) return [];
  const jobs = [];
  if (sessionFor(req, "picwa")) jobs.push(fetchAccountMail(req, "picwa"));
  if (sessionFor(req, "territool")) jobs.push(fetchAccountMail(req, "territool"));
  if (!jobs.length) return [];
  const results = await Promise.all(jobs.map((p) => p.catch((err) => ({ error: String(err.message || err), messages: [] }))));
  return results.map((block) => {
    const title = block.account === "picwa" ? "gmail-picwa-agenda.md" : "gmail-territool-inbox.md";
    if (block.error) return { rel: title, body: "Gmail error: " + block.error };
    if (block.wrong_account) return { rel: title, body: "Signed into " + block.wrong_account + " but this slot needs " + block.email + "." };
    if (!block.connected) return { rel: title, body: block.email + " is not connected. Open /gmail.html and click Allow." };
    const lines = [
      "Mailbox: " + block.email,
      block.account === "picwa" ? 'Filter: subject "Agenda Email".' : "Filter: recent inbox (not the full archive).",
      "Count shown: " + block.messages.length + (block.resultSizeEstimate ? " (Gmail estimate " + block.resultSizeEstimate + ")" : ""),
      "",
    ];
    if (!block.messages.length) lines.push("No matching messages.");
    block.messages.forEach((m, i) => {
      lines.push((i + 1) + ". " + m.date);
      lines.push("   From: " + m.from);
      lines.push("   Subject: " + m.subject);
      if (m.snippet) lines.push("   " + m.snippet);
    });
    return { rel: title, body: lines.join("\n") };
  });
}

function connectionStatus(req) {
  return {
    google_configured: googleConfigured(),
    redirect_uri: googleConfigured() ? redirectUri(req) : publicOrigin(req) + "/api/gmail/callback",
    accounts: Object.fromEntries(
      Object.keys(ACCOUNTS).map((id) => {
        const session = sessionFor(req, id);
        return [id, { email: ACCOUNTS[id].email, connected: Boolean(session) }];
      })
    ),
  };
}

module.exports = {
  ACCOUNTS,
  COOKIE,
  authUrl,
  canReadMail,
  connectionStatus,
  cookieHeader,
  decrypt,
  encrypt,
  exchangeCode,
  fetchAccountMail,
  googleConfigured,
  mailNotes,
  parseCookies,
  publicOrigin,
  redirectUri,
  secretKey,
  sessionFor,
  wantsMail,
};
