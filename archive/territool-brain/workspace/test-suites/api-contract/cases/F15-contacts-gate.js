/**
 * F15 Find & buy contacts — auth gate only (2026-09-17). `fetchAllContacts` triggers paid provider lookups, so
 * the suite never sends an authenticated request; a missing token is refused by the JWT middleware first.
 */
const C = require('../lib/common-cases.js');
module.exports = {
  flow: 'F15', slug: 'contacts-gate', title: 'Find contacts (auth gate; provider never called)', priority: 'P0',
  source: '`routes/api.php` jwt.refresh group; `V2/CompanyController.php:3157` `fetchAllContacts`',
  cases: [C.negative('TC-F15-001', 'fetchAllContacts', { body: {} })],
};
