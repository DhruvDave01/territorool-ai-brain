const gmail = require("../../lib/gmail");

function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<style>body{margin:0;background:#1a1a1a;color:#ececec;font:15px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;padding:48px 24px}a{color:#5eead4}main{max-width:560px;margin:auto}</style></head><body><main>${body}</main></body></html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "text/html; charset=utf-8");
  const error = String(req.query.error || "");
  if (error) {
    res.status(400).end(page("Gmail", `<h1>Google cancelled</h1><p>${error}</p><p><a href="/gmail.html">Back</a></p>`));
    return;
  }
  const code = String(req.query.code || "");
  const state = String(req.query.state || "");
  const cookies = gmail.parseCookies(req);
  const expected = gmail.decrypt(cookies[gmail.COOKIE.state]);
  if (!code || !expected || expected.state !== state) {
    res.status(400).end(page("Gmail", `<h1>Invalid Gmail return</h1><p>Start again from the Allow page.</p><p><a href="/gmail.html">Back</a></p>`));
    return;
  }
  const account = expected.account;
  const spec = gmail.ACCOUNTS[account];
  if (!spec) {
    res.status(400).end(page("Gmail", `<h1>Unknown account</h1><p><a href="/gmail.html">Back</a></p>`));
    return;
  }
  try {
    const tokens = await gmail.exchangeCode(req, code);
    if (!tokens.refresh_token) {
      res.status(400).end(page("Gmail", `<h1>Google did not return a refresh token</h1><p>Click Allow again and make sure you see the consent screen.</p><p><a href="/api/gmail/start?account=${account}">Allow ${spec.email}</a></p>`));
      return;
    }
    const packed = gmail.encrypt({
      refresh_token: tokens.refresh_token,
      email: spec.email,
      connected_at: new Date().toISOString(),
    });
    res.setHeader("set-cookie", [
      gmail.cookieHeader(gmail.COOKIE[account], packed, 60 * 60 * 24 * 180),
      gmail.cookieHeader(gmail.COOKIE.state, "", 0),
    ]);
    res.status(200).end(page("Gmail connected", `<h1>Connected ${spec.email}</h1><p>You only Allow this account once in this browser. Next: <a href="/gmail.html">connect the other mailbox</a> or <a href="/graph.html">ask the brain</a> about Agenda Email / inbox.</p>`));
  } catch (err) {
    res.status(400).end(page("Gmail", `<h1>Connect failed</h1><p>Google rejected the Allow. Check the Client ID, secret, and redirect URI.</p><p><a href="/gmail.html">Back</a></p>`));
  }
};
