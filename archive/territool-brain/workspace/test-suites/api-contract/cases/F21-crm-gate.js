/**
 * F21 CRM sync — auth gate only (2026-09-17). HubSpot endpoints have external side effects, so the suite never
 * sends an authenticated request; a missing token is refused by the JWT middleware first.
 */
const C = require('../lib/common-cases.js');
module.exports = {
  flow: 'F21', slug: 'crm-gate', title: 'CRM sync (auth gate; HubSpot never called)', priority: 'P2',
  source: '`routes/api.php`; `HubSpotController.php:1821` `hubspot-last-sync`',
  cases: [C.negative('TC-F21-001', 'hubspot-last-sync', { method: 'GET' })],
};
