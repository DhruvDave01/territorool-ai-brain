/**
 * F16 Report company/contact: validation-only contract. reportCompany/reportContact delegate to
 * CompanylController, which returns status 0 "Please pass required data." for a missing target BEFORE any
 * report is submitted (V2/CompanyController.php:3230; ContactSellController reportContact). So an empty body
 * exercises the contract without creating a report. Nothing is submitted.
 */
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

const guard = (id, ep, role) => ({
  id, title: `${ep} with no target is refused before any report is created`, type: 'validation', role, refs: ['S2.4'],
  pre: `${role} account`, steps: `1. POST \`${ep}\` with an empty body`,
  expected: 'HTTP 422 with `errors` naming the required fields (company_id, reason / contact_ids); `status` 0; no report submitted',
  async run(t, { account }) {
    const r = await call(ep, { body: {}, token: await token(account) });
    t.is(r.httpStatus, 422, 'HTTP 422 validation (no report created)');
    t.ok(r.json && [0, '0'].includes(r.json.status), '`status` is 0');
    t.ok(r.json && r.json.errors && r.json.errors.company_id, 'errors name the missing company_id');
  },
});

module.exports = {
  flow: 'F16', slug: 'report-validation', title: 'Report company/contact (validation-only contract)', priority: 'P2',
  source: '`V2/CompanyController.php:3230` `reportCompany`, `V2/ContactSellController.php` `reportContact` (shared with `CompanylController`)',
  cases: [guard('TC-F16-001', 'reportcompany', 'Sales Agent'), guard('TC-F16-002', 'reportcontact', 'Sales Agent')],
};
