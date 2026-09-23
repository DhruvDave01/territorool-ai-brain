const gmail = require("../../lib/gmail");

module.exports = function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "application/json");
  res.status(200).json(gmail.connectionStatus(req));
};
