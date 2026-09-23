/**
 * F29 Customer MCP connectors — auth gate on STAGING (2026-09-17). GET only; never the production host.
 */
const gate = (id, pathName, what) => ({
  id, title: `${pathName} refuses an anonymous request (${what})`, type: 'negative', role: 'Public', refs: ['S0.1', 'S3.8'],
  pre: 'none', steps: `1. GET \`${pathName}\` on staging without credentials`,
  expected: 'HTTP 401 with an OAuth error body; no tools, no data, no stack trace',
  async run(t, { session }) {
    const r = await (await session()).get(pathName);
    t.is(r.status, 401, 'HTTP 401');
    t.ok(r.json && r.json.error, 'an OAuth error body');
    t.ok(!(r.json && (r.json.result || r.json.tools)), 'no tools or results');
    t.ok(!/Stack trace|vendor\/laravel/.test(r.text), 'no stack trace');
  },
});
module.exports = {
  flow: 'F29', slug: 'customer-mcp-gate', title: 'Customer MCP connectors (auth gate, staging)', priority: 'P2',
  source: '`app/UserMcp`, `app/FindMcp` (staging endpoints only)',
  cases: [gate('TC-F29-001', '/ai/mcp', 'TerriTool App MCP'), gate('TC-F29-002', '/find-mcp/mcp', 'TerriTool Find MCP')],
};
