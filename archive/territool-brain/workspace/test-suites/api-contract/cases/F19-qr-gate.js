/**
 * F19 QR route import — auth gate + validation (2026-09-17). `scanQRCode` validates `route_id` before any lookup
 * or copy (V2/AuthController.php:879-887), so an empty body is refused with nothing read or written.
 */
const C = require('../lib/common-cases.js');
module.exports = {
  flow: 'F19', slug: 'qr-gate', title: 'QR route import (auth gate and validation; no route copied)', priority: 'P2',
  source: '`V2/AuthController.php:876-887` `scanQRCode`',
  cases: [
    C.negative('TC-F19-001', 'scan-qr-code', { body: {} }),
    C.validation('TC-F19-002', 'scan-qr-code', 'Sales Agent', {}, 'a scan with no route_id (refused before any lookup)'),
  ],
};
