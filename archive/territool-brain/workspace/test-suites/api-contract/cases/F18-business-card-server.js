/**
 * F18 Scan business card — server side of the flow (2026-09-17). The card is read on the device; the app then
 * reads status details and calls addcompany / addcontact (repos/mobile App/utils/addCompanyFromBusinessCard.js,
 * addContactFromBusinessCard.js). Read-only here: addcompany is sent only an empty body, which its validator
 * refuses before any insert (V2/CompanyController.php:233-250).
 */
const C = require('../lib/common-cases.js');
const { call } = require('../lib/env.js');
const { token } = require('../lib/session.js');

module.exports = {
  flow: 'F18', slug: 'business-card-server', title: 'Scan business card (server side; nothing created)', priority: 'P2',
  source: '`V2/RouteController.php:563` `getuserstatusdetails`; `V2/CompanyController.php:233` `add`',
  cases: [
    {
      id: 'TC-F18-001', title: 'Status details the card flow reads are returned', type: 'happy', role: 'Sales Agent', refs: ['S2.4'],
      pre: 'Sales Agent', steps: '1. GET `getuserstatusdetails`',
      expected: 'HTTP 200; `status` 1; `data` present (the card flow picks the default status from it)',
      async run(t, { account }) {
        const r = await call('getuserstatusdetails', { method: 'GET', token: await token(account), timeout: 60000 });
        t.is(r.httpStatus, 200, 'HTTP 200');
        t.is(r.json && Number(r.json.status), 1, '`status` 1');
        t.ok(r.json && r.json.data !== undefined, '`data` present');
      },
    },
    C.validation('TC-F18-002', 'addcompany', 'Sales Agent', {}, 'a card company with no fields (refused before any insert, V2/CompanyController.php:235-250)'),
    C.negative('TC-F18-003', 'addcompany', { body: {} }),
  ],
};
