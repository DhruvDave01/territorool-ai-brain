const crypto = require("crypto");
const gmail = require("../../lib/gmail");

module.exports = function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  const account = String(req.query.account || "").trim();
  if (!gmail.ACCOUNTS[account]) {
    res.redirect(302, "/gmail.html?error=unknown-account");
    return;
  }
  if (!gmail.googleConfigured()) {
    res.redirect(302, "/gmail.html?error=missing-google");
    return;
  }
  const nonce = crypto.randomBytes(16).toString("hex");
  const state = account + "." + nonce;
  res.setHeader("set-cookie", gmail.cookieHeader(gmail.COOKIE.state, gmail.encrypt({ state, account }), 600));
  res.redirect(302, gmail.authUrl(req, account, state));
};
