/**
 * F31 MCP client connections — auth gate (2026-09-17). GET only.
 */
module.exports = {
  flow: 'F31', slug: 'mcp-client-gate', title: 'MCP client connections (auth gate)', priority: 'P2',
  source: '`app/McpClient/routes/web.php:8-9` (auth + role group)',
  cases: [{
    id: 'TC-F31-001', title: 'An anonymous request cannot open the MCP connections page', type: 'negative', role: 'Public', refs: ['S3.8'],
    pre: 'none', steps: '1. GET `/salesperson/mcp/connections` without a session',
    expected: 'a redirect to /login (or 401); no connection data',
    async run(t, { session }) {
      const r = await (await session()).get('/salesperson/mcp/connections');
      t.ok([301, 302, 401].includes(r.status), `turned away (HTTP ${r.status})`);
      t.ok(!(r.json && (r.json.connections || r.json.data)), 'no connection data');
    },
  }],
};
