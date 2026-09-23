/**
 * F16 — extended contract (2026-09-17): a missing token is refused by the JWT middleware before the
 * controller runs, so no report can be created. Staging only.
 */
const C = require('../lib/common-cases.js');

module.exports = {
  flow: 'F16',
  slug: 'report-extended',
  title: 'Report company/contact (extended, nothing is submitted)',
  priority: 'P2',
  source: '`routes/api.php` jwt.refresh group; `app/Http/Middleware/authJWT.php:36-39`',
  cases: [
    C.negative('TC-F16-003', 'reportcompany', { body: {} }),
    C.negative('TC-F16-004', 'reportcontact', { body: {} }),
  ],
};
