/**
 * F30 Admin MCP — auth gate on STAGING (2026-09-17). GET only; never the production host.
 */
module.exports = {
  flow: 'F30', slug: 'admin-mcp-gate', title: 'Admin MCP (auth gate, staging)', priority: 'P3',
  source: '`app/AdminMcp` (staging endpoint only)',
  cases: [{
    id: 'TC-F30-001', title: '/ai/mcp-admin refuses an anonymous request', type: 'negative', role: 'Public', refs: ['S0.1', 'S3.8'],
    pre: 'none', steps: '1. GET `/ai/mcp-admin` on staging without credentials',
    expected: 'HTTP 401 with an error body; no tools, no data, no stack trace',
    async run(t, { session }) {
      const r = await (await session()).get('/ai/mcp-admin');
      t.is(r.status, 401, 'HTTP 401');
      t.ok(r.json && r.json.error, 'an error body');
      t.ok(!(r.json && (r.json.result || r.json.tools)), 'no tools or results');
      t.ok(!/Stack trace|vendor\/laravel/.test(r.text), 'no stack trace');
    },
  }],
};
