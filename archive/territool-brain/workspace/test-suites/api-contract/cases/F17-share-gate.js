/**
 * F17 Share route/list — auth gate only (2026-09-17). Sharing sends email and copies routes, so the suite never
 * sends an authenticated request; a missing token is refused by the JWT middleware first.
 */
const C = require('../lib/common-cases.js');
module.exports = {
  flow: 'F17', slug: 'share-gate', title: 'Share route/list (auth gate; nothing sent)', priority: 'P2',
  source: '`routes/api.php` jwt.refresh group; `V2/RouteController.php:4318` `shareRouteList`',
  cases: [C.negative('TC-F17-001', 'shareRouteList', { body: {} })],
};
