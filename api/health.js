module.exports = function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  res.status(200).json({
    ok: true,
    has_key: Boolean(process.env.ANTHROPIC_API_KEY),
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
    auth_required: Boolean((process.env.GRAPH_CHAT_SECRET || "").trim()),
  });
};
