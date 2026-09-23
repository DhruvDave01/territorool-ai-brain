/**
 * F06 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F06',
  slug: 'ai-leads-extended',
  title: 'AI Find Leads (extended read contract)',
  priority: 'P1',
  source: 'getAiLeadData (GET); factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F06-004', 'getAiLeadData', { method: 'GET' }),
    C.security('TC-F06-005', 'getAiLeadData', 'Sales Agent', { method: 'GET' }),
    C.permission('TC-F06-006', 'getAiLeadData', { method: 'GET' }),
  ],
};
