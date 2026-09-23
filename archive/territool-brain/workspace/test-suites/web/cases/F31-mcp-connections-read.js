/**
 * F31 MCP client connections — the JSON the settings screen loads (2026-09-17). GET only;
 * `SalespersonMcpController@index` reads connections and returns JSON (no writes, lines 22-34).
 */
const SECRET = /"(access_token|refresh_token|token|client_secret|secret|api_key|password)"\s*:\s*"[^"]{6,}"/i;

module.exports = {
  flow: 'F31', slug: 'mcp-connections-read', title: 'MCP connections (read contract)', priority: 'P2',
  source: '`app/McpClient/Http/Controllers/SalespersonMcpController.php:22-34` `index`',
  cases: [
    {
      id: 'TC-F31-004', title: 'A Sales Agent reads its MCP connections', type: 'happy', role: 'Sales Agent', refs: ['S2.4'],
      pre: 'Sales Agent', steps: '1. sign in\n2. GET `/salesperson/mcp/connections`',
      expected: 'HTTP 200 JSON `{ok: true, connections: [...]}`; each connection has id, name, url, status, tools',
      async run(t, { session }) {
        const r = await (await session()).get('/salesperson/mcp/connections');
        t.is(r.status, 200, 'HTTP 200');
        t.ok(r.json && r.json.ok === true && Array.isArray(r.json.connections), '`ok` true and a `connections` array');
        const c = r.json && r.json.connections && r.json.connections[0];
        t.ok(!c || (c.id !== undefined && typeof c.name === 'string' && Array.isArray(c.tools)), 'a connection has id, name and tools');
      },
    },
    {
      id: 'TC-F31-005', title: 'Connection payload exposes has_token, never a token or secret value', type: 'security', role: 'Sales Agent', refs: ['S0.4', 'QG-12'],
      pre: 'Sales Agent with a connector', steps: '1. GET `/salesperson/mcp/connections`\n2. scan the raw body for token / secret values',
      expected: 'no token, secret or password value in the body; token presence is a boolean `has_token`',
      async run(t, { session }) {
        const r = await (await session()).get('/salesperson/mcp/connections');
        t.is(r.status, 200, 'HTTP 200');
        t.ok(!SECRET.test(r.text), 'no token or secret value');
        const c = r.json && r.json.connections && r.json.connections[0];
        t.ok(!c || typeof c.has_token === 'boolean', '`has_token` is a boolean');
      },
    },
  ],
};
