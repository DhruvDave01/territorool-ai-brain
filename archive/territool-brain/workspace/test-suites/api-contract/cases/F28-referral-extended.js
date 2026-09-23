/**
 * F28 — extended read-only contract (2026-09-17): negative / security / permission / validation / edge-data cases
 * built from lib/common-cases.js on endpoints already scanned read-only by this feature's base suite.
 * Nothing is written, spent or sent. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F28',
  slug: 'referral-extended',
  title: 'Referral invites (extended, nothing is sent)',
  priority: 'P3',
  source: 'invite-user (POST) — refused before any send; factories in `workspace/test-suites/api-contract/lib/common-cases.js`',
  cases: [
    C.negative('TC-F28-003', 'invite-user', { body: {} }),
  ],
};
