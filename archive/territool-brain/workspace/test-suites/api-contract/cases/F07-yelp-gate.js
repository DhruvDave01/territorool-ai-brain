/**
 * F07 Places / Yelp leads — auth gate only (2026-09-17). `getYelpLeads` calls a paid provider, so the suite
 * never sends an authenticated request; a missing token is refused by the JWT middleware first.
 */
const C = require('../lib/common-cases.js');
module.exports = {
  flow: 'F07', slug: 'yelp-gate', title: 'Places / Yelp leads (auth gate; provider never called)', priority: 'P2',
  source: '`routes/api.php` jwt.refresh group; `V2/CompanyController.php:3127` `getYelpLeads`',
  cases: [C.negative('TC-F07-001', 'getYelpLeads', { body: {} })],
};
